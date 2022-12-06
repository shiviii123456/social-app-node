const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://shivangi:Abc1234@socialmedia.ffd05qd.mongodb.net/?retryWrites=true&w=majority", {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: true
}).then(() => {
    console.log("connection success");
}).catch((err) => {
    console.log(err);
    console.log("hello")
})
