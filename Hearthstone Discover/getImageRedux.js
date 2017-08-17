//get and save all images to a file
const fs = require('fs');
const https = require('https');
const http = require('http')
getAllImages('./cardList.json');

function getAllImages(file) {
    //open the JSON file to grab ID's from
    var list = {}
    var name = ""
    var id = ""
    var request
    fs.open(file, 'r', 0666, function (err, fd) {
        if (err) { throw err; }
        console.log('cardList file opened');

        fs.readFile(fd, (err, data) => {
            if (err) throw err;
            list = JSON.parse(data);

            // console.log(list.length);

            //go through all expansions listed in the card list
            // name = list[expansion][card].name.replace(/['"*!:?|[\]\/]+/g, '')
            // id = list[expansion][card].cardId

            // //define the path
            // path = './images/' + name + ".png"

            //open the file to write image to

            //TODO: Issue with writing the images. Something to do with bad file descriptor
            //TODO: Try again next time with a single image, work from there
            fs.openSync('./images/' + 'Kindly Grandmother' + ".png", 'w', 0666)
            console.log('./images/' + 'Kindly Grandmother' + ".png was opened")
            request = http.get("http://media.services.zam.com/v1/media/byName/hs/cards/enus/" + 'KAR_005' + ".png",
                (res) => {
                    console.log(res.headers)
                    console.log("status: " + res.statusCode)
                    var imagedata = ''
                    res.setEncoding('binary')

                    res.on('data', (chunk) => {
                        imagedata += chunk
                    })
                    res.on('end', () => {
                        console.log(imagedata.length)
                        fs.writeFile('./images/Kindly Grandmother.png', imagedata, 'binary', () => {

                            console.log('File saved.')
                        })

                    })
                })

            // console.log(list[expansion][card].name);

            fs.close(fd, () => { console.log(file + ' has been closed') })


            fs.close(fd, () => { console.log(file + ' has been closed') })

        })
    })

}