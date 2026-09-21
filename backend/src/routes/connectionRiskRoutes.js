const express = require("express");
const router = express.Router();
const {
  evaluateConnectionRiskController,
} = require("../controllers/connectionRiskController");

router.post("/evaluate", evaluateConnectionRiskController);

module.exports = router;
