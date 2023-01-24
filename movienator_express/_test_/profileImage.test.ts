import {
  afterAll,
  beforeAll,
  describe,
  expect,
  beforeEach,
  it,
} from '@jest/globals';
import { TestDatabaseManager } from './test_utils/TestDatabaseManager';
import app from '../app';
import request from 'supertest';
import ProfileImage from '../entity/profileImage';
import User from '../entity/user';

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
  const image1: ProfileImage = new ProfileImage();
  image1.ressourceLink = 'cat.png';
  image1.name = 'Cat';
  image1.users = [];
  await image1.save();

  const image2: ProfileImage = new ProfileImage();
  image2.ressourceLink = 'dog.png';
  image2.name = 'Dog';
  image2.users = [];
  await image2.save();

  const image3: ProfileImage = new ProfileImage();
  image3.ressourceLink = 'funny.png';
  image3.name = 'Funny';
  image3.users = [];
  await image3.save();

  const user: User = new User();
  user.firstName = 'Ula';
  user.lastName = 'Metz';
  user.userName = 'ulme';
  user.password = 'root';
  user.birthday = new Date();
  user.profileImage = image1;
  await user.save();

  const userNoImage: User = new User();
  userNoImage.firstName = 'Freddi';
  userNoImage.lastName = 'Koch';
  userNoImage.userName = 'feko';
  userNoImage.password = 'root';
  userNoImage.birthday = new Date();
  await userNoImage.save();
}

describe('Imagetest', () => {
  describe('getAllProfileImages route', () => {
    describe('good case', () => {
      it('should return all images', async () => {
        const response = await request(app).get('/profileImage/all');
        expect(response.statusCode).toBe(200);
        const allImages: ProfileImage[] = response.body.data;
        expect(allImages.length).toBe(3);
        expect(allImages.at(0).users.at(0).firstName).toBe('Ula');
      });
    });
  });

  describe('getOneProfileImageWithLink route', () => {
    describe('good case', () => {
      it('should return one image', async () => {
        const response = await request(app).get('/profileImage/ref/cat.png');
        expect(response.statusCode).toBe(200);
        const allImages: ProfileImage = response.body.data;
        expect(allImages.name).toBe('Cat');
        expect(allImages.users.at(0).firstName).toBe('Ula');
      });
    });
    describe('bad case', () => {
      describe('given link does not exist', () => {
        it('should return 404', async () => {
          const response = await request(app).get(
            '/profileImage/ref/error.png'
          );
          expect(response.statusCode).toBe(404);
        });
      });
    });
  });

  describe('getImageOfUser route', () => {
    describe('good case', () => {
      it('should return image of user', async () => {
        // Kevin - Ich glaube in der Route war ein Fehler, könnt jetzt nochmal probieren
        const response = await request(app).get('/profileImage/user/1');
        expect(response.statusCode).toBe(200);
        const image: ProfileImage = response.body.data;
        expect(image.name).toBe('Cat');
        expect(image.users.at(0).firstName).toBe('Ula');
      });
      describe('given user does not have an image', () => {
        it('should return 200 and undefined image', async () => {
          const response = await request(app).get('/profileImage/user/2');
          expect(response.statusCode).toBe(200);
          const image: ProfileImage = response.body.data;
          expect(image).toBe(null);
        });
      });
    });
    describe('bad case', () => {
      describe('given user does not exist', () => {
        it('should return 404', async () => {
          const response = await request(app).get('/profileImage/user/11');
          expect(response.statusCode).toBe(404);
        });
      });
    });
  });

  describe('postNewImage route', () => {
    describe('good case', () => {
      it('should return the new image and status 201', async () => {
        const image: ProfileImage = new ProfileImage();
        image.ressourceLink = 'donkey.png';
        image.name = 'Donkey';

        const response = await request(app).post('/profileImage/').send(image);
        expect(response.statusCode).toBe(201);
        expect(response.body.data.name).toBe('Donkey');
      });
    });
    describe('bad case', () => {
      describe('given no ressourceLink', () => {
        it('should return 500', async () => {
          const image: ProfileImage = new ProfileImage();
          image.name = 'Donkey';

          const response = await request(app)
            .post('/profileImage/')
            .send(image);
          expect(response.statusCode).toBe(500);
        });
      });
    });
  });

  describe('putImage Route', () => {
    describe('good case', () => {
      it('Should update the image in the database', async () => {
        const image: ProfileImage = await ProfileImage.findOne({
          where: { ressourceLink: 'funny.png' },
        });
        image.name = 'Funny Image';
        const response = await request(app).put('/profileImage/').send(image);
        expect(response.statusCode).toBe(201);
        expect(response.body.data.name).toBe('Funny Image');
      });
    });
    describe('bad case', () => {
      describe('image does not exist', () => {
        it('should return 404', async () => {
          const noImage: ProfileImage = ProfileImage.create({
            ressourceLink: 'none.png',
            name: 'no',
            users: [],
          });
          noImage.ressourceLink = 'none1.png';
          const response = await request(app)
            .put('/profileImage/')
            .send(noImage);
          expect(response.statusCode).toBe(404);
        });
      });
    });
  });

  describe('deleteImage route', () => {
    describe('good case', () => {
      it('should return nothing and status 204', async () => {
        const response = await request(app).delete('/profileImage/dog.png');
        expect(response.statusCode).toBe(204);
        const image = await ProfileImage.findOne({
          where: { ressourceLink: 'dog.png' },
        });
        expect(image).toBeNull();
      });
    });
    describe('bad cases', () => {
      describe('given image does not exist', () => {
        it('should return 404', async () => {
          const response = await request(app).delete('/review/11/1');
          expect(response.statusCode).toBe(404);
        });
      });
    });
  });
});
