//babelify/polyfill import?

// Initialize Firebase
//  const firebase = require('firebase/app')
const firebase = require('firebase');
const unirest = require('unirest');
const admin = require("firebase-admin");
const http = require('http');
const fs = require('fs')
var cardList = {};


// Fetch the service account key JSON file contents
var serviceAccount = require("./HD-service-account.json");

// Initialize the app with a service account, granting admin privileges
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
var storage = admin.storage();


getJSON().then((list) => {
    // console.log(list)
    writeDataToFile(list, './cardListRekeyed.json')
    var cardObjects = getCardObjectsFromList(list)

    var cnt = 0;
    //write all cards to root/cards directory, returns message when completed
    for (card in cardObjects) {
        if (cardObjects.hasOwnProperty(card)) {
            writeToFirebase(cardObjects[card], '/cards/' + card).then((obj) => {
                cnt++
                if (Object.keys(cardObjects).length === cnt) {
                    console.log("all card written");
                }
            });
        }
    }
    //TODO:
    var standardSets = ["Classic", "Basic", "Whispers of the Old Gods", "Mean Streets of Gadgetzan", "One Night in Karazhan", "Journey to Un'Goro", "Knights of the Frozen Throne"];
    var standardList = filterList(list,standardSets,["*"],['mechanics'],['*'],['name'])
    writeToFirebase(standardList,'/Standard/')
})

//filterList() takes in an object as the first argument then n arguments afterwards. 
//Each non object argument should an array of strings, with the first value being the filter flag
//with the second value being the includes filter. 
//It returns an object that only contains the keys specified by the filter for each branch
function filterList(list) {
    var args = arguments
    var arrayOfFilters = [], newList;
    //handle no filter passed, return input value
    if (arguments.length === 1) {
        // console.log("no filter specified");
        return list
    }
    //If multiple arguments but first argument is not an object (list)
    if (!(list instanceof Object)) {
        console.log("first argument must be an object");
        return null
    }

    // console.log("arguments are: ")
    // console.log(args)

    //Create an array that contains the all the filter arguments
    for (var i = 1; i < args.length; i++) {
        arrayOfFilters.push(args[i])

    }

    //create a pass all filter of '', else set the filter to argument
    if (arrayOfFilters[0] == '*') {
        currentFilter = Object.keys(list)
    } else {
        var currentFilter = arrayOfFilters[0];
    }

    //After setting the current filter remove it from the array of filters
    arrayOfFilters.shift();

    //Create the new list object. 
    newList = Object.keys(list)
        .filter(key => currentFilter.includes(key))         //filter out by key names
        .reduce((obj, key) => {                             //build new list of object by calling
           
            //if the current value is an object then try to filter using next filter argument
            if (list[key] instanceof Object) {              
                obj[key] = filterList.apply(this, [list[key]].concat(arrayOfFilters))
                return obj
            } else {
                //handles case when last object is only a key:value pair
                obj[key] = list[key]
                return obj
            }
        }, {})

    return newList

}

