export interface Frontmatter {
  [key: string]: any;
}

export interface ParsedMarkdown {
  frontmatter: Frontmatter;
  sections: Record<string, string | string[]>;
  rawContent: string;
}

export type OutputMode = "full" | "sections" | "raw";
