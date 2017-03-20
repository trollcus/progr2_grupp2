if (document.readyState != 'loading') {
    onDocumentReady();
} else {
    document.addEventListener('DOMContentLoaded', onDocumentReady);
}

function onDocumentReady() {
  // Document ready
  leaderBoardLast();
}

function quitImage(){
  window.location.href = '../index.html';
}

function backToGame(){
  window.location.href = 'index.html';
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

var placement = document.getElementById('leaderUl');


function leader(){
  var arrReverse = array.reverse();
  var ul = document.createElement('ul');
  placement.appendChild(ul);
  // console.log(arrReverse);
  for(i = 0; i < 3; i++){

    var li = document.createElement('li');
    var line = document.createElement('hr');


    li.innerHTML = arrReverse[i].user + ' ' + arrReverse[i].points;
    ul.appendChild(li);
    ul.appendChild(line);
  }
}
}