function writeDataToFile(data, path) {
    fs.open(path, 'w', (err, fd) => {
        if (err) throw err;
        fs.write(fd, JSON.stringify(data, null, 2), (err) => {
            if (err) throw err;
            console.log(path + " has been written");
        })

    })
}
//getJSON(). Retrieves the cardlist.json file via the unirest API.
//After retrieving the cardlist calls renameKeys(cardList) 
//returns the rekeyed cardList
function getJSON() {
    return new Promise((resolve, reject) => {
        unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards")
            .header("X-Mashape-Key", "KOkEd2dvbzmshtB9Pnai1Z0TTA6Xp1HjiXPjsnn294AfPssRiT")
            .end((result) => {
                if (result.error) {
                    console.log("error occured")
                    reject(new Error(result.error))
                } else {
                    var cardList = result.body
                    writeDataToFile(cardList, './cardList.json')
                    cardList = renameKeys(cardList)
                    resolve(cardList)
                }
            })

    })
}
//This function takes an Object \list\ with a specific structure, in this case the HSJSON file
//And creates an array of Objects \cards\ corresponding to each card in the list.
//Filters out most non-playable, non-collectible cards
//TODO: Do I need to filter here?
function getCardObjectsFromList(list) {
    var cards = {};
    for (var expansion in list) {
        if (list.hasOwnProperty(expansion)) {
            if (!["Tavern Brawl", "Credits", "Missions", "System", "Debug"].includes(expansion)) {
                //go through only the cards listed within the expansions, basic and classic

                for (var card in list[expansion]) {
                    if (list[expansion].hasOwnProperty(card)) {
                        var cardObject = list[expansion][card];
                        var cardType = list[expansion][card].type;
                        var cardClass = list[expansion][card].playerClass;
                        var cardName = list[expansion][card].name.replace(/['"*!:.?|[\]\/]+/g, '');
                        var cardFaction = list[expansion][card].faction;

                        if (!["Enchantment"].includes(cardType)) {
                            if (!(["Spell"].includes(cardType) && ["Neutral"].includes(cardClass))) {
                                cards[cardName] = cardObject;
                            }

                        }
                    }
                }
            }
        }
    }
    return cards
}
//TODO: redo with unirest?
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
    var newList = {}
    for (var expansion in list) {
        var newExpansionObject = {}
        if (list.hasOwnProperty(expansion)) {
            for (var card in list[expansion]) {
                if (list[expansion].hasOwnProperty(card)) {

                    var expansionObject = list[expansion]

                    //remove characters not allowed as keys
                    var cardName = list[expansion][card].name.replace(/['"*!:.?|[\]\/]+/g, '')
                    newExpansionObject[cardName] = expansionObject[card]
                    //rekey the unkeyed card objects to be defined by their card name
                    // if (card !== cardName) {
                    //     Object.defineProperty(expansionObject, cardName,
                    //         Object.getOwnPropertyDescriptor(expansionObject, card));
                    //     delete expansionObject[card];

                    // }
                }
            }
            newList[expansion] = newExpansionObject;
        }
    }

    return newList
}

//Writes object to a firebase path. The path is from the firebase root directory
//TODO: Make this a promise?
function writeToFirebase(obj, path) {
    return new Promise((resolve, reject) => {
        var ref = db.ref(path)
        ref.set(obj).then(() => {
            resolve(obj)
        }).catch((err) => {
            reject(new Error(err))
        })
    })

}




// //replace with the card images
// unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards")
//     .header("X-Mashape-Key", "KOkEd2dvbzmshtB9Pnai1Z0TTA6Xp1HjiXPjsnn294AfPssRiT")
//     .end((result) => {
//         //get the card list from the unirest API
//         console.log(result.status, result.headers);

//         cardList = result.body
//         cardList = renameKeys(cardList);

//         var ref = db.ref();
//         ref.child('cardList').remove()
//         ref.child('discover pools').remove()
//         ref.child('users').remove()
//         ref.child('test').remove()
//         ref.child('images').remove()
//         ref.child('cards').remove()
//         var ref = db.ref('cardList');

//         //send cardlist to FB DB
//         ref.set(cardList).then(function () {
//             //TODO: start adding images 
//             //TODO: Add full data
//             //DONE: Just add URLs and use that

//             //
//             // ───  ────────────────────────────────────────────────────────────
//             //


//             //   for (var expansion in cardList) {
//             //     if (cardList.hasOwnProperty(expansion)) {
//             //       if (!["Tavern Brawl", "Credits", "Missions", "System", "Debug"].includes(expansion)) {
//             //         //go through only the cards listed within the expansions

//             //         for (var card in cardList[expansion]) {
//             //           if (cardList[expansion].hasOwnProperty(card)) {
//             //             var cardObject = cardList[expansion][card];
//             //             var cardType = cardList[expansion][card].type;
//             //             var cardClass = cardList[expansion][card].playerClass;
//             //             var cardName = cardList[expansion][card].name.replace(/['"*!:.?|[\]\/]+/g, '');

//             //             if (!["Hero Power", "Enchantment"].includes(cardType)) {
//             //               // var ref = db.ref('urls').child(card);
//             //               // var url = "http://media.services.zam.com/v1/media/byName/hs/cards/enus/" + cardList[expansion][card].cardId + ".png"

//             //               //
//             //               // SAVE TO DATABASE
//             //               //
//             //               ref.set(url).then(() => {
//             //                 // console.log(cardList[expansion][card].name + " url has been saved")
//             //               }).catch(function (error) {
//             //                 //  console.log('Synchronization failed for: ' + cardList[expansion][card].name);
//             //               });

//             //               //
//             //               // POPULATE THE DISCOVER POOLS
//             //               //
//             //               //Put Standard cards into their discover pool
//             //               if (["Classic", "Basic", "Whispers of the Old Gods", "Mean Streets of Gadgetzan", "One Night in Karazhan", "Journey to Un'Goro", "Knights of the Frozen Throne"].includes(expansion)) {
//             //                 // --------STANDARD: By Card Type----- TODO: MAY NOT NEED THIS

//             //                 //---------STANDARD: By Class---------
//             //                 ref = db.ref('discover pools').child('Standard').child('Class').child(cardClass).child(cardType).child(cardName)
//             //                 ref.set(cardObject).then(() => {
//             //                   // console.log(cardList[expansion][card].name + " url has been saved")
//             //                 }).catch(function (error) {
//             //                   console.log('Synchronization failed for: ' + cardName);
//             //                 });

//             //                 //----------STANDARD: Discover card ---------------
//             //                 ref = db.ref('discover pools').child('Standard').child('Discover Card').child(cardName)
//             //                 if (cardObject.hasOwnProperty('text')) {
//             //                   if (cardObject.text.includes("Discover")) {

//             //                     ref.set(cardObject).then(() => {
//             //                     }).catch(function (error) {
//             //                       console.log('Synchronization failed for: ' + cardName);
//             //                     });
//             //                   }
//             //                 }
//             //               }

//             //               //Put every card into Wild discover pool
//             //               //---------WILD: By Class---------
//             //               ref = db.ref('discover pools').child('Wild').child('Class').child(cardClass).child(cardType).child(cardName)

//             //               ref.set(cardObject).then(() => {
//             //                 // console.log(cardList[expansion][card].name + " url has been saved")
//             //               }).catch(function (error) {
//             //                 console.log('Synchronization failed for: ' + cardName);
//             //               });
//             //               if (cardObject.hasOwnProperty('text')) {
//             //                 if (cardObject.text.includes("Discover")) {

//             //                   ref.set(cardObject).then(() => {
//             //                     // console.log(cardList[expansion][card].name + " url has been saved")
//             //                   }).catch(function (error) {
//             //                     console.log('Synchronization failed for: ' + cardName);
//             //                   });
//             //                 }
//             //               }
//             //               // retrieveImage(cardList[expansion][card]);
//             //               // console.log('Synchronization succeeded');


//             //             }
//             //           }
//             //         }
//             //       }
//             //     }
//             //   }
//             // })
//             //   .catch(function (error) {
//             //     console.error(error.message);
//             //   });

//             //
//             // ───  ────────────────────────────────────────────────────────────
//             //


//         })


// //This function takes an Object(cardList)
// getCardObjectsFromList(cardList, (cards) => {
//     for (card in cards) {
//         var cardObject = cards[card];
//         var cardType = cardObject.type;
//         var cardClass = cardObject.playerClass;
//         var cardName = cardObject.name.replace(/['"*!:.?|[\]\/]+/g, '');
//         var cardSet = cardObject.cardSet;
//         var cardMechanics = cardObject.mechanics;
//         var cardCost = cardObject.cost;
//         var cardImage = cardObject.img;


//         //STANDARD
//         if (["Classic", "Basic", "Whispers of the Old Gods", "Mean Streets of Gadgetzan", "One Night in Karazhan", "Journey to Un'Goro", "Knights of the Frozen Throne"].includes(cardSet)) {
//             //---------STANDARD: By Class---------
//             ref = db.ref('discover pools').child('Standard').child('Class').child(cardClass).child(cardType).child(cardName)
//             ref.set(cardObject).then(() => {
//                 // console.log(cardList[expansion][card].name + " url has been saved")
//             }).catch(function (error) {
//                 console.log('Synchronization failed for: ' + cardName);
//             });

//             //----------STANDARD: Discover card ---------------
//             ref = db.ref('discover pools').child('Standard').child('Discover Card').child(cardName)
//             if (cardObject.hasOwnProperty('text')) {
//                 if (cardObject.text.includes("<b>Discover</b>")) {

//                     ref.set(cardObject).then(() => {
//                         // console.log(cardList[expansion][card].name + " url has been saved")
//                     }).catch(function (error) {
//                         console.log('Synchronization failed for: ' + cardName);
//                     });
//                 }
//             }
//         }


//         //
//         // WILD
//         //


//         //CLASS
//         ref = db.ref('discover pools').child('Wild').child('Class').child(cardClass).child(cardType).child(cardName)

//         ref.set(cardObject).then(() => {
//             // console.log(cardList[expansion][card].name + " url has been saved")
//         }).catch(function (error) {
//             console.log('setting class cardObject ' + error);
//         });

//         //DISCOVER
//         ref = db.ref('discover pools').child('Wild').child('Discover Card').child(cardName)
//         if (cardObject.hasOwnProperty('text')) {
//             if (cardObject.text.includes("Discover</b>")) {

//                 //TODO: pass the cardobject to the then()
//                 ref.set(cardObject).then((snapshot) => {
//                     // console.log(snapshot.val());
//                     // if (cardObject.name === "Primordial Glyph") {
//                     //   cardRef = db.ref('discover pools').child('Wild').child('Discover Card').child('Primordial Glyph')
//                     //   poolRef = db.ref('discover pools').child('Wild').child('Class').child('Mage').child('Spell')
//                     //   poolRef.on('value', (data) => {
//                     //     cardRef.set({["Pool"]:data}).then(() => {
//                     //       console.log("prim glyph data set")
//                     //     }).catch(function (error) {
//                     //       console.log('Setting pool to card ' + error);
//                     //     });
//                     //   })
//                     // }
//                     // console.log(cardList[expansion][card].name + " url has been saved")
//                 }).catch(function (error) {
//                     console.log('Setting discover cardobject: ' + error);
//                 });
//             }
//         }

//         //TAUNT
//         ref = db.ref('discover pools').child('Wild').child('Taunt').child(cardName)
//         if (cardObject.hasOwnProperty('text')) {
//             if (cardObject.text.match(/(Taunt)(\\n)*/g)) {

//                 ref.set(cardObject).then(() => {
//                     // console.log(cardList[expansion][card].name + " url has been saved")
//                 }).catch(function (error) {
//                     console.log('Synchronization failed for: ' + cardName);
//                 });
//             }
//         }


//     }
// });

//     })








// function saveFileToFirebase(url, name,storageRef) {
//   var imageRef = storageRef.child('images/' + name + ".png");
//   var xhr = new XMLHttpRequest();
//   xhr.responseType = 'blob';
//   xhr.onload = () => {
//     var blob = xhr.response;
//     imageRef.put(blob).then((snapshot) => {
//       console.log("uploaded" + name)
//     }).catch((error) => {
//       console.log('Upload failed for: ' + name);
//     })
//   }
//   xhr.open('GET', url);
//   xhr.send()
// }





