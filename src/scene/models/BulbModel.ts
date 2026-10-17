import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { MATERIALS } from '../materials';
import { CircuitComponent } from '../../types';

export interface BulbObject extends THREE.Group {
  updateBulbState: (comp: CircuitComponent) => void;
}

export function createBulbMesh(comp: CircuitComponent): BulbObject {
  const group = new THREE.Group() as BulbObject;
  group.name = comp.id;
  group.position.set(...comp.position);

  // Insulated base stand with soft rounded squircle shape
  const baseGeo = new RoundedBoxGeometry(1.2, 0.14, 0.9, 4, 0.08);
  const baseMesh = new THREE.Mesh(baseGeo, MATERIALS.plasticLightBlue);
  baseMesh.position.y = 0.07;
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  group.add(baseMesh);

  // Socket metal screw base
  const socketGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.28, 20);
  const socketMesh = new THREE.Mesh(socketGeo, MATERIALS.metalBrass);
  socketMesh.position.y = 0.24;
  socketMesh.castShadow = true;
  group.add(socketMesh);

  // Bulb Glass Globe
  const glassGeo = new THREE.SphereGeometry(0.42, 32, 24);
  glassGeo.scale(1, 1.25, 1);
  const glassMesh = new THREE.Mesh(glassGeo, MATERIALS.glassClear.clone());
  glassMesh.position.y = 0.68;
  glassMesh.castShadow = true;
  group.add(glassMesh);

  // Filament support wires (Two vertical metal posts)
  const supportMat = MATERIALS.metalSilver;
  const post1 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.25), supportMat);
  post1.position.set(-0.08, 0.52, 0);
  group.add(post1);

  const post2 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.25), supportMat);
  post2.position.set(0.08, 0.52, 0);
  group.add(post2);

  // Coiled Filament Loop
  const filamentCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.08, 0.64, 0),
    new THREE.Vector3(-0.04, 0.72, 0.02),
    new THREE.Vector3(0, 0.75, -0.01),
    new THREE.Vector3(0.04, 0.72, 0.02),
    new THREE.Vector3(0.08, 0.64, 0),
  ]);
  const filamentGeo = new THREE.TubeGeometry(filamentCurve, 16, 0.016, 8, false);
  const filamentMat = MATERIALS.filamentOff.clone();
  const filamentMesh = new THREE.Mesh(filamentGeo, filamentMat);
  group.add(filamentMesh);

  // Point Light for dynamic warm glow
  const light = new THREE.PointLight(0xffb703, 0, 8, 1.5);
  light.position.set(0, 0.7, 0);
  light.castShadow = false; // Keep smooth performance
  group.add(light);

  // Outer soft glow aura sphere
  const glowGeo = new THREE.SphereGeometry(0.55, 16, 16);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xfde047,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
  });
  const glowMesh = new THREE.Mesh(glowGeo, glowMat);
  glowMesh.position.y = 0.68;
  group.add(glowMesh);

  // Terminal connection posts
  comp.terminals.forEach((term) => {
    const postGroup = new THREE.Group();
    postGroup.name = `terminal::${comp.id}::${term.id}`;
    postGroup.position.set(...term.relativePosition);

    const pGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.2, 16);
    const pMesh = new THREE.Mesh(pGeo, MATERIALS.metalBrass);
    pMesh.castShadow = true;
    postGroup.add(pMesh);

    const capGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16);
    const capMesh = new THREE.Mesh(capGeo, MATERIALS.plasticLightBlue);
    capMesh.position.y = 0.12;
    postGroup.add(capMesh);

    // Generous invisible click hitbox
    const hitBox = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 8, 8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.name = `terminal::${comp.id}::${term.id}`;
    postGroup.add(hitBox);

    const haloGeo = new THREE.RingGeometry(0.14, 0.26, 20);
    const haloMesh = new THREE.Mesh(haloGeo, MATERIALS.terminalHighlight);
    haloMesh.rotation.x = -Math.PI / 2;
    haloMesh.position.y = 0.16;
    haloMesh.visible = false;
    haloMesh.name = `halo::${comp.id}::${term.id}`;
    postGroup.add(haloMesh);

    group.add(postGroup);
  });

  // State update handler
  group.updateBulbState = (currentComp: CircuitComponent) => {
    const isLit = currentComp.state.isLit ?? false;
    const targetBrightness = isLit ? (currentComp.state.brightness ?? 1.0) : 0;

    light.intensity = THREE.MathUtils.lerp(light.intensity, targetBrightness * 3.5, 0.15);
    glowMat.opacity = THREE.MathUtils.lerp(glowMat.opacity, isLit ? 0.45 : 0, 0.15);

    if (isLit) {
      filamentMat.color.setHex(0xfffbeb);
      filamentMat.emissive.setHex(0xf59e0b);
      filamentMat.emissiveIntensity = 3.0;
    } else {
      filamentMat.color.setHex(0x78716c);
      filamentMat.emissive.setHex(0x000000);
      filamentMat.emissiveIntensity = 0;
    }
  };

  return group;
}
