# Explicação 
- Mapea os blocos de códigos dentro da nota e cria os arquivos com nome e extensão correspondente (ex. `typescript`,.`javascript` `json`, etc)
- Teste: arquivos [[prompts-fase-1]]
- Estrutura ideal:
- nome do arquivo (ex: `letra-numero.converter.test.ts`) seguido de bloco de código:

```typescript
export enum TipoAcento {
  AGUDO = 'agudo',
  GRAVE = 'grave',
  CIRCUNFLEXO = 'circunflexo',
  TIL = 'til',
  TREMA = 'trema',
  APOSTROFO = 'apostrofo'
}

export class AcentuacaoConverter {
  detectarAcento(letra: string): TipoAcento | null { }
  aplicarRegra(valorBase: number, tipoAcento: TipoAcento): number { }
}
```
- [ ] #feature Criar já na pasta adequada. Ex.: [path:: backend/src/domain/converters/], [file:: letra-numero.converter.test.ts]
Regras de negócio:
1. Gerar em qualquer pasta do PC, mesmo que o vs code esteja aberto só nesse mini-projeto.
    
2. Já colocar a extensão correta de arquivo.

# Prática

Perfeito 👨‍💻 — aqui está um **mini-projeto Node.js/TypeScript** que faz exatamente o que você descreveu:  
ele **lê um arquivo markdown**, **mapeia blocos de código**, **extrai o nome e a extensão** e **gera automaticamente os arquivos** nas pastas corretas.

---

## 🧩 Estrutura do Projeto

```
markdown-code-exporter/
├── src/
│   ├── index.ts
│   └── utils/
│       └── fileGenerator.ts
├── markdown/
│   └── prompts-fase-1.md
├── generated/   ← saída automática
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📦 package.json

```json
{
  "name": "markdown-code-exporter",
  "version": "1.0.0",
  "main": "dist/index.js",
  "type": "module",
  "scripts": {
    "start": "ts-node src/index.ts"
  },
  "dependencies": {
    "fs-extra": "^11.2.0"
  },
  "devDependencies": {
    "ts-node": "^10.9.2",
    "typescript": "^5.6.3"
  }
}
```

---

## ⚙️ tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "ESNext",
    "rootDir": "src",
    "outDir": "dist",
    "moduleResolution": "Node",
    "esModuleInterop": true,
    "strict": true
  }
}
```

---

## 📘 Exemplo de markdown (`markdown/prompts-fase-1.md`)


# Teste de criação automática

[path:: backend/src/domain/converters/]
[file:: letra-numero.converter.test.ts]

```typescript
export enum TipoAcento {
  AGUDO = 'agudo',
  GRAVE = 'grave',
  CIRCUNFLEXO = 'circunflexo',
  TIL = 'til',
  TREMA = 'trema',
  APOSTROFO = 'apostrofo'
}

export class AcentuacaoConverter {
  detectarAcento(letra: string): TipoAcento | null { }
  aplicarRegra(valorBase: number, tipoAcento: TipoAcento): number { }
}
````

---

## 🧠 src/utils/fileGenerator.ts

```typescript
import fs from "fs-extra";
import path from "path";

export async function generateFilesFromMarkdown(markdown: string, outputBase = "generated") {
  // Divide o markdown em seções com path + file + bloco de código
  const pattern =
    /\[path:: ([^\]]+)\][\s\S]*?\[file:: ([^\]]+)\][\s\S]*?```(\w+)\n([\s\S]*?)```/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(markdown)) !== null) {
    const [, relPath, fileName, lang, code] = match;

    const finalDir = path.join(outputBase, relPath);
    const finalPath = path.join(finalDir, fileName);

    await fs.ensureDir(finalDir);
    await fs.writeFile(finalPath, code.trim() + "\n");

    console.log(`✅ Criado: ${finalPath}`);
  }
}
````

---

## 🚀 src/index.ts

```typescript
import fs from "fs-extra";
import path from "path";
import { generateFilesFromMarkdown } from "./utils/fileGenerator.js";

async function main() {
  const markdownFile = path.resolve("markdown/prompts-fase-1.md");
  const markdown = await fs.readFile(markdownFile, "utf-8");

  console.log("📄 Lendo arquivo:", markdownFile);
  await generateFilesFromMarkdown(markdown, "generated");
  console.log("🎉 Todos os arquivos foram criados!");
}

main().catch(console.error);
```

---

## 🧪 Como usar

1. Crie a pasta e salve os arquivos acima.
2. Instale as dependências:
    
    ```bash
    npm install
    ```
    
3. Coloque seu markdown com os blocos de código em `markdown/prompts-fase-1.md`.
4. Rode:
    
    ```bash
    npm start
    ```
    

Os arquivos serão gerados automaticamente dentro de:

```
generated/backend/src/domain/converters/letra-numero.converter.test.ts
```

---

Quer que eu adicione suporte a **múltiplos blocos no mesmo arquivo markdown** (por exemplo, criar vários arquivos a partir de uma única nota)?