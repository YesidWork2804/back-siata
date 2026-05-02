import { EnvironmentVariables } from './environment-variables';

export function validateEnvironment(config: Record<string, unknown>): EnvironmentVariables {
  const validatedConfig: EnvironmentVariables = {
    DB_HOST: getRequiredString(config, 'DB_HOST'),
    DB_PORT: getRequiredPort(config, 'DB_PORT'),
    DB_NAME: getRequiredString(config, 'DB_NAME'),
    DB_USER: getRequiredString(config, 'DB_USER'),
    DB_PASSWORD: getRequiredString(config, 'DB_PASSWORD'),
    JWT_SECRET: getRequiredString(config, 'JWT_SECRET'),
    PORT: getRequiredPort(config, 'PORT'),
  };

  return validatedConfig;
}

function getRequiredString(config: Record<string, unknown>, key: string): string {
  const value = config[key];

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Environment variable ${key} is required`);
  }

  return value;
}

function getRequiredPort(config: Record<string, unknown>, key: string): number {
  const value = Number(config[key]);

  if (!Number.isInteger(value) || value < 1 || value > 65535) {
    throw new Error(`Environment variable ${key} must be a valid port number`);
  }

  return value;
}
