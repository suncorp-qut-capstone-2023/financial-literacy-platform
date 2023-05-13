var express = require("express");
var router = express.Router();


// A static route for use of example.
router.get("/about", function (req, res, next) {
    res
        .json({
            name: "JCMG",
            description: "A group of four students from QUT, working on their final year capstone project. The project is to create an API server for Suncorp-Metway.",
            company: "Suncorp-Metway",
            members: [
                {
                    name: "Jason Finsalyne",
                    student_id: "n1xxxxxx",
                    email: "n1xxxxxx@qut.edu.au"
                },
                {
                    name: "Christopher Mai",
                    student_id: "n1xxxxxx",
                    email: "n1xxxxxx@qut.edu.au"
                },
                {
                    name: "Meet Vadher",
                    student_id: "n11012595",
                    email: "n11012595@qut.edu.au"
                },
                {
                    name: "Geoffrey Beckett",
                    student_id: "n1xxxxxx",
                    email: "n1xxxxxx@qut.edu.au"
                }
            ],
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