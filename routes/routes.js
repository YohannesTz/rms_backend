const mediaController = require("../controllers/mediaController");
const reservationsController = require("../controllers/reservationsController");
const reviewsController = require("../controllers/reviewsController");
const roomsController = require("../controllers/roomsController");
const usersController = require("../controllers/usersControllers");
const contactsController = require("../controllers/contactController");
const authMiddleware = require("../middleware/auth");

const route = require("express").Router();

route.get("/contacts", contactsController.getAllContacts);
route.post("/contact/", contactsController.create);

route.post("/users/signUp", usersController.signUp);
route.post("/users/login", usersController.login);
route.put("/users/", authMiddleware.auth, usersController.editProfile);
route.get("/users/", usersController.getAllUsers);
route.get("/users/email/:email", usersController.getUsersByEmail);
route.get("/users/id/:id", usersController.getUserById);

route.get("/rooms", roomsController.getAllRooms);
route.get("/rooms/id/:id", roomsController.getRoomById);
route.get("/rooms/available", roomsController.getAllAvailableRooms);
route.get("/rooms/lordId/:lordId", roomsController.getRoomByLordId);
route.post("/rooms/create/:lordId", roomsController.create);
route.put("/rooms/:id", authMiddleware.auth, roomsController.editRoom);
route.get("/rooms/:text", roomsController.findRooms);

route.get("/reviews", reviewsController.getAllReview);
route.get("/reviews/roomId/:roomId", reviewsController.getReviewByRoomId);
route.get("/reviews/userId/:userId", reviewsController.getReviewByUserId);
route.get("/reviews/id/:id", reviewsController.getReviewById);
route.post("/reviews/create", reviewsController.create);
route.put("/reviews/:id", authMiddleware.auth, reviewsController.updateReview);
route.delete("/reviews/:id", reviewsController.deleteReview);

route.get("/medias", mediaController.getAllMedias);
route.get("/medias/roomId/:roomdId", mediaController.getAllMedias);
route.post("/medias/create", mediaController.create);
route.post("/medias/createMultiple", mediaController.createMultiple);

route.get("/reservations", reservationsController.getAllReservations);
route.post("/reservations/create", reservationsController.create);
route.put("/reservations/accept/:resId", authMiddleware.auth, reservationsController.acceptReservation);
route.put("/reservations/reject/:resId", authMiddleware.auth, reservationsController.rejectReservation);
route.get("/reservations/lordId/:lordId", reservationsController.getReservationByLordId);
route.get("/reservations/id/:id", reservationsController.getReservationById);
route.get("/reservations/userId/:userId", reservationsController.getReservationByUserId);
route.get("/reservations/roomId/:roomId", reservationsController.getAllReservationsByRoomId);
route.get("/reservations/roomId/userId/:roomId/:userId", reservationsController.getReservationsByRoomAndUserId);

module.exports = route;
