

//filterObjswithProp(obj,prop,regex) will search an object of any depth for a child object with
//the specified prop:regex pair, and return an object containing all children objects with said pair.
//The keys for the returned object will be the key name of the children object, and keys are assumed to be unique
//duplicate key names will be overwrote by the last key in the initial object
//Inputs:
//     -obj: The object to be searched
//     -prop: The prop required to exist in the object
//     -regex: The required regex to be associated with prop in order to return the object
// Outputs:
//     -A object containing all of the childern objects that contain the prop:regex pairs
function filterObjsWithProp(obj, prop, regex) {
    var successObjects = {}

    //recursive digging function
    function searchObjForProp(obj, prop, regex) {
        if (obj.hasOwnProperty(prop)) {
            console.log("test is: "+obj[prop])
            console.log(regex.test(obj[prop]))
            if (regex.test(obj[prop])) {
                return obj
            }
        }

        for (key in obj) {
            if (typeof obj[key] === 'object') {
                console.log("key is: "+key)
                console.log("regex is: "+regex)
                var a = searchObjForProp(obj[key], prop, regex)
                if (a) {
                    successObjects[key]=a
                }
            }
        }

    }
    searchObjForProp(obj,prop,regex);
    return successObjects
}
var cardlist = {
    "Basic": {
        "AFK": {
            "cardId": "GAME_004",
            "dbfId": "1740",
            "name": "AFK",
            "cardSet": "Basic",
            "type": "Enchantment",
            "text": "Your turns are shorter.",
            "playerClass": "Neutral",
            "locale": "enUS"
        }
    },
    "Classic": {
        "Inspired": {
            "cardId": "CS2_188o",
            "dbfId": "809",
            "name": "'Inspired'",
            "cardSet": "Classic",
            "type": "Enchantment",
            "text": "This minion has +2 Attack this turn.",
            "playerClass": "Neutral",
            "locale": "enUS",
            "mechanics": [
                {
                    "name": "OneTurnEffect"
                }
            ]
        },
        "Inspired2": {
            "cardId": "CS2_188o",
            "dbfId": "809",
            "name": "'Inspired'",
            "cardSet": "Classic",
            "type": "Enchantment",
            "text": "This minion has +2 Attack this turn.",
            "playerClass": "Neutral",
            "locale": "enUS",
            "mechanics": [
                {
                    "name": "OneTurnEffect"
                }
            ]
        }
    },
    "Hall of Fame": {
        "Concealed": {
            "cardId": "EX1_128e",
            "dbfId": "1756",
            "name": "Concealed",
            "cardSet": "Hall of Fame",
            "type": "Enchantment",
            "text": "Stealthed until your next turn.",
            "playerClass": "Rogue",
            "locale": "enUS"
        }
    }

}
var samplelist = {
    'A': {
        'a1': 'aa1',
        'a2': 'aa2',
        'a3': {
            '3a': '3aa',
            '4a': '4aa',
        },
    },
    'B': {
        '3a': 'any',
        'b2': 'bb2',
        // 'b3':{
        //     '3a':'3aa'
        // }
    }


}

// console.log('pre filter')
// console.log(samplelist)

// var filteredObject = filterObjsWithProp(samplelist, '3a', '*')
// var secondFilteredObject = filterObjsWithProp(filteredObject, '4a', '4aa')
// console.log('post filter')
// console.log(filteredObject)
// console.log('post second filter')
// console.log(secondFilteredObject)

console.log('pre filter')
console.log(cardlist)
var allFilter = new RegExp('Inspired')
var filteredObject = filterObjsWithProp(cardlist, 'name', allFilter)
// var secondFilteredObject = filterObjsWithProp(filteredObject, '4a', '4aa')
console.log('post filter')
console.log(filteredObject)
// console.log('post second filter')
// console.log(secondFilteredObject)