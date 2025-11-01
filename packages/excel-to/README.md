# Excel-to-Markdown Converter

Este pacote faz parte do projeto `file-converter` e é responsável por converter arquivos Excel em arquivos Markdown.

## Funcionalidades

- Converte planilhas Excel em arquivos Markdown
- Suporta templates personalizados para o formato Markdown
- Permite definir padrão para nomes dos arquivos gerados
- Opção de consolidar todos os arquivos em um único arquivo Markdown
- Geração de relatório detalhado da conversão

## Como usar

1. Instale o pacote:

```bash
npm install @file-converter/excel-to
```

2. Crie um arquivo de configuração (`config.json`):

```json
{
  "input": {
    "patterns": ["./input/*.xlsx"],
    "sheet": "Dados",
    "columns": ["titulo", "descricao", "data", "tags"],
    "startRow": 2
  },
  "output": {
    "directory": "./output",
    "format": "markdown",
    "template": "---\ntitle: ${titulo}\ndate: ${data}\ntags: ${tags}\n---\n\n# ${titulo}\n\n${descricao}",
    "filenamePattern": "${data}-${titulo}",
    "consolidate": {
      "enabled": false,
      "filename": "consolidated.md"
    },
    "keepIndividualFiles": true
  },
  "report": {
    "enabled": true,
    "filename": "conversion-report.json",
    "includeWarnings": true
  }
}
```

3. Use o conversor em seu código:

```typescript
import { ExcelToMarkdown } from "@file-converter/excel-to";
import { ExcelConfig } from "@file-converter/excel-to/types";

// Carregue sua configuração
const config: ExcelConfig = require("./config.json");

// Inicialize o conversor
const converter = new ExcelToMarkdown(config);

// Execute a conversão
converter.convert("input/planilha.xlsx", "output");
```

## Configuração

### Input

- `patterns`: Lista de padrões glob para encontrar arquivos Excel
- `sheet`: Nome da planilha a ser usada (opcional, usa a primeira se não especificado)
- `columns`: Lista de nomes das colunas a serem extraídas
- `startRow`: Linha inicial (1-based, default: 2)
- `endRow`: Linha final (opcional)

### Output

- `directory`: Diretório onde os arquivos serão salvos
- `format`: Formato de saída (atualmente só suporta "markdown")
- `template`: Template Markdown opcional usando variáveis no formato ${coluna}
- `filenamePattern`: Padrão para gerar nomes dos arquivos usando variáveis ${coluna}
- `consolidate`: Configurações para consolidar em um único arquivo
- `keepIndividualFiles`: Se deve manter os arquivos individuais quando consolidar

### Report

- `enabled`: Se deve gerar relatório
- `filename`: Nome do arquivo de relatório
- `includeWarnings`: Se deve incluir avisos no relatório

## Exemplos

Veja a pasta `examples` para exemplos completos de uso.
