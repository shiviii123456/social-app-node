const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;
const schema = Schema({
    name: {
        required: true,
        type: String
    },
    username: {
        required: true,
        type: String,
        unique: true,
    },
    email: {
        required: true,
        type: String,
        unique: true,
    },
    password: {
        required: true,
        type: String
    },
    age: {
        type: String,
        default: "",
    },
    image: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "",
    },
    profession: {
        type: String,
        default: "",
    },
    mobileNo: {
        type: Number,
        default: "",
    },
    hobby: {
        type: String,
        default: "",
    },
    interest: {
        type: String,
        default: "",
    },
    followers: [{
        type: ObjectId
    }],
    following: [{
        type: ObjectId
    }],

},
);
const Data = mongoose.model("userdata", schema);
module.exports = Data;