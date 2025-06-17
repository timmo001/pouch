import { mkdirSync, existsSync, readdirSync, copyFileSync } from "node:fs";
import { join, resolve } from "node:path";

function copyDir(src: string, dest: string) {
  if (!existsSync(dest)) mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

const srcDir = resolve("convex");
const webDest = resolve("web", "convex");
const nativeDest = resolve("native", "convex");

copyDir(srcDir, webDest);
copyDir(srcDir, nativeDest);

console.log("Copied convex/ to web/convex and native/convex");
