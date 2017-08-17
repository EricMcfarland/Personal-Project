// Initialize Firebase
//  const firebase = require('firebase/app')
const firebase = require('firebase/app');require("firebase/auth");
require("firebase/database");
const unirest = require('unirest');
var cardList = {};
var database = firebase.database();
var admin = require("firebase-admin");

// Fetch the service account key JSON file contents
var serviceAccount = require("path/to/AIzaSyDySolLS5sfsLlP3ouHp_CmdesJS-pDaZE.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "hearthstone-discover.firebaseapp.com"
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();
var ref = db.ref("restricted_access/secret_document");
ref.once("value", function(snapshot) {
  console.log(snapshot.val());
});

var config = {
  apiKey: "AIzaSyDySolLS5sfsLlP3ouHp_CmdesJS-pDaZE",
  authDomain: "hearthstone-discover.firebaseapp.com",
  databaseURL: "https://hearthstone-discover.firebaseio.com",
  projectId: "hearthstone-discover",
  storageBucket: "",
  messagingSenderId: "541695389765"
};
firebase.initializeApp(config);
// console.log(firebase)

unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards")
  .header("X-Mashape-Key", "KOkEd2dvbzmshtB9Pnai1Z0TTA6Xp1HjiXPjsnn294AfPssRiT")
  .end((result) => {
    //get the card list from the unirest API
    console.log(result.status, result.headers);
    // cardList = result.body;
    var ref = database.ref('cards');
    ref.push(result.body);

    //Add the list to firebase
    //Add each individual card object to firebase




    // var path = './cardList.json'

    // fs.open(path, 'r+', 0666, (err, fd) => {
    //     if (err) { throw err; }
    //     console.log("file opened");

    //     //writes all the data from twitch emote list to my local emote_list.json
    //     fs.writeFile(fd, JSON.stringify(cardList, null, 2), function (err) {
    //         if (err) { throw err; }
    //         // console.log(cardList.length);
    //         console.log('file written');

    //         fs.close(fd, function () {
    //             console.log('file closed');
    //         });
    //     });
    // });
    // console.log("response has completed")
    // // console.log(Object.keys(cardList));

  });