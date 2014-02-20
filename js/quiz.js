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
var myForm = document.getElementById("myForm");
var quizIntro = document.getElementById("quizIntro");
var quizQuestion = document.getElementById("quizQuestion");
var quizChoices = document.getElementById("quizChoices");
var quizScore = document.getElementById("quizScore");

var selectedChoice;
var selectedChoicesArray = [];
var currentQuestion = 0;
var correctAnswer = 0;
var score = 0;
var percentageScore;
var i;

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

		//if startButton is clicked, call showFirstQuestion() function
		EventUtil.addHandler(startButton, 'click', function () {
			quiz.showFirstQuestion();
		});
	},

	showFirstQuestion: function() {
	//if current question is not the final question...
	if (currentQuestion < (quiz.allQuestions.length - 1)) {
		console.log("currentQuestion is " + currentQuestion + " and our maximum is " + (quiz.allQuestions.length - 1) + " (quiz.allQuestions.length - 1)");

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

		//display answer choices for current question
		quiz.showChoices();

		//if nextButton is clicked, call showNextQuestion() function
		EventUtil.addHandler(nextButton, 'click', function () {
			quiz.showNextQuestion();
		});
	}
},

showNextQuestion: function() {
	//if current question is not the final question...
	if (currentQuestion < (quiz.allQuestions.length - 1)) {
			//iterate to the next question in allQuestions array
			currentQuestion++;

			console.log("currentQuestion is " + currentQuestion);

			//display the current question
			quizQuestion.innerHTML = quiz.allQuestions[currentQuestion].question;

			//store selected answers in array
			quiz.storeAnswer();

			//remove previous answer choices
			quizChoices.innerHTML = "";

			//display answer choices for current question
			quiz.showChoices();

			//checks if current question is the last question and if it is, call finishQuiz() function
			if (currentQuestion === (quiz.allQuestions.length - 1)) {
				quiz.finishQuiz();
			}
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

	finishQuiz: function() {
		//finishQuiz() is called if the current question is the last question in the quiz
		console.log("the Next button should not display as there are no more questions after this one");

		//remove Next button
		myForm.removeChild(nextButton);

		//...and create Scores button
		var scoresButton = document.createElement("input");
		scoresButton.type = "button";
		scoresButton.id = "scoresButton";
		scoresButton.value = 'Finish and show scores';
		myForm.appendChild(scoresButton);

		//if scoresButton is clicked, call storeAnswer() and showTotalScore() functions
		EventUtil.addHandler(scoresButton, 'click', function () {
			console.clear();
			console.log("SCORES BUTTON CLICKED");
			quiz.storeAnswer();
			quiz.showTotalScore();
		});
	},

	storeAnswer: function() {
		//storeAnswer() is called when the nextButton is clicked or the scoresButton is clicked
		console.log("STORE ANSWER HAS HAPPENED");

		//create empty array to add generated radio buttons with ID's
		var radioButtonArray = [];

		//iterate through the answer choices of the current question...
		for (i = 0; i < quiz.allQuestions[currentQuestion].choices.length; i++) {
			radioButtonArray[i] = document.getElementById('rb' + i);

			//...and if a radio button is selected...
			if (radioButtonArray[i].checked) {
				//...assign the ID of the radio button to selectedChoice...
				selectedChoice = radioButtonArray[i];
				//...and push the value of that radio button into selectedChoicesArray
				selectedChoicesArray.push(selectedChoice.value);
				console.log('you have selected: - ', selectedChoice);
				console.log("selectedChoicesArray is now " + selectedChoicesArray);
				console.log("selectedChoice.checked is " + radioButtonArray[i].checked);

				//call updateScore() function
				quiz.updateScore();
			} else {
				//if a radio button has not been selected when the Next button is clicked, do nothing
				console.log("nothing selected, no change to score");
			}
		}
	},

	updateScore: function() {
		//(after the nextButton has been clicked) if the value of the previously selected radio button matches the previous item in the correctAnswer array, OR the value of the previously selected radio button matches the correct answer of the final question in the quiz, increment the score
		if ((selectedChoice.value === quiz.allQuestions[currentQuestion - 1].correctAnswer) || (selectedChoice.value === quiz.allQuestions[quiz.allQuestions.length - 1].correctAnswer)) {
			console.log("something got selected");
			score++;
			console.log("score is currently " + score);
		} else {
			//otherwise if the values do not match, the wrong answer has been selected and the score remains the same
			console.log("wrong answer selected");
			console.log("score is still " + score);
		}
	},

	showTotalScore: function() {
		//showTotalScore() is called when the scoresButton is clicked
		console.log("hide questions, hide buttons, show total score");

		//Hide all text on page
		quizIntro.innerHTML = "";
		quizQuestion.innerHTML = "";
		quizChoices.innerHTML = "";

		//Remove Scores button
		myForm.removeChild(scoresButton);

		//Display total score
		quizIntro.innerHTML = "You got " + score + " out of " + (quiz.allQuestions.length) + " correct";
		//convert total score into percentage
		percentageScore = (score/5 * 100);
		quizScore.innerHTML = "Your score is: " + percentageScore + "%";
	},
};

quiz.startQuiz();