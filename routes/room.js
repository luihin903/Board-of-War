const express = require("express");
const router = express.Router();
const path = require("path");
const bodyParser = require("body-parser");
const Room = require("../models/Room");
const Player = require("../models/Player");

router.use(bodyParser.urlencoded({ extended : true }));
router.use(express.urlencoded({ extended : true }));
router.use(express.json());

router.get("/init", (req, res) => {
    var room = req.session.room;
    var player = req.session.player;
    res.json({ room, player });
})

router.post("/create", (req, res) => {
    var room = new Room(req.body.room);
    var player = new Player(req.body.player);
    room.players.push(player);
    Room.rooms.push(room);
    req.session.room = room;
    req.session.player = player;
    res.sendFile(path.join(__dirname, "..", "views", "room.html"));
})

router.post("/join", (req, res) => {
    for (var room of Room.rooms) {
        if (room.id == Number(req.body.room)) {
            var player = new Player(req.body.player);
            room.players.push(player);
            req.session.room = room;
            req.session.player = player;
            res.sendFile(path.join(__dirname, "..", "views", "room.html"));
        }
    }
})

router.post("/wait", async (req, res) => {
    var room = Room.find(req.body.id);
    while (room.players.length < 2) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    res.json({ room });
})

module.exports = router;