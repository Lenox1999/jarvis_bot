import {
  Collection,
  Message,
  Snowflake,
  User,
  VoiceConnection,
} from "discord.js";

import Discord from "discord.js";

import giphy from "./src/giphy";
import mentionRole from "./src/mentionRole";
import { voice } from "./src/voice";
// only needed in production
import config from "./config";

export type bulkDelete = Promise<Collection<Snowflake, Message>>;

// assume dev mode
require("dotenv").config();

let prefix: string, token: string;
// check if node env 'production' is set which means bot is in prod mode
if (process.env.NODE_ENV === "production") {
  prefix = config.prefix;
  token = config.token;
} else {
  token = process.env.BOT_TOKEN as string;
  prefix = process.env.BOT_PREFIX as string;
}

const client = new Discord.Client();

let conn: VoiceConnection;

client.on("ready", () => {
  console.log("I'm ready");
});

client.on("message", async (msg: Message) => {
  if (msg.content.split("")[0] !== prefix || msg.author.bot) return;

  const args = msg.content.slice(prefix.length).trim().split(/ +/);
  const cmd = args.shift()!.toLowerCase();

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
    msg.mentions.users.forEach((user: User) => {
      msg.channel.send(
        `${user.username}'s avatar: ${user.avatarURL({
          dynamic: true,
          format: "png",
        })}`
      );
    });
  }

  if (cmd == "purge") {
    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount < 2 || amount > 100) {
      return msg.reply("Sorry, your input isnt valid!");
    }

    if (msg.channel.type == "dm") return;

    msg.channel
      .bulkDelete(amount, true)
      .then(() => {
        msg.channel.send("Successful");
        setTimeout(() => {
          if (msg.channel.type == "dm") return;
          msg.channel.bulkDelete(1);
        }, 3000);
      })
      .catch((err: Error) => {
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
    await voice(msg, args, true, conn);
  } else if (
    cmd === "play" ||
    cmd === "stop" ||
    cmd === "resume" ||
    cmd === "leave" ||
    cmd === "skip"
  ) {
    await voice(msg, args, false, conn, cmd);
  }
});

client.login(token);

export const saveConn = (_conn: VoiceConnection) => {
  console.log("hey");
  conn = _conn;
};
