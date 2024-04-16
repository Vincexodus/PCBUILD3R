import { ElementRef, Injectable, NgZone, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
@Injectable({ providedIn: 'root' })
export class EngineService implements OnDestroy {
  private frameId: number = 0;
  private canvas!: HTMLCanvasElement;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private controls!: OrbitControls;

  private light!: THREE.AmbientLight;
  private directionalLight!: THREE.DirectionalLight;

  private introModel: any;
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
    {
      case: {
        path: 'nzxt',
        position: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        rotation: { x: this.degToRad(270), y: 0, z: this.degToRad(270) },
      },
      caseFan: {
        path: 'white',
        position: { x: -4, y: 4, z: 1 },
        scale: { x: 0.2, y: 0.2, z: 0.2 },
        rotation: { x: 0, y: 0, z: this.degToRad(90) },
      },
      cpu: {
        path: 'intel-i5',
        position: { x: 5, y: 0, z: 0 },
        scale: { x: 0.005, y: 0.005, z: 0.005 },
        rotation: { x: 0, y: 0, z: 0 },
      },
      cpuFan: {
        path: 'noname',
        position: { x: 5, y: 2, z: 1 },
        scale: { x: 0.15, y: 0.15, z: 0.15 },
        rotation: { x: 0, y: 0, z: 0 },
      },
      motherboard: {
        path: 'asus_prime_h510m',
        position: { x: -5, y: 1, z: 0 },
        scale: { x: 0.6, y: 0.6, z: 0.6 },
        rotation: { x: 0, y: 0, z: 0 },
      },
      gpu: {
        path: '',
        position: { x: -5, y: -2, z: 0 },
        scale: { x: 0.6, y: 0.6, z: 0.6 },
        rotation: { x: 0, y: 0, z: 0 },
      },
      psu: {
        path: 'low-poly',
        position: { x: -5, y: -2, z: 1 },
        scale: { x: 0.6, y: 0.6, z: 0.6 },
        rotation: { x: this.degToRad(90), y: 0, z: this.degToRad(270) },
      },
      memory: {
        path: 'kingston_hyperx_fury',
        position: { x: 4, y: 0, z: 0 },
        scale: { x: 0.5, y: 0.5, z: 0.5 },
        rotation: { x: 0, y: 0, z: 0 },
      },
      storage: {
        path: 'ssd_m.2_256gb',
        position: { x: 4, y: 4, z: 0 },
        scale: { x: 0.1, y: 0.1, z: 0.1 },
        rotation: { x: 0, y: 0, z: this.degToRad(180) },
      },
    },
    // workstation PC
    {
      case: {
        path: 'fractal',
        position: { x: 0, y: 0, z: 2 },
        scale: { x: 0.1, y: 0.1, z: 0.1 },
        rotation: { x: this.degToRad(270), y: 0, z: 0 },
      },
      caseFan: {
        path: 'corsair',
        position: { x: -7, y: 6, z: 2 },
        scale: { x: 15, y: 15, z: 15 },
        rotation: { x: 0, y: 0, z: this.degToRad(90) },
      },
      cpu: {
        path: 'ryzen7',
        position: { x: 8, y: 1, z: 0 },
        scale: { x: 0.1, y: 0.1, z: 0.1 },
        rotation: { x: 0, y: 0, z: this.degToRad(180) },
      },
      cpuFan: {
        path: 'cooler_master',
        position: { x: 7, y: 6, z: 4 },
        scale: { x: 1, y: 1, z: 1 },
        rotation: { x: 0, y: 0, z: this.degToRad(90) },
      },
      motherboard: {
        path: 'ardor_gaming_b550m',
        position: { x: -9, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        rotation: { x: 0, y: 0, z: 0},
      },
      gpu: {
        path: 'rtx_3060_ti_eagle',
        position: { x: 7, y: -4, z: 0 },
        scale: { x: 1.25, y: 1.25, z: 1.25 },
        rotation: { x: 0, y: 0, z: this.degToRad(270) },
      },
      psu: {
        path: 'psu',
        position: { x: -9, y: -6, z: 2 },
        scale: { x: 0.04, y: 0.04, z: 0.04 },
        rotation: { x: this.degToRad(270), y: 0, z: this.degToRad(90) },
      },
      memory: {
        path: 'corsair_dominator_rgb',
        position: { x: 6, y: 1, z: 1 },
        scale: { x: 1, y: 1, z: 1 },
        rotation: { x: 0, y: 0, z: 0 },
      },
      storage: {
        path: 'ssd_m.2_256gb',
        position: { x: 8, y: 0, z: 0 },
        scale: { x: 0.3, y: 0.3, z: 0.3 },
        rotation: { x: 0, y: 0, z: this.degToRad(180) },
      },
    },
    // gaming PC
    {
      case: {
        path: 'gaming',
        position: { x: 0, y: -2, z: 0 },
        scale: { x: 1.2, y: 1.2, z: 1.2 },
        rotation: { x: this.degToRad(270), y: 0, z: this.degToRad(90) },
      },
      caseFan: {
        path: 'spectrum_argb',
        position: { x: -5, y: 5, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        rotation: { x: 0, y: 0, z: 0 },
      },
      cpu: {
        path: 'ryzen9',
        position: { x: 7, y: 1, z: 0 },
        scale: { x: 0.25, y: 0.25, z: 0.25 },
        rotation: { x: 0, y: 0, z: 0 },
      },
      cpuFan: {
        path: 'hyper_212_spectrum',
        position: { x: 5, y: 4, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        rotation: { x: 0, y: 0, z: 0 },
      },
      motherboard: {
      path: 'asus-rog',
        position: { x: -9, y: 2, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        rotation: { x: this.degToRad(90), y: 0, z: 0 },
      },
      gpu: {
        path: 'rx_6700_xt',
        position: { x: -7, y: 0, z: 0 },
        scale: { x: 0.95, y: 1, z: 1 },
        rotation: { x: this.degToRad(90), y: 0, z: 0 },
      },
      psu: {
        path: 'psu',
        position: { x: -4, y: -2, z: 0 },
        scale: { x: 0.02, y: 0.02, z: 0.02 },
        rotation: { x: this.degToRad(270), y: 0, z: this.degToRad(90) },
      },
      memory: {
        path: 'g_skill_trident_z_neo',
        position: { x: 5, y: 0, z: 0 },
        scale: { x: 0.8, y: 0.8, z: 0.8 },
        rotation: { x: this.degToRad(90), y: this.degToRad(90), z: this.degToRad(180) },
      },
      storage: {
        path: 'ssd_m.2_256gb',
        position: { x: 7, y: 0, z: 0 },
        scale: { x: 0.2, y: 0.2, z: 0.2 },
        rotation: { x: 0, y: 0, z: this.degToRad(180) },
      },
    },
  ];

  public constructor(private ngZone: NgZone) {}

  public ngOnDestroy(): void {
    if (this.frameId != 0) {
      cancelAnimationFrame(this.frameId);
    }
    if (this.renderer != null) {
      this.renderer.dispose();
    }
  }

  public modelInit(level: number): void {
    const pathItem = this.modelAssets[level - 1];
    if (pathItem) {
      this.loadGLTFModel(
        this.caseModel,
        'case/' + pathItem.case.path,
        pathItem.case.position,
        pathItem.case.scale,
        pathItem.case.rotation
      );
      this.loadGLTFModel(
        this.caseFanModel,
        'case-fan/' + pathItem.caseFan.path,
        pathItem.caseFan.position,
        pathItem.caseFan.scale,
        pathItem.caseFan.rotation
      );
      this.loadGLTFModel(
        this.cpuModel,
        'cpu/' + pathItem.cpu.path,
        pathItem.cpu.position,
        pathItem.cpu.scale,
        pathItem.cpu.rotation
      );
      this.loadGLTFModel(
        this.cpuFanModel,
        'cpu-fan/' + pathItem.cpuFan.path,
        pathItem.cpuFan.position,
        pathItem.cpuFan.scale,
        pathItem.cpuFan.rotation
      );
      this.loadGLTFModel(
        this.motherboardModel,
        'mobo/' + pathItem.motherboard.path,
        pathItem.motherboard.position,
        pathItem.motherboard.scale,
        pathItem.motherboard.rotation
      );
      if (level !== 1)
        this.loadGLTFModel(
          this.gpuModel,
          'gpu/' + pathItem.gpu.path,
          pathItem.gpu.position,
          pathItem.gpu.scale,
          pathItem.gpu.rotation
        );
      this.loadGLTFModel(
        this.psuModel,
        'psu/' + pathItem.psu.path,
        pathItem.psu.position,
        pathItem.psu.scale,
        pathItem.psu.rotation
      );
      this.loadGLTFModel(
        this.memoryModel,
        'ram/' + pathItem.memory.path,
        pathItem.memory.position,
        pathItem.memory.scale,
        pathItem.memory.rotation
      );
      this.loadGLTFModel(
        this.storageModel,
        'storage/' + pathItem.storage.path,
        pathItem.storage.position,
        pathItem.storage.scale,
        pathItem.storage.rotation
      );
    }
  }

  public loadGLTFModel(assignedModel: any, modelPath: string, modelPosition: any, modelScale: any, modelRotation: any): void {
    const modelLoader = new GLTFLoader();
    modelLoader.load(
      '../assets/models/' + modelPath + '/scene.gltf',
      (gltf) => {
        assignedModel = gltf.scene.children[0];

        var box = new THREE.Box3().setFromObject(assignedModel);
        box.getCenter(assignedModel.position);
        assignedModel.position.multiplyScalar(-1);

        assignedModel.position.set(modelPosition.x, modelPosition.y, modelPosition.z);
        assignedModel.scale.set(modelScale.x, modelScale.y, modelScale.z);
        assignedModel.rotation.set(modelRotation.x, modelRotation.y, modelRotation.z);
        this.scene.add(assignedModel);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
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
      alpha: true, // transparent background
      antialias: true, // smooth edges
    });
    this.renderer.setSize(640, 360);

    // create the scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(255, 255, 255);

    // create camera
    this.camera = new THREE.PerspectiveCamera(
      100,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // load 3d model
    const modelLoader = new GLTFLoader();
    modelLoader.load(
      '../assets/models/parts/scene.gltf',
      (gltf) => {
        const model = gltf.scene;
        this.introModel = model.children[0];
        this.scene.add(model);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.error('Error loading GLTF model:', error);
      }
    );

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
      alpha: true, // transparent background
      antialias: true, // smooth edges
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // create the scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x666666);

    // create camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 7.5;
    this.scene.add(this.camera);

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;

    this.modelInit(3); //temp

    this.light = new THREE.AmbientLight(0x404040, 50);
    this.light.position.z = 10;
    this.scene.add(this.light);

    this.directionalLight = new THREE.DirectionalLight(0xffdf04, 1);
    this.directionalLight.position.set(3, 3, 0);
    this.directionalLight.castShadow = true;
    this.scene.add(this.directionalLight);

    this.render(false);
  }

  public render(animate: boolean): void {
    this.frameId = requestAnimationFrame(() => {
      this.render(animate);
      if (this.introModel && animate) {
        this.introModel.rotation.z += 0.001;
      } else if (this.introModel && !animate) {
        this.introModel.rotation.z = 0;
      }
    });
    this.controls.update();
    // window.addEventListener("mousemove", this.onMouseMove, false);
    this.renderer.render(this.scene, this.camera);
  }

  public resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  // public onMouseMove(event: MouseEvent) {
  //   this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  //   this.mouse.y = (event.clientY / window.innerWidth) * 2 + 1;

  //   this.raycaster.setFromCamera(this.mouse, this.camera);

  //   const intersects = this.raycaster.intersectObjects(this.scene.children, true);

  //   for (const intersect of intersects) {
  //     intersect.object.position.z  += 0.1;
  //   }
  // }

  public degToRad(degree: number): number {
    return degree * Math.PI / 180;
  }
}
