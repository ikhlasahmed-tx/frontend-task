import { hash, compare } from 'bcrypt'

export const hashSecret = async (secret: string) => {
    return await hash(secret, 10)
}

export const verifySecret = async (secret: string, hashed: string) => {
    return await compare(secret, hashed)
}