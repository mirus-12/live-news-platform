import { useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";


const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID;
const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });


export default function LiveAudio() {
const [joined, setJoined] = useState(false);
const [localTrack, setLocalTrack] = useState(null);


async function joinChannel(role) {
try {
client.setClientRole(role);
// channel name 'news-audio' is used for everyone; you can change it
const uid = await client.join(APP_ID, "news-audio", null, null);


if (role === "host") {
const micTrack = await AgoraRTC.createMicrophoneAudioTrack();
await client.publish([micTrack]);
setLocalTrack(micTrack);
}


client.on("user-published", async (user, mediaType) => {
await client.subscribe(user, mediaType);
if (mediaType === "audio") {
user.audioTrack.play();
}
});


setJoined(true);
} catch (err) {
console.error(err);
alert("Agora join error: " + err.message);
}
}


async function leaveChannel() {
try {
if (localTrack) {
localTrack.stop();
localTrack.close();
}
await client.leave();
setJoined(false);
} catch (err) {
console.error(err);
}
}


return (
<div className="card">
<h3>🔴 Live Audio</h3>
{!joined ? (
<div style={{ display: "flex", gap: 8 }}>
<button className="btn btn-danger" onClick={() => joinChannel("host")}>Go Live</button>
<button className="btn btn-primary" onClick={() => joinChannel("audience")}>Listen</button>
</div>
) : (
<button className="btn" onClick={leaveChannel}>Leave</button>
)}
</div>
);
}
