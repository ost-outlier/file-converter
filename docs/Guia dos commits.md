# 📝 Commits Sugeridos

## **COMMIT 1 - Versão Base (antes dos modos)**

```bash
git add .
git commit -m "feat: implementa conversor MD→JSON v1.1 básico

- Parser de frontmatter YAML
- Extração automática de seções (# ##)
- Detecção de listas vs texto
- Conversão automática de tipos (number, boolean, string)
- Validações de arquivo e conteúdo
- CLI simples com tsx
- Output: frontmatter + sections + rawContent

Resolves: Fase 1.1 do roadmap"
```

---

## **COMMIT 2 - Após testar os modos (se funcionar)**

```bash
git add .
git commit -m "feat: adiciona 3 modos de saída (--mode)

- full: frontmatter + sections + rawContent (padrão)
- sections: apenas frontmatter + sections
- raw: apenas frontmatter + content

Evita duplicação de dados conforme caso de uso.
Estatísticas do CLI agora mostram o modo ativo.

Uso:
npm run convert arquivo.md --mode=sections"
```

---

## **COMMIT 3 - Se encontrar bugs/ajustes**

```bash
git add .
git commit -m "fix: corrige [descrever o problema]"
```

Ou se fizer melhorias:

```bash
git add .
git commit -m "refactor: melhora [o que melhorou]"
```

---

## 🎯 Estrutura de commits ideal

Para um projeto assim, sugiro seguir **Conventional Commits**:

### Tipos principais:
- `feat:` nova funcionalidade
- `fix:` correção de bug
- `refactor:` melhoria de código sem mudar funcionalidade
- `docs:` documentação
- `test:` testes
- `chore:` configurações, dependências

### Exemplos futuros:
```bash
# Fase 1.2
git commit -m "feat: adiciona processamento batch com config.json"

# Documentação
git commit -m "docs: atualiza README com exemplos dos 3 modos"

# Teste
git commit -m "test: adiciona testes unitários para parser"
```

---

## 📌 Dica: `.gitignore`

Antes do primeiro commit, crie o `.gitignore`:

```bash
# .gitignore
node_modules/
dist/
*.log
.DS_Store

# Arquivos de output de teste
examples/output/*.json
examples/input/*.json
```

Daí:
```bash
git add .gitignore
git commit -m "chore: adiciona .gitignore"
```

---

**Teste os modos e me avisa se funcionou! Aí fazemos o commit 2 e partimos para a Fase 1.2** 🚀