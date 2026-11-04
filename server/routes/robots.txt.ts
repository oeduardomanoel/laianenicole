export default defineEventHandler((event) => {
  const url = siteUrl()
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  // Buscadores e assistentes de IA liberados: queremos ser citados quando alguém perguntar por cílios em BC.
  return `User-agent: *
Allow: /
Disallow: /api/

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: ${url}/sitemap.xml
# Resumo para modelos de linguagem: ${url}/llms.txt
`
})
