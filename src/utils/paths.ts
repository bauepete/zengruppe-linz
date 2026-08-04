export const base = import.meta.env.BASE_URL;

export const baseHref = base.endsWith("/") ? base : `${base}/`;

export const assetPath = (path: string) =>
  `${baseHref}${path.replace(/^\/+/, "")}`;

export const pagePath = (path: string) => {
  if (path.startsWith(baseHref)) {
    return path;
  }

  return `${baseHref}${path.replace(/^\/+/, "")}`;
};
