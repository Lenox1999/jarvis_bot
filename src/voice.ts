import { Message, StreamDispatcher, VoiceConnection } from "discord.js";

import ytdl from "ytdl-core";
import stringIsLink from "../utils/stringIsLink";
import youtubeSearchApiWrapper from "../utils/youtubeSearchApiWrapper";
// const getYTTitle = require("get-youtube-title");
import extractWatchIds from "../utils/extractWatchIds";

import { saveConn } from "../app";

let playing = false;
let dispatcher: StreamDispatcher;
let queue: string[] = [];
let msg: Message;

export const voice = async (
  _msg: Message,
  args: string[],
  join: boolean,
  connection: VoiceConnection,
  cmd?: string
) => {
  // if (!msg.author) return msg.reply('Something bad happened');
  msg = _msg;
  if (cmd === "stop" || cmd === "skip" || (cmd === "leave" && !connection)) {
    return msg.reply(
      "you cant use that command when i am not connected to a voice channel right now"
    );
  } else if (!connection) {
    if (msg.member && msg.member.voice.channel) {
      connection = await msg.member.voice.channel.join();
      if (connection) saveConn(connection);
    } else {
      return msg.reply("you arent in a voice channel right now!");
    }
  }
  if (join) {
    if (msg.member!.voice.channel && join) {
      return await msg.member!.voice.channel.join();
    } else {
      msg.reply("you arent in a voice channel right now!");
    }
  } else if (cmd === "play") {
    if (args[0])
      if (!dispatcher && stringIsLink(args[0]) && !playing) {
        // means bot isnt initialized yet
        msg.reply("Play this video now");
        // const watchId = extractWatchIds(args[0]);
        queue.push(args[0]);
        if (!connection) return;
        player(connection);
        //extract watch id from link (ids are 11 chars long)
      } else if (dispatcher && playing && stringIsLink(args[0])) {
        //means playing is already playing a song
        msg.reply("added this vid to queue");
        queue.push(args[0]);
      } else if (dispatcher && !playing) {
        queue.push(args[0]);
        if (!connection) return;
        player(connection);
      } else if (!stringIsLink(args[0]) && !playing) {
        const { link, title } = await youtubeSearchApiWrapper(args);
        // msg.channel.send(`Playing now: ${title}`);
        // msg.channel.send(thumbNail);
        console.log(link, title);
        queue.push(link);
        if (!connection) return;
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
    msg.member!.voice.channel!.leave();
  } else if (cmd === "play_searched") {
    //search on youtube with youtube search api
    let search;
    // args.length > 1 ? (search = args.join("%20")) : (search = args);
    search = args;
    let searchResult = await youtubeSearchApiWrapper(search);
    const videoToPlay = searchResult.link;
    const name = searchResult.title;
    const thumbNail = searchResult.thumbNail;
    msg.reply(`Playing now ${name}`);
    msg.channel.send(thumbNail);

    if (!connection) return;
    dispatcher = connection.play(ytdl(videoToPlay, { filter: "audioonly" }));
    playing = true;
  } else if (cmd === "skip" && dispatcher && queue.length - track > 0) {
    dispatcher.pause();
    track++;
    if (!connection) return;
    player(connection);
  }
};

let track = 1;

const player = async (connection: VoiceConnection, _title?: string) => {
  try {
    playing = true;

    let title = _title;
    if (!title) {
      const res = await youtubeSearchApiWrapper([
        extractWatchIds(queue[track - 1]),
      ]);
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

const checkQueue = (connection: VoiceConnection) => {
  track++;
  if (queue[track - 1]) {
    player(connection);
  } else {
    playing = false;
    queue = [];
    track = 1;
    dispatcher.pause();
  }
};
