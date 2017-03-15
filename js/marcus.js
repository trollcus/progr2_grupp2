var provider = new firebase.auth.GoogleAuthProvider();

if (document.readyState != 'loading') {
    onDocumentReady();
} else {
    document.addEventListener('DOMContentLoaded', onDocumentReady);
}

function onDocumentReady() {
  // Document ready
}

function loginButton() {
    firebase.auth().signInWithPopup(provider).then(function(result) {
        console.log("Logged in");
        userInfo();
        var login = document.getElementById('loginButton');
        var loginChoice = document.getElementById('loginChoice');
        login.style.display = "none";
        loginChoice.style.display = "block";

    }).catch(function(error) {
        console.log("Unsuccessful login");
          console.log(error.message);
    });
}

function userInfo() {
    //Get the user will be null/false if not logged in
    var user = firebase.auth().currentUser;
    if (user) {
        var name = user.displayName;
        var email = user.email;
        var photoUrl = user.photoURL;
        var emailVerified = user.emailVerified;
        var uid = user.uid;
    } else {
        console.log("Not logged in");
    }
}

function createUser(name, team) {
  this.team = team;
  this.user = name;
}

function inputTeam() {
  var user = firebase.auth().currentUser;
  if (user){
    var datapath = firebase.database().ref('users/');
    var blueTeam = document.getElementById('blueTeam');
    var greenTeam = document.getElementById('greenTeam');
    var greyTeam = document.getElementById('greyTeam');
    var yellowTeam = document.getElementById('yellowTeam');
    var pinkTeam = document.getElementById('pinkTeam');
    var teamValue;

    if(blueClick.called){
      console.log(blueTeam.value);
      teamValue = blueTeam.value;
    }
    if(greenClick.called){
      console.log(greenTeam.value);
      teamValue = greenClick.value;
    }
    if(greyClick.called){
      console.log(greyTeam.value);
      teamValue = greyClick.value;
    }
    if(yellowClick.called){
      console.log(yellowTeam.value);
      teamValue = yellowClick.value;
    }
    if(pinkClick.called){
      console.log(pinkTeam.value);
      teamValue = pinkClick.value;
    }
    var info = new createUser(user.displayName, teamValue);
    datapath.push(info).then(function() {
      console.log("Save succeeded");
    }).catch(function(error){
      console.log("Error");
    });
  }
}

function blueClick(){
  var blueTeam = document.getElementById('blueTeam');
  blueClick.called = true;
  return blueTeam.value;
}
function greenClick(){
  greenClick.called = true;
  var greenTeam = document.getElementById('greenTeam');
  return greenTeam.value;
}
function greyClick(){
  greyClick.called = true;
  var greyTeam = document.getElementById('greyTeam');
  return greyTeam.value;
}
function yellowClick(){
  yellowClick.called = true;
  var yellowTeam = document.getElementById('yellowTeam');
  return yellowTeam.value;
}
function pinkClick(){
  pinkClick.called = true;
  var pinkTeam = document.getElementById('pinkTeam');
  return pinkTeam.value;
}
