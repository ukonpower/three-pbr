varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main( void ) {

	vec3 pos = position;

	vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
	gl_Position = projectionMatrix * mvPosition;

	vUv = uv;
	vNormal = normalMatrix * normal;
	vViewPosition = -mvPosition.xyz;

}