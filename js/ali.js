var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var localCorrecter = 0;


if (document.readyState != 'loading') {
    onDocumentReady();
} else {
    document.addEventListener('DOMContentLoaded', onDocumentReady);
}

function onDocumentReady() {
    //document.addEventListener('onclick', questionDisplay);
    checkLoggedIn();
}

var category;

function startQuiz(){
  var parent = document.getElementById('placeQuestions');
  // Elements we need
  var section = document.createElement('section');
  var divLeaderLogin = document.createElement('div');
  var button = document.createElement('button');
  var h2 = document.createElement('h2');
  var ulList = document.createElement('ul');


  var span = document.createElement('span');

  //---- Klasser

  section.setAttribute('class', 'preplay-wrap');
  section.setAttribute('id', 'prePlaySection');
  divLeaderLogin.setAttribute('class', 'leaderboard-login');
  button.setAttribute('class', 'button-green');
  button.setAttribute('onClick', 'questionDisplay()');
  button.setAttribute('id', 'leaderButton');
  span.setAttribute('id', 'point');


  h2.innerHTML = 'Leaderboard';
  button.innerHTML = 'Lets play!';

  // ----
  parent.appendChild(section);
  section.appendChild(button);
  section.appendChild(divLeaderLogin);

  divLeaderLogin.appendChild(h2);
  divLeaderLogin.appendChild(ulList);



  // leaderboard

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
    // console.log(arrReverse);
    for(i = 0; i < arrReverse.length; i++){
      var li = document.createElement('li');
      var line = document.createElement('hr');


      li.innerHTML = arrReverse[i].user + ' ' + arrReverse[i].points;
      ulList.appendChild(li);
      ulList.appendChild(line);
    }
  }
}





function checkLoggedIn() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var datapathUser = firebase.database().ref('p2/users/' + user.uid);
            datapathUser.once('value').then(function(snapshot) {
                category = snapshot.child('category').val();
                startQuiz();
            });
        } else {
            // No user is signed in.
            window.location.href = '../index.html';
        }
    });
}

var questionsArray = [];

function questionDisplay() {
    var disable = document.getElementById('prePlaySection');
    disable.style.display = 'none';
    for (i = 0; i < 5; i++) {
        questionMaker(i);
        if(i === 4) {
          timeoutQuestion(i);
        }
    }

}


function timeoutQuestion(i){
  setTimeout(function() {
    // Push score to database
    var user = firebase.auth().currentUser;
    var info = localCorrecter;
    var categoryNum;
    if(user){
      var datapath = firebase.database().ref("p2/users/" + user.uid);

      datapath.once('value').then(function(snapshot){
        categoryNum = snapshot.child('category').val();
        pointsTemp = snapshot.child('points').val();
        team = snapshot.child('team').val();
        var teamNum;
        switch(team){
          case 'Green':
            teamNum = 0;
            break;
          case 'Blue':
            teamNum = 1;
            break;
          case 'Pink':
            teamNum = 2;
            break;
          case 'Yellow':
            teamNum = 3;
            break;
          case 'Grey':
            teamNum = 4;
            break;
        }
        console.log(team);
        categoryNum++;
        var pointsNum = pointsTemp + info;
        var teamTemp = 0;
        var dataPathTeam = firebase.database().ref("p2/points/teams/" + teamNum);

        // Updating the team value
        dataPathTeam.once('value').then(function(teamSnapshot){
          teamTemp = teamSnapshot.child('amountCorrect').val();
          // console.log(teamTemp);
          var teamNum = teamTemp + info;
          // console.log(teamTemp);
          dataPathTeam.update({
            amountCorrect: teamNum
          }).then(function(){
            console.log('Saved' + localCorrecter +  'to the'  + team + ' team');
          });
        });


        datapath.update({
          points: pointsNum,
          category: categoryNum
        }).then(function(){
          console.log('saved points');
        });
      });
    }


  }, (8000 * i) + 8000);
  setTimeout(function() {
    window.location.href = 'leaderboard.html';
  }, (8000 * i) + 8500);
}

