import { DataSource } from 'typeorm';
import { TestDataSource } from './data-source-test';
import Review from '../../entity/review';
import ProfileImage from '../../entity/profileImage';
import Movie from '../../entity/movie';
import Actor from '../../entity/actor';
import User from '../../entity/user';

export class TestDatabaseManager {
  private static databaseInstance: TestDatabaseManager;
  private testDatabase: DataSource;
  public static initialized: boolean;

  public static getInstance(): TestDatabaseManager {
    if (!this.databaseInstance) {
      this.databaseInstance = new TestDatabaseManager();
    }
    return this.databaseInstance;
  }

  public async connectTestDatabase() {
    this.testDatabase = await TestDataSource;
    if (!TestDatabaseManager.initialized) {
      TestDatabaseManager.initialized = true;
      await this.testDatabase.initialize();
    }
  }

  public async resetTestDatabase() {
    await this.testDatabase
      .createQueryBuilder()
      .delete()
      .from(Review)
      .execute();
    await this.testDatabase
      .createQueryBuilder()
      .delete()
      .from(ProfileImage)
      .execute();
    await this.testDatabase.createQueryBuilder().delete().from(Movie).execute();
    await this.testDatabase.createQueryBuilder().delete().from(Actor).execute();
    await this.testDatabase.createQueryBuilder().delete().from(User).execute();

    await this.testDatabase.query('ALTER TABLE user AUTO_INCREMENT = 1');
  }
}
