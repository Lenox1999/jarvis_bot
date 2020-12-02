const axios = require("axios");
const { google_api_key } = require("../config.json");

module.exports = async (searchTerms) => {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${google_api_key}&type=video&part=snippet&maxResults=10&q=${searchTerms}`;
  let response = await axios.get(url);
  return response;
};
