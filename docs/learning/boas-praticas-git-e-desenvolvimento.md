# Boas Práticas de Desenvolvimento - Guia para Iniciantes

Este guia explica os conceitos e boas práticas de desenvolvimento que utilizamos no projeto, especialmente focado em quem está começando a programar.

## Por que Usamos Branches?

Imagine que você está escrevendo um livro. Você não quer fazer alterações diretamente no original, então você faz uma cópia para trabalhar nela. No Git, isso é uma "branch" - uma ramificação do código principal.

### 🤔 Por que não editar direto no main?

1. **Segurança**: Se algo der errado, o código principal (main) continua funcionando
2. **Organização**: Cada nova feature fica isolada
3. **Trabalho em equipe**: Diferentes pessoas podem trabalhar em diferentes features sem conflito
4. **Revisão**: Mais fácil revisar as mudanças antes de incorporar ao código principal

### 📝 Exemplo Prático

No nosso projeto:

```bash
git checkout -b feat/fase-1.2
```

- Criamos uma branch chamada "feat/fase-1.2"
- "feat" indica que é uma nova funcionalidade
- "fase-1.2" indica qual parte do projeto estamos trabalhando

## Commits: Por que e Como?

Um commit é como salvar um jogo - você marca um ponto na história do seu código onde tudo está funcionando.

### 🎯 Boas Práticas em Commits

1. **Commits Pequenos e Focados**

   - Ruim: Várias mudanças diferentes em um commit
   - Bom: Cada commit faz uma coisa específica

2. **Mensagens Claras**

   ```bash
   git commit -m "feat: adiciona modos de saída" -m "- Implementa 3 modos..."
   ```

   - Primeira linha: resumo curto
   - Linhas seguintes: detalhes do que foi feito

3. **Padrões de Mensagem**
   - `feat:` para novas funcionalidades
   - `fix:` para correções
   - `docs:` para documentação
   - `refactor:` para melhorias no código

## .gitignore: Mantendo o Repositório Limpo

É como uma lista de coisas que você não quer levar na mala de viagem.

### 🚫 O que Ignorar?

1. **Arquivos Gerados**
   - Arquivos de build
   - Arquivos de output
2. **Dependências**
   - node_modules
   - Bibliotecas instaladas
3. **Arquivos Pessoais/Sistema**
   - .DS_Store (Mac)
   - Thumbs.db (Windows)
4. **Configurações de IDE**
   - .vscode
   - .idea

## Fluxo de Trabalho Recomendado

### 1. Iniciando uma Nova Feature

```bash
# Atualiza o código local
git pull origin main

# Cria nova branch
git checkout -b feat/nome-da-feature
```

### 2. Durante o Desenvolvimento

```bash
# Ver o que foi alterado
git status

# Adiciona alterações
git add arquivo1.ts arquivo2.ts

# Cria commit
git commit -m "feat: descrição curta" -m "descrição detalhada"
```

### 3. Finalizando a Feature

```bash
# Volta para o main
git checkout main

# Atualiza o main
git pull origin main

# Junta sua feature com o main
git merge feat/nome-da-feature

# Envia para o GitHub
git push origin main
```

## 🎓 Conceitos Importantes

### 1. Branch

- É uma linha independente de desenvolvimento
- Permite trabalhar em features sem afetar o código principal
- Nomenclatura comum:
  - `feat/`: para novas features
  - `fix/`: para correções
  - `docs/`: para documentação

### 2. Commit

- É um "checkpoint" no seu código
- Deve ter uma mensagem clara
- Deve conter mudanças relacionadas entre si
- Ajuda a rastrear o histórico do projeto

### 3. Merge

- Junta duas branches
- Normalmente usado para levar features prontas para o main
- Deve ser feito após testes e revisão

### 4. Remote (GitHub)

- É onde fica a versão "oficial" do código
- `push`: envia alterações locais para o GitHub
- `pull`: traz alterações do GitHub para seu computador

## ⚠️ Erros Comuns de Iniciantes

1. **Trabalhar Direto no Main**

   - Por que é ruim: Risco de quebrar o código principal
   - Solução: Sempre criar uma branch para novas features

2. **Commits Grandes Demais**

   - Por que é ruim: Difícil entender e revisar
   - Solução: Fazer commits menores e focados

3. **Mensagens de Commit Vagas**

   - Ruim: "atualizei o código"
   - Bom: "feat: adiciona validação de email no formulário"

4. **Não Usar .gitignore**
   - Por que é ruim: Repositório com arquivos desnecessários
   - Solução: Configurar .gitignore adequadamente

## 🌟 Dicas Finais

1. **Antes de Começar**

   - Sempre crie uma nova branch
   - Planeje o que vai fazer
   - Verifique se está com o código atualizado

2. **Durante o Desenvolvimento**

   - Faça commits frequentes
   - Escreva mensagens claras
   - Mantenha cada commit focado

3. **Ao Finalizar**

   - Revise suas alterações
   - Teste tudo antes do merge
   - Documente o que foi feito

4. **Sempre**
   - Pergunte se tiver dúvidas
   - Aprenda com os erros
   - Mantenha o código organizado
