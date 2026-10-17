import * as THREE from 'three';
import { MATERIALS } from '../materials';
import { CircuitComponent } from '../../types';

export function createBatteryPackMesh(comp: CircuitComponent): THREE.Group {
  const group = new THREE.Group();
  group.name = comp.id;
  group.position.set(...comp.position);

  // Double battery holder base tray (Black durable plastic)
  const trayGeo = new THREE.BoxGeometry(1.6, 0.16, 1.2);
  const trayMesh = new THREE.Mesh(trayGeo, MATERIALS.plasticDark);
  trayMesh.position.y = 0.08;
  trayMesh.castShadow = true;
  trayMesh.receiveShadow = true;
  group.add(trayMesh);

  // Center divider rib
  const ribGeo = new THREE.BoxGeometry(1.4, 0.18, 0.08);
  const ribMesh = new THREE.Mesh(ribGeo, MATERIALS.plasticDark);
  ribMesh.position.set(0, 0.17, 0);
  group.add(ribMesh);

  // 2 AA Batteries lying side-by-side
  const zOffsets = [-0.32, 0.32];
  zOffsets.forEach((zOffset, idx) => {
    // Battery cylinder
    const cellGeo = new THREE.CylinderGeometry(0.24, 0.24, 1.15, 24);
    const cellMesh = new THREE.Mesh(cellGeo, idx === 0 ? MATERIALS.plasticBlue : MATERIALS.plasticGreen);
    cellMesh.rotation.z = Math.PI / 2;
    cellMesh.position.set(0, 0.28, zOffset);
    cellMesh.castShadow = true;
    group.add(cellMesh);

    // Yellow decorative label band
    const bandGeo = new THREE.CylinderGeometry(0.242, 0.242, 0.45, 24);
    const bandMesh = new THREE.Mesh(bandGeo, MATERIALS.plasticYellow);
    bandMesh.rotation.z = Math.PI / 2;
    bandMesh.position.set(0, 0.28, zOffset);
    group.add(bandMesh);

    // Negative terminal spring end (Silver)
    const negCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.06, 20),
      MATERIALS.metalSilver
    );
    negCap.rotation.z = Math.PI / 2;
    negCap.position.set(-0.58, 0.28, zOffset);
    group.add(negCap);

    // Positive terminal nipple (+)
    const posNipple = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, 0.12, 16),
      MATERIALS.metalBrass
    );
    posNipple.rotation.z = Math.PI / 2;
    posNipple.position.set(0.6, 0.28, zOffset);
    group.add(posNipple);
  });

  // Series bridge busbar on left side connecting cell 1 and cell 2
  const bridgeGeo = new THREE.BoxGeometry(0.08, 0.12, 0.68);
  const bridgeMesh = new THREE.Mesh(bridgeGeo, MATERIALS.metalSilver);
  bridgeMesh.position.set(-0.62, 0.28, 0);
  group.add(bridgeMesh);

  // Prominent "3V" badge
  const badgeGeo = new THREE.BoxGeometry(0.5, 0.02, 0.3);
  const badgeMesh = new THREE.Mesh(badgeGeo, MATERIALS.plasticYellow);
  badgeMesh.position.set(0, 0.17, 0);
  group.add(badgeMesh);

  // Terminal connection posts
  comp.terminals.forEach((term) => {
    const postGroup = new THREE.Group();
    postGroup.name = `terminal::${comp.id}::${term.id}`;
    postGroup.position.set(...term.relativePosition);

    const isPos = term.polarity === 'positive';
    const baseColor = isPos ? MATERIALS.plasticRed : MATERIALS.plasticDark;

    const postBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.12, 16),
      baseColor
    );
    postBase.position.y = 0.06;
    postGroup.add(postBase);

    const postTop = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 16, 12),
      MATERIALS.metalBrass
    );
    postTop.position.y = 0.16;
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
    haloMesh.position.y = 0.16;
    haloMesh.name = `halo::${comp.id}::${term.id}`;
    haloMesh.visible = false;
    postGroup.add(haloMesh);

    group.add(postGroup);
  });

  return group;
}
