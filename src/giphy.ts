import obj from '../config';

const giphyApiKey = obj.giphy_api_key;

import Axios from "axios";
import { Message } from "discord.js";

export default {
  name: "giphy",
  desc: "gives access to giphy API from Discord",
  execute(msg: Message, args: string[]) {
    if (!args.length) {
      return msg.reply(
        'this functionality is there to get some gifs from the very popular platform Giphy. Search for something like "Tony Stark" and see what happens'
      );
    }
    let query, length: number;

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
      `https://api.giphy.com/v1/gifs/search?q=${query}&api_key=${giphyApiKey}&limit=${length}`
    ).then((res) => {
      if (length == 1) {
        msg.channel.send(res.data.data[0].url);
      } else {
        res.data.data.forEach((gif: {url: string}) => {
          msg.channel.send(gif.url);
        });
      }
    });
  },
};
