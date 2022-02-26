const MILLISECONDS_PER_FRAME = 50
const PIXEL_SHIM = visualViewport.width / 10
const PLAYER_RADIUS = visualViewport.width / 20

let context;
let batter = {
  xPos: visualViewport.width / 2,
  yPos: visualViewport.height - PIXEL_SHIM,
  color: "IndianRed",
  radius: PLAYER_RADIUS
}
let pitcher = {
  xPos: visualViewport.width / 2,
  yPos: PIXEL_SHIM,
  color: "CornflowerBlue",
  radius: PLAYER_RADIUS
}
let ball ={
  xPos: visualViewport.width / 2,
  yPos: pitcher.yPos + PIXEL_SHIM,
  color: "White",
  radius: PLAYER_RADIUS / 2
}
let touchstart = {
  xPos: 0,
  yPos: 0
}
let battingTeam = "red"
let pitchPath = []
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
  drawCircle(batter)
  drawCircle(pitcher)
  drawCircle(ball)
  if (isPitchMidair) {
    ball.xPos = pitchPath[0].xPos
    ball.yPos = pitchPath[0].yPos
    pitchPath.shift()
    if (ball.yPos > canvas.height - canvas.height / 5) {
      isPitchMidair = false
    } 
  }
  setTimeout(gameLoop, MILLISECONDS_PER_FRAME)
}

/////////

function handleTouchstart(e) {
  touchstart.xPos = e.touches[0].clientX
  touchstart.yPos = e.touches[0].clientY  
}

function handleTouchmove(e) {
  e.preventDefault()
  if (battingTeam == "red" && isClose(touchstart, ball)) {
    pitchPath.push(
      {
        xPos: e.touches[0].clientX,
        yPos: e.touches[0].clientY
      }
    )
  }
  if (e.touches[0].clientY > canvas.height - canvas.height / 5) {
    isPitchMidair = true
  }
}

function drawCircle(object) {
  context.beginPath()
  context.arc(object.xPos, object.yPos, object.radius, 0, 2 * Math.PI)
  context.fillStyle = object.color
  context.fill()
}

////////////////////////////

function isClose(objectA, objectB) {
  return getDistance(objectA, objectB) < PIXEL_SHIM * 2
}

////////////////////////////////////////////////////////

function getDistance(objectA, objectB) {
  return (
    (
      Math.abs(objectA.xPos - objectB.xPos) ** 2 +
      Math.abs(objectA.yPos - objectB.yPos) ** 2
    )
    ** 0.5

  )
}