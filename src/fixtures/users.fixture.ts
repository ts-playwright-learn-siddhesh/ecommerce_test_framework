function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const users = {
  standardUser: {
    username: requiredEnv('STANDARD_USER_USERNAME'),
    password: requiredEnv('STANDARD_USER_PASSWORD'),
  },
  lockedOutUser: {
    username: requiredEnv('LOCKED_OUT_USER_USERNAME'),
    password: requiredEnv('LOCKED_OUT_USER_PASSWORD'),
  },
  problemUser: {
    username: requiredEnv('PROBLEM_USER_USERNAME'),
    password: requiredEnv('PROBLEM_USER_PASSWORD'),
  },
  performanceGlitchUser: {
    username: requiredEnv('PERFORMANCE_GLITCH_USER_USERNAME'),
    password: requiredEnv('PERFORMANCE_GLITCH_USER_PASSWORD'),
  },
} as const;
