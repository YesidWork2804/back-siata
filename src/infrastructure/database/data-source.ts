import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { validateEnvironment } from '../config/env.validation';

const env = validateEnvironment(process.env);

export default new DataSource({
  type: 'mysql',
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/infrastructure/database/migrations/*.ts'],
  synchronize: false,
});
