"use strict";

import "../sass/style.scss";
import "../index.html";

import pullOutSelectedRegion from "./modules/_pullOutSelectedRegion";
import timerFun from "./modules/_timer";
import Particles from "./particles.min";
import { allCountries } from "./modules/_countriesList";
import shuffle from "./modules/_shuffle";
import mainBgAnimation from "./modules/_mainBgAnimation";

mainBgAnimation();
////////get menu items////////
const mainMenu = document.querySelector(".main__menu"),
	mainGame = document.querySelector(".main__game");

const menuAllRegionsBox = document.querySelector(".main__menu__countries"),
	menuCountriesBox = document.querySelectorAll(".menuCountries"),
	menuTaskBox = document.querySelectorAll(".menuTask"),
	menuModeBox = document.querySelectorAll(".menuMode"),
	menuBtnStart = document.querySelector(".main__menu__btn");

//get game items////////////

const countriesBox = document.querySelectorAll(".countries"),
	capitalsBox = document.querySelectorAll(".capital"),
	worldPartBox = document.querySelectorAll(".worldPart"),
	worldPart = document.querySelectorAll(".worldPart"),
	btnNext = document.querySelector(".main__game-btn-next"),
	btnPrevious = document.querySelector(".main__game-btn-previous"),
	btnMenu = document.querySelector(".main__game-btn-menu");

//////////get game nav items////////////////////////////
const navBox = document.querySelector(".navItem");
const navBoxItem = document.querySelectorAll(".nav__box-item");

/////global variables//////////////////
let menuSelected = [null, null, null];
let noSubmit = false;
let questionCountries = [];
let questionCapital = [];
let correctAnswer = [];
let allQuestionCollection = [];
let questionArr = [];
let questionNumber = 0;
let userAnswer = [
	[null, null, null],
	[null, null, null],
	[null, null, null],
	[null, null, null],
	[null, null, null],
	[null, null, null],
	[null, null, null],
	[null, null, null],
	[null, null, null],
	[null, null, null],
];
let accuracyUsersAnswers = [];

////////////////////// menu funcional.////////////////////////
function addEventInMenu(box, className, possitionInArr) {
	box.forEach((elem) => {
		elem.addEventListener("click", (e) => {
			if (e.target && e.target.classList.contains(className)) {
				menuSelected[possitionInArr] = e.target.innerText;

				addActiv(box, possitionInArr);

				if (e.target.classList.contains("menuCountries")) {
					if (e.target.innerText !== "All Countries") {
						const taskBox = Array.from(menuTaskBox);
						taskBox.forEach((elem) => {
							if (elem.innerText == "Flag, Capital and World Part") {
								elem.style.background = "grey";
							} else if (menuSelected[1] == "Flag, Capital and World Part") {
								menuSelected[1] = null;
							}
						});
					}

					if (e.target.innerText == "All Countries") {
						const taskBox = Array.from(menuTaskBox);
						taskBox.forEach((elem) => {
							if (elem.innerText == "Flag, Capital and World Part") {
								elem.style.background = "none";
							}
						});
					}
				}

				if (e.target.classList.contains("menuTask")) {
					if (e.target.innerText == "Flag, Capital and World Part") {
						const regionBox = Array.from(menuCountriesBox);
						regionBox.forEach((elem) => {
							if (elem.innerText !== "All Countries") {
								elem.style.background = "grey";
							} else {
								elem.style.background = "none";
							}
						});

						if (menuSelected[0] !== "All Countries") {
							menuSelected[0] = null;
						}
					}
					if (
						e.target.innerText !== "Flag, Capital and World Part" &&
						menuSelected[0] !== "All Countries"
					) {
						const taskBox = Array.from(menuTaskBox);
						taskBox.forEach((elem) => {
							if (elem.innerText == "Flag, Capital and World Part") {
								elem.style.background = "grey";
							}
						});
					}
				}
			}
			if (possitionInArr === 1) {
				pullOutSelectedRegion(menuSelected, allCountries);
				return menuSelected;
			}
		});
	});
}

