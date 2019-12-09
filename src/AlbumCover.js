import React from "react";

export default function AlbumCover({ track }) {
  const mediumImg = track.track.album.images[1];
  return <img src={mediumImg.url}></img>;
}
