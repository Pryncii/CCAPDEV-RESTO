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
  document.getElementById("category").style.display = "inline";
  document.getElementById("category-label").style.display = "inline";
  document.getElementById("map").style.display = "inline";
  document.getElementById("map-label").style.display = "inline";
  document.getElementById("price").style.display = "inline";
  document.getElementById("price-label").style.display = "inline";
}
else {
  document.getElementById("elandm").style.display = "none";
  document.getElementById("elandm-label").style.display = "none";
  document.getElementById("category").style.display = "none";
  document.getElementById("category-label").style.display = "none";
  document.getElementById("map").style.display = "none";
  document.getElementById("map-label").style.display = "none";
  document.getElementById("price").style.display = "none";
  document.getElementById("price-label").style.display = "none";
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

if (!element) {
  console.error("Element with ID", id, "not found");
  return;
}

if (!element2) {
  console.error("Element with ID", id2, "not found");
  return;
}


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

document.addEventListener("DOMContentLoaded", function() {
  const likeButtons = document.querySelectorAll(".like");

  likeButtons.forEach(function(button) {
      button.addEventListener("click", function() {
          // Get the IDs of the like and dislike buttons
          console.log(button.id);
          const likeId = button.id;
          let likeId2;
          if (likeId.includes("dislike")){
            
            likeId2 = likeId.replace("dislike", "like");
          }
          else {
            likeId2 = likeId.replace("like", "dislike");
          }
          // Check if both elements exist
          if (likeId && likeId2) {
            toggleThumb(button.id, likeId2);
          }
      });
  });
});

function likedislike(restodata, user, action, revindex, comindex){

  
  const userModel = mongoose.model('users', userSchema);
    if(comindex == -1){
      //if review
      if(action == like ){
        //tryna like
        
        if(restodata.revdata[revindex].dislikes.contains(user.name)){
          //tryna dislike
        } 
      
    }
    
  }//if
  /** */

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
  var newHtmlContent = `
  <form class="review-form-container" action = "change-profilepic" method ="post"">
      <textarea name="userbio" id="reviewcomment">Enter New Image Link!</textarea>
      <button type="submitreview-button" class="editbio-button">Submit</button>
  </form>
`;
$('.userbio').html(newHtmlContent);
});

$(document).on('click', '#changebio', function(){
  var newHtmlContent = `
        <form class="review-form-container" action = "change-userbio" method ="post"">
            <textarea name="userbio" id="reviewcomment">Enter New Bio!</textarea>
            <button type="submitreview-button" class="editbio-button">Submit</button>
        </form>
    `;
    $('.userbio').html(newHtmlContent);
});


$(document).on('click', '#reportuser', function(){
  var newHtmlContent = `
        <form class="review-form-container" action = "report-user" method ="post">
            <textarea name="userbio" id="reviewcomment">What's the issue?</textarea>
            <button type="submitreview-button" class="editbio-button">Submit</button>
        </form>
    `;
    $('.userbio').html(newHtmlContent);
});

$(document).on('click', '#mapbutton', function(){
  alert("Functionality coming in MCO3!");
});

$(document).on('click', '#changerestopic', function(){
  var newHtmlContent = `
  <form class="review-form-container" action = "change-restopic" method ="post"">
      <textarea name="userbio" id="reviewcomment">Enter New Image Link!</textarea>
      <button type="submitreview-button" class="editbio-button">Submit</button>
  </form>
`;
$('.userbio').html(newHtmlContent);
});

$(document).on('click', '#changerestobio', function(){
  var newHtmlContent = `
        <form class="review-form-container" action = "change-restobio" method = "post">
            <textarea name="restodesc" id="reviewcomment">Enter New Description!</textarea>
            <button type="submitreview-button" class="editbio-button">Submit</button>
        </form>
    `;
    $('.restodesc').html(newHtmlContent);
});

$(document).on('click', '#reportresto', function(){
  var newHtmlContent = `
        <form class="review-form-container" action = "report-resto" method "post">
            <textarea name="restodesc" id="reviewcomment">What's the issue?</textarea>
            <button type="submitreview-button" class="editbio-button">Submit</button>
        </form>
    `;
    $('.restodesc').html(newHtmlContent);
});

function getRating(ratingElements){
  var stars = ratingElements;
  var rating = "";

  console.log("stars: " + stars);
  for (var i = 0; i < 5; i++) {
      if (i <= stars-1) {
          rating += "★"; 
      } else {
          rating += "☆"; 
      }
  }

  return rating;
}

//ADD/EDIT REVIEW
var form = document.getElementById('myForm');

form.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  var person = document.getElementById('review').getAttribute('data-person');
  var resto = document.getElementById('review').getAttribute('data-resto');
  var review = document.getElementById('reviewcomment').value;
  console.log("person: " + person);
  console.log("review: " + review);
  var rating = ""; 

  var ratingElements = 0;
  for (var i = 1; i <= 5; i++) {
    console.log(ratingElements + "!");
        if ($('#star' + i + '-resto').prop('checked')) {
          ratingElements= i;
        }
  }


  rating = getRating(ratingElements);

  console.log("rating: " + rating);

  console.log('IN review request');

  form.reset();

  $.post('/leavereview',{
    review: review, person: person, rating: rating, resto: resto
  }, function(data, status){
    if(status === 'success'){
      console.log('review request successful');
      $('#myForm')[0].reset(); // Use jQuery to reset form
      $('input[name="rate-resto"]').prop('checked', false); // Clear radio buttons
          var ratingElementsL = document.querySelectorAll('input[name="rate-resto"]:checked');
          console.log("ratingElementsL: " + ratingElementsL.length);
      window.location.reload();
      
    }
  });
   
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



// DELETE COMMENT/REPLY
$(document).on('click', '.delete-comment', function(){
  var commentId = $(this).data('commentdelete-id');
  console.log("commentId: " + commentId);

  $.post('/deletecomment',{
    id: commentId,
  }, function(data, status){
    if(status === 'success'){
      console.log('Delete comment request successful');
      window.location.reload();
    }
  });
});  

$(document).on('click', '.reply-button', function(){
  var reviewId = $(this).data('replyto-id');
  var person = $(this).data('person');
  var reply = document.getElementById("reply-text-"+reviewId).value;
  console.log("reviewId: " + reviewId);
  console.log("reply: " + reply);
  console.log("person: " + person);

  $.post('/replycomment',{
    id: reviewId, reply: reply, person: person,
  }, function(data, status){
    if(status === 'success'){
      console.log('Reply request successful');
      window.location.reload();
    }
  });
});  

});//doc
