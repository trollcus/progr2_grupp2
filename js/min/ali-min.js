
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

function checkLoggedIn(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
    var datapathUser = firebase.database().ref('p2/users/' + user.uid);
    datapathUser.once('value').then(function(snapshot){
    category = snapshot.child('category').val();
    console.log(category);
    tester();
  });
  } else {
    // No user is signed in.
    window.location.href = '../index.html';
  }
});
}

var questionsArray = [];

function tester() {

  // var button;
  // var localCounter;
  // var questionsArr = [];
  // var user = firebase.auth().currentUser;
  // var questionPage = document.getElementById('questions');
  //
  // var datapath = firebase.database().ref("p2/questions/" + category + "/");
  //
  // datapath.once('value').then(function(snapshot){
  //   var questionTitle = snapshot.child('title').val();
  //   console.log(snapshot.val().length);
  //   // Creating Element for title and appending
  //   var question = document.createElement('div');
  //   var questionOption = document.createElement('div');
  //   var categoryH2 = document.createElement('h2');
  //   var questionH1 = document.createElement('h1');
  //   var buttonCorrect = document.createElement('button');
  //   var buttonWrong = document.createElement('button');
  //   var buttonWrong1 = document.createElement('button');
  //   var buttonWrong2 = document.createElement('button');
  //   question.setAttribute('class', 'question-window');
  //   questionOption.setAttribute('class', 'question-option');
  //   buttonCorrect.setAttribute('class', 'button-green');
  //   buttonWrong.setAttribute('class', 'button-blue');
  //   buttonWrong1.setAttribute('class', 'button-pink');
  //   buttonWrong2.setAttribute('class', 'button-yellow');
  //   categoryH2.innerHTML = questionTitle;
  //   questionPage.appendChild(question);
  //   question.appendChild(categoryH2);
  //   question.appendChild(questionH1);
  //   questionPage.appendChild(questionOption);

    for(i = 0; i < 2; i++){

      questionMaker(i);



    }

}



function questionMaker(i) {
  setTimeout(function() {
    var button;
    var localCounter;
    var questionsArr = [];
    var user = firebase.auth().currentUser;
    var questionPage = document.getElementById('questions');

    var datapath = firebase.database().ref("p2/questions/" + category + "/");

    datapath.once('value').then(function(snapshot){
      var categoryTitle = snapshot.child('title').val();
      console.log(snapshot.val().length);
      // Creating Element for title and appending
      var question = document.createElement('div');
      var questionOption = document.createElement('div');
      var categoryH2 = document.createElement('h2');
      var questionH1 = document.createElement('h1');
      var buttonCorrect = document.createElement('button');
      var buttonWrong = document.createElement('button');
      var buttonWrong1 = document.createElement('button');
      var buttonWrong2 = document.createElement('button');
      question.setAttribute('class', 'question-window');
      questionOption.setAttribute('class', 'question-option');
      buttonCorrect.setAttribute('class', 'button-green');
      buttonWrong.setAttribute('class', 'button-blue');
      buttonWrong1.setAttribute('class', 'button-pink');
      buttonWrong2.setAttribute('class', 'button-yellow');
      categoryH2.innerHTML = categoryTitle;
      questionPage.appendChild(question);
      question.appendChild(categoryH2);
      question.appendChild(questionH1);
      questionPage.appendChild(questionOption);



        var categoryTag = snapshot.child(i).val();

        var eachQuestion = categoryTag.question;
        var correct = categoryTag.correct;
        var wrong0 = categoryTag.wrong0;
        var wrong1 = categoryTag.wrong1;
        var wrong2 = categoryTag.wrong2;

        // Change the value of progress bar
        var progressBar = document.getElementById('progressBar');
        progressBar.value = i;

        questionH1.innerHTML = eachQuestion;
        buttonCorrect.innerHTML = correct;
        buttonWrong.innerHTML = wrong0;
        buttonWrong1.innerHTML = wrong1;
        buttonWrong2.innerHTML = wrong2;



        questionOption.appendChild(buttonCorrect);
        questionOption.appendChild(buttonWrong);
        questionOption.appendChild(buttonWrong1);
        questionOption.appendChild(buttonWrong2);
        setTimeout(function(){
          buttonCorrect.style.opacity = "0";
        }, 7000);

  });
}, 8000 * i);
}




// function questionDisplay() {
//     var category;
//     var button;
//     var localCounter;
//     var questionsArr = [];
//     var user = firebase.auth().currentUser;
//     var datapathUser = firebase.database().ref('p2/users/' + user.uid);
//     var datapath = firebase.database().ref('p2/questions/' + category + "/" + i);
//     datapath.child('title').val();
//     datapath.once('value').then(function(snapshot){
//       for(i = 0; i < 5; i++){
//         categoryTag = snapshot.child(i).val();
//         var question = categoryTag.child('question').val();
//         var wrong0 = categoryTag.child('wrong0').val();
//         var wrong1 = categoryTag.child('wrong1').val();
//         var wrong2 = categoryTag.child('wrong2').val();
//         var correct = categoryTag.child('correct').val();
//         console.dir(categoryTag);
//       }
//       // categoryTag = snapshot.child(i).val();
//       // var question = categoryTag.child('question').val();
//       // var wrong0 = categoryTag.child('wrong0').val();
//       // var wrong1 = categoryTag.child('wrong1').val();
//       // var wrong2 = categoryTag.child('wrong2').val();
//       // var correct = categoryTag.child('correct').val();
//
//     });
//     // for(i = 0; i <= 4; i++){
//     //   var datapath = firebase.database().ref('p2/questions/' + category);
//     //   for(n = 0; n <= 4; n++){
//     //     datapath.once('value').then(function(snapshot){
//     //       categoryTag = snapshot.child(n).val();
//     //       var question = categoryTag.child('question').val();
//     //       var wrong0 = categoryTag.child('wrong0').val();
//     //       var wrong1 = categoryTag.child('wrong1').val();
//     //       var wrong2 = categoryTag.child('wrong2').val();
//     //       var correct = categoryTag.child('correct').val();
//     //
//     //     });
//       }
//     }
//
//     for (var i = 0; i < category.questions.length; i++) {
//
//         var questionWindow = document.getElementById("question");
//         var categoryTitle = document.createElement("h1");
//         var categoryQuestion = document.createElement("h2");
//         question.setAttribute("class", "question-window");
//
//         //Svarsruta
//         var answerOptions = document.getElementById("options");
//         var answer1 = document.createElement("button");
//         answer1.setAttribute("class", "button-green");
//         var answer2 = document.createElement("button");
//         answer2.setAttribute("class", "button-blue");
//         var answer3 = document.createElement("button");
//         answer3.setAttribute("class", "button-pink");
//         var answer4 = document.createElement("button");
//         answer4.setAttribute("class", "button-yellow");
//
//         //Kategori och Fråga
//         categoryTitle.innerHTML = category.questions.title;
//         categoryQuestion.innerHTML = category.questions.question;
//
//         //här appendar vi allt till sidan
//         questionWindow.appendChild(categoryTitle);
//         questionWindow.appendChild(categoryQuestion);
//         answerOptions.appendChild(answer1);
//         answerOptions.appendChild(answer2);
//         answerOptions.appendChild(answer3);
//         answerOptions.appendChild(answer4);
//     }
//
// }


