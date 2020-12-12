import { Message } from "discord.js";

/* eslint-disable no-unused-vars */
export default (msg: Message, _args: string[]) => {
  if (!msg.mentions.users.size && !msg.mentions.roles.size) {
    msg.reply("pleb, you havent mentioned anyone");
  }
  if (msg.mentions.roles.size) {
    msg.mentions.roles.forEach((role) => {
      msg.channel.send(`Hello ${role}`);
    });
  } else if (msg.mentions.users.size) {
    msg.mentions.users.forEach((user) => {
      msg.channel.send(`Hello ${user}`);
    });
  }
};
