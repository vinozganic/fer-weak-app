import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5436,
    username: 'user',
    password: '1234',
    database: 'weak-database',
    synchronize: true,
    logging: false,
    entities: ['src/entities/**/*.ts', 'dist/entities/**/*.js'],
});
