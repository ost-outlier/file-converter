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
  /**
   * Additional text added before the generated markdown content.
   */
  properties?: string;
}

export interface VideoToMarkdownTemplate {
  /**
   * Directory where the video files are located.
   */
  input?: string;
  /**
   * Base directory where the notes should be written.
   */
  output?: string;
  /**
   * Overwrite existing markdown files when true.
   */
  force?: boolean;
  /**
   * Additional text added before the generated markdown content.
   */
  properties?: string;
}
