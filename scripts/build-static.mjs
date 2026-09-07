import { spawn } from "child_process";

console.log("🚀 Starting Static Portfolio Export Build...");
process.env.STATIC_EXPORT = "true";

const cmd = process.platform === "win32" ? "npx.cmd" : "npx";
const buildProcess = spawn(cmd, ["next", "build"], {
  stdio: "inherit",
  env: {
    ...process.env,
    STATIC_EXPORT: "true",
  },
  shell: true,
});

buildProcess.on("close", (code) => {
  if (code === 0) {
    console.log("✅ Static portfolio export completed successfully in /out directory!");
  } else {
    console.error(`❌ Build failed with exit code ${code}`);
    process.exit(code || 1);
  }
});
