import { BaseConfig } from "@file-converter/core";

export interface ExcelConfig extends BaseConfig {
  input: {
    patterns: string[];
    sheet?: string; // Nome da planilha, se não especificado usa a primeira
    columns: string[]; // Nomes das colunas a serem extraídas
    startRow?: number; // Linha inicial (1-based), default: 2 (assumindo cabeçalho)
    endRow?: number; // Linha final (opcional)
  };
  output: {
    directory: string;
    format: "markdown"; // Por enquanto só suporta markdown
    template?: string; // Template opcional para o markdown
    filenamePattern?: string; // Padrão para gerar nomes dos arquivos
    consolidate: {
      enabled: boolean;
      filename: string;
    };
    keepIndividualFiles: boolean;
  };
  report: {
    enabled: boolean;
    filename: string;
    includeWarnings: boolean;
  };
}
