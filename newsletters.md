# Mailchimp Newsletters — Next.js Integration

Le Coup de Foudre | Technical documentation / Documentación técnica

## English

### Overview

The newsletters page retrieves sent Mailchimp campaigns and renders a responsive grid containing the subject, cover image, publication date and public archive link. No database or additional HTML parsing dependency is required. All API requests run server-side.

### Setup

Create a Mailchimp API key under Account & Billing → Extras → API Keys. The account in this project uses datacenter `us1`. Copy the complete key, including its suffix, into `.env.local` at the project root:

```env
MAILCHIMP_API_KEY=YOUR_API_KEY-us1
MAILCHIMP_SERVER_PREFIX=us1
```

Never expose the key through `NEXT_PUBLIC_`, commit it, or log it. Revoke exposed keys. Restart Next.js after changing environment variables. The key suffix must match the account datacenter; do not manually change it.

### Architecture and behavior

- `GET /3.0/campaigns`: retrieve sent campaigns in descending send-date order, using pagination of 100 records.
- Keep campaigns with an archive URL; deduplicate by normalized subject (case and whitespace insensitive), retaining the newest version.
- `GET /3.0/campaigns/{id}/content`: extract the first eligible image in HTML order using native JavaScript. Do not sort by image size.
- Fall back to the social card image, then a local placeholder.
- Process images in batches of five to limit concurrent API requests.
- Cache API responses and revalidate the page every 3,600 seconds using Next.js ISR (requires a compatible server deployment; not static export).
- Render with Server Components and CSS Modules. Use regular `img` elements to avoid configuring remote image domains.

### Troubleshooting

Run the following command and enter the API key when prompted:

```bash
curl -i --user "anystring" "https://us1.api.mailchimp.com/3.0/ping"
```

HTTP 200 indicates successful authentication. HTTP 401 (`API Key Invalid`) indicates rejected credentials or a wrong datacenter. The original configuration used `us21`, whereas the account URL was `us1.admin.mailchimp.com`; correcting the credentials and datacenter resolved the connection issue.

Use `console.table(newsletters)` or `console.table(images)` to inspect results in the Next.js terminal, not the browser console. To clear the development cache, stop the server and run `rm -rf .next` followed by `npm run dev`.

### Limitations and publishing policy

Deduplication by subject can hide genuinely different campaigns with the same subject. Image extraction is heuristic: it expects quoted HTML attributes and excludes likely logos, icons and small images. It does not guarantee the first visual photograph for every template. A public archive URL does not establish permission to publish a campaign; obtain client approval and optionally restrict the integration to a dedicated campaign folder using `folder_id`. This restriction is not enabled in the implementation below. The final combined code has not been independently tested against the live account.

## Español

### Descripción general

La página de newsletters recupera las campañas enviadas desde Mailchimp y presenta una grilla responsive con asunto, imagen de portada, fecha y enlace público. No requiere base de datos ni dependencias adicionales para analizar HTML. Las consultas se realizan exclusivamente desde el servidor.

### Configuración

Generar una API Key desde Account & Billing → Extras → API Keys. La cuenta del proyecto utiliza el datacenter `us1`. Configurar las variables del ejemplo anterior en `.env.local`, en la raíz del proyecto. Copiar la clave completa, incluido el sufijo. No utilizar `NEXT_PUBLIC_`, subir la clave al repositorio ni imprimirla en consola. Revocar claves expuestas y reiniciar Next.js después de modificar las variables.

### Funcionamiento

- Obtener campañas enviadas mediante `/campaigns`, paginadas de a 100 y ordenadas de más reciente a más antigua.
- Filtrar campañas sin enlace y eliminar duplicados por asunto normalizado, conservando la versión más reciente.
- Consultar `/campaigns/{id}/content` y extraer la primera imagen válida del HTML mediante JavaScript nativo, sin Cheerio y sin ordenar por tamaño.
- Si no hay imagen válida, utilizar la Social Card y luego un placeholder local.
- Procesar imágenes en grupos de cinco para limitar solicitudes simultáneas.
- Revalidar datos y página cada 3.600 segundos mediante ISR, en un servidor compatible con Next.js (no exportación estática).
- Renderizar mediante Server Components, CSS Modules y etiquetas `img` convencionales.

### Diagnóstico

Ejecutar el comando `curl` de la sección en inglés e ingresar la API Key cuando se solicite. HTTP 200 confirma la autenticación; HTTP 401 indica credenciales rechazadas o datacenter incorrecto. El error original se resolvió al corregir la configuración de `us21` a `us1` y utilizar las credenciales correspondientes.

