import { BaseConfig } from "@file-converter/core";

export interface Frontmatter {
  [key: string]: any;
}

export interface ParsedMarkdown {
  frontmatter: Frontmatter;
  sections: Record<string, string | string[]>;
  rawContent: string;
}

export type OutputMode = "full" | "sections" | "raw";

export interface MarkdownConfig extends BaseConfig {
  input: {
    patterns: string[];
    mode?: OutputMode;
  };
}
