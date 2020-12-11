"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("../config"));
var giphyApiKey = config_1.default.giphy_api_key;
var axios_1 = __importDefault(require("axios"));
exports.default = {
    name: "giphy",
    desc: "gives access to giphy API from Discord",
    execute: function (msg, args) {
        if (!args.length) {
            return msg.reply('this functionality is there to get some gifs from the very popular platform Giphy. Search for something like "Tony Stark" and see what happens');
        }
        var query, length;
        // checks if last element of args is a number
        // last element can also be used as a indicator for length
        var lastNumberIsNotNumber = isNaN(parseInt(args.slice(-1)[0]));
        if (lastNumberIsNotNumber) {
            length = 1;
            query = args.join("+");
        }
        else {
            query = args.slice(0, args.length - 1).join("+");
            length = parseInt(args.slice(-1)[0]);
            if (length > 5) {
                length = 5;
            }
        }
        axios_1.default.get("https://api.giphy.com/v1/gifs/search?q=" + query + "&api_key=" + giphyApiKey + "&limit=" + length).then(function (res) {
            if (length == 1) {
                msg.channel.send(res.data.data[0].url);
            }
            else {
                res.data.data.forEach(function (gif) {
                    msg.channel.send(gif.url);
                });
            }
        });
    },
};
