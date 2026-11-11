// Lecture d'une image choisie par l'utilisateur (proposition de produit, F29).
// On ne fait jamais confiance au fichier : type contrôlé, taille limitée, puis image réduite et ré-encodée
// par le navigateur (canvas). Un fichier déguisé en image échoue ici et n'est jamais affiché tel quel.
// Le serveur devra refaire ces contrôles (type réel du fichier, taille, analyse) : ils se contournent.

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const IMAGE_MAX_BYTES = 3 * 1024 * 1024;
// 480 px suffit pour une carte produit et garde l'image légère (le localStorage est limité à ~5 Mo).
const MAX_SIDE = 480;

export class ImageError extends Error {}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new ImageError('Ce fichier n’est pas une image lisible.'));
    image.src = url;
  });
}

// Renvoie l'image réduite sous forme d'adresse « data: » utilisable dans <img src>.
export async function readProductImage(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new ImageError('Format non accepté : choisissez une image JPEG, PNG ou WebP.');
  }
  if (file.size > IMAGE_MAX_BYTES) {
    throw new ImageError('Image trop lourde : 3 Mo maximum.');
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await loadImage(objectUrl);
    const scale = Math.min(1, MAX_SIDE / Math.max(image.width, image.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/webp', 0.8);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

// Une image de produit est soit un fichier du site (/produits/…), soit une image réduite ci-dessus.
// Tout autre texte (lien externe, javascript:…) est refusé.
export function isAcceptedImage(value) {
  return typeof value === 'string' && (value.startsWith('/produits/') || /^data:image\/(webp|jpeg|png);base64,/.test(value));
}
