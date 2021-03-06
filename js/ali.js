// Viewport width
var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
// Global variable for the local points
var localCorrecter = 0;


if (document.readyState != 'loading') {
    onDocumentReady();
} else {
    document.addEventListener('DOMContentLoaded', onDocumentReady);
}

function onDocumentReady() {
    // Check to see if the user has clicked next category from the leaderboard page, this skips the first screen and jumps straight into questions
    if (window.location.hash === '#quiz') {
        redirectLoggedIn();
    } else {
        checkLoggedIn();
    }

}

var category;

function startQuiz() {
    var parent = document.getElementById('placeQuestions');
    // Elements we need
    var section = document.createElement('section');
    var divLeaderLogin = document.createElement('div');
    var button = document.createElement('button');
    var h2 = document.createElement('h2');
    var ulList = document.createElement('ul');


    var span = document.createElement('span');

    //---- Classes

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
    query.child('users').orderByChild('points').on('value', function(snapshot) {
        snapshot.forEach(function(child) {
            array.push(child.val());
        });
        // Call for function to create list when the request for object is done
        leader();
    });

    function leader() {
        // Create a new array but backwards to get the best scores
        var arrReverse = array.reverse();
        // console.log(arrReverse);
        for (i = 0; i < 5; i++) {
            // Create Element for each user
            var li = document.createElement('li');
            var line = document.createElement('hr');
            li.setAttribute('id', 'leaderboardLeader' + i);

            li.innerHTML = arrReverse[i].user + ' ' + arrReverse[i].points;
            ulList.appendChild(li);
            ulList.appendChild(line);
        }
        for (i = 0; i < 5; i++) {
            // Print out each persons highscore replacing each time someone gets more points
            var liElement = document.getElementById('leaderboardLeader' + i);
            liElement.innerHTML = arrReverse[i].user + ' ' + arrReverse[i].points;

        }

    }
}



// Check to see if a user is logged in, otherwise redirect to index page to login

function checkLoggedIn() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var datapathUser = firebase.database().ref('p2/users/' + user.uid);
            datapathUser.once('value').then(function(snapshot) {
                // Updating which category the user has
                category = snapshot.child('category').val();
                // Start the quiz if logged in
                startQuiz();
            });
        } else {
            // No user is signed in.
            window.location.href = '../index.html';
        }
    });
}

function redirectLoggedIn() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var datapathUser = firebase.database().ref('p2/users/' + user.uid);
            datapathUser.once('value').then(function(snapshot) {
                // Updating which category the user has
                category = snapshot.child('category').val();
                // Start the quiz if logged in
                questionDisplay();
            });
        } else {
            // No user is signed in.
            window.location.href = '../index.html';
        }
    });
}

// Display question with the for loop, The array has been pushed from snapshot and then printed out with each i (0, 1, 2) (The questions is ordered 0, 1, 2 in the database)

var questionsArray = [];

function questionDisplay() {

    var disable = document.getElementById('prePlaySection');
    // If the page does not exist( Because of the redirect from leaderboard page) it starts loading the question immediately
    if (disable === null) {
        for (i = 0; i < 5; i++) {
            questionMaker(i);
            if (i === 4) {
                // When i hits 4 it jumps into the function below and updates your values and your teams values then it takes you to the leaderboard page.
                timeoutQuestion(i);
            }
        }
        // If you are just logged in the start screen is still going to show up
    } else {
        disable.style.display = 'none';
        for (i = 0; i < 5; i++) {
            questionMaker(i);
            if (i === 4) {
                // When i hits 4 it jumps into the function below and updates your values and your teams values then it takes you to the leaderboard page.
                timeoutQuestion(i);
            }
        }
    }



}


