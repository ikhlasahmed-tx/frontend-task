import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, type Relation } from "typeorm"
import { User } from "./User"

@Entity("refresh_tokens")
export class RefreshToken {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Index()
    @Column({
        type: "uuid"
    })
    user_id!: string

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id", foreignKeyConstraintName: "fk_refresh_tokens_user_id" })
    user!: Relation<User>

    @Column({
        type: "char",
        length: 60
    })
    token_hash!: string

    @Column({
        type: "timestamptz"
    })
    expires_at!: Date
}
