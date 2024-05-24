class Sprite {
	constructor({position, velocity, image, frames = {max:1}}){
		this.position = position;
		this.image = image;
		this.frames = {...frames, val: 0, elapsed: 0}

		this.image.onload = () => {
			this.width = this.image.width/this.frames.max
			this.height = this.height
		}

		this.moving = false
		this.beforeAnimation1 = false
		this.beforeAnimation2 = false
		
	}

	draw(){
		c.drawImage(this.image,
		 this.frames.val*this.width,
		 0,
		 this.image.width/this.frames.max,
		 this.image.height,
		 this.position.x,
		 this.position.y,
		 this.image.width/this.frames.max,
		 this.image.height);

		if(this.frames.max>1){
			this.frames.elapsed++
		}
		
		if (this.frames.elapsed%10 === 0){
			if (this.frames.val < this.frames.max-1) this.frames.val++
			else {
				this.frames.val = 0
				this.beforeAnimation1 = true
				this.beforeAnimation2 = true
			}
		}
	}

}

class Boundary {
	static width = 45
	static height = 45

	constructor({position}) {
		this.position = position
		this.width = 45
		this.height = 45
	}

	draw() {
		c.fillStyle = 'rgba(255, 0, 0, 100)'
		c.fillRect(this.position.x, this.position.y, this.width, this.height)
	}
}

function rectangularCollision({rectangle1, rectangle2}){
	return (rectangle1.position.x - 9   + rectangle1.width >= rectangle2.position.x && 
		rectangle1.position.x + 2  <= rectangle2.width + rectangle2.position.x &&
		rectangle1.position.y - 15  + rectangle1.width >= rectangle2.position.y &&
		rectangle1.position.y  <= rectangle2.height + rectangle2.position.y)
}

function gravityCollision({rectangle1, rectangle2}){
	return (rectangle1.position.x + rectangle1.width >= rectangle2.position.x && 
		rectangle1.position.x  <= rectangle2.width + rectangle2.position.x &&
		rectangle1.position.y  + rectangle1.width >= rectangle2.position.y &&
		rectangle1.position.y  <= rectangle2.height + rectangle2.position.y)
}

function xCollision({rectangle1, rectangle2}){
	return (rectangle1.position.x + rectangle1.width >= rectangle2.position.x )
}

function musicClicked(box, x, y){
	return (box.position.x + box.width >= x && box.position.x + 8 <= x && box.position.y + box.width >= y && box.position.y + 8 <= y)
}