function addActiv(box, possitionInArr) {
	const boxArr = Array.from(box);

	boxArr.forEach((elem) => {
		if (elem.innerText == menuSelected[possitionInArr]) {
			removeActiv(boxArr);
			elem.style.background = "rgb(196, 236, 116)";
		}
	});
}

function removeActiv(box) {
	box.forEach((element) => {
		element.style.background = "none";
	});
}

addEventInMenu(menuCountriesBox, "menuCountries", 0);
addEventInMenu(menuTaskBox, "menuTask", 1);
addEventInMenu(menuModeBox, "menuMode", 2);

menuBtnStart.addEventListener("click", (e) => {
	if (menuSelected[0] && menuSelected[1] && menuSelected[2]) {
		removeActiv(Array.from(countriesBox));
		removeActiv(Array.from(capitalsBox));
		removeActiv(Array.from(worldPart));

		renderUsersAnswer(userAnswer, allQuestionCollection, questionNumber);
		renderActivInNav(questionNumber);

		createQuestion();

		questionWithWrongAnswers();
		startGame();
		pullOutSelectedRegion(menuSelected, allCountries);

		renderQuestion(countriesBox, allQuestionCollection, questionArr, 0, 0);
		renderQuestion(capitalsBox, allQuestionCollection, questionArr, 0, 1);
		renderActivInNav(questionNumber);
		/////
		addEventOnNavItem();

		onInfoPanel(false);
	} else {
		onInfoPanel(true);
	}
});

function onInfoPanel(onOrOff) {
	if (onOrOff) {
		console.log("test panel");
		const infoPanel = document.querySelector(".main__menu__btn-info");
		infoPanel.innerText = "Please select all tasks!";
	}
}

////////create quetions ///////////////////////////////

function createQuestion() {
	const countriesList = pullOutSelectedRegion(menuSelected, allCountries);

	for (let i = 0; i < 5; i++) {
		let random = Math.floor(Math.random() * countriesList.length);
		if (!questionArr.includes(countriesList[random])) {
			questionArr.push(countriesList[random]);
		} else {
			i--;
		}
	}

	return questionArr;
}

function questionWithWrongAnswers() {
	let correctQuestion = createQuestion();
	let countriesList = pullOutSelectedRegion(menuSelected, allCountries);
	for (let i = 0; i < 10; i++) {
		questionCountries = [
			[
				correctQuestion[i][0],
				...randomValue(0, correctQuestion[i][0], countriesList),
			],
		];
		questionCapital = [
			[
				correctQuestion[i][1],
				...randomValue(1, correctQuestion[i][1], countriesList),
			],
		];

		allQuestionCollection.push([
			shuffle(...questionCountries),
			shuffle(...questionCapital),
		]);

		correctAnswer.push(correctQuestion[i]);
	}

	return allQuestionCollection;
}

function randomValue(positionInArr, correctAnswer, countriesList) {
	let regionList = shuffle(countriesList);

	let randomWrongAnswers = [];
	for (let i = 0; i < regionList.length; i++) {
		if (regionList[i][positionInArr] === correctAnswer && correctAnswer) {
			console.log("i--");
		} else {
			randomWrongAnswers.push(regionList[i][positionInArr]);

			if (randomWrongAnswers.length >= 3) {
				return randomWrongAnswers;
			}
		}
	}

	return randomWrongAnswers;
}

///////// game/////////////////////////////////////////

function logSec() {
	submit(true);
}

