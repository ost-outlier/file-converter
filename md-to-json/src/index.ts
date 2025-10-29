// ============================================
// src/index.ts - CLI
// ============================================
import * as fs from "fs";
import * as path from "path";
import { MarkdownParser } from "./parser";
import { Validator } from "./validator";
import { ConfigLoader } from "./config";
import { OutputManager } from "./output";
import { ReportManager } from "./report";
import { BatchProcessor } from "./batch";
import type { OutputMode } from "./types";

async function main() {
  const args = process.argv.slice(2);

  // Verifica modo de operação
  const configArg = args.find((arg) => arg.startsWith("--config="));

  if (configArg) {
    // Modo config - múltiplos arquivos
    const configPath = path.resolve(configArg.split("=")[1]);

    if (!fs.existsSync(configPath)) {
      console.error(`❌ Arquivo de configuração não encontrado: ${configPath}`);
      process.exit(1);
    }

    try {
      const config = ConfigLoader.load(configPath);
      const outputManager = new OutputManager(config);
      const reportManager = new ReportManager(config);
      const batchProcessor = new BatchProcessor(
        config,
        outputManager,
        reportManager
      );

      await batchProcessor.process();
    } catch (error) {
      console.error(`❌ Erro ao processar config:`, error);
      process.exit(1);
    }
    return;
  }

  if (args.length === 0 || (args.length === 1 && args[0] === "--help")) {
    console.log(`
╔════════════════════════════════════════╗
║     MD → JSON Converter v1.2           ║
╚════════════════════════════════════════╝

Uso:
  npm run convert <arquivo.md> [--mode=MODO]
  npm run convert --config=<config.json>

Modos disponíveis:
  --mode=full      (padrão) Frontmatter + seções + conteúdo completo
  --mode=sections  Apenas frontmatter + seções separadas
  --mode=raw       Apenas frontmatter + conteúdo completo

Exemplos:
  # Arquivo único
  npm run convert -- ./examples/input/exemplo.md
  npm run convert -- ./examples/input/exemplo.md --mode=sections

  # Múltiplos arquivos via config
  npm run convert -- --config=./config.json

Nota: O -- é necessário para passar os argumentos corretamente para o script
    `);
    process.exit(0);
  }

  // Pega arquivo (sempre primeiro argumento)
  const inputPath = args[0];

  // Pega mode (procura em todos os argumentos)
  let mode: OutputMode = "full";
  const modeArg = args.find((arg) => arg.startsWith("--mode="));
  console.log("Args recebidos:", args);
  console.log("Modo encontrado:", modeArg);
  if (modeArg) {
    const modeValue = modeArg.split("=")[1] as OutputMode;
    console.log("Modo após split:", modeValue);
    if (["full", "sections", "raw"].includes(modeValue)) {
      mode = modeValue;
      console.log("Modo definido:", mode);
    } else {
      console.error(`❌ Modo inválido: ${modeValue}`);
      console.error(`   Modos válidos: full, sections, raw`);
      process.exit(1);
    }
  }

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
    console.log(`📖 Lendo: ${inputPath}`);
    const content = fs.readFileSync(inputPath, "utf-8");

    console.log(`⚙️  Convertendo (modo: ${mode})...`);
    const parsed = MarkdownParser.parse(content);

    const validation = Validator.validateParsed(parsed);
    if (!validation.valid) {
      console.warn(`\n⚠️  Avisos:`);
      validation.errors.forEach((err) => console.warn(`   ${err}`));
      console.log("");
    }

    // Monta output baseado no mode
    let output: any;

    if (mode === "full") {
      output = {
        frontmatter: parsed.frontmatter,
        sections: parsed.sections,
        rawContent: parsed.rawContent,
      };
    } else if (mode === "sections") {
      output = {
        frontmatter: parsed.frontmatter,
        sections: parsed.sections,
      };
    } else if (mode === "raw") {
      output = {
        frontmatter: parsed.frontmatter,
        content: parsed.rawContent,
      };
    }

    // Gera JSON
    const outputPath = inputPath.replace(/\.md$/, ".json");
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf-8");

    console.log(`✅ Conversão concluída!`);
    console.log(`📄 Arquivo gerado: ${outputPath}`);
    console.log(`\n📊 Estatísticas:`);
    console.log(`   - Modo: ${mode}`);
    console.log(
      `   - Campos frontmatter: ${Object.keys(parsed.frontmatter).length}`
    );

    if (mode === "full" || mode === "sections") {
      console.log(
        `   - Seções encontradas: ${Object.keys(parsed.sections).length}`
      );
    }
    if (mode === "full" || mode === "raw") {
      console.log(`   - Tamanho conteúdo: ${parsed.rawContent.length} chars`);
    }
  } catch (error) {
    console.error(`❌ Erro na conversão:`, error);
    process.exit(1);
  }
}

// Auto-executa a função main
main().catch((error) => {
  console.error("❌ Erro fatal:", error);
  process.exit(1);
});
