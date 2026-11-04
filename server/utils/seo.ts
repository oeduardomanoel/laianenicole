export function siteUrl() {
  return String(useRuntimeConfig().public.siteUrl).replace(/\/$/, '')
}
