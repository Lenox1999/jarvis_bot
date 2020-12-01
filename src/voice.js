const ytdl = require("ytdl-core");

let playing = false;
let dispatcher;

module.exports = async (msg, args, join, connection, cmd) => {
  if (join) {
    if (msg.member.voice.channel) {
      return await msg.member.voice.channel.join();
    } else {
      msg.reply("you arent in a voice channel right now!");
    }
  } else if (!join && args[0] === "v" && connection) {
    msg.reply("Play this video now");
    dispatcher = connection.play(ytdl(args[1], { filter: "audioonly" }));
    playing = true;
  } else if (cmd === "stop" && playing == true) {
    dispatcher.pause();
  } else if (cmd === "resume") {
    dispatcher.resume();
  } else if (cmd === "leave") {
    await msg.member.voice.channel.leave();
  }
};
