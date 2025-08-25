// homePage.js
const express = require("express");
const path = require("path");
const router = express.Router();

// static fayllar
router.use(express.static(path.join(__dirname, "public")));

// bosh sahifa
router.get("/", (req, res) => {
  const filePath = path.join(__dirname, "public", "index.html");
  res.sendFile(filePath);
});

module.exports = router;
