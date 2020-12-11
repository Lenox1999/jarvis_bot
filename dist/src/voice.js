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
exports.voice = void 0;
var ytdl = require("ytdl-core");
var stringIsLink = require("../utils/stringIsLink");
var youtubeSearchApiWrapper = require("../utils/youtubeSearchApiWrapper");
// const getYTTitle = require("get-youtube-title");
var extractWatchIds = require("../utils/extractWatchIds");
var saveConn = require("../app").saveConn;
var playing = false;
var dispatcher;
var queue = [];
var msg;
var voice = function (_msg, args, join, connection, cmd) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, link, title, _b, link, title, search, searchResult, videoToPlay, name, thumbNail;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (connection)
                    saveConn(connection);
                if (!msg.member)
                    return [2 /*return*/, msg.reply('Something bad happened')];
                msg = _msg;
                if (!(cmd === "stop" || cmd === "skip" || (cmd === "leave" && !connection))) return [3 /*break*/, 1];
                return [2 /*return*/, msg.reply("you cant use that command when i am not connected to a voice channel right now")];
            case 1:
                if (!!connection) return [3 /*break*/, 4];
                if (!(msg.member.voice.channel && join)) return [3 /*break*/, 3];
                return [4 /*yield*/, msg.member.voice.channel.join()];
            case 2:
                connection = _c.sent();
                return [3 /*break*/, 4];
            case 3:
                msg.reply("you arent in a voice channel right now!");
                _c.label = 4;
            case 4:
                if (!join) return [3 /*break*/, 8];
                if (!(msg.member.voice.channel && join)) return [3 /*break*/, 6];
                return [4 /*yield*/, msg.member.voice.channel.join()];
            case 5: return [2 /*return*/, _c.sent()];
            case 6:
                msg.reply("you arent in a voice channel right now!");
                _c.label = 7;
            case 7: return [3 /*break*/, 22];
            case 8:
                if (!(cmd === "play")) return [3 /*break*/, 16];
                if (!args[0]) return [3 /*break*/, 15];
                if (!(!dispatcher && stringIsLink(args[0]) && !playing)) return [3 /*break*/, 9];
                // multiple ways to use this function
                // 1. : v to play it directly with a link
                // 2. : s to search for a video with search api
                // 3. : to queue a song when bot is already playing
                //TODO: loop function and share function
                //only for reference
                // dispatcher = connection.play(ytdl(args[1], { filter: "audioonly" }));
                // playing = true;
                // only for reference
                // new code
                // means bot isnt initialized yet
                msg.reply("Play this video now");
                // const watchId = extractWatchIds(args[0]);
                queue.push(args[0]);
                if (!connection)
                    return [2 /*return*/];
                player(connection);
                return [3 /*break*/, 15];
            case 9:
                if (!(dispatcher && playing && stringIsLink(args[0]))) return [3 /*break*/, 10];
                //means playing is already playing a song
                msg.reply("added this vid to queue");
                queue.push(args[0]);
                return [3 /*break*/, 15];
            case 10:
                if (!(dispatcher && !playing)) return [3 /*break*/, 11];
                queue.push(args[0]);
                if (!connection)
                    return [2 /*return*/];
                player(connection);
                return [3 /*break*/, 15];
            case 11:
                if (!(!stringIsLink(args[0]) && !playing)) return [3 /*break*/, 13];
                return [4 /*yield*/, youtubeSearchApiWrapper(args)];
            case 12:
                _a = _c.sent(), link = _a.link, title = _a.title;
                // msg.channel.send(`Playing now: ${title}`);
                // msg.channel.send(thumbNail);
                console.log(link, title);
                queue.push(link);
                if (!connection)
                    return [2 /*return*/];
                player(connection, title);
                return [3 /*break*/, 15];
            case 13:
                if (!!stringIsLink(args[0])) return [3 /*break*/, 15];
                return [4 /*yield*/, youtubeSearchApiWrapper(args)];
            case 14:
                _b = _c.sent(), link = _b.link, title = _b.title;
                console.log(link, title);
                msg.reply("yo, added this vid to the queue");
                queue.push(link);
                _c.label = 15;
            case 15: return [3 /*break*/, 22];
            case 16:
                if (!(cmd === "stop" && playing == true)) return [3 /*break*/, 17];
                queue = [];
                dispatcher.pause();
                playing = false;
                return [3 /*break*/, 22];
            case 17:
                if (!(cmd === "resume")) return [3 /*break*/, 18];
                dispatcher.resume();
                return [3 /*break*/, 22];
            case 18:
                if (!(cmd === "leave")) return [3 /*break*/, 19];
                msg.member.voice.channel.leave();
                return [3 /*break*/, 22];
            case 19:
                if (!(cmd === "play_searched")) return [3 /*break*/, 21];
                search = void 0;
                args.length > 1 ? (search = args.join("%20")) : (search = args);
                return [4 /*yield*/, youtubeSearchApiWrapper(search)];
            case 20:
                searchResult = _c.sent();
                videoToPlay = searchResult.data.items[0].id.videoId;
                name = searchResult.data.items[0].snippet.title;
                thumbNail = searchResult.data.items[0].snippet.thumbnails.default.url;
                msg.reply("Playing now " + name);
                msg.channel.send(thumbNail);
                if (!connection)
                    return [2 /*return*/];
                dispatcher = connection.play(ytdl(videoToPlay, { filter: "audioonly" }));
                playing = true;
                return [3 /*break*/, 22];
            case 21:
                if (cmd === "skip" && dispatcher && queue.length - track > 0) {
                    dispatcher.pause();
                    track++;
                    if (!connection)
                        return [2 /*return*/];
                    player(connection);
                }
                _c.label = 22;
            case 22: return [2 /*return*/];
        }
    });
}); };
exports.voice = voice;
var track = 1;
var player = function (connection, _title) { return __awaiter(void 0, void 0, void 0, function () {
    var title, res, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                playing = true;
                title = _title;
                if (!!title) return [3 /*break*/, 2];
                return [4 /*yield*/, youtubeSearchApiWrapper(extractWatchIds(queue[track - 1]), true)];
            case 1:
                res = _a.sent();
                title = res.title;
                _a.label = 2;
            case 2:
                msg.channel.send("Now playing: **" + title + "**");
                (dispatcher = connection.play(ytdl(queue[track - 1], { filter: "audioonly" }))).once("finish", checkQueue.bind(this, connection));
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.log(err_1);
                msg.reply("sorry but something has gone wrong");
                playing = false;
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var checkQueue = function (connection) {
    track++;
    if (queue[track - 1]) {
        player(connection);
    }
    else {
        playing = false;
        queue = [];
        track = 1;
        dispatcher.pause();
    }
};
