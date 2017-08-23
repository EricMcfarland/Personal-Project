// Initialize Firebase
//  const firebase = require('firebase/app')
const firebase = require('firebase');
const unirest = require('unirest');
const admin = require("firebase-admin");
const http = require('http');
var cardList = {};

// var config = {
//   apiKey: "AIzaSyDySolLS5sfsLlP3ouHp_CmdesJS-pDaZE",
//   authDomain: "hearthstone-discover.firebaseapp.com",
//   databaseURL: "https://hearthstone-discover.firebaseio.com",
//   projectId: "hearthstone-discover",
//   storageBucket: "",
//   messagingSenderId: "541695389765"
// };
// firebase.initializeApp(config);
// var database = firebase.database();
// var ref = database.ref("test");
// ref.push({a:"aa"});

//.... I DONT KNOW WHAT I"M DOING WITH THE ADMIN SHIT

// Fetch the service account key JSON file contents
var serviceAccount = require("./HD-service-account.json");

// Initialize the app with a service account, granting admin privileges

// firebase.initializeApp({
//   serviceAccount: serviceAccount,
//   databaseURL: "https://hearthstone-discover.firebaseio.com/",
//   authDomain: "hearthstone-discover.firebaseapp.com",
//   projectId: "hearthstone-discover",
//   messagingSenderId: "541695389765"
// })

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hearthstone-discover.firebaseio.com/",
  authDomain: "hearthstone-discover.firebaseapp.com",
  projectId: "hearthstone-discover",
  databaseAuthVariableOverride: {
    uid: "my-service-worker"
  }

});
console.log("app initialized")

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();

//replace with the card images


unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards")
  .header("X-Mashape-Key", "KOkEd2dvbzmshtB9Pnai1Z0TTA6Xp1HjiXPjsnn294AfPssRiT")
  .end((result) => {
    //get the card list from the unirest API
    console.log(result.status, result.headers);

    cardList = result.body
    cardList = renameKeys(cardList);
    var ref = db.ref();
    ref.child('cardList').remove()
    ref.child('discover pools').remove()
    ref.child('urls').remove()
    ref.child('users').remove()
    ref.child('test').remove()
    ref.child('images').remove()
    ref.child('cards').remove()


    //send cardlist to FB DB
    var ref = db.ref('cardList');
    ref.set(cardList).then(function () {
      //TODO: start adding images 
      //TODO: Add full data
      //DONE: Just add URLs and use that
      for (var expansion in cardList) {
        if (cardList.hasOwnProperty(expansion)) {
          if (!["Tavern Brawl", "Credits", "Missions", "System", "Debug"].includes(expansion)) {
            //go through only the cards listed within the expansions

            for (var card in cardList[expansion]) {
              if (cardList[expansion].hasOwnProperty(card)) {
                var cardObject = cardList[expansion][card];
                var cardType = cardList[expansion][card].type;
                var cardClass = cardList[expansion][card].playerClass;
                var cardName = cardList[expansion][card].name.replace(/['"*!:.?|[\]\/]+/g, '');

                if (!["Hero Power", "Enchantment"].includes(cardType)) {
                  var ref = db.ref('urls').child(card);
                  var url = "http://media.services.zam.com/v1/media/byName/hs/cards/enus/" + cardList[expansion][card].cardId + ".png"
                  ref.set(url).then(() => {
                    // console.log(cardList[expansion][card].name + " url has been saved")
                  }).catch(function (error) {
                    //  console.log('Synchronization failed for: ' + cardList[expansion][card].name);
                  });

                  //Populate the discover pools

                  //Put Standard cards into their discover pool
                  if (["Classic", "Basic", "Whispers of the Old Gods", "Mean Streets of Gadgetzan", "One Night in Karazhan", "Journey to Un'Goro", "Knights of the Frozen Throne"].includes(expansion)) {
                    // --------STANDARD: By Card Type----- TODO: MAY NOT NEED THIS
                    // ref = db.ref('discover pools').child('Standard').child(cardType).child(cardClass).child(cardName)
                    // ref.set(cardObject).then(() => {
                    //   // console.log(cardList[expansion][card].name + " url has been saved")
                    // }).catch(function (error) {
                    //    console.log('Synchronization failed for: ' + cardName);
                    // });

                    //---------STANDARD: By Class---------
                    ref = db.ref('discover pools').child('Standard').child('Class').child(cardClass).child(cardType).child(cardName)
                    ref.set(cardObject).then(() => {
                      // console.log(cardList[expansion][card].name + " url has been saved")
                    }).catch(function (error) {
                      console.log('Synchronization failed for: ' + cardName);
                    });

                    //----------STANDARD: Discover card ---------------
                    ref = db.ref('discover pools').child('Standard').child('Discover Card').child(cardClass).child(cardType).child(cardName)
                    if (cardObject.hasOwnProperty('text')) {
                      if (cardObject.text.includes("Discover")) {

                        ref.set(cardObject).then(() => {
                          // console.log(cardList[expansion][card].name + " url has been saved")
                        }).catch(function (error) {
                          console.log('Synchronization failed for: ' + cardName);
                        });
                      }
                    }
                  }

                  //Put every card into Wild discover pool
                  //--------WILD: By Card Type--------- TODO: MAY NOT NEED THIS
                  // ref = db.ref('discover pools').child('Wild').child(cardType).child(cardClass).child(cardName)
                  // ref.set(cardObject).then(() => {
                  //   // console.log(cardList[expansion][card].name + " url has been saved")
                  // }).catch(function (error) {
                  //    console.log('Synchronization failed for: ' + cardName);
                  // });
                  //---------WILD: By Class---------
                  ref = db.ref('discover pools').child('Wild').child('Class').child(cardClass).child(cardType).child(cardName)

                  ref.set(cardObject).then(() => {
                    // console.log(cardList[expansion][card].name + " url has been saved")
                  }).catch(function (error) {
                    console.log('Synchronization failed for: ' + cardName);
                  });
                  if (cardObject.hasOwnProperty('text')) {
                    if (cardObject.text.includes("Discover")) {

                      ref.set(cardObject).then(() => {
                        // console.log(cardList[expansion][card].name + " url has been saved")
                      }).catch(function (error) {
                        console.log('Synchronization failed for: ' + cardName);
                      });
                    }
                  }
                  // retrieveImage(cardList[expansion][card]);
                  // console.log('Synchronization succeeded');


                }
              }
            }
          }
        }
      }
    })
      .catch(function (error) {
        console.error(error.message);
      });

  })

function retrieveImage(cardObject) {
  console.log("uploading images to FB")
  request = http.get("http://media.services.zam.com/v1/media/byName/hs/cards/enus/" + cardObject.cardId + ".png",
    (res) => {
      // res.setTimeout(25000);
      // console.log("type is: " + cardObject.type)
      const { statusCode } = res

      let error
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
          `Status Code: ${statusCode}\n` +
          `card name: ${cardObject.name}`);
      }
      if (error) {
        console.error(error.message)
        res.resume()
        return
      }
      var imagedata = ''
      res.setEncoding('binary')

      res.on('data', (chunk) => {
        imagedata += chunk
      })
      res.on('end', () => {
        try {
          var ref = db.ref('images');
          ref.set(imagedata).then(() => {
            console.log(carbObject.name + " image has been saved")
          }).catch(function (error) {
            console.log('Synchronization failed for: ' + cardObject.name);
          });

        }
        catch (e) {
          console.error(e.message);
        }
        // console.log('File saved.')
      })
    }).on('error', (e) => {

      console.error(`${cardObject.name} : ${e.message}`)
    })
}


//Renames the unnamed card keys under each expansion to be the name of the card
function renameKeys(list) {
  for (var expansion in list) {
    if (list.hasOwnProperty(expansion)) {
      for (var card in list[expansion]) {
        if (list[expansion].hasOwnProperty(card)) {

          var expansionObject = list[expansion]

          //remove characters not allowed as keys
          var cardName = list[expansion][card].name.replace(/['"*!:.?|[\]\/]+/g, '')


          //rekey the unkeyed card objects to be defined by their card name
          if (card !== cardName) {
            Object.defineProperty(expansionObject, cardName,
              Object.getOwnPropertyDescriptor(expansionObject, card));
            delete expansionObject[card];

          }
        }
      }
    }
  }
  return list
}





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
