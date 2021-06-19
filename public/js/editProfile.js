const wrapper = document.querySelector(".wrapper");
const photo = document.querySelector("#photo");
const file = document.querySelector("#file");
const upload = document.querySelector(".upload");

//if user hover on image
wrapper.addEventListener("mouseenter", function () {
    upload.style.display = "block";
})
//if user is out of the iamge
wrapper.addEventListener("mouseleave", function () {
    upload.style.display = "none";
})