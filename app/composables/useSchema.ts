import { faq, services, site } from '#shared/site'

export function useSiteUrl() {
  return String(useRuntimeConfig().public.siteUrl).replace(/\/$/, '')
}

/** Dados estruturados do negócio local (Google, Maps e buscadores de IA leem isso). */
export function businessSchema(url: string, whatsapp: string) {
  const address: Record<string, string> = {
    '@type': 'PostalAddress',
    'streetAddress': site.address.street,
    'addressLocality': site.address.city,
    'addressRegion': site.address.state,
    'addressCountry': site.address.country,
  }
  if (site.address.postalCode) address.postalCode = site.address.postalCode
  return {
    '@type': 'BeautySalon',
    '@id': `${url}/#negocio`,
    'name': site.brand,
    'alternateName': [`@${site.handle}`, 'Laiane Lash'],
    'description': site.description,
    'url': url,
    'image': `${url}/og.jpg`,
    'logo': `${url}/apple-touch-icon.png`,
    'telephone': `+${whatsapp}`,
    'priceRange': '$$',
    'address': address,
    'areaServed': [
      { '@type': 'City', 'name': 'Balneário Camboriú' },
      { '@type': 'City', 'name': 'Camboriú' },
      { '@type': 'City', 'name': 'Itajaí' },
      { '@type': 'City', 'name': 'Itapema' },
    ],
    'hasMap': `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapsQuery)}`,
    'sameAs': [site.instagram],
    'knowsAbout': ['Extensão de cílios', 'Fio a fio', 'Volume brasileiro', 'Efeito molhado', 'Lash lifting'],
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': 'Técnicas de cílios',
      'itemListElement': services.map(s => ({
        '@type': 'Offer',
        'itemOffered': { '@type': 'Service', 'name': s.name, 'description': s.short, 'url': `${url}/servicos/${s.slug}` },
      })),
    },
    'potentialAction': {
      '@type': 'ReserveAction',
      'target': { '@type': 'EntryPoint', 'urlTemplate': `https://wa.me/${whatsapp}`, 'actionPlatform': ['http://schema.org/MobileWebPlatform', 'http://schema.org/DesktopWebPlatform'] },
      'result': { '@type': 'Reservation', 'name': 'Agendamento de extensão de cílios' },
    },
  }
}

export function faqSchema(items: { q: string, a: string }[] = faq) {
  return {
    '@type': 'FAQPage',
    'mainEntity': items.map(f => ({ '@type': 'Question', 'name': f.q, 'acceptedAnswer': { '@type': 'Answer', 'text': f.a } })),
  }
}

export function useJsonLd(graph: Record<string, unknown>[]) {
  useHead({
    script: [{ type: 'application/ld+json', innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }],
  })
}
