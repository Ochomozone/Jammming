// import logo from './logo.svg';
import './App.css';
import React from 'react';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import Playlist from '../Playlist/Playlist';

class App extends React.Component {
  constructor (props) {
    super (props);
    this.state = { 
      searchResults: [
        {name: 'name1',artist: 'artist1', album: 'album1', id: 1}, 
        {name: 'name2',artist: 'artist2', album: 'album2', id: 2}, 
        {name: 'name3',artist: 'artist3', album: 'album3', id: 3} 
      ],
      playlistName: 'Playlist 1' ,
      playlistTracks: [
        {name: 'playlistTrack1',artist: 'playlistArtist1', album: 'playlistAlbum1', id: 4}, 
        {name: 'playlistTrack2',artist: 'playlistArtist2', album: 'playlistAlbum2', id: 5}
      ]
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
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

savePlaylist() {
  // eslint-disable-next-line
  let trackURIs = this.state.playlistTracks.map(track => track.uri);
  
}

  render () {
    return (
      <div>
  <h1>Ja<span className="highlight">mmm</span>ing</h1>
  <div className="App">
    <SearchBar />
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
}

export default App;
