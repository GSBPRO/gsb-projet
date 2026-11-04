// Calcule, une seule fois au chargement du fichier, tous les petits points qui forment la molécule du loader.
// Chaque point a sa place finale (x, y) et un point de départ éparpillé (fromX, fromY) d'où il arrive.
// Coordonnées dans un dessin de 240 × 200 (le viewBox du SVG).

const RING_RADIUS = 34;
const BOND_DOT_SPACING = 7; // écart entre deux points le long d'une liaison
const ATOM_CLUSTER_RADIUS = 5; // un atome = un point central + une couronne de 6 points

// --- La forme : deux hexagones accolés (comme sur les schémas de médicaments) et des ramifications ---
function hexagon(centerX, centerY) {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = -Math.PI / 2 + (i * Math.PI) / 3; // pointe vers le haut
    return { x: centerX + Math.cos(angle) * RING_RADIUS, y: centerY + Math.sin(angle) * RING_RADIUS };
  });
}

const leftRing = hexagon(92, 104);
// Le deuxième cycle partage un côté avec le premier : son centre est décalé de « rayon × √3 ».
const rightRing = hexagon(92 + RING_RADIUS * Math.sqrt(3), 104);

const atoms = [...leftRing, rightRing[0], rightRing[1], rightRing[2], rightRing[3]];
// Indices dans « atoms » : 0-5 = cycle gauche ; 6-9 = les 4 atomes propres au cycle droit.
const bonds = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], // cycle gauche
  [1, 6], [6, 7], [7, 8], [8, 9], [9, 2], // cycle droit (il partage le côté 1-2)
];

// Ramifications : un atome de plus, à l'extérieur, relié à un atome du cycle.
function addBranch(fromIndex, dx, dy) {
  atoms.push({ x: atoms[fromIndex].x + dx, y: atoms[fromIndex].y + dy });
  bonds.push([fromIndex, atoms.length - 1]);
}
addBranch(0, 0, -30);
addBranch(4, -26, 15);
addBranch(7, 26, 15);
addBranch(8, 0, 30);

// --- Transformation en points ---
function scatter() {
  // Départ : quelque part autour, pas trop loin (40 à 90 unités) pour un mouvement doux.
  const angle = Math.random() * Math.PI * 2;
  const distance = 40 + Math.random() * 50;
  return { fromX: Math.cos(angle) * distance, fromY: Math.sin(angle) * distance };
}

const dots = [];

atoms.forEach((atom) => {
  dots.push({ x: atom.x, y: atom.y, radius: 2.6, isAtom: true, ...scatter() });
  for (let i = 0; i < 6; i += 1) {
    const angle = (i * Math.PI) / 3;
    dots.push({
      x: atom.x + Math.cos(angle) * ATOM_CLUSTER_RADIUS,
      y: atom.y + Math.sin(angle) * ATOM_CLUSTER_RADIUS,
      radius: 1.4,
      isAtom: true,
      ...scatter(),
    });
  }
});

bonds.forEach(([a, b]) => {
  const start = atoms[a];
  const end = atoms[b];
  const length = Math.hypot(end.x - start.x, end.y - start.y);
  const count = Math.floor(length / BOND_DOT_SPACING);
  // On évite les deux extrémités (elles sont déjà occupées par les atomes).
  for (let i = 1; i < count; i += 1) {
    const t = i / count;
    dots.push({
      x: start.x + (end.x - start.x) * t,
      y: start.y + (end.y - start.y) * t,
      radius: 1.2,
      isAtom: false,
      ...scatter(),
    });
  }
});

// Retard de chaque point : une vague qui part du centre de la molécule vers l'extérieur.
// Plus un point est loin du centre, plus il arrive tard (de 0 à 0,9 s), avec un peu de hasard
// pour que la vague reste naturelle. C'est ce qui rend la formation progressive.
const centerX = dots.reduce((sum, dot) => sum + dot.x, 0) / dots.length;
const centerY = dots.reduce((sum, dot) => sum + dot.y, 0) / dots.length;
const farthest = Math.max(...dots.map((dot) => Math.hypot(dot.x - centerX, dot.y - centerY)));
dots.forEach((dot) => {
  const distance = Math.hypot(dot.x - centerX, dot.y - centerY);
  dot.delay = (distance / farthest) * 0.9 + Math.random() * 0.15;
});

export const MOLECULE_DOTS = dots;
