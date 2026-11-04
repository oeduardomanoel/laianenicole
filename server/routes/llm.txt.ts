// Alias: alguns crawlers procuram /llm.txt em vez de /llms.txt
export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return buildLlmsTxt()
})
