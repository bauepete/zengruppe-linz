export const base = import.meta.env.BASE_URL;

export const baseHref = base.endsWith("/") ? base : `${base}/`;

export const normalizePath = (path: string) => {
  const normalized = `/${path.replace(/^\/+|\/+$/g, "")}`;
  return normalized === "/" ? "/" : normalized;
};

export const stripBaseFromPath = (pathname: string) => {
  const normalizedBase = normalizePath(base);
  const normalizedPathname = normalizePath(pathname);

  if (normalizedBase === "/") {
    return normalizedPathname;
  }

  return normalizedPathname.startsWith(normalizedBase)
    ? normalizePath(normalizedPathname.slice(normalizedBase.length))
    : normalizedPathname;
};

export const assetPath = (path: string) =>
  `${baseHref}${path.replace(/^\/+/, "")}`;

export const toPageHref = (path: string) => {
  const normalizedPath = normalizePath(path);

  if (normalizedPath === "/") {
    return baseHref;
  }

  return `${baseHref}${normalizedPath.slice(1)}/`;
};

export const isActivePath = (currentPathname: string, navPath: string) =>
  stripBaseFromPath(currentPathname) === normalizePath(navPath);

export const pagePath = (path: string) => {
  if (path.startsWith(baseHref)) {
    return path;
  }

  return `${baseHref}${path.replace(/^\/+/, "")}`;
};
