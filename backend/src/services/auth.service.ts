import { QueryFailedError } from "typeorm";
import { hashSecret, verifySecret } from "../utils/hash";
import { HttpError } from "../utils/HttpError";
import { AppDataSource } from "../config/dataSource";
import { User } from "../models/User";

const userRepository = AppDataSource.getRepository(User)

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/


const DUMMY_HASH = "$2b$10$HfvPsovvL4RsHUFl1U3CfeqXweU6.fXeyQPOtcsRn4G6lZhIhAbDG"

export const toPublicUser = (user: User) => ({
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    citizenship: user.citizenship,
    hasPasscode: user.passcode_hash !== null,
})

export const register = async ({ fullName, email, password }: { fullName: unknown; email: unknown; password: unknown }) => {
    const fields: Record<string, string> = {}
    const name = typeof fullName === "string" ? fullName.trim() : ""
    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : ""

    if (name.length < 2 || name.length > 100) {
        fields.fullName = "Enter your full name"
    }
    if (!EMAIL_PATTERN.test(cleanEmail) || cleanEmail.length > 254) {
        fields.email = "Enter a valid email address"
    }
    if (typeof password !== "string" || password.length < 8) {
        fields.password = "Use at least 8 characters"
    } else if (Buffer.byteLength(password) > 72) {
        fields.password = "Password is too long"
    }
    if (Object.keys(fields).length > 0) {
        throw new HttpError(400, "Validation failed", fields)
    }

    const user = userRepository.create({
        full_name: name,
        email: cleanEmail,
        password_hash: await hashSecret(password as string),
    })
    try {
        await userRepository.save(user)
    } catch (err) {
        // 23505 = unique violation on email. Also covers two sign-ups at the same moment.
        if (err instanceof QueryFailedError && (err.driverError as { code?: string }).code === "23505") {
            throw new HttpError(409, "An account with this email already exists")
        }
        throw err
    }

    return toPublicUser(user)
}

export const login = async ({ email, password }: { email: unknown; password: unknown }) => {
    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : ""
    const pwd = typeof password === "string" && Buffer.byteLength(password) <= 72 ? password : ""

    const user = cleanEmail ? await userRepository.findOne({ where: { email: cleanEmail } }) : null
    const correct = await verifySecret(pwd, user?.password_hash ?? DUMMY_HASH)

    if (!user || !correct) {
        throw new HttpError(401, "Email or password is incorrect")
    }
    return toPublicUser(user)
}
