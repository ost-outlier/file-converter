import * as fs from "fs";
import * as path from "path";
import * as glob from "glob";
import { BaseProcessor } from "@file-converter/core";
import { MarkdownParser } from "./parser";
import { Validator } from "./validator";
import { MarkdownConfig } from "./types";
import type { OutputManager } from "./output";
import type { ReportManager } from "./report";
import type { ParsedMarkdown } from "./types";

export class BatchProcessor extends BaseProcessor<MarkdownConfig> {
  constructor(
    config: MarkdownConfig,
    private outputManager: OutputManager,
    private reportManager: ReportManager
  ) {
    super(config);
  }

  async process() {
    const files: { path: string; content: ParsedMarkdown }[] = [];
    const warnings: string[] = [];

    // Processa todos os padrões de arquivos
    for (const pattern of this.config.input.patterns) {
      // Se o pattern for um diretório existente, converte para um glob que busca por .md recursivamente
      let matches: string[] = [];
      try {
        // Normalize slashes for glob (glob works better with forward slashes)
        const normalizedPattern = pattern.replace(/\\/g, "/");
        if (fs.existsSync(pattern) && fs.statSync(pattern).isDirectory()) {
          const dirPattern = path
            .join(pattern, "**", "*.md")
            .replace(/\\/g, "/");
          matches = glob.sync(dirPattern, { nodir: true });
        } else {
          matches = glob.sync(normalizedPattern, { nodir: true });
        }
      } catch (err) {
        // Em caso de erro ao checar o sistema de arquivos, ainda tentamos usar o pattern como glob
        matches = glob.sync(pattern.replace(/\\/g, "/"), { nodir: true });
      }

      for (const inputPath of matches) {
        if (!Validator.isMarkdownFile(inputPath)) continue;

        try {
          console.log(`📖 Lendo: ${inputPath}`);
          const content = fs.readFileSync(inputPath, "utf-8");
          const parsed = MarkdownParser.parse(content);

          const validation = Validator.validateParsed(parsed);
          if (!validation.valid && validation.errors.length > 0) {
            validation.errors.forEach((err) =>
              warnings.push(`${inputPath}: ${err}`)
            );
          }

          files.push({ path: inputPath, content: parsed });
          this.reportManager.addSuccess(inputPath, parsed, validation.errors);
        } catch (error: unknown) {
          console.error(`❌ Erro ao processar ${inputPath}:`, error);
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          this.reportManager.addError(inputPath, errorMessage);
        }
      }
    }

    // Salva os arquivos processados
    await this.outputManager.saveOutput(files);

    // Salva o relatório
    await this.reportManager.save();

    // Exibe resumo
    const report = this.reportManager.getReport();
    console.log(`\n📊 Resumo da Conversão:`);
    console.log(`   - Total de arquivos: ${report.summary.totalFiles}`);
    console.log(`   - Sucessos: ${report.summary.successCount}`);
    console.log(`   - Erros: ${report.summary.errorCount}`);
    console.log(`   - Avisos: ${report.summary.warningCount}`);

    if (warnings.length > 0) {
      console.log(`\n⚠️  Avisos:`);
      warnings.forEach((warn) => console.log(`   ${warn}`));
    }
  }
}
