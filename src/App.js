/*global swal*/

import React, { Component } from "react";
import logo from "./logo.svg";
import loading from "./loading.svg";
import "./App.css";
import Sound from "react-sound";
import Button from "./Button";
import AlbumCover from "./AlbumCover";

const apiToken =
  "BQD20V3kslqP0wTuMC8oDvyD7vHFMJZAHuS45KXkrddLVQXryg17LsScw6exAON0FZyhS5hNUltmRZ0m9p_U3TuMOAMqoj7bOW7cFa1f9B1vz4Swj5tp8qNavCp6kjCn_0rX77_yFIiZu4iPUnkTVifsOfNHILvQYQ";

function shuffleArray(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = getRandomNumber(counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

/* Return a random number between 0 included and x excluded */
function getRandomNumber(x) {
  return Math.floor(Math.random() * x);
}

class App extends Component {
  timeout;

  constructor() {
    super();

    this.timeout = null;

    this.state = {
      tracks: [],
      currentTrack: {},
      shuffledTracks: [],
      songsLoaded: false
    };
  }

  setGameTimeout = () => {
    console.log("Set new timeout");
    this.timeout = setTimeout(this.startNewGame, 10000);
  };

  startNewGame = () => {
    const length = this.state.tracks.length;
    const currentTrackIndex = getRandomNumber(length);
    let wrongTrackIndex1 = getRandomNumber(length);
    while (wrongTrackIndex1 === currentTrackIndex) {
      wrongTrackIndex1 = getRandomNumber(length);
    }
    let wrongTrackIndex2 = getRandomNumber(length);
    while (
      wrongTrackIndex2 === currentTrackIndex ||
      wrongTrackIndex2 === wrongTrackIndex1
    ) {
      wrongTrackIndex2 = getRandomNumber(length);
    }

    this.setState(() => ({
      currentTrack: this.state.tracks[currentTrackIndex],
      shuffledTracks: shuffleArray([
        this.state.tracks[currentTrackIndex],
        this.state.tracks[wrongTrackIndex1],
        this.state.tracks[wrongTrackIndex2]
      ]),
      songsLoaded: true
    }));
    clearTimeout(this.timeout);
    this.setGameTimeout();
  };

  componentDidMount() {
    fetch(
      "	https://api.spotify.com/v1/playlists/1wCB2uVwBCIbJA9rar5B77/tracks",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + apiToken
        }
      }
    )
      .then(response => response.json())
      .then(data => {
        this.setState(
          {
            tracks: data.items
          },
          () => {
            this.startNewGame();
            this.setGameTimeout();
          }
        );
      });
  }

  onClick = id => {
    if (id === this.state.currentTrack.track.id) {
      return swal("T'es trop forte", "success").then(() => {
        clearTimeout(this.timeout);
        this.startNewGame();
      });
    }
    swal("Loser");
  };

  render() {
    if (!this.state.songsLoaded) {
      return <img src={loading} className="App-loading" alt="loading" />;
    }

    const shuffledTracks = this.state.shuffledTracks;

    const track0 = this.state.currentTrack;

    return (
      <div className="App">
        <Sound
          url={track0.track.preview_url}
          playStatus={Sound.status.PLAYING}
        />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Bienvenue sur le Blindtest</h1>
        </header>
        <div className="App-images">
          <AlbumCover track={track0} />
        </div>
        <div className="App-buttons">
          {shuffledTracks.map(track => (
            <Button onClick={() => this.onClick(track.track.id)}>
              {track.track.name}
            </Button>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
