// ============================================
// src/validator.ts
// ============================================
import type { ParsedMarkdown } from "./types";

export class Validator {
  /**
   * Valida se arquivo existe (simulado - no Node usaria fs.existsSync)
   */
  static fileExists(path: string): boolean {
    // No ambiente real: return fs.existsSync(path);
    return true; // Placeholder
  }

  /**
   * Valida se é arquivo .md
   */
  static isMarkdownFile(path: string): boolean {
    return path.endsWith(".md");
  }

  /**
   * Valida conteúdo parsed
   */
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
