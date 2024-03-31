"use client";

import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAuthToken, getAllPlaylists, getUser } from "../api";
import { PlaylistTileProps } from "@/components/PlaylistTile";
import PlaylistTile from "@/components/PlaylistTile/PlaylistTile";
import MediaPlayer from "@/components/MediaPlayer/MediaPlayer";

const HomePage = () => {
  const [token, setToken] = useState("");
  const [tokenFetched, setTokenFetched] = useState(false);
  const [userName, setUserName] = useState("");
  const [playlists, setPlaylists] = useState<PlaylistTileProps[]>([]);
  const [playlistCount, setPlaylistCount] = useState(0);

  const onTileClick = () => {};

  const getPlaylistTiles = () => {
    return playlists?.map((playlist) => {
      return (
        <PlaylistTile
          id={playlist.id}
          name={playlist.name}
          onClick={onTileClick}
          thumbnail={playlist.thumbnail}
          count={playlist.count}
          key={playlist.id}
        />
      );
    });
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser();
        setUserName(response.data.name);
      } catch (error) {
        console.log(error);
      }
    };

    const getPlaylists = async () => {
      try {
        const response = await getAllPlaylists();
        setPlaylists(response.data.items);
        setPlaylistCount(response.data.count);
      } catch (error) {
        console.log(error);
      }
    };

    const getToken = async () => {
      const response = await getAuthToken();
      const fetchedToken = response.data.access_token;
      if (fetchedToken.length > 0) {
        setToken(response.data.access_token);
        setTokenFetched(true);
        fetchUser();
        getPlaylists();
      }
    };
    if (token.length === 0) {
      getToken();
    }
  }, [token]);

  return (
    <div className="flex flex-col h-screen justify-between">
      <div className="header flex flex-row justify-between items-center h-16 px-40 py-2 bg-gray-800 sticky">
        <div className="flex flex-row gap-4">
          <Image
            src={"/Spotify_Icon_RGB_Green.png"}
            alt="Spotify"
            width={32}
            height={32}
            priority
          />
          <Link href={"/home"} className="font-bold text-lg">
            Spotify Web App
          </Link>
        </div>
        <div className="flex justify-end gap-8">
          <span className="text-md">{userName}</span>
          <Link href={"http://localhost:5000/auth/logout"}>Sign Out</Link>
        </div>
      </div>
      <div className="content px-40 my-10 overflow-scroll">
        {token.length !== 0 && tokenFetched && (
          <Fragment>
            <h1 className="font-bold text-lg">{`PLaylists (${playlistCount})`}</h1>
            <div className="flex flex-row flex-wrap gap-8 my-4">
              {getPlaylistTiles()}
            </div>
          </Fragment>
        )}
      </div>
      <div className="bottom-0">
        <MediaPlayer token={token} />
      </div>
    </div>
  );
};

export default HomePage;
