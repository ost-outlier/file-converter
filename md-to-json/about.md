# MINI-TOOL: MD → JSON Converter

## VISÃO GERAL

Ferramenta CLI standalone para converter arquivos Markdown (Obsidian) em JSON estruturado. Zero dependências externas, 100% local.

---

## ARQUITETURA ULTRA-SIMPLES

```
md-to-json/
├── src/
│   ├── index.ts           # Entry point CLI
│   ├── parser.ts          # Lógica de parsing MD
│   ├── validator.ts       # Validações básicas
│   └── types.ts           # Tipos TypeScript
├── examples/
│   ├── input/
│   │   └── exemplo.md     # Exemplo de arquivo MD
│   ├── output/
│   │   └── resultado.json # Exemplo de saída
│   └── config.example.json # Exemplo de mapeamento
├── tests/
│   └── parser.test.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## ROADMAP

### **1. SUPER SIMPLES: Tudo Local**

#### **1.1. O Ridículo do Ridículo de Simples** ⭐
**Meta:** Um arquivo → Um JSON

**Entregas:**
- [ ] Setup TypeScript básico
- [ ] Parser de um único arquivo MD
- [ ] Extrai frontmatter (YAML)
- [ ] Separa seções por headers (# ## ###)
- [ ] Detecta listas (bullets)
- [ ] Gera JSON estruturado
- [ ] CLI: `npm run convert arquivo.md`
- [ ] Output: `arquivo.json` na mesma pasta

**Exemplo de uso:**
```bash
cd md-to-json
npm run convert ../vault/motivacao-1.md
# Gera: ../vault/motivacao-1.json
```

---

#### **1.2. Evolução: Múltiplos Arquivos** ⭐⭐
**Meta:** Config.json mapeia N arquivos → 1 JSON unificado

**Entregas:**
- [ ] Arquivo `config.json` com mapeamento
- [ ] Processa múltiplos arquivos
- [ ] Organiza por tipo/categoria
- [ ] Gera JSON único consolidado
- [ ] CLI: `npm run batch config.json`
- [ ] Validações (arquivos faltando, etc)
- [ ] Relatório de conversão

**Exemplo config.json:**
```json
{
  "output": "./output/numerologia-completo.json",
  "sources": [
    {
      "tipo": "motivacao",
      "path": "../vault/motivacao/*.md"
    },
    {
      "tipo": "expressao",
      "path": "../vault/expressao/*.md"
    }
  ]
}
```

**CLI:**
```bash
npm run batch config.json
# Gera: ./output/numerologia-completo.json
```

---

### **2. POSSIBILIDADES FUTURAS** 🔮

*(Apenas listagem, sem implementação agora)*

#### **2.1. Outros Formatos de Saída**
- MD → HTML (blog posts)
- MD → PDF (relatórios)
- MD → DOCX (documentos Word)
- MD → LaTeX (papers acadêmicos)
- JSON → MD (inverso)

#### **2.2. Integrações**
- Webhooks (notifica quando converte)
- GitHub Actions (auto-convert em push)
- Obsidian Plugin (botão direto no vault)
- VS Code Extension

#### **2.3. Banco de Dados**
- SQLite local (histórico conversões)
- PostgreSQL (multi-usuário)
- MongoDB (documentos flexíveis)
- Supabase (backend-as-service)

#### **2.4. Web Service**
- Site com upload de arquivo
- API REST pública
- SEO para "converter MD online"
- Freemium (limitado grátis, pago ilimitado)
- Dashboard de conversões

#### **2.5. Features Avançadas**
- Watch mode (auto-convert on save)
- Templates customizáveis
- Plugins/extensões (user-defined parsers)
- Diff/versionamento
- Merge de múltiplos JSONs
- Validação de schemas (JSON Schema)

---

## IMPLEMENTAÇÃO: FASE 1.1

Vou criar agora a versão **ridícula de simples** - um arquivo local convertido.

Agora o arquivo de exemplo e setup completo:

Agora o README completo:

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

Para você começar agora:

```bash
# 1. Crie a pasta do projeto
mkdir md-to-json && cd md-to-json

# 2. Inicialize
npm init -y

# 3. Instale dependências
npm install -D typescript tsx @types/node

# 4. Crie tsconfig.json
npx tsc --init

# 5. Crie a estrutura de pastas
mkdir -p src examples/input examples/output

# 6. Copie os códigos dos artifacts acima para:
#    - src/index.ts (artifact #2)
#    - package.json (artifact #3)
#    - examples/input/exemplo.md (artifact #4)
#    - README.md (artifact #5)

# 7. Teste!
npm run convert examples/input/exemplo.md
```

---

## 🎯 PRÓXIMOS PASSOS (Você decide quando)

**Fase 1.2** - Quando quiser processar múltiplos arquivos:
- Crio o sistema de config.json
- Adiciono suporte a globs (`*.md`)
- Consolida tudo em um JSON único

**Integração com projeto numerologia:**
- Depois você roda esse conversor no seu vault do Obsidian
- Gera o JSON consolidado
- Usa esse JSON no backend da numerologia

---

Quer que eu detalhe mais alguma parte ou prefere começar testando essa versão 1.1 primeiro? 🚀