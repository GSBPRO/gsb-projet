import {
  ACESFilmicToneMapping,
  Box3,
  CylinderGeometry,
  Group,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Quaternion,
  Scene,
  Sphere,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { buildMolecule } from './moleculeModel.js';

// Crée la scène 3D de la molécule de verre dans « container » et renvoie de quoi l'animer et la détruire.
export function createMoleculeScene(container) {
  // alpha : fond transparent, la molécule flotte sur le paysage de la page.
  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // au-delà de 2, coût élevé pour un gain invisible
  renderer.toneMapping = ACESFilmicToneMapping;
  container.appendChild(renderer.domElement);

  const scene = new Scene();

  // Les reflets viennent d'un « studio photo » généré par Three.js : aucun fichier externe à télécharger.
  const pmrem = new PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = environment;

  // Sa distance est calculée dans resize(), selon la taille de la zone.
  const camera = new PerspectiveCamera(35, 1, 0.1, 100);

  // Verre bleu glacier : bleu soutenu, très lisse et très réfléchissant (reflets nets, comme du verre poli).
  const glass = new MeshPhysicalMaterial({
    color: 0x5fb0de,
    metalness: 0.55,
    roughness: 0.02,
    clearcoat: 1,
    clearcoatRoughness: 0.01,
    iridescence: 0.35, // légers reflets turquoise, comme sur une bulle de savon
    envMapIntensity: 2.6,
    transparent: true,
    opacity: 0.9,
  });
  // Liaisons argentées, façon chrome.
  const chrome = new MeshPhysicalMaterial({
    color: 0xcfe6f2,
    metalness: 1,
    roughness: 0.12,
    envMapIntensity: 1.5,
  });

  // Une seule géométrie de sphère et une de cylindre, réutilisées et redimensionnées : plus léger.
  const sphere = new SphereGeometry(1, 48, 48);
  const cylinder = new CylinderGeometry(0.045, 0.045, 1, 20);

  const molecule = new Group();
  const { atoms, bonds } = buildMolecule();

  atoms.forEach(({ position, radius }) => {
    const mesh = new Mesh(sphere, glass);
    mesh.position.copy(position);
    mesh.scale.setScalar(radius);
    molecule.add(mesh);
  });

  const up = new Vector3(0, 1, 0);
  bonds.forEach(([a, b]) => {
    const start = atoms[a].position;
    const end = atoms[b].position;
    const direction = end.clone().sub(start);
    const mesh = new Mesh(cylinder, chrome);
    // Le cylindre est vertical par défaut : on le place au milieu des deux atomes et on l'oriente vers le second.
    mesh.position.copy(start).add(end).multiplyScalar(0.5);
    mesh.quaternion.copy(new Quaternion().setFromUnitVectors(up, direction.clone().normalize()));
    mesh.scale.set(1, direction.length(), 1);
    molecule.add(mesh);
  });

  // Sphère qui englobe toute la molécule : quelle que soit sa rotation, elle reste dedans.
  // On recentre la molécule sur cette sphère pour qu'elle tourne autour de son propre centre.
  const bounds = new Box3().setFromObject(molecule).getBoundingSphere(new Sphere());
  molecule.children.forEach((child) => child.position.sub(bounds.center));
  // + 0,2 : marge pour le flottement de haut en bas.
  const moleculeRadius = bounds.radius + 0.2;

  scene.add(molecule);

  // Part de la zone occupée par la molécule (0,42 = son rayon vaut 42 % du plus petit côté de la zone).
  const FILL_RATIO = 0.42;

  function resize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;

    // On place la caméra à la distance où la sphère englobante fait la taille voulue à l'écran.
    // Comme la zone est plus grande que cette sphère, aucun atome n'est coupé, même en tournant.
    const radiusOnScreen = Math.min(width, height) * FILL_RATIO;
    const halfFov = MathUtils.degToRad(camera.fov / 2);
    camera.position.z = (moleculeRadius * (height / 2)) / (radiusOnScreen * Math.tan(halfFov));
    camera.updateProjectionMatrix();
  }

  // Inclinaison actuelle, qui rattrape doucement celle demandée par la souris (pas d'à-coups).
  const tilt = { x: 0, y: 0 };

  // time : secondes écoulées. pointer : position de la souris entre -0,5 et +0,5.
  function update(time, pointer) {
    tilt.x = MathUtils.lerp(tilt.x, pointer.y * 0.5, 0.05);
    tilt.y = MathUtils.lerp(tilt.y, pointer.x * 0.8, 0.05);
    molecule.rotation.y = time * 0.2 + tilt.y; // rotation lente + souris
    molecule.rotation.x = Math.sin(time * 0.4) * 0.15 + tilt.x;
    molecule.position.y = Math.sin(time * 0.8) * 0.15; // flottement
    renderer.render(scene, camera);
  }

  // Libère la mémoire de la carte graphique quand on quitte la page.
  function dispose() {
    sphere.dispose();
    cylinder.dispose();
    glass.dispose();
    chrome.dispose();
    environment.dispose();
    pmrem.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  }

  return { resize, update, dispose };
}
