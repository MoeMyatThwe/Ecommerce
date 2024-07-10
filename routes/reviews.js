<<<<<<< HEAD
// See https://expressjs.com/en/guide/routing.html for routing

const express = require('express');
const reviewsController = require('../controllers/reviewsController');
const jwtMiddleware = require('../middleware/jwtMiddleware');

const router = express.Router();

// All routes in this file will use the jwtMiddleware to verify the token and check if the user is an admin.
// Here the jwtMiddleware is applied at the router level to apply to all routes in this file
// But you can also apply the jwtMiddleware to individual routes
// router.use(jwtMiddleware.verifyToken, jwtMiddleware.verifyIsAdmin);

router.use(jwtMiddleware.verifyToken);

router.post('/',reviewsController.createReview);
router.get('/:memberId',reviewsController.retrieveAllReviewsByMemberId);//memeber can retrieve only their reviews
router.put('/:reviewId',reviewsController.updateReview);//member can only update their own reviews
router.delete('/:reviewId', reviewsController.deleteReviewById);//member can only delete their own review

=======
// See https://expressjs.com/en/guide/routing.html for routing

const express = require('express');
const reviewsController = require('../controllers/reviewsController');
const jwtMiddleware = require('../middleware/jwtMiddleware');

const router = express.Router();

// All routes in this file will use the jwtMiddleware to verify the token and check if the user is an admin.
// Here the jwtMiddleware is applied at the router level to apply to all routes in this file
// But you can also apply the jwtMiddleware to individual routes
// router.use(jwtMiddleware.verifyToken, jwtMiddleware.verifyIsAdmin);

router.use(jwtMiddleware.verifyToken);

router.post('/',reviewsController.createReview);
router.get('/:memberId',reviewsController.retrieveAllReviewsByMemberId);//memeber can retrieve only their reviews
router.put('/:reviewId',reviewsController.updateReview);//member can only update their own reviews
router.delete('/:reviewId', reviewsController.deleteReviewById);//member can only delete their own review

>>>>>>> 35f9920c60ad16ad4185fe5d6e7cbec7f03c1cef
module.exports = router;