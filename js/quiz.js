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

var selectedChoice;
var selectedChoicesArray = [];
var correctAnswerArray = [];
var currentQuestion = 0;
var correctAnswer = 0;
var i;
var j;

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

	startQuiz: function() {
		quizIntro.innerHTML = "Welcome to the quiz. There are " + quiz.allQuestions.length + " questions in the quiz";

		//create Start button
		var startButton = document.createElement("input");
		startButton.type = "button";
		startButton.id = "startButton";
		startButton.value = 	"Start quiz";
		myForm.appendChild(startButton);

		EventUtil.addHandler(startButton, 'click', function () {
			quiz.showFirstQuestion();
		});
	},

	showFirstQuestion: function() {
		//if the current question is less than the length value of the allQuestions array
		if (currentQuestion < quiz.allQuestions.length) {
			console.log("currentQuestion is " + currentQuestion + " and quiz.length is " + quiz.allQuestions.length);
			//create Next button
			var nextButton = document.createElement("input");
			nextButton.type = "button";
			nextButton.id = "nextButton";
			nextButton.value = 'Next question';
			myForm.appendChild(nextButton);

			//remove Start button
			myForm.removeChild(startButton);

			//display the current question
			quizQuestion.innerHTML = quiz.allQuestions[currentQuestion].question;
			// console.log("currentQuestion is " + currentQuestion + " and quiz.length is " + quiz.allQuestions.length);

			//remove previous answer choices
			quizChoices.innerHTML = "";

			//display answer choices for question
			quiz.showChoices();
			
			EventUtil.addHandler(nextButton, 'click', function () {
				quiz.showNextQuestion();
			});
		}
	},

	showNextQuestion: function() {
		if (currentQuestion < quiz.allQuestions.length) {
		//iterate to the next question in allQuestions array
		currentQuestion++;

		console.log("currentQuestion is " + currentQuestion + " and quiz.length is " + quiz.allQuestions.length);
		
		//display the current question
		quizQuestion.innerHTML = quiz.allQuestions[currentQuestion].question;

		//store selected answers in array
		quiz.storeAnswer();

		//remove previous answer choices
		quizChoices.innerHTML = "";

		//display answer choices for question
			quiz.showChoices();
		}
		//checks if current question is the last question and if it is, remove the Next button and show the Scores button
		if (currentQuestion === (quiz.allQuestions.length - 1)) {
			quiz.finishQuiz();
		}
	},

	showChoices: function() {
		//iterate through array, and if current question is within array length...
		if (currentQuestion < quiz.allQuestions.length) {
			// console.log("your choices are " + quiz.allQuestions[currentQuestion].choices);
			console.log("note: correct answer is " + quiz.allQuestions[currentQuestion].correctAnswer);

			//...iterate through the choices for current question and display as list in HTML
			for (i = 0; i < quiz.allQuestions[currentQuestion].choices.length; i++) {
				quizChoices.innerHTML += "<li><input type=\"radio\" name=\"choice\" id=\"rb" + i + "\" value=\"" + quiz.allQuestions[currentQuestion].choices[i] + "\">" + quiz.allQuestions[currentQuestion].choices[i] + "</li>";
			}
		}
	},

	storeAnswer: function() {
		console.log("STORE ANSWER HAS HAPPENED");
		var radioButtonArray = [];

		for (i = 0; i < quiz.allQuestions[currentQuestion].choices.length; i++) {
			radioButtonArray[i] = document.getElementById('rb' + i);
			if (radioButtonArray[i].checked) {
				selectedChoice = radioButtonArray[i];
				selectedChoicesArray.push(selectedChoice);
				console.log('you have selected: - ', selectedChoice);
				// console.log("selectedChoice.value is " + selectedChoice);
				// console.log("selectedChoicesArray is now " + selectedChoicesArray);
			}
		}
		quiz.updateScore();
	},

	updateScore: function() {
		if (selectedChoice.value === quiz.allQuestions[currentQuestion - 1].correctAnswer) {
			console.log("selectedChoice.value is " + selectedChoice.value)
			correctAnswer++;
			correctAnswerArray.push(selectedChoice);
			console.log("current score has INCREASED! It is now ", correctAnswer);
		} else {
			console.log("Current score HAS NOT changed. It is still ", correctAnswer)
		}
	},

	finishQuiz: function() {
		console.log("the Next button should not display as there are no more questions after this one");

		//...remove Next button
		myForm.removeChild(nextButton);

		//...and create Scores button
		var scoresButton = document.createElement("input");
		scoresButton.type = "button";
		scoresButton.id = "scoresButton";
		scoresButton.value = 'Finish and show scores';
		myForm.appendChild(scoresButton);

		EventUtil.addHandler(scoresButton, 'click', function () {
			console.clear();
			console.log("SCORES BUTTON CLICKED");
			quiz.showTotalScore();
		});
	},

	showTotalScore: function() {
		console.log("SHOW TOTAL SCORE HAS HAPPENED");
		quiz.updateScore();
		console.log("selectedChoice.value is " + selectedChoice.value);
		console.log("prev question is " + quiz.allQuestions[currentQuestion].correctAnswer);

		//Hide all text on page
		quizIntro.innerHTML = "";
		quizQuestion.innerHTML = "";
		quizChoices.innerHTML = "";

		//Remove Scores button
		myForm.removeChild(scoresButton);

		//Display total score
		quizScore.innerHTML = "Your score is: ....." + correctAnswer;
	},
};

quiz.startQuiz();