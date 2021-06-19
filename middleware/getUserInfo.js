const { JWT_SECRET } = require("../key/key");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const data = require("../public/model/schema");

module.exports = (req, res, next) => {
    //destructuring authorization from req.headers_____authorization will look like (Bearer token)
    const { authorization } = req.headers;
    console.log(authorization);
    if (!authorization) {
        res.status(401).render("login", { msg: "you must be logged in" });
    }
    const token = authorization.replace("Beader ", "");
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err)

            res.send("you must be logged in")

        const { _id } = payload;
        data.findOne({ _id: _id }).then(userData => {
            req.user = userData
        }).catch(err => {

            res.send("you must be logged in")
        })
    })
    next();
}