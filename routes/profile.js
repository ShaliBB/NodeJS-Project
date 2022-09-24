const express = require("express")
const _ = require("lodash")
const auth = require("../middlewares/auth");
const User = require("../modules/User");
const router = express.Router();

router.get("/", auth, async (req, res) => {
    try {
        let user = await User.findById(req.payload._id);
        if(!user) return res.status(401).send("Cannot find user, Please log in.");
        res.status(200).send(_.pick(user, ["name", "email", "biz"]));
    } catch (error) {
        res.status(400).send("Error In Profile");
    }
});

module.exports = router;