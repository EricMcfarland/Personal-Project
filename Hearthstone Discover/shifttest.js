
var myString = 'name:a'
console.log(myString)
var vals = myString.split(/:(.+)/)
var key = vals[0]
console.log(key)

if(vals.length == 1){
    console.log("no regex parameter")
}else{
    var regexString = vals[1]
    console.log(regexString)
    regex = new RegExp(regexString,'gi')
    console.log(regex)
}

// var array = ['a']
// console.log(array)
// var newArray = array
// newArray.unshift('b')
// console.log("new array: "+newArray)
// console.log("old array: "+array)