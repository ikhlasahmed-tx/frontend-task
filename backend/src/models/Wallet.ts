import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, type Relation } from "typeorm"
import { User } from "./User"

@Entity("wallets")
export class Wallet {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({
        type: "uuid",
        unique: true
    })
    user_id!: string

    @OneToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id", foreignKeyConstraintName: "fk_wallets_user_id" })
    user!: Relation<User>

    @Column({
        type: "varchar",
        length: 50,
        default: "My Wallet"
    })
    name!: string

    @Column({
        type: "varchar",
        length: 44,
        unique: true
    })
    address!: string
}
