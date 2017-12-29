var $titleInput = $('.input-title');
var $taskInput = $('.input-task');
var $saveBtn = $('#save-btn');
var $appendHere = $('.append-here');
var $deleteBtn = $('#delete-btn');


// changed input-title and  body from id to classes, check how the are getting inputs?

function NewCard (title, task, id, quality){
  this.title = title;
  this.task = task;
  this.id = id;
  this.quality = quality || ' swill';
}

NewCard.prototype.prependCard = function() {
   $appendHere.prepend(`<article class="cards" id="${this.id}">
    <button class="top-card card-button" id="delete-btn"></button>
    <h3 class="top-card" contenteditable=true>${this.title}</h3>
    <p contenteditable=true>${this.task}</p>
    <button class="card-button bottom-line" id="upvote-btn"></button>
    <button class="card-button bottom-line" id="downvote-btn"></button>
    <h6 class="bottom-line">quality: <span class="quality-change">${this.quality}</span></h6>
    <button class="completed-btn">Mark as Completed</button>
    </article>`);
};

$saveBtn.on('click', function(event){
  event.preventDefault();
  var id = Date.now();
  var card = new NewCard ($titleInput.val(), $taskInput.val(), id);
  card.prependCard();
  $titleInput.val("");
  $taskInput.val("");
  storeCard(card);
});

function storeCard(card){
  var stringifiedCard = JSON.stringify(card);
  localStorage.setItem(card.id, stringifiedCard);
}

$(document).ready(getCard);
  
function getCard(){
  for(var i = 0; i < localStorage.length; i++){
  var retrieveCard = localStorage.getItem(localStorage.key(i));
  var parseCard = JSON.parse(retrieveCard);
  var refreshCard = new NewCard (parseCard.title, parseCard.task, parseCard.id, parseCard.quality);
  refreshCard.prependCard()
  }
}

$appendHere.on('click', '#delete-btn', function(event) {
  var idRemoved = $(this).parent().attr('id');
  $(this).parent().remove();
  localStorage.removeItem(idRemoved);
});

$appendHere.on('click', '#upvote-btn', function(event) { 
  var cardId = $(this).parent().attr('id');
  var storedId = localStorage.getItem(cardId);
  var parseId = JSON.parse(storedId);
  var htmlText = $(this).siblings('h6').children('span');
  if(htmlText.text() === ' swill') {
    htmlText.text(' plausible');
    parseId.quality = ' plausible';
  } else if(htmlText.text() === ' plausible') {
    htmlText.text(' genius');
    parseId.quality = 'genius';
  };
  var stringedId = JSON.stringify(parseId);
  localStorage.setItem(cardId, stringedId);
});

$appendHere.on('click', '#downvote-btn', function(event) { 
  var cardId = $(this).parent().attr('id');
  var storedId = localStorage.getItem(cardId);
  var parseId = JSON.parse(storedId);
  var htmlText = $(this).siblings('h6').children('span');
  if(htmlText.text() === ' genius') {
    htmlText.text(' plausible');
    parseId.quality = ' plausible';
  } else if(htmlText.text() === ' plausible') {
    htmlText.text(' swill');
    parseId.quality = 'swill';
  };
  var stringedId = JSON.stringify(parseId);
  localStorage.setItem(cardId, stringedId);
});

$appendHere.on('blur', 'h3', function() {
  var cardId = $(this).parent().attr('id');
  var storedId = localStorage.getItem(cardId);
  var parseObject = JSON.parse(storedId);
  var titleText = $(this).text();
  parseObject.title = titleText;
  var stringTitle = JSON.stringify(parseObject);
  localStorage.setItem(cardId, stringTitle);
});

$appendHere.on('blur', 'p', function (){
  var cardId = $(this).parent().attr('id');
  var storedId = localStorage.getItem(cardId);
  var parseObject = JSON.parse(storedId);
  var paraObject = $(this).text();
  parseObject.task = paraObject;
  var stringTask = JSON.stringify(parseObject);
  localStorage.setItem(cardId, stringTask);
});





