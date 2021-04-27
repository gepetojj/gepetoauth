"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firestore = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const config_1 = __importDefault(require("../config"));
const firebaseConfig = {
    type: "service_account",
    projectId: "gepetoservices",
    privateKeyId: config_1.default.pkid,
    privateKey: config_1.default.pk,
    clientEmail: config_1.default.ce,
    clientId: config_1.default.cid,
    authUri: "https://accounts.google.com/o/oauth2/auth",
    tokenUri: "https://oauth2.googleapis.com/token",
    authProviderX509CertUrl: "https://www.googleapis.com/oauth2/v1/certs",
    clientX509CertUrl: config_1.default.curl,
};
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(firebaseConfig),
    databaseURL: "https://gepetoservices.firebaseio.com",
});
exports.default = firebase_admin_1.default;
exports.firestore = firebase_admin_1.default.firestore();
