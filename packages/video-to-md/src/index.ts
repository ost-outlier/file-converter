import { promises as fs } from "fs";
import * as path from "path";
import { pathToFileURL } from "url";
import type {
  VideoToMarkdownOptions,
  VideoToMarkdownTemplate,
} from "./types";
import { templateConfig } from "./template";

const VIDEO_EXTENSIONS = new Set([
  ".mp4",
  ".mov",
  ".mkv",
  ".avi",
  ".wmv",
  ".m4v",
  ".webm",
  ".flv",
]);

interface CliParseResult {
  inputDir?: string;
  options: VideoToMarkdownOptions;
}

interface ProcessStats {
  totalVideos: number;
  created: number;
  overwritten: number;
  skipped: number;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    printHelp();
    process.exit(0);
  }

  let parsed: CliParseResult;

  try {
    parsed = parseArgs(args);
  } catch (error) {
    console.error(`[erro] ${error instanceof Error ? error.message : error}`);
    process.exit(1);
    return;
  }

  parsed = applyTemplateDefaults(parsed, templateConfig);

  if (!parsed.inputDir) {
    console.error("[erro] informe o caminho da pasta com os videos.");
    process.exit(1);
  }

  const rootDir = path.resolve(parsed.inputDir);
  const options: VideoToMarkdownOptions = {
    ...parsed.options,
    outputDir: parsed.options.outputDir
      ? path.resolve(parsed.options.outputDir)
      : parsed.options.outputDir,
  };

  try {
    const stats = await convertDirectory(rootDir, options);
    printSummary(rootDir, options, stats);
  } catch (error) {
    console.error(
      `[erro] falha ao gerar notas: ${
        error instanceof Error ? error.message : error
      }`
    );
    process.exit(1);
  }
}

function printHelp() {
  console.log(`
video-to-md
-----------
Gera notas .md para cada arquivo de video encontrado em uma pasta.

Uso:
  npm run convert -- "<pasta_dos_videos>" [--output="<pasta_notas>"] [--force]

Opcoes:
  --output, -o   Define o diretorio base onde as notas serao escritas.
                 Quando omitido, a nota e criada na mesma pasta do video.
  --force        Sobrescreve notas existentes com o mesmo nome.
  --help, -h     Mostra esta ajuda.
                 Quando executado sem argumentos o programa utiliza as configuracoes definidas em template.ts.
`);
}

function parseArgs(args: string[]): CliParseResult {
  let inputDir: string | undefined;
  const options: VideoToMarkdownOptions = {};

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--force") {
      options.force = true;
      continue;
    }

    if (arg === "--output" || arg === "-o") {
      const value = args[index + 1];
      if (!value) {
        throw new Error("valor ausente para --output");
      }
      options.outputDir = value;
      index += 1;
      continue;
    }

    if (arg.startsWith("--output=")) {
      const value = arg.substring("--output=".length);
      if (!value) {
        throw new Error("valor ausente para --output");
      }
      options.outputDir = value;
      continue;
    }

    if (!inputDir) {
      inputDir = arg;
      continue;
    }

    throw new Error(`argumento desconhecido: ${arg}`);
  }

  return { inputDir, options };
}

function applyTemplateDefaults(
  parsed: CliParseResult,
  template: VideoToMarkdownTemplate
): CliParseResult {
  if (!parsed.inputDir && !template.input) {
    return parsed;
  }

  const mergedOptions: VideoToMarkdownOptions = {
    ...parsed.options,
    outputDir: parsed.options.outputDir ?? template.output,
    force: parsed.options.force ?? template.force ?? false,
    properties: parsed.options.properties ?? template.properties,
  };

  return {
    inputDir: parsed.inputDir ?? template.input,
    options: mergedOptions,
  };
}

async function convertDirectory(
  rootDir: string,
  options: VideoToMarkdownOptions
): Promise<ProcessStats> {
  const rootStats = await fs.stat(rootDir);

  if (!rootStats.isDirectory()) {
    throw new Error("o caminho informado precisa ser uma pasta");
  }

  const videos = await collectVideos(rootDir);
  if (videos.length === 0) {
    console.warn("[aviso] nenhum video encontrado.");
  }

  const stats: ProcessStats = {
    totalVideos: videos.length,
    created: 0,
    overwritten: 0,
    skipped: 0,
  };

  for (const videoPath of videos) {
    const result = await createNote(videoPath, rootDir, options);
    if (result === "created") {
      stats.created += 1;
    } else if (result === "overwritten") {
      stats.overwritten += 1;
    } else {
      stats.skipped += 1;
    }
  }

  return stats;
}

async function collectVideos(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const found: string[] = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isSymbolicLink()) {
      continue;
    }

    if (entry.isDirectory()) {
      const nested = await collectVideos(entryPath);
      found.push(...nested);
    } else if (entry.isFile() && isVideoFile(entry.name)) {
      found.push(entryPath);
    }
  }

  return found;
}

function isVideoFile(filename: string): boolean {
  return VIDEO_EXTENSIONS.has(path.extname(filename).toLowerCase());
}

type NoteResult = "created" | "overwritten" | "skipped";

async function createNote(
  videoPath: string,
  rootDir: string,
  options: VideoToMarkdownOptions
): Promise<NoteResult> {
  const videoDir = path.dirname(videoPath);
  const targetDir = options.outputDir
    ? path.join(options.outputDir, path.relative(rootDir, videoDir))
    : videoDir;

  const videoName = path.parse(videoPath).name;
  const notePath = path.join(targetDir, `${videoName}.md`);
  await fs.mkdir(targetDir, { recursive: true });

  const exists = await fileExists(notePath);
  if (exists && !options.force) {
    console.info(`[skip] nota ja existe: ${notePath}`);
    return "skipped";
  }

  const noteContent = buildNoteContent(
    videoName,
    videoPath,
    options.properties
  );
  await fs.writeFile(notePath, noteContent, "utf8");

  if (exists) {
    console.info(`[ok] nota atualizada: ${notePath}`);
    return "overwritten";
  }

  console.info(`[ok] nota criada: ${notePath}`);
  return "created";
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function buildNoteContent(
  title: string,
  videoPath: string,
  properties?: string
): string {
  const videoUrl = pathToFileURL(videoPath).href;
  const baseContent = `# ${title}
<video src="${videoUrl}" controls width="100%" height="auto">
</video>
`;

  if (!properties) {
    return baseContent;
  }

  const formattedProperties = ensureTrailingNewline(
    applyPropertiesTemplate(properties, videoUrl)
  );

  return `${formattedProperties}${baseContent}`;
}

function applyPropertiesTemplate(template: string, videoUrl: string): string {
  return template.replaceAll("${videoUrl}", videoUrl);
}

function ensureTrailingNewline(value: string): string {
  return value.endsWith("\n") ? value : `${value}\n`;
}

function printSummary(
  rootDir: string,
  options: VideoToMarkdownOptions,
  stats: ProcessStats
) {
  console.log("\nResumo:");
  console.log(`  Pasta analisada: ${rootDir}`);
  console.log(
    `  Destino das notas: ${
      options.outputDir ? options.outputDir : "mesma pasta dos videos"
    }`
  );
  console.log(`  Videos encontrados: ${stats.totalVideos}`);
  console.log(`  Notas criadas: ${stats.created}`);
  console.log(`  Notas atualizadas: ${stats.overwritten}`);
  console.log(`  Notas ignoradas: ${stats.skipped}`);
}

main().catch((error) => {
  console.error(
    `[erro] falha inesperada: ${error instanceof Error ? error.message : error}`
  );
  process.exit(1);
});
