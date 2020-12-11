const Discord = require("discord.js");

const giphy = require("./src/giphy");
const mentionRole = require("./src/mentionRole");
const voice = require("./src/voice");
// only needed in production
const config = require("./config.json");

// assume dev mode
require("dotenv").config();

let prefix, token;
// check if node env 'production' is set which means bot is in prod mode
if (process.env.NODE_ENV === "production") {
  prefix = config.prefix;
  token = config.token;
} else {
  token = process.env.BOT_TOKEN;
  prefix = process.env.BOT_PREFIX;
}

const client = new Discord.Client();

let conn;

console.log("lol", prefix);

client.on("ready", () => {
  console.log("I'm ready");
});

client.on("message", async (msg) => {
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

  if (cmd == "purge") {
    const amount = args[0];
    if (isNaN(amount) || amount < 2 || amount > 100) {
      return msg.reply("Sorry, your input isnt valid!");
    }

    msg.channel
      .bulkDelete(amount, true)
      .then(() => {
        msg.channel.send("Successfull");
        setTimeout(() => {
          msg.channel.bulkDelete(1);
        }, 3000);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // send images
  if (cmd === "giphy") {
    giphy.execute(msg, args);
  } else if (cmd === "mention") {
    mentionRole(msg, args);
  } else if (cmd === "join") {
    //****voice related commands */
    conn = await voice(msg, args, true);
  } else if (
    cmd === "play" ||
    cmd === "stop" ||
    cmd === "resume" ||
    cmd === "leave" ||
    cmd === "skip"
  ) {
    await voice(msg, args, false, conn, cmd);
  }
  //   if (args[0] === "s") {
  //     await voice(msg, args.slice(1), false, conn, "play_searched");
  //   }
  //   await voice(msg, args, false, conn, cmd);
  // } else if (cmd === "stop") {
  //   await voice(msg, args, false, conn, cmd);
  // } else if (cmd === "resume") {
  //   await voice(msg, args, false, conn, cmd);
  // } else if (cmd === "leave") {
  //   await voice(msg, args, false, conn, cmd);
  // } else if (cmd === "skip") {
  //   await voice(msg, args, false, conn, cmd);
  // }
  // ********voice******
});

client.login(token);
