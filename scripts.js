$('#save-btn').on('click', userData);
$('.input-task').on('keyup', enableBtn);
$('.input-title').on('keyup', enableBtn);
$('.append-here').on('click', '#delete-btn', removeCard);
$('.append-here').on('click', '#upvote-btn', setImportance);
$('.append-here').on('click', '#downvote-btn', setImportance);
$('.append-here').on('blur', 'p', editTask);
$('.append-here').on('blur', 'h3', editTitle);
$('#search-field').on('keyup', searchCards)
$(document).ready(displayTen);
$('.append-here').on('click', '.completed-btn', toggleCompletedAppearance);
$('.append-here').on('click', '.completed-btn', completedValue);
$('.completed-tasks').on('click', showCompleted);
$('.more-tasks').on('click', getCardFromStoreage);

function NewCard (title, task, id, importance, completed){
  this.title = title;
  this.task = task;
  this.id = id;
  this.importance = importance || ' Normal';
  this.importanceCounter = 2; 
  this.completed = false;
}

NewCard.prototype.prependCard = function() {
   $('.append-here').prepend(`<article class="cards" id="${this.id}">
    <button class="top-card card-button" id="delete-btn"></button>
    <h3 class="top-card" contenteditable=true>${this.title}</h3>
    <p contenteditable=true>${this.task}</p>
    <button class="card-button bottom-line" id="upvote-btn"></button>
    <button class="card-button bottom-line" id="downvote-btn"></button>
    <h6 class="bottom-line">Importance: <span class="importance-change">${this.importance}</span></h6>
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
    var refreshCard = new NewCard (parsedCard.title, parsedCard.task, parsedCard.id, parsedCard.importance);
    refreshCard.prependCard();
    }
  }
}

function removeCard() {
  var idRemoved = $(this).parent().attr('id');
  $(this).parent().remove();
  localStorage.removeItem(idRemoved);
}

function setImportance(e) {
  var key = $(this).parent().attr('id');
  var retrieveObject = localStorage.getItem(key);
  var parsedObject = JSON.parse(retrieveObject);
  var htmlText = $(this).siblings('h6').children('span');
  setImportanceCounter(e, parsedObject, htmlText, key);
}

function setImportanceCounter(e, parsedObject, htmlText, key) { 
  if (e.target.id === 'upvote-btn' && parsedObject.importanceCounter < 4 ) {
    parsedObject.importanceCounter++;
    var stringifyObject = JSON.stringify(parsedObject);
    localStorage.setItem(key, stringifyObject);
    changeImportanceText(parsedObject, htmlText, key)
  } else if (e.target.id === 'downvote-btn' && (parsedObject.importanceCounter > 0)) {
    parsedObject.importanceCounter--;
    var stringifyObject = JSON.stringify(parsedObject);
    localStorage.setItem(key, stringifyObject);
    changeImportanceText(parsedObject, htmlText, key);
  }
}

function changeImportanceText(parsedObject, htmlText, key) {
  console.log(htmlText)
  var importanceArray = ['None', 'Low', 'Normal', 'High', 'Critical'];
  importanceArray.forEach(function(value, index) {
    if (parsedObject.importanceCounter  === index) {
      parsedObject.importance = value;
      htmlText.text(value);
      var stringifyObject = JSON.stringify(parsedObject);
      localStorage.setItem(key, stringifyObject);
    }
  })
}

function editTitle() {
  var cardId = $(this).parent().attr('id');
  var storedId = localStorage.getItem(cardId);
  var parsedObject = JSON.parse(storedId);
  var titleText = $(this).text();
  parsedObject.title = titleText;
  var stringTitle = JSON.stringify(parsedObject);
  localStorage.setItem(cardId, stringTitle);
};

function editTask() {
  var cardId = $(this).parent().attr('id');
  var storedId = localStorage.getItem(cardId);
  var parsedObject = JSON.parse(storedId);
  var taskText = $(this).text();
  parsedObject.task = taskText;
  var stringTask = JSON.stringify(parsedObject);
  localStorage.setItem(cardId, stringTask);
};

function searchCards() {
  $('.cards').addClass('hidden');
  for (var i = 0; i <localStorage.length; i++) {
    var key = localStorage.key(i);
    var pulledObject = localStorage.getItem(key);
    var parsedObject = JSON.parse(pulledObject);
    if (parsedObject.title.includes($(this).val()) || parsedObject.task.includes($(this).val())) {
      var cardId = '#' + parsedObject.id;
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
  var parsedObject = JSON.parse(storedId);
  if($(this).closest('article').hasClass('completed-card') === true) {
    parsedObject.completed = true;
    var stringTask = JSON.stringify(parsedObject);
    localStorage.setItem(cardId, stringTask);
  } else {
    parsedObject.completed = false;
    var stringTask = JSON.stringify(parsedObject);
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
    var refreshCard = new NewCard (parsedCard.title, parsedCard.task, parsedCard.id, parsedCard.importance);
    refreshCard.prependCard();
    }
  }
}

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
    var refreshCard = new NewCard (parsedCard.title, parsedCard.task, parsedCard.id, parsedCard.importance);
    refreshCard.prependCard();
    }
  }
}
