import * as ORE from 'ore-three-ts';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PowerMaterial } from './PowerMaterial';

export class MainScene extends ORE.BaseScene {

	private controls: OrbitControls;

	private renderer: THREE.WebGLRenderer;
	private powerMatMesh: THREE.Mesh;
	private standardMatMesh: THREE.Mesh;

	private moveLight: THREE.Light;

	constructor() {

		super();

		this.name = "MainScene";

	}

	onBind( gProps: ORE.GlobalProperties ) {

		super.onBind( gProps );

		this.renderer = this.gProps.renderer;

		this.camera.position.set( 0, 1.5, 3 );
		this.camera.lookAt( 0, 0, 0 );

		this.controls = new OrbitControls( this.camera, this.renderer.domElement );

		// let geo = new THREE.BoxGeometry( 1, 1, 1 );
		let geo = new THREE.SphereBufferGeometry( 0.7, 20, 19 );

		this.powerMatMesh = new THREE.Mesh( geo, new PowerMaterial( {
			roughness: 0.5,
			metalness: 0.0,
		} ) );

		this.powerMatMesh.position.set( - 1, 0, 0 );
		this.scene.add( this.powerMatMesh );

		this.standardMatMesh = new THREE.Mesh( geo, new THREE.MeshStandardMaterial( {
			roughness: 0.5,
			metalness: 0.0,
		} ) );

		this.standardMatMesh.position.set( 1, 0, 0 );
		this.scene.add( this.standardMatMesh );

		let light: THREE.Light;
		light = new THREE.DirectionalLight();
		light.position.set( - 1, 0.5, 0 );
		light.intensity = 0.4;
		this.scene.add( light );

		light = new THREE.DirectionalLight();
		light.position.set( 1, 0.5, 0 );
		this.scene.add( light );

		this.moveLight = new THREE.PointLight();
		this.moveLight.color = new THREE.Color( 0.2, 0.4, 1.0 );
		this.moveLight.intensity = 0.5;
		this.scene.add( this.moveLight );

		let helper = new THREE.PointLightHelper( this.moveLight as THREE.PointLight, 0.1 );
		this.scene.add( helper );


	}

	public animate( deltaTime: number ) {

		this.controls.update();

		let r = 1.3;
		this.moveLight.position.set( Math.sin( this.time * 1.0 ) * r * 2.0, Math.cos( this.time * 2.0 ) * r, Math.sin( this.time * 1.5 ) * r );

		this.powerMatMesh.rotateY( 0.01 );
		this.standardMatMesh.rotateY( 0.01 );

		this.renderer.render( this.scene, this.camera );

	}

	public onResize( args: ORE.ResizeArgs ) {

		super.onResize( args );

	}

}
