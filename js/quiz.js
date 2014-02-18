'use strict';

//cross-browser event handlers, the "Zakas Way"
var EventUtil = {

//Both methods check for existence of DOM Level 2 method, then for IE method, then DOM Level 0 method as last resort.
	addHandler: function(element, type, handler) {
		if (element.addEventListener) {
			//if DOM Level 2 method exists, it is used. False indicates bubbling phase
			element.addEventListener(type, handler, false);
		} else if (element.attachEvent) {
			//else if IE method exists, it is used
			element.attachEvent("on" + type, handler);
		} else {
			//else use DOM Level 0 (last resort)
			element["on" + type] = handler;
		}
	},

	removeHandler: function(element, type, handler) {
		if (element.removeEventListener) {
			//if DOM Level 2 method exists, it is used. False indicates bubbling phase
			element.removeEventListener(type, handler, false);
		} else if (element.detachEvent) {
			//else if IE method exists, it is used
			element.detachEvent("on" + type, handler);
		} else {
			//else use DOM Level 0 (last resort)
			element["on" + type] = null;
		}
	}
}

//Initialise element ID's
var wrapper = document.getElementById("wrapper");
var quizIntro = document.getElementById("quizIntro");
var quizQuestion = document.getElementById("quizQuestion");
var myForm = document.getElementById("myForm");
var quizChoices = document.getElementById("quizChoices");
var quizScore = document.getElementById("quizScore");
var nextButton = document.getElementById("nextButton");
var scoresButton = document.getElementById("scoresButton");

var selectedChoice;
var selectedChoicesArray = [];
var currentQuestion = 0;
var currentChoices = 0;

scoresButton.style.visibility = 'hidden';

var quiz = {
	allQuestions: [
		{
			question: "question 1",
			choices: ["choice 1.1", "choice 1.2", "choice 1.3"],
			correctAnswer: "choice 1.1"
		},
		{
			question: "question 2",
			choices: ["choice 2.1", "choice 2.2", "choice 2.3"],
			correctAnswer: "choice 2.2"
		},
		{
			question: "question 3",
			choices: ["choice 3.1", "choice 3.2", "choice 3.3"],
			correctAnswer: "choice 3.1"
		},
		{
			question: "question 4",
			choices: ["choice 4.1", "choice 4.2", "choice 4.3"],
			correctAnswer: "choice 4.3"
		},
		{
			question: "question 5",
			choices: ["choice 5.1", "choice 5.2", "choice 5.3"],
			correctAnswer: "choice 5.2"
		},
	],

	showNextQuestion: function() {
		//if the current question is less than the length value of the allQuestions array
		if (currentQuestion < quiz.allQuestions.length) {
			//Change button text to "Next question"
			nextButton.value = 'Next question';

			//display the current question
			quizQuestion.innerHTML = quiz.allQuestions[currentQuestion].question;
			
			//remove previous answer choices
			quizChoices.innerHTML = "";

			//display answer choices for question
			this.showChoices();

			//detect for radio button being selected
			this.checkAnswer();
			
			//iterate to the next question in allQuestions array
			currentQuestion++;

			console.log("currentQuestion is " + currentQuestion + " and quiz.length is " + quiz.allQuestions.length);
			
			//checks if current question is the last question and if it is, hide the Next button and show the Scores button
			this.finishQuiz();
		}
	},

	showChoices: function() {
		//iterate through array, and if current question is within array length...
		if (currentQuestion < quiz.allQuestions.length) {
			console.log("your choices are " + quiz.allQuestions[currentQuestion].choices);
			console.log("note: correct answer is " + quiz.allQuestions[currentQuestion].correctAnswer);

			//...iterate through the choices for current question and display as list in HTML
			for (currentChoices = 0; currentChoices < quiz.allQuestions[currentQuestion].choices.length; currentChoices++) {
				quizChoices.innerHTML += "<li>" + "<input type=\"radio\" name=\"choice\" value=\"\">" + quiz.allQuestions[currentQuestion].choices[currentChoices] + "</li>";
			}
		}
	},

	checkAnswer: function() {
		var radioButtonArray = myForm.elements.choice;
		currentChoices = 0;
		for(var i = 0; i < radioButtonArray.length; i++) {
			if (currentChoices < quiz.allQuestions[currentQuestion].choices.length) {
				radioButtonArray[i].value = quiz.allQuestions[currentQuestion].choices[currentChoices];
				currentChoices++;
				selectedChoice = radioButtonArray[i].value;
			}
		}
	},

	finishQuiz: function() {
		//if quiz has reached final question...
		if (currentQuestion === quiz.allQuestions.length) {
			//...display Scores button
			scoresButton.style.visibility = 'visible';
			console.log("currentQuestion is " + currentQuestion + " and quiz.allQuestions.length is " + quiz.allQuestions.length + " so the button should not display as there are no more questions");
			//and remove Next button
			document.body.removeChild(nextButton);
		}
	},

	showTotalScore: function() {

		//Hide all text on page
		quizIntro.innerHTML = "";
		quizQuestion.innerHTML = "";
		quizChoices.innerHTML = "";

		//Remove Scores button
		document.body.removeChild(scoresButton);

		//Display total score
		quizScore.innerHTML = "Your score is: .....";
	},
}

//Event handler to check if a radio button has been selected
EventUtil.addHandler(myForm, "change", function(){
	selectedChoicesArray.push(selectedChoice);
	console.log("your answer is " + selectedChoice + " and has been saved in selectedChoicesArray: " + selectedChoicesArray);
});

quizIntro.innerHTML = "Welcome to the quiz. There are " + quiz.allQuestions.length + " questions in the quiz";



// KEEP THIS FOR LATER - capturing values of radio buttons
// window.onload = function() {
//   var theform = document.getElementById("myForm");
//   var radioArray = [];
//   console.log("-------------");
//   theform.onchange = function() {
//     var selectedChoice = document.querySelector('input[name="color"]:checked').value;
//     console.log("you selected", selectedChoice);
//     radioArray.push(selectedChoice);
//     console.log("radioArray is now " + radioArray);
//   };
// };

// KEEP THIS FOR LATER - scoring
	//check selected value against correct answer for current question
	// if (currentQuestion < quiz.allQuestions.length) {
	// 	if (selectedChoice === quiz.allQuestions[currentQuestion].correctAnswer) {
	// 		console.log("well done, points will be incremented");
	// 	} else {
	// 		console.log("you are wrong, points will not change");
	// 	}
	// }