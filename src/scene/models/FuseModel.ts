import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { MATERIALS } from '../materials';
import { CircuitComponent } from '../../types';

export interface FuseObject extends THREE.Group {
  updateFuseState: (comp: CircuitComponent) => void;
}

export function createFuseMesh(comp: CircuitComponent): FuseObject {
  const group = new THREE.Group() as FuseObject;
  group.name = comp.id;
  group.position.set(...comp.position);

  // Insulated base holder with soft rounded edges (White/light cyan plastic)
  const baseGeo = new RoundedBoxGeometry(1.5, 0.12, 0.7, 4, 0.05);
  const baseMesh = new THREE.Mesh(baseGeo, MATERIALS.plasticLightBlue);
  baseMesh.position.y = 0.06;
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  group.add(baseMesh);

  // Two mounting clips for fuse (Silver spring clips with rounded corners)
  const clipMat = MATERIALS.metalSilver;
  const clipGeo = new RoundedBoxGeometry(0.12, 0.22, 0.24, 2, 0.03);
  const leftClip = new THREE.Mesh(clipGeo, clipMat);
  leftClip.position.set(-0.42, 0.2, 0);
  group.add(leftClip);

  const rightClip = new THREE.Mesh(clipGeo, clipMat);
  rightClip.position.set(0.42, 0.2, 0);
  group.add(rightClip);

  // Fuse Glass Cylinder Tube (Horizontal)
  const glassGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.68, 20);
  const glassMesh = new THREE.Mesh(glassGeo, MATERIALS.glassClear.clone());
  glassMesh.rotation.z = Math.PI / 2;
  glassMesh.position.set(0, 0.25, 0);
  group.add(glassMesh);

  // Metal end caps on fuse tube
  const leftCap = new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.145, 0.16, 20), MATERIALS.metalSilver);
  leftCap.rotation.z = Math.PI / 2;
  leftCap.position.set(-0.38, 0.25, 0);
  group.add(leftCap);

  const rightCap = new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.145, 0.16, 20), MATERIALS.metalSilver);
  rightCap.rotation.z = Math.PI / 2;
  rightCap.position.set(0.38, 0.25, 0);
  group.add(rightCap);

  // Internal lead wire filament
  const wireGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.6, 12);
  const wireMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.8,
    roughness: 0.3,
  });
  const filamentMesh = new THREE.Mesh(wireGeo, wireMat);
  filamentMesh.rotation.z = Math.PI / 2;
  filamentMesh.position.set(0, 0.25, 0);
  group.add(filamentMesh);

  // Blown spark / break indicator (small red glow)
  const blownGlowMat = new THREE.MeshBasicMaterial({
    color: 0xef4444,
    transparent: true,
    opacity: 0.0,
  });
  const blownGlow = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), blownGlowMat);
  blownGlow.position.set(0, 0.25, 0);
  group.add(blownGlow);

  // Terminal connection posts
  comp.terminals.forEach((term) => {
    const postGroup = new THREE.Group();
    postGroup.name = `terminal::${comp.id}::${term.id}`;
    postGroup.position.set(...term.relativePosition);

    const postBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, 0.1, 16),
      MATERIALS.metalBrass
    );
    postBase.position.y = 0.05;
    postGroup.add(postBase);

    const postTop = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 16, 12),
      MATERIALS.metalSilver
    );
    postTop.position.y = 0.14;
    postGroup.add(postTop);

    // Glowing selection halo
    const haloGeo = new THREE.TorusGeometry(0.16, 0.03, 8, 20);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.9,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.rotation.x = Math.PI / 2;
    haloMesh.position.y = 0.14;
    haloMesh.name = `halo::${comp.id}::${term.id}`;
    haloMesh.visible = false;
    postGroup.add(haloMesh);

    group.add(postGroup);
  });

  group.updateFuseState = (updatedComp: CircuitComponent) => {
    const isBlown = !!updatedComp.state.isBlown;
    if (isBlown) {
      wireMat.color.setHex(0x334155);
      blownGlowMat.opacity = 0.9;
      filamentMesh.scale.set(0.2, 0.2, 0.2); // Broken wire
    } else {
      wireMat.color.setHex(0x94a3b8);
      blownGlowMat.opacity = 0.0;
      filamentMesh.scale.set(1, 1, 1);
    }
  };

  return group;
}
