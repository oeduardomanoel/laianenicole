#!/usr/bin/env node
// Baixa os posts públicos mais recentes da @llaianelash pra dentro do projeto.
// Uso:   npm run ig:sync
// Opcional: IG_SESSIONID=xxxx npm run ig:sync   (cookie "sessionid" de uma conta logada, se o Instagram pedir login)
// Resultado: fotos em public/clientes/ e a lista em shared/instagram.json (usada como fallback pelo site).

import { mkdir, writeFile, readdir, unlink } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const username = process.argv[2] || 'llaianelash'
const limit = Number(process.env.IG_LIMIT || 12)
const outDir = join(root, 'public', 'clientes')
const jsonPath = join(root, 'shared', 'instagram.json')

const headers = {
  'x-ig-app-id': '936619743392459',
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
  'accept': '*/*',
  'accept-language': 'pt-BR,pt;q=0.9',
  'referer': `https://www.instagram.com/${username}/`,
  'x-requested-with': 'XMLHttpRequest',
}
if (process.env.IG_SESSIONID) headers.cookie = `sessionid=${process.env.IG_SESSIONID}`

async function main() {
  console.log(`→ Buscando @${username}...`)
  const res = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`, { headers })
  if (!res.ok) {
    throw new Error(`Instagram respondeu ${res.status}. Tente de novo em alguns minutos ou rode com IG_SESSIONID.`)
  }
  const json = await res.json()
  const user = json?.data?.user
  if (!user) throw new Error('Resposta sem dados do perfil.')

  await mkdir(outDir, { recursive: true })
  for (const f of await readdir(outDir)) if (f.startsWith('ig-')) await unlink(join(outDir, f))

  const edges = (user.edge_owner_to_timeline_media?.edges ?? []).slice(0, limit)
  const posts = []
  for (const { node } of edges) {
    const src = node.display_url || node.thumbnail_src
    const file = `ig-${node.shortcode}.jpg`
    const img = await fetch(src, { headers: { 'user-agent': headers['user-agent'], 'referer': 'https://www.instagram.com/' } })
    if (!img.ok) { console.warn(`  ! falhou ${node.shortcode}`); continue }
    await writeFile(join(outDir, file), Buffer.from(await img.arrayBuffer()))
    const caption = node.edge_media_to_caption?.edges?.[0]?.node?.text ?? ''
    posts.push({
      id: String(node.id),
      shortcode: node.shortcode,
      permalink: `https://www.instagram.com/p/${node.shortcode}/`,
      image: `/clientes/${file}`,
      caption,
      isVideo: Boolean(node.is_video),
      takenAt: Number(node.taken_at_timestamp || 0),
      alt: node.accessibility_caption || caption.slice(0, 120) || `Resultado de extensão de cílios por @${username}`,
    })
    console.log(`  ✓ ${file}`)
  }

  let avatar = ''
  const pic = user.profile_pic_url_hd || user.profile_pic_url
  if (pic) {
    const r = await fetch(pic, { headers: { 'user-agent': headers['user-agent'] } })
    if (r.ok) {
      await writeFile(join(outDir, 'avatar.jpg'), Buffer.from(await r.arrayBuffer()))
      avatar = '/clientes/avatar.jpg'
    }
  }

  const data = {
    fetchedAt: new Date().toISOString(),
    profile: {
      username: user.username,
      fullName: user.full_name,
      bio: user.biography,
      followers: user.edge_followed_by?.count ?? 0,
      posts: user.edge_owner_to_timeline_media?.count ?? 0,
      avatar,
    },
    posts,
  }
  await writeFile(jsonPath, `${JSON.stringify(data, null, 2)}\n`)
  console.log(`\n✓ ${posts.length} posts salvos em public/clientes e shared/instagram.json`)
  console.log('  Bio:', user.biography?.replace(/\n/g, ' | '))
}

main().catch((err) => {
  console.error(`✗ ${err.message}`)
  process.exit(1)
})
