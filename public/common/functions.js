function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}

function openReviews(id) {
document.getElementById(id).style.display = "block";
}

function closeReviews(id) {
document.getElementById(id).style.display = "none";
}

function openComment(id) {
document.getElementById(id).style.display = "block";
}

function closeComment(id) {
document.getElementById(id).style.display = "none";
}

function openReplies(id) {
document.getElementById(id).style.display = "flex";
}

function closeReplies(id) {
document.getElementById(id).style.display = "none";
}

function openEstabl() {
if (document.getElementById("estbownerbtn1").checked) {
  document.getElementById("elandm").style.display = "inline";
  document.getElementById("elandm-label").style.display = "inline";
}
else {
  document.getElementById("elandm").style.display = "none";
  document.getElementById("elandm-label").style.display = "none";
}

}

document.addEventListener("DOMContentLoaded", function() {
const viewRepliesButtons = document.querySelectorAll(".viewreplies-button");

viewRepliesButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        // Find the corresponding review container 3
        const reviewContainer3 = button.closest('.reviewcontainer2');

        // Toggle the display of review container 3
        const replyContainer = reviewContainer3.querySelector(".replytoreview");
      
      // Toggle visibility of corresponding reply container
      if (replyContainer) {
        replyContainer.style.display = replyContainer.style.display === "none" ? "block" : "none";
      }
    });
});
});

document.addEventListener("DOMContentLoaded", function() {
  // Get all reply buttons and reply containers
  const replyButtons = document.querySelectorAll(".reply-button");
  // Loop through each reply button
  replyButtons.forEach(function(button) {
    // Add click event listener to toggle display of corresponding reply container
    button.addEventListener("click", function() {
      // Get the closest parent review container
      const reviewContainer = button.closest('.reviewcontainer2');
      
      // Find the reply container within the same review container
      const replyContainer = reviewContainer.querySelector(".reply-container");
      
      // Toggle visibility of corresponding reply container
      if (replyContainer) {
        replyContainer.style.display = replyContainer.style.display === "none" ? "block" : "none";
      }
    });
  });
});

/*thumbs up and down */
function activeThumb(id) {
var element = document.getElementById(id);
element.classList.add("active");
}

function deactivateThumb(id) {
var element = document.getElementById(id);
element.classList.remove("active");
}

function toggleThumb(id, id2) {
var element = document.getElementById(id);
var element2 = document.getElementById(id2);
var number = parseInt(element.textContent);
var number2 = parseInt(element2.textContent);

if (element.classList.contains("active")) {
  deactivateThumb(id);
  var number = parseInt(element.textContent);
  if (number!=0){
    element.textContent = --number;
  }

} else if (element2.classList.contains("active")){
    activeThumb(id);
    deactivateThumb(id2);
    element.textContent = ++number;
    if (number!=0){
      element2.textContent = --number2;
    }
} else {
  activeThumb(id);
  var number = parseInt(element.textContent);
  element.textContent = ++number;
}
}



function toggleComments(id, id2, id3) {
var button = document.getElementById(id);
if (button.textContent === 'Show/Leave Comments') {
    button.textContent = 'Close Comments';
    openComment(id2);
    openReplies(id3);
} else {
    button.textContent = 'Show/Leave Comments';
    closeComment(id2);
    closeReplies(id3);
}
}


function toggleVisibility(ID) {
  var dropdown = document.getElementById(ID);    
  if(dropdown.style.display == "inline-block") { // if is menuBox displayed, hide it
    dropdown.style.display = "none";
  }
  else { // if is menuBox hidden, display it
    dropdown.style.display = "inline-block";
  }
}

/*menu button *kinda broken*/
function toggleMenu() {
  var menuBox = document.getElementById('menu');    
  if(menuBox.style.display == "inline-block") { // if is menuBox displayed, hide it
    menuBox.style.display = "none";
  }
  else { // if is menuBox hidden, display it
    menuBox.style.display = "inline-block";
  }
}

/*change color of tags upon select*/
function select(id) {

var div = document.getElementById(id);

if(div.classList.contains("tags")  )
{
div.classList.replace("tags", "tags-selected");
}
else{
    
div.classList.replace("tags-selected", "tags");
}

}





function toggleVisibility(ID, button) {
var dropdown = document.getElementById(ID); 
var press =  document.getElementById(button); 
if(dropdown.style.display == "inline-block") { // if is menuBox displayed, hide it
  dropdown.style.display = "none";
  press.style.backgroundColor = "seagreen";
}
else { // if is menuBox hidden, display it
  dropdown.style.display = "inline-block";
  press.style.backgroundColor = "#037c07";
}
}

/*menu button */
function toggleMenu() {
var menuBox = document.getElementById('menu');    
if(menuBox.style.display == "inline-block") { // if is menuBox displayed, hide it
  menuBox.style.display = "none";
}
else { // if is menuBox hidden, display it
  menuBox.style.display = "inline-block";
}
}

/*change color of tags upon select*/
function select(id) {

var div = document.getElementById(id);

if(div.classList.contains("tags")  )
{
div.classList.replace("tags", "tags-selected");
}
else{
  
div.classList.replace("tags-selected", "tags");
}
}

$(document).ready(function(){
  $('#search-field').parent().submit(function(event){
    event.preventDefault();
    alert("Functionality coming in MCO3!");
});

$(document).on('click', '#changepic', function(){
  alert("Functionality coming in MCO3!");
});

$(document).on('click', '#changebio', function(){
  alert("Functionality coming in MCO3!");
});

$(document).on('click', '#reportuser', function(){
  alert("Functionality coming in MCO3!");
});

$(document).on('click', '#mapbutton', function(){
  alert("Functionality coming in MCO3!");
});

$(document).on('click', '#changerestopic', function(){
  alert("Functionality coming in MCO3!");
});

$(document).on('click', '#changerestobio', function(){
  alert("Functionality coming in MCO3!");
});

$(document).on('click', '#reportresto', function(){
  alert("Functionality coming in MCO3!");
});


$(document).on('click', '#review', function(){
  alert("Functionality coming in MCO3!");
});

$(document).on('click', '#reply', function(){
  alert("Functionality coming in MCO3!");
});

$(document).on('click', '#editcomment', function(){
  alert("Functionality coming in MCO3!");
});

$(document).on('click', '#deletecomment', function(){
  alert("Functionality coming in MCO3!");
});

$(document).on('click', '#replyedit', function(){
  alert("Functionality coming in MCO3!");
});

$(document).on('click', '#deletereply', function(){
  alert("Functionality coming in MCO3!");
});


  


});//doc
