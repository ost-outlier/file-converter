import { ParsedRow } from "./parser";

export class MarkdownConverter {
  static convert(row: ParsedRow, template?: string): string {
    if (template) {
      return this.applyTemplate(row, template);
    }

    // Formato padrão se não tiver template
    const frontmatter = Object.entries(row)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

    return `---\n${frontmatter}\n---\n\n# ${Object.values(row)[0]}\n`;
  }

  private static applyTemplate(row: ParsedRow, template: string): string {
    let result = template;

    // Substitui variáveis no template (formato: ${nome_coluna})
    Object.entries(row).forEach(([key, value]) => {
      result = result.replace(new RegExp(`\\$\{${key}\}`, "g"), String(value));
    });

    return result;
  }
}
