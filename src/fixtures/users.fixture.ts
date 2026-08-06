function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const saucedemoPassword = requiredEnv('SAUCEDEMO_PASSWORD');
const standardUserUsername = requiredEnv('STANDARD_USER_USERNAME');
const lockedOutUserUsername = 'locked_out_user';
const problemUserUsername = 'problem_user';
const performanceGlitchUserUsername = 'performance_glitch_user';

export const users = {
  standardUser: {
    username: standardUserUsername,
    password: saucedemoPassword,
  },
  lockedOutUser: {
    username: lockedOutUserUsername,
    password: saucedemoPassword,
  },
  problemUser: {
    username: problemUserUsername,
    password: saucedemoPassword,
  },
  performanceGlitchUser: {
    username: performanceGlitchUserUsername,
    password: saucedemoPassword,
  },
} as const;
