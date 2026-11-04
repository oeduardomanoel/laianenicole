import { site } from '#shared/site'
import local from '#shared/instagram.json'
import type { IgFeed } from '../utils/instagram'

// Tenta o Instagram ao vivo. Se o Instagram bloquear (acontece com IP de datacenter),
// devolve as fotos salvas localmente pelo script `npm run ig:sync`.
export default defineEventHandler(async (): Promise<IgFeed> => {
  const { igSessionId } = useRuntimeConfig()
  try {
    const feed = await fetchInstagram(site.handle, igSessionId || undefined)
    if (feed.posts.length) return { ...feed, posts: feed.posts.slice(0, 12) }
  }
  catch (err: any) {
    console.warn('[instagram] usando fallback local:', err?.statusCode || err?.message)
  }
  return {
    source: 'local',
    fetchedAt: (local as any).fetchedAt ?? null,
    profile: (local as any).profile ?? null,
    posts: ((local as any).posts ?? []).slice(0, 12),
  }
})
