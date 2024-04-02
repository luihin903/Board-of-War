const express = require("express");
const session = require("express-session");
const path = require("path");
const bodyParser = require("body-parser");
const port = 3000;
const app = express();
const Room = require("./models/Room");
const roomRoutes = require("./routes/room");

app.use(express.static("./views"));
app.use(bodyParser.urlencoded({ extended : true }));
app.use(express.urlencoded({ extended : true }));
app.use(express.json());
app.use(session({
    name : "nsession",
    secret : "secret_string",
    resave : false,
    saveUninitialized : false,
    maxAge : 60 * 60 * 1000
}))
app.use("/room", roomRoutes);


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "lobby.html"));
})

app.get("/api/rooms", (req, res) => {
    var rooms = Room.rooms;
    res.json({ rooms });
})

app.listen(port);
console.log(`App running on port ${port}`);