import * as fs from "fs";
import * as path from "path";
import { BaseReportManager } from "@file-converter/core";
import { MarkdownConfig } from "./types";
import type { ParsedMarkdown } from "./types";

export class ReportManager extends BaseReportManager<MarkdownConfig> {
  addSuccess(
    filePath: string,
    content: ParsedMarkdown,
    warnings: string[] = []
  ) {
    this.report.summary.totalFiles++;
    this.report.summary.successCount++;
    if (warnings.length > 0) {
      this.report.summary.warningCount += warnings.length;
    }

    this.report.files.push({
      path: filePath,
      status: "success",
      warnings: this.config.report.includeWarnings ? warnings : undefined,
      stats: {
        frontmatterFields: Object.keys(content.frontmatter).length,
        sections: Object.keys(content.sections).length,
        contentSize: content.rawContent.length,
      },
    });
  }

  addError(filePath: string, error: string) {
    this.report.summary.totalFiles++;
    this.report.summary.errorCount++;

    this.report.files.push({
      path: filePath,
      status: "error",
      error,
    });
  }

  async save() {
    if (!this.config.report.enabled) return;

    const reportPath = path.join(
      this.config.output.directory,
      this.config.report.filename
    );

    // Cria diretório se não existir
    const dir = path.dirname(reportPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await fs.promises.writeFile(
      reportPath,
      JSON.stringify(this.report, null, 2)
    );
  }
}
