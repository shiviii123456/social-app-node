
const btn = document.getElementById("btn");
const follower = document.getElementById("follower");
console.log(follower)
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
            btn.innerText = "Unfollow";
            follower.innerHTML = response.follower.length;
        })
    console.log(_id);
}