function timeoutQuestion(i) {
    setTimeout(function() {
        // Push score to database
        var user = firebase.auth().currentUser;
        var info = localCorrecter;
        var categoryNum;
        if (user) {
            var datapath = firebase.database().ref("p2/users/" + user.uid);

            // Take the datapath value

            datapath.once('value').then(function(snapshot) {
                categoryNum = snapshot.child('category').val();
                pointsTemp = snapshot.child('points').val();
                team = snapshot.child('team').val();
                // See the team value, Recognizes what team you are in and assign an value depending on which team. That value later gets pushed into next firebase datapath
                var teamNum;
                switch (team) {
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

                // Updating the team value taking previous number and adding current local number
                dataPathTeam.once('value').then(function(teamSnapshot) {
                    teamTemp = teamSnapshot.child('amountCorrect').val();
                    var teamNum = teamTemp + info;

                    // Updating the value with the local variable plus old score
                    dataPathTeam.update({
                        amountCorrect: teamNum
                    }).then(function() {
                        console.log('Saved' + localCorrecter + 'to the' + team + ' team');
                    });
                });


                datapath.update({
                    points: pointsNum,
                    category: categoryNum
                }).then(function() {
                    console.log('saved points');
                });
            });
        }

        // The timer below takes i into account. i * 0 which means the first question fires immediately. The next question fires 8000ms later
    }, (8000 * i) + 8000);
    setTimeout(function() {
        // When the function to push new values the function redirects to leaderboard
        window.location.href = 'leaderboard.html';
    }, (8000 * i) + 8500);
}

function questionMaker(i) {
    setTimeout(function() {
        var button;
        var localCounter;
        var user = firebase.auth().currentUser;
        // Get the global variable for which category you are in to be able to display correct question
        var datapath = firebase.database().ref("p2/questions/" + category + "/");

        datapath.once('value').then(function(snapshot) {
            var categoryTitle = snapshot.child('title').val();

            // Creating Element for title and appending

            var section = document.createElement('section');
            var question = document.createElement('div');
            var questionOption = document.createElement('div');
            var correctOrWrong = document.createElement('div');
            var categoryH2 = document.createElement('h2');
            var timer = document.createElement('h3');
            var questionH1 = document.createElement('h1');
            var buttonCorrect = document.createElement('button');
            var buttonWrong = document.createElement('button');
            var buttonWrong1 = document.createElement('button');
            var buttonWrong2 = document.createElement('button');

            section.setAttribute('id', 'questions');
            section.setAttribute('class', 'question-wrap');
            question.setAttribute('class', 'question-window');
            questionOption.setAttribute('class', 'question-option');
            correctOrWrong.setAttribute('id', 'question-option-window' + '-' + i);

            document.getElementById('placeQuestions').appendChild(section);
            categoryH2.innerHTML = categoryTitle;
            section.appendChild(question);
            question.appendChild(categoryH2);
            question.appendChild(timer);
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
            timer.innerHTML = 7 + ' seconds left';
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

            // Random position on text and buttons

            var randomNumber = Math.floor(Math.random() * 4);
            switch (randomNumber) {
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

            switch (appendNumber) {
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
            var counter = setInterval(timerQuestion, 1000);
            var timerTime = 7;

            function timerQuestion() {
                timerTime = timerTime - 1;
                if (timerTime <= 0) {
                    clearInterval(timerQuestion);
                    return;
                }
                timer.innerHTML = timerTime + ' seconds left';
            }



            // Change the value of progress bar
            var progressBar = document.getElementById('progressBar');
            progressBar.value = i;

            // Opacity animation on each question window
            section.style.opacity = 0;
            setInterval(function() {
                if (section.style.opacity === 1) {
                    clearInterval();
                } else {
                    section.style.opacity += 1;
                }
            });

            // Animation for the questions to be able to go out of sight which does it quickly
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



function correctAnswer() {
    // Adding points to the localPoints, which later dumps it value into the global variable
    localCorrecter++;

    var buttonDisabler = document.getElementsByName("buttonOption");
    var questionDark = document.getElementsByClassName('question-option');
    var check = document.createElement('img');
    check.setAttribute('src', 'thumbs-up.png');

    // Get how many buttons there is to be able to display and set correct in the same function

    for (i = 0; i < buttonDisabler.length; i++) {
        // Print out a correct sign if the answer is true
        var questionWind = document.getElementById('question-option-window' + '-' + i);
        if (questionWind) {
            questionWind.appendChild(check);
        }

        // If button is disabled its going to skip that button.
        if (buttonDisabler.disabled) {} else {
            buttonDisabler[i].disabled = true;
        }
    }
}



function wrongAnswer() {
    var buttonDisabler = document.getElementsByName("buttonOption");
    var questionDark = document.getElementsByClassName('question-option');
    var check = document.createElement('img');
    check.setAttribute('src', 'thumbs-down.png');

    for (i = 0; i < buttonDisabler.length; i++) {
        var questionWind = document.getElementById('question-option-window' + '-' + i);
        if (questionWind) {
            questionWind.appendChild(check);
        }

        if (buttonDisabler.disabled) {
            console.log('ignored');
        } else {
            buttonDisabler[i].disabled = true;
        }

    }
    // See CorrectAnswer() for comments, the same function but if user selects the wrong quesion
}
