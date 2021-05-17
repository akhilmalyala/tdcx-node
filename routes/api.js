let express = require('express');
let router = express.Router();

let apiController = require('../controllers/apiController');
let tokenAuthenticationMiddleware = require("../utility/authentication");

router.post("/login",apiController.login);

router.get("/dashboard",tokenAuthenticationMiddleware,apiController.dashboard);

router.get("/tasks",tokenAuthenticationMiddleware,apiController.tasks);

router.post("/tasks",tokenAuthenticationMiddleware,apiController.tasks);

router.put("/tasks/:id",tokenAuthenticationMiddleware,apiController.tasks);

router.delete("/tasks/:id",tokenAuthenticationMiddleware,apiController.tasks);

router.post("/task-completed",tokenAuthenticationMiddleware,apiController.taskCompleted);

module.exports = router;


