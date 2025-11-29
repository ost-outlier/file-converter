# block-html-to

Extrai todo o conteudo de cada `<textarea>` de um HTML e grava um `.txt` sequencial para cada bloco.

## Setup
- Na raiz do monorepo: `npm install`
- Opcional: `npm run build --workspace @file-converter/block-html-to`

## Uso rapido (sem config)
Dentro da raiz do projeto:
```
npm run convert --workspace @file-converter/block-html-to
```
Isso le `packages/block-html-to/bloco-html.html`, cria `packages/block-html-to/output/`, e salva arquivos `bloco-html-tela-1.txt`, `bloco-html-tela-2.txt`, etc.

## Configuracao via arquivo (config.ts)
1) Copie `packages/block-html-to/config.example.ts` para `packages/block-html-to/config.ts`.
2) Ajuste os campos:
   - `input`: caminho do HTML com os textareas (pode ser absoluto, inclusive com barras do Windows).
   - `output`: pasta onde os `.txt` serao gravados.
   - `baseName`: prefixo do arquivo, ex: `fast-mod-linha-superior`.
   - `start`: numero inicial da contagem (ex: 1).
   - Dica Windows: use `C:/...` ou `path.resolve("C:/...")` para evitar ter que escapar barras.
3) Rode:
```
npm run convert --workspace @file-converter/block-html-to
```
Se quiser usar outro caminho de config, passe `--config=./meu-config.ts` ou `--config=./meu-config.json`.

## Flags da CLI (sobrescrevem o config)
- `--input` ou `-i`: caminho do HTML.
- `--output` ou `-o`: pasta de saida.
- `--base-name` ou `-b`: prefixo do arquivo (`<base>-tela-N.txt`).
- `--start` ou `-s`: numero inicial da contagem.
- `--config` ou `-c`: caminho para um arquivo de configuracao (`.ts` ou `.json`).

## Detalhes
- Regex aceita `<textarea ...>` com atributos variados e fechamento com espaco opcional `</textarea >`.
- Textareas vazios sao ignorados.
- Quebras de linha sao normalizadas para `\n`.
