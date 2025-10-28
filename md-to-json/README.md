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
npm run convert ./examples/input/exemplo.md
```

Saída:

```
📖 Lendo: ./examples/input/exemplo.md
⚙️  Convertendo...
✅ Conversão concluída!
📄 Arquivo gerado: ./examples/input/exemplo.json

📊 Estatísticas:
   - Campos frontmatter: 4
   - Seções encontradas: 5
   - Tamanho conteúdo: 623 chars
```

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

## ✨ Features (Fase 1.1)

- ✅ Extrai frontmatter YAML
- ✅ Separa seções por headers (# ##)
- ✅ Detecta listas automaticamente
- ✅ Tipos detectados (number, boolean, string)
- ✅ Validações básicas
- ✅ Output no mesmo diretório

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
