import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * Cloudflare Workers adapter config.
 *
 * Defaults are deliberate: this site is almost entirely static, the only
 * dynamic route is the contact endpoint, and there is nothing to
 * incrementally revalidate, so no cache backend is wired up.
 */
export default defineCloudflareConfig();
