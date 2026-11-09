// COPIA de Appark-main apps/mobile/src/services/imageType.ts (panel web, appark.es/panel).
// Si cambias uno, cambia el otro: la app y la web tienen que contar lo mismo.
/**
 * El formato de una imagen leído de sus primeros bytes, no de lo que diga
 * el selector de fotos.
 *
 * Con el recorte activado, el selector devuelve el base64 como JPEG
 * aunque la foto fuera PNG (en iPhone, siempre). Se subían ficheros JPEG
 * llamados .png y servidos como image/png. null = no se reconoce.
 *
 * Sin imports: lo cargan los tests de `node --test`.
 */
export function sniffedImageType(bytes: Uint8Array): 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (bytes.length >= 4 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'image/png';
  if (bytes.length >= 3 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return 'image/gif';
  if (bytes.length >= 12 && bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46
      && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return 'image/webp';
  return null;
}
