

$(document).ready(function () {


  var config = {
    apiKey: "AIzaSyDySolLS5sfsLlP3ouHp_CmdesJS-pDaZE",
    authDomain: "hearthstone-discover.firebaseapp.com",
    databaseURL: "https://hearthstone-discover.firebaseio.com",
    projectId: "hearthstone-discover",
    storageBucket: "",
    messagingSenderId: "541695389765"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  console.log(database)
  var ref = database.ref("urls");
  var image = database.ref('urls/Mana Bind').once('value').then(function (snapshot) {
    var url = snapshot.val();
    console.log(url)
     $("body").append("<img src="+url+">");
    // ...
  });



  
  // //Loading images into the webpage

  // var folder = "http://localhost:8080/imageList";
  // console.log(folder)
  // $.get(folder, function (data) {
  //         console.log(data)} , 'text')

});



