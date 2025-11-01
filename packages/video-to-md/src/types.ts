export interface VideoToMarkdownOptions {
  /**
   * Optional directory where the markdown notes should be written.
   * When omitted the note is created next to the video file.
   */
  outputDir?: string;
  /**
   * Overwrite existing markdown files when true.
   */
  force?: boolean;
}
