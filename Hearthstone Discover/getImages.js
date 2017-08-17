//get and save all images to a file
const fs = require('fs');
const https = require('https');
const http = require('http')
getAllImages('./cardList.json');
var count = 0

function getAllImages(file) {
    //open the JSON file to grab ID's from
    var list = {}
    
    var request
   
    fs.open(file, 'r', 0666, function (err, fd) {
        if (err) { throw err; }
        console.log('cardList file opened');

        fs.readFile(fd, (err, data) => {
            if (err) throw err;
            list = JSON.parse(data);

            // console.log(list.length);

            //go through all expansions listed in the card list
            for (var expansion in list) {
                if (list.hasOwnProperty(expansion)) {
                    
                    if (!["Tavern Brawl", "Credits", "Missions", "System" , "Debug"].includes(expansion)) {
                        //go through all the cards listed within the expansions
                        for (var card in list[expansion]) {
                            if (list[expansion].hasOwnProperty(card)) {
                                //remove all the invalid characters for saving to a file. ? / \ * : 

                                //calls a function that opens the path, and creates files if the path isnt there,
                                // and runs an http.get request using the id
                                // then writes to the open path

                                //TODO: fix the filter to remove all the bad request images such as Enchantments, Hero Powers?
                                if (!["Hero Power","Enchantment"].includes(list[expansion][card].type)) {
                                    
                                    if(list[expansion][card].type === "Hero Power"){console.log("Hero power went through")}
                                    if(list[expansion][card].type === "Enchantment"){console.log("Enchant went through")}
                                    openAndWrite(list[expansion][card])

                    
                                }
                            }
                        }
                    }

                }
            }

            fs.close(fd, () => {
                console.log("Successful images: "+count)
                // console.log(file + ' has been closed') 
            })
        });

    })

}

function openAndWrite(cardObject) {
    
    let name = cardObject.name.replace(/['"*!:?|[\]\/]+/g, '')
            let path = './images/' + name + ".png"
    fd = fs.openSync('./images/' + name + ".png", 'w', 0666)
    // console.log('./images/' + name + ".png was opened")
    request = http.get("http://media.services.zam.com/v1/media/byName/hs/cards/enus/" + cardObject.cardId + ".png",
        (res) => {
            // res.setTimeout(25000);
            // console.log("type is: " + cardObject.type)
            const { statusCode } = res

            let error
            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' +
                    `Status Code: ${statusCode}\n` +
                    `card name: ${name}`);

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
                    fs.writeFileSync(path, imagedata, 'binary')
                    count += 1;
                }
                catch (e) {
                    console.error(e.message);
                }
                // console.log('File saved.')


            });
        }).on('error', (e) => {

            console.error(`${cardObject.name} : ${e.message}`)
        })

    fs.close(fd, () => {
        // console.log(path + ' has been closed') 
    })
    // console.log(list[expansion][card].name);
}
