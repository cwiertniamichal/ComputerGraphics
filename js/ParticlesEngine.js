// shaders

particleVertexShader = [
"attribute vec3 color;",
"attribute float opacity;",
"attribute float size;",
"attribute float angle;",
"attribute float visible;",
"varying vec4 vColor;",
"varying float vAngle;",
"void main(){",
	
	// set visibility of particle
	"if (visible > 0.5)",
		"vColor = vec4(color, opacity);",
	"else",
		"vColor = vec4(0.0, 0.0, 0.0, 0.0);",
	
	"vAngle = angle;",
	
	"vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);",
	"gl_PointSize = size * (300.0 / length(mvPosition.xyz));",
	"gl_Position = projectionMatrix * mvPosition;",
"}"
].join("\n");

particleFragmentShader =
[
"uniform sampler2D texture;",
"varying vec4 vColor;", 	
"varying float vAngle;",   
"void main(){", 
	"gl_FragColor = vColor;",
	
	"float c = cos(vAngle);",
	"float s = sin(vAngle);",
	"vec2 rotatedUV = vec2(c * (gl_PointCoord.x - 0.5) + s * (gl_PointCoord.y - 0.5) + 0.5,", 
	                      "c * (gl_PointCoord.y - 0.5) - s * (gl_PointCoord.x - 0.5) + 0.5);",  
    	"vec4 rotatedTexture = texture2D( texture,  rotatedUV );",
	"gl_FragColor = gl_FragColor * rotatedTexture;",   
"}"
].join("\n");




// Particle class - in js we can define class like this 
function Particle(){
	this.position = new THREE.Vector3();
	this.velocity = new THREE.Vector3();
	this.acceleration = new THREE.Vector3();
	
	this.angle             = 0;
	this.angleVelocity     = 0; // degrees per second
	this.angleAcceleration = 0; // degrees per second, per second
	
	this.size = 16.0;
	
	this.color = new THREE.Color();
	this.opacity = 1.0;
	
	this.age = 0;
	this.alive = 0;
}

// to add function to class we can do the following
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
	
}

/////////////////////////////////////////////////////////////
////////////// Particles engine /////////////////////////////
/////////////////////////////////////////////////////////////

function ParticlesEngine(){	
	// used to calculate start position for particle
	this.positionBase   = new THREE.Vector3();
	this.positionSpread = new THREE.Vector3();
	
	// used to calculate start velocity for particle
	this.velocityBase       = new THREE.Vector3();
	this.velocitySpread     = new THREE.Vector3(); 
	
	// used to calculate start acc for particle
	this.accelerationBase   = new THREE.Vector3();
	this.accelerationSpread = new THREE.Vector3();	
	
	// analogously as above
	this.angleBase = 0;
	this.angleSpread = 0;
	this.angleVelocityBase = 0;
	this.angleVelocitySpread = 0;
	this.angleAccelerationBase = 0;
	this.angleAccelerationSpread = 0;
	
	// analogously as above
	this.sizeBase = 0.0;
	this.sizeSpread = 0.0;
	
	// this.sizeTween = new Tween();
			
	// store colors in HSL format in a THREE.Vector3 object
	// http://en.wikipedia.org/wiki/HSL_and_HSV
	// analogously as above
	this.colorBase = new THREE.Vector3(0.0, 1.0, 0.5); 
	this.colorSpread = new THREE.Vector3(0.0, 0.0, 0.0);
	// this.colorTween = new Tween();
	
	// analogously as above
	this.opacityBase = 1.0;
	this.opacitySpread = 0.0;
	// this.opacityTween = new Tween();

	this.blendStyle = THREE.NormalBlending; // false;

	this.particleArray = [];
	this.particlesPerSecond = 100;
	this.particleDeathAge = 1.0;
	
	////////////////////////
	// EMITTER PROPERTIES //
	////////////////////////
	
	this.emitterAge = 0.0;
	this.emitterAlive = true;
	this.emitterDeathAge = 60; // time (seconds) at which to stop creating particles.
	
	// How many particles could be active at any time?
	this.particleCount = this.particlesPerSecond * Math.min( this.particleDeathAge, this.emitterDeathAge );

	//////////////
	// THREE.JS //
	//////////////
	
	this.particleGeometry = new THREE.Geometry();
	this.particleTexture  = null;
	this.particleMaterial = new THREE.ShaderMaterial( 
	{
		uniforms: 
		{
			texture:   { type: "t", value: this.particleTexture },
		},
		attributes:     
		{
			visible:	{ type: 'f',  value: [] },
			angle:	{ type: 'f',  value: [] },
			size:		{ type: 'f',  value: [] },
			color:	{ type: 'c',  value: [] },
			opacity:	{ type: 'f',  value: [] }
		},
		vertexShader:   particleVertexShader,
		fragmentShader: particleFragmentShader,
		transparent: true, // alphaTest: 0.5,  // if having transparency issues, try including: alphaTest: 0.5, 
		blending: THREE.NormalBlending, depthTest: true,
		
	});
	this.particleMesh = new THREE.Mesh();
}

