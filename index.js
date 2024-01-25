var paddleDirection = 'none'

var angle = 45
const speed = 6
const paddleSpeed = 10

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
window.addEventListener('load', animationLoop)
document.addEventListener('keydown', e => {
	if (e.key === 'ArrowLeft') {
		paddleDirection = 'left'
	}

	if (e.key === 'ArrowRight') {
		paddleDirection = 'right'
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