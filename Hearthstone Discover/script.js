var database = {}

$(document).ready(function () {

  //
  // ─── FIREBASE SETUP ─────────────────────────────────────────────────────────────
  //
  var config = {
    apiKey: "AIzaSyDySolLS5sfsLlP3ouHp_CmdesJS-pDaZE",
    authDomain: "hearthstone-discover.firebaseapp.com",
    databaseURL: "https://hearthstone-discover.firebaseio.com",
    projectId: "hearthstone-discover",
    storageBucket: "",
    messagingSenderId: "541695389765"
  };
  firebase.initializeApp(config);
  database = firebase.database();

  //
  // ─── GET CARD LIST ──────────────────────────────────────────────────────────────
  //
  var cardList = database.ref('cardList').once('value').then(function (snapshot) {
    var cardList = snapshot.val();
    console.log(cardList)
  });

  //TODO: Create handling for users to define discover pool


  // //
  // // ─── GET ALL MAGE SPELLS ────────────────────────────────────────────────────────
  // //
  // ref = database.ref().child('discover pools/Standard/Class/Mage/Spell')
  // var poolList = ref.on('value', function (snapshot) {
  //   var poolList = snapshot.val();
  //   console.log(poolList)
  //   for (card in poolList) {
  //     // console.log(card)
  //     // console.log(poolList[card].img)
  //     if (poolList.hasOwnProperty(card)) {
  //       addImage(poolList[card], "discover_pool")
  //     }
  //   }
  // }, (error) => { console.log("the read failed: " + error) })


  //
  // ─── EVENT HANDLERS ─────────────────────────────────────────────────────────────
  //
  //TODO: Prevent clicking button before all images load
  $('#odds_button').on('click', () => {

    var numberOfSelectedCards = $('#user_selection > div').length
    console.log("number in selected: " + numberOfSelectedCards);
    var numberInPool = $('#discover_pool > div').length
    console.log("number in pool: " + numberInPool)
    // binomial(5,2);
    // console.log(binomial(5,2))
    var odds = 1 - (binomial(numberOfSelectedCards, 0) * binomial(numberInPool - numberOfSelectedCards, 3)) / (binomial(numberInPool, 3))
    console.log("The odds to discover one of the selected cards is: " + odds)

  })

  $("#loadDiscover").bind('click', ()=>{
    $('#discover_card_images').empty()
    loadDiscoverCards('discover pools/' + $('#selector_format').val() + '/Discover Card/')
  })
  $("#loadPool").bind('click', ()=>{
    //Gets the values from the pool down menus
    var hsClass = $('#selector_class').val();
    console.log(hsClass)
    var cardType = $('#selector_type').val();
    console.log(cardType)
    var format = $('#selector_format').val();
    console.log(format)
    getPool('discover pools/' + format + '/Class/' + hsClass + '/' + cardType)
  })


  //GetPool(path) will get the discover pool based on the input path.
  //Also clears all the previous images
  //TODO: handle the invalid pull downs such as weapons, and hero for the classes without them
  //      Generate the options dynamically
  function getPool(path) {
    
    //Clears the card images in discover pool
    $('#discover_pool').empty();

    //Point to pool based on pull down menus
    var ref = database.ref().child(path)
    var poolList = ref.on('value', function (snapshot) {
      var poolList = snapshot.val();
      console.log(poolList)
      for (card in poolList) {
        // console.log(card)
        // console.log(poolList[card].img)
        if (poolList.hasOwnProperty(card)) {
          addImage(poolList[card], "discover_pool", (imageDiv)=>{
            if ($("#user_selection > #" + card.cardId).length == 0) {
              console.log("this is:")
              console.log(imageDiv)
                  var $div = $(imageDiv).clone(false).appendTo("#user_selection").on('click', (e) => {
                $(e.currentTarget).remove()
              });
            }
          })
        }
      }
    }, (error) => { console.log("the read failed: " + error) })
  }

  function loadDiscoverCards(path) {
    var format = $('#selector_format').val();
    var ref = database.ref().child(path)
    var discoverCard = ref.on('value', function (snapshot) {
      var discoverCard = snapshot.val();
      for (card in discoverCard) {
        addImage(discoverCard[card], "discover_card_images",(imageDiv)=>{
          if ($("#user_selection > #" + card.cardId).length == 0) {
            console.log("this is:")
            console.log(imageDiv)
                var $div = $(imageDiv).clone(false).appendTo("#user_selection").on('click', (e) => {
              $(e.currentTarget).remove()
            });
          }
        })
      }
    }, (error) => { console.log("the read failed: " + error) })
  }
  
  //TODO: Add a callback to define what the click function should be
  function addImage(card, container, clickCallback) {
    // console.log("addImage() called")
    var img = new Image();
    $(img).attr({
      src: card.img,
      class: "card_image"
    })
    var $div = $("<div/>", { "class": "image_container", "id": card.cardId });
    $($div).append(img);
    // console.log($div)
    $div.appendTo($("#" + container)) //main div
      .bind('click',function () {
        var self = this
        clickCallback(self)
      })


  }

  function binomial(n, k) {
    var binomials = [
      [1],
      [1, 1],
      [1, 2, 1],
      [1, 3, 3, 1],
      [1, 4, 6, 4, 1]
    ];
    function pascal(n, k) {
      while (n >= binomials.length) {
        let s = binomials.length;
        nextRow = [];
        nextRow[0] = 1;
        for (let i = 1, prev = s - 1; i < s; i++) {
          nextRow[i] = binomials[prev][i - 1] + binomials[prev][i];
        }
        nextRow[s] = 1;
        // console.log(nextRow);
        binomials.push(nextRow);
      }
      return binomials[n][k]
    }
    // console.log(binomials);
    return pascal(n, k);
  }

});




