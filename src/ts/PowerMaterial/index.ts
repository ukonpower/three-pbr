import * as THREE from 'three';
import * as ORE from 'ore-three-ts';

import powerMatVert from './shaders/powerMat.vs';
import powerMatFrag from './shaders/powerMat.fs';

export declare interface PowerMaterialParams extends THREE.MaterialParameters {
	roughness?: number,
	metalness?: number,
	uniforms?: any;
	vertexShader?: string;
	transparent?: boolean;
	envMap?: THREE.CubeTexture;
}

export class PowerMaterial extends THREE.ShaderMaterial {

	constructor( param: PowerMaterialParams ) {

		param.uniforms = param.uniforms || {};

		param.uniforms = ORE.UniformsLib.CopyUniforms( param.uniforms, {
			roughness: {
				value: param.roughness != null ? param.roughness : 0.5
			},
			metalness: {
				value: param.metalness != null ? param.metalness : 0.5
			},
			ambientLightColor: {
				value: null
			},
			lightProbe: {
				value: null
			},
			directionalLights: {
				value: null
			},
			directionalLightShadows: {
				value: null
			},
			spotLights: {
				value: null
			},
			spotLightShadows: {
				value: null
			},
			rectAreaLights: {
				value: null
			},
			pointLights: {
				value: null
			},
			pointLightShadows: {
				value: null
			},
			hemisphereLights: {
				value: null
			},
			directionalShadowMap: {
				value: null
			},
			directionalShadowMatrix: {
				value: null
			},
			spotShadowMap: {
				value: null
			},
			spotShadowMatrix: {
				value: null
			},
			pointShadowMap: {
				value: null
			},
			pointShadowMatrix: {
				value: null
			}
		} );

		param.vertexShader = param.vertexShader || powerMatVert;

		super( {
			vertexShader: param.vertexShader,
			fragmentShader: powerMatFrag,
			uniforms: param.uniforms,
			lights: true,
		} );

	}

	public set roughness( value: number ) {

		this.uniforms.roughness.value = value;

	}

	public set metalness( value: number ) {

		this.uniforms.metalness.value = value;

	}

}
