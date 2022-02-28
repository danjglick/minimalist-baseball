const MILLISECONDS_PER_FRAME = 50
const PIXEL_SHIM = visualViewport.width / 5
const PLAYER_RADIUS = visualViewport.width / 20

let context;
let batter = {
  xPos: visualViewport.width / 2,
  yPos: visualViewport.height - PIXEL_SHIM * 2,
  color: "IndianRed",
  radius: PLAYER_RADIUS
}
let pitcher = {
  xPos: visualViewport.width / 2,
  yPos: visualViewport.height / 4,
  color: "CornflowerBlue",
  radius: PLAYER_RADIUS
}
let ball = {
  xPos: visualViewport.width / 2,
  yPos: pitcher.yPos + PIXEL_SHIM,
  xVelocity: 0,
  yVelocity: 0,
  color: "White",
  radius: PLAYER_RADIUS / 2
}
let touchstart = {
  xPos: 0,
  yPos: 0
}
let pitchPath = []
let isBlueBatting = false
let isPitchMidair = false

function initializeGame() {
  let canvas = document.getElementById("canvas")
  canvas.width = visualViewport.width
  canvas.height = visualViewport.height
  context = canvas.getContext('2d')
  document.addEventListener("touchstart", handleTouchstart)
  document.addEventListener("touchmove", handleTouchmove, { passive: false })
  gameLoop()
}

function gameLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  if (isBlueBatting && isPitchMidair) {
    autoPitch()
  }
  moveBall()
  drawCircle(batter)
  drawCircle(pitcher)
  drawCircle(ball)
  setTimeout(gameLoop, MILLISECONDS_PER_FRAME)
}

function handleTouchstart(e) {
  touchstart.xPos = e.touches[0].clientX
  touchstart.yPos = e.touches[0].clientY  
}

function handleTouchmove(e) {
  e.preventDefault()
  if (isBlueBatting && isPitchMidair) {
    handleUserBatting(e) 
  } if (!isBlueBatting && isClose(touchstart, ball, PIXEL_SHIM)) {
    handleUserPitching(e)
  }  
}

/////////////////////

function handleUserBatting(e) {
  batter.xPos = e.touches[0].clientX
  batter.yPos = e.touches[0].clientY
  if (isClose(batter, ball, PIXEL_SHIM)) {
    isPitchMidair = false
    ball.xVelocity = (ball.xPos - e.touches[0].clientX) * 2
    ball.yVelocity = (ball.yPos - e.touches[0].clientY) * 2
    console.log(ball.yVelocity)
  } 
}

function handleUserPitching(e) {
  pitchPath.push(
    {
      xPos: e.touches[0].clientX,
      yPos: e.touches[0].clientY
    }
  )
  if (e.touches[0].clientY > canvas.height - canvas.height / 5) {
    isPitchMidair = true
  }
}

function autoPitch() {
  isPitchMidair = true
  ball.yVelocity = 1
}

function switchBattingTeam() {
  let isBlueBatting = !isBlueBatting
  let pitcherColor = pitcher.color
  let batterColor = batter.color
  pitcher.color = batterColor
  pitcher.color = pitcherColor
}

function moveBall() {
  ball.xPos += ball.xVelocity
  ball.yPos += ball.yVelocity
  if (!isBlueBatting && isPitchMidair) {
    ball.xPos = pitchPath[0].xPos
    ball.yPos = pitchPath[0].yPos
    pitchPath.shift()
    if (ball.yPos > canvas.height - canvas.height / 5) {
      isPitchMidair = false
      ball.yVelocity = 10
    } 
  }
}

function drawCircle(object) {
  context.beginPath()
  context.arc(object.xPos, object.yPos, object.radius, 0, 2 * Math.PI)
  context.fillStyle = object.color
  context.fill()
}

///////////////////////////////////////////////////////////////

function isClose(objectA, objectB, distance) {
  return getDistance(objectA, objectB) < distance
}

function getDistance(objectA, objectB) {
  return (
    (
      Math.abs(objectA.xPos - objectB.xPos) ** 2 +
      Math.abs(objectA.yPos - objectB.yPos) ** 2
    )
    ** 0.5
  )
}