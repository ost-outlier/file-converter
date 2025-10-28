// ============================================
// src/parser.ts
// ============================================
import type { ParsedMarkdown, Frontmatter } from "./types";

export class MarkdownParser {
  /**
   * Parse completo de um arquivo MD
   */
  static parse(content: string): ParsedMarkdown {
    const { frontmatter, body } = this.extractFrontmatter(content);
    const sections = this.parseSections(body);

    return {
      frontmatter,
      sections,
      rawContent: body,
    };
  }

  /**
   * Extrai frontmatter YAML (entre ---)
   */
  private static extractFrontmatter(content: string): {
    frontmatter: Frontmatter;
    body: string;
  } {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
    const match = content.match(frontmatterRegex);

    if (!match) {
      return { frontmatter: {}, body: content };
    }

    const yamlContent = match[1];
    const body = content.replace(frontmatterRegex, "");

    // Parse YAML simples (key: value)
    const frontmatter: Frontmatter = {};
    const lines = yamlContent.split("\n");

    for (const line of lines) {
      const [key, ...valueParts] = line.split(":");
      if (key && valueParts.length > 0) {
        const value = valueParts.join(":").trim();
        frontmatter[key.trim()] = this.parseValue(value);
      }
    }

    return { frontmatter, body };
  }

  /**
   * Converte string em tipo apropriado (number, boolean, string)
   */
  private static parseValue(value: string): any {
    // Número
    if (/^\d+$/.test(value)) {
      return parseInt(value, 10);
    }
    if (/^\d+\.\d+$/.test(value)) {
      return parseFloat(value);
    }
    // Boolean
    if (value === "true") return true;
    if (value === "false") return false;
    // String (remove aspas se tiver)
    return value.replace(/^["']|["']$/g, "");
  }

  /**
   * Separa conteúdo em seções baseado em headers
   */
  private static parseSections(
    markdown: string
  ): Record<string, string | string[]> {
    const sections: Record<string, string | string[]> = {};
    const lines = markdown.split("\n");

    let currentSection = "_content"; // Seção default antes do primeiro header
    let currentLines: string[] = [];

    for (const line of lines) {
      // Header h1 ou h2
      if (line.match(/^#{1,2}\s+/)) {
        // Salva seção anterior
        if (currentLines.length > 0) {
          sections[currentSection] = this.processLines(currentLines);
        }

        // Nova seção
        currentSection = line.replace(/^#{1,2}\s+/, "").trim();
        currentLines = [];
      } else {
        currentLines.push(line);
      }
    }

    // Última seção
    if (currentLines.length > 0) {
      sections[currentSection] = this.processLines(currentLines);
    }

    return sections;
  }

  /**
   * Processa linhas: detecta listas ou retorna texto
   */
  private static processLines(lines: string[]): string | string[] {
    const trimmed = lines.map((l) => l.trim()).filter((l) => l.length > 0);

    if (trimmed.length === 0) return "";

    // Se TODAS as linhas são listas, retorna array
    const allBullets = trimmed.every(
      (l) =>
        l.startsWith("- ") ||
        l.startsWith("* ") ||
        l.startsWith("+ ") ||
        l.match(/^\d+\.\s/)
    );

    if (allBullets) {
      return trimmed.map((l) =>
        l.replace(/^[-*+]\s+/, "").replace(/^\d+\.\s+/, "")
      );
    }

    // Senão, retorna texto unificado
    return trimmed.join("\n");
  }
}
