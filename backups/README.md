# Backup - DataCollectionScreen

## Data do Backup
9 de dezembro de 2025

## Arquivo
`DataCollectionScreen.tsx`

## Motivo do Backup
A tela de coleta de dados (nome e email) foi removida do fluxo do quiz, mas foi mantida em backup caso seja necessária no futuro.

## O que foi removido
- A tela `DataCollectionScreen` foi removida do fluxo do quiz
- O estado `'data-collection'` foi removido do tipo `QuizState`
- O fluxo agora vai direto de `TestimonialScreen` para `AnalyzingScreen`
- A função `handleDataSubmit` foi removida

## Como restaurar (se necessário)
1. Copiar o arquivo de volta: `cp backups/DataCollectionScreen.tsx.backup src/components/quiz/DataCollectionScreen.tsx`
2. Adicionar de volta o estado `'data-collection'` no tipo `QuizState` em `Quiz.tsx`
3. Adicionar de volta o import: `import { DataCollectionScreen } from './quiz/DataCollectionScreen';`
4. Adicionar de volta o mapeamento no `stateBackMap`
5. Adicionar de volta a renderização da tela no componente
6. Adicionar de volta a função `handleDataSubmit` se necessário
7. Alterar `TestimonialScreen` para ir para `'data-collection'` em vez de `'analyzing'`
8. Adicionar de volta a exportação no `src/components/quiz/index.ts`

