import { ACTIVE_CATALOG_PROVIDERS } from "./catalog-providers";

export type FeaturedProvider = {
  id: string;
  initials: string;
  color: string;
};

export const featuredProviders: FeaturedProvider[] = ACTIVE_CATALOG_PROVIDERS.map((p) => ({
  id: p.providerKey,
  initials: p.initials,
  color: p.color,
}));
