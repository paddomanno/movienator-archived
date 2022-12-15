import ProfileImage from '../entity/profileImage';
import User from '../entity/user';

const expressProfileImage = require('express');
const profileImageRouter = expressProfileImage.Router();

//All images
profileImageRouter.get('/all', async (req, res) => {
  try {
    const allProfileImages: ProfileImage[] = await ProfileImage.find({
      relations: { users: true },
    });
    if (allProfileImages) {
      allProfileImages.sort((a, b) => a.name.localeCompare(b.name));
      res.status(200).json({
        data: allProfileImages,
      });
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
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
      res.status(200).json({
        data: oneProfileImage,
      });
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
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
      res.status(200).json({
        data: requestedUser.profileImage,
      });
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Saves the image from the body
profileImageRouter.post('/', async (req, res) => {
  try {
    let newProfileImage: ProfileImage = req.body as ProfileImage;
    await ProfileImage.save(newProfileImage);
    if (newProfileImage) {
      res.status(201).json({
        data: newProfileImage,
      });
    } else {
      res.status(500).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Updates the image from the body
profileImageRouter.put('/', async (req, res) => {
  try {
    let updatedProfileImage = req.body as ProfileImage;
    const requestedProfileImage: ProfileImage = await ProfileImage.findOne({
      where: { ressourceLink: updatedProfileImage.ressourceLink },
    });
    if (requestedProfileImage) {
      // TODO: primary key can be updated here (if we ever want to change the link), right?
      // Kevin - können mal probieren. Bin mir nicht sicher ob typeOrm das mag
      Object.keys(updatedProfileImage).forEach((key) => {
        if (key != 'users') {
          requestedProfileImage[key] = req.body[key];
        }
      });
      await requestedProfileImage.save();

      res.status(201).json({
        data: requestedProfileImage,
      });
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
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
      res.status(204).json();
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

module.exports = profileImageRouter;
