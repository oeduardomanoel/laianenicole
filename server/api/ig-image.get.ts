import { IG_IMAGE_HOSTS } from '../utils/instagram'

// Proxy de imagem: o CDN do Instagram bloqueia exibição em outros domínios.
// Só aceita hosts do próprio Instagram, pra não virar proxy aberto.
export default defineEventHandler(async (event) => {
  const raw = getQuery(event).u
  if (typeof raw !== 'string') throw createError({ statusCode: 400, statusMessage: 'Parâmetro u ausente' })

  let url: URL
  try { url = new URL(raw) }
  catch { throw createError({ statusCode: 400, statusMessage: 'URL inválida' }) }

  if (url.protocol !== 'https:' || !IG_IMAGE_HOSTS.some(re => re.test(url.hostname))) {
    throw createError({ statusCode: 403, statusMessage: 'Host não permitido' })
  }

  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0', 'referer': 'https://www.instagram.com/' } })
  const type = res.headers.get('content-type') || ''
  if (!res.ok || !type.startsWith('image/')) throw createError({ statusCode: 502, statusMessage: 'Imagem indisponível' })

  setHeaders(event, {
    'content-type': type,
    'cache-control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800',
  })
  return Buffer.from(await res.arrayBuffer())
})
