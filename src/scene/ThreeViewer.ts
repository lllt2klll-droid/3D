import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CircuitComponent, Wire } from '../types';
import { WireRenderer } from './WireRenderer';
import { createBaseDiorama, DioramaEnvironment } from './models/BaseDiorama';
import { createBatteryMesh } from './models/BatteryModel';
import { createBatteryPackMesh } from './models/BatteryPackModel';
import { createBulbMesh, BulbObject } from './models/BulbModel';
import { createSwitchMesh, SwitchObject } from './models/SwitchModel';
import { createPushButtonMesh, PushButtonObject } from './models/PushButtonModel';
import { createMotorFanMesh, MotorFanObject } from './models/MotorFanModel';
import { createSolarPanelMesh, SolarPanelObject } from './models/SolarPanelModel';
import { createWindTurbineMesh, WindTurbineObject } from './models/WindTurbineModel';
import { createBuzzerMesh, BuzzerObject } from './models/BuzzerModel';
import { createResistorMesh } from './models/ResistorModel';
import { createPotentiometerMesh, PotentiometerObject } from './models/PotentiometerModel';
import { createFuseMesh, FuseObject } from './models/FuseModel';
import { createLedMesh, LedObject } from './models/LedModel';

const polarityMaterials = new Map<'positive' | 'negative', THREE.SpriteMaterial>();

function getPolarityMaterial(polarity: 'positive' | 'negative'): THREE.SpriteMaterial {
  const cachedMaterial = polarityMaterials.get(polarity);
  if (cachedMaterial) return cachedMaterial;

  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Unable to create canvas context for terminal polarity labels.');

  context.beginPath();
  context.arc(32, 32, 29, 0, Math.PI * 2);
  context.fillStyle = polarity === 'positive' ? '#dc2626' : '#334155';
  context.fill();
  context.lineWidth = 5;
  context.strokeStyle = '#ffffff';
  context.stroke();
  context.fillStyle = '#ffffff';
  context.font = 'bold 44px Arial, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(polarity === 'positive' ? '+' : '−', 32, 33);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });
  polarityMaterials.set(polarity, material);
  return material;
}

function addPolarityLabels(mesh: THREE.Object3D, comp: CircuitComponent) {
  comp.terminals.forEach((terminal) => {
    let polarity: 'positive' | 'negative' | null = null;
    if (terminal.polarity === 'positive' || terminal.polarity === 'anode') {
      polarity = 'positive';
    } else if (terminal.polarity === 'negative' || terminal.polarity === 'cathode') {
      polarity = 'negative';
    }
    if (!polarity) return;

    const label = new THREE.Sprite(getPolarityMaterial(polarity));
    label.name = `polarity-label::${comp.id}::${terminal.id}`;
    label.position.set(
      terminal.relativePosition[0],
      terminal.relativePosition[1] + 0.34,
      terminal.relativePosition[2]
    );
    label.scale.set(0.28, 0.28, 1);
    label.renderOrder = 2;
    mesh.add(label);
  });
}

export interface ViewerCallbacks {
  onTerminalClick?: (componentId: string, terminalId: string) => void;
  onSwitchToggle?: (comp: CircuitComponent) => void;
  onComponentClick?: (componentId: string) => void;
  onComponentMove?: (componentId: string, position: [number, number, number]) => void;
  onComponentMoveEnd?: (componentId: string, position: [number, number, number]) => void;
  onComponentRotate?: (componentId: string, rotationY: number) => void;
  onWireClick?: (wireId: string) => void;
  onEmptyClick?: () => void;
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
  private fillLight: THREE.DirectionalLight;
  private skyMesh: THREE.Mesh | null = null;
  private starsGroup: THREE.Group | null = null;
  private isNightMode: boolean = false;
  private diorama: DioramaEnvironment;

  // Circuit Layers
  private componentGroup: THREE.Group;
  private wireRenderer: WireRenderer;
  private componentMeshes: Map<string, THREE.Object3D> = new Map();

  // Cached components and wires for live dragging
  private currentComponents: CircuitComponent[] = [];
  private currentWires: Wire[] = [];

  // Raycasting & Interaction
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private callbacks: ViewerCallbacks = {};
  private hoveredHalo: THREE.Object3D | null = null;
  private selectedTerminalKey: string | null = null;

  // Component Dragging State
  private isDraggingComp: boolean = false;
  private draggedCompId: string | null = null;
  private dragPlane: THREE.Plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private dragOffset: THREE.Vector3 = new THREE.Vector3();
  private dragPlaneHit: THREE.Vector3 = new THREE.Vector3();

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
    this.scene.background = new THREE.Color(0xf6f9fc);

