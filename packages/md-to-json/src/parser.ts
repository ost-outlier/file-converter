import type { ParsedMarkdown, Frontmatter } from "./types";

export class MarkdownParser {
  static parse(content: string): ParsedMarkdown {
    const { frontmatter, body } = this.extractFrontmatter(content);
    const sections = this.parseSections(body);

    return {
      frontmatter,
      sections,
      rawContent: body,
    };
  }

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

  private static parseValue(value: string): any {
    if (/^\d+$/.test(value)) {
      return parseInt(value, 10);
    }
    if (/^\d+\.\d+$/.test(value)) {
      return parseFloat(value);
    }
    if (value === "true") return true;
    if (value === "false") return false;
    return value.replace(/^["']|["']$/g, "");
  }

  private static parseSections(
    markdown: string
  ): Record<string, string | string[]> {
    const sections: Record<string, string | string[]> = {};
    const lines = markdown.split("\n");

    let currentSection = "_content";
    let currentLines: string[] = [];

    for (const line of lines) {
      if (line.match(/^#{1,2}\s+/)) {
        if (currentLines.length > 0) {
          sections[currentSection] = this.processLines(currentLines);
        }

        currentSection = line.replace(/^#{1,2}\s+/, "").trim();
        currentLines = [];
      } else {
        currentLines.push(line);
      }
    }

    if (currentLines.length > 0) {
      sections[currentSection] = this.processLines(currentLines);
    }

    return sections;
  }

  private static processLines(lines: string[]): string | string[] {
    const trimmed = lines.map((l) => l.trim()).filter((l) => l.length > 0);

    if (trimmed.length === 0) return "";

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

    return trimmed.join("\n");
  }
}
