import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column('varchar')
    username: string;

    @Column('varchar', { length: 255 })
    password: string;
}
