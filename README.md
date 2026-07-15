# Clube de Negócios LMA — Landing Page (Abrir Empresa em Dubai)

Landing page premium para captação via WhatsApp, focada em **abertura de empresa em Dubai
(Free Zone / Emirados Árabes)** para **exportação** (foco principal) e **proteção de patrimônio**.
Público-alvo: grandes empresários (classe A/B) — estética sofisticada e minimalista.

## Como visualizar
- **Simples:** duplo-clique em `index.html`.
- **Com servidor local:** `npx serve -l 8899 .` e acesse http://localhost:8899

## Arquivos
```
index.html         → página principal
privacidade.html   → Política de Privacidade + LGPD
cookies.html       → Política de Cookies
termos.html        → Termos de Uso
styles.css         → design premium (navy + dourado, Playfair Display + Inter)
script.js          → WhatsApp, scroll reveal, mapa interativo, simulador, cookies, exit-intent
assets/logo.svg    → logo oficial (branca)
sitemap.xml, robots.txt → SEO
```

## Recursos implementados
- **Mapa-múndi real e interativo** ("De Dubai para o mundo"): mapa com os 256 países reais
  (`assets/world.svg`), carregado sob demanda. Clique nos marcadores **ou nos próprios países**
  (Europa, Ásia, África, Oriente Médio, Américas, Oceania) para destacar a região, traçar a rota de
  Dubai e ver os dados. **Cada região toca um som cultural curto** sintetizado ao vivo (Web Audio):
  Oriente Médio (escala árabe), Ásia (pentatônica), Europa (arpejo clássico), África (percussão),
  Américas (motivo latino), Oceania (didgeridoo). Botão de mute no painel. Regiões/países em `REGIONS` no `script.js`.
- **Efeitos de scroll estilo Apple:** blocos grandes entram com escala (`.scale-in`), seção-declaração
  com texto que cresce/aparece conforme o scroll, e parallax sutil.
- **Importante:** o mapa carrega via `fetch`, então precisa ser servido por **http** (`npx serve`).
  Abrindo o `index.html` por duplo-clique (file://) o mapa não carrega (mostra mensagem) — o resto funciona.
- **Simulador real de economia de impostos:** informe o lucro anual e o regime (Simples ~15%,
  Presumido ~22%, Lucro Real ~34%); calcula a economia/ano e em 5 anos vs Free Zone (0%). O CTA do
  WhatsApp já leva os números da simulação na mensagem.
- **SEO completo:** title/description/keywords, canonical, Open Graph, Twitter Card, JSON-LD
  (ProfessionalService + FAQPage), HTML semântico, `sitemap.xml`, `robots.txt`.
- **LGPD:** banner de cookies (aceitar/rejeitar) + 3 páginas legais.
- **Conversão:** botão flutuante de WhatsApp, barra fixa no mobile, pop-up de saída (exit-intent).
- **Responsivo** (testado a 375px, sem scroll horizontal) e com fail-safe de exibição se o JS falhar.

## ⚠️ Antes de publicar — ajuste estes pontos
1. **Domínio:** usei `https://clubelma.com.br` como placeholder em `canonical`, Open Graph e
   `sitemap.xml`/`robots.txt`. **Troque pelo domínio real** (busque por `clubelma.com.br`).
2. **Imagem de compartilhamento:** crie `assets/og-image.jpg` (1200×630) para o preview em
   redes/WhatsApp (referenciada nas meta tags `og:image`/`twitter:image`).
3. **Logo pesada:** `assets/logo.svg` tem ~1,2 MB (imagem embutida). Recomendo exportar uma versão
   otimizada/menor para não impactar o carregamento (importante em anúncios/mobile).
4. **Número do WhatsApp:** central em `script.js` → `WHATSAPP = '971545882588'` (+971 54 588 2588).

## Aviso
Afirmações de benefícios fiscais (0% de imposto, sigilo bancário, paraíso fiscal) e depoimentos são
de caráter comercial/ilustrativo. Revise com um especialista antes de veicular anúncios (políticas
Meta/Google e legislação BR/EAU). Avisos já constam no rodapé e nos Termos de Uso.
