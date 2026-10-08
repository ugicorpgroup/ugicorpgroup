import type { Core } from '@strapi/strapi';
import fs from 'node:fs';
import path from 'node:path';

const services = [
  ['Engineering & Project Management', 'engineering-project-management', 'From feasiblity studies and design to commissioning and start-up, our team plans and manages projects with a focus on schedule, quality, safety, and cost.'],
  ['Asset Management', 'asset-management', 'Strategic planning, risk assessment, maintenance planning, and operational optimization for oil and gas facilities.'],
  ['Natural Gas Processing', 'natural-gas-processing', 'Gas gathering, compression, sweetening, dehydration, LPG and NGL recovery, utilities, and pipelines.'],
  ['Oil Refinery Services', 'oil-refinery-services', 'Feasibility, process design, equipment selection, optimization, risk assessment, and regulatory compliance.'],
  ['Construction Management', 'construction-management', 'Construction planning, contractor coordination, site supervision, quality control, and project closeout.'],
  ['Procurement & Sourcing', 'procurement-sourcing', 'Procurement planning, vendor identification, evaluations, inspections, expediting, and logistics.'],
];
const projects = [
  ['Unity Power Plant Expansion', 'unity-power-plant', 'South Sudan', '~56 MW', 'Multidiscipline engineering for a brownfield power plant expansion supporting upstream operations.'],
  ['Four Wellhead Developments', 'wellhead-development', 'South Sudan', '4 wellheads', 'EPCM delivery from initial design through procurement, construction oversight, and commissioning.'],
  ['Field Surface Facilities', 'field-surface-facilities', 'South Sudan', '70+ deliverables', 'Multidiscipline engineering for field surface facilities and a power distribution system.'],
  ['Flare System Upgrade Study', 'flare-upgrade', 'Nigeria', 'Engineering study', 'Engineering study of changes to an existing flare system at a hydrocarbon processing facility.'],
  ['Power Plant Support - HRSG', 'power-plant-support', 'Pakistan', '220 MW', 'Technical support for a combined-cycle power plant and associated utilities.'],
  ['LPG Process Plant', 'lpg-process-plant', 'International', '100 MMSCFD', 'Basic engineering support for an LPG processing facility, utilities, and offsite systems.'],
];
const articles = [
  ['Gas Processing Plants', 'gas-processing-plants', 'Gas processing', '2023-01-01', 'An overview of natural gas dehydration, amine sweetening, LPG extraction, LNG terminals, compressor stations, and dew point control.'],
  ['Advance Water Treatment', 'advance-water-treatment', 'Water treatment', '2023-11-20', ''],
  ['Hydrogen Production', 'hydrogen-production', 'Hydrogen', '2023-11-20', ''],
  ['CO2 Capture Technology', 'co2-capture-technology', 'Carbon capture', '2023-11-20', ''],
];
const offices = [
  ['Canada Head Office', '11 Strathlea Common SW, Calgary, Canada'],
  ['USA Office', '37501 Carringer Rd, Dade City, Florida 33523'],
  ['Pakistan Office', 'SeharComm, Phase 7 DHA, Karachi'],
  ['Bangladesh Office', 'Baridhara, Block-J, Dhaka 1212'],
  ['Saudi Arabia Office', '1st Floor, Suite No. 1, Binladin Plaza, King Fahd Road, P.O. Box 5971, Jeddah 21432'],
];
const trends = [
  ['Facility Intelligence', 'facility-intelligence', 'Smarter facility projects combining reliable engineering with data-led monitoring, predictive insight, and safer operational decisions.'],
  ['Pipeline Intelligence', 'pipeline-intelligence', 'Connected pipeline systems designed for dependable transport, early anomaly detection, and efficient hydrocarbon operations.'],
  ['Infrastructure Solutions', 'infrastructure-solutions', 'Integrated civil and mechanical infrastructure solutions supported by modern digital engineering workflows.'],
  ['Conventional & Heavy Oil', 'conventional-heavy-oil', 'Specialized engineering expertise for complex conventional and heavy oil facilities, from concept through reliable operation.'],
];

async function publish(strapi: Core.Strapi, uid: string, data: Record<string, unknown>) {
  return strapi.documents(uid as any).create({ data, status: 'published' } as any);
}
async function seedIfEmpty(strapi: Core.Strapi, uid: string, entries: Record<string, unknown>[]) {
  const existing = await strapi.documents(uid as any).findMany({ pageSize: 1 } as any);
  if (existing.length) return;
  for (const data of entries) await publish(strapi, uid, data);
}

