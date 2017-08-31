var myObject = {
    nameKey: {                          //newName: {                       
        'name': 'newName'               //      'name':'newName'
    },                                  //},
    key: [                              //key: [
        {                               //  Eric: {
            "name": "Eric!",            //      "name":"Eric!"
            mechanic: [{ name: "SD" }]  //      mechanic:[SD: {name:"SD"}]
        },                              //  },
        {                               //  Beth: {
            "name": "Beth"              //      'name':"Beth"
        },                              //  },
        //],
    ],
    // // "name": "c",   //name property in the base object will cause problems it seems
    // keyTwo: {
    //     "name":'keyThree',
    //     noName: {
    //         "name": "non array"
    //     }
    // },
    // keyThree:{
    // //     name:{
    // //         "a":"a",
    // //         "b":"b"
    // //     }
    // // }

    // // 'name': 'Kain'
}

var renamedObject = renameKeys(myObject)
console.log("renamed object:")
console.log(JSON.stringify(renamedObject, null, 2))

// console.log(renamedObject)

//I want to make a function to rekey the keys of an object to "name" if a key of "name" exists

function renameKeys(object) {
    // go through each key in the object
    var newObject = {};
    for (var key in object) {
        //only do the non-prototyped keys

        if (object.hasOwnProperty(key)) {
            console.log(object)
            if (typeof object[key] === 'object') {
                console.log("digdig")
                console.log("key: " + key)

                newObject[key] = renameKeys(object[key]);
            }
            if (object[key].hasOwnProperty("name")) {
                // console.log(JSON.stringify(object[key])+ " has 'name'")
                console.log("has name")
                console.log(object[key])
                //has to add property to parent object of name:namelessObject
                var newName = object[key].name.replace(/['"*!:.?|[\]\/]+/g, '')
                // console.log(JSON.stringify(object))
                // console.log(JSON.stringify(object[key]))

                Object.defineProperty(object, newName,
                    Object.getOwnPropertyDescriptor(object, key));
                Object.defineProperty(newObject, newName,
                    Object.getOwnPropertyDescriptor(object, key));
                delete newObject[key]
                
                delete object[key]
                console.log('added renamed to oldObj')
                console.log(JSON.stringify(object, null, 2))
                console.log('added renamed to newObj')
                console.log(JSON.stringify(newObject, null, 2))
                // console.log(object instanceof Array)
                // console.log(key)
                // console.log("added "+newName+ " to "+JSON.stringify(object[key]));

            }



            // console.log(object[key])


        }
    }
    // console.log(newObject)
    // console.log("from")
    // console.log(object)
    //  console.log(JSON.stringify(object))
    return newObject
}