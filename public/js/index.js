
// function openLoginForm() {
//     document.body.classList.add("showLoginForm");
// }
// function closeLoginForm() {
//     document.body.classList.remove("showLoginForm");
// }
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
$(function () {
    $("#button-addon2").autocomplete({
        source: function (req, res) {
            $.ajax({
                url: "autocomplete/",
                dataType: "jsonp",
                method: "GET",
                data: {
                    term: req.term,
                },
                success: function (data) {
                    res(data);
                },
                error: function (err) {
                    console.log("hi error")
                    console.log(err.status);
                }
            })
        },
        minLength: 1,
        select: function (event, ui) {
            if (ui.item) {
                $("#button-addon2").text(ui.item.label);
            }
        }
    })
});
const wrap = document.querySelector(".wrap");
const button = document.querySelector(".btn-primary")
const postId = document.querySelector("#postId")
const text = document.querySelector("#text")
const commentList = document.querySelector(".commentList")

const showBox = (index) => {
    let postID = document.getElementsByClassName("wrap")[index].id;
    console.log(postID)
    postId.value = postID;
    wrap.style.display = "flex";

    fetch("/allComment", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            postId: postID
        })
    }).then(res => res.json()).then(response => {
        console.log(response);
        if (response.length != 0) {
            for (let i = 0; i < 3; i++) {
                //create li
                const li = document.createElement("li");
                li.classList.add("commentLi");
                //create div
                const div1 = document.createElement("div")
                div1.classList.add("commenterImage")
                var img = document.createElement('img');
                if (response[i].postedBy.image != "")
                    img.src = `/upload/${response[i].postedBy.image}`;
                else
                    img.src = "https://profiles.utdallas.edu/img/default.png";
                div1.appendChild(img)
                const div2 = document.createElement("div");
                div2.classList.add("commentText")
                const p = document.createElement("p")
                p.innerText = response[i].text;
                div2.appendChild(p)
                li.appendChild(div1)
                li.appendChild(div2)
                commentList.appendChild(li)
            }
        }
    })
}
const removeBox = () => {
    wrap.style.display = "none";
    document.location.reload()
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
// $("#likebtn").on("click", function (event) {
//     event.preventDefault();
//     event.stopPropagation();
//     console.log("hy")
//     $.ajax({
//         url: "/like",
//         type: "POST",
//         contentType: "application/json",
//         data: JSON.stringify({
//             id: $("#postValue").val()
//         })
//     }).done(function (result) {
//         console.log($("#postValue").val())
//         const i = $("#likeValue").val();
//         console.log(i)
//         getLikes(result, i)
//     }).fail(function (err) {
//         console.log(err)
//     })
// });

// const getLikes = (result, i) => {
//     if (result != "liked") {
//         console.log(result.length)
//         const x = document.getElementsByClassName("like")[i].innerText = result.length;
//     }
//     else {
//         alert("post already liked")
//     }
// }