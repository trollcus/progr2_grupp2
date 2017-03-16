var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);


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

function checkLoggedIn() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var datapathUser = firebase.database().ref('p2/users/' + user.uid);
            datapathUser.once('value').then(function(snapshot) {
                category = snapshot.child('category').val();
                console.log(category);
                questionDisplay();
            });
        } else {
            // No user is signed in.
            window.location.href = '../index.html';
        }
    });
}

var questionsArray = [];

function questionDisplay() {
    for (i = 0; i < 5; i++) {
        questionMaker(i);
    }
}

function questionMaker(i) {
    setTimeout(function() {
        var button;
        var localCounter;
        var user = firebase.auth().currentUser;
        var datapath = firebase.database().ref("p2/questions/" + category + "/");

        datapath.once('value').then(function(snapshot) {
            var categoryTitle = snapshot.child('title').val();
            // console.log(snapshot.val().length);
            // Creating Element for title and appending
            var section = document.createElement('section');
            var question = document.createElement('div');
            var questionOption = document.createElement('div');
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
            buttonCorrect.setAttribute('class', 'button-green');
            buttonWrong.setAttribute('class', 'button-blue');
            buttonWrong1.setAttribute('class', 'button-pink');
            buttonWrong2.setAttribute('class', 'button-yellow');
            document.getElementById('placeQuestions').appendChild(section);
            categoryH2.innerHTML = categoryTitle;
            section.appendChild(question);
            question.appendChild(categoryH2);
            question.appendChild(questionH1);
            section.appendChild(questionOption);
            section.style.left = '0px';





            var categoryTag = snapshot.child(i).val();

            var eachQuestion = categoryTag.question;
            var correct = categoryTag.correct;
            var wrong0 = categoryTag.wrong0;
            var wrong1 = categoryTag.wrong1;
            var wrong2 = categoryTag.wrong2;



            questionH1.innerHTML = eachQuestion;
            buttonCorrect.innerHTML = correct;
            buttonWrong.innerHTML = wrong0;
            buttonWrong1.innerHTML = wrong1;
            buttonWrong2.innerHTML = wrong2;


            questionOption.appendChild(buttonCorrect);
            questionOption.appendChild(buttonWrong);
            questionOption.appendChild(buttonWrong1);
            questionOption.appendChild(buttonWrong2);

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
