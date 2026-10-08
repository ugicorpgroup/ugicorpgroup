import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const cmsDir = path.resolve(scriptDir, '..');
const rootDir = path.resolve(cmsDir, '..');
const envText = await fs.readFile(path.join(cmsDir, '.env'), 'utf8');
const env = Object.fromEntries(envText.split(/\r?\n/).filter((line) => line && !line.startsWith('#') && line.includes('=')).map((line) => { const index = line.indexOf('='); return [line.slice(0, index), line.slice(index + 1).replace(/^"|"$/g, '')]; }));
const backend = (env.STRAPI_URL || 'http://127.0.0.1:1337').replace(/\/$/, '');
const { services, projects } = await import(pathToFileURL(path.join(rootDir, 'app', 'content.js')).href);

const loginResponse = await fetch(`${backend}/api/cms-admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: env.CMS_ADMIN_EMAIL, password: env.CMS_ADMIN_PASSWORD }) });
if (!loginResponse.ok) throw new Error(`CMS login failed (${loginResponse.status}).`);
const { token } = await loginResponse.json();
const headers = { Authorization: `Bearer ${token}` };

async function get(model) {
  const response = await fetch(`${backend}/api/cms-admin/content/${model}`, { headers });
  if (!response.ok) throw new Error(`Could not load ${model} (${response.status}).`);
  return response.json();
}
async function save(model, documentId, data) {
  const response = await fetch(`${backend}/api/cms-admin/content/${model}/${documentId}`, { method: 'PUT', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ data }) });
  if (!response.ok) throw new Error(`Could not save ${model} (${response.status}): ${await response.text()}`);
  return response.json();
}
async function upload(filename) {
  const buffer = await fs.readFile(path.join(rootDir, 'public', filename));
  const form = new FormData();
  form.append('files', new Blob([buffer]), filename);
  const response = await fetch(`${backend}/api/cms-admin/upload`, { method: 'POST', headers, body: form });
  if (!response.ok) throw new Error(`Could not upload ${filename} (${response.status}): ${await response.text()}`);
  return response.json();
}

const media = {};
for (const filename of ['banner-home-2.png', 'who-we-are.png', 'service-banner.png', 'service-1.avif', 'service-2.avif', 'service-3.avif', 'service-4.avif', 'service-5.avif', 'service-6.avif', 'project-1.avif']) {
  media[filename] = await upload(filename);
}

const home = await get('home');
await save('home', home.documentId, {
  heroEyebrow: 'OIL & GAS | POWER | RENEWABLE ENERGY | INFRASTRUCTURE', heroTitle: 'Engineering a', heroHighlight: 'better tomorrow.',
  heroDescription: 'Engineering, procurement, construction management, and process safety solutions for the oil and gas, petrochemical, power, renewable energy, and infrastructure sectors.',
  heroImage: media['banner-home-2.png'].id, heroPrimaryLabel: 'Explore Our Services', heroPrimaryHref: '/services', heroSecondaryLabel: 'Request a Proposal', heroSecondaryHref: '/contact',
  aboutEyebrow: 'Who we are', aboutTitle: 'A Canada-headquartered engineering consultancy', aboutLead: 'with 10 years of experience in the hydrocarbon industry.',
  aboutBody: 'US GLOBAL IMPEX provides innovative and cost-effective engineering, procurement, construction management, and process safety solutions to clients across the oil and gas, petrochemical, power, renewable energy, and infrastructure sectors.',
  aboutImage: media['who-we-are.png'].id, servicesEyebrow: 'Our services', servicesTitle: 'Integrated Solutions for a Complex World',
  projectsEyebrow: 'Featured projects', projectsTitle: 'Delivering Real Project Value', projectsDescription: 'We take pride in delivering complex projects that create value for our clients and communities.',
    industriesEyebrow: 'Industries we serve', industriesTitle: 'Expertise Across Key Sectors', industriesDescription: 'We provide sector-specific solutions to meet the evolving needs of our clients worldwide.',
    trendsEyebrow: 'Digital transformation', trendsTitle: 'New Emerging AI Trends in Oil & Gas', trendsDescription: 'Practical intelligence for safer assets, sharper decisions, and more resilient project delivery.',
  safetyEyebrow: 'Process safety management', safetyTitle: 'Safer Operations for a Better Tomorrow', safetyDescription: 'We integrate process safety into every stage of the project lifecycle, helping our clients manage risk and achieve reliable, efficient operations.',
  newsEyebrow: 'From the newsroom', newsTitle: 'Updates and insights', newsDescription: 'A space for the ideas, projects and perspectives shaping a safer energy future.',
  contactEyebrow: 'Start a conversation', contactTitle: 'Get in Touch', contactDescription: 'Tell us what you are planning. Our team can help shape a practical path from your first question to project delivery.',
  ctaEyebrow: "Let's work together", ctaTitle: "Let's Build a Safer, More Sustainable Future", ctaDescription: 'Discuss your project with our team and explore how US GLOBAL IMPEX can support your goals.'
});

const cmsServices = await get('services');
for (const [index, service] of services.entries()) {
  const entry = cmsServices.find((item) => item.slug === service.id);
  if (entry) await save('services', entry.documentId, { title: service.title, slug: service.id, summary: service.text, points: service.points, order: index, featured: true, image: media[`service-${index + 1}.avif`].id });
}

const cmsProjects = await get('projects');
for (const [index, project] of projects.entries()) {
  const entry = cmsProjects.find((item) => item.slug === project.id);
  if (!entry) continue;
  const data = { title: project.title, slug: project.id, location: project.location, metric: project.stat, summary: project.summary, details: project.details || null, order: index, featured: true };
  if (index === 0) data.image = media['project-1.avif'].id;
  await save('projects', entry.documentId, data);
}

const pages = await get('pages');
const servicesPage = pages.find((page) => page.slug === 'services');
if (servicesPage) await save('pages', servicesPage.documentId, { heroImage: media['service-banner.png'].id });

console.log(`Synced homepage, ${services.length} services, ${projects.length} projects, and current website imagery to Strapi.`);
