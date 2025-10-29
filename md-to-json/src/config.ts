import * as fs from "fs";
import { OutputMode } from "./types";

export interface ConversionConfig {
  input: {
    patterns: string[];
    mode?: OutputMode;
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

export interface ConversionReport {
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
    stats?: {
      frontmatterFields: number;
      sections?: number;
      contentSize?: number;
    };
  }[];
}

export class ConfigLoader {
  static load(configPath: string): ConversionConfig {
    try {
      const configContent = fs.readFileSync(configPath, "utf-8");
      const config = JSON.parse(configContent);
      return this.validate(config);
    } catch (error: any) {
      throw new Error(`Erro ao carregar config: ${error.message}`);
    }
  }

  private static validate(config: any): ConversionConfig {
    // Validações básicas
    if (!config.input?.patterns) {
      throw new Error("Config inválido: input.patterns é obrigatório");
    }
    if (!Array.isArray(config.input.patterns)) {
      throw new Error("Config inválido: input.patterns deve ser um array");
    }
    if (!config.output?.directory) {
      throw new Error("Config inválido: output.directory é obrigatório");
    }

    // Valores default
    return {
      input: {
        patterns: config.input.patterns,
        mode: config.input.mode || "full",
      },
      output: {
        directory: config.output.directory,
        consolidate: {
          enabled: config.output.consolidate?.enabled ?? false,
          filename: config.output.consolidate?.filename || "consolidated.json",
          groupBy: config.output.consolidate?.groupBy,
        },
        keepIndividualFiles: config.output.keepIndividualFiles ?? true,
      },
      report: {
        enabled: config.report?.enabled ?? true,
        filename: config.report?.filename || "conversion-report.json",
        includeWarnings: config.report?.includeWarnings ?? true,
      },
    };
  }
}