function startGame() {
	removeActiv(Array.from(menuCountriesBox));
	removeActiv(Array.from(menuTaskBox));
	removeActiv(Array.from(menuModeBox));

	mainMenu.style.display = "none";
	mainGame.style.display = "block";
	if (menuSelected[2] == "Normal") {
		timerFun("start", 120, logSec);
	}

	if (menuSelected[2] == "Hard") {
		timerFun("start", 80, logSec);
	}
	removeActiv(Array.from(menuCountriesBox));
	removeActiv(Array.from(menuTaskBox));
	removeActiv(Array.from(menuModeBox));
	renderUsersAnswer(userAnswer, allQuestionCollection, questionNumber);
	addEventInGame();
	if (menuSelected[1] == "Flag" || "Flag and Capital") {
		worldPartBox.forEach((elem) => {
			elem.style.block = "none";
		});
	}

	renderUsersAnswer(userAnswer, allQuestionCollection, questionNumber);
}

function renderQuestion(box, arr, correctAnswerArr, questionNumber, task) {
	const boxArr = Array.from(box);
	const img = document.querySelector(".main__game img");

	img.src = `./assets/${correctAnswer[questionNumber][3]}.svg`;

	boxArr.forEach((elem, i) => {
		if (arr[questionNumber][task][i]) {
			elem.innerText = arr[questionNumber][task][i];
		}
	});
}

//////////game btns/////////////////////////
btnNext.addEventListener("click", () => {
	if (questionNumber < 9) {
		questionNumber++;
		onFunBtnNextPrev();
	}
});

btnPrevious.addEventListener("click", () => {
	if (questionNumber >= 1) {
		questionNumber--;
		onFunBtnNextPrev();
	}
});

document.addEventListener("keydown", (e) => {
	console.log("test key");
	if (questionNumber < 9 && e.keyCode === 39) {
		questionNumber++;
		onFunBtnNextPrev();
	}
});

document.addEventListener("keydown", (e) => {
	console.log("test key");
	if (questionNumber >= 1 && e.keyCode === 37) {
		questionNumber--;
		onFunBtnNextPrev();
	}
});

function onFunBtnNextPrev() {
	removeActiv(Array.from(countriesBox));
	removeActiv(Array.from(capitalsBox));
	removeActiv(Array.from(worldPart));

	renderQuestion(
		countriesBox,
		allQuestionCollection,
		questionArr,
		questionNumber,
		0
	);
	renderQuestion(
		capitalsBox,
		allQuestionCollection,
		questionArr,
		questionNumber,
		1
	);

	renderUsersAnswer(userAnswer, allQuestionCollection, questionNumber);

	if (noSubmit) {
		renderAnswers(
			userAnswer,
			allQuestionCollection,
			questionNumber,
			0,
			countriesBox
		);
		renderAnswers(
			userAnswer,
			allQuestionCollection,
			questionNumber,
			1,
			capitalsBox
		);
		renderAnswers(
			userAnswer,
			allQuestionCollection,
			questionNumber,
			2,
			worldPartBox
		);
		changeNavItemsBasedOnAnswers();
	}

	addActivOnNavItem();
	renderActivInNav(questionNumber);
}

//////////////////////////////////////////////////// check users answers and add activ on prev question//////////////////////
function addActivOnNavItem() {
	if (checkAnswerValue() || 1) {
		navBoxItem.forEach((elem, i) => {
			if (checkAnswerNav(i) && !noSubmit) {
				elem.style.background = "rgb(165, 226, 122)";
			}
		});
	}
}

