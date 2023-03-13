"use strict";

import "../sass/style.scss";
import "../index.html";

import timerFun from "./modules/_timer";
import Particles from "./particles.min";
import { allCountries } from "./modules/_countriesList";


const menuContainer = document.querySelector(".main__menu__container");
const startBtn = document.querySelector(".main__menu__btn-start");
const infoBtn = document.querySelector(".main__menu__btn-info");






const mainMenu = document.querySelector(".main__menu"),
	mainGame = document.querySelector(".main__game");

const menuAllRegionsBox = document.querySelector(".main__menu__countries"),
	menuCountriesBox = document.querySelectorAll(".menuCountries"),
	menuTaskBox = document.querySelectorAll(".menuTask"),
	menuMode = document.querySelectorAll(".menuMode"),
	menuModeBox = document.querySelectorAll(".menuMode"),
	menuBtnStart = document.querySelector(".main__menu__btn"),
	gameMenuBtn = document.querySelectorAll("[data-menu]");
//      all = document.querySelectorAll(".main__menu__countries");

//modal

const btnPlayAgain = document.querySelector(".modal__result-playAgain"),
	modal = document.querySelector(".modal"),
	btnResult = document.querySelector(".main__game-btn-result"),
	resultPoints = document.querySelector(".modal__result-grade");

//get game items
const flag = document.querySelector(".main__game-flag img"),
	//countriesBox = document.querySelector(".main__game-countries"),
	countriesBox = document.querySelectorAll(".countries"),
	countries = document.querySelectorAll(".countries"),
	//capitalsBox = document.querySelector(".main__game-capitals"),
	capitalsBox = document.querySelectorAll(".capital"),
	capitals = document.querySelectorAll(".capital"),
	//worldPartBox = document.querySelector(".main__game-worldPart"),
	worldPartBox = document.querySelectorAll(".worldPart"),
	worldPart = document.querySelectorAll(".worldPart"),
	answer = document.querySelector(".main__game-btn"),
	btnNext = document.querySelector(".main__game-btn-next"),
	btnPrevious = document.querySelector(".main__game-btn-previous"),
	mainGameBox = document.querySelector(".main__game"),
	countryAnswer = document.querySelectorAll(".country-answer"),
	btnMenu = document.querySelector(".main__game-btn-menu");

//const navBox = document.querySelector(".nav__box");
const navBox = document.querySelector(".navItem");
const navBoxItem = document.querySelectorAll(".nav__box-item");

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

function addEventInMneu(box, className, possitionInArr) {
	box.forEach((elem) => {
		elem.addEventListener("click", (e) => {
			if (e.target && e.target.classList.contains(className)) {
				menuSelected[possitionInArr] = e.target.innerText;
				console.log(menuSelected);
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
						const regionBox = Array.from(menuAllRegionsBox);
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
				pullOutSelectedRegion();
				return menuSelected;
			}
		});
	});
}

function addActiv(box, possitionInArr) {
	const boxArr = Array.from(box);
	console.log(boxArr);
	boxArr.forEach((elem) => {
		console.log(elem.innerText);
		if (elem.innerText == menuSelected[possitionInArr]) {
			removeActiv(boxArr);
			elem.style.background = "rgb(196, 236, 116)";
		}
	});
}

function removeActiv(box) {
	console.log(box);
	box.forEach((element) => {
		element.style.background = "none";
	});
}

addEventInMneu(menuCountriesBox, "menuCountries", 0);
addEventInMneu(menuTaskBox, "menuTask", 1);
addEventInMneu(menuModeBox, "menuMode", 2);

