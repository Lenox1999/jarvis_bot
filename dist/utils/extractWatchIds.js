"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (link) {
    return link.split("=")[1].split("").slice(0, 11).join("");
});
