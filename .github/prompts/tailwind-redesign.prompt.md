---
description: Melhora o visual da aplicação atual usando Tailwind CSS 3 com foco em upload, listagem e download de documentos.
name: tailwind-redesign
argument-hint: nenhum argumento obrigatório
agent: tailwind-redesign
---

# Redesign visual do DMS com Tailwind CSS 3

Melhore o visual da aplicação atual do Document Management System sem mudar o comportamento funcional.

## Objetivo

- Modernizar a interface visual da aplicação atual.
- Usar Tailwind CSS 3 como abordagem principal de estilo.
- Melhorar legibilidade, organização e hierarquia visual.
- Manter upload, listagem e download funcionando conforme o estado atual do projeto.

## Escopo

### Ajustes esperados

- Layout mais moderno e profissional para a página principal.
- Cards ou blocos visuais para upload e documentos.
- Melhor contraste, espaçamento e tipografia.
- Melhor responsividade para mobile e desktop.
- Ajustes de cor, borda, sombra e estados de hover/disabled.

### Restrições

- Não quebrar a funcionalidade atual da aplicação.
- Não alterar a lógica de backend ou regras de negócio.
- Manter a comunicação com o backend via `/api`.
- Não adicionar bibliotecas extras além do Tailwind CSS 3 e de utilitários mínimos do próprio React.

## Arquivos relevantes

- `frontend/src/App.jsx`
- `frontend/src/components/*`
- `frontend/src/services/*`
- `frontend/src/main.jsx`

## Diretrizes de implementação

- Prefira classes utilitárias do Tailwind CSS 3 em JSX.
- Reaproveite componentes existentes e evite duplicação.
- Use uma paleta consistente, sem exagerar em cores.
- Garanta que os controles de upload e download mantenham boa usabilidade.
- Deixe a página acessível e visualmente clara.

## Resultado esperado

- Uma interface mais moderna, limpa e profissional.
- Melhor experiência visual para upload/listagem/download.
- Manutenção da estrutura atual do projeto sem regressão de funcionalidade.
