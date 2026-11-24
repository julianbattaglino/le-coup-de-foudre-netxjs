import 'server-only';

const apiKey = process.env.MAILCHIMP_API_KEY?.trim();
const server = process.env.MAILCHIMP_SERVER_PREFIX?.trim();

async function mailchimpFetch(endpoint) {
  if (!apiKey || !server) {
    throw new Error('Missing Mailchimp credentials');
  }

  const response = await fetch(
    `https://${server}.api.mailchimp.com/3.0${endpoint}`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `anystring:${apiKey}`
        ).toString('base64')}`,
        Accept: 'application/json',
      },
      next: {
        revalidate: 3600,
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();

    console.error('Mailchimp API Error:', error);

    throw new Error(`Mailchimp API error: ${response.status}`);
  }

  return response.json();
}

// Obtener la imagen principal del newsletter
async function getCampaignImage(campaignId) {
  try {
    const content = await mailchimpFetch(
      `/campaigns/${campaignId}/content`
    );

    const html = content.html || '';

    const images = [...html.matchAll(/<img\b[^>]*>/gi)]
      .map(([tag]) => {
        const getAttr = (name) =>
          tag.match(
            new RegExp(
              `\\s${name}\\s*=\\s*["']([^"']*)["']`,
              'i'
            )
          )?.[1] || '';

        return {
          src: getAttr('src').replace(/&amp;/g, '&'),
          alt: getAttr('alt'),
          width: parseInt(getAttr('width'), 10) || 0,
          height: parseInt(getAttr('height'), 10) || 0,
        };
      })
      .filter(img => {
        const source = `${img.src} ${img.alt}`;

        return (
          img.src.startsWith('https://') &&
          !/logo|icon|tracking|pixel|spacer|facebook|instagram|twitter|linkedin/i.test(source) &&
          (img.width === 0 || img.width >= 250) &&
          (img.height === 0 || img.height >= 100)
        );
      });

    return images[0]?.src || null;

  } catch (error) {
    console.error('Error getting campaign image:', error);
    return null;
  }
}

// Obtener todas las campañas enviadas
export async function getNewsletters() {
  const campaigns = [];
  const count = 100;
  let offset = 0;

  // Obtener todas las campañas con paginación
  while (true) {
    const params = new URLSearchParams({
      status: 'sent',
      count: String(count),
      offset: String(offset),
      sort_field: 'send_time',
      sort_dir: 'DESC',
    });

    const data = await mailchimpFetch(
      `/campaigns?${params}`
    );

    campaigns.push(...data.campaigns);

    offset += data.campaigns.length;

    if (
      offset >= data.total_items ||
      data.campaigns.length === 0
    ) {
      break;
    }
  }

  // Filtrar campañas sin enlace y eliminar duplicados
  const seen = new Set();

  const publicCampaigns = campaigns.filter(campaign => {
    if (!campaign.archive_url && !campaign.long_archive_url) {
      return false;
    }

    // Normalizar el título para detectar duplicados
    const title = campaign.settings.subject_line
      ?.trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');

    const key = title || campaign.id;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);

    return true;
  });

  const newsletters = [];

  // Procesar en grupos de 5 para limitar
  // las solicitudes simultáneas a Mailchimp
  for (let i = 0; i < publicCampaigns.length; i += 5) {
    const batch = publicCampaigns.slice(i, i + 5);

    const results = await Promise.all(
      batch.map(async campaign => {

        // Priorizar la primera imagen válida del HTML
        const image =
          (await getCampaignImage(campaign.id)) ||
          campaign.social_card?.image_url ||
          null;

        return {
          id: campaign.id,
          title: campaign.settings.subject_line,
          description: campaign.settings.preview_text,
          image,
          url:
            campaign.archive_url ||
            campaign.long_archive_url,
          date: campaign.send_time,
        };
      })
    );

    newsletters.push(...results);
  }

  // Información de diagnóstico
  console.log('Mailchimp:', {
    totalCampaigns: campaigns.length,
    campaignsWithUrl: campaigns.filter(
      campaign => campaign.archive_url || campaign.long_archive_url
    ).length,
    uniqueCampaigns: publicCampaigns.length,
    duplicatesRemoved: campaigns.filter(
      campaign => campaign.archive_url || campaign.long_archive_url
    ).length - publicCampaigns.length,
    totalNewsletters: newsletters.length,
  });

  console.table(newsletters);

  return newsletters;
}