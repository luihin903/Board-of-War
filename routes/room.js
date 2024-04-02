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
    var player = new Player(req.body.player, 0);
    room.players.push(player);
    Room.rooms.push(room);
    req.session.room = room;
    req.session.player = player;
    res.sendFile(path.join(__dirname, "..", "views", "room.html"));
})

router.post("/join", (req, res) => {
    for (var room of Room.rooms) {
        if (room.id == Number(req.body.room)) {
            var player = new Player(req.body.player, 1);
            room.players.push(player);
            req.session.room = room;
            req.session.player = player;
            res.sendFile(path.join(__dirname, "..", "views", "room.html"));
        }
    }
})

router.post("/wait", async (req, res) => {
    
    while (Room.find(req.body.id).players.length < 2) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    var room = Room.find(req.body.id);
    res.json({ room });
})

router.post("/ready", async (req, res) => {
    var index = Room.getIndex(req.body.room);
    Room.rooms[index].updatePlayer(req.body.player);
    Room.rooms[index].ready ++;

    while (Room.find(req.body.room).ready < 2) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    var room = Room.rooms[index];

    res.json({ room });
})

router.post("/action", async (req, res) => {
    var index = Room.getIndex(req.body.room);
    var action = req.body.action;
    var player = req.body.player;

    Room.rooms[index].ready = 0;
    Room.rooms[index].updatePlayer(player);
    Room.rooms[index].actions.push({ action , player });
    
    // the second player to act
    if (Room.rooms[index].actions.length >= 2) {
        Room.rooms[index].perform();
        Room.rooms[index].actions = [];
    }

    while (Room.find(req.body.room).actions.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    index = Room.getIndex(req.body.room);
    room = Room.rooms[index];
    var log = room.log;
    res.json({ room , log });
})

router.post("/perform", async (req, res) => {
    var action = req.body.action;
    var id = req.body.room;
    var index = Room.getIndex(id);
    var player = req.body.player;
    var unit = req.body.unit;
    var destination = req.body.destination;
    
    Room.rooms[index].updatePlayer(player);
    Room.rooms[index].actions.push({ action : action , player, unit , destination });

    // the second player to act
    if (Room.rooms[index].actions.length >= 2) {
        Room.rooms[index].perform();
        Room.rooms[index].actions = [];
    }

    while (Room.find(req.body.room).actions.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    var room = Room.find(req.body.room);
    var log = room.log;
    res.json({ room , log });
})

module.exports = router;