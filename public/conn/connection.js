const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://shivi:12345@cluster0.ckjb3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
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
