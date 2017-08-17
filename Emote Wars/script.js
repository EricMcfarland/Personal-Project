//approach to grabbing all emotes:
//  Get emoticon ids from JSONs
//  Use that id to fill this https://static-cdn.jtvnw.net/emoticons/v1/ID/1.0

// TODO: 
//  Start on PredPrey algorithm
var board = [], selectedEmote = 123440;
board.drawBoard = function () {
    //This function updates the displayBoard HTML elements with the current state of the board array
    console.log("board is: ")
    console.log(this);
    var displayTable = document.getElementById("board");

    //loop each space 
    var displayRow = displayTable.firstChild;
    var displayCol = displayTable.firstChild.firstChild;
    this.forEach(function (row, rowIndex, rowArr) {
        row.forEach(function (col, colIndex, colArr) {
            //based on creatures in the board, update the html elements
            if (col instanceof Creature) {
                displayCol.style.backgroundImage = col.getImage();
            } else {
                displayCol.style.backgroundImage = '';
            }

            if (colIndex < colArr.length - 1) {
                displayCol = displayCol.nextSibling;
            }
        })
        if (rowIndex < rowArr.length - 1) {
            displayRow = displayRow.nextSibling;
            displayCol = displayRow.firstChild;
        }
    })
}
board.move = function (oldX, oldY, newX, newY) {
    this[newX][newY] = this[oldX][oldY];
    this[oldX][oldY] = [];
}
board.moveUp = function (oldX, oldY) {
    if (oldY > 0) {
        this[oldY - 1][oldX] = this[oldY][oldX];
        this[oldY][oldX] = [];
    }
}
$(document).ready(function () {

    makeBoard(5, 5);
    getEmotes();
    board.drawBoard();
    //Want to swap this to pure JS
    // $(".counter").on("click", function () {

    //     switch ($(this).html()) {
    //         case "+":
    //             workDuration++;
    //             $("#duration").html(workDuration);
    //             break
    //         case "-":
    //             if (workDuration > 0) {
    //                 workDuration--;
    //                 $("#duration").html(workDuration);
    //             }
    //             break
    //     }
    // })

})
function gameLoop() {
    // makeCreatureList();
    board.moveUp(1, 1);
    board.drawBoard();

}
function makeBoard(height, width) {
    var rows, cols, tab, tr, td, boardHeight = height, boardWidth = width;
    tab = document.getElementById("board");

    //clear existing board
    while (tab.firstChild) {
        tab.removeChild(tab.firstChild);
        board.pop();
    }

    //create the board and displayBoard spaces
    for (var row = 0; row < boardHeight; row++) {
        tr = document.createElement('tr');
        board.push([]);

        for (var col = 0; col < boardWidth; col++) {
            board[row].push([]);
            td = document.createElement("td");
            td.className += "boardSpace";
            td.onclick = function () {
                var square = event.target;
                var posY = square.parentElement.rowIndex;
                var posX = square.cellIndex;

                if (board[posY][posX] instanceof Creature && board[posY][posX].emoteId === selectedEmote) {//if square is already a creature, replace if new emote. remove if same
                    board[posY][posX] = [];
                }
                else {                                                          //if not create creature at that board space, and set image
                    creature = new Creature(posX, posY, selectedEmote);
                    board[posY][posX] = creature;


                }
                board.drawBoard();
            }
            tr.appendChild(td);
        }
        tab.appendChild(tr);
    }
    document.getElementById("board").rows[2].cells[2].className += " redBackground";
}

function Creature(posX, posY, emoteId) {
    this.posX = posX;
    this.posY = posY;
    this.emoteId = emoteId;
    this.moveSpeed = 1;
    this.getImage = function () { return "url('https://static-cdn.jtvnw.net/emoticons/v1/" + this.emoteId + "/1.0')" };
    this.moveUp = function () {
        if (this.posX > 0) {
            this.posY = this.posY - 1 * this.moveSpeed;
        }
    };
}

//getting the full list of images is waaaay too slow 
function getEmotes() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'https://twitchemotes.com/api_cache/v2/subscriber.json', true);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                var obj = JSON.parse(xmlhttp.responseText);
                console.log(obj);
                //NEED CHECK FOR if channels + person + emotes exists 
                emotes = obj.channels.moonmoon_ow.emotes
                emoteId = obj.channels.moonmoon_ow.emotes[0].image_id;
                console.log('emoteId: ' + emoteId);
                tab = document.getElementById("emotes");

                for (emote in emotes) {
                    emoteId = emotes[emote].image_id;
                    emoteName = emotes[emote].code;

                    emoteImg = document.createElement("img");
                    emoteImg.className = "emote";
                    //can add an ID

                    emoteImg.setAttribute("src", 'https://static-cdn.jtvnw.net/emoticons/v1/' + emoteId + '/1.0');
                    emoteImg.setAttribute("title", emoteName);
                    emoteImg.setAttribute("name", emoteId);
                    emoteImg.onclick = function () {
                        //create a new Creature and update Array then draw board
                        targetEmote = event.target;
                        selectedEmote = targetEmote.getAttribute("name");
                        allImgs = document.getElementsByClassName("emote");
                        console.log(document.getElementsByClassName("emote")); 
                        console.log(allImgs[0].className) 
                        
                        
                        // = document.getElementsByClassName("emote").className.replace
                        //     (/(?:^|\s)emoteBorder(?!\S)/g, '')
                        for (var index = 0; index < allImgs.length; index++) {
                            var element = allImgs[index];
                            element.className = element.className.replace
                            (/(?:^|\s)emoteBorder(?!\S)/g, '')
                            
                        }
                        targetEmote.className += " emoteBorder";
                    }
                    tab.appendChild(emoteImg);
                }


            }

        }
    }

    xmlhttp.send(null);
}