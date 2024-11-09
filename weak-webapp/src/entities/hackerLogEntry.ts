import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('hacker_log_entries')
export class HackerLogEntry {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column('text')
    message: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created: Date;
}
