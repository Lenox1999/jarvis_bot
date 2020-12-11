const axios = require("axios");
const { google_api_key, youtube_base_url } = require("../config.json");

module.exports = async (args:  string[], link?: string) => {
  let search;
  if (!link) {
    args.length > 1 ? (search = args.join("%20"))  : (search = args);
  } else {
    search = args[0];
  }
  const url = `https://www.googleapis.com/youtube/v3/search?key=${google_api_key}&type=video&part=snippet&maxResults=10&q=${search}`;
  let res = await axios.get(url);
  // console.log(res.data);
  return {
    link: youtube_base_url + res.data.items[0].id.videoId,
    title: res.data.items[0].snippet.title,
    thumbNail: res.data.items[0].snippet.thumbnails.default.url,
  };
};
