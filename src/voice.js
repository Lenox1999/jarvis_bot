const ytdl = require("ytdl-core");
const stringIsLink = require("../utils/stringIsLink");
const youtubeSearchApiWrapper = require("../utils/youtubeSearchApiWrapper");
// const getYTTitle = require("get-youtube-title");
const extractWatchIds = require("../utils/extractWatchIds");

const { saveConn } = require("../app");

let playing = false;
let dispatcher;
let queue = [];
let msg;

module.exports = async (_msg, args, join, connection, cmd) => {
  if (connection) {
    saveConn(connection);
  }
  msg = _msg;
  if (cmd === "stop" || cmd === "skip" || (cmd === "leave" && !connection)) {
    return msg.reply(
      "you cant use that command when i am not connected to a voice channel right now"
    );
  } else if (!connection) {
    if (msg.member.voice.channel && join) {
      connection = await msg.member.voice.channel.join();
    } else {
      msg.reply("you arent in a voice channel right now!");
    }
  }
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
        //TODO: loop function and share function

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
      } else if (dispatcher && playing && stringIsLink(args[0])) {
        //means playing is already playing a song
        msg.reply("added this vid to queue");
        queue.push(args[0]);
      } else if (dispatcher && !playing) {
        queue.push(args[0]);
        player(connection);
      } else if (!stringIsLink(args[0]) && !playing) {
        const { link, title } = await youtubeSearchApiWrapper(args);
        // msg.channel.send(`Playing now: ${title}`);
        // msg.channel.send(thumbNail);
        console.log(link, title);
        queue.push(link);
        player(connection, title);
      } else if (!stringIsLink(args[0])) {
        const { link, title } = await youtubeSearchApiWrapper(args);
        console.log(link, title);
        msg.reply("yo, added this vid to the queue");
        queue.push(link);
      }
  } else if (cmd === "stop" && playing == true) {
    queue = [];
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
  } else if (cmd === "skip" && dispatcher && queue.length - track > 0) {
    dispatcher.pause();
    track++;
    player(connection);
  }
};

let track = 1;

const player = async (connection, _title) => {
  try {
    playing = true;

    let title = _title;
    if (!title) {
      const res = await youtubeSearchApiWrapper(
        extractWatchIds(queue[track - 1]),
        true
      );
      title = res.title;
    }

    msg.channel.send(`Now playing: **${title}**`);
    (dispatcher = connection.play(
      ytdl(queue[track - 1], { filter: "audioonly" })
    )).once("finish", checkQueue.bind(this, connection));
  } catch (err) {
    console.log(err);
    msg.reply("sorry but something has gone wrong");
    playing = false;
  }
};

const checkQueue = (connection) => {
  track++;
  if (queue[track - 1]) {
    player(connection);
  } else {
    playing = false;
    queue = [];
    track = 1;
    dispatcher = undefined;
  }
};
