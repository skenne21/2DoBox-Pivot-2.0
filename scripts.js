$('#save-btn').on('click', userData);
$('.input-body').on('keyup', enableBtn);
$('.input-title').on('keyup', enableBtn);
$('.append-here').on('click', '#delete-btn', removeCard);
$('.append-here').on('click', '#upvote-btn', changeUpvote);
$('.append-here').on('click', '#downvote-btn', changeDownvote);
$('.append-here').on('blur', 'p', editTask);
$('.append-here').on('blur', 'h3', editTitle);
$(document).ready(getCardFromStoreage);





// changed input-title and  body from id to classes, check how the are getting inputs?

function NewCard (title, body, id, quality){
  this.title = title;
  this.body = body;
  this.id = id;
  this.quality = quality || ' swill';
}

function enableBtn() {
  var titleInput = $('.input-title');
  var bodyInput = $('.input-body');
  if (titleInput.val()  && bodyInput.val()){
    $('#save-btn').attr('disabled', false);
  } else {
    $('#save-btn').text('Please Fill Out Both Inputs');
    setTimeout(function(){$('#save-btn').text('Save');}, 2000);
    $('#save-btn').attr('disabled', true);  
  }
}

function userData(event) {
  event.preventDefault();
  var $titleInput = $('.input-title').val();
  var $bodyInput = $('.input-body').val();
  var id = Date.now();
  var card = new NewCard ($titleInput, $bodyInput, id);
  secondaryFunctions(card);
};

function secondaryFunctions(card) {
  card.prependCard();
  storeCard(card);
  $('.input-title').val('');
  $('.input-body').val('');
  $('#save-btn').attr('disabled', true);
};

NewCard.prototype.prependCard = function() {
   $('.append-here').prepend(`
    <article class="cards" id="${this.id}">
      <button class="top-card card-button" id="delete-btn"></button>
      <h3 class="top-card" contenteditable=true>${this.title}</h3>
      <p contenteditable=true>${this.body}</p>
      <button class="card-button bottom-line" id="upvote-btn"></button>
      <button class="card-button bottom-line" id="downvote-btn"></button>
      <h6 class="bottom-line">quality:<span class="quality-change">${this.quality}</span></h6>
      <hr>
    </article>`);
};

function storeCard(card){
  var stringifiedCard = JSON.stringify(card);
  localStorage.setItem(card.id, stringifiedCard);
}
  
function getCardFromStoreage(){
  for(var i = 0; i < localStorage.length; i++){
  var retrieveCard = localStorage.getItem(localStorage.key(i));
  var parseCard = JSON.parse(retrieveCard);
  var refreshCard = new NewCard (parseCard.title, parseCard.body, parseCard.id, parseCard.quality);
  refreshCard.prependCard()
  }
}

function removeCard() {
  var idRemoved = $(this).parent().attr('id');
  $(this).parent().remove();
  localStorage.removeItem(idRemoved);
}


function changeUpvote() {
  var key = $(this).parent().attr('id');
  var retrieveObject = localStorage.getItem(key);
  var parseObject = JSON.parse(retrieveObject);
  var htmlText = $(this).siblings('h6').children('span');
  if(htmlText.text() === ' swill') {
    htmlText.text(' plausible');
    parseObject.quality = ' plausible';
    var stringifyObject = JSON.stringify(parseObject);
    localStorage.setItem(key, stringifyObject);
    } else if(htmlText.text() === ' plausible') {
    htmlText.text(' genius');
    parseObject.quality = 'genius';
    var stringifyObject = JSON.stringify(parseObject);
    localStorage.setItem(key, stringifyObject);
  };
};


function changeDownvote() {
  console.log(this)
  var key = $(this).parent().attr('id');
  var retrieveObject = localStorage.getItem(key);
  var parseObject = JSON.parse(retrieveObject);
  var htmlText = $(this).siblings('h6').children('span');
  if(htmlText.text() === 'genius') {
    htmlText.text(' plausible');
    parseObject.quality = ' plausible';
    var stringifyObject = JSON.stringify(parseObject);
    localStorage.setItem(key, stringifyObject);
  } else if(htmlText.text() === ' plausible') {
    htmlText.text(' swill');
    parseObject.quality = 'swill';
    var stringifyObject = JSON.stringify(parseObject);
    console.log(stringifyObject)
    localStorage.setItem(key, stringifyObject)
  };
};

// downvote and upvote dont work when refreshed, cant figure out why


function editTitle() {
  var cardId = $(this).parent().attr('id');
  var storedId = localStorage.getItem(cardId);
  var parseObject = JSON.parse(storedId);
  var titleText = $(this).text();
  parseObject.title = titleText;
  var stringTitle = JSON.stringify(parseObject);
  localStorage.setItem(cardId, stringTitle);
};


function editTask() {
  var cardId = $(this).parent().attr('id');
  var storedId = localStorage.getItem(cardId);
  var parseObject = JSON.parse(storedId);
  var paraObject = $(this).text();
  parseObject.body = paraObject;
  var stringBody = JSON.stringify(parseObject);
  localStorage.setItem(cardId, stringBody);
};




