# File Converter

Monorepo de ferramentas de conversão de arquivos, com foco em simplicidade e modularidade.

## 📦 Estrutura do Projeto

```
file-converter/
├── packages/
│   ├── core/              # Código compartilhado
│   │   ├── src/
│   │   │   └── index.ts   # Classes e interfaces base
│   │   └── package.json
│   │
│   ├── md-to-json/        # Conversor de Markdown
│   │   ├── src/
│   │   ├── examples/
│   │   └── package.json
│   │
│   └── excel-to/          # Conversor de Excel
│       ├── src/
│       ├── examples/
│       └── package.json
├── package.json           # Configuração do workspace
└── README.md
```

## 🚀 Instalação

```bash
# Clone o repositório
git clone https://github.com/ost-outlier/file-converter.git
cd file-converter

# Instale as dependências (todos os pacotes)
npm install

# Build todos os pacotes
npm run build
```

## 📘 Pacotes Disponíveis

### @file-converter/core

Pacote base com interfaces e classes compartilhadas entre os conversores. Fornece a infraestrutura comum para todos os conversores do projeto.

### @file-converter/md-to-json

Conversor de Markdown para JSON estruturado. [Documentação detalhada](./packages/md-to-json/README.md)

```bash
# Uso (dentro da pasta md-to-json)
npm run convert -- ./examples/input/exemplo.md

# Com modo específico
npm run convert -- ./examples/input/exemplo.md --mode=sections

# Processamento em lote via config
npm run convert -- --config=./examples/config-exemplo.json
```

### @file-converter/excel-to

Conversor de Excel para vários formatos (JSON, CSV, Markdown). [Documentação detalhada](./packages/excel-to/README.md)

```bash
# Uso (dentro da pasta excel-to)
npm run convert -- ./input/planilha.xlsx --format=json

# Com configurações específicas
npm run convert -- ./input/planilha.xlsx --format=md --sheet=Sheet1

# Processamento em lote via config
npm run convert -- --config=./config.json
```

## ✨ Features

- ✅ Arquitetura modular e extensível
- ✅ Suporte a múltiplos tipos de conversão
- ✅ Configuração flexível
- ✅ Processamento em lote
- ✅ Relatórios de conversão
- ✅ Validação de entrada/saída
- ✅ Suporte a múltiplos formatos
- ✅ Configuração via JSON
- ✅ CLI intuitiva

## 🧩 Criando Novos Conversores

1. Crie um novo pacote:

```bash
mkdir packages/novo-conversor
cd packages/novo-conversor
npm init
```

2. Adicione as dependências necessárias:

```json
{
  "dependencies": {
    "@file-converter/core": "^1.0.0"
  }
}
```

3. Estenda as classes base:

```typescript
import { BaseProcessor } from "@file-converter/core";

export class NewProcessor extends BaseProcessor<NewConfig> {
  // Sua implementação aqui
}
```

## 🔮 Roadmap

### Fase 1 (Concluída)

- ✅ Estrutura de monorepo
- ✅ Pacote core com interfaces base
- ✅ Conversor MD → JSON
- ✅ Documentação inicial

### Fase 2 (Atual)

- ✅ Conversor Excel → múltiplos formatos
- [ ] CLI unificada
- [ ] Documentação da API
- [ ] Testes E2E

### Fase 3 (Planejado)

- [ ] Interface web
- [ ] API REST
- [ ] Plugins para editores (VS Code, Obsidian)
- [ ] Integração contínua (CI/CD)

### Futuro

- Conversores HTML
- Conversores PDF
- Suporte a templates
- Processamento em nuvem
- Marketplace de plugins

## 🧪 Testes

```bash
# Testa todos os pacotes
npm test

# Testa um pacote específico
cd packages/md-to-json
npm test
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua branch de feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

MIT
