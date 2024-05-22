const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1280
canvas.height = 720 

var offset = {
	x: -800,
	y: -350
}

var falling = true

var up = false

var click = false

const keys = {
	w:{
		pressed: false
	},
	a:{
		pressed: false
	},
	d:{
		pressed: false
	},
	s:{
		pressed: false
	}	
};

var lastKey = ''

var cursorX = 0;
var cursorY = 0;

const skyImg = new Image()
skyImg.src = './img/bg_blue.png'

const bgImg = new Image()
bgImg.src = './img/bgg3.png'

const playerLeftImg = new Image()
playerLeftImg.src = './img/pblue_left.png'

const playerIdleLeftImg = new Image()
playerIdleLeftImg.src = './img/pblue_idle_left.png'

const playerRightImg = new Image()
playerRightImg.src = './img/pblue_right.png'

const playerIdleRightImg = new Image()
playerIdleRightImg.src = './img/pblue_idle_right.png'

const play1Img = new Image()
play1Img.src = './img/play1.png'

const play2Img = new Image()
play2Img.src = './img/play2.png'

const pause1Img = new Image()
pause1Img.src = './img/pause1.png'

const pause2Img = new Image()
pause2Img.src = './img/pause2.png'

const musicControl = new Sprite({
	position : {
		x: 258,
		y: 210
	},
	image: play1Img,
});


const player = new Sprite({
	position : {
		x: canvas.width/2-24,
		y: 470
	},
	image: playerIdleRightImg,
	frames:{
		max:2
	}
});


const background = new Sprite({
	position : {
		x: offset.x,
		y: offset.y
	},

	image: bgImg
});

const sky = new Sprite({
	position : {
		x: offset.x,
		y: offset.y-1200
	},

	image: skyImg
});

var collisionsMap = []
for (let i=0; i<collisions.length;i+=300){
		collisionsMap.push(collisions.slice(i, i+300))
}

var boundaries = []
collisionsMap.forEach((row, i) => {
	row.forEach((symbol, j) => {
		if (symbol === 10){
		    boundaries.push(new Boundary({position:{
			x:j*Boundary.width+offset.x,
			y:i*Boundary.height+offset.y
		}}))}
	})
})

var musicState = 'play'
var musicIndex1 = 0
var musicIndex2 = 0

const musicImgs = [[play2Img, play2Img, play2Img, play2Img],
					[pause2Img, pause2Img, pause2Img, pause2Img]]

var music = document.getElementById("myAudio"); 

var movables = [background, ...boundaries, musicControl]


function animate(){
	window.requestAnimationFrame(animate)

	let moving = true

	sky.draw()
	background.draw()
	player.draw()
	musicControl.draw()
	for (let i=0; i<boundaries.length;i+=1){
		// boundaries[i].draw()
	}

	if (falling){
		
				movables.forEach((movables)=>{
					movables.position.y -= 2
		})
				sky.position.y-=0.667
	}

	if (keys.w.pressed & !falling) {
			player.moving = true
			console.log(background.position.y)

			if(player.moving && background.position.y <-5){
				movables.forEach((movables)=>{
					movables.position.y += 3
		})
				sky.position.y+=1
			} 

	}

	// if (keys.s.pressed) {
	// 		player.moving = true

	// 		if(player.moving){
	// 			movables.forEach((movables)=>{
	// 				movables.position.y -= 5
	// 	})} 

	// }

	if (keys.a.pressed) {
			player.moving = true
			player.image = playerLeftImg

			for (let i=0;i<boundaries.length;i++){
			const boundary = boundaries[i]
			if (
			gravityCollision({
				rectangle1:player,
				rectangle2:{...boundary, position:{
					x:boundary.position.x+2,
					y:boundary.position.y+10
				}}
			})){
			console.log(`colliding`)
			moving = false
			break
			}
		}

		if (moving){
			movables.forEach((movables)=>{
				movables.position.x += 3
		})
			sky.position.x+=1}

	} if (keys.d.pressed) {
			player.moving = true
			player.image = playerRightImg

			for (let i=0;i<boundaries.length;i++){
			const boundary = boundaries[i]
			if (
			gravityCollision({
				rectangle1:player,
				rectangle2:{...boundary, position:{
					x:boundary.position.x-2,
					y:boundary.position.y+10
				}}
			})){
			console.log(`colliding`)
			moving = false
			break
			}
		}

		if (moving){
			movables.forEach((movables)=>{
				movables.position.x -= 3
		})
			sky.position.x-=1}

	} 



	if (!keys.a.pressed & !keys.d.pressed){
		if (lastKey == 'a'){
			player.image = playerIdleLeftImg
		} else {
			player.image = playerIdleRightImg
		}
	}

	for (let i=0;i<boundaries.length;i++){
		const boundary = boundaries[i]
		if (
		gravityCollision({
			rectangle1:player,
			rectangle2:{...boundary, position:{
				x:boundary.position.x,
				y:boundary.position.y-3
			}}
		})){
		collideVar = true
		falling = false
		// console.log("COLLIDEEEE")
		break
		} else if (!keys.w.pressed) {
			falling = true
		}
		
	}

	
	if (click){
		// console.log(cursorX, cursorY)
		click = false
		if (musicClicked(musicControl, cursorX, cursorY)){
			musicIndex2 = 0
			if (musicState == 'play'){
				musicState = 'pause'
				music.play()


			} else {
				music.pause()
				musicState = 'play'
			}
			// musicControl.image = musicImgs[musicIndex1][musicIndex2]

			// if (musicIndex2>=4){
			// 	musicIndex2 = 0
			// 	if (musicIndex1 == 0){
			// 		musicControl.image = pause1Img
			// 		musicIndex1 = 1
			// 	} else {
			// 		musicIndex1 = 0
			// 	}
			// }else{
			// musicIndex2+=1}

		}
		
	}

	if (musicState == 'pause'){
		musicControl.image = musicImgs[0][musicIndex2]
		if (musicIndex2 > 5){
			musicControl.image = pause1Img
			
		} else {
			musicIndex2 += 1
			musicControl.image = play2Img
		}
	} else {
		musicControl.image = musicImgs[0][musicIndex2]
		if (musicIndex2 > 5){
			musicControl.image = play1Img
			
		} else {
			musicIndex2 += 1
			musicControl.image = pause2Img
		}
	}

	// if (up){
	// 	musicControl.image = play1Img
	// }
	// up = false

	


}

animate()

window.addEventListener('keydown', (e)=>{
	if(e.key === 'w'){
		keys.w.pressed = true
	}if(e.key === 'a'){
		lastKey = 'a'
		keys.a.pressed = true
	}if(e.key === 'd'){
		lastKey = 'd'
		keys.d.pressed = true
	}if(e.key === 's'){
		lastKey = 's'
		keys.s.pressed = true
	}
});

window.addEventListener('keyup', (e)=>{
	if(e.key === 'w'){
		keys.w.pressed = false
	}if(e.key === 'a'){
		keys.a.pressed = false
	}if(e.key === 'd'){
		keys.d.pressed = false
	}if(e.key === 's'){
		keys.s.pressed = false
	}
});


window.addEventListener('click', (e)=>{
	cursorX = e.pageX;
    cursorY = e.pageY;
    click = true
    console.log('down')
})

window.addEventListener('mouseup', (e)=>{
	cursorX = e.pageX;
    cursorY = e.pageY;
    up = true
    console.log('down')
})
