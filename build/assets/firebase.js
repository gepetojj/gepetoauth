"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firestore = void 0;
require("dotenv").config();
var firebase_admin_1 = __importDefault(require("firebase-admin"));
var config = {
    type: "service_account",
    projectId: "gepetoservices",
    privateKeyId: process.env.PKID,
    privateKey: process.env.PK === undefined
        ? undefined
        : process.env.PK.replace(/\\n/g, "\n"),
    clientEmail: process.env.CE,
    clientId: process.env.CID,
    authUri: "https://accounts.google.com/o/oauth2/auth",
    tokenUri: "https://oauth2.googleapis.com/token",
    authProviderX509CertUrl: "https://www.googleapis.com/oauth2/v1/certs",
    clientX509CertUrl: process.env.CURL,
};
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(config),
    databaseURL: "https://gepetoservices.firebaseio.com",
});
exports.default = firebase_admin_1.default;
exports.firestore = firebase_admin_1.default.firestore();
