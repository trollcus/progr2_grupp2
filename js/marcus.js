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
        // var user = firebase.auth().currentUser;
        // if(user){
        //   var datapath = firebase.database().ref('p2/users/' + user.uid);
        //   console.log(datapath);
        // }
        // if(datapath.child('team').val() == 'Blue' && datapath == 'Pink' && datapath == 'Yellow' && datapath == 'Grey' && datapath == 'Green'){
        //   console.log("yo");
        // }
        // console.log(datapath.child('team').val());
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

function createUser(name, team, category, points) {
  this.team = team;
  this.user = name;
  this.category = category;
  this.points = points;
}

function inputTeam() {
  var user = firebase.auth().currentUser;
  if (user){
    var datapath = firebase.database().ref('p2/users/' + user.uid);
    var blueTeam = document.getElementById('blueTeam');
    var greenTeam = document.getElementById('greenTeam');
    var greyTeam = document.getElementById('greyTeam');
    var yellowTeam = document.getElementById('yellowTeam');
    var pinkTeam = document.getElementById('pinkTeam');
    var teamValue;
    var points = 0;
    var category = 0;

    if(greenClick.called){
      console.log(teamValue);
      teamValue = greenTeam.value;
    }
    if(blueClick.called){
      console.log(teamValue);
      teamValue = blueTeam.value;
    }

    if(greyClick.called){
      console.log(teamValue);
      teamValue = greyTeam.value;
    }
    if(yellowClick.called){
      console.log(teamValue);
      teamValue = yellowTeam.value;
    }
    if(pinkClick.called){
      console.log(teamValue);
      teamValue = pinkTeam.value;
    }
    var info = new createUser(user.displayName, teamValue, points, category);
    datapath.set(info).then(function() {
      console.log("Save succeeded");
    }).catch(function(error){
      console.log("Error");
    });
  }
}

function blueClick(){
  blueClick.called = true;
  var blueTeam = document.getElementById('blueTeam');

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
