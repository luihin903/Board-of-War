const express = require("express");
const path = require("path");
const port = 3000;
const app = express();

app.use(express.static("./"));

app.get("/", (req, res) => {
    res.redirect("./index.html");
})

app.listen(port);
console.log(`App running on port ${port}`);