Para inspeccionar datos utilizar `console.table(newsletters)` y `console.table(images)` en la terminal donde corre Next.js. Si persisten datos anteriores, detener el servidor, ejecutar `rm -rf .next` y luego `npm run dev`.

### Limitaciones y publicación

Dos campañas diferentes con el mismo asunto pueden quedar agrupadas como duplicados. La extracción de imágenes es heurística: requiere atributos HTML entre comillas y descarta posibles logos, iconos e imágenes pequeñas. No garantiza identificar la primera fotografía visual en todas las plantillas. Un enlace público no implica autorización para publicar una campaña: confirmar con el cliente cuáles deben mostrarse. Opcionalmente se puede filtrar por una carpeta dedicada mediante `folder_id`; este filtro no está activado en el código. El código consolidado no fue probado de forma independiente contra la cuenta real.

## Shared implementation / Implementación compartida

The following code is shared by both language sections. / El siguiente código es común a ambas versiones.

### File structure / Estructura

```text
project/
├── .env.local
├── public/images/newsletter-placeholder.jpg
└── src/
    ├── lib/mailchimp.js
    ├── app/newsletters/page.jsx
    └── components/newsletters/
        ├── NewsletterGrid.jsx
        ├── NewsletterCard.jsx
        └── Newsletters.module.css
```

### `src/lib/mailchimp.js`

```javascript
import 'server-only';

const apiKey = process.env.MAILCHIMP_API_KEY?.trim();
const server = process.env.MAILCHIMP_SERVER_PREFIX?.trim();

async function mailchimpFetch(endpoint) {
  if (!apiKey || !server) throw new Error('Missing Mailchimp credentials');
  const response = await fetch(
    `https://${server}.api.mailchimp.com/3.0${endpoint}`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
        Accept: 'application/json',
      },
      next: { revalidate: 3600 },
    }
  );
  if (!response.ok) {
    console.error('Mailchimp API Error:', await response.text());
    throw new Error(`Mailchimp API error: ${response.status}`);
  }
  return response.json();
}

async function getCampaignImage(campaignId) {
  try {
    const content = await mailchimpFetch(`/campaigns/${campaignId}/content`);
    const images = [...(content.html || '').matchAll(/<img\b[^>]*>/gi)]
      .map(([tag]) => {
        const getAttr = name => tag.match(new RegExp(
          `\\s${name}\\s*=\\s*["']([^"']*)["']`, 'i'
        ))?.[1] || '';
        return {
          src: getAttr('src').replace(/&amp;/g, '&'),
          alt: getAttr('alt'),
          width: parseInt(getAttr('width'), 10) || 0,
          height: parseInt(getAttr('height'), 10) || 0,
        };
      })
      .filter(img => img.src.startsWith('https://') &&
        !/logo|icon|tracking|pixel|spacer|facebook|instagram|twitter|linkedin/i.test(`${img.src} ${img.alt}`) &&
        (img.width === 0 || img.width >= 250) &&
        (img.height === 0 || img.height >= 100));
    // console.table(images);
    return images[0]?.src || null;
  } catch (error) {
    console.error('Error getting campaign image:', error);
    return null;
  }
}

