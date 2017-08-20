

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
  var database = firebase.database();

  //
  // ─── GET CARD LIST ──────────────────────────────────────────────────────────────
  //
  var cardList = database.ref('cardList').once('value').then(function (snapshot) {
    var cardList = snapshot.val();
    console.log(cardList)
  });

  //TODO: Create handling for users to define discover pool

  //
  // ─── GET ALL MAGE SPELLS ────────────────────────────────────────────────────────
  //
  ref = database.ref().child('discover pools/Standard/Class/Mage/Spell')
  var mageSpellList = ref.on('value', function (snapshot) {
    var mageSpellList = snapshot.val();
    console.log(mageSpellList)
    for (card in mageSpellList) {
      // console.log(card)
      // console.log(mageSpellList[card].img)
      if (mageSpellList.hasOwnProperty(card)) {
        addImage(mageSpellList[card], "discover_pool")
      }
    }
  }, (error) => { console.log("the read failed: " + error) })


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
});




function addImage(card, container) {
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
    .click(function () {
      console.log($("#user_selection > #" + card.cardId))
      if ($("#user_selection > #" + card.cardId).length ==0) {
        var $div = $("<div/>", { "class": "image_container", "id": card.cardId });
        console.log($div)

        //
        // ──────────────────────────────────────────────────────────────────────────────── I ──────────
        //   :::::: D E L E T I N G   W R O N G   I M A G E : :  :   :    :     :        :          :
        // ──────────────────────────────────────────────────────────────────────────────────────────
        //

        
        $(this).clone().appendTo("#user_selection").click(() => {
          console.log($(this.click))
          $(this).remove();
        });
      }
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



