const express = require("express");
const router = express.Router();

router.post("/get-auth-code", (req, res, next) => {
  const email_address = req.body.email;
  try {
    res.send({email_address})
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
