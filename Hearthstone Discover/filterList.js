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

// var filteredcardList = filterList(cardlist, ["Classic", "Basic", "Whispers of the Old Gods", "Mean Streets of Gadgetzan", "One Night in Karazhan", "Journey to Un'Goro", "Knights of the Frozen Throne"])

// console.log(JSON.stringify(filteredcardList, null, 2))

var filteredSampleList = filterList(samplelist, ['A', 'B'])

console.log(JSON.stringify(filteredSampleList, null, 2))



function filterList(list) {
    var args = arguments
    console.log(JSON.stringify(list,null,2))
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
        .filter(key => currentFilter.includes(key))
        .reduce((obj, key) => {

            //TODO: 
            // ─── DURING SECOND KEY THE FIRST LIST[KEY] IS BEING ADDED TO NEWARGS 
            //

            var newArgs = arrayOfFilters;

            console.log("list["+key+"] is:")
            console.log(list[key])
            if (list[key] instanceof Object) {
                newArgs.unshift(list[key])
                console.log("new args are:")
                console.log(newArgs)
                obj[key] = filterList.apply(this, newArgs)
                return obj


            } else {
                //handles case
                // console.log("else")
                // console.log("list["+key+"] is:")
                // console.log(list[key])
                obj[key] = list[key]
                return obj
            }


        }, {})

    return newList

}