ParticlesEngine.prototype.setValues = function( parameters ) {
	if(parameters === undefined) 
		return;
	
	// clear any previous tweens that might exist
	//this.sizeTween    = new Tween();
	//this.colorTween   = new Tween();
	//this.opacityTween = new Tween();
	
	for(var key in parameters) 
		this[key] = parameters[key];
	
	// attach tweens to particles
	//Particle.prototype.sizeTween    = this.sizeTween;
	//Particle.prototype.colorTween   = this.colorTween;
	//Particle.prototype.opacityTween = this.opacityTween;	
	
	// calculate/set derived particle engine values
	this.particleArray = [];
	this.emitterAge = 0.0;
	this.emitterAlive = true;
	this.particleCount = this.particlesPerSecond * Math.min(this.particleDeathAge, this.emitterDeathAge);
	
	this.particleGeometry = new THREE.Geometry();
	this.particleMaterial = new THREE.ShaderMaterial( 
	{
		uniforms: 
		{
			texture:   { type: "t", value: this.particleTexture },
		},
		attributes:     
		{
			visible:	{ type: 'f',  value: [] },
			angle:	{ type: 'f',  value: [] },
			size:		{ type: 'f',  value: [] },
			color:	{ type: 'c',  value: [] },
			opacity:	{ type: 'f',  value: [] }
		},
		vertexShader:   particleVertexShader,
		fragmentShader: particleFragmentShader,
		transparent: true,  alphaTest: 0.5, // if having transparency issues, try including: alphaTest: 0.5, 
		blending: THREE.NormalBlending, depthTest: true
	});
	this.particleMesh = new THREE.ParticleSystem();
}


ParticlesEngine.prototype.destroy = function()
{
    scene.remove( this.particleMesh );
}

ParticlesEngine.prototype.randomVector3 = function(base, spread){
	// Math.random() returns a random number between 0 (inclusive) and 1 (exclusive)
	var rand3 = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
	var translationVector = new THREE.Vector3().multiplyVectors(spread, rand3);
	return new THREE.Vector3().addVectors(base, translationVector);
}

ParticlesEngine.prototype.randomValue = function(base, spread){
	return base + spread * (Math.random() - 0.5);
}

ParticlesEngine.prototype.createParticle = function() {
	var particle = new Particle();

	// set start position for particle
	particle.position = this.randomVector3(this.positionBase, this.positionSpread); 

	// set start velocity for particle
	particle.velocity = this.randomVector3(this.velocityBase, this.velocitySpread); 

	// set acceleration for particle
	particle.acceleration = this.randomVector3(this.accelerationBase, this.accelerationSpread); 

	particle.angle = this.randomValue(this.angleBase, this.angleSpread);
	particle.angleVelocity = this.randomValue(this.angleVelocityBase, this.angleVelocitySpread );
	particle.angleAcceleration = this.randomValue(this.angleAccelerationBase, this.angleAccelerationSpread);

	particle.size = this.randomValue(this.sizeBase, this.sizeSpread);

	var color = this.randomVector3(this.colorBase, this.colorSpread);
	particle.color = new THREE.Color().setHSL(color.x, color.y, color.z);
	
	particle.opacity = this.randomValue(this.opacityBase, this.opacitySpread);

	particle.age   = 0;
	particle.alive = 0; // particles initialize as inactive
	
	return particle;
}

ParticlesEngine.prototype.initialize = function() {
	// link particle data with geometry/material data
	for (var i = 0; i < this.particleCount; i++){
		this.particleArray[i] = this.createParticle();
		this.particleGeometry.vertices[i] = this.particleArray[i].position;
		this.particleMaterial.attributes.visible.value[i] = this.particleArray[i].alive;
		this.particleMaterial.attributes.color.value[i] = this.particleArray[i].color;
		this.particleMaterial.attributes.opacity.value[i] = this.particleArray[i].opacity;
		this.particleMaterial.attributes.size.value[i] = this.particleArray[i].size;
		this.particleMaterial.attributes.angle.value[i] = this.particleArray[i].angle;
	}
	
	this.particleMaterial.blending = this.blendStyle;
	if (this.blendStyle != THREE.NormalBlending) 
		this.particleMaterial.depthTest = false;
	
	this.particleMesh = new THREE.ParticleSystem(this.particleGeometry, this.particleMaterial);
	this.particleMesh.dynamic = true;
	this.particleMesh.sortParticles = true;
	scene.add(this.particleMesh);
}

ParticlesEngine.prototype.update = function(dt) {
	var recycleIndices = [];
	
	// update particle data
	for(var i = 0; i < this.particleCount; i++){
		if(this.particleArray[i].alive){
			this.particleArray[i].update(dt);

			// check if particle should expire
			if(this.particleArray[i].age > this.particleDeathAge){
				this.particleArray[i].alive = 0.0;
				recycleIndices.push(i);
			}
			
			// update particle properties in shader
			this.particleMaterial.attributes.visible.value[i] = this.particleArray[i].alive;
			this.particleMaterial.attributes.color.value[i] = this.particleArray[i].color;
			this.particleMaterial.attributes.opacity.value[i] = this.particleArray[i].opacity;
			this.particleMaterial.attributes.size.value[i] = this.particleArray[i].size;
			this.particleMaterial.attributes.angle.value[i] = this.particleArray[i].angle;
		}		
	}

	// check if particle emitter is still running
	if(!this.emitterAlive) 
		return;

	// if no particles have died yet, then there are still particles to activate
	if(this.emitterAge < this.particleDeathAge){
		// determine indices of particles to activate
		var startIndex = Math.round(this.particlesPerSecond * (this.emitterAge + 0));
		var endIndex = Math.round(this.particlesPerSecond * (this.emitterAge + dt));
		if(endIndex > this.particleCount) 
			endIndex = this.particleCount; 
			  
		for(var i = startIndex; i < endIndex; i++)
			this.particleArray[i].alive = 1.0;		
	}

	// if any particles have died while the emitter is still running, we imediately recycle them
	for(var j = 0; j < recycleIndices.length; j++){
		var i = recycleIndices[j];
		this.particleArray[i] = this.createParticle();
		this.particleArray[i].alive = 1.0; // activate right away
		this.particleGeometry.vertices[i] = this.particleArray[i].position;
	}

	// stop emitter?
	this.emitterAge += dt;
	if(this.emitterAge > this.emitterDeathAge)
		this.emitterAlive = false;
}