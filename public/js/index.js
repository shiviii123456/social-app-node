
function openLoginForm() {
    document.body.classList.add("showLoginForm");
}
function closeLoginForm() {
    document.body.classList.remove("showLoginForm");
}
// const wrapper = document.querySelector(".detailBox");
// const close = document.querySelector(".close");
// const trigger = document.querySelectorAll(".first");


// [].map.call(trigger, function (elem) {
//     console.log(elem)
//     elem.addEventListener("click", function () {
//         wrapper.classList.add("active");
//     }, false);
//     close.addEventListener("click", function () {
//         wrapper.classList.remove("active");
//     });
// });
// $(function () {
//     $("#button-addon2").autocomplete({
//         source: function (req, res) {
//             $.ajax({
//                 url: "/autocomplete",
//                 dataType: "jsonp",
//                 method: "GET",
//                 data: {
//                     term: req.term,
//                 },
//                 success: function (data) {
//                     res(data);
//                 },
//                 error: function (err) {
//                     console.log("hi error")
//                     console.log(err.status);
//                 }
//             })
//         },
//         minLength: 1,
//         select: function (event, ui) {
//             if (ui.item) {
//                 $("#button-addon2").text(ui.item.label);
//             }
//         }
//     })
// });
const wrap = document.querySelector(".wrap");
const button = document.querySelector(".btn-primary")
const postId = document.querySelector("#postId")
const text = document.querySelector("#text")

const showBox = (index) => {
    let x = document.getElementsByClassName("wrap")[index].id;
    postId.value = x;
    console.log(x);
    wrap.style.display = "flex";
}
const removeBox = () => {
    wrap.style.display = "none";
}
const comment = () => {
    fetch("/comment", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            text: text.value,
            postId: postId.value,
        })
    }).then(res => res.json()).then(response => {
        text.value = "";
        postId.values = "";
    })
}

//likes
const like = document.querySelector(".like");
const getLikes = (_id) => {
    fetch("/like", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            _id: _id,
        })
    }).then(res => res.json())
        .then(result => {
            if (result == "liked")
                alert("Post already Liked")
            else
                document.location.reload();
        })
}
const getUnLikes = (_id) => {
    fetch("/Unlike", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            _id: _id,
        })
    }).then(res => res.json())
        .then(result => {
            document.location.reload();
        })
}
const getComment = () => {
    fetch("/comment")
        .then(res => res.json()).then(result => {
            console.log("hello")
        }).catch(err => {
            console.log(err)
        })
}