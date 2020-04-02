import * as ORE from 'ore-three-ts';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PowerMaterial } from './PowerMaterial';

export class MainScene extends ORE.BaseScene {

	private controls: OrbitControls;

	private renderer: THREE.WebGLRenderer;
	private powerMatMesh: THREE.Mesh;
	private standardMatMesh: THREE.Mesh;

	private light: THREE.Light;

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

		this.light = new THREE.DirectionalLight();
		this.light.position.set( 1, 0.5, 0 );
		this.scene.add( this.light );

		this.light = new THREE.DirectionalLight();
		this.light.intensity = 0.4;
		this.light.position.set( - 1, 0.5, 0 );
		this.scene.add( this.light );

	}

	public animate( deltaTime: number ) {

		this.controls.update();

		this.powerMatMesh.rotateY( 0.01 );
		this.standardMatMesh.rotateY( 0.01 );

		this.renderer.render( this.scene, this.camera );

	}

	public onResize( args: ORE.ResizeArgs ) {

		super.onResize( args );

	}

}
