"use client";

import { useEffect, useState } from "react";
import { PlayCircleIcon, PauseCircleIcon } from "@heroicons/react/24/solid";
import {
  ForwardIcon,
  BackwardIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/outline";
import {
  nextPlayback,
  pausePlayback,
  previousPlayback,
  resumePlayback,
  seekPlayback,
  transferPlayback,
  volumePlayback,
} from "@/app/api";
import Image from "next/image";
import RangeSlider from "../RangeSlider/RangeSlider";

interface MediaPlayerProps {
  token: string;
}

interface Track {
  id: string;
  name: string;
  albumName: string;
  albumArt: string;
  artists: string[];
  duration: number;
}

const MediaPlayer = (props: MediaPlayerProps) => {
  const [track, setTrack] = useState<Track | undefined>(undefined);
  const [deviceId, setDeviceId] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [currentVolume, setCurrentVolume] = useState(50);
  const [duration, setDuration] = useState("");
  const [currentTimeText, setCurrentTimeText] = useState("");

  const onTrackSeek = (position: number) => {
    seekPlayback(deviceId, position);
  };

  const onVolumeSeek = (volume: number) => {
    setCurrentVolume(volume);
    volumePlayback(deviceId, volume);
  };

  const formatTime = (time: number) => {
    const seconds = time % 60;
    const minutes = Math.floor(time / 60);
    const secondsText = seconds < 10 ? `0${seconds}` : seconds;
    const minutesText = minutes < 10 ? `0${minutes}` : minutes;
    return `${minutesText}:${secondsText}`;
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const playerInstance = new window.Spotify.Player({
        name: "Web playback SDK",
        getOAuthToken: (cb: any) => {
          cb(props.token);
        },
        volume: 0.5,
      });

      playerInstance.addListener("ready", (params: any) => {
        console.log("Ready with Device ID", params.device_id);
        setDeviceId(params.device_id);
        transferPlayback(params.device_id);
      });

      playerInstance.addListener("not_ready", (params: any) => {
        console.log("Device ID has gone offline", params.device_id);
      });

      playerInstance.addListener("player_state_changed", (state: any) => {
        if (!state) {
          return;
        }
        if (state.track_window?.current_track) {
          const newTrack: Track = {
            id: state.track_window?.current_track.id,
            name: state.track_window?.current_track.name,
            albumName: state.track_window?.current_track.album.name,
            albumArt: state.track_window?.current_track.album.images[0].url,
            artists: state.track_window?.current_track.artists.map(
              (artist: any) => artist.name
            ),
            duration: Math.floor(
              state.track_window?.current_track.duration_ms / 1000
            ),
          };
          setTrack(newTrack);
          setIsPlaying(!state.paused);
          setCurrentPosition(Math.floor(state.position / 1000));
          setDuration(formatTime(newTrack.duration));
          setCurrentTimeText(formatTime(Math.floor(state.position / 1000)));
        }
      });

      playerInstance.connect();
    };
  }, [props.token]);

  useEffect(() => {
    const updateCurrentTime = setInterval(() => {
      if (isPlaying) {
        setCurrentPosition((currentPosition) => currentPosition + 1);
        setCurrentTimeText(formatTime(currentPosition));
      }
    }, 1000);
    return () => {
      clearInterval(updateCurrentTime);
    };
  }, [currentPosition, isPlaying]);

  return (
    <div className="player flex flex-row justify-between items-center bg-gray-800 h-24 gap-12 w-full">
      <div className="flex flex-row gap-4 w-96 pl-4">
        <Image
          className="rounded-sm shadow-2xl"
          src={track?.albumArt ?? ""}
          alt={track?.albumName ?? ""}
          width={80}
          height={80}
        />
        <div className="flex flex-col justify-center w-64">
          <span className="font-bold text-lg max-w-96 truncate">
            {track?.name}
          </span>
          <span className="text-sm max-w-96 truncate">
            {track?.artists.join(", ")}
          </span>
        </div>
      </div>
      <div className="flex flex-col justify-center px-8 flex-1">
        <div className="flex flex-row justify-center items-center gap-4">
          <BackwardIcon
            className="h-8 w-8 spotifyIconColor cursor-pointer"
            onClick={() => {
              previousPlayback(deviceId);
            }}
          />
          {!isPlaying && (
            <PlayCircleIcon
              className="h-14 w-14 spotifyIconColor cursor-pointer"
              onClick={() => {
                resumePlayback(deviceId);
              }}
            />
          )}
          {isPlaying && (
            <PauseCircleIcon
              className="h-14 w-14 spotifyIconColor cursor-pointer"
              onClick={() => {
                pausePlayback(deviceId);
              }}
            />
          )}
          <ForwardIcon
            className="h-8 w-8 spotifyIconColor cursor-pointer"
            onClick={() => {
              nextPlayback(deviceId);
            }}
          />
        </div>
        <div className="flex flex-row gap-4">
          <span>{currentTimeText}</span>
          <RangeSlider
            max={track?.duration ?? 0}
            min={0}
            value={currentPosition}
            onChange={onTrackSeek}
          />
          <span>{duration}</span>
        </div>
      </div>
      <div className="flex flex-row gap-4 pr-4 max-w-64">
        <SpeakerXMarkIcon
          className="h-8 w-8 spotifyIconColor cursor-pointer"
          onClick={() => onVolumeSeek(0)}
        />
        <RangeSlider
          max={100}
          min={0}
          value={currentVolume}
          onChange={onVolumeSeek}
        />
        <SpeakerWaveIcon
          className="h-8 w-8 spotifyIconColor cursor-pointer"
          onClick={() => onVolumeSeek(100)}
        />
      </div>
    </div>
  );
};

export default MediaPlayer;
