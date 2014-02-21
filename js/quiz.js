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
var percentageScore = 0;
var i;

var quiz = {
	allQuestions: [
		{
			question: "Question 1: What is the capital of Australia?",
			choices: ["Sydney", "Canberra", "Melbourne"],
			correctAnswer: "Canberra"
		},
		{
			question: "Question 2: What is the smallest country in the world?",
			choices: ["Luxembourg", "Vatican City", "Monaco"],
			correctAnswer: "Vatican City"
		},
		{
			question: "Question 3: What is the national currency of Egypt?",
			choices: ["Pound", "Euro", "Dollar"],
			correctAnswer: "Pound"
		},
		{
			question: "Question 4: How many countries make up Great Britain?",
			choices: ["Three", "Four", "Five"],
			correctAnswer: "Three"
		},
		{
			question: "Question 5: How many miles, as the crow flies, is it from John O' Groats to Land's End?",
			choices: ["603 miles", "703 miles", "803 miles"],
			correctAnswer: "603 miles"
		},
		{
			question: "Question 6: What is the largest island in the world?",
			choices: ["Greenland", "Australia", "Iceland"],
			correctAnswer: "Greenland"
		},
		{
			question: "Question 7: How many countries does Mexico border?",
			choices: ["Two", "Three", "Four"],
			correctAnswer: "Three"
		},
		{
			question: "Question 8: Which African country has the Shilling as its currency?",
			choices: ["Morocco", "Algeria", "Kenya"],
			correctAnswer: "Kenya"
		},
		{
			question: "Question 9: What is the world's third largest sea?",
			choices: ["Mediterranean", "Pacific", "Atlantic"],
			correctAnswer: "Mediterranean"
		},
		{
			question: "Question 10: Which country has the highest waterfall?",
			choices: ["Venezuela", "South Africa", "Bolivia"],
			correctAnswer: "Venezuela"
		},
	],

	startQuiz: function() {
		quizIntro.innerHTML = "Welcome to the country quiz. There are " + quiz.allQuestions.length + " questions in the quiz";

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
		quiz.resetPageContent();

		//Remove Scores button
		myForm.removeChild(scoresButton);

		//convert total score into percentage
		percentageScore = ((score/quiz.allQuestions.length) * 100);

		if (percentageScore >= 20 && percentageScore < 40) {
			console.log(percentageScore);
			quizScore.innerHTML = "You are marginally better than rubbish. Your score is: " + percentageScore + "%";
		} else if (percentageScore >= 40 && percentageScore < 70) {
			console.log(percentageScore);
			quizScore.innerHTML = "Not bad. Your score is: " + percentageScore + "%";
		} else if (percentageScore >= 70 && percentageScore < 100) {
			console.log(percentageScore);
			quizScore.innerHTML = "Pretty good! Your score is: " + percentageScore + "%";
		} else if (percentageScore === 100) {
			console.log(percentageScore);
			quizScore.innerHTML = "You are a genius. Your score is: " + percentageScore + "%";
		} else {
			console.log(percentageScore);
			quizScore.innerHTML = "I have no words for you. You are rubbish. Your score is: " + percentageScore + "%";
		}
	},

	resetPageContent: function() {
		quizIntro.innerHTML = "";
		quizQuestion.innerHTML = "";
		quizChoices.innerHTML = "";
	},
};

quiz.startQuiz();