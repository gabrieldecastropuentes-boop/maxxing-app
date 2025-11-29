const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './public/media';
const sizes = [320, 480, 768, 1024, 1440, 1920];

async function convertImage(inputPath, outputBase, format) {
  const ext = format === 'webp' ? '.webp' : '.avif';
  const promises = [];

  for (const width of sizes) {
    const outputPath = path.join(
      path.dirname(inputPath),
      `${outputBase}-${width}w${ext}`
    );

    try {
      const metadata = await sharp(inputPath).metadata();
      const shouldResize = metadata.width > width;

      if (shouldResize) {
        await sharp(inputPath)
          .resize(width, null, { withoutEnlargement: true })
          [format]({ quality: format === 'webp' ? 85 : 80 })
          .toFile(outputPath);
        
        console.log(`  ✅ ${path.basename(outputPath)}`);
      } else {
        // Se a imagem original é menor, criar uma cópia otimizada
        await sharp(inputPath)
          [format]({ quality: format === 'webp' ? 85 : 80 })
          .toFile(outputPath);
        
        console.log(`  ✅ ${path.basename(outputPath)} (original size)`);
      }
    } catch (error) {
      console.error(`  ❌ Erro ao criar ${path.basename(outputPath)}:`, error.message);
    }
  }
}

async function processImages() {
  console.log('🖼️  Convertendo imagens para WebP e AVIF...\n');

  const files = fs.readdirSync(inputDir);
  const imageFiles = files.filter(file => 
    file.match(/\.(jpg|jpeg|png)$/i) && 
    !file.includes('print') && 
    !file.includes('manifest')
  );

  console.log(`📁 Encontradas ${imageFiles.length} imagens para processar\n`);

  for (const file of imageFiles) {
    const inputPath = path.join(inputDir, file);
    const baseName = file.replace(/\.(jpg|jpeg|png)$/i, '');
    
    console.log(`📸 Processando: ${file}`);
    
    try {
      // WebP
      await convertImage(inputPath, baseName, 'webp');
      
      // AVIF (melhor compressão)
      await convertImage(inputPath, baseName, 'avif');
      
      console.log(`✅ ${file} convertido com sucesso\n`);
    } catch (error) {
      console.error(`❌ Erro ao processar ${file}:`, error.message, '\n');
    }
  }

  console.log('✨ Conversão concluída!');
}

processImages().catch(console.error);

