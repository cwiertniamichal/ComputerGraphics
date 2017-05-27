/*************************************/
/********* PARTICLE CLASS ************/
/*************************************/

function Particle(sizeModifier, colorModifier, opacityModifier){
	this.position = new THREE.Vector3();
	this.velocity = new THREE.Vector3();
	this.acceleration = new THREE.Vector3();
	
	this.angle = 0;
	this.angleVelocity = 0; // degrees per second
	this.angleAcceleration = 0; // degrees per second, per second
	
	this.size = 16.0;
	
	this.color = new THREE.Color();
	this.opacity = 1.0;
	
	this.age = 0;
	this.alive = 0;
	
	this.sizeModifier = sizeModifier;
	this.colorModifier = colorModifier;
	this.opacityModifier = opacityModifier;
}


/*************************************/
/*** UPDATE PARTICLE'S PARAMETERS ****/
/*************************************/

Particle.prototype.update = function(dt){
	// first update position (s = v * t)
	this.position.add(this.velocity.clone().multiplyScalar(dt));
	
	// then update velocity (v = a * t)
	this.velocity.add(this.acceleration.clone().multiplyScalar(dt));
	
	// TODO: what for?
	// convert from degrees to radians: 0.01745329251 = Math.PI/180
	this.angle         += this.angleVelocity     * 0.01745329251 * dt;
	this.angleVelocity += this.angleAcceleration * 0.01745329251 * dt;
	
	// update particle's age
	this.age += dt;
	
	if(this.sizeModifier.times.length > 0)
		this.size = this.sizeModifier.lerp(this.age);
				
	if(this.colorModifier.times.length > 0){
		var colorHSL = this.colorModifier.lerp( this.age );
		this.color = new THREE.Color().setHSL( colorHSL.x, colorHSL.y, colorHSL.z );
	}
	
	if(this.opacityModifier.times.length > 0)
		this.opacity = this.opacityModifier.lerp( this.age );
	
}