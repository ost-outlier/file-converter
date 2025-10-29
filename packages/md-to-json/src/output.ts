import * as fs from "fs";
import * as path from "path";
import { MarkdownConfig } from "./types";
import type { ParsedMarkdown } from "./types";

export class OutputManager {
  constructor(private config: MarkdownConfig) {}

  private processContent(parsed: ParsedMarkdown): any {
    const mode = this.config.input.mode || "full";

    if (mode === "full") {
      return {
        frontmatter: parsed.frontmatter,
        sections: parsed.sections,
        rawContent: parsed.rawContent,
      };
    } else if (mode === "sections") {
      return {
        frontmatter: parsed.frontmatter,
        sections: parsed.sections,
      };
    } else if (mode === "raw") {
      return {
        frontmatter: parsed.frontmatter,
        content: parsed.rawContent,
      };
    }

    return parsed; // fallback para full
  }

  async saveOutput(files: { path: string; content: ParsedMarkdown }[]) {
    // Processa o conteúdo de acordo com o modo
    const processedFiles = files.map((file) => ({
      path: file.path,
      content: this.processContent(file.content),
    }));
    // Cria diretório de saída se não existir
    if (!fs.existsSync(this.config.output.directory)) {
      fs.mkdirSync(this.config.output.directory, { recursive: true });
    }

    // Salva arquivos individuais se configurado
    if (this.config.output.keepIndividualFiles) {
      await this.saveIndividualFiles(processedFiles);
    }

    // Consolida arquivos se configurado
    if (this.config.output.consolidate.enabled) {
      await this.consolidateFiles(processedFiles);
    }
  }

  private async saveIndividualFiles(
    files: { path: string; content: ParsedMarkdown }[]
  ) {
    for (const file of files) {
      const outputPath = this.getOutputPath(file.path);
      await fs.promises.writeFile(
        outputPath,
        JSON.stringify(file.content, null, 2)
      );
    }
  }

  private async consolidateFiles(
    files: { path: string; content: ParsedMarkdown }[]
  ) {
    const consolidated: { [key: string]: any } = {};

    // Agrupa por tipo se configurado
    if (this.config.output.consolidate.groupBy) {
      for (const file of files) {
        const groupValue =
          file.content.frontmatter[this.config.output.consolidate.groupBy];
        if (!consolidated[groupValue]) {
          consolidated[groupValue] = [];
        }
        consolidated[groupValue].push({
          ...file.content,
          _source: path.basename(file.path),
        });
      }
    } else {
      // Sem agrupamento, lista simples
      consolidated.files = files.map((file) => ({
        ...file.content,
        _source: path.basename(file.path),
      }));
    }

    const consolidatedPath = path.join(
      this.config.output.directory,
      this.config.output.consolidate.filename
    );

    await fs.promises.writeFile(
      consolidatedPath,
      JSON.stringify(consolidated, null, 2)
    );
  }

  private getOutputPath(inputPath: string): string {
    const fileName = path.basename(inputPath, ".md") + ".json";
    return path.join(this.config.output.directory, fileName);
  }
}
