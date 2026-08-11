import { faker } from '@faker-js/faker';
import { users } from '@/fixtures/users.fixture.ts';

// Order defines the test-case ID: login.spec.ts numbers these starting at
// TC-AUTH-002 by array index, so reordering or inserting a case here
// shifts every TC-AUTH-00N id after it.
export const invalidLoginCases = [
  {
    description: 'invalid username',
    username: faker.internet.username(),
    password: users.standardUser.password,
    expectedError: 'Epic sadface: Username and password do not match any user in this service',
  },
  {
    description: 'invalid password',
    username: users.standardUser.username,
    password: 'wrong_password',
    expectedError: 'Epic sadface: Username and password do not match any user in this service',
  },
  {
    description: 'locked-out user',
    username: users.lockedOutUser.username,
    password: users.lockedOutUser.password,
    expectedError: 'Epic sadface: Sorry, this user has been locked out.',
  },
  {
    description: 'empty username',
    username: '',
    password: users.standardUser.password,
    expectedError: 'Epic sadface: Username is required',
  },
  {
    description: 'empty password',
    username: users.standardUser.username,
    password: '',
    expectedError: 'Epic sadface: Password is required',
  },
  {
    description: 'both fields empty',
    username: '',
    password: '',
    expectedError: 'Epic sadface: Username is required',
  },
];
