# @file-converter/video-to-md

Gera notas Markdown com tags `<video>` para cada arquivo de video encontrado em uma pasta.

## Uso rapido

```bash
# Dentro de packages/video-to-md
npm install
npm run convert -- "E:\Fundamentos de Arquitetura de Software"
```

Por padrao as notas sao criadas na mesma pasta de cada video. Use `--output` para escolher outro diretório base e `--force` para sobrescrever notas existentes.

```bash
npm run convert -- "E:\Fundamentos de Arquitetura de Software" --output="D:\Notas" --force
```

## Formato da nota

Cada nota segue o padrao:

```markdown
# Nome do video
<video src="file:///C:/caminho/para/video.mp4" controls width="100%">
</video>
```

Os caminhos sao convertidos automaticamente para o formato `file:///` com caracteres especiais escapados, garantindo compatibilidade com editores como Obsidian.
