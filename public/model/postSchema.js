const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const Schema = mongoose.Schema;
const postModel = Schema({
    like: [{
        type: ObjectId,
        ref: "useradata",
    }],
    comment: [
        {
            text: String,
            postedBy: {
                type: ObjectId,
                ref: "userdata"
            }
        }
    ],
    caption: {
        type: String,
        required: true
    },
    img: {
        type: String,
        default: ""
    },
    postDate: {
        type: String,
        default: Date.now(),
    },
    postDay: {
        type: String,
        default: new Date().getDate() + "," + new Date().getMonth() + "," + new Date().getFullYear(),
    },
    postedBy: {
        type: ObjectId,
        ref: "userdata",
    }
});
const Posting = mongoose.model("posts", postModel);

module.exports = Posting;