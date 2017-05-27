function Clouds() {
		this.positionBase = new THREE.Vector3( -100, 200,  0 );
		this.positionSpread = new THREE.Vector3(    0,  0, 200 );
		
		this.velocityBase   = new THREE.Vector3( 40, 0, 0);
		this.velocitySpread = new THREE.Vector3( 0, 0, 0 ); 
		
		this.particleTexture = THREE.ImageUtils.loadTexture('images/smokeparticle.png');

		this.sizeBase = 80.0;
		this.sizeSpread = 100.0;
		this.colorBase    = new THREE.Vector3(0.0, 0.0, 1.0); // H,S,L
		this.colorModifier = new Modifier([2, 4, 6, 8, 10], [new THREE.Vector3(0.0, 0.0, 0.7), new THREE.Vector3(0.0,0.0,0.6), new THREE.Vector3(0.0,0.0,0.5), new THREE.Vector3(0.0, 0.0, 0.4), new THREE.Vector3(0.0, 0.0, 0.3)] );
		this.opacityBase = 0.6;
		this.opacityModifier = new Modifier([0,2,8,10],[0,1,1,0]);

		this.particlesPerSecond = 100;
		this.particleDeathAge   = 10.0;	
		this.emitterDeathAge    = 99999;
}

function Rain(){
		this.positionBase = new THREE.Vector3( 0, 200, 0 );
		this.positionSpread = new THREE.Vector3( 200, 0, 200 );

		this.velocityBase = new THREE.Vector3( 0, -400, 0 );
		this.velocitySpread = new THREE.Vector3( 10, 50, 10 );
		this.accelerationBase = new THREE.Vector3( 0, -10,0 );
		
		this.particleTexture = THREE.ImageUtils.loadTexture( 'images/raindrop2flip.png' );

		this.sizeBase = 8.0;
		this.sizeSpread = 4.0;
		// sizeModifier    : new Modifier( [0, 0.25], [1, 80] ),
		this.colorBase = new THREE.Vector3(0.66, 1.0, 0.7); // H,S,L
		this.colorSpread = new THREE.Vector3(0.00, 0.0, 0.2);
		//colorModifier: new Modifier([0, 1, 4, 5], [new THREE.Vector3(0.66, 1.0, 0.7), new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(0.66, 1.0, 0.7)]),
		this.opacityBase = 0.6;

		this.particlesPerSecond = 50;
		this.particleDeathAge = 3.0;		
		this.emitterDeathAge = 999999;
		
		this.wind = new THREE.Vector3(0, 0, 0);
	}
	
