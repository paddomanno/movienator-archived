import {
  afterAll,
  beforeAll,
  describe,
  expect,
  beforeEach,
  it,
} from '@jest/globals';
import Movie from '../entity/movie';
import WatchProvider from '../entity/watchProvider';
import { TestDatabaseManager } from './test_utils/TestDatabaseManager';
import app from '../app';
import request from 'supertest';

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

async function createTestData() {
  const provider: WatchProvider = new WatchProvider();
  provider.providerId = 1;
  provider.providerName = 'Netflix';
  await provider.save();

  const provider2: WatchProvider = new WatchProvider();
  provider2.providerId = 2;
  provider2.providerName = 'Prime';
  await provider2.save();

  const movie: Movie = new Movie();
  movie.movieId = 1;
  movie.title = 'Movie';
  movie.adultContent = false;
  movie.watchProviders = [];
  await movie.save();

  const movie2: Movie = new Movie();
  movie2.movieId = 2;
  movie2.title = 'Movie2';
  movie2.adultContent = false;
  await movie2.save();

  movie.watchProviders.push(provider);
  movie.watchProviders.push(provider2);
  await movie.save();
}

describe('WatchProvider Tests', () => {
  describe('Get all WatchProviders: good case (Watch Providers exist)', () => {
    it('should return the WatchProviders sorted by name and status 200', async () => {
      const response = await request(app).get('/watchProvider/all');
      expect(response.statusCode).toBe(200);
      const allProviders: WatchProvider[] = response.body.data;
      expect(allProviders.length).toBe(2);
      expect(allProviders.at(0).providerName).toBe('Netflix');
      expect(allProviders.at(1).movies.at(0).title).toBe('Movie');
    });
  });
  describe('Get all WatchProviders: bad cases (no Watch Providers exist)', () => {
    it('should return 200', async () => {
      const provider: WatchProvider[] = await WatchProvider.find();
      for (const oneProvider of provider) {
        await oneProvider.remove();
      }
      const response = await request(app).get('/watchProvider/all');
      expect(response.statusCode).toBe(200);
      const noProviders: WatchProvider[] = response.body.data;
      expect(noProviders.length).toBe(0);
    });
  });

  describe('Gets all providers for a movie with the specific movieId', () => {
    describe('good case', () => {
      it('should return the WatchProviders sorted by name and status 200', async () => {
        const response = await request(app).get('/watchProvider/movie/1');
        expect(response.statusCode).toBe(200);
        const allProviders: WatchProvider[] = response.body.data;
        expect(allProviders.length).toBe(2);
        expect(allProviders.at(0).providerName).toBe('Netflix');
        expect(allProviders.at(1).providerName).toBe('Prime');
      });
    });
    describe('case: no watchprovider for movie', () => {
      it('should return empty array and status 200', async () => {
        const response = await request(app).get('/watchProvider/movie/2');
        expect(response.statusCode).toBe(200);
        const allProviders: WatchProvider[] = response.body.data;
        expect(allProviders.length).toBe(0);
      });
    });
  });
});
