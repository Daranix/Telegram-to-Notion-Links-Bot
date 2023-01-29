import { BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class User extends BaseEntity {
    
    @PrimaryColumn()
    telegramUserId!: number;

    @Column()
    token!: string;

    @Column({ nullable: true })
    page?: string;

    @Column({ nullable: true})
    database?: string;

    @Column({ default: 1, nullable: false })
    setupstep!: number;
}