"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveConn = void 0;
var Discord = require("discord.js");
var giphy = require("./src/giphy");
var mentionRole = require("./src/mentionRole");
var voice_1 = require("./src/voice");
// only needed in production
var config = require("./config.json");
// assume dev mode
require("dotenv").config();
var prefix, token;
// check if node env 'production' is set which means bot is in prod mode
if (process.env.NODE_ENV === "production") {
    prefix = config.prefix;
    token = config.token;
}
else {
    token = process.env.BOT_TOKEN;
    prefix = process.env.BOT_PREFIX;
}
var client = new Discord.Client();
var conn;
console.log("lol", prefix);
client.on("ready", function () {
    console.log("I'm ready");
});
client.on("message", function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var args, cmd, taggedUser, amount;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (msg.content.split("")[0] !== prefix || msg.author.bot)
                    return [2 /*return*/];
                args = msg.content.slice(prefix.length).trim().split(/ +/);
                cmd = args.shift().toLowerCase();
                if (cmd === "args-info") {
                    if (!args.length) {
                        msg.channel.send("You didnt provide any args, " + msg.author.username);
                        return [2 /*return*/];
                    }
                    msg.channel.send("Your arguments: " + args);
                }
                else if (cmd === "kick") {
                    if (!msg.mentions.users.size) {
                        return [2 /*return*/, msg.channel.send("Sorry Pleb, you didnt mentioned user(s) to kick")];
                    }
                    taggedUser = msg.mentions.users.first();
                    msg.channel.send("You wanted to kick " + taggedUser);
                }
                if (cmd === "avatar") {
                    if (!msg.mentions.users.size) {
                        return [2 /*return*/, msg.channel.send("This is your avatar: " + msg.author.avatarURL({
                                format: "png",
                                dynamic: true,
                            }))];
                    }
                    msg.mentions.users.forEach(function (user) {
                        msg.channel.send(user.username + "'s avatar: " + user.avatarURL({
                            dynamic: true,
                            format: "png",
                        }));
                    });
                }
                if (cmd == "purge") {
                    amount = parseInt(args[0]);
                    if (isNaN(amount) || amount < 2 || amount > 100) {
                        return [2 /*return*/, msg.reply("Sorry, your input isnt valid!")];
                    }
                    if (msg.channel.type == "dm")
                        return [2 /*return*/];
                    msg.channel
                        .bulkDelete(amount, true)
                        .then(function () {
                        msg.channel.send("Successfull");
                        setTimeout(function () {
                            if (msg.channel.type == "dm")
                                return;
                            msg.channel.bulkDelete(1);
                        }, 3000);
                    })
                        .catch(function (err) {
                        console.error(err);
                    });
                }
                if (!(cmd === "giphy")) return [3 /*break*/, 1];
                giphy.execute(msg, args);
                return [3 /*break*/, 6];
            case 1:
                if (!(cmd === "mention")) return [3 /*break*/, 2];
                mentionRole(msg, args);
                return [3 /*break*/, 6];
            case 2:
                if (!(cmd === "join")) return [3 /*break*/, 4];
                return [4 /*yield*/, voice_1.voice(msg, args, true)];
            case 3:
                //****voice related commands */
                conn = (_a.sent());
                return [3 /*break*/, 6];
            case 4:
                if (!(cmd === "play" ||
                    cmd === "stop" ||
                    cmd === "resume" ||
                    cmd === "leave" ||
                    cmd === "skip")) return [3 /*break*/, 6];
                return [4 /*yield*/, voice_1.voice(msg, args, false, conn, cmd)];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); });
client.login(token);
var saveConn = function (_conn) {
    conn = _conn;
};
exports.saveConn = saveConn;
