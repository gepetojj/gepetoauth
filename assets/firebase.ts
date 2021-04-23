require("dotenv").config();
import firebase from "firebase-admin";

const config = {
	type: "service_account",
	projectId: "gepetoservices",
	privateKeyId: process.env.PKID,
	privateKey:
		process.env.PK === undefined
			? undefined
			: process.env.PK.replace(/\\n/g, "\n"),
	clientEmail: process.env.CE,
	clientId: process.env.CID,
	authUri: "https://accounts.google.com/o/oauth2/auth",
	tokenUri: "https://oauth2.googleapis.com/token",
	authProviderX509CertUrl: "https://www.googleapis.com/oauth2/v1/certs",
	clientX509CertUrl: process.env.CURL,
};

firebase.initializeApp({
	credential: firebase.credential.cert(config),
	databaseURL: "https://gepetoservices.firebaseio.com",
});

export default firebase;
export const firestore = firebase.firestore();
