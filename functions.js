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

function openEstabname() {
  document.getElementById("estabName").style.display = "block";
}


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

  if (element.classList.contains("active")) {
    deactivateThumb(id);
  } else if (element2.classList.contains("active")){
      activeThumb(id);
      deactivateThumb(id2);
  } else {
    activeThumb(id);
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