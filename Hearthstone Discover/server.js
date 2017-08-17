const unirest = require('unirest');
const fs = require('fs');
const express = require('express');
var app = express();
app.use(function (req, res) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);

});

var server = app.listen(8080, ()=> {console.log('listening')})
app.use(express.static(__dirname + '/images'))
app.get('/imageList', imageList);

function imageList(req,res){
    fs.readdir(__dirname + '/images', (err, files)=>{
        console.log(files);
    //    res.send(files)
        })

}
var cardList = {}

unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards")
    .header("X-Mashape-Key", "KOkEd2dvbzmshtB9Pnai1Z0TTA6Xp1HjiXPjsnn294AfPssRiT")
    .end((result) => {
        console.log(result.status, result.headers);
        cardList = result.body;
        var path = './cardList.json'

        fs.open(path, 'r+', 0666, (err, fd) => {
            if (err) { throw err; }
            console.log("file opened");

            //writes all the data from twitch emote list to my local emote_list.json
            fs.writeFile(fd, JSON.stringify(cardList, null, 2), function (err) {
                if (err) { throw err; }
                // console.log(cardList.length);
                console.log('file written');

                fs.close(fd, function () {
                    console.log('file closed');
                });
            });
        });
        console.log("response has completed")
        // console.log(Object.keys(cardList));
 
    });

    






