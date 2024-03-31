"use client";

import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAuthToken } from "./api";

const LoginPage = () => {
  const [token, setToken] = useState("");
  const [tokenFetched, setTokenFetched] = useState(false);

  useEffect(() => {
    const getToken = async () => {
      const response = await getAuthToken();
      setToken(response.data.access_token);
      setTokenFetched(true);
    };
    getToken();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-8">
      {token.length === 0 && tokenFetched && (
        <Fragment>
          <Image
            src={"/Spotify_Icon_RGB_Green.png"}
            alt="Spotify"
            width={64}
            height={64}
            priority
          />
          <Link
            href={"http://localhost:5000/auth/login"}
            className="spotifyButton spotifyColor py-2 px-5 rounded-md"
          >
            Login with Spotify
          </Link>
        </Fragment>
      )}
    </div>
  );
};

export default LoginPage;
