import querystring from "querystring";
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const client_id = "6c720b451d724d4c950ff4c9a7414368";
const client_secret = "318396d27e1e481590ca7c03708d3cc6";
const refresh_token = "AQAIeCmCv1jBdgkpc9qhgD7GaP9zGg24cCbBEIOoBJbSvyG2qvfjDm__nvMX8R09D2CK2eh7DAWf2qQXv7AZX77U9vNd4tyqvzCE3gRBttTT8K2mD6DvQmfWeV83VOrju9c";
const getAccessToken = async () => {
    const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
    const response = await fetch(TOKEN_ENDPOINT, {
        method: "POST",
        headers: {
            Authorization: `Basic ${basic}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: querystring.stringify({
            grant_type: "refresh_token",
            refresh_token,
        }),
    });
    
    return response.json();
};

export const getNowPlaying = async (client_id, client_secret, refresh_token) => {
    const { access_token } = await getAccessToken(
        client_id,
        client_secret,
        refresh_token
    );
    return fetch(NOW_PLAYING_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
};

export default async function getNowPlayingItem(
    client_id,
    client_secret,
    refresh_token
) {
    const response = await getNowPlaying(client_id, client_secret, refresh_token);
    if (response.status === 204 || response.status > 400) {
        return false;
      }

    const song = await response.json();
    const albumImageUrl = song.item.album.images[0].url;
    const artist = song.item.artists.map((_artist) => _artist.name).join(", ");
    const isPlaying = song.is_playing;
    const songUrl = song.item.external_urls.spotify;
    const title = song.item.name;
    
    return {
        albumImageUrl,
        artist,
        isPlaying,
        songUrl,
        title,
    };
}


export const allInfo = await getNowPlayingItem(client_id, client_secret, refresh_token);
