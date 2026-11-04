// Scraper do perfil público do Instagram.
// Usa o mesmo endpoint que o instagram.com chama no navegador (web_profile_info),
// a técnica adotada pelos scrapers open source mais usados (instaloader, instagram-scraper etc).

export interface IgPost {
  id: string
  shortcode: string
  permalink: string
  image: string
  caption: string
  isVideo: boolean
  takenAt: number
  alt: string
}

export interface IgFeed {
  source: 'live' | 'local'
  fetchedAt: string | null
  profile: { username: string, fullName: string, bio: string, followers: number, posts: number, avatar: string } | null
  posts: IgPost[]
}

const IG_APP_ID = '936619743392459'
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'

export const IG_IMAGE_HOSTS = [/\.cdninstagram\.com$/i, /\.fbcdn\.net$/i]

export function proxied(url: string) {
  return `/api/ig-image?u=${encodeURIComponent(url)}`
}

export async function fetchInstagram(username: string, sessionId?: string): Promise<IgFeed> {
  const headers: Record<string, string> = {
    'x-ig-app-id': IG_APP_ID,
    'user-agent': UA,
    'accept': '*/*',
    'accept-language': 'pt-BR,pt;q=0.9,en;q=0.8',
    'referer': `https://www.instagram.com/${username}/`,
    'x-requested-with': 'XMLHttpRequest',
  }
  if (sessionId) headers.cookie = `sessionid=${sessionId}`

  const res = await $fetch<any>('https://www.instagram.com/api/v1/users/web_profile_info/', {
    query: { username },
    headers,
    timeout: 8000,
    retry: 1,
  })

  const user = res?.data?.user
  if (!user) throw new Error('Perfil não retornado pelo Instagram')

  const edges: any[] = user.edge_owner_to_timeline_media?.edges ?? []
  const posts: IgPost[] = edges.map(({ node }) => {
    const caption: string = node.edge_media_to_caption?.edges?.[0]?.node?.text ?? ''
    return {
      id: String(node.id),
      shortcode: node.shortcode,
      permalink: `https://www.instagram.com/p/${node.shortcode}/`,
      image: proxied(node.thumbnail_src || node.display_url),
      caption,
      isVideo: Boolean(node.is_video),
      takenAt: Number(node.taken_at_timestamp || 0),
      alt: node.accessibility_caption || caption.slice(0, 120) || `Resultado de extensão de cílios por @${username}`,
    }
  })

  return {
    source: 'live',
    fetchedAt: new Date().toISOString(),
    profile: {
      username: user.username,
      fullName: user.full_name,
      bio: user.biography,
      followers: user.edge_followed_by?.count ?? 0,
      posts: user.edge_owner_to_timeline_media?.count ?? 0,
      avatar: proxied(user.profile_pic_url_hd || user.profile_pic_url),
    },
    posts,
  }
}
