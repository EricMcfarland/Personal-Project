//TODO: PROGRESS JOURNAL
//TODO: PROGRESS JOURNAL
//TODO: PROGRESS JOURNAL
//TODO: PROGRESS JOURNAL
//TODO: PROGRESS JOURNAL
//TODO: PROGRESS JOURNAL
const tmi = require('tmi.js');
const https = require('https');
const fs = require('fs');
var data = ""
var emoteList = {}

//TODO: Handle the async of getting all the files, then start the twitch bot

// DONE: Grab a list of emotes from twitchemotes.com in order to use them as trigger keywords
// TODO: grab the list of emotes from a given channel (Do i have to grab ALL emote list?)
https.get('https://twitchemotes.com/api_cache/v3/global.json', (res) => {
    console.log('statusCode: ', res.statusCode);
    console.log('headers: ', res.headers);
    res.setEncoding('utf8');
    res.on('data', (d) => {
        //DONE: Write ALL the information from the buffer into one file  
        //TODO: (OR SERVER)
        //DONE:  Maybe write it into JSON file format

        //put all data into a single string once its all read
        data += d;


    });
    res.on('end', () => {
        //converts the string of data into a JSON
        emoteList = JSON.parse(data)
        console.log(emoteList.length)

        fs.open('./website/emote_list.json', 'r+', 0666, function (err, fd) {
            if (err) { throw err; }
            console.log('file opened');

            //writes all the data from twitch emote list to my local emote_list.json
            fs.writeFile(fd, JSON.stringify(emoteList, null, 2), function (err) {
                if (err) { throw err; }
                console.log(data.length);
                console.log('file written');

                fs.close(fd, function () {
                    console.log('file closed');
                });
            });
        });
        console.log("response has completed")
    });

}).on('error', (e) => {
    console.error(e);
});






// TODO: Get a simple write to a local file (OR IS IT TO THE SERVER?) from information of the bot
//TODO: Figure out a way to save and manipulate a .json psuedo-database


// TODO: Have bot react based on emotes from file

const options = {
    options: {
        debug: true
    },
    connection: {
        cluster: "aws",
        reconnect: true
    },
    identity: {
        username: "MuhChatExperienceBot",
        password: "oauth:tmos0m8wharh46j70hjx87k0xtsl5n"
    },
    channels: ["kainhighwind_"]

};

const client = new tmi.client(options);
client.connect();

//successful connected response
client.on("connected", (address, port) => {
    console.log("The address is: " + address + " and port is: " + port);
})

//Action for when a message occurs in a given channel
client.on('chat', (channel, user, message, self) => {
    var emoteNames = Object.keys(emoteList);
    for (var index = 0; index < emoteNames.length; index++) {
        if (message === emoteNames[index]) {
            client.action("kainhighwind_", emoteNames[index]);
        }
    }

})

//returns the emotes that the bot can use
client.on('emotesets', (sets, obj) => {

})