function checkAnswerNav(i) {
	if (userAnswer[i][0] == null || undefined) {
		return false;
	}
	if (userAnswer[i][1] == null || undefined) {
		return false;
	}
	if (userAnswer[i][2] == null || undefined) {
		return false;
	}

	return true;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addEventInGame() {
	if (menuSelected[1] == "Flag") {
		capitalsBox.forEach((elem) => {
			elem.style.opacity = ".35";
		});

		worldPartBox.forEach((elem) => {
			elem.style.opacity = ".35";
		});

		addDefaultAnswersCapital();
		addDefaultAnswersRegion(menuSelected[0]);

		countriesBox.forEach((elem) => {
			elem.addEventListener("click", (e) =>
				onAddEventInGame(countriesBox, "countries", 0, e)
			);
		});
	} else if (menuSelected[1] == "Flag and Capital") {
		worldPartBox.forEach((elem) => {
			elem.style.opacity = ".35";
		});

		addDefaultAnswersRegion(menuSelected[0]);

		countriesBox.forEach((elem) => {
			elem.addEventListener("click", (e) =>
				onAddEventInGame(countriesBox, "countries", 0, e)
			);
		});
		capitalsBox.forEach((elem) => {
			elem.addEventListener("click", (e) =>
				onAddEventInGame(capitalsBox, "capital", 1, e)
			);
		});
	} else if (menuSelected[1] == "Flag, Capital and World Part") {
		countriesBox.forEach((elem) => {
			elem.addEventListener("click", (e) =>
				onAddEventInGame(countriesBox, "countries", 0, e)
			);
		});
		capitalsBox.forEach((elem) => {
			elem.addEventListener("click", (e) =>
				onAddEventInGame(capitalsBox, "capital", 1, e)
			);
		});
		worldPartBox.forEach((elem) => {
			elem.addEventListener("click", (e) =>
				onAddEventInGame(worldPartBox, "worldPart", 2, e)
			);
		});
	}
}

function addDefaultAnswersRegion(region) {
	for (let i = 0; i < 10; i++) {
		userAnswer[i][2] = region;
	}
}

function addDefaultAnswersCapital() {
	for (let i = 0; i < 10; i++) {
		userAnswer[i][1] = correctAnswer[i][1];
	}
}

function onAddEventInGame(box, className, possitionInArr, e) {
	if (e.target && e.target.classList.contains(className) && !noSubmit) {
		menuSelected[possitionInArr] = e.target.innerText;
		addActivGame(box, possitionInArr);
		renderUsersAnswer(userAnswer, allQuestionCollection, questionNumber);
	}

	return menuSelected;
}

function addActivGame(box, possitionInArr) {
	const boxArr = Array.from(box);

	boxArr.forEach((elem) => {
		if (elem.innerText == menuSelected[possitionInArr]) {
			renderUsersAnswer(userAnswer, allQuestionCollection, questionNumber);
			removeActiv(boxArr);
			if (elem.nodeName !== "#text") {
				elem.style.background = "yellow";
			}

			userAnswer[questionNumber][possitionInArr] = elem.innerText;
		}
	});
}

//////////////////////////////////////////////////////////////////////

// render users answers when goes next or prev question//////////////////////////

function renderUsersAnswer(arrUserAnswer, allQuestion, questionNumber) {
	addActivinUserAnswer(
		allQuestion,
		arrUserAnswer,
		questionNumber,
		0,
		countriesBox
	);
	addActivinUserAnswer(
		allQuestion,
		arrUserAnswer,
		questionNumber,
		1,
		capitalsBox
	);

	if (arrUserAnswer[questionNumber][2]) {
		const boxArr2 = Array.from(worldPartBox);

		boxArr2.forEach((elem) => {
			if (elem.innerText == arrUserAnswer[questionNumber][[2]]) {
				addActivInGameItems(worldPartBox, elem.innerText);
			}
		});
	}
}

function addActivinUserAnswer(
	allQuestion,
	arrUserAnswer,
	questionNumber,
	positionInArr,
	box
) {
	if (arrUserAnswer[questionNumber][positionInArr]) {
		allQuestion[questionNumber][positionInArr].forEach((elem) => {
			if (elem == arrUserAnswer[questionNumber][[positionInArr]]) {
				addActivInGameItems(box, elem);
			}
		});
	}
}

function addActivInGameItems(box, value) {
	const boxArr = Array.from(box);

	boxArr.forEach((elem) => {
		if (elem.innerText == value) {
			removeActiv(boxArr);
			elem.style.background = "rgb(188, 234, 117)";
		}
	});
}

////////////game Nav//////////////////////////////////////////////////////

function renderActivInNav(questionNumber) {
	const navBoxChild = navBox;

	navBoxItem.forEach((elem, i) => {
		if (elem.innerText == questionNumber + 1) {
			navBoxItem.forEach((elem, i) => {
				if (elem.nodeName !== "#text") {
					elem.style.background = "none";
				}
			});
			if (noSubmit) {
				console.log("render in nav");
				renderAnswers(
					userAnswer,
					allQuestionCollection,
					questionNumber,
					0,
					countriesBox
				);
				renderAnswers(
					userAnswer,
					allQuestionCollection,
					questionNumber,
					1,
					capitalsBox
				);
				renderAnswers(
					userAnswer,
					allQuestionCollection,
					questionNumber,
					2,
					worldPartBox
				);
				changeNavItemsBasedOnAnswers();
			}
			addActivOnNavItem();
			if (elem.nodeName !== "#text") {
				elem.style.background = "rgb(8, 159, 143)";
				elem.style.zIndex = "2";
			}
		}
		addActivOnNavItem();
	});
}

renderActivInNav();

function addEventOnNavItem() {
	navBoxItem.forEach((elem) => {
		elem.addEventListener("click", (e) => {
			if (e.target && e.target.classList.contains("navItem")) {
				if (e.target.innerText !== questionNumber + 1) {
					questionNumber = e.target.innerText - 1;

					removeActiv(Array.from(countriesBox));
					removeActiv(Array.from(capitalsBox));
					removeActiv(Array.from(worldPart));

					renderQuestion(
						countriesBox,
						allQuestionCollection,
						questionArr,
						questionNumber,
						0
					);
					renderQuestion(
						capitalsBox,
						allQuestionCollection,
						questionArr,
						questionNumber,
						1
					);
					renderUsersAnswer(userAnswer, allQuestionCollection, questionNumber);
					renderActivInNav(questionNumber);
				}
			}
		});
	});
	//return questionNumber;
}
addEventOnNavItem();

///////////////// work with btn submit////////////////////////////////////
const btnSubmit = document.querySelector(".main__game-btn-submit");

btnSubmit.addEventListener("click", submit);

function submit(noTime = false) {
	console.log(checkAnswerValue());
	if (checkAnswerValue() || noTime) {
		noSubmit = true;

		countriesBox.forEach((elem) => {
			elem.removeEventListener("click", (e) =>
				onAddEventInGame(countriesBox, "countries", 0, e)
			);
		});
		capitalsBox.forEach((elem) => {
			elem.removeEventListener("click", (e) =>
				onAddEventInGame(capitalsBox, "countries", 1, e)
			);
		});
		worldPartBox.forEach((elem) => {
			elem.removeEventListener("click", (e) =>
				onAddEventInGame(worldPartBox, "countries", 2, e)
			);
		});

		removeEvent(countriesBox, capitalsBox, worldPartBox);
		renderAnswers(
			userAnswer,
			allQuestionCollection,
			questionNumber,
			0,
			countriesBox
		);
		renderAnswers(
			userAnswer,
			allQuestionCollection,
			questionNumber,
			1,
			capitalsBox
		);
		renderAnswers(
			userAnswer,
			allQuestionCollection,
			questionNumber,
			2,
			worldPartBox
		);
		checkUserAndCorrectAnswers(userAnswer, correctAnswer);

		changeNavItemsBasedOnAnswers(userAnswer, correctAnswer);
		renderActivInNav(questionNumber);
		timerFun("end", 0, logSec);
	} else {
		checkUserAndCorrectAnswers(userAnswer, correctAnswer);
	}
}

function checkUserAndCorrectAnswers() {
	for (let i = 0; i < 10; i++) {
		if (
			userAnswer[i][0] == correctAnswer[i][0] &&
			userAnswer[i][1] == correctAnswer[i][1] &&
			userAnswer[i][2] == correctAnswer[i][2]
		) {
			accuracyUsersAnswers[i] = true;
		} else {
			accuracyUsersAnswers[i] = false;
		}
	}
	return accuracyUsersAnswers;
}

function changeNavItemsBasedOnAnswers() {
	navBoxItem.forEach((elem, i) => {
		if (accuracyUsersAnswers[i]) {
			elem.style.background = "lime";
		} else {
			elem.style.background = "orange";
		}
	});
}

function checkAnswerValue() {
	for (let i = 0; i < userAnswer.length; i++) {
		if (userAnswer[i][0] == null || undefined) {
			return false;
		}
		if (userAnswer[i][1] == null || undefined) {
			return false;
		}
		if (userAnswer[i][2] == null || undefined) {
			return false;
		}
	}
	return true;
}

function removeEvent(box) {
	box.forEach((elem) => {
		elem.removeEventListener("click", (e) =>
			onAddEventInGame(box, className, possitionInArr, e)
		);
	});
}

removeEvent(countriesBox);

//////show true answer/////////////////////////////////////////////////////////  show true answer

function renderAnswers(
	arrUserAnswer,
	allQuestion,
	questionNumber,
	positionInArr,
	box
) {
	for (let i = 0; i < 10; i++) {
		if (
			arrUserAnswer[i][positionInArr] === correctAnswer[i][positionInArr] &&
			questionNumber == i
		) {
			const boxArr = Array.from(box);
			boxArr.forEach((elem) => {
				if (elem.innerText == correctAnswer[i][positionInArr]) {
					if (elem.nodeName !== "#text") {
						elem.style.background = "lime";
					}
				}
			});
		} else if (
			arrUserAnswer[i][positionInArr] &&
			arrUserAnswer[i][positionInArr] !== correctAnswer[i][positionInArr] &&
			questionNumber == i
		) {
			const boxArr = Array.from(box);

			boxArr.forEach((elem, j) => {
				if (elem.innerText == arrUserAnswer[i][positionInArr]) {
					if (elem.nodeName !== "#text") {
						elem.style.background = "orange";
					}
				}

				if (
					elem.innerText == correctAnswer[i][positionInArr] &&
					questionNumber == i
				) {
					if (elem.nodeName !== "#text") {
						elem.style.background = "lime";
					}
				}

				if (
					elem.innerText == correctAnswer[i][positionInArr] &&
					typeof arrUserAnswer[i][positionInArr] == null
				) {
					if (elem.nodeName !== "#text") {
						elem.style.background = "grey";
					}
				}
			});
		} else if (
			arrUserAnswer[i][positionInArr] === null &&
			questionNumber == i
		) {
			const boxArr = Array.from(box);

			boxArr.forEach((elem) => {
				if (
					elem.nodeName !== "#text" &&
					elem.innerText == correctAnswer[i][positionInArr]
				) {
					elem.style.background = "grey";
					elem.style.color = "yerrow";
				}
			});
		}
	}
}

btnMenu.addEventListener("click", (e) => {
	if (
		e.target.classList.contains("menuBtn") ||
		e.target.classList.contains("menuBtnSpan")
	) {
		timerFun("end", 0, logSec);

		removeActiv(Array.from(menuCountriesBox));
		removeActiv(Array.from(menuTaskBox));
		removeActiv(Array.from(menuModeBox));

		mainMenu.style.display = "block";
		mainGame.style.display = "none";

		menuSelected = [null, null, null];
		noSubmit = false;
		questionCountries = [];
		questionCapital = [];
		correctAnswer = [];
		allQuestionCollection = [];
		questionArr = [];
		questionNumber = 0;
		userAnswer = [
			[null, null, null],
			[null, null, null],
			[null, null, null],
			[null, null, null],
			[null, null, null],
			[null, null, null],
			[null, null, null],
			[null, null, null],
			[null, null, null],
			[null, null, null],
		];
		accuracyUsersAnswers = [];

		capitalsBox.forEach((elem) => {
			elem.style.opacity = "1";
		});
		worldPartBox.forEach((elem) => {
			elem.style.opacity = "1";
		});
	}
});
