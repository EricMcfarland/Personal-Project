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
        'a1': 'a1',
        'a2': 'a2',
        'a3': {
            '3a': '3a',
            '4a': '4a',
        },
    },
    'B': {
        'b1': 'b1',
        'b2': 'b2',
    }


}

// var filteredcardList = filterList(cardlist, ["Classic", "Basic", "Whispers of the Old Gods", "Mean Streets of Gadgetzan", "One Night in Karazhan", "Journey to Un'Goro", "Knights of the Frozen Throne"], ['*'],['name'])
// console.log("filtered list is:")
// console.log(JSON.stringify(filteredcardList, null, 2))

var filteredSampleList = filterList(samplelist, ['A', 'B'],['*'],['3a'])
console.log("filtered list is:")
console.log(JSON.stringify(filteredSampleList, null, 2))


//filterList() Will remove all objects within an object that does not contain
//the given parameter filters. The filters will be applied serially going down the
//children tree of the object. 
//TODO: Doesnt filter out object of depths shallowe than the number of arguments
//Input (list, n number of arguments)
//  -list is required to be an object
//  -arguments are to be arrays of strings
//      -an argument of ['*'] is a pass all argument that will pass all objects in that level of the tree
//Output
// -a filtered object based on the argument filters
//
//Example
//list = var samplelist = {
//     'A': {
//         'a1': 'a1',
//         'a2': 'a2',
//         'a3': {
//             '3a': '3a',
//             '4a': '4a',
//         },
//     },
//     'B': {
//         'b1': 'b1',
//         'b2': 'b2',
//     }
// }
//filterList(list, ['A'],['*'],[])
function filterList(list) {
    var args = arguments
    console.log("input list is:")
    console.log(JSON.stringify(list, null, 2))
    var arrayOfFilters = [], newList;
    //handle no filter passed, return input value
    if (arguments.length === 1) {
        console.log("no filter specified");
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
    console.log("array of filters is:")
    console.log(arrayOfFilters)

    //create a pass all filter of '', else set the filter to argument
    if (arrayOfFilters[0] == '*') {
        currentFilter = Object.keys(list)
    } else {
        var currentFilter = arrayOfFilters[0];
    }

    console.log("current filter is: ")
    console.log(currentFilter)

    //After setting the current filter remove it
    // creating an array of remaining filters to apply
    arrayOfFilters.shift();

    // console.log("list keys are: " + Object.keys(list))

    //Create the new list object. Makes an array of keys from the list
    //filters out all the keys not included in the filter
    //recursively builds the object applying all the filters
    newList = Object.keys(list)
        .filter(key => currentFilter.includes(key))         //filter out by key names
        .reduce((obj, key) => {                             //build new list of object by calling
            //only the filtered key values
            console.log("list[" + key + "] is:")
            console.log(list[key])
            if (list[key] instanceof Object) {

                console.log("new args are:")
                console.log([list[key]].concat(arrayOfFilters))
                obj[key] = filterList.apply(this, [list[key]].concat(arrayOfFilters))
                return obj


            } else {
                //handles case when last object is only a key:value pair
                // console.log("else")
                // console.log("list["+key+"] is:")
                // console.log(list[key])
                obj[key] = list[key]
                return obj
            }


        }, {})

    return newList

}