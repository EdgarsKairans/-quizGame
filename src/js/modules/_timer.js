let intervalId = null;

export default function timerFun(pos, timeSec = 120, logSec) {
	const minutesLabel = document.getElementById("minutes");
	const secondsLabel = document.getElementById("seconds");
	const startButton = document.getElementById("start-button");
	const timerBox = document.querySelector(".timer");

	let totalSeconds = +timeSec;
	let secondsElapsed = 0;

	function updateTime() {
		let seconds = totalSeconds - secondsElapsed;
		console.log(seconds);
		console.log(intervalId);
		if (seconds < 0) {
			clearInterval(intervalId);
			logSec();
			seconds = 0;
		}

		const minutes = Math.floor(seconds / 60);
		seconds = seconds % 60;

		minutesLabel.textContent = String(minutes).padStart(2, "0");
		secondsLabel.textContent = String(seconds).padStart(2, "0");

		secondsElapsed++;
	}

	if (pos === "start") {
		function startTimer() {
			timerBox.style.visibility = "visible";
			if (seconds < 0) {
				endTime();
				clearInterval(intervalId);
			}

			intervalId = setInterval(updateTime, 1000);
			console.log("startttt timer");
			console.log(intervalId);
		}
		startTimer();
	} else if (pos === "end") {
		function endTimer() {
			console.log(intervalId);
			timerBox.style.visibility = "hidden";
			clearInterval(intervalId);
			totalSeconds = secondsElapsed;
			secondsElapsed = 0;
			minutesLabel.textContent = "00";
			secondsLabel.textContent = "00";
			return totalSeconds;
		}
		endTimer();
	}
}

// 		if (pos == "end") {
// 			console.log("test end timer");
// 			clearInterval(intervalId);
// 			let secondsElapsed = 0;
// 			let intervalId = null;
// 			timerBox.style.visibility = "hidden";
// 			totalSeconds = 0;
// 			secondsElapsed = 0;
// 			minutesLabel.textContent = "00";
// 			secondsLabel.textContent = "00";
// 			console.log(intervalId);
// 			clearInterval(intervalId);
// 			endTime();
// 		}
// 	return intervalId;
// }
