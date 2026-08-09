const express = require("express");

const {
    createClaim
} = require("../controllers/claimController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createClaim);

module.exports = router;