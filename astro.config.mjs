import { defineConfig } from "astro/config";

const target = process.env.DEPLOY_TARGET ?? "development";

const targets = {
  development: {
    site: "https://zengruppe-linz.github.io",
    base: "/development",
  },
  staging: {
    site: "https://zengruppe-linz.github.io",
    base: "/staging",
  },
  production: {
    site: "https://zengruppe-linz.at",
    base: "/",
  },
};

if (!(target in targets)) {
  throw new Error(`Unknown DEPLOY_TARGET: ${target}`);
}

export default defineConfig(targets[target]);
