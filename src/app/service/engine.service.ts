import {ElementRef, Injectable, NgZone, OnDestroy} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

@Injectable({providedIn: 'root'})
export class EngineService implements OnDestroy {
  private frameId: number = 0;
  private canvas!: HTMLCanvasElement;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private controls!: OrbitControls;

  private light!: THREE.AmbientLight;
  private directionalLight!: THREE.DirectionalLight;

  private model: any;
  private caseModel: any;
  private caseFanModel: any;
  private motherboardModel: any;
  private cpuModel: any;
  private cpuFanModel: any;
  private memoryModel: any;
  private storageModel: any;
  private gpuModel: any;
  private psuModel: any;

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  modelAssets = [
    // budget PC
    { case: "gaming-pc-case", caseFan: "white", cpu: "inte-i5",
      cpuFan: "stock", motherboard: "asus_prime_h510m", gpu: "gtx_750_ti",
      psu: "basic", memory: "kingston_hyperx_fury", storage: "ssd_m.2_256gb"},
    // workstation PC
    { case: "nzxt", caseFan: "corsair", cpu: "ryzen7",
      cpuFan: "cooler_master", motherboard: "ardor_gaming_b550m", gpu: "rtx_3060_ti_eagle",
      psu: "basic", memory: "corsair_dominator_rgb", storage: "ssd_wd_sata"},
    // gaming PC
    { case: "nzxt", caseFan: "spectrum_argb", cpu: "ryzen9",
      cpuFan: "hyper_212_spectrum", motherboard: "mobo", gpu: "rtx_3080",
      psu: "basic", memory: "g_skill_trident_z_neo", storage: "ssd_wd_sata"},
  ]

  public constructor(private ngZone: NgZone) { }

  public ngOnDestroy(): void {
    if (this.frameId != 0) {
      cancelAnimationFrame(this.frameId);
    }
    if (this.renderer != null) {
      this.renderer.dispose();
    }
  }

  public modelInit(level: number): void {
    const fileName = '/scene.gltf'
    const pathItem = this.modelAssets[level-1];
    if (pathItem) {
      this.loadGLTFModel('case/'+ pathItem.case + fileName);
      this.loadGLTFModel('case-fan/'+ pathItem.caseFan + fileName);
      this.loadGLTFModel('cpu/'+ pathItem.cpu + fileName);
      this.loadGLTFModel('cpu-fan/'+ pathItem.cpuFan + fileName);
      this.loadGLTFModel('mobo/'+ pathItem.motherboard + fileName);
      this.loadGLTFModel('gpu/'+ pathItem.gpu + fileName);
      this.loadGLTFModel('psu/'+ pathItem.psu + fileName);
      this.loadGLTFModel('ram/'+ pathItem.memory + fileName);
      this.loadGLTFModel('storage/'+ pathItem.storage + fileName);
    }
  }

  public loadGLTFModel(modelPath: string): void {
    const modelLoader = new GLTFLoader();
    modelLoader.load('../assets/models/' + modelPath, (gltf) => {
        const model = gltf.scene;
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

  // intro card
  public createIntroScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // Get the reference of the canvas element
    this.canvas = canvas.nativeElement;

    // config webgl renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // transparent background
      antialias: true // smooth edges
    });
    this.renderer.setSize(640, 360);

    // create the scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(255, 255, 255);
    
    // create camera
    this.camera = new THREE.PerspectiveCamera(
      100, window.innerWidth / window.innerHeight, 0.1, 1000
    );

    this.loadGLTFModel('parts/scene.gltf');

    this.camera.position.copy(new THREE.Vector3(1, 10, 4));
    this.scene.add(this.camera);
    
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;

    this.light = new THREE.AmbientLight(0x404040, 50);
    this.light.position.z = 10;
    this.scene.add(this.light);
    
    this.directionalLight = new THREE.DirectionalLight(0xffdf04, 0.4);
    this.directionalLight.position.set(0, 0, 5);
    this.directionalLight.castShadow = true;
    this.scene.add(this.directionalLight);

    this.render(true);
  }

  // simulation
  public createScene(canvas: ElementRef<HTMLCanvasElement>, level: number): void {
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
    this.scene.background = new THREE.Color(0x666666);

    // create camera
    this.camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    this.camera.position.z = 10;
    this.scene.add(this.camera);
    
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;

    this.modelInit(1);

    this.light = new THREE.AmbientLight(0x404040, 50);
    this.light.position.z = 10;
    this.scene.add(this.light);
    
    this.directionalLight = new THREE.DirectionalLight(0xffdf04, 0.4);
    this.directionalLight.position.set(0, 0, 3);
    this.directionalLight.castShadow = true;
    this.scene.add(this.directionalLight);

    this.render(false);
  }

  // public animate(): void {
  //   this.ngZone.runOutsideAngular(() => {
  //     if (document.readyState !== 'loading') {
  //       this.render();
  //     } else {
  //       window.addEventListener('DOMContentLoaded', () => {
  //         this.render();
  //       });
  //     }

  //     window.addEventListener('resize', () => {
  //       this.resize();
  //     });
  //   });
  // }

  public render(animate: boolean): void {
    this.frameId = requestAnimationFrame(() => {
      this.render(animate);
      if (this.model && animate) {
        this.model.rotation.z += 0.001;
      } else if (this.model && !animate){
        this.model.rotation.z = 0;
      }
    });
    this.controls.update();
    window.addEventListener("mousemove", this.onMouseMove, false);
    this.renderer.render(this.scene, this.camera);
  }

  public resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  public onMouseMove(event: MouseEvent) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = (event.clientY / window.innerWidth) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    for (const intersect of intersects) {
      intersect.object.position.z  += 0.1;
    }
  }
}