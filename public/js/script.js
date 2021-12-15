const videoContainer = document.getElementById("receivervideo");
const videoContainerretour = document.getElementById("emittervideo");
const myVideo = document.createElement('video');
myVideo.classList.add("emittervideo1");
myVideo.muted = true;
const socket = io("/");

const myPeer = new Peer(undefined, {
    host: "peerjs-server.herokuapp.com",
    secure: true,
    port: 443,
});
let peers = {};
console.log(navigator.mediaDevices.enumerateDevices()); 
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then((stream)=> {

    myVideo.srcObject = stream;
    myVideo.addEventListener("loadedmetadata", () => {
        myVideo.play();
    });
    videoContainerretour.append(myVideo);

    myPeer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on("stream", userVideoStream => {
            addVideoStream(video, userVideoStream);
        })
    });

    socket.on('user-connected' , (userId) => {
        console.log("userId", userId);
        connectToNewUser(userId, stream);
    });
});

myPeer.on("open", (id) => {
    socket.emit("join-room", ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream);
    const video = document.createElement("video");
    video.classList.add("receivervideo1");
    call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
    });
    call.on('close', () => {
        video.remove();
    });

    peers[userId] = call;
}

function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play();
    });
    videoContainer.append(video);
};