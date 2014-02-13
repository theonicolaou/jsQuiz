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
var quizChoices = document.getElementById("quizChoices");


var quiz = {
	allQuestions: [
		{
			question: "question 1",
			choices: ["choice 1.1", "choice 1.2", "choice 1.3"],
			correctAnswer: "correct answer 1"
		},
		{
			question: "question 2",
			choices: ["choice 2.1", "choice 2.2", "choice 2.3"],
			correctAnswer: "correct answer 2"
		},
		{
			question: "question 3",
			choices: ["choice 3.1", "choice 3.2", "choice 3.3"],
			correctAnswer: "correct answer 3"
		}
	],
	// allQuestions: ["question 1", "question 2", "question 3"],

	nextQuestion: function() {
		for (var i = 0; i < quiz.allQuestions.length; i++) {
			//console.log(quiz.allQuestions);
			quizIntro.innerHTML = "";
			quizQuestion.innerHTML = quiz.allQuestions[i].question;
			quizChoices.innerHTML = "your choices are " + quiz.allQuestions[i].choices;
			// + " "	+ " the correct answer is " + quiz.allQuestions[i].correctAnswer";
		}
	},
}

quizIntro.innerHTML = "Welcome to the quiz. There are " + quiz.allQuestions.length + " questions in the quiz";




//keep this for later - capturing values of radio buttons
// window.onload = function() {
//   var theform = document.getElementById("myForm");
//   var radioArray = [];
//   console.log("-------------");
//   theform.onchange = function() {
//     var selectedRadio = document.querySelector('input[name="color"]:checked').value;
//     console.log("you selected", selectedRadio);
//     radioArray.push(selectedRadio);
//     console.log("radioArray is now " + radioArray);
//   };
// };