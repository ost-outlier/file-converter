# @file-converter/md-to-json

Conversor de Markdown para JSON estruturado, parte do projeto [file-converter](../../README.md).

## 🚀 Instalação

```bash
# Na raiz do monorepo
npm install
npm run build

# Ou apenas este pacote
cd packages/md-to-json
npm install
npm run build
```

## 📦 Estrutura do Pacote

```
md-to-json/
├── src/
│   ├── index.ts        # CLI principal
│   ├── parser.ts       # Parser de MD
│   ├── validator.ts    # Validações
│   ├── config.ts       # Loader de configuração
│   ├── output.ts       # Gerenciador de output
│   ├── report.ts       # Geração de relatórios
│   ├── batch.ts        # Processamento em lote
│   └── types.ts        # Tipos TypeScript
├── examples/
│   ├── input/
│   │   └── exemplo.md
│   ├── output/
│   │   └── exemplo.json
│   └── config-exemplo.json
└── package.json
```

## 🎯 Uso

### Arquivo Único

```bash
# Modo full (padrão) - Inclui frontmatter + seções + conteúdo completo
npm run convert -- ./examples/input/exemplo.md

# Modo sections - Apenas frontmatter + seções separadas
npm run convert -- ./examples/input/exemplo.md --mode=sections

# Modo raw - Apenas frontmatter + conteúdo completo
npm run convert -- ./examples/input/exemplo.md --mode=raw
```

### Processamento em Lote

1. Crie um arquivo de configuração (ex: `config.json`):

```json
{
  "input": {
    "patterns": ["./input/*.md"],
    "mode": "raw"
  },
  "output": {
    "directory": "./output",
    "consolidate": {
      "enabled": true,
      "filename": "consolidated.json",
      "groupBy": "tipo"
    },
    "keepIndividualFiles": false
  },
  "report": {
    "enabled": true,
    "filename": "report.json",
    "includeWarnings": true
  }
}
```

2. Execute:

```bash
npm run convert -- --config=./config.json
```

## 📄 Formato dos Arquivos

### Entrada (MD)

```markdown
---
numero: 1
tipo: motivacao
titulo: O Pioneiro
---

# Significado Geral

Texto descritivo...

## Características Positivas

- Item 1
- Item 2

## Orientações

Mais texto...
```

### Saída (JSON)

#### Modo Full (padrão)

```json
{
  "frontmatter": {
    "numero": 1,
    "tipo": "motivacao",
    "titulo": "O Pioneiro"
  },
  "sections": {
    "Significado Geral": "Texto descritivo...",
    "Características Positivas": ["Item 1", "Item 2"],
    "Orientações": "Mais texto..."
  },
  "rawContent": "..."
}
```

#### Modo Sections

```json
{
  "frontmatter": {
    "numero": 1,
    "tipo": "motivacao",
    "titulo": "O Pioneiro"
  },
  "sections": {
    "Significado Geral": "Texto descritivo...",
    "Características Positivas": ["Item 1", "Item 2"],
    "Orientações": "Mais texto..."
  }
}
```

#### Modo Raw

```json
{
  "frontmatter": {
    "numero": 1,
    "tipo": "motivacao",
    "titulo": "O Pioneiro"
  },
  "content": "# Significado Geral\n\nTexto descritivo...\n\n## Características Positivas\n\n- Item 1\n- Item 2\n\n## Orientações\n\nMais texto..."
}
```

## ✨ Features

- ✅ Extrai frontmatter YAML
- ✅ Separa seções por headers (# ##)
- ✅ Detecta listas automaticamente
- ✅ Tipos detectados (number, boolean, string)
- ✅ Validações básicas
- ✅ Múltiplos modos de saída
- ✅ Processamento em lote
- ✅ Consolidação de arquivos
- ✅ Relatórios de conversão

## 🔄 Integração com Outros Pacotes

Este pacote utiliza `@file-converter/core` para:

- Configurações base
- Processamento base
- Relatórios base
- Tipos comuns

## 🧪 Testes

```bash
npm test
```

## 📝 Exemplo de Uso Programático

```typescript
import { MarkdownParser } from "@file-converter/md-to-json";

const content = `
---
titulo: Exemplo
---

# Seção 1
Conteúdo...
`;

const result = MarkdownParser.parse(content);
console.log(result.frontmatter.titulo); // "Exemplo"
console.log(result.sections["Seção 1"]); // "Conteúdo..."
```

## 📄 Licença

MIT