menuBtnStart.addEventListener("click", (e) => {
	if (menuSelected[0] && menuSelected[1] && menuSelected[2]) {
		removeActiv(Array.from(countriesBox));
		removeActiv(Array.from(capitalsBox));
		removeActiv(Array.from(worldPart));

		renderUsersAnswer(userAnswer, allQuestionCollection, questionNumber);
		renderActivInNav(questionNumber);

		createQuestion();
		//randomValue(0);
		//randomValue(1);
		questionWithWrongAnswers();
		startGame();
		pullOutSelectedRegion();
		//console.log(questionWithWrongAnswers());

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

//////// do selected menu items///////////////////////////////

function pullOutSelectedRegion() {
	let selectedRegionCountries = [];
	let countriesFilter;
	switch (menuSelected[0]) {
		case "All Countries":
			selectedRegionCountries = [...allCountries];
			break;
		case "Europe":
			countriesFilter = allCountries.filter((elem) => elem[2] == "Europe");
			selectedRegionCountries = [...countriesFilter];
			break;
		case "America":
			countriesFilter = allCountries.filter((elem) => elem[2] == "America");
			selectedRegionCountries = [...countriesFilter];
			break;
		case "Africa":
			countriesFilter = allCountries.filter((elem) => elem[2] == "Africa");
			selectedRegionCountries = [...countriesFilter];
			break;
		case "Asia":
			countriesFilter = allCountries.filter((elem) => elem[2] == "Asia");
			selectedRegionCountries = [...countriesFilter];
			break;
		case "Oceania":
			countriesFilter = allCountries.filter((elem) => elem[2] == "Oceania");
			selectedRegionCountries = [...countriesFilter];
			break;
		default:
			console.log("error");
	}

	return selectedRegionCountries;
}

function createQuestion() {
	const countriesList = pullOutSelectedRegion();
	console.log(countriesList);
	for (let i = 0; i < 5; i++) {
		let random = Math.floor(Math.random() * countriesList.length);
		if (!questionArr.includes(countriesList[random])) {
			questionArr.push(countriesList[random]);
		} else {
			i--;
		}
	}
	console.log(questionArr);
	return questionArr;
}

function shuffle(array) {
	if (array) {
		let m = array.length,
			t,
			i;

		// Пока есть элементы для перемешивания
		while (m) {
			// Взять оставшийся элемент
			i = Math.floor(Math.random() * m--);

			// И поменять его местами с текущим элементом
			t = array[m];
			array[m] = array[i];
			array[i] = t;
		}

		return array;
	}
}

function questionWithWrongAnswers() {
	let correctQuestion = createQuestion();
	let countriesList = pullOutSelectedRegion();
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
				console.log(correctAnswer + " correct");
				console.log(randomWrongAnswers);
				return randomWrongAnswers;
			}
		}
	}

	return randomWrongAnswers;
}
// countriesFilter = allCountries.filter(elem => elem[2])

///////// game

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
		timerFun("start", 10, logSec);
	}

	if (menuSelected[2] == "Hard") {
		timerFun("start", 10, logSec);
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
	// if (1) {
	//     			worldPartBox.forEach((elem) => {
	// 							elem.style.block = "none";
	// 						});
	// }
	renderUsersAnswer(userAnswer, allQuestionCollection, questionNumber);
}

//worldPartBox
function renderQuestion(box, arr, correctAnswerArr, questionNumber, task) {
	const boxArr = Array.from(box);

	const img = document.querySelector(".main__game img");

	img.src = `./assets/${correctAnswer[questionNumber][3]}.svg`;

	boxArr.forEach((elem, i) => {
		if (arr[questionNumber][task][i]) {
			elem.innerText = arr[questionNumber][task][i];
		}
		// elem.innerText =
	});
}

