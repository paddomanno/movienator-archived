import ProfileImage from '../entity/profileImage';
import User from '../entity/user';

import expressProfileImage from 'express';
const profileImageRouter = expressProfileImage.Router();

//All images
profileImageRouter.get('/all', async (req, res) => {
  try {
    const allProfileImages: ProfileImage[] = await ProfileImage.find({
      relations: { users: true },
    });
    if (allProfileImages) {
      allProfileImages.sort((a, b) => a.name.localeCompare(b.name));
      return res.status(200).json({
        data: allProfileImages,
      });
    } else {
      return res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//The image with that link
profileImageRouter.get('/ref/:ref', async (req, res) => {
  try {
    const oneProfileImage: ProfileImage = await ProfileImage.findOne({
      where: { ressourceLink: req.params.ref },
      relations: { users: true },
    });
    if (oneProfileImage) {
      return res.status(200).json({
        data: oneProfileImage,
      });
    } else {
      return res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//The Image of the User with that Id
profileImageRouter.get('/user/:id', async (req, res) => {
  try {
    const requestedUser: User = await User.findOne({
      where: { userId: parseInt(req.params.id) },
      relations: ['profileImage', 'profileImage.users'],
    });

    if (requestedUser) {
      return res.status(200).json({
        data: requestedUser.profileImage,
      });
    } else {
      return res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Saves the image from the body
profileImageRouter.post('/', async (req, res) => {
  try {
    const newProfileImage: ProfileImage = req.body as ProfileImage;
    const existingImage: ProfileImage = await ProfileImage.findOne({
      where: { ressourceLink: newProfileImage.ressourceLink },
    });
    if (existingImage) {
      newProfileImage.users = existingImage.users;
    }
    await ProfileImage.save(newProfileImage);
    if (newProfileImage) {
      return res.status(201).json({
        data: newProfileImage,
      });
    } else {
      return res.status(500).json();
    }
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Updates the image from the body
profileImageRouter.put('/', async (req, res) => {
  try {
    const updatedProfileImage = req.body as ProfileImage;
    const requestedProfileImage: ProfileImage = await ProfileImage.findOne({
      where: { ressourceLink: updatedProfileImage.ressourceLink },
    });
    if (!requestedProfileImage) {
      return res.status(404).json();
    }

    Object.keys(updatedProfileImage).forEach((key) => {
      if (key != 'users' && key != 'ressourceLink') {
        requestedProfileImage[key] = req.body[key];
      }
    });
    await requestedProfileImage.save();

    return res.status(201).json({
      data: requestedProfileImage,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Deletes the image with that link
profileImageRouter.delete('/:ref', async (req, res) => {
  try {
    const requestedProfileImage = await ProfileImage.findOne({
      where: { ressourceLink: req.params.ref },
    });
    if (requestedProfileImage) {
      await requestedProfileImage.remove();
      return res.status(204).json();
    } else {
      return res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Sets the Profile Image of that user
profileImageRouter.put('/image/:uId/:pId', async (req, res) => {
  try {
    const requestedUser = await User.findOne({
      where: { userId: parseInt(req.params.uId) },
      relations: ['watchlist'],
    });
    const requestedImage = await ProfileImage.findOne({
      where: { ressourceLink: req.params.pId },
    });
    if (requestedUser && requestedImage) {
      requestedUser.profileImage = requestedImage;
      await requestedUser.save();
      return res.status(201).json();
    } else {
      return res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Deletes the Profile Image of that user
profileImageRouter.delete('/image/:uId', async (req, res) => {
  try {
    const requestedUser = await User.findOne({
      where: { userId: parseInt(req.params.uId) },
      relations: ['watchlist'],
    });
    if (requestedUser) {
      requestedUser.profileImage = null;
      await requestedUser.save();
      return res.status(204).json();
    } else {
      return res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});
export default profileImageRouter;
