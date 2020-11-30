const { default: Axios } = require("axios");

const Discord = require("discord.js");

const { prefix, token, giphy_api_key } = require("./config.json");

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

  if (cmd == "purge") {
    const amount = args[0];
    if (isNaN(amount) || amount < 2 || amount > 100) {
      return msg.reply("Sorry, your input isnt valid!");
    }

    msg.channel
      .bulkDelete(amount + 1, true)
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
    if (!args.length) {
      return msg.reply(
        'this functionality is there to get some gifs from the very popular platform Giphy. Search for something like "Tony Stark" and see what happens'
      );
    }
    let query, length;

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
      `https://api.giphy.com/v1/gifs/search?q=${query}&api_key=${giphy_api_key}&limit=${length}`
    ).then((res) => {
      if (length == 1) {
        msg.channel.send(res.data.data[0].url);
      } else {
        res.data.data.forEach((gif) => {
          msg.channel.send(gif.url);
        });
      }
    });
  }
});

client.login(token);
