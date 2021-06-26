const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://shivangi:12345@cluster0.kkpza.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: true
}).then(() => {
    console.log("connection success");
}).catch((err) => {
    console.log(err);
})