# Laiane Nicole · Lash Designer

Site da [@llaianelash](https://www.instagram.com/llaianelash/), lash designer em Balneário Camboriú (Rua Itália, 121, Nações).

Nuxt 4 + GSAP (ScrollTrigger, SplitText) + Lenis + Three.js. Pronto pra Vercel.

## Rodar local

```bash
npm install
npm run dev
```

## Antes de publicar

Tudo que muda no site está em `shared/site.ts`. Itens marcados com `CONFIRMAR`:

- **WhatsApp** (`whatsapp`) — hoje é um número de exemplo. Pode trocar ali ou pela env `NUXT_PUBLIC_WHATSAPP` na Vercel.
- **Horário de atendimento** (`hours`).
- **CEP** (`address.postalCode`) — a Rua Itália tem 88338-260 e 88338-265 no bairro.
- **Técnicas** (`services`) — confirme se ela faz as 4 (fio a fio, volume brasileiro, efeito molhado, lash lifting).
- **Depoimentos** (`testimonials`) — a seção só aparece quando houver depoimentos reais.

## Fotos do Instagram

O site tem dois caminhos, e um cobre o outro:

1. **Ao vivo na Vercel** — `/api/instagram` busca os posts públicos dela (endpoint `web_profile_info`, o mesmo do instagram.com), com cache de 6h via ISR. As imagens passam por `/api/ig-image`, que só aceita hosts do Instagram.
2. **Fallback local** — no seu computador, rode:

   ```bash
   npm run ig:sync
   ```

   Isso baixa os últimos 12 posts pra `public/clientes/` e grava `shared/instagram.json`. Commit e push: o site passa a mostrar essas fotos sempre que o Instagram bloquear o servidor.

   Se o Instagram pedir login, use o cookie `sessionid` de uma conta qualquer: `IG_SESSIONID=xxxx npm run ig:sync`.

Sem nenhuma foto ainda, a galeria mostra cards com a identidade visual que levam pro Instagram.

## Deploy na Vercel

1. Importe o repositório na Vercel (detecta Nuxt sozinho).
2. Em *Environment Variables*, configure `NUXT_PUBLIC_SITE_URL` com o domínio final e `NUXT_PUBLIC_WHATSAPP`.
3. Deploy.

## SEO e GEO

- `/sitemap.xml`, `/robots.txt` (libera Google, GPTBot, ClaudeBot, PerplexityBot etc.), `/llms.txt` e `/llm.txt`.
- JSON-LD: `BeautySalon` (endereço, área atendida, catálogo de serviços, ação de reserva), `FAQPage`, `Service` e `BreadcrumbList`.
- Uma página por técnica em `/servicos/*` pra rankear buscas locais ("volume brasileiro Balneário Camboriú").
- Open Graph com `public/og.jpg`.
