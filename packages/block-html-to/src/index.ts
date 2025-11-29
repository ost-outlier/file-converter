import { promises as fs } from "fs";
import * as path from "path";
import { fileURLToPath, pathToFileURL } from "url";

interface CliOptions {
  inputPath: string;
  outputDir: string;
  baseName: string;
  startIndex: number;
}

interface ExtractionSummary {
  totalTextareas: number;
  writtenFiles: number;
  skippedEmpty: number;
  outputDir: string;
}

interface UserConfig {
  input?: string;
  output?: string;
  baseName?: string;
  start?: number;
}

async function main() {
  try {
    const options = await parseArgs(process.argv.slice(2));
    const summary = await extractTextareas(options);
    printSummary(options, summary);
  } catch (error) {
    console.error(`[error] ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
}

async function parseArgs(args: string[]): Promise<CliOptions> {
  const { configPath, passthroughArgs } = pullConfigArg(args);
  const config = await loadConfig(configPath);

  let inputPath = config.input ?? getDefaultInputPath();
  let outputDir = config.output ?? getDefaultOutputDir();
  let baseName: string | undefined = config.baseName;
  const configStart = config.start;
  let startIndex =
    configStart === undefined ? 1 : parseStart(String(configStart));

  for (let index = 0; index < passthroughArgs.length; index += 1) {
    const arg = passthroughArgs[index];
    const next = passthroughArgs[index + 1];

    if (arg === "--input" || arg === "-i") {
      if (!next) throw new Error("missing value for --input");
      inputPath = next;
      index += 1;
      continue;
    }

    if (arg.startsWith("--input=")) {
      inputPath = arg.substring("--input=".length);
      continue;
    }

    if (arg === "--output" || arg === "-o") {
      if (!next) throw new Error("missing value for --output");
      outputDir = next;
      index += 1;
      continue;
    }

    if (arg.startsWith("--output=")) {
      outputDir = arg.substring("--output=".length);
      continue;
    }

    if (arg === "--base-name" || arg === "-b") {
      if (!next) throw new Error("missing value for --base-name");
      baseName = next;
      index += 1;
      continue;
    }

    if (arg.startsWith("--base-name=")) {
      baseName = arg.substring("--base-name=".length);
      continue;
    }

    if (arg === "--start" || arg === "-s") {
      if (!next) throw new Error("missing value for --start");
      startIndex = parseStart(next);
      index += 1;
      continue;
    }

    if (arg.startsWith("--start=")) {
      startIndex = parseStart(arg.substring("--start=".length));
      continue;
    }

    throw new Error(`unknown argument: ${arg}`);
  }

  const resolvedInput = path.resolve(inputPath);
  const resolvedOutput = path.resolve(outputDir);
  const resolvedBaseName =
    sanitizeBaseName(baseName ?? path.parse(resolvedInput).name) || "bloco-html";

  return {
    inputPath: resolvedInput,
    outputDir: resolvedOutput,
    baseName: resolvedBaseName,
    startIndex,
  };
}

async function extractTextareas(options: CliOptions): Promise<ExtractionSummary> {
  const html = await fs.readFile(options.inputPath, "utf8");
  const matches = Array.from(
    html.matchAll(/<textarea\b[^>]*>([\s\S]*?)<\/textarea\s*>/gi)
  );

  let currentIndex = options.startIndex;
  let writtenFiles = 0;
  let skippedEmpty = 0;

  await fs.mkdir(options.outputDir, { recursive: true });

  for (const match of matches) {
    const content = match[1];
    if (!content.trim()) {
      skippedEmpty += 1;
      continue;
    }

    const filename = `${options.baseName}-tela-${currentIndex}.txt`;
    const outputPath = path.join(options.outputDir, filename);
    const cleaned = stripLeadingNewline(removeReturnSymbols(normalizeNewlines(content)));
    await fs.writeFile(outputPath, cleaned, "utf8");

    writtenFiles += 1;
    currentIndex += 1;
  }

  return {
    totalTextareas: matches.length,
    writtenFiles,
    skippedEmpty,
    outputDir: options.outputDir,
  };
}

function normalizeNewlines(value: string): string {
  return value.replace(/\r\n/g, "\n");
}

function stripLeadingNewline(value: string): string {
  return value.replace(/^\n/, "");
}

function removeReturnSymbols(value: string): string {
  // Remove explicit return marker U+23CE and any following whitespace
  return value.replace(/\u23ce\s*/gi, "");
}

function sanitizeBaseName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getDefaultInputPath(): string {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(currentDir, "../bloco-html.html");
}

function getDefaultOutputDir(): string {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(currentDir, "../output");
}

function printSummary(options: CliOptions, summary: ExtractionSummary) {
  console.log("Extracao concluida:");
  console.log(`  HTML: ${options.inputPath}`);
  console.log(`  Pasta de saida: ${summary.outputDir}`);
  console.log(`  Base dos arquivos: ${options.baseName}`);
  console.log(`  Textareas encontrados: ${summary.totalTextareas}`);
  console.log(`  Arquivos criados: ${summary.writtenFiles}`);
  console.log(`  Textareas vazios ignorados: ${summary.skippedEmpty}`);
}

main().catch((error) => {
  console.error(
    `[error] unexpected failure: ${error instanceof Error ? error.message : error}`
  );
  process.exit(1);
});

function pullConfigArg(args: string[]): { configPath?: string; passthroughArgs: string[] } {
  let configPath: string | undefined;
  const passthroughArgs: string[] = [];

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];

    if (arg === "--config" || arg === "-c") {
      if (!next) throw new Error("missing value for --config");
      configPath = next;
      index += 1;
      continue;
    }

    if (arg.startsWith("--config=")) {
      configPath = arg.substring("--config=".length);
      continue;
    }

    passthroughArgs.push(arg);
  }

  return { configPath, passthroughArgs };
}

async function loadConfig(configPath?: string): Promise<UserConfig> {
  const defaultPathTs = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../config.ts"
  );
  const defaultPathJson = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../config.json"
  );

  const candidates = configPath
    ? [path.resolve(configPath)]
    : [defaultPathTs, defaultPathJson];

  for (const candidate of candidates) {
    if (!(await fileExists(candidate))) {
      continue;
    }

    if (candidate.endsWith(".ts") || candidate.endsWith(".js")) {
      try {
        const mod = await import(pathToFileURL(candidate).href);
        const loaded = (mod && (mod.default ?? mod.config ?? mod)) as UserConfig;
        return loaded;
      } catch (error) {
        throw new Error(
          `failed to import config at ${candidate}: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }

    if (candidate.endsWith(".json")) {
      try {
        const raw = await fs.readFile(candidate, "utf8");
        const parsed: UserConfig = JSON.parse(raw);
        return parsed;
      } catch (error) {
        throw new Error(
          `failed to read config at ${candidate}: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }
  }

  // No config found; fallback to defaults
  return {};
}

function parseStart(value: string): number {
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    throw new Error("invalid value for --start (use an integer >= 1)");
  }
  return parsed;
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
