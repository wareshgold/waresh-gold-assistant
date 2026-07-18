export interface AppEnv {
  ENVIRONMENT: string;
}

export function getEnv(env: AppEnv) {
  return {
    environment: env.ENVIRONMENT ?? "development",
  };
}