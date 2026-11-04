import { Vector3 } from 'three';

// Forme de la molécule : uniquement des positions (atomes) et des paires d'atomes reliés (liaisons).
// Aucun affichage ici : ce fichier décrit la molécule, createMoleculeScene.js la dessine.
// Inspirée des cycles « hexagonaux » qu'on voit sur les schémas de médicaments.

const RING_ATOM = 0.3;
const BRANCH_ATOM = 0.22;
const HYDROGEN = 0.12;

export function buildMolecule() {
  const atoms = []; // { position: Vector3, radius }
  const bonds = []; // [indexAtomeA, indexAtomeB]

  function addAtom(position, radius) {
    atoms.push({ position, radius });
    return atoms.length - 1;
  }

  // Cycle à 6 atomes (hexagone), légèrement en zigzag pour ne pas paraître plat.
  function addRing(center, radius) {
    const ids = [];
    for (let i = 0; i < 6; i += 1) {
      const angle = Math.PI / 6 + (i * Math.PI) / 3;
      const zigzag = i % 2 === 0 ? -0.15 : 0.15;
      const position = new Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, zigzag).add(center);
      ids.push(addAtom(position, RING_ATOM));
    }
    ids.forEach((id, i) => bonds.push([id, ids[(i + 1) % 6]]));
    return ids;
  }

  // Ramification qui part d'un atome du cycle, vers l'extérieur, avec quelques petits atomes au bout.
  function addBranch(fromId, ringCenter, hydrogens) {
    const from = atoms[fromId].position;
    const direction = from.clone().sub(ringCenter).normalize();
    const branchId = addAtom(from.clone().addScaledVector(direction, 0.95), BRANCH_ATOM);
    bonds.push([fromId, branchId]);

    // Les petits atomes se répartissent en éventail autour de la direction de la ramification.
    const side = new Vector3().crossVectors(direction, new Vector3(0, 0, 1)).normalize();
    const depth = new Vector3().crossVectors(direction, side).normalize();
    for (let i = 0; i < hydrogens; i += 1) {
      const angle = (i * 2 * Math.PI) / hydrogens;
      const spread = direction
        .clone()
        .multiplyScalar(0.7)
        .addScaledVector(side, Math.cos(angle))
        .addScaledVector(depth, Math.sin(angle))
        .normalize();
      const hydrogenId = addAtom(atoms[branchId].position.clone().addScaledVector(spread, 0.55), HYDROGEN);
      bonds.push([branchId, hydrogenId]);
    }
  }

  const centerA = new Vector3(-0.85, -0.75, 0);
  const centerB = new Vector3(0.95, 0.85, 0.2);
  const ringA = addRing(centerA, 1.0);
  const ringB = addRing(centerB, 1.0);

  // Liaison entre les deux cycles
  bonds.push([ringA[0], ringB[3]]);

  addBranch(ringA[2], centerA, 3);
  addBranch(ringA[4], centerA, 2);
  addBranch(ringB[0], centerB, 3);
  addBranch(ringB[1], centerB, 0);
  addBranch(ringB[5], centerB, 2);

  return { atoms, bonds };
}
