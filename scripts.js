$('#save-btn').on('click', userData);
$('.input-task').on('keyup', enableBtn);
$('.input-title').on('keyup', enableBtn);
$('.append-here').on('click', '#delete-btn', removeCard);
// $('.append-here').on('click', '#upvote-btn', setQuality);
// $('.append-here').on('click', '#downvote-btn', setQuality);
$('.append-here').on('blur', 'p', editTask);
$('.append-here').on('blur', 'h3', editTitle);
$('#search-field').on('keyup', searchCards)
$(document).ready(displayTen);
$('.append-here').on('click', '.completed-btn', toggleCompletedAppearance);
$('.append-here').on('click', '.completed-btn', completedValue);
$('.completed-tasks').on('click', showCompleted);
$('.more-tasks').on('click', getCardFromStoreage);

function NewCard (title, task, id, quality, completed){
  this.title = title;
  this.task = task;
  this.id = id;
  this.quality = quality || ' swill';
  this.voteCounter = 0; 
  this.completed = false;
}

NewCard.prototype.prependCard = function() {
   $('.append-here').prepend(`<article class="cards" id="${this.id}">
    <button class="top-card card-button" id="delete-btn"></button>
    <h3 class="top-card" contenteditable=true>${this.title}</h3>
    <p contenteditable=true>${this.task}</p>
    <button class="card-button bottom-line" id="upvote-btn"></button>
    <button class="card-button bottom-line" id="downvote-btn"></button>
    <h6 class="bottom-line">quality: <span class="quality-change">${this.quality}</span></h6>
    <button class="completed-btn">Mark as Completed</button>
    </article>`);
};

function enableBtn() {
  var titleInput = $('.input-title');
  var taskInput = $('.input-task');
  if (titleInput.val()  && taskInput.val()){
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
  var $taskInput = $('.input-task').val();
  var id = Date.now();
  // var completed = 'notCompleted';
  var card = new NewCard ($titleInput, $taskInput, id);
  secondaryFunctions(card);
};

function secondaryFunctions(card) {
  card.prependCard();
  storeCard(card);
  $('.input-title').val('');
  $('.input-task').val('');
  $('#save-btn').attr('disabled', true);
};

function storeCard(card) {
  var stringifiedCard = JSON.stringify(card);
  localStorage.setItem(card.id, stringifiedCard);
}
  
function getCardFromStoreage() {
  $('.cards').addClass('hidden');
  for(var i = 0; i < localStorage.length; i++){
  var retrieveCard = localStorage.getItem(localStorage.key(i));
  var parsedCard = JSON.parse(retrieveCard);
  if (parsedCard.completed === false) {
    var refreshCard = new NewCard (parsedCard.title, parsedCard.task, parsedCard.id, parsedCard.quality);
    refreshCard.prependCard();
    }
  }
}

function removeCard() {
  var idRemoved = $(this).parent().attr('id');
  $(this).parent().remove();
  localStorage.removeItem(idRemoved);
}

// function setQuality() {
//   var key = $(this).parent().attr('id');
//   var retrieveObject = localStorage.getItem(key);
//   var parseObject = JSON.parse(retrieveObject);
//   if( event.target.id === 'upvote-btn' && parseObject.voteCounter < 3){
//     parseObject.voteCounter++;
//     console.log(parseObject.voteCounter)
//   }
  // var qualityText = $(this).siblings('h6').children('span').text();
  // var qualityArray = ['swill', 'plausible', 'genius'];
  // var button = $(this);
  // changeQuality(button, parseObject, qualityArray, qualityText);
// }

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
  var taskText = $(this).text();
  parseObject.task = taskText;
  var stringTask = JSON.stringify(parseObject);
  localStorage.setItem(cardId, stringTask);
};

function searchCards() {
  $('.cards').addClass('hidden');
  for (var i = 0; i <localStorage.length; i++) {
    var key = localStorage.key(i);
    var pulledObject = localStorage.getItem(key);
    var parseObject = JSON.parse(pulledObject);
    if (parseObject.title.includes($(this).val()) || parseObject.task.includes($(this).val())) {
      var cardId = '#' + parseObject.id;
      $(cardId).removeClass('hidden');
    };
  };
};

function toggleCompletedAppearance() {
  $(this).closest('article').toggleClass('completed-card');
  $(this).closest('article').find('button').toggleClass('completed-card-buttons');
 }

function completedValue() {
  var cardId = $(this).parent().attr('id');
  var storedId = localStorage.getItem(cardId);
  var parseObject = JSON.parse(storedId);
  if($(this).closest('article').hasClass('completed-card') === true) {
    parseObject.completed = true;
    var stringTask = JSON.stringify(parseObject);
    localStorage.setItem(cardId, stringTask);
  } else {
    parseObject.completed = false;
    var stringTask = JSON.stringify(parseObject);
    localStorage.setItem(cardId, stringTask);
  }
}

function showCompleted() {
  $('.cards').addClass('hidden');
  for(var i = 0; i < localStorage.length; i++){
  var retrieveCard = localStorage.getItem(localStorage.key(i));
  var parsedCard = JSON.parse(retrieveCard);
  if(parsedCard.completed === true) {
    // $('.cards').toggleClass('.completed-card');
    var refreshCard = new NewCard (parsedCard.title, parsedCard.task, parsedCard.id, parsedCard.quality);
    refreshCard.prependCard();
  }
}}

function displayTen() {
  var newArray = [];  
    for(var i = 0; i < localStorage.length; i++){
    newArray.push(localStorage.key(i));
    var sortedArray = newArray.sort(function(a, b) {
     return a - b;
    });
    var retrieveCard = localStorage.getItem(localStorage.key(i));
    var parsedCard = JSON.parse(retrieveCard);
    if (newArray.length <= 10 && parsedCard.completed === false){
    var refreshCard = new NewCard (parsedCard.title, parsedCard.task, parsedCard.id, parsedCard.quality);
    refreshCard.prependCard();
    }
  }
}
