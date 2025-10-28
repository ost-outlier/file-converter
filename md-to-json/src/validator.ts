import * as fs from "fs";
import type { ParsedMarkdown } from "./types";

export class Validator {
  static fileExists(path: string): boolean {
    return fs.existsSync(path);
  }

  static isMarkdownFile(path: string): boolean {
    return path.endsWith(".md");
  }

  static validateParsed(parsed: ParsedMarkdown): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!parsed.frontmatter || Object.keys(parsed.frontmatter).length === 0) {
      errors.push("⚠️  Nenhum frontmatter encontrado");
    }

    if (!parsed.sections || Object.keys(parsed.sections).length === 0) {
      errors.push("⚠️  Nenhuma seção encontrada no documento");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