export async function getNewsletters() {
  const campaigns = [];
  const count = 100;
  let offset = 0;
  while (true) {
    const params = new URLSearchParams({
      status: 'sent', count: String(count), offset: String(offset),
      sort_field: 'send_time', sort_dir: 'DESC',
    });
    const data = await mailchimpFetch(`/campaigns?${params}`);
    campaigns.push(...data.campaigns);
    offset += data.campaigns.length;
    if (offset >= data.total_items || data.campaigns.length === 0) break;
  }
  const seen = new Set();
  const publicCampaigns = campaigns.filter(campaign => {
    if (!campaign.archive_url && !campaign.long_archive_url) return false;
    const title = campaign.settings.subject_line?.trim().toLowerCase().replace(/\s+/g, ' ');
    const key = title || campaign.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const newsletters = [];
  for (let i = 0; i < publicCampaigns.length; i += 5) {
    const results = await Promise.all(publicCampaigns.slice(i, i + 5).map(async campaign => ({
      id: campaign.id,
      title: campaign.settings.subject_line,
      description: campaign.settings.preview_text,
      image: (await getCampaignImage(campaign.id)) || campaign.social_card?.image_url || null,
      url: campaign.archive_url || campaign.long_archive_url,
      date: campaign.send_time,
    })));
    newsletters.push(...results);
  }
  const campaignsWithUrl = campaigns.filter(c => c.archive_url || c.long_archive_url).length;
  console.log('Mailchimp:', {
    totalCampaigns: campaigns.length,
    campaignsWithUrl,
    uniqueCampaigns: publicCampaigns.length,
    duplicatesRemoved: campaignsWithUrl - publicCampaigns.length,
    totalNewsletters: newsletters.length,
  });
  // console.table(newsletters);
  return newsletters;
}
```

### `src/components/newsletters/NewsletterCard.jsx`

```jsx
import styles from './Newsletters.module.css';

export default function NewsletterCard({ newsletter }) {
  const { title, image, url, date } = newsletter;
  const formattedDate = date ? new Intl.DateTimeFormat('en-US', {
    month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(date)) : null;
  return (
    <article className={styles.card}>
      <a href={url} target="_blank" rel="noopener noreferrer" className={styles.cardLink}>
        <div className={styles.imageWrapper}>
          <img src={image || '/images/newsletter-placeholder.jpg'} alt={title} loading="lazy" className={styles.image} />
        </div>
        <div className={styles.content}>
          {formattedDate && <time dateTime={date} className={styles.date}>{formattedDate}</time>}
          <h2 className={styles.title}>{title}</h2>
          <span className={styles.readMore}>Read newsletter ↗</span>
        </div>
      </a>
    </article>
  );
}
```

### `src/components/newsletters/NewsletterGrid.jsx`

```jsx
import NewsletterCard from './NewsletterCard';
import styles from './Newsletters.module.css';

export default function NewsletterGrid({ newsletters = [] }) {
  if (!newsletters.length) return <p className={styles.empty}>No newsletters available at the moment.</p>;
  return <div className={styles.grid}>
    {newsletters.map(newsletter => <NewsletterCard key={newsletter.id} newsletter={newsletter} />)}
  </div>;
}
```

### `src/components/newsletters/Newsletters.module.css`

```css
.grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 48px 32px; }
.card { min-width: 0; }
.cardLink { display: block; color: inherit; text-decoration: none; }
.imageWrapper { width: 100%; aspect-ratio: 4 / 3; overflow: hidden; background: #f5f5f5; }
.image { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
.cardLink:hover .image { transform: scale(1.05); }
.content { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; padding-top: 20px; }
.date { font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; opacity: 0.65; }
.title { margin: 0; font-size: 24px; font-weight: 400; line-height: 1.3; }
.readMore { font-size: 13px; border-bottom: 1px solid currentColor; padding-bottom: 4px; }
.empty { padding: 60px 0; text-align: center; opacity: 0.65; }
@media (max-width: 1024px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px 24px; } }
@media (max-width: 600px) { .grid { grid-template-columns: 1fr; gap: 32px; } .title { font-size: 22px; } }
```

### `src/app/newsletters/page.jsx`

```jsx
import { getNewsletters } from '@/lib/mailchimp';
import NewsletterGrid from '@/components/newsletters/NewsletterGrid';

export const revalidate = 3600;
export const metadata = {
  title: 'Newsletters | Le Coup de Foudre',
  description: 'Discover our latest newsletters, exclusive experiences and travel inspiration.',
};
export default async function NewslettersPage() {
  const newsletters = await getNewsletters();
  return <main><section className="newsletters"><div className="container">
    <h1>Our Newsletters</h1>
    <NewsletterGrid newsletters={newsletters} />
  </div></section></main>;
}
```

### Deployment checklist / Checklist de despliegue

- [ ] Configure server-side environment variables / Configurar variables de entorno del servidor.
- [ ] Add the placeholder image / Agregar imagen placeholder.
- [ ] Verify the `@/` import alias and existing container styles / Verificar alias y estilos globales.
- [ ] Confirm authorized campaigns / Confirmar campañas autorizadas.
- [ ] Verify image selection and duplicates / Verificar imágenes y duplicados.
- [ ] Test responsive grid: 3, 2 and 1 columns / Probar grilla responsive.
- [ ] Disable unnecessary diagnostic logs in production / Desactivar logs innecesarios en producción.

### Official references / Referencias oficiales

- [Mailchimp Marketing API](https://mailchimp.com/developer/marketing/)
- [List campaigns](https://mailchimp.com/developer/marketing/api/campaigns/list/)
- [Campaign content](https://mailchimp.com/developer/marketing/api/campaigns/get-content/)
- [API errors](https://mailchimp.com/developer/marketing/docs/errors/)
- [Next.js ISR](https://nextjs.org/docs/app/guides/incremental-static-regeneration)
