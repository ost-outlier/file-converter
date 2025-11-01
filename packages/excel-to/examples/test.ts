import { ExcelToMarkdown } from "../src";
import { ExcelConfig } from "../src/types";
import * as path from "path";
import * as fs from "fs";

// Carrega a configuração
const configPath = path.join(__dirname, "config-exemplo.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8")) as ExcelConfig;

// Inicializa o conversor
const converter = new ExcelToMarkdown(config);

// Define os caminhos
const inputFile = path.join(__dirname, "input/exemplo.xlsx");
const outputDir = path.join(__dirname, "output");

// Executa a conversão
converter.convert(inputFile, outputDir);