function questionMaker(i) {
    setTimeout(function() {
        var button;
        var localCounter;
        var user = firebase.auth().currentUser;
        var datapath = firebase.database().ref("p2/questions/" + category + "/");

        datapath.once('value').then(function(snapshot) {
            var categoryTitle = snapshot.child('title').val();

            // Creating Element for title and appending

            var section = document.createElement('section');
            var question = document.createElement('div');
            var questionOption = document.createElement('div');
            var correctOrWrong = document.createElement('div');
            var categoryH2 = document.createElement('h2');
            var questionH1 = document.createElement('h1');
            var buttonCorrect = document.createElement('button');
            var buttonWrong = document.createElement('button');
            var buttonWrong1 = document.createElement('button');
            var buttonWrong2 = document.createElement('button');

            section.setAttribute('id', 'questions');
            section.setAttribute('class', 'question-wrap');
            question.setAttribute('class', 'question-window');
            questionOption.setAttribute('class', 'question-option');
            correctOrWrong.setAttribute('id', 'question-option-window'  + '-' + i);

            document.getElementById('placeQuestions').appendChild(section);
            categoryH2.innerHTML = categoryTitle;
            section.appendChild(question);
            question.appendChild(categoryH2);
            question.appendChild(questionH1);
            section.appendChild(questionOption);
            section.style.left = '0px';

            buttonCorrect.setAttribute('type', 'button');
            buttonWrong.setAttribute('type', 'button');
            buttonWrong1.setAttribute('type', 'button');
            buttonWrong2.setAttribute('type', 'button');



            var categoryTag = snapshot.child(i).val();

            var eachQuestion = categoryTag.question;
            var correct = categoryTag.correct;
            var wrong0 = categoryTag.wrong0;
            var wrong1 = categoryTag.wrong1;
            var wrong2 = categoryTag.wrong2;

            // Random putting out color of question

            questionH1.innerHTML = eachQuestion;
            buttonCorrect.innerHTML = correct;
            buttonCorrect.setAttribute('onClick', 'correctAnswer()');
            buttonCorrect.setAttribute('name', 'buttonOption');
            buttonWrong.innerHTML = wrong0;
            buttonWrong.setAttribute('onClick', 'wrongAnswer()');
            buttonWrong.setAttribute('name', 'buttonOption');
            buttonWrong1.innerHTML = wrong1;
            buttonWrong1.setAttribute('onClick', 'wrongAnswer()');
            buttonWrong1.setAttribute('name', 'buttonOption');
            buttonWrong2.innerHTML = wrong2;
            buttonWrong2.setAttribute('onClick', 'wrongAnswer()');
            buttonWrong2.setAttribute('name', 'buttonOption');

            var randomNumber = Math.floor(Math.random() * 4);
            switch(randomNumber){
              case 0:
                buttonCorrect.setAttribute('class', 'button-green');
                buttonWrong.setAttribute('class', 'button-blue');
                buttonWrong1.setAttribute('class', 'button-pink');
                buttonWrong2.setAttribute('class', 'button-yellow');
                break;
              case 1:
                buttonCorrect.setAttribute('class', 'button-yellow');
                buttonWrong.setAttribute('class', 'button-green');
                buttonWrong1.setAttribute('class', 'button-blue');
                buttonWrong2.setAttribute('class', 'button-pink');
                break;
              case 2:
                buttonCorrect.setAttribute('class', 'button-pink');
                buttonWrong.setAttribute('class', 'button-yellow');
                buttonWrong1.setAttribute('class', 'button-green');
                buttonWrong2.setAttribute('class', 'button-blue');

                break;
              case 3:
                buttonCorrect.setAttribute('class', 'button-blue');
                buttonWrong.setAttribute('class', 'button-pink');
                buttonWrong1.setAttribute('class', 'button-yellow');
                buttonWrong2.setAttribute('class', 'button-green');
                break;
            }

            var appendNumber = Math.floor(Math.random() * 4);

            switch(appendNumber){
              case 0:
                questionOption.appendChild(buttonCorrect);
                questionOption.appendChild(buttonWrong);
                questionOption.appendChild(buttonWrong1);
                questionOption.appendChild(buttonWrong2);
                break;
              case 1:
                questionOption.appendChild(buttonWrong);
                questionOption.appendChild(buttonWrong1);
                questionOption.appendChild(buttonWrong2);
                questionOption.appendChild(buttonCorrect);
                break;
              case 2:
                questionOption.appendChild(buttonWrong1);
                questionOption.appendChild(buttonWrong2);
                questionOption.appendChild(buttonCorrect);
                questionOption.appendChild(buttonWrong);
                break;
              case 3:
                questionOption.appendChild(buttonWrong2);
                questionOption.appendChild(buttonCorrect);
                questionOption.appendChild(buttonWrong);
                questionOption.appendChild(buttonWrong1);
                break;
            }

            section.appendChild(correctOrWrong);

            var localCorrecter = 0;


            if(correctAnswer.called){
              clearTimeout();
            }


            // Change the value of progress bar
            var progressBar = document.getElementById('progressBar');
            progressBar.value = i;

            // Opacity animation
            section.style.opacity = 0;
            setInterval(function() {
                if (section.style.opacity === 1) {
                    clearInterval();
                } else {
                    section.style.opacity += 1;
                }
            });

            // Animation for the questions
            setTimeout(function() {
                var pos = w - 1;
                var position;
                setInterval(function() {
                    if (pos == w) {
                        // document.body.removeChild(section);
                        clearInterval();
                    } else {
                        pos++;
                        section.style.left = pos + "px";
                    }
                }, 5);

            }, 7000);

        });
    }, 8000 * i);
}



function correctAnswer(){
  // Adding points to the localPoints, which later dumps it value into the global variable
  localCorrecter++;

  var buttonDisabler = document.getElementsByName("buttonOption");
  var questionDark = document.getElementsByClassName('question-option');
  var check = document.createElement('img');
  check.setAttribute('src', 'thumbs-up.png');

  // Get how many buttons there is to be able to display and set correct in the same function

  for(i = 0; i < buttonDisabler.length; i++){
    // Print our a check if the answer is true
    var questionWind = document.getElementById('question-option-window'  + '-' + i);
    if (questionWind){
      questionWind.appendChild(check);
    }

    // If button is ignored its going to skip that button.
    if (buttonDisabler.disabled){
      // buttonDisabler[i].preventDefault();
      console.log('ignored');
    }else {
      buttonDisabler[i].disabled = true;
    }
  }
}



function wrongAnswer(){
  var buttonDisabler = document.getElementsByName("buttonOption");
  var questionDark = document.getElementsByClassName('question-option');
  var check = document.createElement('img');
  check.setAttribute('src', 'thumbs-down.png');

  for(i = 0; i < buttonDisabler.length; i++){
    var questionWind = document.getElementById('question-option-window'  + '-' + i);
    if (questionWind){
      questionWind.appendChild(check);
    }

    if (buttonDisabler.disabled){
        console.log('ignored');
    } else {
        buttonDisabler[i].disabled = true;
    }

  }
// See CorrectAnswer() for comments
}
