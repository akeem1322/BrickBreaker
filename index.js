var paddleDirection = 'none'

var angle = 45
const defaultSpeed = 6
var speed = defaultSpeed
const paddleSpeed = 10
const bricksWide = 24
const bricksHigh = 4
var bricks = []
const defaultGameLives = 3
var gameLives = defaultGameLives

var startGame = () => {
	var buttonContainer = document.querySelector('div#button-container')
	buttonContainer.style.display = 'none'
	animationLoop()
}

var updateLives = () => {
	var gameLivesDiv = document.querySelector('#lives')
	gameLivesDiv.innerHTML = 'Game Lives: ' + gameLives
}

var resetBall = () => {
	var ballDiv = document.querySelector('#ball')
	ballDiv.style.top = '21vh'
	ballDiv.style.left = '90vw'
}

var drawBrick = (left, width, top, height, backgroundColor) => {
	const brick = document.createElement('div')
	brick.classList.add('brick')
	brick.style.left = left + 'px'
	brick.style.top = top + 'px'
	brick.style.width = width + 'px'
	brick.style.height = height + 'px'
	brick.style.backgroundColor = backgroundColor
	var brickContainer = document.querySelector('#bricks-container')
	brickContainer.appendChild(brick)
	return brick
}

var drawBricks = () => {
	var brickContainerDiv = document.querySelector('#bricks-container')
	var brickContainerRect = brickContainerDiv.getBoundingClientRect()
	for (var i = 0; i < bricksHigh; i++) {
		var backgroundColor
		if (i === 0) {
			backgroundColor = 'blue'
		}
		if (i === 1) {
			backgroundColor = 'green'
		}
		if (i === 2) {
			backgroundColor = 'red'
		}
		if (i === 3) {
			backgroundColor = 'purple'
		}
		var rowArray = []
		for (j = 0; j < bricksWide; j++) {
			var left = j * brickContainerRect.width / bricksWide
			var width = brickContainerRect.width / bricksWide
			var top = i * brickContainerRect.height / bricksHigh
			var height = brickContainerRect.height / bricksHigh
			var brick = drawBrick(left, width, top, height, backgroundColor)
			var brickObject = {
				visible: true,
				div: brick
			}
			rowArray.push(brickObject)
		}
		bricks.push(rowArray)
	}
}

var detectBallCollision = (ballRect) => {
	for (var i = 0; i < bricksHigh; i++) {
		for (j = 0; j < bricksWide; j++) {
			var brick = bricks[i][j].div
			var brickRect = brick.getBoundingClientRect()
			var didCollide = areColliding(brickRect, ballRect)
			if (didCollide) {
				brick.style.display = 'none'
				if (angle === 225) {
					var xoverlap = brickRect.left + brickRect.width - ballRect.left
					var yoverlap = ballRect.top + ballRect.height - brickRect.top
					if (xoverlap < yoverlap) {
						angle = 315
					} else {
						angle = 135
					}
				} else if (angle === 315) {
					var yoverlap = ballRect.top + ballRect.height - brickRect.top
					var xoverlap = brickRect.left + brickRect.width - ballRect.left
					if (yoverlap < xoverlap) {
						angle = 45
					} else {
						angle = 225
					}
				} else if (angle === 45) {
					var yoverlap = brickRect.top + brickRect.height - ballRect.top
					var xoverlap = ballRect.left + ballRect.width - brickRect.left
					if (yoverlap < xoverlap) {
						angle = 315
					} else {
						angle = 135
					}
				} else if (angle === 135) {
					var yoverlap = brickRect.top + brickRect.height - ballRect.top
					var xoverlap = brickRect.left + brickRect.width - ballRect.left
					if (yoverlap < xoverlap) {
						angle = 225
					} else {
						angle = 45
					}
				}
			}
		}
	}
}

