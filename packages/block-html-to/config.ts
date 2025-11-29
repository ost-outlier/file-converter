import path from "path";

// Copie este arquivo para config.ts e ajuste os caminhos conforme necessário.
// Exemplo usando caminho absoluto no Windows:
// "C:\\Users\\ricardo_outlier\\ost.dev\\projects\\otimizado-ptbr\\data\\fastmod-linha-superior"

export default {
  input: "./bloco-html2.html",
  output: path.resolve("C:/Users/ricardo_outlier/ost.dev/projects/otimizado-ptbr/data/fastmod-linha-inferior"),
  baseName: "fast-mod-linha-inferior",
  start: 1,

  // Sugestão para evitar escapar barras no Windows:
  // input: path.resolve("C:/Users/ricardo_outlier/ost.dev/projects/otimizado-ptbr/data/fastmod-linha-superior/bloco-html.html"),
  // output: path.resolve("C:/Users/ricardo_outlier/ost.dev/projects/otimizado-ptbr/data/fastmod-linha-superior/output"),
} as const;
