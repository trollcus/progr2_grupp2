var provider = new firebase.auth.GoogleAuthProvider();
var teamValue = 'Grey'; // Default team

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
        loginCheck();

    }).catch(function(error) {
        console.log("Unsuccessful login");
          console.log(error.message);
    });
}

function loginCheck(){
  var teamVal;
  var login = document.getElementById('loginButton');
  var loginChoice = document.getElementById('loginChoice');
  var user = firebase.auth().currentUser;
  var datapath = firebase.database().ref('p2/users/' + user.uid);
  datapath.once('value').then(function(snapshot) {
    var teamVal = snapshot.child('team').val();
    if(teamVal) {
      window.location.href = 'quiz/index.html';
      console.log('redirect');
    } else{
      login.style.display = "none";
      loginChoice.style.display = "block";
    }
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

// Function to create the user properties. Here we need what team the user, what category to track, the name and points for scoreboard
function createUser(name, team, category, points) {
  this.team = team;
  this.user = name;
  this.category = category;
  this.points = points;
}

// If user clicks on of the teams the variable gets reassigned to the value
function teamClick(teamChoice){
  teamValue = teamChoice.value;
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

    var points = 0;
    var category = 0;

    var info = new createUser(user.displayName, teamValue, points, category);
    datapath.set(info).then(function() {
      console.log("Save succeeded");
      window.location.href = 'quiz/index.html';
    }).catch(function(error){
      console.log("Error");
    });
  }
}
