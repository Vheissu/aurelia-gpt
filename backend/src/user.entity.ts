import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', nullable: true })
    githubId: number;

    @Column({ type: 'varchar', nullable: true })
    googleId: string;

    @Column({ type: 'timestamp', nullable: true })
    firstQueryTimestamp: Date | null;

    @Column({ default: 0 })
    queryCount: number;
}
