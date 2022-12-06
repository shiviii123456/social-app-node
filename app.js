require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const path = require("path");
const viewPath = path.join(__dirname, "./templates/views");
const public = path.join(__dirname, "./public");
require("./public/conn/connection");
const data = require("./public/model/schema");
const bodyParser = require("body-parser");
const multer = require("multer");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const posts = require("./public/model/postSchema");
const { Router, response } = require("express");
const { findOne } = require("./public/model/postSchema");
const { JWT_SECRET } = require("./key/key");

console.log(process.env.JWT_SECRETS);
app.use(express.static(public));

app.set("view engine", "ejs");
app.set("views", viewPath);
app.use(bodyParser({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

console.log(process.env.PORT);

const requireLogin = (req, res, next) => {
    const userToken = localStorage.getItem("userToken");
    try {
        const decode = jwt.verify(userToken, process.env.JWT_SECRETS);
    }
    catch (err) {
        res.redirect("/login");
    }
    next();
}
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}
const storage = multer.diskStorage({
    destination: "./public/upload",
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
    }
})
//upload variable for uploading images
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFile(file, cb);
    }
}).single("file");
//another upload variable
const uploads = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFile(file, cb);
    }
}).single("postImg");
//checkfile 
const checkFile = (file, cb) => {
    const filetrypes = /jpeg|jpg|png/;
    const extname = filetrypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetrypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb("error:images only");
    }
}
app.get("/", (req, res) => {
    const userToken = localStorage.getItem("userToken");
    if (userToken)
        res.redirect("/home");
    else
        res.render("index", { msg: "" })
});
//registration of user
app.post("/", (req, res) => {
    data.findOne({ username: req.body.username }).then(response => {
        if (!response) {
            const password = req.body.password;
            const confirmPassword = req.body.confirmpassword;
            if (password === confirmPassword) {
                bcrypt.hash(password, 12).then(password => {
                    const user = new data({
                        name: req.body.names,
                        email: req.body.email,
                        username: req.body.username,
                        password: password,
                    })
                    user.save((err, doc) => {
                        if (err) throw err;
                        res.render("index", { msg: "user registration sucessful" });
                    });
                }).catch(err => {
                    console.log(err);
                });
            }
            else {
                res.render("index", { msg: "username/password not matched" });
            }
        }
        else {
            res.render("index", { msg: "user exist already" });
        }
    }).catch(err => {
        console.log(err);
    })
})
app.get("/login", (req, res) => {
    const userToken = localStorage.getItem("userToken");
    if (userToken)
        res.redirect("/home")
    else
        res.render("login", { msg: " " });
});
//user login
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await data.findOne({ username: username });
        if (result) {
            bcrypt.compare(password, result.password).then(domatch => {
                console.log(domatch);
                if (domatch) {
                    // generate token we get token that will consist of userid in payload
                    const usertoken = jwt.sign({ _id: domatch._id }, JWT_SECRET);
                    localStorage.setItem("userToken", usertoken);
                    localStorage.setItem("userName", username);
                    res.redirect("/home");
                }
                else {
                    res.render("login", { msg: "unauthorized user" });
                }
            })
        }
        else {
            res.render("login", { msg: "unauthorized user" });
        }
    }
    catch (err) {
        console.log(err);
    }
});
app.get("/home", requireLogin, (req, res) => {
    // const loginUser = localStorage.getItem("userName");
    // data.findOne({ username: loginUser }).then(user => {
    //     posts.find({}).
    //         populate("postedBy", "_id name username image").
    //         then(post => {
    //             console.log(user)
    //             res.render("home", {
    //                 username: user.username,
    //                 image: user.image,
    //                 name: user.name,
    //                 bio: user.bio,
    //                 profession: user.profession,
    //                 post: post
    //             })
    //         }).catch(err => {
    //             console.log(err);
    //         });
    // }).catch(err => {
    //     console.log(err);
    // })
    const loginUser = localStorage.getItem("userName");
    data.findOne({ "username": loginUser }).then(user => {
        let array = [];
        if (user.following != []) {
            array = user.following;
            array.push(user._id);
        }
        else {
            array.push(user._id)
        }
        posts.find({ postedBy: { $in: array } })
            .populate("postedBy", "_id name username image")
            .sort({ postDate: -1 })
            .then(success => {
                if (success) {
                    res.render("home", {
                        username: user.username,
                        image: user.image,
                        name: user.name,
                        bio: user.bio,
                        profession: user.profession,
                        post: success,
                        following:user.following
                    })
                }
            })
    })
})

