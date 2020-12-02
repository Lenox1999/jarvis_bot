const ytdl = require("ytdl-core");
const extractWatchIds = require("../utils/extractWatchIds");
const stringIsLink = require("../utils/stringIsLink");
const youtubeSearchApiWrapper = require("../utils/youtubeSearchApiWrapper");

const coreYTurl = "https://www.youtube.com/watch?v=";

let playing = false;
let dispatcher;
const queue = [];
let msg;

module.exports = async (_msg, args, join, connection, cmd) => {
  msg = _msg;
  if (join) {
    if (msg.member.voice.channel && join) {
      return await msg.member.voice.channel.join();
    } else {
      msg.reply("you arent in a voice channel right now!");
    }
  } else if (cmd === "play") {
    if (args[0])
      if (!dispatcher && stringIsLink(args[0]) && !playing) {
        // multiple ways to use this function
        // 1. : v to play it directly with a link
        // 2. : s to search for a video with search api
        // 3. : to queue a song when bot is already playing

        //only for reference
        // dispatcher = connection.play(ytdl(args[1], { filter: "audioonly" }));
        // playing = true;
        // only for reference

        // new code

        // means bot isnt initialized yet
        msg.reply("Play this video now");
        // const watchId = extractWatchIds(args[0]);
        queue.push(args[0]);
        player(connection);
        //extract watch id from link (ids are 11 chars long)
      } else if (dispatcher && playing) {
        //means playing is already playing a song
        const watchId = extractWatchIds(args[0]);
        msg.reply("added this vid to queue");
        queue.push(coreYTurl + watchId);
        player(connection);
      }
  } else if (cmd === "stop" && playing == true) {
    dispatcher.pause();
    playing = false;
  } else if (cmd === "resume") {
    dispatcher.resume();
  } else if (cmd === "leave") {
    await msg.member.voice.channel.leave();
  } else if (cmd === "play_searched") {
    //search on youtube with youtube search api
    let search;
    args.length > 1 ? (search = args.join("%20")) : (search = args);
    let searchResult = await youtubeSearchApiWrapper(search);
    const videoToPlay = searchResult.data.items[0].id.videoId;
    const name = searchResult.data.items[0].snippet.title;
    const thumbNail = searchResult.data.items[0].snippet.thumbnails.default.url;
    msg.reply(`Playing now ${name}`);
    msg.channel.send(thumbNail);
    dispatcher = connection.play(ytdl(videoToPlay, { filter: "audioonly" }));
    playing = true;
  }
};

const player = (connection) => {
  queue.forEach(async (song) => {
    console.log(connection, queue);
    try {
      dispatcher = await connection.play(ytdl(song, { filter: "audioonly" }));
    } catch (err) {
      console.log(err);
      msg.reply("sorry but something has gone wrong");
    }
  });
};
