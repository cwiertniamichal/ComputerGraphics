Examples =
{
	
	clouds :
	{
		positionBase   : new THREE.Vector3( -100, 100,  0 ),
		positionSpread : new THREE.Vector3(    0,  50, 60 ),
		
		velocityBase   : new THREE.Vector3( 40, 0, 0 ),
		velocitySpread : new THREE.Vector3( 20, 0, 0 ), 
		
		particleTexture : THREE.ImageUtils.loadTexture( 'images/smokeparticle.png'),

		sizeBase     : 80.0,
		sizeSpread   : 100.0,
		colorBase    : new THREE.Vector3(0.0, 0.0, 1.0), // H,S,L
		//opacityTween : new Tween([0,1,4,5],[0,1,1,0]),

		particlesPerSecond : 50,
		particleDeathAge   : 10.0,		
		emitterDeathAge    : 1
	},
	rain :
	{
		positionBase     : new THREE.Vector3( 0, 200, 0 ),
		positionSpread   : new THREE.Vector3( 600, 0, 600 ),

		velocityBase     : new THREE.Vector3( 0, -400, 0 ),
		velocitySpread   : new THREE.Vector3( 10, 50, 10 ), 
		accelerationBase : new THREE.Vector3( 0, -10,0 ),
		
		particleTexture : THREE.ImageUtils.loadTexture( 'images/raindrop2.png' ),

		sizeBase    : 8.0,
		sizeSpread  : 4.0,
		colorBase   : new THREE.Vector3(0.66, 1.0, 0.7), // H,S,L
		colorSpread : new THREE.Vector3(0.00, 0.0, 0.2),
		opacityBase : 0.6,

		particlesPerSecond : 10,
		particleDeathAge   : 1.0,		
		emitterDeathAge    : 1
	}
	
}