app.post("/updateInfo", upload, (req, res) => {
    const loginUser = localStorage.getItem("userName");
    const result = data.findOne({ username: loginUser });
    const { bio, age, profession, interest, hobby, mobileNo, name } = req.body;
    result.exec((err, Data) => {
        if (err) throw new err;
        const update = async (_id) => {
            try {
                if (!bio || !age || !profession || !interest || !mobileNo || !name || !req.file) {
                    console.log("Enter all the details");
                    res.render("editProfile", {
                        error: true,
                        user: loginUser
                    });
                }
                else {
                    const result = await data.findByIdAndUpdate({ _id: _id }, { $set: { bio: bio, age: age, profession: profession, image: req.file.filename, interest: interest, hobby: hobby, mobileNo: mobileNo, name: name } });
                    res.redirect("/home");
                }
            }
            catch (err) {
                console.log(err);
            }
        }
        update(Data._id);
    })
})
app.post("/postImage", uploads, (req, res) => {
    const { post } = req.body;
    if (!post || !req.file) {
        return res.send("<h1>please add picture to it</h1>");
    }
    else {
        const img = req.file.filename
        const loginUser = localStorage.getItem("userName");
        data.findOne({ username: loginUser }).then(
            user => {
                const newPost = new posts({
                    caption: post,
                    img: img,
                    postedBy: user._id,
                })
                newPost.save().then(post => {
                    console.log(post);
                }).catch(err => {
                    console.log(err);
                })
                res.redirect("/home");
            }
        ).catch(err => {
            console.log(err);
        })
    }
})
// app.get("/editPost/:id", (req, res) => {
//     res.send("hello");
// })
app.get("/deletePost/:id", (req, res) => {
    const id = req.params.id;
    posts.findByIdAndDelete(id).then(post => {
        res.redirect("/home")
    }).catch(err => {
        console.log(err)
    })
})
app.get("/editProfile", requireLogin, (req, res) => {
    const loginUser = localStorage.getItem("userName");
    data.findOne({ username: loginUser }).then(user => {
        res.render("editProfile", {
            user: user,
            error:false
        })
    }).catch(err => {
        console.log(err);
    })
})
app.get("/about", requireLogin, (req, res) => {
    const loginUser = localStorage.getItem("userName");
    data.findOne({ username: loginUser }).then(
        user => {
            posts.find({ postedBy: user._id }).then(post => {
                res.render("myprofile", {
                    post: post,
                    user: user
                });
                console.log(post)
            }).catch(err => {
                console.log(err);
            });
        }
    ).catch(err => {
        console.log(err);
    })
})
app.post("/like", (req, res) => {
    const loginUser = localStorage.getItem("userName");
    data.findOne({ username: loginUser }).then(user => {
        posts.findById(req.body._id).then(userPost => {
            if (userPost.like.filter(like => like.toString() == user._id).length > 0)
                return res.json("liked")

            userPost.like.unshift(user._id);
            userPost.save().then().catch(err => {
                console.log(err)
            })
            res.json(userPost.like);
        }).catch(err => {
            console.log(err)
        })
    }).catch(err => {
        console.log(err);
    })
})
app.post("/unlike", (req, res) => {
    const loginUser = localStorage.getItem("userName");
    data.findOne({ username: loginUser }).then(user => {
        posts.findByIdAndUpdate(req.body._id, {
            $pull: { like: user._id }
        }, {
            new: true
        }).exec((err, post) => {
            console.log(post)
            if (err)
                console.log(err);
            else
                res.json(post.like)
        })
    }).catch(err => {
        console.log(err);
    })
})
app.post("/comment", async (req, res) => {
    const loginUser = localStorage.getItem("userName");
    const user = await data.findOne({ username: loginUser })
    console.log(user)
    const comment = {
        text: req.body.text,
        postedBy: user._id
    }
    console.log(comment);
    posts.findByIdAndUpdate(req.body.postId, {
        $push: { comment: comment }
    }, {
        new: true
    }).exec((err, post) => {
        if (err)
            console.log(err)
        else
            res.json(post.comment)
    })
})
app.post("/allComment", (req, res) => {
    const postId = req.body.postId;
    posts.findOne({ _id: postId })
        .populate("comment.postedBy")
        .then(post => {
            res.json(post.comment)
        }).catch(err => {
            console.log(err)
        })
})
app.post("/frndProf", requireLogin, (req, res) => {
    const loginUser = localStorage.getItem("userName");
    data.findOne({ username: req.body.users }).then(user => {
        if (!user) {
            res.status(400).send("user does not exist");
        }
        else {
            if (user.username !== loginUser) {
                posts.find({ postedBy: user._id })
                    .then(post => {
                        data.findOne({ username: loginUser }).then(loginuser => {
                            res.render("frndprofile", {
                                user: user,
                                post: post,
                                loginuser: loginuser
                            })
                        }
                        ).catch(err => {
                            console.log(err)
                        })
                    }).catch(err => {
                        console.log(err)
                    })
            }
            else {
                res.status(400).send("<h1>user does not exist</h1>");
            }
        }
    }).catch(err => {
        console.log(err)
    })
})
app.post("/following", (req, res) => {
    const loginUser = localStorage.getItem("userName");
    const id = req.body._id;
    console.log(id);
    data.findOne({ username: loginUser }).then(user => {
        data.findByIdAndUpdate(user._id, {
            $push: { following: id }
        }, {
            new: true
        }).exec((err, success) => {
            if (err)
                console.log(err)
            else {
                data.findByIdAndUpdate(id, {
                    $push: { followers: user._id }
                }, {
                    new: true
                }).exec((error, following) => {
                    if (err)
                        console.log(err)
                    else
                        res.json(following)
                })
            }
        })
    }).catch(err => {
        console.log(err)
    })
})
app.post("/unfollow", (req, res) => {
    const loginUser = localStorage.getItem("userName");
    const id = req.body._id;
    data.findOne({ username: loginUser }).then(user => {
        data.findByIdAndUpdate(user._id, {
            $pull: { following: id }
        }, {
            new: true
        }).exec((err, success) => {
            if (err)
                console.log(err)
            else {
                data.findByIdAndUpdate(id, {
                    $pull: { followers: user._id }
                }, {
                    new: true
                }).exec((error, following) => {
                    if (err)
                        console.log(err)
                    else
                        res.json(following)
                })
            }
        })
    }).catch(err => {
        console.log(err)
    })
})
app.get("/autocomplete", (req, res) => {
    const loginUser = localStorage.getItem("userName");
    let regex = new RegExp(req.query["term"], "i");
    data.find({ username: regex }, { "username": 1 }).sort({ "updated_at": -1 })
        .sort({ "created_at": -1 }).limit(20).then(user => {
            var result = [];
            if (user && user.length && user.length > 0) {
                user.forEach(users => {
                    if (users.username !== loginUser) {
                        let obj = {
                            id: users._id,
                            label: users.username
                        };
                        result.push(obj)
                    }
                });
            }
            res.jsonp(result)

        }).catch(err => {
            console.log(err);
        })

})
app.get("/logout", (req, res) => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userToken");
    res.redirect("login");
})
app.listen(port, () => {
    console.log("stating at", port)
})








