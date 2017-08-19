

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

  //get the card list 
  var cardList = database.ref('cardList').once('value').then(function (snapshot) {
    var cardList = snapshot.val();
    console.log(cardList)
  });

  //get all the mage spells
  ref = database.ref().child('discover pools/Standard/Class/Mage/Spell')
  var mageSpellList = ref.on('value', function (snapshot) {
    var mageSpellList = snapshot.val();
    console.log(mageSpellList)
    for (card in mageSpellList) {
      // console.log(card)
      // console.log(mageSpellList[card].img)
      if (mageSpellList.hasOwnProperty(card)) {
        addImage(mageSpellList[card].img, "discover_pool")
      }
    }

  }, (error) => { console.log("the read failed: " + error) })


  // var ref = database.ref("urls");
  // var image = database.ref('urls/Mana Bind').once('value').then(function (snapshot) {
  //   var url = snapshot.val();
  //   console.log(url)
  //    $("body").append("<img src="+url+">");
  //   // ...
  // });






  // //Loading images into the webpage

  // var folder = "http://localhost:8080/imageList";
  // console.log(folder)
  // $.get(folder, function (data) {
  //         console.log(data)} , 'text')

});

function addImage(path, container) {
  // console.log("addImage() called")
  var img = new Image();
  $(img).attr({
    src: path,
    class: "card_image"
  })

  var $div= $("<div/>",{"class":"image_container" });
  
  $($div).append(img);
  console.log($div)
  $div.appendTo($("#" + container)) //main div
    .click(function () {
      var $div= $("<div/>",{"class":"image_container" });
      $(this).clone().appendTo("#user_selection").click(()=>{
        $(this).remove();
      });
    })
  //   .hide()
  //   .slideToggle(300)
  //   .delay(2500)
  //   .slideToggle(300)
  //   .queue(function () {
  //   $(this).remove();
  // });
  
  
  // console.log('#' + container)
  // console.log(img)
  

}



