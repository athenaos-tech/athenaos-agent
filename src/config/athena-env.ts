/** AthenaOS env — primary ATHENA_* keys with legacy NORAZ_* / OPENCAT* fallbacks. */

export function envFirst(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key];
    if (value !== undefined && value !== '') return value;
  }
  return undefined;
}

export const DEFAULT_PLATFORM_URL = 'https://api.noraz.space';

export function getAthenaApiKey(): string | undefined {
  return envFirst('ATHENA_API_KEY', 'ATHENA_API_KEY', 'OPENCATZ_API_KEY', 'OPENCAT_API_KEY');
}

export function getAthenaDeskKey(): string | undefined {
  return envFirst('ATHENA_DESK_KEY', 'ATHENA_DESK_KEY');
}

export function getAthenaPlatformUrl(): string {
  return (envFirst('ATHENA_PLATFORM_URL', 'ATHENA_PLATFORM_URL') ?? DEFAULT_PLATFORM_URL).replace(/\/$/, '');
}
