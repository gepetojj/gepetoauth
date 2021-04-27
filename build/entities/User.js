"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const tokens_1 = require("../utils/tokens");
class User {
    constructor(data, id) {
        Object.assign(this, data);
        if (!id) {
            this.id = tokens_1.createId();
        }
    }
}
exports.User = User;
