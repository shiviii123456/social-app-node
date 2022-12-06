const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/socialPeople", {
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
