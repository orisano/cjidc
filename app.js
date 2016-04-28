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

server.listen(process.env.PORT || cnf.port);

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
        res.render("admin", {classes: ["1-1", "1-2", "1-3", "1-4", "2-1", "2-2", "2-3", "2-4", "3-ms", "3-ic", "3-mi", "3-br", "4-ms", "4-ic", "4-mi", "4-br", "5-ms", "5-ic", "5-mi", "5-br"], kinds: ["クラス対抗リレー(1年)", "クラス対抗リレー(2年)", "クラス対抗リレー(3年)", "借り物競走", "部対抗リレー", "大綱引き", "カバディ", "学級リレー(4年)", "学級リレー(5年)", "障害物競走"], csrfToken: req.csrfToken()});
    }
);

app.post("/score",
    passport.authenticate("basic", {session: false}),
    parseForm,
    csrfProtection,
    (req, res) => {
        const event = {
            class: req.body.classes,
            kind: req.body.kind,
            point: +req.body.point
        };
        models.Event.create(event).then((obj) => {
            io.emit("event", obj);
            res.redirect("/admin");;
        });
    }
);

app.get("/event", (req, res) => {
    models.Event.findAll().then(events => res.json({events}));
});

io.on("connection", (socket) => {

});
