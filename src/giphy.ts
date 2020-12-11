const { giphy_api_key } = require("../config.json");

const Axios = require("axios");

module.exports = {
  name: "giphy",
  desc: "gives access to giphy API from Discord",
  execute(msg, args) {
    if (!args.length) {
      return msg.reply(
        'this functionality is there to get some gifs from the very popular platform Giphy. Search for something like "Tony Stark" and see what happens'
      );
    }
    let query, length;

    // checks if last element of args is a number
    // last element can also be used as a indicator for length
    const lastNumberIsNotNumber = isNaN(parseInt(args.slice(-1)[0]));

    if (lastNumberIsNotNumber) {
      length = 1;
      query = args.join("+");
    } else {
      query = args.slice(0, args.length - 1).join("+");
      length = parseInt(args.slice(-1)[0]);
      if (length > 5) {
        length = 5;
      }
    }

    Axios.get(
      `https://api.giphy.com/v1/gifs/search?q=${query}&api_key=${giphy_api_key}&limit=${length}`
    ).then((res) => {
      if (length == 1) {
        msg.channel.send(res.data.data[0].url);
      } else {
        res.data.data.forEach((gif) => {
          msg.channel.send(gif.url);
        });
      }
    });
  },
};
