

const clientId = '6285d97a22334bc5a7a0f23b8ee1b57d' ;
const redirectURI = "http://localhost:3000/" ;
let userToken;
const Spotify = {
    getAccessToken () {
        if (userToken) {
            return userToken;
        } else {
            //checking for match on token
            const token = window.location.href.match(/access_token=([^&]*)/);
            const expiry = window.location.href.match(/expires_in=([^&]*)/);

            if (token && expiry) {
                userToken = token[1];
                const expiresIn =Number[1];

                //Ckearing access token
                window.setTimeout(() => userToken ='', expiresIn * 1000);
                window.history.pushState('Access Token', null, '/');
                return userToken;
            } else {
                window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            
            }
        }
    }

}

export default Spotify;