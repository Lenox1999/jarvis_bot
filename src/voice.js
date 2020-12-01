const ytdl = require("ytdl-core");

module.exports = async (msg, args, join, connection) => {
  if (join) {
    if (msg.member.voice.channel) {
      return await msg.member.voice.channel.join();
    } else {
      msg.reply("you arent in a voice channel right now!");
    }
  } else if (!join && args[0] === "v" && connection) {
    msg.reply("Play this video now");
    connection.play(ytdl(args[1], { filter: "audioonly" }));
  }
};
