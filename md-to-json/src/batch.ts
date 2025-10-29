import * as fs from "fs";
import * as path from "path";
import * as glob from "glob";
import { MarkdownParser } from "./parser";
import { Validator } from "./validator";
import type { ConversionConfig } from "./config";
import type { OutputManager } from "./output";
import type { ReportManager } from "./report";
import type { ParsedMarkdown } from "./types";

export class BatchProcessor {
  constructor(
    private config: ConversionConfig,
    private outputManager: OutputManager,
    private reportManager: any
  ) {}

  async process() {
    const files: { path: string; content: ParsedMarkdown }[] = [];
    const warnings: string[] = [];

    // Processa todos os padrões de arquivos
    for (const pattern of this.config.input.patterns) {
      const matches = glob.sync(pattern);

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
        } catch (error) {
          console.error(`❌ Erro ao processar ${inputPath}:`, error);
          this.reportManager.addError(inputPath, error.message);
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
