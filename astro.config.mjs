import { defineConfig } from "astro/config";

const addExternalLinkAttributes = () => {
  const visit = (node) => {
    if (!node || typeof node !== "object") {
      return;
    }

    if (node.type === "element" && node.tagName === "a") {
      const href = node.properties?.href;

      if (typeof href === "string" && /^https?:\/\//i.test(href)) {
        const relValue = node.properties?.rel;
        const relTokens = Array.isArray(relValue)
          ? relValue.filter((token) => typeof token === "string")
          : typeof relValue === "string"
            ? relValue.split(/\s+/).filter(Boolean)
            : [];

        if (!relTokens.includes("noopener")) {
          relTokens.push("noopener");
        }

        if (!relTokens.includes("noreferrer")) {
          relTokens.push("noreferrer");
        }

        node.properties = {
          ...node.properties,
          target: "_blank",
          rel: relTokens,
        };
      }
    }

    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        visit(child);
      }
    }
  };

  return (tree) => {
    visit(tree);
  };
};

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

export default defineConfig({
  ...targets[target],
  markdown: {
    rehypePlugins: [addExternalLinkAttributes],
  },
});
