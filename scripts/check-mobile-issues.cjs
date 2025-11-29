#!/usr/bin/env node

/**
 * Script de Verificação de Problemas Mobile
 * Verifica problemas comuns que podem afetar dispositivos móveis
 */

const fs = require('fs');
const path = require('path');

const issues = [];
const warnings = [];

// 1. Verificar viewport meta tag
function checkViewport() {
  const layoutPath = path.join(__dirname, '../src/layouts/Layout.astro');
  const content = fs.readFileSync(layoutPath, 'utf-8');
  
  if (!content.includes('viewport')) {
    issues.push('❌ Meta tag viewport não encontrada');
  } else if (!content.includes('width=device-width')) {
    warnings.push('⚠️ Viewport pode não estar otimizado para mobile');
  } else {
    console.log('✅ Viewport configurado corretamente');
  }
}

// 2. Verificar background-attachment: fixed em mobile
function checkBackgroundAttachment() {
  const cssPath = path.join(__dirname, '../src/styles/globals.css');
  const content = fs.readFileSync(cssPath, 'utf-8');
  
  const mobileSection = content.match(/@media\s*\(max-width:\s*768px\)[\s\S]*?}/g);
  if (mobileSection) {
    const mobileCSS = mobileSection.join('\n');
    if (mobileCSS.includes('background-attachment: fixed')) {
      issues.push('❌ background-attachment: fixed encontrado em mobile (causa bugs no iOS/Safari)');
    } else {
      console.log('✅ background-attachment corrigido para mobile');
    }
  }
}

// 3. Verificar uso de navigator sem verificação
function checkNavigatorUsage() {
  const componentsDir = path.join(__dirname, '../src/components');
  const files = getAllFiles(componentsDir, ['.tsx', '.ts', '.jsx', '.js']);
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const navigatorMatches = content.match(/navigator\./g);
    if (navigatorMatches) {
      navigatorMatches.forEach(() => {
        if (!content.includes('typeof navigator') && !content.includes('navigator &&')) {
          warnings.push(`⚠️ Uso de navigator sem verificação em ${path.relative(__dirname, file)}`);
        }
      });
    }
  });
}

// 4. Verificar touch-action em botões
function checkTouchAction() {
  const cssPath = path.join(__dirname, '../src/styles/globals.css');
  const content = fs.readFileSync(cssPath, 'utf-8');
  
  if (content.includes('touch-action: manipulation')) {
    console.log('✅ touch-action configurado para melhor UX mobile');
  } else {
    warnings.push('⚠️ touch-action não configurado (pode causar delay em toques)');
  }
}

// 5. Verificar min-height de botões (44px mínimo)
function checkButtonSizes() {
  const cssPath = path.join(__dirname, '../src/styles/globals.css');
  const content = fs.readFileSync(cssPath, 'utf-8');
  
  if (content.includes('min-h-[44px]') || content.includes('min-height: 44px')) {
    console.log('✅ Botões têm tamanho mínimo adequado para touch (44px)');
  } else {
    warnings.push('⚠️ Botões podem não ter tamanho mínimo adequado para touch');
  }
}

// Helper function
function getAllFiles(dir, extensions) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(file, extensions));
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        results.push(file);
      }
    }
  });
  
  return results;
}

// Executar verificações
console.log('\n🔍 Verificando problemas mobile...\n');

checkViewport();
checkBackgroundAttachment();
checkNavigatorUsage();
checkTouchAction();
checkButtonSizes();

// Resumo
console.log('\n📊 RESUMO:\n');

if (issues.length === 0 && warnings.length === 0) {
  console.log('✅ Nenhum problema crítico encontrado!');
} else {
  if (issues.length > 0) {
    console.log('❌ PROBLEMAS CRÍTICOS:');
    issues.forEach(issue => console.log(`  ${issue}`));
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️ AVISOS:');
    warnings.forEach(warning => console.log(`  ${warning}`));
  }
}

console.log('\n');

