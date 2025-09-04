// lib/agora.js
import AgoraRTC from "agora-rtc-sdk-ng";

export async function createClient() {
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  await client.join(
    process.env.NEXT_PUBLIC_AGORA_APP_ID,
    "live_news_channel", // channel name
    null, // temp token
    null // user ID (will auto-assign)
  );
  const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  await client.publish([localAudioTrack]);
  return client;
}
