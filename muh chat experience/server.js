//TODO: PROGRESS JOURNAL
//TODO: PROGRESS JOURNAL
//TODO: PROGRESS JOURNAL
//TODO: PROGRESS JOURNAL
//TODO: PROGRESS JOURNAL
//TODO: PROGRESS JOURNAL

//TODO: Start a server
//TODO: create an API to write to a jsonfile
// 

const express = require('express');
const fs = require("fs");
var app = express();
var server = app.listen(8080, listening);

function listening() {
    console.log("listening...");
}

app.use(express.static('website'))

//TODO: Send back data from the emote_list.json 
app.get("/emoteCount", getCount);
    function getCount(request, response) {
        response.send("working?");
    }

var emoteList = fs.readFile('./website/emote_list.json', (err,data)=>{
    if(err) throw err;
    console.log(JSON.parse(data));
});

//TODO: Set up API routes to manipulate the emote_list.json
