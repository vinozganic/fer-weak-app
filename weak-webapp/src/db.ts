import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    // host: process.env.DATABASE_HOST,
    // port: parseInt(process.env.DATABASE_PORT ?? '5436'),
    // username: process.env.DATABASE_USERNAME,
    // password: process.env.DATABASE_PASSWORD,
    // database: process.env.DATABASE_NAME,
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: false,
    ssl: true,
    extra: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
    entities: [join(__dirname, '**', '*.entity.{ts,js}')],
});
