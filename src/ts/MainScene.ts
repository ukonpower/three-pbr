import * as ORE from 'ore-three-ts';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PowerMaterial } from './PowerMaterial';
import TweakPane from 'tweakpane';

export class MainScene extends ORE.BaseScene {

	private controls: OrbitControls;
	private params: any;
	private pane: TweakPane;

	private renderer: THREE.WebGLRenderer;

	private powerMat: PowerMaterial;
	private powerMatMesh: THREE.Mesh;

	private standardMat: THREE.MeshStandardMaterial;
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

		this.params = {
			roughness: 0.0,
			metalness: 0.0,
			color: '#FFF',
		};

		this.pane = new TweakPane();
		this.pane.addInput( this.params, 'roughness', { min: 0.0, max: 1.0 } );
		this.pane.addInput( this.params, 'metalness', { min: 0.0, max: 1.0 } );
		this.pane.addInput( this.params, 'color' );

		this.initScene();

	}

	private initScene() {

		let light: THREE.Light;
		// light = new THREE.AmbientLight();
		// this.scene.add( light );

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

		let geo = new THREE.SphereBufferGeometry( 0.7, 50, 39 );

		this.standardMat = new THREE.MeshStandardMaterial( {
			roughness: 0.2,
			metalness: 1.0,
		} );

		this.standardMatMesh = new THREE.Mesh( geo, this.standardMat );
		this.standardMatMesh.position.set( 1, 0, 0 );
		this.scene.add( this.standardMatMesh );

		/*------------------------
			Create PowerMaterial
		------------------------*/

		let uni = {
			envMap: {
				value: null
			}
		};

		this.powerMat = new PowerMaterial( {
			roughness: 0.2,
			metalness: 1.0,
			uniforms: uni,
			useEnvMap: true
		} );

		this.powerMatMesh = new THREE.Mesh( geo, this.powerMat );

		this.powerMatMesh.position.set( - 1, 0, 0 );
		this.scene.add( this.powerMatMesh );

		this.loadTex();

	}

	private loadTex() {

		let loader = new THREE.CubeTextureLoader();
		loader.load( [
			'./assets/cube/Bridge2/posx.jpg',
			'./assets/cube/Bridge2/negx.jpg',
			'./assets/cube/Bridge2/posy.jpg',
			'./assets/cube/Bridge2/negy.jpg',
			'./assets/cube/Bridge2/posz.jpg',
			'./assets/cube/Bridge2/negz.jpg',
		], ( tex ) => {

			this.scene.background = tex;

			this.powerMat.envMap = tex;
			this.powerMat.needsUpdate = true;

			this.standardMat.envMap = tex;
			this.standardMat.needsUpdate = true;

		} );

	}

	public animate( deltaTime: number ) {

		this.controls.update();

		let r = 1.3;
		this.moveLight.position.set( Math.sin( this.time * 1.0 ) * r * 2.0, Math.cos( this.time * 2.0 ) * r, Math.sin( this.time * 1.5 ) * r );

		this.powerMatMesh.rotateY( 0.01 );
		this.standardMatMesh.rotateY( 0.01 );

		this.powerMat.roughness = this.params.roughness;
		this.powerMat.metalness = this.params.metalness;

		this.standardMat.roughness = this.params.roughness;
		this.standardMat.metalness = this.params.metalness;

		this.renderer.render( this.scene, this.camera );

	}

	public onResize( args: ORE.ResizeArgs ) {

		super.onResize( args );

	}

}
