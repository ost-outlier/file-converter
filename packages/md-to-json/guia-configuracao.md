# Guia Completo de Configuração e Uso

Este guia explica em detalhes todas as possibilidades de configuração e uso do conversor MD → JSON. Use este documento como referência completa para todas as opções e recursos disponíveis no conversor.

## 🔍 Índice

- [Modos de Operação](#modos-de-operação)
- [Arquivo Único](#arquivo-único)
- [Múltiplos Arquivos](#múltiplos-arquivos)
- [Arquivo de Configuração](#arquivo-de-configuração)
- [Estrutura de Saída](#estrutura-de-saída)
- [Exemplos Práticos](#exemplos-práticos)

## Modos de Operação

O conversor possui três modos de operação que determinam a estrutura do JSON de saída:

### 1. Modo Full (Padrão)

- Inclui frontmatter, seções separadas e conteúdo completo
- Melhor para análise completa do documento
- Exemplo de saída:

```json
{
  "frontmatter": {
    "titulo": "Exemplo",
    "tipo": "guia"
  },
  "sections": {
    "Introdução": "Texto da introdução...",
    "Capítulo 1": ["Item 1", "Item 2"]
  },
  "rawContent": "# Introdução\n\nTexto completo..."
}
```

### 2. Modo Sections

- Inclui apenas frontmatter e seções separadas
- Ideal para análise estruturada do conteúdo
- Exemplo de saída:

```json
{
  "frontmatter": {
    "titulo": "Exemplo",
    "tipo": "guia"
  },
  "sections": {
    "Introdução": "Texto da introdução...",
    "Capítulo 1": ["Item 1", "Item 2"]
  }
}
```

### 3. Modo Raw

- Inclui apenas frontmatter e conteúdo completo
- Melhor para backup ou migração
- Exemplo de saída:

```json
{
  "frontmatter": {
    "titulo": "Exemplo",
    "tipo": "guia"
  },
  "content": "# Introdução\n\nTexto completo..."
}
```

## Arquivo Único

Para converter um único arquivo markdown:

```bash
# Modo padrão (full)
npm run convert -- ./caminho/arquivo.md

# Modo sections
npm run convert -- ./caminho/arquivo.md --mode=sections

# Modo raw
npm run convert -- ./caminho/arquivo.md --mode=raw
```

## Múltiplos Arquivos

Para processar múltiplos arquivos, use um arquivo de configuração:

```bash
npm run convert -- --config=./config.json
```

## Arquivo de Configuração

O arquivo de configuração (config.json) permite personalizar completamente o processo de conversão. Aqui está a estrutura completa com todas as opções disponíveis:

```json
{
  "input": {
    "patterns": [
      "./input/**/*.md", // Inclui todos os .md recursivamente
      "!./input/rascunhos/**" // Exclui pasta rascunhos
    ],
    "mode": "full" // Modo de conversão: "full", "sections" ou "raw"
  },
  "output": {
    "directory": "./output", // Pasta onde serão salvos os arquivos
    "consolidate": {
      "enabled": true, // Gerar arquivo consolidado?
      "filename": "todos.json", // Nome do arquivo consolidado
      "groupBy": "tipo" // Agrupar por campo do frontmatter
    },
    "keepIndividualFiles": true // Manter arquivos individuais?
  },
  "report": {
    "enabled": true, // Gerar relatório?
    "filename": "report.json", // Nome do arquivo de relatório
    "includeWarnings": true // Incluir avisos no relatório?
  }
}
```

### 🔧 Detalhamento das Opções

#### 1. Input

- `patterns`: Array de padrões glob
  - Suporta todos os padrões glob padrão
  - Aceita também caminhos de diretório absoluto ou relativo (ex.: `"./input"` ou `"C:/meus/mds"`).
  - Diretórios são automaticamente expandidos para busca recursiva (`"<diretório>/**/*.md"`).
  - Normaliza caminhos Windows e Unix (pode usar \ ou /)
  - Use `!` no início para excluir padrões
  - Exemplos:
    - `"*.md"` - Todos os .md no diretório atual
    - `"**/*.md"` - Todos os .md em qualquer subdiretório
    - `"./posts/*.md"` - Apenas .md na pasta posts
    - `"./input"` - Pasta inteira (expande para `./input/**/*.md`)
    - `"!./private/**"` - Exclui tudo na pasta private
    - `["./blog", "./docs"]` - Múltiplos diretórios
- `mode`: Modo de conversão
  - `"full"` - (padrão) Frontmatter + seções + conteúdo
  - `"sections"` - Apenas frontmatter + seções
  - `"raw"` - Apenas frontmatter + conteúdo bruto

#### 2. Output

- `directory`: Pasta de destino dos arquivos convertidos
- `consolidate`: Configurações do arquivo consolidado
  - `enabled`: Habilita/desabilita consolidação
  - `filename`: Nome do arquivo consolidado
  - `groupBy`: Campo do frontmatter para agrupar
    - Exemplo: Se `groupBy: "tipo"`, arquivos serão agrupados pelo valor do campo "tipo" no frontmatter
- `keepIndividualFiles`: Se true, mantém arquivos JSON individuais além do consolidado

#### 3. Report

- `enabled`: Habilita/desabilita geração de relatório
- `filename`: Nome do arquivo de relatório
- `includeWarnings`: Se true, inclui avisos no relatório

### Estrutura do Relatório

O relatório gerado inclui:

```json
{
  "timestamp": "2025-10-28T10:00:00.000Z",
  "summary": {
    "totalFiles": 10,
    "successCount": 9,
    "errorCount": 1,
    "warningCount": 2
  },
  "files": [
    {
      "path": "./input/exemplo.md",
      "status": "success",
      "warnings": ["Frontmatter incompleto"],
      "stats": {
        "frontmatterFields": 4,
        "sections": 3,
        "contentSize": 1835
      }
    }
  ]
}
```

## Exemplos Práticos

### 1. Conversão Básica

```json
{
  "input": {
    "patterns": ["./posts/*.md"]
  },
  "output": {
    "directory": "./json"
  }
}
```

### 2. Consolidação por Categoria

```json
{
  "input": {
    "patterns": ["./blog/**/*.md"],
    "mode": "sections"
  },
  "output": {
    "directory": "./output",
    "consolidate": {
      "enabled": true,
      "filename": "blog.json",
      "groupBy": "categoria"
    },
    "keepIndividualFiles": false
  }
}
```

### 3. Backup Completo

```json
{
  "input": {
    "patterns": ["**/*.md", "!./node_modules/**"],
    "mode": "raw"
  },
  "output": {
    "directory": "./backup",
    "consolidate": {
      "enabled": true,
      "filename": "backup.json"
    }
  },
  "report": {
    "enabled": true,
    "filename": "backup-report.json"
  }
}
```

## 💡 Dicas e Boas Práticas

1. **Padrões Glob**

   - Use `**/*.md` para busca recursiva
   - Use padrões de exclusão para ignorar pastas específicas
   - Seja específico para melhor performance
   - Prefira passar diretórios completos quando quiser processar todas as subpastas
   - Use arrays de patterns para organizar melhor as inclusões/exclusões

2. **Consolidação**

   - Agrupe por campos relevantes do frontmatter
   - Use nomes descritivos para os arquivos
   - Considere desabilitar arquivos individuais se não necessários
   - Planeje a estrutura do groupBy considerando a análise posterior
   - Verifique se todos os arquivos têm o campo usado no groupBy

3. **Relatórios**

   - Sempre habilite para processos em lote
   - Verifique warnings mesmo em casos de sucesso
   - Use para monitorar qualidade dos arquivos markdown
   - Implemente verificações regulares baseadas no relatório
   - Considere adicionar o relatório ao controle de qualidade do projeto

4. **Performance**
   - Organize arquivos em diretórios lógicos para otimizar a busca
   - Use padrões específicos em vez de buscas muito amplas
   - Considere dividir processamentos muito grandes em lotes menores
   - Mantenha os arquivos markdown bem estruturados
   - Evite patterns que se sobrepõem desnecessariamente