async function ensureMedia(strapi: Core.Strapi, filename: string) {
  const existing = await strapi.db.query('plugin::upload.file').findOne({ where: { name: filename } });
  if (existing) return existing;
  const filePath = path.resolve(process.cwd(), '..', 'public', filename);
  if (!fs.existsSync(filePath)) return null;
  const extension = path.extname(filename).toLowerCase();
  const types: Record<string, string> = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.avif': 'image/avif', '.webp': 'image/webp' };
  const uploaded = await strapi.plugin('upload').service('upload').upload({
    data: { fileInfo: { name: filename, caption: 'US GLOBAL IMPEX website image', alternativeText: 'US GLOBAL IMPEX' } },
    files: { filepath: filePath, originalFilename: filename, mimetype: types[extension] || 'application/octet-stream', size: fs.statSync(filePath).size },
  });
  return Array.isArray(uploaded) ? uploaded[0] : uploaded;
}

async function attachCollectionMedia(strapi: Core.Strapi, uid: string, mediaField: string, mapping: Record<string, string>) {
  const documents = strapi.documents(uid as any);
  for (const [slug, filename] of Object.entries(mapping)) {
    const entry = (await documents.findMany({ filters: { slug: { $eq: slug } }, status: 'draft', populate: '*' } as any))[0];
    if (!entry || entry[mediaField]) continue;
    const media = await ensureMedia(strapi, filename);
    if (!media) continue;
    await documents.update({ documentId: entry.documentId, data: { [mediaField]: media.id }, status: 'draft' } as any);
    await documents.publish({ documentId: entry.documentId } as any);
  }
}

