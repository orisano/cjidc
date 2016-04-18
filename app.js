"use strict";

const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const passport = require("passport");
const Strategy = require("passport-http").BasicStrategy;
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const logger = require("morgan");
const models = require("./models");
const cnf = require("./config");

server.listen(cnf.port);

passport.use(new Strategy((user, pass, done) => {
    if (cnf.user !== user || cnf.pass !== pass) {
        done(null, false);
    }
    done(null, true);
}));

const csrfProtection = csrf({cookie: true});
const parseForm = bodyParser.urlencoded({extended: false});

app.use(logger("dev"));
app.use(express.static("public"));
app.use(cookieParser());
app.set("view engine", "pug");

app.get("/", (req,res) => {
    res.render("index");
});

app.get("/admin",
    passport.authenticate("basic", {session: false}),
    csrfProtection,
    (req, res) => {
        res.render("admin", {kinds: ["A", "B", "C"], csrfToken: req.csrfToken()});
    }
);

app.post("/score",
    passport.authenticate("basic", {session: false}),
    parseForm,
    csrfProtection,
    (req, res) => {
        const event = {
            time: req.body.time,
            grade: +req.body.grade,
            class: req.body.class,
            kind: req.body.kind,
            point: +req.body.point
        };
        models.Event.create(event).then(() => {
            res.send("OK");
            io.emit("event", event);
        });
    }
);

app.get("/event", (req, res) => {
    models.Event.findAll().then(events => res.json({events}));
});

io.on("connection", (socket) => {

});
