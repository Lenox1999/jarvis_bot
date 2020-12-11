"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var form_data_1 = __importDefault(require("form-data"));
exports.default = (function (img) {
    var data = new form_data_1.default();
    data.append("image", img);
    var config = {
        method: "post",
        url: "https://api.imgur.com/3/image",
        headers: __assign({ Authorization: "e75c11b5caec848" }, data.getHeaders()),
        data: data,
    };
    axios_1.default(config).then(function (res) {
        return JSON.stringify(res);
    });
});