//renderQuestion(countriesBox);
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
	//renderActivInNav(questionNumber);

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
				console.log("test NAAAAV");
				console.log(elem);
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
			elem.style.opacity = ".2";
		});

		worldPartBox.forEach((elem) => {
			elem.style.opacity = ".2";
		});

		addDefaultAnswersCapital();
		addDefaultAnswersRegion(menuSelected[0]);
		console.log("menu selected flag");
		countriesBox.forEach((elem) => {
			elem.addEventListener("click", (e) =>
				onAddEventInGame(countriesBox, "countries", 0, e)
			);
		});
	} else if (menuSelected[1] == "Flag and Capital") {
		worldPartBox.forEach((elem) => {
			elem.style.opacity = ".2";
		});
		console.log("menu selected flag and capital");
		console.log(menuSelected[2]);
		addDefaultAnswersRegion(menuSelected[0]);
		console.log(userAnswer);
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
		console.log("menu selected flag and capital and worldPart");
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
		console.log(menuSelected);
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
		console.log(boxArr2);
		boxArr2.forEach((elem) => {
			console.log(elem.innerText);
			console.log(arrUserAnswer[questionNumber][[2]]);
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

//////////////////////////////////////////////////////////////////

// const navBox = document.querySelector(".nav__box");
// const navBoxItem = document.querySelectorAll(".nav__box-item");

function renderActivInNav(questionNumber) {
	const navBoxChild = navBox;

	navBoxItem.forEach((elem, i) => {
		console.log(elem);
		console.log(elem.innerText);
		console.log(questionNumber);
		if (elem.innerText == questionNumber + 1) {
			console.log(elem);
			navBoxItem.forEach((elem, i) => {
				if (elem.nodeName !== "#text") {
					elem.style.background = "none";

					//elem.style.background = "blue";
					console.log(userAnswer);
					console.log(elem[i]);
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
	console.log("add evenet");
	navBoxItem.forEach((elem) => {
		elem.addEventListener("click", (e) => {
			console.log("test444");
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
				console.log(e.target.innerText);
				console.log(e.innerText);
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
		console.log("test submit");
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
		//changeNavItemsBasedOnAnswers(userAnswer, correctAnswer);
	}
}

function checkUserAndCorrectAnswers() {
	for (let i = 0; i < 10; i++) {
		console.log(userAnswer);
		console.log(correctAnswer);
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

console.log(correctAnswer);

removeEvent(countriesBox);
//renderAnswers(userAnswer, allQuestionCollection, questionNumber);
///////////////////////////////////////////////////////////////  show true answer

function renderAnswers(
	arrUserAnswer,
	allQuestion,
	questionNumber,
	positionInArr,
	box
) {
	console.log(arrUserAnswer);

	for (let i = 0; i < 10; i++) {
		if (
			arrUserAnswer[i][positionInArr] === correctAnswer[i][positionInArr] &&
			questionNumber == i
		) {
			//countriesBox
			const boxArr = Array.from(box);
			boxArr.forEach((elem) => {
				if (elem.innerText == correctAnswer[i][positionInArr]) {
					//renderUsersAnswer(userAnswer, allQuestionCollection, questionNumber);
					//removeActiv(boxArr);
					if (elem.nodeName !== "#text") {
						elem.style.background = "lime";
					}
					//elem.style.corol = "orange";
				}
			});
		} else if (
			arrUserAnswer[i][positionInArr] &&
			arrUserAnswer[i][positionInArr] !== correctAnswer[i][positionInArr] &&
			questionNumber == i
		) {
			const boxArr = Array.from(box);

			boxArr.forEach((elem, j) => {
				console.log(j);
				if (elem.innerText == arrUserAnswer[i][positionInArr]) {
					console.log(arrUserAnswer[i][positionInArr]);
					//renderUsersAnswer(userAnswer, allQuestionCollection, questionNumber);
					//removeActiv(boxArr);
					if (elem.nodeName !== "#text") {
						elem.style.background = "orange";
					}
					//elem.style.corol = "red";
				}
				console.log(elem.innerText);
				console.log(correctAnswer[i][positionInArr]);
				if (
					elem.innerText == correctAnswer[i][positionInArr] &&
					questionNumber == i
				) {
					//removeActiv(boxArr);
					if (elem.nodeName !== "#text") {
						elem.style.background = "lime";
					}
				}
				console.log(arrUserAnswer);
				if (
					elem.innerText == correctAnswer[i][positionInArr] &&
					typeof arrUserAnswer[i][positionInArr] == null
				) {
					if (elem.nodeName !== "#text") {
						elem.style.background = "grey";
					}
				}
				console.log(arrUserAnswer[i][positionInArr]);
				console.log(typeof arrUserAnswer[i][positionInArr]);
			});
		} else if (
			arrUserAnswer[i][positionInArr] === null &&
			questionNumber == i
		) {
			for (let i = 0; i < 10; i++) {
				console.log(arrUserAnswer[i][positionInArr]);
			}
			console.log(arrUserAnswer[i][positionInArr]);
			console.log("test non answer");
			const boxArr = Array.from(box);
			console.log(correctAnswer);
			boxArr.forEach((elem) => {
				// && arrUserAnswer[i][positionInArr] === null
				console.log(elem.innerText);
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
	// for (let i = 0; i < 10; i++) {
	//      console.log(arrUserAnswer[i][positionInArr]);
	// 				console.log(typeof arrUserAnswer[i][positionInArr]);
	// }
}

/////add fun for btn menu/////////////////////////////

btnMenu.addEventListener("click", (e) => {
	if (e.target.classList.contains("menuBtn")) {
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

		console.log(menuSelected);
		console.log(questionCountries);
		console.log(userAnswer);
		console.log(questionArr);
	}
});

function updateData() {
	return (questionArr = []);
}

// addEventInMneu(menuCountriesBox, "menuCountries", 0);
// addEventInMneu(menuTaskBox, "menuTask", 1);
// addEventInMneu(menuModeBox, "menuMode", 2);

//animatio;
window.onload = function () {
	Particles.init({
		selector: ".background",
		color: ["#e998b4", "#c9fffb", "#e0c9ff"],
		connectParticles: true,
		speed: 0.5,
	});
};
