const express = require("express");
const router = express.Router();

router.post("/test", (req, res) => {
    console.warn("req", req.body)
    res.send("test");
});

module.exports = router;