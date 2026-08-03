export const base = import.meta.env.BASE_URL;

export const baseHref = base.endsWith("/") ? base : `${base}/`;

export const assetPath = (path: string) =>
  `${baseHref}${path.replace(/^\/+/, "")}`;
