/**
 * Builds the static export during CI dependency install.
 *
 * Workers Builds runs its *deploy* command whether or not a build command
 * is configured. With none set, `wrangler deploy` runs against a repo that
 * has no `out/` directory and fails with:
 *
 *   The directory specified by the "assets.directory" field in your
 *   configuration file does not exist: /opt/buildhome/repo/out
 *
 * The proper fix is one field in the Cloudflare dashboard — set the deploy
 * command to `npm run deploy`, which is `next build && wrangler deploy`,
 * or set a build command of `npm run build`. This hook is the safety net
 * for when neither is set, so a push still ships. Once the dashboard is
 * configured, delete this file and the `postinstall` script; leaving both
 * in place only means the build runs twice.
 *
 * It is deliberately inert outside CI, so `npm install` on a developer's
 * machine stays an install and nothing more. It also never fails the
 * install: a broken build should surface as a failed deploy with the real
 * error, not as an unresolvable dependency step.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const inCI = Boolean(process.env.WORKERS_CI || process.env.CI);

if (!inCI) {
  process.exit(0);
}

if (process.env.SKIP_BUILD_ON_INSTALL === "1") {
  console.log("[ci-build] SKIP_BUILD_ON_INSTALL=1, leaving the build alone.");
  process.exit(0);
}

if (existsSync("out")) {
  console.log("[ci-build] out/ already exists, nothing to do.");
  process.exit(0);
}

console.log("[ci-build] CI install with no out/ — running next build.");
const result = spawnSync("npx", ["next", "build"], { stdio: "inherit" });

if (result.status !== 0) {
  console.error(
    "[ci-build] next build failed. Letting the install finish so the " +
      "deploy step reports the real error.",
  );
}
