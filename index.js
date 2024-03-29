const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const port = 3000;
const app = express();
const Room = require("./models/Room");

app.use(express.static("./views"));
app.use(bodyParser.urlencoded({ extended : true }));

var rooms = [];




app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "lobby.html"));
})

app.get("/api/rooms", (req, res) => {
    res.json({ rooms });
})

app.post("/create", (req, res) => {
    var room = new Room(req.body.name);
    rooms.push(room);
    res.redirect("/");
})

app.listen(port);
console.log(`App running on port ${port}`);