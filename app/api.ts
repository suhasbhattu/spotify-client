import axios from "axios";

const instance = axios.create({
  baseURL: "https://spotify-server-nine.vercel.app",
});

export const getAuthToken = async () => {
  const response = await instance.get("/auth/token");
  return response;
};

export const getAllPlaylists = async () => {
  const response = await instance.get("/playlists");
  return response;
};

export const getUser = async () => {
  const response = await instance.get("/user");
  return response;
};

export const transferPlayback = async (deviceId: string) => {
  const response = await instance.post(`/player/${deviceId}`);
  return response;
};

export const resumePlayback = async (deviceId: string) => {
  const response = await instance.post(`/player/play/${deviceId}`);
  return response;
};

export const pausePlayback = async (deviceId: string) => {
  const response = await instance.post(`/player/pause/${deviceId}`);
  return response;
};

export const nextPlayback = async (deviceId: string) => {
  const response = await instance.post(`/player/next/${deviceId}`);
  return response;
};

export const previousPlayback = async (deviceId: string) => {
  const response = await instance.post(`/player/previous/${deviceId}`);
  return response;
};

export const seekPlayback = async (deviceId: string, position: number) => {
  const body = { position: position };
  const response = await instance.post(`/player/seek/${deviceId}`, body);
  return response;
};

export const volumePlayback = async (deviceId: string, volume: number) => {
  const body = { volume: volume };
  const response = await instance.post(`/player/volume/${deviceId}`, body);
  return response;
};
