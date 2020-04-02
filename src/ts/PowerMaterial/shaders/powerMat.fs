
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

uniform float roughness;
uniform float metalness;

struct Geometry {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
};

struct Material {
	float specularRoughness;
	vec3 diffuseColor;
	vec3 specularColor;
};

struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};

struct IncidentLight {
	vec3 position;
	vec3 direction;
	vec3 color;
	bool visible;
};

$constants

//法線分布関数
float GGX( float nh, float a ) { 

	float a2 = a * a;
	float nh2 = nh * nh;
	float d = nh2 * ( a2 - 1.0 ) + 1.0;

	return a2 / ( PI * d * d );
	
}

//幾何減衰項
float SmithSchlickGGX( float NV, float NL, float a ) {

	float k = ( a ) / 2.0;

	float v = NV / ( NV * (  1.0 - k ) + k );
	float l = NL / ( NL * (  1.0 - k ) + k );

	return v * l;

}

//フレネル
vec3 Schlick( vec3 f0, float hv ) {

	return f0 + ( 1.0 - f0 ) * pow( 1.0 - hv, 5.0 );
	
}

vec3 specularBRDF( Geometry geo, Material mat, IncidentLight light, float NV, float NL ) {
	
	float a = mat.specularRoughness * mat.specularRoughness;
	vec3 H = normalize( geo.viewDir + light.direction );
	
	float NH = saturate( dot( geo.normal, H ) );
	float LH = saturate( dot( light.direction, H ) );
	float VH = saturate( dot( geo.viewDir, H ) );

	float D = GGX( NH, a );
	float G = SmithSchlickGGX( NV, NL, a );
	vec3 F = Schlick( mat.specularColor, VH );

	return ( D * G * F ) / ( 4.0 * NL * NV + 0.0001 );
	
}

vec3 diffuseBRDF( Material mat ) {

	return mat.diffuseColor / PI;

}

void RE_Direct( Geometry geo, Material mat, IncidentLight light, inout ReflectedLight ref ) {

	float NV = saturate( dot( geo.normal, geo.viewDir ) );
	float NL = saturate( dot( geo.normal, light.direction ) );

	vec3 irradiance = NL * light.color;
	irradiance *= PI;

	ref.directSpecular += irradiance * specularBRDF( geo, mat, light, NV, NL );
	ref.directDiffuse += irradiance * diffuseBRDF( mat );

}


float punctualLightIntensityToIrradianceFactor( float lightDistance, float cutoffDistance, float decayExponent) {

	if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {

		return pow( saturate( -lightDistance / cutoffDistance + 1.0 ), decayExponent );
		
	}
	
	return 1.0;
	
}


#if NUM_DIR_LIGHTS > 0

	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};

	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];

	IncidentLight directionalLightToIncidentLight( DirectionalLight dirLight ) {

		IncidentLight light;

		light.color = dirLight.color;
		light.direction = dirLight.direction;
		light.visible = true;
		
		return light;

	}

#endif

#if NUM_POINT_LIGHTS > 0

	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};

	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];

	IncidentLight pointLightToincidentLight( PointLight inputLight, Geometry geo ) {

		IncidentLight light;

		vec3 def = inputLight.position - geo.position;
		float distance = length( def );
		light.direction = normalize( def );

		light.color = inputLight.color;
		light.color *= punctualLightIntensityToIrradianceFactor( distance, inputLight.distance, inputLight.decay );
		light.visible = true;
		
		return light;
	
	}

#endif

void main( void ) {

	vec3 albedo = vec3( 1.0 );

	Geometry geo;
	geo.position = -vViewPosition;
	geo.normal = normalize( vNormal );
	geo.viewDir = normalize( vViewPosition );

	Material mat;
	mat.diffuseColor = mix( albedo, vec3( 0.0 ), metalness );
	mat.specularColor = mix( vec3( 0.04 ), albedo, metalness );
	mat.specularRoughness = roughness;

	ReflectedLight ref;

	#if NUM_DIR_LIGHTS > 0

		for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

			DirectionalLight dirLight = directionalLights[ i ];
			IncidentLight light = directionalLightToIncidentLight( dirLight );
			RE_Direct( geo, mat, light, ref );

		}
	
	#endif

	#if NUM_POINT_LIGHTS > 0

		for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {

			PointLight pointLight = pointLights[ i ];
			IncidentLight light = pointLightToincidentLight( pointLight, geo );
			RE_Direct( geo, mat, light, ref );

		}

	#endif

	vec3 outColor = ref.directSpecular + ref.directDiffuse + ref.indirectSpecular + ref.indirectDiffuse;

	gl_FragColor = vec4( vec3( outColor ), 1.0 );

}