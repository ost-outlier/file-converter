/**
 * Base interfaces for file conversion configurations
 */
export interface BaseConfig {
  input: {
    patterns: string[];
  };
  output: {
    directory: string;
    consolidate: {
      enabled: boolean;
      filename: string;
      groupBy?: string;
    };
    keepIndividualFiles: boolean;
  };
  report: {
    enabled: boolean;
    filename: string;
    includeWarnings: boolean;
  };
}

/**
 * Base report structure shared by all converters
 */
export interface BaseReport {
  timestamp: string;
  summary: {
    totalFiles: number;
    successCount: number;
    errorCount: number;
    warningCount: number;
  };
  files: {
    path: string;
    status: "success" | "error";
    warnings?: string[];
    error?: string;
    stats?: Record<string, any>;
  }[];
}

/**
 * Base class for configuration loaders
 */
export abstract class BaseConfigLoader<T extends BaseConfig> {
  abstract load(configPath: string): T;
  abstract validate(config: any): T;
}

/**
 * Base class for file processors
 */
export abstract class BaseProcessor<T extends BaseConfig> {
  constructor(protected config: T) {}
  abstract process(): Promise<void>;
}

/**
 * Base class for report managers
 */
export abstract class BaseReportManager<T extends BaseConfig> {
  protected report: BaseReport;

  constructor(protected config: T) {
    this.report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalFiles: 0,
        successCount: 0,
        errorCount: 0,
        warningCount: 0,
      },
      files: [],
    };
  }

  abstract addSuccess(
    filePath: string,
    content: any,
    warnings?: string[]
  ): void;
  abstract addError(filePath: string, error: string): void;
  abstract save(): Promise<void>;

  getReport(): BaseReport {
    return this.report;
  }
}
