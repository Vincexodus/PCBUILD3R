import {ElementRef, Injectable, NgZone, OnDestroy} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
@Injectable({providedIn: 'root'})
export class EngineService implements OnDestroy {
  private canvas!: HTMLCanvasElement;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private controls!: OrbitControls;

  private light!: THREE.AmbientLight;
  private light1!: THREE.PointLight;
  private light2!: THREE.PointLight;
  private light3!: THREE.PointLight;
  private light4!: THREE.PointLight;
  private directionalLight!: THREE.DirectionalLight;

  private model: any;
  private frameId: number = 0;

  public constructor(private ngZone: NgZone) {
  }

  public ngOnDestroy(): void {
    if (this.frameId != 0) {
      cancelAnimationFrame(this.frameId);
    }
    if (this.renderer != null) {
      this.renderer.dispose();
      // this.renderer = null;
      // this.canvas = null;
    }
  }

  private animateModel() {
    if (this.model) {
      this.model.rotation.z += 0.005;
    }
  }

  public loadGLTFModel(modelPath: string, texturePath: string): void {
    const modelLoader = new GLTFLoader();
    modelLoader.load('../assets/models/' + modelPath, (gltf) => {
        const model = gltf.scene;
        const texture = new THREE.TextureLoader().load('../assets/models' + texturePath);
        model.traverse((child) => {
          // if (child.isObject3D) {
          //   child.material.map = texture;
          // }
        })
        this.model = model.children[0];
        this.scene.add(model);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      (error) => {
        console.error('Error loading GLTF model:', error);
      }
    );
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // Get the reference of the canvas element
    this.canvas = canvas.nativeElement;

    // config webgl renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // transparent background
      antialias: true // smooth edges
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // create the scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xF0EEED);

    // create camera
    this.camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    this.camera.position.z = 3;
    this.scene.add(this.camera);
    
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;

    this.loadGLTFModel('gpu/scene.gltf', 'model/');

    this.light = new THREE.AmbientLight(0x404040, 50);
    this.light.position.z = 10;
    this.scene.add(this.light);
    
    this.directionalLight = new THREE.DirectionalLight(0xffdf04, 0.4);
    this.directionalLight.position.set(0, 0, 5);
    this.directionalLight.castShadow = true;
    this.scene.add(this.directionalLight);

    // this.light1 = new THREE.PointLight(0x4b371c, 10);
    // this.light1.position.set(0, 200, 400);
    // this.scene.add(this.light1);
    // this.light2 = new THREE.PointLight(0x4b371c, 10);
    // this.light2.position.set(500, 100, 0);
    // this.scene.add(this.light2);
    // this.light3 = new THREE.PointLight(0x4b371c, 10);
    // this.light3.position.set(0, 100, -500);
    // this.scene.add(this.light3);
    // this.light4 = new THREE.PointLight(0x4b371c, 10);
    // this.light4.position.set(-500, 300, 500);
    // this.scene.add(this.light4);
  }

  public animate(): void {
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }

      window.addEventListener('resize', () => {
        this.resize();
      });
    });
  }

  public render(): void {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });

    this.controls.update();
    this.animateModel();
    this.renderer.render(this.scene, this.camera);
  }

  public resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }
}