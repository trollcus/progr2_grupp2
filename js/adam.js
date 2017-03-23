if (document.readyState != 'loading') {
    onDocumentReady();
} else {
    document.addEventListener('DOMContentLoaded', onDocumentReady);
}

function onDocumentReady() {
  // Document ready
  leaderBoardLast();
  teamLeader();
}

function quitImage(){
  window.location.href = '../index.html';
}

function backToGame(){
  window.location.href = 'index.html#quiz';
}

function leaderBoardLast() {
  var array = [];
  var query = firebase.database().ref("p2/");
  query.child('users').orderByChild('points').on('value', function (snapshot) {
    snapshot.forEach(function(child){

      array.push(child.val());
    });
    // Call for function to create list when the request for object is done
    leader();
});



function leader(){
  var arrReverse = array.reverse();
  for(i = 0; i < 3; i++){
    var liPlacement = document.getElementById('leader-' + i);
    liPlacement.innerHTML = arrReverse[i].user + ' ' + arrReverse[i].points;
  }
}
}


// Get and dsplay each teams score
function teamLeader() {
  var dataPathTeam = firebase.database().ref("p2/points/teams/");
  dataPathTeam.once('value').then(function(teamSnapshot) {
      for (i = 0; i < 5; i++) {
          var teams = teamSnapshot.child(i).child('teamName').val();
          var teamPoints = teamSnapshot.child(i).child('amountCorrect').val();
          switch (i) {
              case 0:
                  document.getElementById("green_score").value = teamPoints;
                  break;
              case 1:
                  document.getElementById("blue_score").value = teamPoints;
                  break;
              case 2:
                  document.getElementById("pink_score").value = teamPoints;
                  break;
              case 3:
                  document.getElementById("yellow_score").value = teamPoints;
                  break;
              case 4:
                  document.getElementById("gray_score").value = teamPoints;
                  break;
          }
      }

  });
}
