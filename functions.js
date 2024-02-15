function openForm() {
    document.getElementById("myForm").style.display = "block";
}
  
function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

function openReviews() {
  document.getElementById("reviews").style.display = "block";
}

function closeReviews() {
  document.getElementById("reviews").style.display = "none";
}

function openComment() {
  document.getElementById("commentForm").style.display = "block";
}

function closeComment() {
  document.getElementById("commentForm").style.display = "none";
}

function openReplies() {
  document.getElementById("commentReply").style.display = "flex";
}

function closeReplies() {
  document.getElementById("commentReply").style.display = "none";
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