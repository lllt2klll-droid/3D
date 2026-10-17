import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CircuitComponent, Wire } from '../types';
import { WireRenderer } from './WireRenderer';
import { createBaseDiorama, DioramaEnvironment } from './models/BaseDiorama';
import { createBatteryMesh } from './models/BatteryModel';
import { createBulbMesh, BulbObject } from './models/BulbModel';
import { createSwitchMesh, SwitchObject } from './models/SwitchModel';
import { createMotorFanMesh, MotorFanObject } from './models/MotorFanModel';
import { createSolarPanelMesh, SolarPanelObject } from './models/SolarPanelModel';
import { createWindTurbineMesh, WindTurbineObject } from './models/WindTurbineModel';
import { createResistorMesh } from './models/ResistorModel';
import { createLedMesh, LedObject } from './models/LedModel';

export interface ViewerCallbacks {
  onTerminalClick?: (componentId: string, terminalId: string) => void;
  onSwitchToggle?: (comp: CircuitComponent) => void;
  onComponentClick?: (componentId: string) => void;
  onWireClick?: (wireId: string) => void;
}

export class ThreeViewer {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private clock: THREE.Clock;

  // Environment & Lighting
  private ambientLight: THREE.AmbientLight;
  private sunLight: THREE.DirectionalLight;
  private diorama: DioramaEnvironment;

  // Circuit Layers
  private componentGroup: THREE.Group;
  private wireRenderer: WireRenderer;
  private componentMeshes: Map<string, THREE.Object3D> = new Map();

  // Raycasting & Interaction
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private callbacks: ViewerCallbacks = {};
  private hoveredHalo: THREE.Object3D | null = null;
  private selectedTerminalKey: string | null = null;

  // Animation Loop
  private animFrameId: number | null = null;
  private isDestroyed: boolean = false;
  private energyEnv = { sunlight: 0.8, windSpeed: 2 };

  constructor(container: HTMLElement, callbacks: ViewerCallbacks = {}) {
    this.container = container;
    this.callbacks = callbacks;
    this.clock = new THREE.Clock();

    // 1. Scene Setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf6f9fc); // Bright clean sky tint

    // 2. Camera Setup (Isometric pedagogical angle)
    const aspect = container.clientWidth / Math.max(container.clientHeight, 1);
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.camera.position.set(5.5, 6.0, 6.5);

    // 3. Renderer Setup
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    container.appendChild(this.renderer.domElement);

    // 4. OrbitControls Setup
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(0, 0.6, 0);
    this.controls.minDistance = 2.5;
    this.controls.maxDistance = 14;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.06; // Prevent looking below ground plane

    // 5. Lighting Setup
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xfffbeb, 1.8);
    this.sunLight.position.set(6, 10, 6);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 25;
    this.sunLight.shadow.camera.left = -5;
    this.sunLight.shadow.camera.right = 5;
    this.sunLight.shadow.camera.top = 5;
    this.sunLight.shadow.camera.bottom = -5;
    this.sunLight.shadow.bias = -0.0005;
    this.scene.add(this.sunLight);

    // Fill soft light
    const fillLight = new THREE.DirectionalLight(0xbae6fd, 0.6);
    fillLight.position.set(-5, 4, -5);
    this.scene.add(fillLight);

    // 6. Base Diorama Island
    this.diorama = createBaseDiorama();
    this.scene.add(this.diorama);

    // 7. Component & Wire Groups
    this.componentGroup = new THREE.Group();
    this.componentGroup.name = 'components_layer';
    this.scene.add(this.componentGroup);

    this.wireRenderer = new WireRenderer();
    this.scene.add(this.wireRenderer.getRoot());