export default {
  register() { },
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await seedIfEmpty(strapi, 'api::service.service', services.map(([title, slug, summary], order) => ({ title, slug, summary, order, featured: true })));
    await seedIfEmpty(strapi, 'api::project.project', projects.map(([title, slug, location, metric, summary], order) => ({ title, slug, location, metric, summary, order, featured: true })));
    await seedIfEmpty(strapi, 'api::article.article', articles.map(([title, slug, category, publishedDate, excerpt], index) => ({ title, slug, category, publishedDate, excerpt, featured: index === 0, externalUrl: `https://ugicorpgroup.com/${slug}` })));
    await seedIfEmpty(strapi, 'api::office.office', offices.map(([name, address], order) => ({ name, address, order })));
    await seedIfEmpty(strapi, 'api::emerging-trend.emerging-trend', trends.map(([title, slug, description], order) => ({ title, slug, description, order, featured: true })));
    await seedIfEmpty(strapi, 'api::page.page', [
      { title: 'Services', slug: 'services', heroEyebrow: 'What we do', heroTitle: 'Engineering solutions built around your project.', heroDescription: 'From early studies through construction and start-up, US GLOBAL IMPEX brings together engineering, project management, and delivery expertise.', sectionEyebrow: 'Across the project lifecycle', sectionTitle: 'One partner from concept to operation.', sectionDescription: 'Our services support feasibility, engineering, procurement, construction, commissioning, and ongoing asset performance.' },
      { title: 'Projects', slug: 'projects', heroEyebrow: 'Selected work', heroTitle: 'Projects delivered with purpose.', heroDescription: 'Explore engineering and project delivery work across power generation, upstream facilities, process plants, and technical safety.', sectionEyebrow: 'Project experience', sectionTitle: 'Engineering work with real operational impact.', sectionDescription: 'Selected projects show how US GLOBAL IMPEX supports expansions, facility development, safety studies, and power infrastructure.' },
      { title: 'Process Safety Management', slug: 'process-safety-management', heroEyebrow: 'Technical safety experts', heroTitle: 'Protect people. Strengthen operations.', heroDescription: 'Practical process safety services help teams understand hazards, manage change, and operate with confidence.', sectionEyebrow: 'Process safety management', sectionTitle: 'Safety thinking at every stage.', sectionDescription: 'US GLOBAL IMPEX supports the development, review, and improvement of process safety programs.' },
      { title: 'News', slug: 'news', heroEyebrow: 'US GLOBAL IMPEX insights', heroTitle: 'News & updates.', heroDescription: 'Explore published articles on gas processing, water treatment, hydrogen production, and carbon capture.', sectionEyebrow: 'From US GLOBAL IMPEX', sectionTitle: 'Ideas across the energy landscape.', sectionDescription: 'Discover articles on the processes and technologies shaping industrial projects.' },
      { title: 'Careers', slug: 'careers', heroEyebrow: 'Join our team', heroTitle: 'Build a rewarding future with us.', heroDescription: 'Connect with US GLOBAL IMPEX about engineering and project opportunities.', sectionEyebrow: 'Careers at US GLOBAL IMPEX', sectionTitle: 'Tell us what you bring to the team.', sectionDescription: 'Share your experience and the type of role you are interested in.' },
      { title: 'Contact', slug: 'contact', heroEyebrow: 'Start a conversation', heroTitle: "Let's talk about your next project.", heroDescription: 'Tell us what you are planning. Our team is ready to discuss your needs.', sectionEyebrow: 'Get in touch', sectionTitle: "We're ready to hear from you.", sectionDescription: 'Whether you have a project enquiry or want to learn more about US GLOBAL IMPEX, reach out to our team.' },
    ]);

    if (!(await strapi.documents('api::home-page.home-page').findFirst())) await publish(strapi, 'api::home-page.home-page', {
      heroEyebrow: 'Oil & Gas | Power | Renewable Energy | Infrastructure', heroTitle: 'Engineering and', heroHighlight: 'Turnkey Solutions',
      heroDescription: 'Engineering, procurement, construction management, and process safety solutions for the oil and gas, petrochemical, power, renewable energy, and infrastructure sectors.',
      heroPrimaryLabel: 'Explore Our Services', heroPrimaryHref: '/services', heroSecondaryLabel: 'Request a Proposal', heroSecondaryHref: '/contact',
      aboutEyebrow: 'Who we are', aboutTitle: 'A Canada-headquartered engineering consultancy', aboutLead: 'More than 10 years of experience in the hydrocarbon industry.',
      aboutBody: 'US GLOBAL IMPEX provides innovative and cost-effective engineering, procurement, construction management, and process safety solutions.',
      servicesEyebrow: 'Our services', servicesTitle: 'Integrated Solutions for a Complex World', projectsEyebrow: 'Featured projects', projectsTitle: 'Delivering Real Project Value',
      projectsDescription: 'We take pride in delivering complex projects that create value for our clients and communities.', industriesEyebrow: 'Industries we serve', industriesTitle: 'Expertise Across Key Sectors',
      industriesDescription: 'Sector-specific solutions that meet the evolving needs of our clients worldwide.', safetyEyebrow: 'Process safety management', safetyTitle: 'Safer Operations for a Better Tomorrow',
      trendsEyebrow: 'Digital transformation', trendsTitle: 'New Emerging AI Trends in Oil & Gas', trendsDescription: 'Practical intelligence for safer assets, sharper decisions, and more resilient project delivery.',
      safetyDescription: 'We integrate process safety into every stage of the project lifecycle, helping clients manage risk and achieve reliable operations.',
      newsEyebrow: 'From the newsroom', newsTitle: 'Updates and insights', newsDescription: 'Ideas, projects and perspectives shaping a safer energy future.',
      contactEyebrow: 'Start a conversation', contactTitle: 'Get in Touch', contactDescription: 'Tell us what you are planning. Our team can help shape a practical path from your first question to project delivery.',
      ctaEyebrow: "Let's work together", ctaTitle: "Let's Build a Safer, More Sustainable Future", ctaDescription: 'Discuss your project with our team and explore how US GLOBAL IMPEX can support your goals.'
    });
    if (!(await strapi.documents('api::global-setting.global-setting').findFirst())) await publish(strapi, 'api::global-setting.global-setting', {
      siteName: 'US GLOBAL IMPEX', tagline: 'Engineering a safer and more sustainable tomorrow', email: 'contact@ugicorpgroup.com', phone: '+1 (647) 213-2228', whatsappNumber: '+1 (647) 213-2228',
      footerSummary: 'Engineering, procurement, construction management, and process safety solutions for a better tomorrow.', copyright: `© ${new Date().getFullYear()} US GLOBAL IMPEX. All rights reserved.`,
      navigation: [
        { label: 'Home', href: '/', isButton: false }, { label: 'Services', href: '/services', isButton: false }, { label: 'Projects', href: '/projects', isButton: false },
        { label: 'Process Safety Management', href: '/process-safety-management', isButton: false }, { label: 'News', href: '/news', isButton: false }, { label: 'Careers', href: '/careers', isButton: false }, { label: 'Contact', href: '/contact', isButton: true }
      ]
    });

    await attachCollectionMedia(strapi, 'api::service.service', 'image', {
      'engineering-project-management': 'photo-1581092583537-20d51b4b4f1b.avif', 'asset-management': 'photo-1537053303914-caa41e31185a.avif',
      'natural-gas-processing': 'banner-home.png', 'oil-refinery-services': 'photo-1607472586893-edb57bdc0e39.avif',
      'construction-management': 'photo-1490775949603-0e355e8e01ba.avif', 'procurement-sourcing': 'photo-1580983223955-1f15adc474ae.avif'
    });
    await attachCollectionMedia(strapi, 'api::project.project', 'image', {
      'unity-power-plant': 'banner-home.png', 'wellhead-development': 'photo-1537053303914-caa41e31185a.avif',
      'field-surface-facilities': 'photo-1490775949603-0e355e8e01ba.avif', 'flare-upgrade': 'photo-1629143194046-6fdcbbbe6f63.avif',
      'power-plant-support': 'photo-1537053303914-caa41e31185a.avif', 'lpg-process-plant': 'banner-home.png'
    });
    await attachCollectionMedia(strapi, 'api::article.article', 'coverImage', {
      'gas-processing-plants': 'photo-1537053303914-caa41e31185a.avif', 'advance-water-treatment': 'photo-1580983223955-1f15adc474ae.avif',
      'hydrogen-production': 'photo-1629143194046-6fdcbbbe6f63.avif', 'co2-capture-technology': 'photo-1607472586893-edb57bdc0e39.avif'
    });
    await attachCollectionMedia(strapi, 'api::emerging-trend.emerging-trend', 'image', {
      'facility-intelligence': 'service-3.avif', 'pipeline-intelligence': 'service-2.avif',
      'infrastructure-solutions': 'service-5.avif', 'conventional-heavy-oil': 'project-1.avif'
    });
    await attachCollectionMedia(strapi, 'api::page.page', 'heroImage', {
      services: 'photo-1581092583537-20d51b4b4f1b.avif', projects: 'banner-home.png', 'process-safety-management': 'photo-1607472586893-edb57bdc0e39.avif',
      news: 'photo-1595437193398-f24279553f4f.avif', careers: 'photo-1581092583537-20d51b4b4f1b.avif', contact: 'banner-home.png'
    });
    const homeDocument: any = await strapi.documents('api::home-page.home-page').findFirst({ status: 'draft', populate: '*' } as any);
    if (homeDocument && (!homeDocument.heroImage || !homeDocument.aboutImage || !homeDocument.safetyImage)) {
      const heroImage = await ensureMedia(strapi, 'banner-home.png'); const aboutImage = await ensureMedia(strapi, 'photo-1581092583537-20d51b4b4f1b.avif'); const safetyImage = await ensureMedia(strapi, 'photo-1498631906572-66c58d46ecf7.avif');
      await strapi.documents('api::home-page.home-page').update({ documentId: homeDocument.documentId, data: { heroImage: heroImage?.id, aboutImage: aboutImage?.id, safetyImage: safetyImage?.id, ctaBackground: heroImage?.id }, status: 'draft' } as any);
      await strapi.documents('api::home-page.home-page').publish({ documentId: homeDocument.documentId } as any);
    }
    const globalDocument: any = await strapi.documents('api::global-setting.global-setting').findFirst({ status: 'draft', populate: '*' } as any);
    if (globalDocument && !globalDocument.logo) {
      const logo = await ensureMedia(strapi, 'logo.jpeg');
      if (logo) { await strapi.documents('api::global-setting.global-setting').update({ documentId: globalDocument.documentId, data: { logo: logo.id }, status: 'draft' } as any); await strapi.documents('api::global-setting.global-setting').publish({ documentId: globalDocument.documentId } as any); }
    }

    const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
    if (publicRole) {
      const actions = ['global-setting', 'home-page', 'service', 'project', 'article', 'office', 'page', 'emerging-trend'].flatMap((name) => [`api::${name}.${name}.find`, `api::${name}.${name}.findOne`]);
      for (const action of actions) {
        const exists = await strapi.db.query('plugin::users-permissions.permission').findOne({ where: { action, role: publicRole.id } });
        if (!exists) await strapi.db.query('plugin::users-permissions.permission').create({ data: { action, role: publicRole.id } });
      }
    }
  }
};
