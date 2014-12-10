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

function jsQuiz() {
	this.domElements = {
		//Initialise element ID's
		wrapper: document.getElementById("wrapper"),
		myForm: document.getElementById("myForm"),
		quizIntro: document.getElementById("quizIntro"),
		quizErrors: document.getElementById("quizErrors"),
		quizQuestion: document.getElementById("quizQuestion"),
		quizChoices: document.getElementById("quizChoices"),
		quizScore: document.getElementById("quizScore"),
	};

	this.quizVariables = {
		selectedChoice: "",
		selectedChoicesArray: [],
		currentQuestion: 0,
		correctAnswer: 0,
		score: 0,
		percentageScore: 0,
		allQuestions: [],
		ischecked: false
	};
}

jsQuiz.prototype = {
	constructor: jsQuiz,

	startQuiz: function() {
		this.domElements.quizIntro.innerHTML = "Welcome to the country quiz. There are " + this.quizVariables.allQuestions.length + " questions in the quiz";

		//create Start button
		var startButton = document.createElement("input");
		startButton.type = "button";
		startButton.id = "startButton";
		startButton.value = 	"Start quiz";
		this.domElements.myForm.appendChild(startButton);
		var that = this;

		//if startButton is clicked, call showFirstQuestion() function
		EventUtil.addHandler(startButton, 'click', function () {
			that.showFirstQuestion();
			that.showBackButton();
		});
	},

	showFirstQuestion: function() {
		var that = this;

		//if current question is not the final question...
		if (this.quizVariables.currentQuestion < (this.quizVariables.allQuestions.length - 1)) {
			console.log("currentQuestion is " + this.quizVariables.currentQuestion + " and our maximum is " + (this.quizVariables.allQuestions.length - 1) + " (this.quizVariables.allQuestions.length - 1)");

			//create Next button
			var nextButton = document.createElement("input");
			nextButton.type = "button";
			nextButton.id = "nextButton";
			nextButton.value = 'Next question';
			myForm.appendChild(nextButton);

			//remove Start button
			this.domElements.myForm.removeChild(startButton);

			//display the current question
			this.domElements.quizQuestion.innerHTML = this.quizVariables.allQuestions[this.quizVariables.currentQuestion].question;

			//display answer choices for current question
			this.showChoices();

			//if nextButton is clicked, call showNextQuestion() function
			EventUtil.addHandler(nextButton, 'click', function () {
				that.showNextQuestion();
			});
		}
	},

	showNextQuestion: function() {
		//if current question is not the final question...
		if (this.quizVariables.currentQuestion < (this.quizVariables.allQuestions.length - 1)) {

		//create empty array to add generated radio buttons with ID's
		var radioButtonArray = [];
		var i;
		//iterate through the answer choices of the current question...
		for (i = 0; i < this.quizVariables.allQuestions[this.quizVariables.currentQuestion].choices.length; i++) {
			radioButtonArray[i] = document.getElementById('rb' + i);

		//for all the radio buttons with name "choice"...
		var radios = document.getElementsByName('choice');
		//set ischecked to false initially.
		this.quizVariables.ischecked = false;

		//if a radio button in the array is type = radio button has been selected...
		for (var i = 0; i < radios.length; i++) {
			if (radios[i].type === 'radio' && radios[i].checked) {
				//set ischecked to true
				this.quizVariables.ischecked = true;
			}
		}

		//...and if a radio button is not selected...
		if (!this.quizVariables.ischecked) {
			this.showErrorMessage();
		} else {
			this.hideErrorMessage();

				//iterate to the next question in allQuestions array
				this.quizVariables.currentQuestion++;

				console.log("currentQuestion is " + this.quizVariables.currentQuestion);

				//display the current question
				this.domElements.quizQuestion.innerHTML = this.quizVariables.allQuestions[this.quizVariables.currentQuestion].question;

				//store selected answers in array
				this.storeAnswer();

				//remove previous answer choices
				this.domElements.quizChoices.innerHTML = "";

				//display answer choices for current question
				this.showChoices();
			}
		}

		//checks if current question is the last question and if it is, call finishQuiz() function
		if (this.quizVariables.currentQuestion === (this.quizVariables.allQuestions.length - 1)) {
				this.finishQuiz();
			}
		}
	},

	showChoices: function() {
		//iterate through array, and if current question is within array length...
		if (this.quizVariables.currentQuestion < this.quizVariables.allQuestions.length) {
			console.log("note: correct answer is " + this.quizVariables.allQuestions[this.quizVariables.currentQuestion].correctAnswer);

		//...iterate through the choices for current question and display as list in HTML
		for (var i = 0; i < this.quizVariables.allQuestions[this.quizVariables.currentQuestion].choices.length; i++) {
			this.domElements.quizChoices.innerHTML += "<li><input type=\"radio\" name=\"choice\" id=\"rb" + i + "\" value=\"" + this.quizVariables.allQuestions[this.quizVariables.currentQuestion].choices[i] + "\">" + "<label for=\"rb" + i + "\" \>" + this.quizVariables.allQuestions[this.quizVariables.currentQuestion].choices[i] + "</label>" + "</li>";
			}
		}
	},

	finishQuiz: function() {
		var that = this;
		//finishQuiz() is called if the current question is the last question in the quiz
		console.log("the Next button should not display as there are no more questions after this one");

		//remove Next button
		this.domElements.myForm.removeChild(nextButton);

		//...and create Scores button
		var scoresButton = document.createElement("input");
		scoresButton.type = "button";
		scoresButton.id = "scoresButton";
		scoresButton.value = 'Finish and show scores';
		this.domElements.myForm.appendChild(scoresButton);

		//if scoresButton is clicked, call storeAnswer() and showTotalScore() functions
		EventUtil.addHandler(scoresButton, 'click', function () {
			console.clear();
			console.log("SCORES BUTTON CLICKED");
			that.storeAnswer();
			that.showTotalScore();
		});
	},

	storeAnswer: function() {
		//storeAnswer() is called when the nextButton is clicked or the scoresButton is clicked
		console.log("STORE ANSWER HAS HAPPENED");

		//create empty array to add generated radio buttons with ID's
		var radioButtonArray = [];
		var i;

		//iterate through the answer choices of the current question...
		for (i = 0; i < this.quizVariables.allQuestions[this.quizVariables.currentQuestion].choices.length; i++) {
			radioButtonArray[i] = document.getElementById('rb' + i);

			//...and if a radio button is selected...
			if (radioButtonArray[i].checked) {
				//...assign the ID of the radio button to selectedChoice...
				this.quizVariables.selectedChoice = radioButtonArray[i];
				//...and push the value of that radio button into selectedChoicesArray
				this.quizVariables.selectedChoicesArray.push(this.quizVariables.selectedChoice.value);
				console.log('you have selected: - ', this.quizVariables.selectedChoice);
				console.log("selectedChoicesArray is now " + this.quizVariables.selectedChoicesArray);
				console.log("selectedChoice.checked is " + radioButtonArray[i].checked);

				//call updateScore() function
				this.updateScore();
			} else {
				//if a radio button has not been selected when the Next button is clicked, do nothing
				console.log("nothing selected, no change to score");
			}
		}
	},

	updateScore: function() {
		//(after the nextButton has been clicked) if the value of the previously selected radio button matches the previous item in the correctAnswer array, OR the value of the previously selected radio button matches the correct answer of the final question in the quiz, increment the score.
		if ((this.quizVariables.selectedChoice.value === this.quizVariables.allQuestions[this.quizVariables.currentQuestion - 1].correctAnswer) || (this.quizVariables.selectedChoice.value === this.quizVariables.allQuestions[this.quizVariables.allQuestions.length - 1].correctAnswer)) {
			console.log("something got selected");
			this.quizVariables.score++;
			console.log("score is currently " + this.quizVariables.score);
		} else {
			//otherwise if the values do not match, the wrong answer has been selected and the score remains the same
			console.log("wrong answer selected");
			console.log("score is still " + this.quizVariables.score);
		}
	},

	showTotalScore: function() {
		//showTotalScore() is called when the scoresButton is clicked

		//assign the variable "radios" to all the radio buttons with name "choice"...
		var radios = document.getElementsByName('choice');
		//set ischecked to false initially.
		this.quizVariables.ischecked = false;

		//if a radio button in the array is type = radio button has been selected...
		for (var i = 0; i < radios.length; i++) {
			if (radios[i].type === 'radio' && radios[i].checked) {
				//set ischecked to true.
				this.quizVariables.ischecked = true;
			}
		}

		//...and if a radio button is not selected for the last question...
		if (!this.quizVariables.ischecked) {
			//show error message.
			this.showErrorMessage();
		} else {
			//otherwise, hide the error message.
			this.hideErrorMessage();

			console.log("hide questions, hide buttons, show total score");

			//Hide all text on page
			this.resetPageContent();

			//Remove Scores button
			this.domElements.myForm.removeChild(scoresButton);

			//show final score percentage and feedback.
			this.giveScoreFeedback();
		}
	},

	resetPageContent: function() {
		this.domElements.quizIntro.innerHTML = "";
		this.domElements.quizQuestion.innerHTML = "";
		this.domElements.quizChoices.innerHTML = "";
	},

	showErrorMessage: function() {
		this.domElements.quizErrors.className = "error";
		this.domElements.quizErrors.innerHTML = "You cannot proceed until you make a selection";
		console.log("a checkbox has not been selected so ischecked is " + this.quizVariables.ischecked);
	},

	hideErrorMessage: function() {
		console.log("a checkbox has been selected so ischecked is " + this.quizVariables.ischecked);
		this.domElements.quizErrors.innerHTML = "";
		this.domElements.quizErrors.className = "";
	},

	giveScoreFeedback: function() {
		//convert total score into percentage
		this.quizVariables.percentageScore = ((this.quizVariables.score/this.quizVariables.allQuestions.length) * 100);

		if (this.quizVariables.percentageScore >= 20 && this.quizVariables.percentageScore < 40) {
			console.log(this.quizVariables.percentageScore);
			this.domElements.quizScore.innerHTML = "You are marginally better than rubbish. Your score is: " + this.quizVariables.percentageScore + "%";
		} else if (this.quizVariables.percentageScore >= 40 && this.quizVariables.percentageScore < 70) {
			console.log(this.quizVariables.percentageScore);
			this.domElements.quizScore.innerHTML = "Not bad. Your score is: " + this.quizVariables.percentageScore + "%";
		} else if (this.quizVariables.percentageScore >= 70 && this.quizVariables.percentageScore < 100) {
			console.log(this.quizVariables.percentageScore);
			this.domElements.quizScore.innerHTML = "Pretty good! Your score is: " + this.quizVariables.percentageScore + "%";
		} else if (this.quizVariables.percentageScore === 100) {
			console.log(this.quizVariables.percentageScore);
			this.domElements.quizScore.innerHTML = "You are a genius. Your score is: " + this.quizVariables.percentageScore + "%";
		} else {
			console.log(this.quizVariables.percentageScore);
			this.domElements.quizScore.innerHTML = "I have no words for you. You are rubbish. Your score is: " + this.quizVariables.percentageScore + "%";
		}
	},

	showBackButton: function() {
		var that = this;
		if (this.domElements.myForm.backButton) {
			myForm.removeChild(backButton);
		} else {
			//create Back button
			var backButton = document.createElement("input");
			backButton.type = "button";
			backButton.id = "backButton";
			backButton.value = 'Back';
			myForm.appendChild(backButton);
		}

		EventUtil.addHandler(backButton, 'click', function () {
			that.goBack();
		});
	},

	goBack: function() {
		var that = this;
		console.log("BACK BUTTON EVENT");
		//iterate to the next question in allQuestions array
		this.quizVariables.currentQuestion--;

		console.log("currentQuestion is " + this.quizVariables.currentQuestion);

		//display the current question
		this.domElements.quizQuestion.innerHTML = this.quizVariables.allQuestions[this.quizVariables.currentQuestion].question;

		//remove previous answer choices
		this.domElements.quizChoices.innerHTML = "";

		//display answer choices for current question
		this.showChoices();
	},
};

window.onload = function() {
	var quiz = new jsQuiz();
	quiz.quizVariables.allQuestions = [
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
	];
	quiz.startQuiz();
}