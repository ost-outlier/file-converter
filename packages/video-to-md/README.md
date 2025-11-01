# @file-converter/video-to-md

Gera notas Markdown com tags `<video>` para cada arquivo de video encontrado em uma pasta.

## Uso rapido

```bash
# Dentro de packages/video-to-md
npm install
npm run convert -- "E:\Fundamentos de Arquitetura de Software"
```

Por padrao as notas sao criadas na mesma pasta de cada video. Use `--output` para escolher outro diretorio base e `--force` para sobrescrever notas existentes.

```bash
npm run convert -- "E:\Fundamentos de Arquitetura de Software" --output="D:\Notas" --force
```

## Template de configuracao (`src/template.ts`)

- Edite `src/template.ts` para definir entradas padrao como `input`, `output`, `force` e o bloco `properties`.
- Cole novos caminhos diretamente apos `String.raw`` e evite escapar barras invertidas.
- Execute `npm run convert` sem argumentos para usar automaticamente as configuracoes do template.
- Argumentos informados via CLI sempre prevalecem sobre os valores do template.

## Formato da nota

Cada nota segue o padrao:

```markdown
# Nome do video
<video src="file:///C:/caminho/para/video.mp4" controls width="100%">
</video>
```

Os caminhos sao convertidos automaticamente para o formato `file:///` com caracteres especiais escapados, garantindo compatibilidade com editores como Obsidian.
