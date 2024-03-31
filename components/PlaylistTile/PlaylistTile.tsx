"use client";

import { useState } from "react";
import Image from "next/image";
import { PlayCircleIcon } from "@heroicons/react/24/solid";

export interface PlaylistTileProps {
  id: string;
  name: string;
  thumbnail: string;
  count: number;
  onClick: (id: string) => void;
}

const PlaylistTile = (props: PlaylistTileProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const onMouseOver = () => {
    setIsVisible(true);
  };

  const onMouseLeave = () => {
    setIsVisible(false);
  };

  const onClick = () => {
    props.onClick(props.id);
  };

  return (
    <div
      className="flex flex-col gap-2 max-w-52 text-nowrap p-2 rounded bg-gray-800"
      role="banner"
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      tabIndex={-1}
    >
      <Image
        src={props.thumbnail}
        alt={props.name}
        width={520}
        height={520}
        priority
        onClick={onClick}
      />
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col">
          <span className="font-bold text-base truncate max-w-32">{props.name}</span>
          <span className="text-sm">{`${props.count} tracks`}</span>
        </div>
        {isVisible && <PlayCircleIcon className="h-10 w-10 spotifyIconColor cursor-pointer" />}
      </div>
    </div>
  );
};

export default PlaylistTile;
