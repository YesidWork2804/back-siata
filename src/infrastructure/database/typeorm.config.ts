import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EnvironmentVariables } from '../config/environment-variables';

export function createTypeOrmOptions(
  configService: ConfigService<EnvironmentVariables, true>,
): TypeOrmModuleOptions {
  return {
    type: 'mysql',
    host: configService.get('DB_HOST', { infer: true }),
    port: configService.get('DB_PORT', { infer: true }),
    database: configService.get('DB_NAME', { infer: true }),
    username: configService.get('DB_USER', { infer: true }),
    password: configService.get('DB_PASSWORD', { infer: true }),
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    synchronize: false,
    migrationsRun: false,
  };
}
