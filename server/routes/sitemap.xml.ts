import { services } from '#shared/site'

export default defineEventHandler((event) => {
  const url = siteUrl()
  const today = new Date().toISOString().slice(0, 10)
  const pages = [
    { loc: `${url}/`, priority: '1.0', changefreq: 'weekly' },
    ...services.map(s => ({ loc: `${url}/servicos/${s.slug}`, priority: '0.8', changefreq: 'monthly' })),
  ]
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages.map(p => `  <url>
    <loc>${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>${p.priority === '1.0' ? `
    <image:image><image:loc>${url}/og.jpg</image:loc></image:image>` : ''}
  </url>`).join('\n')}
</urlset>
`
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return body
})
