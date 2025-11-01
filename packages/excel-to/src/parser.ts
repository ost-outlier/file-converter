import * as XLSX from "xlsx";
import { ExcelConfig } from "./types";

export interface ParsedRow {
  [key: string]: any;
}

export class ExcelParser {
  static parse(filePath: string, config: ExcelConfig): ParsedRow[] {
    // Lê o arquivo Excel
    const workbook = XLSX.readFile(filePath);

    // Define qual planilha usar
    const sheetName = config.input.sheet || workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Converte para JSON
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Configurações de linha
    const startRow = (config.input.startRow || 2) - 1; // Converte para 0-based
    const endRow = config.input.endRow
      ? config.input.endRow - 1
      : jsonData.length - 1;

    // Encontra os índices das colunas desejadas
    const headerRow = jsonData[0] as string[];
    const columnIndices = config.input.columns.map((colName) => {
      const index = headerRow.findIndex(
        (header) => header.toLowerCase() === colName.toLowerCase()
      );
      if (index === -1) {
        throw new Error(`Coluna não encontrada: ${colName}`);
      }
      return index;
    });

    // Extrai os dados das linhas
    const rows: ParsedRow[] = [];
    for (let i = startRow; i <= endRow; i++) {
      const row = jsonData[i] as any[];
      if (!row) continue;

      const parsedRow: ParsedRow = {};
      columnIndices.forEach((colIndex, idx) => {
        const colName = config.input.columns[idx];
        parsedRow[colName] = row[colIndex];
      });

      rows.push(parsedRow);
    }

    return rows;
  }
}
