"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-unused-vars */
module.exports = function (msg, _args) {
    if (!msg.mentions.users.size && !msg.mentions.roles.size) {
        msg.reply("pleb, you havent mentioned anyone");
    }
    if (msg.mentions.roles.size) {
        msg.mentions.roles.forEach(function (role) {
            msg.channel.send("Hello " + role);
        });
    }
    else if (msg.mentions.users.size) {
        msg.mentions.users.forEach(function (user) {
            msg.channel.send("Hello " + user);
        });
    }
};
