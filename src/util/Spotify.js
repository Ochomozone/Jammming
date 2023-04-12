

const clientId = '6285d97a22334bc5a7a0f23b8ee1b57d' ;
const redirectURI = "http://ochomozone_jammming.surge.sh" ;
let userToken;
const Spotify = {
  getAccessToken() {
    if (userToken) {
      return userToken;
    }
    //check for access token match
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      userToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => (userToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");
      return userToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = accessUrl;
    }
  },
    
    async search (searchTerm) {
      //console.log('spotify search initated');
      const accessToken = await Spotify.getAccessToken();
      const urlToFetch =  `https://api.spotify.com/v1/search?type=track&q=${searchTerm}`;
      try {
        const response = await fetch(urlToFetch, {
          headers: {Authorization: `Bearer ${accessToken}`}
        });
        const jsonResponse = await response.json();
        const foundTracks = jsonResponse.tracks;
        if (!foundTracks) { 
          return [] 
        } else {
          return foundTracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }))
        }
      } catch (error){
        console.log(error);
      }
    }
    ,

    async savePlaylist (name, trackURIs) {
      // console.log('savePlaylist initiated');
      if (!(name && trackURIs)) {
        return;
      } else {
        try {
          const accessToken = Spotify.getAccessToken();
          const headers = {Authorization: `Bearer ${accessToken}`};
          let userID;
          let playlistID;
          const response = await fetch('https://api.spotify.com/v1/me', {headers: headers});
          const jsonResponse = await response.json();
          
          userID = jsonResponse.id;
          // console.log(userID);
    
          const newPlaylistResponse = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({ name: name })
          });
          const newPlaylistJSON = await newPlaylistResponse.json();
          playlistID = newPlaylistJSON.id;
    
          let Response = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({uris: trackURIs})
          });
            Response = await Response.json();
            // console.log('Save successful');
            return Response;
        } catch (error) {
          console.log(error);
        }
      }
    }
      

}

export default Spotify;