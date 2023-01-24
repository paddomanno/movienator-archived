import {
  afterAll,
  beforeAll,
  describe,
  expect,
  beforeEach,
  it,
} from '@jest/globals';
import { TestDatabaseManager } from './test_utils/TestDatabaseManager';

beforeAll(async () => {
  await TestDatabaseManager.getInstance().connectTestDatabase();
}, 10_000);

afterAll(async () => {
  await TestDatabaseManager.getInstance().resetTestDatabase();
});

beforeEach(async () => {
  await TestDatabaseManager.getInstance().resetTestDatabase();
  await createTestData();
}, 10_000);

async function createTestData() {}

describe('Fake Test', () => {
  it('Faketest', async () => {
    expect(1).toBe(1);
  });
});
