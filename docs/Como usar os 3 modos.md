Perfeito! Vou adicionar essa funcionalidade de escolher o formato de saída.

Pronto! Agora você tem 3 modos de saída. Veja como usar:

## 📝 Como usar os 3 modos

### **1. Modo FULL (padrão) - Tudo junto**

```bash
npm run convert ./examples/input/exemplo.md
# ou explicitamente:
npm run convert ./examples/input/exemplo.md --mode=full
```

**Saída JSON:**

```json
{
  "frontmatter": {
    "numero": 1,
    "tipo": "motivacao"
  },
  "sections": {
    "Significado Geral": "Texto...",
    "Características": ["Item 1", "Item 2"]
  },
  "rawContent": "# Significado Geral\nTexto...\n\n## Características\n- Item 1"
}
```

---

### **2. Modo SECTIONS - Só seções separadas**

```bash
npm run convert ./examples/input/exemplo.md --mode=sections
```

**Saída JSON:**

```json
{
  "frontmatter": {
    "numero": 1,
    "tipo": "motivacao"
  },
  "sections": {
    "Significado Geral": "Texto...",
    "Características": ["Item 1", "Item 2"]
  }
}
```

✅ **Sem duplicação** - não tem `rawContent`

---

### **3. Modo RAW - Só conteúdo completo**

```bash
npm run convert -- ./examples/input/exemplo.md --mode=raw
```

**Saída JSON:**

```json
{
  "frontmatter": {
    "numero": 1,
    "tipo": "motivacao"
  },
  "content": "# Significado Geral\nTexto...\n\n## Características\n- Item 1\n- Item 2"
}
```

✅ **Sem duplicação** - não tem `sections`

---

## 🎯 Quando usar cada modo?

| Modo         | Usar quando...                                                      |
| ------------ | ------------------------------------------------------------------- |
| **full**     | Quer flexibilidade total (usar seções OU texto completo depois)     |
| **sections** | Vai processar cada seção individualmente (mapas numerológicos, FAQ) |
| **raw**      | Quer o markdown original preservado (blog posts, documentação)      |

---

## 📊 Output do CLI agora mostra o modo

```bash
$ npm run convert exemplo.md --mode=sections

📖 Lendo: exemplo.md
⚙️  Convertendo... (modo: sections)
✅ Conversão concluída!
📄 Arquivo gerado: exemplo.json

📊 Estatísticas:
   - Modo: sections
   - Campos frontmatter: 4
   - Seções encontradas: 5
```

---

## ✅ Pronto para testar!

Teste os 3 modos:

```bash
# Teste modo full
npm run convert ./examples/input/exemplo.md --mode=full

# Teste modo sections
npm run convert ./examples/input/exemplo.md --mode=sections

# Teste modo raw
npm run convert ./examples/input/exemplo.md --mode=raw
```

Funcionou? Agora sim vamos para a **Fase 1.2** (múltiplos arquivos)? 🚀
