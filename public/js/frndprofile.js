
const btn = document.getElementById("btn");
const follower = document.getElementById("follower");
const item1 = document.getElementById("item-1")

const follow = (_id) => {
    fetch("/following", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            _id: _id,
        })
    }).then(res => res.json())
        .then(response => {
            console.log(response)
            document.location.reload();
        })
    console.log(_id);
}

const unfollow = (_id) => {
    fetch("/unfollow", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            _id: _id,
        })
    }).then(res => res.json())
        .then(response => {
            console.log(response)
            document.location.reload();
        })
    console.log(_id);
}
