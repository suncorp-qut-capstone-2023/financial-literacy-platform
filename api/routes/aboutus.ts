var express = require("express");
var router = express.Router();


// A static route for use of example.
router.get("/", function (req, res, next) {
  res
    .json({
      name: "Backend Capstone Team",
      company: "Suncorp-Metway",
    })
    .catch((err) => {
      console.log(err);
      res.json({
        error: true,
        message: "Error in getting data",
      });
    });
});

module.exports = router;