const router = require("express").Router();

const storiesController = require('../controllers/stories.controller');

router.get('/read_all', storiesController.getAllStories);
router.get('/read_single/:storySlug', storiesController.getFullStory);

module.exports = router;
