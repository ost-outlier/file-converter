// ============================================
// src/index.ts - CLI
// ============================================

import * as fs from "fs";
import { MarkdownParser } from "./parser";
import { Validator } from "./validator";

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
╔════════════════════════════════════════╗
║     MD → JSON Converter v1.1           ║
╚════════════════════════════════════════╝

Uso:
  npm run convert <arquivo.md>

Exemplo:
  npm run convert ./examples/input/exemplo.md
  
O arquivo JSON será gerado na mesma pasta.
    `);
    process.exit(0);
  }

  const inputPath = args[0];

  // Validações
  if (!Validator.fileExists(inputPath)) {
    console.error(`❌ Arquivo não encontrado: ${inputPath}`);
    process.exit(1);
  }

  if (!Validator.isMarkdownFile(inputPath)) {
    console.error(`❌ O arquivo deve ter extensão .md`);
    process.exit(1);
  }

  try {
    // Lê arquivo
    console.log(`📖 Lendo: ${inputPath}`);
    const content = fs.readFileSync(inputPath, "utf-8");

    // Parse
    console.log(`⚙️  Convertendo...`);
    const parsed = MarkdownParser.parse(content);

    // Valida
    const validation = Validator.validateParsed(parsed);
    if (!validation.valid) {
      console.warn(`\n⚠️  Avisos:`);
      validation.errors.forEach((err) => console.warn(`   ${err}`));
      console.log("");
    }

    // Gera JSON
    const outputPath = inputPath.replace(/\.md$/, ".json");
    fs.writeFileSync(outputPath, JSON.stringify(parsed, null, 2), "utf-8");

    console.log(`✅ Conversão concluída!`);
    console.log(`📄 Arquivo gerado: ${outputPath}`);
    console.log(`\n📊 Estatísticas:`);
    console.log(
      `   - Campos frontmatter: ${Object.keys(parsed.frontmatter).length}`
    );
    console.log(
      `   - Seções encontradas: ${Object.keys(parsed.sections).length}`
    );
    console.log(`   - Tamanho conteúdo: ${parsed.rawContent.length} chars`);
  } catch (error) {
    console.error(`❌ Erro na conversão:`, error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