    // 2. Camera Setup (Isometric pedagogical angle with mobile portrait compensation)
    const aspect = container.clientWidth / Math.max(container.clientHeight, 1);
    const initialFov = aspect < 1.0 ? Math.min(75, 45 / Math.max(aspect, 0.5)) : 45;
    this.camera = new THREE.PerspectiveCamera(initialFov, aspect, 0.1, 100);
    if (aspect < 1.0) {
      this.camera.position.set(6.5, 8.0, 7.5);
    } else {
      this.camera.position.set(5.5, 6.0, 6.5);
    }

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
    this.renderer.domElement.style.touchAction = 'none';
    container.appendChild(this.renderer.domElement);

    // 4. OrbitControls Setup with smooth mobile touch navigation
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(0, 0.5, 0);
    this.controls.minDistance = 2.5;
    this.controls.maxDistance = 16;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.06;
    // Mobile touch ergonomics: 1 finger to rotate around scene, 2 fingers to pinch-zoom / pan
    this.controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };

    // 5. Lighting Setup
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xfffbeb, 1.8);
    this.sunLight.position.set(6, 10, 6);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.sunLight.shadow.bias = -0.0005;
    this.scene.add(this.sunLight);

    this.fillLight = new THREE.DirectionalLight(0xbae6fd, 0.6);
    this.fillLight.position.set(-5, 4, -5);
    this.scene.add(this.fillLight);

    // 5b. Sky Dome (large sphere wrapping the scene, visible in background)
    const skyGeo = new THREE.SphereGeometry(45, 24, 16);
    const skyMat = new THREE.MeshBasicMaterial({
      color: 0xf6f9fc,
      side: THREE.BackSide,
    });
    this.skyMesh = new THREE.Mesh(skyGeo, skyMat);
    this.scene.add(this.skyMesh);

    // 5c. Star particles (hidden by default, shown at night)
    this.starsGroup = new THREE.Group();
    const starGeometry = new THREE.BufferGeometry();
    const starPositions: number[] = [];
    for (let i = 0; i < 280; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 40 + Math.random() * 4;
      starPositions.push(
        r * Math.sin(phi) * Math.cos(theta),
        Math.abs(r * Math.cos(phi)) + 5, // keep above horizon
        r * Math.sin(phi) * Math.sin(theta)
      );
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.38,
      transparent: true,
      opacity: 0,
      sizeAttenuation: true,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    this.starsGroup.add(stars);
    this.starsGroup.visible = false;
    this.scene.add(this.starsGroup);

    // 6. Base Clean Workbench
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
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('pointercancel', this.onPointerUp);
    window.addEventListener('resize', this.onWindowResize);
  }

  private onWindowResize = () => {
    if (this.isDestroyed || !this.container) return;
    const width = this.container.clientWidth;
    const height = Math.max(this.container.clientHeight, 1);
    const aspect = width / height;
    this.camera.aspect = aspect;
    this.camera.fov = aspect < 1.0 ? Math.min(75, 45 / Math.max(aspect, 0.5)) : 45;
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

    // If currently dragging a component across the table
    if (this.isDraggingComp && this.draggedCompId) {
      if (this.raycaster.ray.intersectPlane(this.dragPlane, this.dragPlaneHit)) {
        const target = this.dragPlaneHit.clone().add(this.dragOffset);
        // Clamp inside spacious workbench boundary
        const cx = THREE.MathUtils.clamp(target.x, -3.8, 3.8);
        const cz = THREE.MathUtils.clamp(target.z, -3.0, 3.0);

        const mesh = this.componentMeshes.get(this.draggedCompId);
        if (mesh) {
          mesh.position.set(cx, 0, cz);
        }

        // Update cached position for immediate wire curve re-calculation
        const found = this.currentComponents.find((c) => c.id === this.draggedCompId);
        if (found) {
          found.position = [cx, 0, cz];
          this.wireRenderer.updateWires(this.currentWires, this.currentComponents);
        }

        this.renderer.domElement.style.cursor = 'grabbing';
        this.callbacks.onComponentMove?.(this.draggedCompId, [cx, 0, cz]);
      }
      return;
    }

    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    // Reset previous hover highlight (except currently selected terminal)
    if (this.hoveredHalo && this.hoveredHalo.name !== `halo::${this.selectedTerminalKey}`) {
      if (!this.selectedTerminalKey) {
        this.hoveredHalo.visible = false;
      }
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
        if (obj.name.startsWith('lever::') || this.componentMeshes.has(obj.name)) {
          this.renderer.domElement.style.cursor = 'grab';
          return;
        }
        obj = obj.parent;
      }
      if (foundTerminal) return;
    }

    this.renderer.domElement.style.cursor = 'default';
  };

  private onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0) return;

    this.mouse = this.getNormalizedMouse(e);
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    // 1. HIGHEST PRIORITY: Check for terminal hits first!
    // This guarantees clicking terminals for wire connection is 100% reliable!
    for (const hit of intersects) {
      let obj: THREE.Object3D | null = hit.object;
      while (obj && obj !== this.scene) {
        if (obj.name.startsWith('terminal::')) {
          e.stopPropagation();
          const parts = obj.name.split('::');
          this.callbacks.onTerminalClick?.(parts[1], parts[2]);
          return;
        }
        obj = obj.parent;
      }
    }

    // 2. SECOND PRIORITY: Check for knife switch lever toggle
    for (const hit of intersects) {
      let obj: THREE.Object3D | null = hit.object;
      while (obj && obj !== this.scene) {
        if (obj.name.startsWith('lever::')) {
          e.stopPropagation();
          const compId = obj.name.split('::')[1];
          const switchMesh = this.componentMeshes.get(compId) as SwitchObject;
          if (switchMesh && switchMesh.toggleLever) {
            switchMesh.toggleLever();
          }
          return;
        }
        if (obj.name.startsWith('button::')) {
          e.stopPropagation();
          const compId = obj.name.split('::')[1];
          const pushMesh = this.componentMeshes.get(compId) as PushButtonObject;
          if (pushMesh && pushMesh.toggleButton) {
            pushMesh.toggleButton();
          }
          return;
        }
        obj = obj.parent;
      }
    }

    // 3. THIRD PRIORITY: Check if user clicked an existing wire
    for (const hit of intersects) {
      if (hit.object.userData && hit.object.userData.wireId) {
        e.stopPropagation();
        this.callbacks.onWireClick?.(hit.object.userData.wireId);
        return;
      }
    }

    // 4. FOURTH PRIORITY: Component Body clicked -> Start drag & select component!
    for (const hit of intersects) {
      let obj: THREE.Object3D | null = hit.object;
      while (obj && obj !== this.scene) {
        if (this.componentMeshes.has(obj.name)) {
          e.stopPropagation();
          const compId = obj.name;
          const mesh = this.componentMeshes.get(compId)!;

          // Start dragging component across plane y = 0
          if (this.raycaster.ray.intersectPlane(this.dragPlane, this.dragPlaneHit)) {
            this.dragOffset.subVectors(mesh.position, this.dragPlaneHit);
            this.draggedCompId = compId;
            this.isDraggingComp = true;
            this.controls.enabled = false; // Disable camera orbit while dragging component
            this.renderer.domElement.style.cursor = 'grabbing';
            try {
              this.renderer.domElement.setPointerCapture(e.pointerId);
            } catch {}
          }

          this.callbacks.onComponentClick?.(compId);
          return;
        }
        obj = obj.parent;
      }
    }

    // Clicked empty surface on table
    this.callbacks.onEmptyClick?.();
  };

  private onPointerUp = (e?: PointerEvent) => {
    if (e && e.pointerId !== undefined) {
      try {
        this.renderer.domElement.releasePointerCapture(e.pointerId);
      } catch {}
    }
    if (this.isDraggingComp && this.draggedCompId) {
      this.controls.enabled = true;
      const mesh = this.componentMeshes.get(this.draggedCompId);
      if (mesh) {
        this.callbacks.onComponentMoveEnd?.(this.draggedCompId, [
          mesh.position.x,
          mesh.position.y,
          mesh.position.z,
        ]);
      }
      this.isDraggingComp = false;
      this.draggedCompId = null;
      this.renderer.domElement.style.cursor = 'default';
    }
  };

  /**
   * Rotate a component in 3D by deltaAngleRad (default: 45 degrees)
   */
  public rotateComponent(compId: string, deltaAngleRad: number = Math.PI / 4) {
    const mesh = this.componentMeshes.get(compId);
    const comp = this.currentComponents.find((c) => c.id === compId);
    if (!mesh || !comp) return;

    mesh.rotation.y = (mesh.rotation.y + deltaAngleRad) % (Math.PI * 2);
    comp.rotation = [0, mesh.rotation.y, 0];

    // Immediately update connected wires
    this.wireRenderer.updateWires(this.currentWires, this.currentComponents);
    this.callbacks.onComponentRotate?.(compId, mesh.rotation.y);
  }

  /**
   * Sync components list from state
   */
  public syncComponents(
    components: CircuitComponent[],
    onSwitchToggle?: (comp: CircuitComponent) => void
  ) {
    this.currentComponents = components;
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
          case 'battery_pack':
            mesh = createBatteryPackMesh(comp);
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
          case 'push_button':
            mesh = createPushButtonMesh(comp, (pbComp) => {
              if (onSwitchToggle) onSwitchToggle(pbComp);
              this.callbacks.onSwitchToggle?.(pbComp);
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
          case 'buzzer':
            mesh = createBuzzerMesh(comp);
            break;
          case 'resistor':
            mesh = createResistorMesh(comp);
            break;
          case 'potentiometer':
            mesh = createPotentiometerMesh(comp);
            break;
          case 'fuse':
            mesh = createFuseMesh(comp);
            break;
          case 'led':
            mesh = createLedMesh(comp);
            break;
        }

        if (mesh) {
          addPolarityLabels(mesh, comp);
          this.componentGroup.add(mesh);
          this.componentMeshes.set(comp.id, mesh);
        }
      }

      // Update positions & rotation
      if (mesh) {
        if (!this.isDraggingComp || comp.id !== this.draggedCompId) {
          mesh.position.set(...comp.position);
        }
        if (comp.rotation) {
          mesh.rotation.y = comp.rotation[1];
        }
      }
    });
  }

  /**
   * Move a component in 3D directly and immediately update connected wires
   */
  public moveComponent(compId: string, position: [number, number, number]) {
    const mesh = this.componentMeshes.get(compId);
    const comp = this.currentComponents.find((c) => c.id === compId);
    if (!mesh || !comp) return;

    mesh.position.set(...position);
    comp.position = position;
    this.wireRenderer.updateWires(this.currentWires, this.currentComponents);
  }

  /**
   * Sync wires from state
   */
  public syncWires(wires: Wire[], components: CircuitComponent[]) {
    this.currentWires = wires;
    this.currentComponents = components;
    this.wireRenderer.updateWires(wires, components);
  }

  /**
   * Update active terminal selection ring
   * When connecting, lights up the starting terminal in gold/amber and all other connectable terminals in cyan!
   */
  public setSelectedTerminal(key: string | null) {
    // Reset all halos first
    this.scene.traverse((obj) => {
      if (obj.name && obj.name.startsWith('halo::')) {
        obj.visible = false;
        obj.scale.set(1, 1, 1);
      }
    });

    this.selectedTerminalKey = key;
    if (key) {
      // Highlight the selected starting terminal in bright gold/yellow
      const startHalo = this.scene.getObjectByName(`halo::${key}`);
      if (startHalo) {
        startHalo.visible = true;
        startHalo.scale.set(1.45, 1.45, 1.45);
      }

      // Highlight all other candidate terminals with cyan so the user immediately sees all targets
      this.scene.traverse((obj) => {
        if (obj.name && obj.name.startsWith('halo::') && obj.name !== `halo::${key}`) {
          obj.visible = true;
          obj.scale.set(1.2, 1.2, 1.2);
        }
      });
    }
  }

  /**
   * Update environment controls (sunlight and wind speed)
   */
  public updateEnergyEnv(sunlight: number, windSpeed: number) {
    this.energyEnv = { sunlight, windSpeed };
    // In night mode, don't fight the night lighting with full sunlight
    if (!this.isNightMode) {
      this.sunLight.intensity = 0.5 + sunlight * 1.5;
    }
  }

  /**
   * Toggle Day / Night environment mode with smooth lighting transition
   */
  public setDayNight(isNight: boolean) {
    this.isNightMode = isNight;

    const skyMatAny = this.skyMesh?.material as THREE.MeshBasicMaterial | undefined;

    if (isNight) {
      // --- NIGHT MODE ---
      // Deep midnight blue sky
      if (skyMatAny) skyMatAny.color.setHex(0x0b0e1a);
      this.scene.background = new THREE.Color(0x0b0e1a);
      // Dim warm sun to a cool moonlight silver
      this.sunLight.color.setHex(0xaab8d0);
      this.sunLight.intensity = 0.22;
      this.sunLight.position.set(-8, 12, -6);
      // Cool blue ambient moonlight
      this.ambientLight.color.setHex(0x1a2a4a);
      this.ambientLight.intensity = 0.55;
      // Soft lavender fill from below
      this.fillLight.color.setHex(0x2d1b5e);
      this.fillLight.intensity = 0.18;
      // Show star particles with fade-in via opacity
      if (this.starsGroup) {
        this.starsGroup.visible = true;
        const starPoints = this.starsGroup.children[0] as THREE.Points;
        (starPoints.material as THREE.PointsMaterial).opacity = 0.88;
      }
    } else {
      // --- DAY MODE ---
      if (skyMatAny) skyMatAny.color.setHex(0xf6f9fc);
      this.scene.background = new THREE.Color(0xf6f9fc);
      // Warm golden sunlight
      this.sunLight.color.setHex(0xfffbeb);
      this.sunLight.intensity = 1.8;
      this.sunLight.position.set(6, 10, 6);
      // Bright white ambient
      this.ambientLight.color.setHex(0xffffff);
      this.ambientLight.intensity = 1.25;
      // Pale blue fill
      this.fillLight.color.setHex(0xbae6fd);
      this.fillLight.intensity = 0.6;
      // Hide stars
      if (this.starsGroup) {
        this.starsGroup.visible = false;
        const starPoints = this.starsGroup.children[0] as THREE.Points;
        (starPoints.material as THREE.PointsMaterial).opacity = 0;
      }
      // Re-apply energy env sunlight
      this.sunLight.intensity = 0.5 + this.energyEnv.sunlight * 1.5;
    }
  }

  /**
   * Reset camera to isometric sweet spot
   */
  public resetCamera() {
    const aspect = this.camera.aspect;
    if (aspect < 1.0) {
      this.camera.position.set(6.5, 8.0, 7.5);
      this.camera.fov = Math.min(75, 45 / Math.max(aspect, 0.5));
    } else {
      this.camera.position.set(5.5, 6.0, 6.5);
      this.camera.fov = 45;
    }
    this.camera.updateProjectionMatrix();
    this.controls.target.set(0, 0.5, 0);
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

      // Update dynamic states of components (per-frame animations)
      for (const mesh of this.componentMeshes.values()) {
        const anyMesh = mesh as unknown as Record<string, unknown>;
        const realComp = this.currentComponents.find((c) => c.id === mesh.name);

        // ✅ Smooth bulb glow lerp every frame
        if (typeof anyMesh.animateBulb === 'function') {
          (anyMesh.animateBulb as (dt: number) => void)(delta);
        }

        // ✅ Smooth switch lever animation every frame
        if (typeof anyMesh.animateLever === 'function') {
          (anyMesh.animateLever as (dt: number) => void)(delta);
        }

        if (typeof anyMesh.updateMotorState === 'function') {
          // ✅ Use real component state — respects actual isSpinning from circuit analysis
          if (realComp) {
            (anyMesh.updateMotorState as (comp: CircuitComponent, dt: number) => void)(realComp, delta);
          }
        }
        if (typeof anyMesh.updateTurbineState === 'function') {
          const turbComp = realComp ?? ({
            id: mesh.name, type: 'wind_turbine', name: '', position: [0, 0, 0] as [number, number, number],
            state: {}, terminals: [],
          } as CircuitComponent);
          (anyMesh.updateTurbineState as (comp: CircuitComponent, speed: number, dt: number) => void)(
            turbComp, this.energyEnv.windSpeed, delta
          );
        }
        if (typeof anyMesh.updateSolarState === 'function') {
          const solarComp = realComp ?? ({
            id: mesh.name, type: 'solar_panel', name: '', position: [0, 0, 0] as [number, number, number],
            state: {}, terminals: [],
          } as CircuitComponent);
          (anyMesh.updateSolarState as (comp: CircuitComponent, sun: number) => void)(
            solarComp, this.energyEnv.sunlight
          );
        }
        if (typeof anyMesh.updateBuzzerState === 'function') {
          if (realComp) {
            (anyMesh.updateBuzzerState as (c: CircuitComponent, dt: number) => void)(realComp, delta);
          }
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
   * Update component dynamic state meshes (bulbs, switches, motors, buzzers, fuses, etc.)
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
      if (typeof anyMesh.updatePushButtonState === 'function') {
        (anyMesh.updatePushButtonState as (c: CircuitComponent) => void)(comp);
      }
      if (typeof anyMesh.updateFuseState === 'function') {
        (anyMesh.updateFuseState as (c: CircuitComponent) => void)(comp);
      }
      if (typeof anyMesh.updatePotentiometerState === 'function') {
        (anyMesh.updatePotentiometerState as (c: CircuitComponent) => void)(comp);
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
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('pointercancel', this.onPointerUp);
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
