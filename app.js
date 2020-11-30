const Discord = require("discord.js");
const { prefix, token } = require("./config.json");

const client = new Discord.Client();

client.on("ready", () => {
  console.log("I'm ready");
});

client.on("message", (msg) => {
  if (!msg.content.split("")[0] === prefix || msg.author.bot) return;

  const args = msg.content.slice(prefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();

  if (cmd === "args-info") {
    if (!args.length) {
      msg.channel.send(`You didnt provide any args, ${msg.author.username}`);
      return;
    }
    msg.channel.send(`Your arguments: ${args}`);
  } else if (cmd === "kick") {
    if (!msg.mentions.users.size) {
      return msg.channel.send(
        `Sorry Pleb, you didnt mentioned user(s) to kick`
      );
    }
    const taggedUser = msg.mentions.users.first();

    msg.channel.send(`You wanted to kick ${taggedUser}`);
  }

  if (cmd === "avatar") {
    if (!msg.mentions.users.size) {
      return msg.channel.send(
        `This is your avatar: ${msg.author.avatarURL({
          format: "png",
          dynamic: true,
        })}`
      );
    }
    msg.mentions.users.forEach((user) => {
      msg.channel.send(
        `${user.username}'s avatar: ${user.avatarURL({
          dynamic: true,
          format: "png",
        })}`
      );
    });
  }
});

client.login(token);