var animationLoop = () => {
	//if (paddleDirection)
	var paddleDiv = document.querySelector('#paddle')
	var paddleRect = paddleDiv.getBoundingClientRect()
	if (paddleDirection === 'left') {
		paddleDiv.style.left = paddleRect.left - paddleSpeed + 'px'
	}
	if (paddleDirection === 'right') {
		paddleDiv.style.left = paddleRect.left + paddleSpeed + 'px'
	}
	var ballDiv = document.querySelector('#ball')
	var ballRect = ballDiv.getBoundingClientRect()

	//Ball Moving
	if (angle === 45) {
		ballDiv.style.left = ballRect.left + speed + 'px'
		ballDiv.style.top = ballRect.top - speed + 'px'
	}
	if (angle === 135) {
		ballDiv.style.left = ballRect.left - speed + 'px'
		ballDiv.style.top = ballRect.top - speed + 'px'
	}
	if (angle === 225) {
		ballDiv.style.left = ballRect.left - speed + 'px'
		ballDiv.style.top = ballRect.top + speed + 'px'
	}
	if (angle === 315) {
		ballDiv.style.left = ballRect.left + speed + 'px'
		ballDiv.style.top = ballRect.top + speed + 'px'
	}
	detectBallCollision(ballRect)

	//Bouncing off the walls 
	//hits the top going upleft
	if (ballRect.top < 0 && angle === 135) {
		//makes it go downleft
		angle = 225
	}
	//hits the top going upright
	if (ballRect.top < 0 && angle === 45) {
		//makes it go downright
		angle = 315
	}
	//hits the left going downleft
	if (ballRect.left < 0 && angle === 225) {
		//makes it go downright 
		angle = 315
	}
	//hits the left going upleft 
	if (ballRect.left < 0 && angle === 135) {
		//make it go upright
		angle = 45
	}
	//hits the right wall going upright
	if (ballRect.left + ballRect.width > document.documentElement.clientWidth && angle === 45) {
		//makes it go downright
		angle = 315
	}
	if (ballRect.left + ballRect.width > document.documentElement.clientWidth && angle === 315) {
		angle = 225
	}
	if (ballRect.top + ballRect.height > document.documentElement.clientHeight) {
		speed = 0
		gameLives = Math.max(gameLives - 1, 0);
		updateLives()
		if (gameLives === 0) {
			var gameoverContainer = document.querySelector('div#endgame-container')
			gameoverContainer.style.display = 'flex'
		} else {
			resetBall()
		}
	}
	if (areColliding(ballRect, paddleRect)) {
		if (angle === 315) {
			angle = 45
		}
		if (angle === 225) {
			angle = 135
		}
	}

	//upright: 45
	//upleft: 135
	//downleft: 225
	//downright: 315
	requestAnimationFrame(() => { animationLoop() })
}

//collision dectection 
const areColliding = (r1, r2) => {
	if (r1.top < r2.top + r2.height &&
		r1.left < r2.left + r2.width &&
		r1.top + r1.height > r2.top &&
		r1.left + r1.width > r2.left) {
		return true
	} else {
		return false
	}
}
window.addEventListener('load', () => {
	drawBricks()
	resetBall()
	updateLives()
})
document.addEventListener('keydown', e => {
	if (e.key === 'ArrowLeft') {
		paddleDirection = 'left'
	}

	if (e.key === 'ArrowRight') {
		paddleDirection = 'right'
	}
	if (e.key === 'p') {
		speed = 0
	}
	if (e.key === ' ') {
		speed = defaultSpeed
	}
	if (e.key === 'r') {
		if (gameLives === 0) {
			gameLives = defaultGameLives
			resetBall()
			updateLives()
			var gameoverContainer = document.querySelector('div#endgame-container')
			gameoverContainer.style.display = 'none'
			var brickContainerDiv = document.querySelector('#bricks-container')
			brickContainerDiv.innerHTML = ''
			drawBricks()
		}
	}
});

document.addEventListener('keyup', e => {
	if (e.key === 'ArrowLeft') {
		paddleDirection = 'none'
	}
	if (e.key === 'ArrowRight') {
		paddleDirection = 'none'
	}
});
