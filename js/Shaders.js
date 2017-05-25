/*************************************/
/************* SHADERS ***************/
/*************************************/


/*************************************/
/******** VERTEX SHADER **************/
/*************************************/
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


/*************************************/
/******** FRAGMENT SHADER ************/
/*************************************/
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