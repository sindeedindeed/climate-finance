const express = require("express");
const { register, login, getAllUser, updateUser, deleteUser} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/get-all-user", getAllUser);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);


module.exports = router;
