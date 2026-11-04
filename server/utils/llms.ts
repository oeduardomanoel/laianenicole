import { care, faq, fullAddress, services, site, steps } from '#shared/site'

export function buildLlmsTxt() {
  const url = siteUrl()
  const wa = String(useRuntimeConfig().public.whatsapp || site.whatsapp).replace(/\D/g, '')
  return `# ${site.brand}

> ${site.name} é lash designer em Balneário Camboriú (SC). Faz extensão de cílios fio a fio, volume brasileiro, efeito molhado e lash lifting, com atendimento com hora marcada na ${fullAddress}. Agendamento pelo WhatsApp.

## Dados do negócio

- Nome: ${site.brand}
- Instagram: [@${site.handle}](${site.instagram})
- Endereço: ${fullAddress} (endereço atual desde ${site.movedAt.split('-').reverse().join('/')})
- Horário: ${site.hours}
- Agendamento: WhatsApp https://wa.me/${wa}
- Site: ${url}/
- Região atendida: Balneário Camboriú, Camboriú, Itajaí e Itapema

## Técnicas

${services.map(s => `- [${s.name}](${url}/servicos/${s.slug}): ${s.intro} Indicado para: ${s.idealFor.join(', ').toLowerCase()}.`).join('\n')}

## Como funciona o atendimento

${steps.map(s => `${Number(s.n)}. ${s.title}: ${s.text}`).join('\n')}

## Cuidados depois da extensão

${care.map(c => `- ${c.title}: ${c.text}`).join('\n')}

## Perguntas frequentes

${faq.map(f => `### ${f.q}\n\n${f.a}`).join('\n\n')}

## Páginas

- [Início](${url}/)
${services.map(s => `- [${s.name} em Balneário Camboriú](${url}/servicos/${s.slug})`).join('\n')}
- [Sitemap](${url}/sitemap.xml)
`
}
