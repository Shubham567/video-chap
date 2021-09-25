import AgoraRTC  from "agora-rtc-sdk-ng";

let rtc = {
    localAudioTrack: null,
    localVideoTrack: null,
    client: null
};

let options = {
    appId: "e28ecd08f858492d884a3a9e2fe46c93",
    channel: "temp",
    token: "006e28ecd08f858492d884a3a9e2fe46c93IACPmqhmFghuk+6Gon+d9Ee9e+/XUfofozp3Hk+H3f80N8qFUwsAAAAAEADr2wYemN5PYQEAAQCP3k9h",
    // Set the user ID.
    uid: Math.floor(123456 * Math.random())
};

let remotePlayerContainer;
let localPlayerContainer;

export function initVideoContainers(inComingRef,localRef){
    remotePlayerContainer = inComingRef;
    localPlayerContainer = localRef;
}

export async function startBasicCall() {
    // Create an AgoraRTCClient object.
    
    rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    // Listen for the "user-published" event, from which you can get an AgoraRTCRemoteUser object.
    rtc.client.on("user-published", async (user, mediaType) => {
        // Subscribe to the remote user when the SDK triggers the "user-published" event
        await rtc.client.subscribe(user, mediaType);
        console.log("subscribe success");

        // If the remote user publishes a video track.
        if (mediaType === "video") {
            // Get the RemoteVideoTrack object in the AgoraRTCRemoteUser object.
            const remoteVideoTrack = user.videoTrack;
            // Dynamically create a container in the form of a DIV element for playing the remote video track.
            
            // Specify the ID of the DIV container. You can use the uid of the remote user.
            remotePlayerContainer.textContent = "Remote user " + user.uid.toString();
            remotePlayerContainer.style.width = "640px";
            remotePlayerContainer.style.height = "480px";

            // Play the remote video track.
            // Pass the DIV container and the SDK dynamically creates a player in the container for playing the remote video track.
            remoteVideoTrack.play(remotePlayerContainer);

            // Or just pass the ID of the DIV container.
            // remoteVideoTrack.play(playerContainer.id);
        }

        // If the remote user publishes an audio track.
        if (mediaType === "audio") {
            // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
            const remoteAudioTrack = user.audioTrack;
            // Play the remote audio track. No need to pass any DOM element.
            remoteAudioTrack.play();
        }

        // Listen for the "user-unpublished" event
        rtc.client.on("user-unpublished", user => {
            // Get the dynamically created DIV container.
            // Destroy the container.
            // remotePlayerContainer.remove();
        });

    });

    
}


export async function rtcJoin() {
    // Join an RTC channel.
    await rtc.client.join(options.appId, options.channel, options.token, options.uid);
    // Create a local audio track from the audio sampled by a microphone.
    rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    // Create a local video track from the video captured by a camera.
    rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    // Publish the local audio and video tracks to the RTC channel.
    await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);
    // Dynamically create a container in the form of a DIV element for playing the local video track.
    // Specify the ID of the DIV container. You can use the uid of the local user.
    localPlayerContainer.textContent = "Local user " + options.uid;
    localPlayerContainer.style.width = "640px";
    localPlayerContainer.style.height = "480px";
    // document.body.append(localPlayerContainer);

    // Play the local video track.
    // Pass the DIV container and the SDK dynamically creates a player in the container for playing the local video track.
    rtc.localVideoTrack.play(localPlayerContainer);
    console.log("publish success!");
}

export async function rtcLeave() {
    // Destroy the local audio and video tracks.
    rtc.localAudioTrack.close();
    rtc.localVideoTrack.close();

    // Traverse all remote users.
    rtc.client.remoteUsers.forEach(user => {
        // Destroy the dynamically created DIV containers.
        // const playerContainer = document.getElementById(user.uid);
        // playerContainer && playerContainer.remove();
    });

    // Leave the channel.
    await rtc.client.leave();
}

