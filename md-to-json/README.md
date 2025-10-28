# MD → JSON Converter

Ferramenta CLI ultra-simples para converter arquivos Markdown (Obsidian) em JSON estruturado.

## 🚀 Instalação

```bash
# Clone ou crie a pasta
mkdir md-to-json && cd md-to-json

# Instale dependências
npm install

# Build (opcional)
npm run build
```

## 📦 Estrutura do Projeto

```
md-to-json/
├── src/
│   ├── index.ts        # CLI principal
│   ├── parser.ts       # Parser de MD
│   ├── validator.ts    # Validações
│   └── types.ts        # Tipos TS
├── examples/
│   ├── input/
│   │   └── exemplo.md
│   └── output/
│       └── exemplo.json
├── package.json
├── tsconfig.json
└── README.md
```

## 🎯 Uso (Fase 1.1 - Arquivo Único)

### Converter um arquivo

```bash
# Modo full (padrão) - Inclui frontmatter + seções + conteúdo completo
npm run convert -- ./examples/input/exemplo.md

# Modo sections - Apenas frontmatter + seções separadas
npm run convert -- ./examples/input/exemplo.md --mode=sections

# Modo raw - Apenas frontmatter + conteúdo completo
npm run convert -- ./examples/input/exemplo.md --mode=raw
```

Saída (modo full):

```
📖 Lendo: ./examples/input/exemplo.md
⚙️  Convertendo (modo: full)...
✅ Conversão concluída!
📄 Arquivo gerado: ./examples/input/exemplo.json

📊 Estatísticas:
   - Modo: full
   - Campos frontmatter: 4
   - Seções encontradas: 5
   - Tamanho conteúdo: 623 chars
```

Nota: O `--` após o comando `npm run convert` é necessário para passar os argumentos corretamente para o script.

### Formato de Entrada (MD)

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

### Formato de Saída (JSON)

Existem três modos de saída disponíveis:

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

## ✨ Features (Fase 1.1)

- ✅ Extrai frontmatter YAML
- ✅ Separa seções por headers (# ##)
- ✅ Detecta listas automaticamente
- ✅ Tipos detectados (number, boolean, string)
- ✅ Validações básicas
- ✅ Output no mesmo diretório
- ✅ Múltiplos modos de saída (full, sections, raw)

## 🔮 Roadmap

### Fase 1.2 (Próxima)

- [ ] Config.json para múltiplos arquivos
- [ ] Consolidação em JSON único
- [ ] Suporte a globs (\*.md)
- [ ] Relatório de conversão

### Futuro

- Conversão MD → HTML
- Conversão MD → PDF
- Watch mode (auto-convert)
- Obsidian plugin
- Web service

## 🧪 Testes

```bash
npm test
```

## 📝 Exemplo Completo

1. Crie seu arquivo MD no Obsidian (ou qualquer editor):

```markdown
---
numero: 5
tipo: expressao
---

# Descrição

Número da liberdade...

## Pontos Fortes

- Adaptabilidade
- Comunicação
```

2. Converta:

```bash
npm run convert /caminho/para/seu-arquivo.md
```

3. Use o JSON gerado:

```typescript
import resultado from "./seu-arquivo.json";

console.log(resultado.frontmatter.numero); // 5
console.log(resultado.sections["Pontos Fortes"]); // ['Adaptabilidade', ...]
```

## 🤝 Contribuindo

Este é um projeto pessoal, mas PRs são bem-vindos!

## 📄 Licença

MIT
