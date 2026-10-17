import * as THREE from 'three';

// Reusable PBR materials with a playful, bright educational palette
export const MATERIALS = {
  // Plastic Colors
  plasticBlue: new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.35,
    metalness: 0.05,
  }),
  plasticLightBlue: new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.35,
    metalness: 0.05,
  }),
  plasticRed: new THREE.MeshStandardMaterial({
    color: 0xef4444,
    roughness: 0.35,
    metalness: 0.05,
  }),
  plasticGreen: new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    roughness: 0.4,
    metalness: 0.05,
  }),
  plasticYellow: new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    roughness: 0.35,
    metalness: 0.05,
  }),
  plasticOrange: new THREE.MeshStandardMaterial({
    color: 0xf97316,
    roughness: 0.35,
    metalness: 0.05,
  }),
  plasticWhite: new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.25,
    metalness: 0.05,
  }),
  plasticDark: new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.5,
    metalness: 0.1,
  }),

  // Metals
  metalBrass: new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.25,
    metalness: 0.85,
  }),
  metalSilver: new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.2,
    metalness: 0.9,
  }),
  metalDark: new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.3,
    metalness: 0.8,
  }),

  // Terminal Pins & Posts
  terminalPositive: new THREE.MeshStandardMaterial({
    color: 0xef4444,
    roughness: 0.25,
    metalness: 0.6,
  }),
  terminalNegative: new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.25,
    metalness: 0.6,
  }),
  terminalNeutral: new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.25,
    metalness: 0.8,
  }),
  terminalHighlight: new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    wireframe: false,
    transparent: true,
    opacity: 0.85,
  }),

  // Glass & Lighting
  glassClear: new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.35,
    roughness: 0.1,
    transmission: 0.85,
    ior: 1.5,
    reflectivity: 0.5,
  }),
  filamentOff: new THREE.MeshStandardMaterial({
    color: 0x78716c,
    roughness: 0.5,
    metalness: 0.6,
  }),
  filamentLit: new THREE.MeshBasicMaterial({
    color: 0xffedd5,
  }),

  // Solar Photovoltaic Cell
  solarCell: new THREE.MeshStandardMaterial({
    color: 0x1d4ed8,
    roughness: 0.2,
    metalness: 0.3,
  }),
  solarGridLine: new THREE.MeshBasicMaterial({
    color: 0xffffff,
  }),

  // Diorama Environment
  grassGround: new THREE.MeshStandardMaterial({
    color: 0x4ade80,
    roughness: 0.7,
    metalness: 0.05,
  }),
  soilBase: new THREE.MeshStandardMaterial({
    color: 0x854d0e,
    roughness: 0.85,
    metalness: 0.05,
  }),
  woodTrim: new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.6,
    metalness: 0.05,
  }),
  treeLeaves: new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    roughness: 0.5,
    metalness: 0.05,
  }),
  treeTrunk: new THREE.MeshStandardMaterial({
    color: 0x78350f,
    roughness: 0.8,
    metalness: 0.05,
  }),

  // Wire Materials
  wireRed: new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 }),
  wireBlack: new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 }),
  wireBlue: new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.4 }),
  wireYellow: new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.4 }),
  wireGreen: new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.4 }),

  // Current Particle
  currentParticle: new THREE.MeshBasicMaterial({
    color: 0xfef08a,
    transparent: true,
    opacity: 0.95,
  }),
};
