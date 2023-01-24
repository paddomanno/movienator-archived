import { describe, expect, it } from '@jest/globals';

describe('Env Variables Test', () => {
  it('should have the movie api key set', function () {
    expect(process.env['MOVIE_API_KEY'] == '').toBeFalsy();
  });
  it('should have the database password set', function () {
    expect(process.env['DB_PASSWORD'] == '').toBeFalsy();
  });
  it('should have the hatespeech api key set', function () {
    expect(process.env['HATESPEECH_API_KEY'] == '').toBeFalsy();
  });
});
