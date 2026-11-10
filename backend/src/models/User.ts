import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({
        type: "varchar",
        length: 100
    })
    full_name!: string

    @Column({
        type: "varchar",
        length: 254,
        unique: true
    })
    email!: string

    @Column({
        type: "varchar",
    })
    password_hash!: string

    @Column({
        type: "boolean",
        default: false
    })
    email_verified!: boolean

    @Column({
        type: "varchar",
        nullable: true
    })
    passcode_hash!: string | null

    @Column({
        type: "char",
        length: 2,
        nullable: true
    })
    citizenship!: string | null
}