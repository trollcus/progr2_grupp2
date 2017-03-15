
if (document.readyState != 'loading') {
    onDocumentReady();
} else {
    document.addEventListener('DOMContentLoaded', onDocumentReady);
}

function onDocumentReady() {
    objects(url);
    //document.addEventListener('onclick', questionDisplay);
}

var category;

function questionDisplay() {
    var button;
    var localCounter;
    var user = firebase.auth().currentUser;
    var user = firebase.auth().currentUser;
    var datapath = firebase.database().ref('p2/users/' + user.uid);
    var datapath = firebase.database().ref('p2/questions/' + );
    for (var i = 0; i < category.questions.length; i++) {

        var questionWindow = document.getElementById("question");
        var categoryTitle = document.createElement("h1");
        var categoryQuestion = document.createElement("h2");
        question.setAttribute("class", "question-window");

        //Svarsruta
        var answerOptions = document.getElementById("options");
        var answer1 = document.createElement("button");
        answer1.setAttribute("class", "button-green");
        var answer2 = document.createElement("button");
        answer2.setAttribute("class", "button-blue");
        var answer3 = document.createElement("button");
        answer3.setAttribute("class", "button-pink");
        var answer4 = document.createElement("button");
        answer4.setAttribute("class", "button-yellow");

        //Kategori och Fråga
        categoryTitle.innerHTML = category.questions.title;
        categoryQuestion.innerHTML = category.questions.question;

        //här appendar vi allt till sidan
        questionWindow.appendChild(categoryTitle);
        questionWindow.appendChild(categoryQuestion);
        answerOptions.appendChild(answer1);
        answerOptions.appendChild(answer2);
        answerOptions.appendChild(answer3);
        answerOptions.appendChild(answer4);
    }

}
