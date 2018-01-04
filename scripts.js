$('#save-btn').on('click', userData);
$('.input-task').on('keyup', enableBtn);
$('.input-title').on('keyup', enableBtn);
$('.append-here').on('click', '#delete-btn', removeCard);
$('.append-here').on('click', '#upvote-btn', setImportance);
$('.append-here').on('click', '#downvote-btn', setImportance);
$('.append-here').on('blur', 'p', editCard);
$('.append-here').on('blur', 'h3', editCard);
$('#search-field').on('keyup', searchCards)
$('.append-here').on('click', '.completed-btn', toggleCompletedAppearance);
$('.append-here').on('click', '.completed-btn', completedValue);
$('.completed-tasks').on('click', refreshSecondaryFunction);
$('.more-tasks').on('click', getCardFromStoreage);
$('.critical-btn').on('click', filterImportance);
$('.high-btn').on('click', filterImportance);
$('.normal-btn').on('click', filterImportance);
$('.low-btn').on('click', filterImportance);
$('.none-btn').on('click', filterImportance);
$(document).ready(displayTen);

function NewCard (title, task, id, importance, completed){
  this.title = title;
  this.task = task;
  this.id = id;
  this.importance = importance || 'Normal';
  this.importanceCounter = 2; 
  this.completed = false;
};

function userData(event) {
  event.preventDefault();
  var $titleInput = $('.input-title').val();
  var $taskInput = $('.input-task').val();
  var id = Date.now();
  var card = new NewCard ($titleInput, $taskInput, id);
  secondaryFunctions(card);
};

function enableBtn() {
  var titleInput = $('.input-title');
  var taskInput = $('.input-task');
  if (titleInput.val()  && taskInput.val()) {
    $('#save-btn').attr('disabled', false);
  } else {
    $('#save-btn').text('Please Fill Out Both Inputs');
    setTimeout(function(){$('#save-btn').text('Save');}, 2000);
    $('#save-btn').attr('disabled', true);  
  };
};

function secondaryFunctions(card) {
  card.prependCard();
  storeCard(card);
  $('.input-title').val('');
  $('.input-task').val('');
  $('#save-btn').attr('disabled', true);
};

function displayTen() {
  var newArray = [];  
  for(var i = 0; i < localStorage.length; i++) {
    newArray.push(localStorage.key(i));
    var sortedArray = newArray.sort(function(a, b) {
    return a - b;
  });
  var retrieveCard = localStorage.getItem(localStorage.key(i));
  var parsedCard = JSON.parse(retrieveCard);
  if (newArray.length <= 10 && parsedCard.completed === false) {
    var refreshCard = new NewCard (parsedCard.title, parsedCard.task, parsedCard.id, parsedCard.importance);
    refreshCard.prependCard();
    };
  };
};

function storeCard(card) {
  var stringifiedCard = JSON.stringify(card);
  localStorage.setItem(card.id, stringifiedCard);
};

function retrieveCard() {
  var objectArray = [];
  for (var i = 0; i <localStorage.length; i++) {
  var pulledObject = localStorage.getItem(localStorage.key(i));
  var parsedObject = JSON.parse(pulledObject);
  objectArray.push(parsedObject);
 } 
  return objectArray;
}
  
function getCardFromStoreage() {
  $('.cards').addClass('hidden');
  var storeCards = retrieveCard();
  storeCards.forEach(function(card) {
  if (card.completed === false) {
    var refreshCard = new NewCard (card.title, card.task, card.id, card.importance);
    refreshCard.prependCard();
    };
  });
};

NewCard.prototype.prependCard = function() {
   $('.append-here').prepend(`<article class="cards" id="${this.id}">
    <button class="top-card card-button" id="delete-btn"></button>
    <h3 class="top-card" id="card-title" contenteditable=true>${this.title}</h3>
    <p contenteditable=true>${this.task}</p>
    <button class="card-button bottom-line" id="upvote-btn"></button>
    <button class="card-button bottom-line" id="downvote-btn"></button>
    <h6 class="bottom-line">Importance: <span class="importance-change">${this.importance}</span></h6>
    <button class="completed-btn">Mark as Completed</button>
    </article>`);
};

