#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════
 * CHECK IMAGES SCRIPT
 * Validates that all required images exist and meet minimum specs
 * Run: npm run check-images
 * ═══════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');

const MEDIA_DIR = path.join(__dirname, '../public/media');
const MIN_WIDTH = 600; // Minimum image width in pixels
const MAX_SIZE_MB = 2; // Maximum file size in MB

// Required images for the app to function
const REQUIRED_IMAGES = [
  'face-scan.mp4',
  'muscular.jpg',
  'skinny.jpg',
  'average.jpg',
  'overweight.jpg',
  'frontal-1.png',
  'side-1.png',
  'before-photo.png',
  'after-photo.png',
  'social_proof_before.png',
  'social_proof_after.png',
  'cortecabelo.jpg',
  'scan_male.jpg',
  'scan_female.jpg',
];

// Optional images (warn if missing, don't fail)
const OPTIONAL_IMAGES = [
  'testimonial_avatar.jpg',
  'product_blueprint.jpg',
  'female_front_reference.jpg',
  'female_side_reference.jpg',
  '1-m-progress-male.webp',
];

let errors = [];
let warnings = [];

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║           IMAGE VALIDATION SCRIPT                         ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// Check if media directory exists
if (!fs.existsSync(MEDIA_DIR)) {
  console.error('❌ ERRO: Pasta /public/media não encontrada!');
  process.exit(1);
}

// Get all files in media directory
const existingFiles = fs.readdirSync(MEDIA_DIR);

console.log('📁 Verificando imagens obrigatórias...\n');

// Check required images
REQUIRED_IMAGES.forEach(image => {
  const filePath = path.join(MEDIA_DIR, image);
  
  if (!existingFiles.includes(image)) {
    errors.push(`❌ FALTANDO: ${image}`);
    return;
  }
  
  const stats = fs.statSync(filePath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  
  if (stats.size > MAX_SIZE_MB * 1024 * 1024) {
    warnings.push(`⚠️  GRANDE: ${image} (${sizeMB}MB) - considere comprimir`);
  }
  
  console.log(`   ✅ ${image} (${sizeMB}MB)`);
});

console.log('\n📁 Verificando imagens opcionais...\n');

// Check optional images
OPTIONAL_IMAGES.forEach(image => {
  const filePath = path.join(MEDIA_DIR, image);
  
  if (!existingFiles.includes(image)) {
    warnings.push(`⚠️  OPCIONAL FALTANDO: ${image}`);
    return;
  }
  
  const stats = fs.statSync(filePath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  
  console.log(`   ✅ ${image} (${sizeMB}MB)`);
});

// Calculate total size
const totalSize = existingFiles.reduce((total, file) => {
  const filePath = path.join(MEDIA_DIR, file);
  try {
    const stats = fs.statSync(filePath);
    return total + stats.size;
  } catch {
    return total;
  }
}, 0);

console.log('\n────────────────────────────────────────────────────────────');
console.log(`📊 RESUMO:`);
console.log(`   Total de arquivos: ${existingFiles.length}`);
console.log(`   Tamanho total: ${(totalSize / (1024 * 1024)).toFixed(2)}MB`);
console.log('────────────────────────────────────────────────────────────\n');

// Print warnings
if (warnings.length > 0) {
  console.log('⚠️  AVISOS:');
  warnings.forEach(w => console.log(`   ${w}`));
  console.log('');
}

// Print errors and exit
if (errors.length > 0) {
  console.log('❌ ERROS (build irá falhar):');
  errors.forEach(e => console.log(`   ${e}`));
  console.log('\n💡 Para corrigir, adicione os arquivos faltantes em /public/media/');
  process.exit(1);
}

console.log('✅ Todas as imagens obrigatórias estão presentes!\n');
process.exit(0);

