// import logo from './logo.svg';
import './App.css';
import React from 'react';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor (props) {
    super (props);
    this.state = { 
      searchResults: [],
      playlistName: 'Playlist 1' ,
      playlistTracks: []
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack (track) {
    let playlist = this.state.playlistTracks;
    if (playlist.find(existingTrack => existingTrack.id === track.id)) {
      return;

    } else {
      playlist.push(track);
      this.setState({playlistTracks: playlist});
    }
  }

  removeTrack (track) {
    let playlist = this.state.playlistTracks;
    let targetTrack = playlist.find(existingTrack => existingTrack.id === track.id); 
    if (targetTrack) {
      for (let i = 0; i < playlist.length; i++) {
        if (playlist[i] === targetTrack) {
            playlist.splice(i, 1);
        }
    }
    } 
    this.setState({playlistTracks: playlist});
  }
updatePlaylistName (newPlaylistName) {
  this.setState({playlistName: newPlaylistName});
}

async savePlaylist() {
  let trackURIs = this.state.playlistTracks.map(track => track.uri);
  console.log(trackURIs);
  try {
    let saveSuccess = await Spotify.savePlaylist(this.state.playlistName, trackURIs);
    if (saveSuccess.snapshot_id) {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      });
    }
  } catch (error) {
    console.log(error);
    alert (error);
  }
}

  
async search(searchTerm) {
  let results = await Spotify.search(searchTerm);
  this.setState({searchResults: results});
}
 
render () {
  return (
    <div>
<h1>Ja<span className="highlight">mmm</span>ing</h1>
<div className="App">
  <SearchBar onSearch={this.search}/>
  <div className="App-playlist">
    <SearchResults searchResults={this.state.searchResults} 
    onAdd={this.addTrack} />
    <Playlist playlist={this.state.playlistName} 
    playlistTracks={this.state.playlistTracks} 
    onRemove={this.removeTrack}
    onNameChange={this.updatePlaylistName}
    onSave={this.savePlaylist} 
    />
  </div>
</div>
</div>
  )
}

};



  


export default App;
