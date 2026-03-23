import { resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { watch as chokidarWatch } from "chokidar";
import { glob } from "glob";
import { build, buildFile, buildContentIndex } from "./build.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PACKAGE_ROOT = resolve(__dirname, "..");
const CONTENT_DIR = resolve(PACKAGE_ROOT, "../../content");
const CLIENT_OUTPUT_DIR = resolve(PACKAGE_ROOT, "../client/public/content");
const SERVER_OUTPUT_DIR = resolve(PACKAGE_ROOT, "../server/content");
const OUTPUT_DIRS = [CLIENT_OUTPUT_DIR, SERVER_OUTPUT_DIR];

// ── Helpers ──────────────────────────────────────────────────────────────────

function timestamp(): string {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

function isYamlFile(filePath: string): boolean {
  return /\.ya?ml$/i.test(filePath);
}

/**
 * Rebuild the content index from the current set of YAML files on disk.
 */
async function rebuildIndex(): Promise<void> {
  const files = await glob("**/*.{yaml,yml}", {
    cwd: CONTENT_DIR,
    absolute: true,
    nodir: true,
  });
  await buildContentIndex(files, OUTPUT_DIRS);
  console.log(`  [${timestamp()}] Content index updated (${files.length} file(s))`);
}

// ── Watch mode ───────────────────────────────────────────────────────────────

async function startWatch(): Promise<void> {
  // Run a full build first so output directories are up to date.
  console.log("Running initial full build...\n");
  await build();
  console.log("\nStarting watch mode...\n");
  console.log(`  Watching: ${CONTENT_DIR}`);
  console.log("  Press Ctrl+C to stop.\n");

  const watcher = chokidarWatch(CONTENT_DIR, {
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 200,
      pollInterval: 50,
    },
  });

  watcher.on("change", async (filePath: string) => {
    if (!isYamlFile(filePath)) return;

    const rel = relative(CONTENT_DIR, filePath);
    console.log(`  [${timestamp()}] Changed: ${rel}`);

    const result = await buildFile(filePath, OUTPUT_DIRS);
    if (result.ok) {
      console.log(`  [${timestamp()}] Rebuilt:  ${rel}`);
    }
  });

  watcher.on("add", async (filePath: string) => {
    if (!isYamlFile(filePath)) return;

    const rel = relative(CONTENT_DIR, filePath);
    console.log(`  [${timestamp()}] Added:   ${rel}`);

    const result = await buildFile(filePath, OUTPUT_DIRS);
    if (result.ok) {
      console.log(`  [${timestamp()}] Built:   ${rel}`);
    }

    // A new file means the index needs updating.
    await rebuildIndex();
  });

  watcher.on("unlink", async (filePath: string) => {
    if (!isYamlFile(filePath)) return;

    const rel = relative(CONTENT_DIR, filePath);
    console.log(`  [${timestamp()}] Removed: ${rel}`);

    // Rebuild index so the deleted entry is dropped.
    await rebuildIndex();
  });

  watcher.on("error", (err: Error) => {
    console.error(`  [${timestamp()}] Watcher error:`, err.message);
  });

  // Keep the process alive.
  process.on("SIGINT", () => {
    console.log("\n  Stopping watch mode...");
    watcher.close().then(() => process.exit(0));
  });
}

// ── CLI entry point ──────────────────────────────────────────────────────────

startWatch().catch((err) => {
  console.error("Watch mode failed:", err);
  process.exitCode = 1;
});
