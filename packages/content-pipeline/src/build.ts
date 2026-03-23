import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname, relative, join, parse as parsePath } from "node:path";
import { fileURLToPath } from "node:url";
import { glob } from "glob";
import { parse as parseYaml } from "yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** Root of the content-pipeline package. */
const PACKAGE_ROOT = resolve(__dirname, "..");

/** Source YAML content directory at the monorepo root. */
const CONTENT_DIR = resolve(PACKAGE_ROOT, "../../content");

/** Primary output: client public directory where the game reads JSON at runtime. */
const CLIENT_OUTPUT_DIR = resolve(PACKAGE_ROOT, "../client/public/content");

/** Secondary output: server content directory for server-side access. */
const SERVER_OUTPUT_DIR = resolve(PACKAGE_ROOT, "../server/content");

// ── Types ────────────────────────────────────────────────────────────────────

interface BuildResult {
  processed: number;
  warnings: number;
  errors: number;
}

interface ContentIndex {
  [contentType: string]: string[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Ensure a directory exists, creating intermediate directories as needed.
 */
async function ensureDir(dirPath: string): Promise<void> {
  await mkdir(dirPath, { recursive: true });
}

/**
 * Write a JSON file to one or more output directories, preserving the relative
 * path structure from the content source directory.
 */
async function writeJsonToOutputs(
  relativePath: string,
  data: unknown,
  outputDirs: string[],
): Promise<void> {
  const jsonContent = JSON.stringify(data, null, 2);
  await Promise.all(
    outputDirs.map(async (outDir) => {
      const dest = join(outDir, relativePath);
      await ensureDir(dirname(dest));
      await writeFile(dest, jsonContent, "utf-8");
    }),
  );
}

// ── Single-file build ────────────────────────────────────────────────────────

/**
 * Process a single YAML file: parse it, validate the `id` field, and write
 * corresponding JSON files to all output directories.
 *
 * Returns `{ ok, warning, id }` so callers can aggregate results.
 */
export async function buildFile(
  absolutePath: string,
  outputDirs: string[] = [CLIENT_OUTPUT_DIR, SERVER_OUTPUT_DIR],
): Promise<{ ok: boolean; warning: boolean; id: string | undefined }> {
  const relPath = relative(CONTENT_DIR, absolutePath);
  const { dir, name } = parsePath(relPath);
  const jsonRelPath = join(dir, `${name}.json`);

  try {
    const raw = await readFile(absolutePath, "utf-8");
    const data: unknown = parseYaml(raw);

    let warning = false;
    let id: string | undefined;

    if (data && typeof data === "object" && !Array.isArray(data)) {
      const record = data as Record<string, unknown>;
      if (typeof record.id === "string" || typeof record.id === "number") {
        id = String(record.id);
      } else {
        console.warn(`  [WARN] Missing "id" field in ${relPath}`);
        warning = true;
      }
    } else {
      console.warn(`  [WARN] Top-level value is not an object in ${relPath}`);
      warning = true;
    }

    await writeJsonToOutputs(jsonRelPath, data, outputDirs);
    return { ok: true, warning, id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`  [ERROR] Failed to process ${relPath}: ${message}`);
    return { ok: false, warning: false, id: undefined };
  }
}

// ── Content index ────────────────────────────────────────────────────────────

/**
 * Build the content-index.json that maps each content type (top-level directory
 * name) to an array of IDs discovered within it.
 */
export async function buildContentIndex(
  files: string[],
  outputDirs: string[] = [CLIENT_OUTPUT_DIR, SERVER_OUTPUT_DIR],
): Promise<ContentIndex> {
  const index: ContentIndex = {};

  for (const filePath of files) {
    const relPath = relative(CONTENT_DIR, filePath);
    const parts = relPath.split(/[\\/]/);
    const contentType = parts.length > 1 ? parts[0] : "_root";

    try {
      const raw = await readFile(filePath, "utf-8");
      const data: unknown = parseYaml(raw);

      if (data && typeof data === "object" && !Array.isArray(data)) {
        const record = data as Record<string, unknown>;
        const id =
          typeof record.id === "string" || typeof record.id === "number"
            ? String(record.id)
            : undefined;

        if (id) {
          if (!index[contentType]) {
            index[contentType] = [];
          }
          index[contentType].push(id);
        }
      }
    } catch {
      // Errors already reported during individual file processing.
    }
  }

  // Sort IDs within each content type for deterministic output.
  for (const key of Object.keys(index)) {
    index[key].sort();
  }

  await writeJsonToOutputs("content-index.json", index, outputDirs);
  return index;
}

// ── Full build ───────────────────────────────────────────────────────────────

/**
 * Run a full build: discover all YAML files, process each one, and generate the
 * content index. Returns aggregate stats.
 */
export async function build(): Promise<BuildResult> {
  const startTime = performance.now();

  console.log("Content Pipeline - Full Build");
  console.log(`  Source:  ${CONTENT_DIR}`);
  console.log(`  Output:  ${CLIENT_OUTPUT_DIR}`);
  console.log(`          ${SERVER_OUTPUT_DIR}`);
  console.log();

  const outputDirs = [CLIENT_OUTPUT_DIR, SERVER_OUTPUT_DIR];

  // Ensure output directories exist.
  await Promise.all(outputDirs.map(ensureDir));

  // Discover YAML files.
  const files = await glob("**/*.{yaml,yml}", {
    cwd: CONTENT_DIR,
    absolute: true,
    nodir: true,
  });

  if (files.length === 0) {
    console.log("  No YAML files found. Nothing to do.");
    return { processed: 0, warnings: 0, errors: 0 };
  }

  console.log(`  Found ${files.length} YAML file(s). Processing...\n`);

  let warnings = 0;
  let errors = 0;

  // Process every file.
  const results = await Promise.all(
    files.map((f) => buildFile(f, outputDirs)),
  );

  for (const r of results) {
    if (!r.ok) errors++;
    if (r.warning) warnings++;
  }

  // Build the content index.
  const index = await buildContentIndex(files, outputDirs);
  const indexEntries = Object.values(index).reduce(
    (sum, ids) => sum + ids.length,
    0,
  );

  const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
  const processed = files.length;

  console.log();
  console.log("  Build complete.");
  console.log(`  Processed: ${processed} file(s)`);
  console.log(`  Index:     ${Object.keys(index).length} type(s), ${indexEntries} ID(s)`);
  if (warnings > 0) console.log(`  Warnings:  ${warnings}`);
  if (errors > 0) console.log(`  Errors:    ${errors}`);
  console.log(`  Duration:  ${elapsed}s`);

  return { processed, warnings, errors };
}

// ── CLI entry point ──────────────────────────────────────────────────────────

// When executed directly (not imported), run a full build.
const isMainModule =
  process.argv[1] &&
  resolve(process.argv[1]) === resolve(__filename);

if (isMainModule) {
  build()
    .then((result) => {
      if (result.errors > 0) {
        process.exitCode = 1;
      }
    })
    .catch((err) => {
      console.error("Build failed:", err);
      process.exitCode = 1;
    });
}
