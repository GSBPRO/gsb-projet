import { useEffect, useState } from 'react';

// Largeur d'une « colonne » de la carte des hauteurs, en pixels.
const COLUMN_WIDTH = 8;
// Nombre de positions essayées pour chaque gélule : on garde la plus basse, le tas reste régulier.
const CANDIDATES = 6;
// Environ 3 couches de gélules sur toute la largeur (une gélule couchée occupe ~50 px).
const PILLS_PER_PIXEL = 3 / 50;

// Le tas est gardé ici, en dehors du composant. Quand on quitte l'accueil puis qu'on y revient,
// React recrée le composant, mais le tas est retrouvé : les gélules ne retombent pas.
// (En mémoire seulement : il est perdu si on actualise la page, comme la connexion.)
let savedPile = null;

// Fait tomber des gélules une par une ; chacune se pose sur le tas déjà formé.
// containerRef : la zone où elles tombent (on a besoin de sa largeur et de sa hauteur).
export default function usePillPile(containerRef, { spawnEvery = 150, maxPileRatio = 0.3 } = {}) {
  const [pills, setPills] = useState([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let pile = null;

    function createEmptyPile() {
      const width = container.clientWidth;
      return {
        width,
        height: container.clientHeight,
        // Hauteur du tas pour chaque colonne : c'est ce qui permet aux gélules de s'empiler.
        pileHeights: new Array(Math.ceil(width / COLUMN_WIDTH)).fill(0),
        // Plus l'écran est large, plus il faut de gélules pour couvrir tout le bas.
        maxPills: Math.round(width * PILLS_PER_PIXEL),
        pills: [],
        nextId: 0,
      };
    }

    function start() {
      // « pills.length > 0 » : on a déjà vu la pluie. Sans ce test, le double lancement des effets
      // de React en développement (StrictMode) compléterait le tas dès la première visite.
      const canReuse = savedPile && savedPile.pills.length > 0 && savedPile.width === container.clientWidth;
      if (canReuse) {
        // Retour sur l'accueil : les gélules déjà tombées sont replacées directement sur le tas,
        // sans rejouer leur chute. On recalcule leur hauteur au cas où la zone n'a plus la même
        // hauteur (ex. : barre d'adresse mobile).
        const height = container.clientHeight;
        savedPile.height = height;
        savedPile.pills = savedPile.pills.map((pill) => restPill(pill, height));
        pile = savedPile;
        // Si on était parti avant la fin, on complète le tas d'un coup : rien ne retombe du haut.
        while (canDropMore()) addPill(true);
      } else {
        // Première visite : le tas est vide, la pluie commence.
        pile = createEmptyPile();
        savedPile = pile;
      }
      setPills(pile.pills);
    }

    function canDropMore() {
      const pileIsFull = Math.max(...pile.pileHeights) > pile.height * maxPileRatio;
      return pile.pills.length < pile.maxPills && !pileIsFull;
    }

    // isInstant : la gélule est posée directement sur le tas, sans tomber.
    function addPill(isInstant) {
      const pill = createPill(pile.nextId, pile.width, pile.height, pile.pileHeights);
      pile.nextId += 1;
      const placedPill = isInstant
        ? restPill(pill, pile.height)
        : // Moment où la gélule sera posée : avant, elle tombe encore et ne doit pas réagir à la souris.
          { ...pill, landedAt: performance.now() + pill.duration * 1000 };
      pile.pills = [...pile.pills, placedPill];
    }

    function dropPill() {
      if (!canDropMore()) return;
      addPill(false);
      setPills(pile.pills);
    }

    start();
    const timer = setInterval(dropPill, spawnEvery);

    // Si la fenêtre change de taille, le tas ne correspond plus : on recommence (après 300 ms de calme).
    let resizeTimer = 0;
    function handleResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (container.clientWidth === pile.width) return; // seule la hauteur a bougé : on garde le tas
        savedPile = null;
        start();
      }, 300);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(timer);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [containerRef, spawnEvery, maxPileRatio]);

  return pills;
}

// Une gélule déjà tombée : directement à sa place (durée 0 = pas d'animation de chute).
function restPill(pill, height) {
  return {
    ...pill,
    restY: height - pill.restBottom,
    landY: height - pill.restBottom - pill.length / 2,
    duration: 0,
    landedAt: 0,
  };
}

// Pour une position donnée : quelles colonnes la gélule couvre, et à quelle hauteur elle se poserait
// (sur le point le plus haut du tas sous elle).
function measureSpot(centerX, length, pileHeights) {
  const firstColumn = Math.max(0, Math.floor((centerX - length / 2) / COLUMN_WIDTH));
  const lastColumn = Math.min(pileHeights.length - 1, Math.floor((centerX + length / 2) / COLUMN_WIDTH));
  let base = 0;
  for (let column = firstColumn; column <= lastColumn; column += 1) {
    base = Math.max(base, pileHeights[column]);
  }
  return { centerX, firstColumn, lastColumn, base };
}

// Calcule où une nouvelle gélule va se poser, et met à jour la hauteur du tas.
function createPill(id, width, height, pileHeights) {
  const thickness = 14 + Math.random() * 16; // 14 à 30 px
  const length = thickness * 2.4;
  const restAngle = 90 + (Math.random() - 0.5) * 40; // presque à plat (90° = couchée)

  // On essaie plusieurs positions au hasard et on garde celle où le tas est le plus bas :
  // les creux se remplissent en premier, le tas s'étale sur toute la largeur.
  let best = null;
  for (let attempt = 0; attempt < CANDIDATES; attempt += 1) {
    const centerX = length / 2 + Math.random() * (width - length);
    const spot = measureSpot(centerX, length, pileHeights);
    if (!best || spot.base < best.base) best = spot;
  }
  const { centerX, firstColumn, lastColumn, base } = best;

  // Le tas monte d'un peu moins que l'épaisseur : les gélules s'imbriquent légèrement.
  for (let column = firstColumn; column <= lastColumn; column += 1) {
    pileHeights[column] = base + thickness * 0.8;
  }

  // L'élément est une gélule debout, tournée de restAngle autour de son centre :
  // on place son centre à « base + demi-épaisseur » au-dessus du bas de la zone.
  const landY = height - base - thickness / 2 - length / 2;

  return {
    id,
    // Centre de la gélule une fois posée : sert à savoir si la souris passe dessus.
    restX: centerX,
    restY: height - base - thickness / 2,
    restBottom: base + thickness / 2, // distance du centre au bas de la zone (ne dépend pas de la hauteur)
    left: centerX - thickness / 2,
    thickness,
    length,
    landY,
    startRotate: Math.random() * 360,
    endRotate: restAngle + 360, // un tour complet pendant la chute
    drift: (Math.random() - 0.5) * 80,
    duration: 1.6 + Math.random() * 1.2,
  };
}