    // 8. Raycasting
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.initEventListeners();
    this.startLoop();
  }

  private initEventListeners() {
    this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown);
    this.renderer.domElement.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('resize', this.onWindowResize);
  }

  private onWindowResize = () => {
    if (this.isDestroyed || !this.container) return;
    const width = this.container.clientWidth;
    const height = Math.max(this.container.clientHeight, 1);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private getNormalizedMouse(e: MouseEvent | PointerEvent): THREE.Vector2 {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    return new THREE.Vector2(x, y);
  }

  private onPointerMove = (e: PointerEvent) => {
    this.mouse = this.getNormalizedMouse(e);
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    // Reset previous hover highlight (except currently selected terminal)
    if (this.hoveredHalo && this.hoveredHalo.name !== `halo::${this.selectedTerminalKey}`) {
      this.hoveredHalo.visible = false;
      this.hoveredHalo = null;
    }

    let foundTerminal = false;
    for (const hit of intersects) {
      let obj: THREE.Object3D | null = hit.object;
      while (obj && obj !== this.scene) {
        if (obj.name.startsWith('terminal::')) {
          const halo = obj.getObjectByName(obj.name.replace('terminal::', 'halo::'));
          if (halo) {
            halo.visible = true;
            this.hoveredHalo = halo;
            foundTerminal = true;
            this.renderer.domElement.style.cursor = 'pointer';
          }
          break;
        }
        if (obj.name.startsWith('lever::')) {
          this.renderer.domElement.style.cursor = 'pointer';
          return;
        }
        obj = obj.parent;
      }
      if (foundTerminal) return;
    }

    this.renderer.domElement.style.cursor = 'default';
  };

  private onPointerDown = (e: PointerEvent) => {
    // Only respond to primary mouse click / single touch
    if (e.button !== 0) return;

    this.mouse = this.getNormalizedMouse(e);
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    for (const hit of intersects) {
      let obj: THREE.Object3D | null = hit.object;

      // Check if user clicked a wire
      if (hit.object.userData && hit.object.userData.wireId) {
        this.callbacks.onWireClick?.(hit.object.userData.wireId);
        return;
      }

      while (obj && obj !== this.scene) {
        // 1. Clicked Terminal Pin
        if (obj.name.startsWith('terminal::')) {
          const parts = obj.name.split('::');
          const compId = parts[1];
          const termId = parts[2];
          this.callbacks.onTerminalClick?.(compId, termId);
          return;
        }

        // 2. Clicked Switch Lever
        if (obj.name.startsWith('lever::')) {
          const compId = obj.name.split('::')[1];
          const switchMesh = this.componentMeshes.get(compId) as SwitchObject;
          if (switchMesh && switchMesh.toggleLever) {
            switchMesh.toggleLever();
          }
          return;
        }

        // 3. Clicked Component Body
        if (this.componentMeshes.has(obj.name)) {
          this.callbacks.onComponentClick?.(obj.name);
          return;
        }

        obj = obj.parent;
      }
    }
  };

  /**
   * Sync components list from state
   */
  public syncComponents(
    components: CircuitComponent[],
    onSwitchToggle?: (comp: CircuitComponent) => void
  ) {
    const activeIds = new Set(components.map((c) => c.id));

    // Remove components that are no longer in the list
    for (const [id, mesh] of this.componentMeshes.entries()) {
      if (!activeIds.has(id)) {
        this.componentGroup.remove(mesh);
        this.componentMeshes.delete(id);
      }
    }

    // Add or update components
    components.forEach((comp) => {
      let mesh = this.componentMeshes.get(comp.id);

      if (!mesh) {
        switch (comp.type) {
          case 'battery':
            mesh = createBatteryMesh(comp);
            break;
          case 'bulb':
            mesh = createBulbMesh(comp);
            break;
          case 'switch':
            mesh = createSwitchMesh(comp, (swComp) => {
              if (onSwitchToggle) onSwitchToggle(swComp);
              this.callbacks.onSwitchToggle?.(swComp);
            });
            break;
          case 'motor':
          case 'fan':
            mesh = createMotorFanMesh(comp);
            break;
          case 'solar_panel':
            mesh = createSolarPanelMesh(comp);
            break;
          case 'wind_turbine':
            mesh = createWindTurbineMesh(comp);
            break;
          case 'resistor':
            mesh = createResistorMesh(comp);
            break;
          case 'led':
            mesh = createLedMesh(comp);
            break;
        }

        if (mesh) {
          this.componentGroup.add(mesh);
          this.componentMeshes.set(comp.id, mesh);
        }
      }

      // Update positions
      if (mesh) {
        mesh.position.set(...comp.position);
      }
    });
  }

  /**
   * Sync wires from state
   */
  public syncWires(wires: Wire[], components: CircuitComponent[]) {
    this.wireRenderer.updateWires(wires, components);
  }

  /**
   * Update active terminal selection ring
   */
  public setSelectedTerminal(key: string | null) {
    if (this.selectedTerminalKey) {
      const prevHalo = this.scene.getObjectByName(`halo::${this.selectedTerminalKey}`);
      if (prevHalo) prevHalo.visible = false;
    }
    this.selectedTerminalKey = key;
    if (key) {
      const nextHalo = this.scene.getObjectByName(`halo::${key}`);
      if (nextHalo) nextHalo.visible = true;
    }
  }

  /**
   * Update environment controls (sunlight and wind speed)
   */
  public updateEnergyEnv(sunlight: number, windSpeed: number) {
    this.energyEnv = { sunlight, windSpeed };
    this.sunLight.intensity = 0.5 + sunlight * 1.5;
  }

  /**
   * Reset camera to isometric sweet spot
   */
  public resetCamera() {
    this.camera.position.set(5.5, 6.0, 6.5);
    this.controls.target.set(0, 0.6, 0);
    this.controls.update();
  }

  /**
   * Focus camera on a specific component (e.g., in Explore Mode)
   */
  public focusOnComponent(comp: CircuitComponent) {
    const target = new THREE.Vector3(...comp.position).add(new THREE.Vector3(0, 0.4, 0));
    this.controls.target.copy(target);
    this.camera.position.set(comp.position[0] + 2.5, comp.position[1] + 2.2, comp.position[2] + 2.5);
    this.controls.update();
  }

  /**
   * Animation Render Loop
   */
  private startLoop = () => {
    const loop = () => {
      if (this.isDestroyed) return;
      this.animFrameId = requestAnimationFrame(loop);

      const delta = Math.min(this.clock.getDelta(), 0.1);

      // Controls damping
      this.controls.update();

      // Update diorama environment
      this.diorama.updateEnvironment(this.energyEnv.sunlight, this.energyEnv.windSpeed, delta);

      // Update dynamic states of components
      for (const mesh of this.componentMeshes.values()) {
        const anyMesh = mesh as unknown as Record<string, unknown>;
        if (typeof anyMesh.updateBulbState === 'function') {
          // Dynamic bulb state is updated via syncComponents
        }
        if (typeof anyMesh.updateMotorState === 'function') {
          const compId = mesh.name;
          const fakeComp = {
            id: compId,
            type: 'fan',
            name: '',
            position: [0, 0, 0],
            state: { isSpinning: (mesh.userData as Record<string, unknown>)?.isSpinning ?? true, speed: 1.0 },
            terminals: [],
          } as unknown as CircuitComponent;
          (anyMesh.updateMotorState as (comp: CircuitComponent, dt: number) => void)(fakeComp, delta);
        }
        if (typeof anyMesh.updateTurbineState === 'function') {
          const fakeComp = {
            id: mesh.name,
            type: 'wind_turbine',
            name: '',
            position: [0, 0, 0],
            state: {},
            terminals: [],
          } as unknown as CircuitComponent;
          (anyMesh.updateTurbineState as (comp: CircuitComponent, speed: number, dt: number) => void)(
            fakeComp,
            this.energyEnv.windSpeed,
            delta
          );
        }
        if (typeof anyMesh.updateSolarState === 'function') {
          const fakeComp = {
            id: mesh.name,
            type: 'solar_panel',
            name: '',
            position: [0, 0, 0],
            state: {},
            terminals: [],
          } as unknown as CircuitComponent;
          (anyMesh.updateSolarState as (comp: CircuitComponent, sun: number) => void)(
            fakeComp,
            this.energyEnv.sunlight
          );
        }
      }

      // Animate flowing electric current particles
      this.wireRenderer.animateCurrent(delta);

      // Render Scene
      this.renderer.render(this.scene, this.camera);
    };

    loop();
  };

  /**
   * Update component dynamic state meshes (bulbs, switches, motors)
   */
  public updateAllComponentStates(components: CircuitComponent[]) {
    components.forEach((comp) => {
      const mesh = this.componentMeshes.get(comp.id);
      if (!mesh) return;

      const anyMesh = mesh as unknown as Record<string, unknown>;
      if (typeof anyMesh.updateBulbState === 'function') {
        (anyMesh.updateBulbState as (c: CircuitComponent) => void)(comp);
      }
      if (typeof anyMesh.updateSwitchState === 'function') {
        (anyMesh.updateSwitchState as (c: CircuitComponent) => void)(comp);
      }
      if (typeof anyMesh.updateLedState === 'function') {
        (anyMesh.updateLedState as (c: CircuitComponent) => void)(comp);
      }
      mesh.userData = {
        isSpinning: comp.state.isSpinning ?? false,
      };
    });
  }

  public setHouseLit(lit: boolean) {
    this.diorama.setHouseLit(lit);
  }

  public dispose() {
    this.isDestroyed = true;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }
    window.removeEventListener('resize', this.onWindowResize);
    this.renderer.domElement.removeEventListener('pointerdown', this.onPointerDown);
    this.renderer.domElement.removeEventListener('pointermove', this.onPointerMove);

    this.controls.dispose();
    this.wireRenderer.clear();
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
