import { MarkdownConverter } from "./markdown";
import { ExcelParser, ParsedRow } from "./parser";
import { ExcelConfig } from "./types";
import * as path from "path";
import * as fs from "fs";

export class ExcelToMarkdown {
  constructor(private config: ExcelConfig) {}

  convert(inputFile: string, outputDir: string) {
    // Parse Excel file
    const rows = ExcelParser.parse(inputFile, this.config);

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Convert each row to a markdown file
    rows.forEach((row, index) => {
      const markdown = MarkdownConverter.convert(
        row,
        this.config.output?.template
      );

      // Generate filename
      let filename: string;
      if (this.config.output?.filenamePattern) {
        filename = this.generateFilename(
          row,
          this.config.output.filenamePattern
        );
      } else {
        // Default filename pattern
        filename = `file-${index + 1}`;
      }

      // Ensure .md extension
      if (!filename.endsWith(".md")) {
        filename += ".md";
      }

      // Write file
      const outputPath = path.join(outputDir, filename);
      fs.writeFileSync(outputPath, markdown, "utf8");
    });
  }

  private generateFilename(row: ParsedRow, pattern: string): string {
    let filename = pattern;

    // Replace variables in pattern (format: ${column_name})
    Object.entries(row).forEach(([key, value]) => {
      filename = filename.replace(
        new RegExp(`\\$\{${key}\}`, "g"),
        String(value)
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-") // Sanitize: replace special chars with -
          .replace(/-+/g, "-") // Replace multiple consecutive dashes with single dash
          .replace(/^-|-$/g, "")
      ); // Remove leading/trailing dashes
    });

    return filename;
  }
}
