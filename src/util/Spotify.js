

const clientId = '6285d97a22334bc5a7a0f23b8ee1b57d' ;
const redirectURI = "http://localhost:3000/" ;
let userToken;
const Spotify = {
    getAccessToken () {
      //console.log('getAccessToken has been called')
        if (userToken) {
          //console.log('accessToken already exists');
            return userToken;
            
        } else {
            //checking for match on token
            const token = window.location.href.match(/access_token=([^&]*)/);
            const expiry = window.location.href.match(/expires_in=([^&]*)/);

            if (token && expiry) {
                userToken = token[1];
                const expiresIn =Number[1];
                //console.log(`Access token acquired ${userToken}`);

                //Clearing access token
                window.setTimeout(() => userToken ='', expiresIn * 1000);
                window.history.pushState('Access Token', null, '/');
                
                return userToken;
            } else {
                window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            
            }
        }
    },
    
    async search (searchTerm) {
      //console.log('spotify search initated');
      const accessToken = Spotify.getAccessToken();
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
      console.log('savePlaylist initiated');
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
    
          const newPlaylistResponse = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({ name: name })
          });
          const newPlaylistJSON = await newPlaylistResponse.json();
          playlistID = newPlaylistJSON.id;
    
          const newPlaylistTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({uris: trackURIs})
          });
          return newPlaylistTracksResponse.json();
        } catch (error) {
          console.log(error);
        }
      }
    }
      

}

export default Spotify;