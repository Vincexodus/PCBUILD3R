import { ElementRef, Injectable, OnDestroy } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { Subject } from 'rxjs';
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
  private assemblyModel: any;
  private isInspectMode: boolean = false;
  private clickMouse: any
  private moveMouse: any
  private raycaster: any
  private draggableModel: any;

  private snapPos: any;
  private initialPos: any;
  private eventListenersAdded: boolean = false;

  modelAssets = [
    // budget PC
    {
      case: {
        path: 'nzxt',
        position: { x: 0, y: -1, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        rotation: { x: this.degToRad(270), y: 0, z: this.degToRad(270) },
      },
      motherboard: {
        path: 'asus_prime_h510m',
        position: { x: -8, y: 1, z: -0.3 },
        snapPosition: { x: -0.8, y: 0.75 },
        scale: { x: 0.6, y: 0.6, z: 0.6 },
        rotation: { x: 0, y: 0, z: 0 },
      },
      caseFan: {
        path: 'white',
        position: { x: -4, y: 2, z: 1 },
        snapPosition: { x: -1.86, y: 1.34 },
        scale: { x: 0.3, y: 0.3, z: 0.3 },
        rotation: { x: 0, y: 0, z: this.degToRad(90) },
      },
      cpu: {
        path: 'intel-i5',
        position: { x: 5, y: -2, z: -0.3 },
        snapPosition: { x: -0.54, y: 1.1 },
        scale: { x: 0.0027, y: 0.0027, z: 0.0027 },
        rotation: { x: 0, y: 0, z: this.degToRad(180) },
      },
      memory1: {
        path: 'kingston_hyperx_fury',
        position: { x: 4.5, y: 0, z: 0 },
        snapPosition: { x: 0.09, y: 1.12 },
        scale: { x: 0.45, y: 0.45, z: 0.45 },
        rotation: { x: 0, y: 0, z: 0 },
      },
      memory2: {
        path: 'kingston_hyperx_fury',
        position: { x: 4.5, y: 0, z: 0 },
        snapPosition: { x: 0.214, y: 1.12 },
        scale: { x: 0.45, y: 0.45, z: 0.45 },
        rotation: { x: 0, y: 0, z: 0 },
      },
      storage: {
        path: 'ssd_samsung_980_pro_1tb',
        position: { x: 7, y: -2, z: -0.25 },
        snapPosition: { x: -1.062, y: 0.343 },
        scale: { x: 0.25, y: 0.25, z: 0.25 },
        rotation: { x: 0, y: 0, z: 0 },
      },
      cpuFan: {
        path: 'noname',
        position: { x: 5, y: 2, z: 1.35 },
        snapPosition: { x: 0.2, y: 1 },
        scale: { x: 0.2, y: 0.2, z: 0.2 },
        rotation: { x: 0, y: 0, z: 0 },
      },
      gpu: {
        path: '',
        position: { x: 0, y: 0, z: 0 },
        snapPosition: { x: 0, y: 0 },
        scale: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
      },
      psu: {
        path: 'low-poly',
        position: { x: -5, y: -2, z: 1.25 },
        snapPosition: { x: -1.59, y: -1.88 },
        scale: { x: 0.5, y: 0.5, z: 0.5 },
        rotation: { x: this.degToRad(90), y: 0, z: this.degToRad(270) },
      },
    },
    // workstation PC
    {
      case: {
        path: 'fractal',
        position: { x: 0, y: 0, z: -7 },
        scale: { x: 0.1, y: 0.1, z: 0.1 },
        rotation: { x: this.degToRad(270), y: 0, z: 0 },
      },
      motherboard: {
        path: 'ardor_gaming_b550m',
        position: { x: -12, y: 1, z: -9 },
        snapPosition: { x: -1.672, y: 1.973 },
        scale: { x: 0.8, y: 0.8, z: 0.8 },
        rotation: { x: 0, y: 0, z: 0},
      },
      caseFan: {
        path: 'corsair',
        position: { x: -9, y: 4, z: -6.5 },
        snapPosition: { x: -4.75, y: 1.2 },
        scale: { x: 15, y: 15, z: 15 },
        rotation: { x: 0, y: 0, z: this.degToRad(90) },
      },
      cpu: {
        path: 'ryzen7',
        position: { x: 12, y: 1, z: -8.8 },
        snapPosition: { x: -1.576, y: 2.59 },
        scale: { x: 0.1, y: 0.1, z: 0.1 },
        rotation: { x: 0, y: 0, z: this.degToRad(180) },
      },
      memory1: {
        path: 'corsair_dominator_rgb',
        position: { x: 7, y: 1, z: -7.75 },
        snapPosition: { x: 0.193, y: 2.773 },
        scale: { x: 0.75, y: 0.75, z: 0.75 },
        rotation: { x: 0, y: 0, z: 0 },
      },
      memory2: {
        path: 'corsair_dominator_rgb',
        position: { x: 8, y: 1, z: -7.75 },
        snapPosition: { x: 0.506, y: 2.773 },
        scale: { x: 0.75, y: 0.75, z: 0.75 },
        rotation: { x: 0, y: 0, z: 0 },
      },
      storage: {
        path: 'ssd_samsung_980_pro_1tb',
        position: { x: 12, y: -3, z: -9 },
        snapPosition: { x: -2.025, y: 0.191 },
        scale: { x: 0.5, y: 0.5, z: 0.5 },
        rotation: { x: 0, y: 0, z: 0 },
      },
      cpuFan: {
        path: 'cooler_master',
        position: { x: 9, y: 6, z: -4.8 },
        snapPosition: { x: -0.864, y: 3.116 },
        scale: { x: 1, y: 1, z: 1 },
        rotation: { x: 0, y: 0, z: this.degToRad(270) },
      },
      gpu: {
        path: 'rtx_3060_ti_eagle',
        position: { x: 8, y: -4, z: -8.8 },
        snapPosition: { x: -2.764, y: 0 },
        scale: { x: 1.25, y: 1.25, z: 1.25 },
        rotation: { x: 0, y: 0, z: this.degToRad(270) },
      },
      psu: {
        path: 'psu',
        position: { x: -10, y: -6, z: -7 },
        snapPosition: { x: -2.9, y: -4 },
        scale: { x: 0.035, y: 0.035, z: 0.035 },
        rotation: { x: this.degToRad(270), y: 0, z: this.degToRad(90) },
      },
    },
    // gaming PC
    {
      case: {
        path: 'gaming',
        position: { x: 0, y: -2, z: -2 },
        scale: { x: 1.2, y: 1.2, z: 1.2 },
        rotation: { x: this.degToRad(270), y: 0, z: this.degToRad(90) },
      },
      motherboard: {
        path: 'asus-rog',
          position: { x: -9, y: 2, z: -3 },
          snapPosition: { x: -1.3, y: 0.522 },
          scale: { x: 0.9, y: 0.9, z: 0.9 },
          rotation: { x: this.degToRad(90), y: 0, z: 0 },
      },
      caseFan: {
        path: 'spectrum_argb',
        position: { x: -5, y: 4, z: -1.75 },
        snapPosition: { x: -2.34, y: 2.733 },
        scale: { x: 0.8, y: 0.8, z: 0.8 },
        rotation: { x: 0, y: 0, z: 0 },
      },
      cpu: {
        path: 'ryzen9',
        position: { x: 7, y: 1, z: -3 },
        snapPosition: { x: -0.28, y: 2.48 },
        scale: { x: 0.1, y: 0.1, z: 0.1 },
        rotation: { x: 0, y: 0, z: 0 },
      },
      memory1: {
        path: 'g_skill_trident_z_neo',
        position: { x: 5, y: 1, z: -2.8 },
        snapPosition: { x: 0.546, y: 2.5 },
        scale: { x: 0.4, y: 0.4, z: 0.4 },
        rotation: { x: this.degToRad(270), y: this.degToRad(90), z: this.degToRad(180) },
      },
      memory2: {
        path: 'g_skill_trident_z_neo',
        position: { x: 5.5, y: 1, z: -2.8 },
        snapPosition: { x: 0.746, y: 2.5 },
        scale: { x: 0.4, y: 0.4, z: 0.4 },
        rotation: { x: this.degToRad(270), y: this.degToRad(90), z: this.degToRad(180) },
      },
      storage: {
        path: 'ssd_samsung_980_pro_1tb',
        position: { x: 7, y: -2, z: -2.9 },
        snapPosition: { x: -0.811, y: 1 },
        scale: { x: 0.25, y: 0.25, z: 0.25 },
        rotation: { x: 0, y: 0, z: 0 },
      },
      cpuFan: {
        path: 'hyper_212_spectrum',
        position: { x: 5, y: 4, z: -2 },
        snapPosition: { x: -0.054, y: 2.45 },
        scale: { x: 0.8, y: 0.8, z: 0.8 },
        rotation: { x: 0, y: 0, z: 0 },
      },
      gpu: {
        path: 'rtx_3080',
        position: { x: -7, y: 0, z: -2.2 },
        snapPosition: { x: -0.45, y: 1.4 },
        scale: { x: 1.5, y: 1.5, z: 1.5 },
        rotation: { x: this.degToRad(180), y: 0, z: this.degToRad(270) },
      },
      psu: {
        path: 'psu',
        position: { x: -4, y: -2, z: -2 },
        snapPosition: { x: -1.15, y: -1.136 },
        scale: { x: 0.02, y: 0.02, z: 0.02 },
        rotation: { x: this.degToRad(270), y: 0, z: this.degToRad(90) },
      },
    },
  ];

  constructor(private toast: NgToastService) {}

  private SnapSuccessSubject = new Subject<any>();
  snapSuccess$ = this.SnapSuccessSubject.asObservable();

  emitSnapSuccess(value: any) {
    this.SnapSuccessSubject.next(value);
  }
  
  public ngOnDestroy(): void {
    if (this.frameId != 0) {
      cancelAnimationFrame(this.frameId);
    }
    if (this.renderer != null) this.renderer.dispose();
    if (this.scene) {
      while(this.scene.children.length > 0){
        this.scene.remove(this.scene.children[0]); 
      }
    }
  }

  private degToRad(degree: number): number {
    return degree * Math.PI / 180;
  }

  public loadNextModel(level: number, step: number) {
    const pathItem = this.modelAssets[level - 1];
    if (pathItem) {
      switch (step) {
        case 4:
          this.loadGLTFModel(
            this.assemblyModel,
            'mobo/' + pathItem.motherboard.path,
            pathItem.motherboard.position,
            pathItem.motherboard.scale,
            pathItem.motherboard.rotation
          );

          this.initialPos = pathItem.motherboard.position;
          this.snapPos = pathItem.motherboard.snapPosition;
          break;
        case 5:
          this.loadGLTFModel(
            this.assemblyModel,
            'case-fan/' + pathItem.caseFan.path,
            pathItem.caseFan.position,
            pathItem.caseFan.scale,
            pathItem.caseFan.rotation
          );
          
          this.initialPos = pathItem.caseFan.position;
          this.snapPos = pathItem.caseFan.snapPosition;
          break;
        case 6:
          this.loadGLTFModel(
            this.assemblyModel,
            'cpu/' + pathItem.cpu.path,
            pathItem.cpu.position,
            pathItem.cpu.scale,
            pathItem.cpu.rotation
          );
          
          this.initialPos = pathItem.cpu.position;
          this.snapPos = pathItem.cpu.snapPosition;
          break;
        case 7:
          this.loadGLTFModel(
            this.assemblyModel,
            'ram/' + pathItem.memory1.path,
            pathItem.memory1.position,
            pathItem.memory1.scale,
            pathItem.memory1.rotation
          );
          
          this.initialPos = pathItem.memory1.position;
          this.snapPos = pathItem.memory1.snapPosition;
          break;
        case 8:
          this.loadGLTFModel(
            this.assemblyModel,
            'ram/' + pathItem.memory2.path,
            pathItem.memory2.position,
            pathItem.memory2.scale,
            pathItem.memory2.rotation
          );
          
          this.initialPos = pathItem.memory2.position;
          this.snapPos = pathItem.memory2.snapPosition;
          break;
        case 9:
          this.loadGLTFModel(
            this.assemblyModel,
            'storage/' + pathItem.storage.path,
            pathItem.storage.position,
            pathItem.storage.scale,
            pathItem.storage.rotation
          );
          
          this.initialPos = pathItem.storage.position;
          this.snapPos = pathItem.storage.snapPosition;
          break;
        case 10:
          this.loadGLTFModel(
            this.assemblyModel,
            'cpu-fan/' + pathItem.cpuFan.path,
            pathItem.cpuFan.position,
            pathItem.cpuFan.scale,
            pathItem.cpuFan.rotation
          );
          
          this.initialPos = pathItem.cpuFan.position;
          this.snapPos = pathItem.cpuFan.snapPosition;
          break;
        case 11:
          if (level !== 1) {
            this.loadGLTFModel(
              this.assemblyModel,
              'gpu/' + pathItem.gpu.path,
              pathItem.gpu.position,
              pathItem.gpu.scale,
              pathItem.gpu.rotation
            );
            
            this.initialPos = pathItem.gpu.position;
            this.snapPos = pathItem.gpu.snapPosition;
          }
          break;
        case 12:
          this.loadGLTFModel(
            this.assemblyModel,
            'psu/' + pathItem.psu.path,
            pathItem.psu.position,
            pathItem.psu.scale,
            pathItem.psu.rotation
          );
          
          this.initialPos = pathItem.psu.position;
          this.snapPos = pathItem.psu.snapPosition;
          break;
        default:
          break;
      }
    }
  }

  private loadGLTFModel(assignedModel: any, modelPath: string, modelPosition: any, modelScale: any, modelRotation: any): any {
    if (modelPath.length > 0 ) {
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
          
          // case remain static
          if (!modelPath.startsWith('case/')) assignedModel.isDraggable = true;
  
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
        this.introModel = gltf.scene.children[0];
        this.scene.add(this.introModel);
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

    this.render();
  }

  // simulation
  public createScene(canvas: ElementRef<HTMLCanvasElement>, level: number): void {
    this.isInspectMode = false;
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

    const pathItem = this.modelAssets[level - 1];
    if (pathItem) {
      this.loadGLTFModel(
        this.assemblyModel,
        'case/' + pathItem.case.path,
        pathItem.case.position,
        pathItem.case.scale,
        pathItem.case.rotation
      );
    }

    this.light = new THREE.AmbientLight(0xFFFFFF, 2);
    this.light.position.z = 5;
    this.scene.add(this.light);

    this.directionalLight = new THREE.DirectionalLight(0xFFFFFF, 2);
    this.directionalLight.castShadow = true;
    this.directionalLight.position.set(10, 5, 5);
    this.scene.add(this.directionalLight);

    this.directionalLight.position.set(-10, 5, 5);
    this.scene.add(this.directionalLight);

    this.clickMouse = new THREE.Vector2();
    this.moveMouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();

    if (!this.eventListenersAdded) {
      window.addEventListener('click', (event) => this.onMouseClick(event));
      window.addEventListener('mousemove', (event) => this.onMouseMove(event));
      this.eventListenersAdded = true;
    }
    
    this.render();
  }

  private render(): void {
    this.frameId = requestAnimationFrame(() => {
      this.render();
      
      if (this.isInspectMode) this.controls.update();
      if (this.introModel) this.introModel.rotation.z += 0.001;
    });

    this.renderer.render(this.scene, this.camera);
  }

  public inspectModel() {
    this.isInspectMode = true;
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.update();
  }

  private snapThreshold(currentXPos: number, currentYPos: number, snapPos: any): boolean {
    const bufferX = 0.25;
    const minX = snapPos.x - bufferX;
    const maxX = snapPos.x + bufferX;
    const maxY = snapPos.y + bufferX;
    const minY = snapPos.y - bufferX;
    // Check if the current position is within vertical & horizontal range
    return currentXPos >= minX && currentXPos <= maxX && currentYPos >= minY && currentYPos <= maxY;
  }

  private dragModel(): void {
    // whether there's a object being clicked on
    if (this.draggableModel) {
      this.raycaster.setFromCamera(this.moveMouse, this.camera);
      const found = this.raycaster.intersectObjects(this.scene.children);
      if (found.length > 0) {
        for (const obj3d of found) {
          if (!obj3d.object.isDraggable) {
            this.draggableModel.position.x = obj3d.point.x;
            this.draggableModel.position.y = obj3d.point.y;

            // snapping logic
            if (this.snapThreshold(this.draggableModel.position.x, this.draggableModel.position.y, this.snapPos)) {
              // snap success, set model pos to snap pos
              this.draggableModel.position.x = this.snapPos.x;
              this.draggableModel.position.y = this.snapPos.y;
              
              // disable drag once snapped
              this.draggableModel.isDraggable = false;
              
              this.emitSnapSuccess(true); // emit to canvas to proceed to next step
              // drop the model
              this.draggableModel = undefined;
            }
            break;
          }
        }
      }
    }
  }

  private onMouseClick(event: MouseEvent): void {
    if (!this.isInspectMode) {
      // If 'holding' model on-click, set container to <undefined> to 'drop' the model.
      if (this.draggableModel) {
        // model not snapped, reset model back to initial pos
        this.toast.error({detail:"FAILED",summary:'Hardware placed incorrectly. Please try again!', duration:2000, position:'topCenter'});

        this.draggableModel.position.x = this.initialPos.x;
        this.draggableModel.position.y = this.initialPos.y;

        // drop model from mouse
        this.draggableModel = undefined;
        return;
      }
  
      // If NOT 'holding' model on-click, set container to <object> to 'pickup' the model.
      this.clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.clickMouse, this.camera);
      const found = this.raycaster.intersectObjects(this.scene.children, true);
      if (found.length) {
        // Cycle upwards through every parent until it reaches the group created by the GLTFLoader function
        let current = found[0].object;
        while (current.parent.parent !== null) {
          current = current.parent;
        }
        // set draggableModel to loaded model
        if (current.isDraggable) this.draggableModel = current;
      }
    }
  }

  private onMouseMove(event: MouseEvent): void {
    if (!this.isInspectMode) {
      this.dragModel(); // Updates the model's postion everytime the mouse moves
      this.moveMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.moveMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
  }
}