function removeCard() {
  var idRemoved = $(this).parent().attr('id');
  $(this).parent().remove();
  localStorage.removeItem(idRemoved);
};

function setImportance(e) {
  var key = $(this).parent().attr('id');
  var retrieveObject = localStorage.getItem(key);
  var parsedObject = JSON.parse(retrieveObject);
  var htmlText = $(this).siblings('h6').children('span');
  setImportanceCounter(e, parsedObject, htmlText, key);
};

function setImportanceCounter(e, parsedObject, htmlText, key) { 
  if (e.target.id === 'upvote-btn' && parsedObject.importanceCounter < 4 ) {
    parsedObject.importanceCounter++;
    storeCard(parsedObject);
    changeImportanceText(parsedObject, htmlText, key);
  } else if (e.target.id === 'downvote-btn' && (parsedObject.importanceCounter > 0)) {
    parsedObject.importanceCounter--;
    storeCard(parsedObject);
    changeImportanceText(parsedObject, htmlText, key);
  };
};

function changeImportanceText(parsedObject, htmlText, key) {
  var importanceArray = ['None', 'Low', 'Normal', 'High', 'Critical'];
  importanceArray.forEach(function(value, index) {
    if (parsedObject.importanceCounter  === index) {
      parsedObject.importance = value;
      htmlText.text(value);
      storeCard(parsedObject);
    };
  });
};

function filterImportance() {
 $('.cards').addClass('hidden'); 
 var importanceText = $(this).text();
 var storeCards = retrieveCard();
 storeCards.forEach(function(card) {
  if (card.importance === importanceText) {
      var cardId = '#' + card.id;
      $(cardId).removeClass('hidden');
    };
  })
};

function editCard() {
  var cardId = $(this).parent().attr('id');
  var storedId = localStorage.getItem(cardId);
  var parsedObject = JSON.parse(storedId);
  var titleText = $(this).parent().find('h3').text();
  var taskText = $(this).parent().find('p').text();
  parsedObject.title = titleText;
  parsedObject.task = taskText;
  storeCard(parsedObject);
}

function searchCards() {
  var searchText =$(this).val();
  $('.cards').addClass('hidden');
  var storeCards = retrieveCard();
  storeCards.forEach(function(card) {
    if (card.title.includes(searchText) || card.task.includes(searchText)) {
      var cardId = '#' + card.id;
      $(cardId).removeClass('hidden');
    };
  });
};

function toggleCompletedAppearance() {
  $(this).closest('article').toggleClass('completed-card');
  $(this).closest('article').find('button').toggleClass('completed-card-buttons');
 };

function completedValue() {
  var cardId = $(this).parent().attr('id');
  var storedId = localStorage.getItem(cardId);
  var parsedObject = JSON.parse(storedId);
  if($(this).closest('article').hasClass('completed-card') === true) {
    parsedObject.completed = true;
    storeCard(parsedObject);
  } else {
    parsedObject.completed = false;
    storeCard(parsedObject);
  };
};

 function refreshSecondaryFunction() {
  $(document).ready(reloadCards);
 };

function reloadCards() {
  var storeCards = retrieveCard();
  storeCards.forEach(function(card) {
  var refreshCard = new NewCard (card.title, card.task, card.id, card.importance); 
  refreshCard.prependCard();
  showCompleted(card);
   });
  };

function showCompleted(parsedObject) {
  $('.cards').addClass('hidden');
  if(parsedObject.completed === true) {
    var cardId = '#' + parsedObject.id;
    $(cardId).show();
    $(cardId).addClass('completed-card');
    $(cardId).find('button').toggleClass('completed-card-buttons');
  };
};
