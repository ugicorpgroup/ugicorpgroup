import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  BriefcaseBusiness,
  Factory,
  Droplets,
  Atom,
  Cloud,
} from "lucide-react";
import { FacebookIcon, LinkedInIcon } from "../components/social-icons";
import { Header, ScrollAnimations } from "../components/interactions";
import Footer from "../components/footer";
import InquiryForm from "../components/inquiry-form";
import { services, projects, safetyGroups, offices, articles } from "../content";
import { cmsImage, getPageContent } from "../lib/cms";

const pageInfo = {
  services: {
    eyebrow: "What we do",
    title: "Engineering solutions built around your project.",
    intro:
      "From early studies through construction and start-up, US GLOBAL IMPEX brings together engineering, project management, and delivery expertise for industrial and energy facilities. We work as an extension of your team, keeping every phase safe, coordinated, and aligned with your objectives.",
    image: "/service-banner.png",
  },
  projects: {
    eyebrow: "Selected work",
    title: "Projects delivered with purpose.",
    intro:
      "Explore engineering and project delivery work across power generation, upstream facilities, process plants, and technical safety.",
    image: "/banner-home.png",
  },
  "process-safety-management": {
    eyebrow: "Technical safety experts",
    title: "Protect people. Strengthen operations.",
    intro:
      "Practical process safety services help teams understand hazards, manage change, and operate with confidence throughout the facility lifecycle.",
    image: "/photo-1607472586893-edb57bdc0e39.avif",
  },
  news: {
    eyebrow: "US GLOBAL IMPEX insights",
    title: "News & updates.",
    intro: "Explore published articles on gas processing, water treatment, hydrogen production, and carbon capture.",
    image: "/photo-1595437193398-f24279553f4f.avif",
  },
  careers: {
    eyebrow: "Join our team",
    title: "Build a rewarding future with us.",
    intro:
      "Connect with US GLOBAL IMPEX about engineering and project opportunities.",
    image: "/photo-1581092583537-20d51b4b4f1b.avif",
  },
  contact: {
    eyebrow: "Start a conversation",
    title: "Let’s talk about your next project.",
    intro:
      "Tell us what you are planning. Our team is ready to discuss engineering, project delivery, and process safety needs.",
    image: "/banner-home.png",
  },
};
export function generateStaticParams() {
  return Object.keys(pageInfo).map((slug) => ({ slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const info = pageInfo[slug];
  return info
    ? { title: `${info.title} | US GLOBAL IMPEX`, description: info.intro }
    : {};
}
function PageHero({ info }) {
  return (
    <section className="inner-hero">
      <div className="inner-hero-image">
        <Image src={info.image} alt="" fill priority sizes="100vw" />
      </div>
      <div className="container inner-hero-content">
        <p className="eyebrow">{info.eyebrow}</p>
        <h1>{info.title}</h1>
        <p>{info.intro}</p>
        <div className="inner-breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>{info.eyebrow}</span>
        </div>
      </div>
    </section>
  );
}
function CmsSections({ sections = [] }) {
  if (!sections.length) return null;
  return (
    <section className="inner-list-section section cms-sections">
      <div className="container">
        {sections.map((section, index) => (
          <article className={`cms-section cms-section-${section.imagePosition || "right"}`} key={section.id || index} data-reveal>
            {section.image && (
              <div className="cms-section-image">
                <Image src={cmsImage(section.image, "/banner-home.png")} alt="" fill sizes="(max-width: 700px) 100vw, 50vw" />
              </div>
            )}
            <div className="cms-section-copy">
              {section.eyebrow && <p className="eyebrow">{section.eyebrow}</p>}
              <h2>{section.heading}</h2>
              {section.body && <div className="cms-richtext" dangerouslySetInnerHTML={{ __html: section.body }} />}
              {section.buttonLabel && section.buttonHref && <Link className="button" href={section.buttonHref}>{section.buttonLabel} <ArrowRight size={18} /></Link>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
function Callout({
  title = "Let’s bring your project to life.",
  text = "Tell us about your scope and connect with our team.",
}) {
  return (
    <section className="inner-callout">
      <div className="container inner-callout-content">
        <div>
          <p className="eyebrow">Work with US GLOBAL IMPEX</p>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <Link className="button" href="/contact">
          Contact our team <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
function ServicesPage({ cms }) {
  const serviceItems = cms.services?.length ? cms.services.map((item) => ({ id: item.slug, title: item.title, text: item.summary, points: Array.isArray(item.points) ? item.points : [], image: cmsImage(item.image, "/photo-1581092583537-20d51b4b4f1b.avif") })) : services;
  return (
    <>
      <section className="inner-list-section section">
        <div className="container">
          <div className="inner-section-heading" data-reveal>
            <p className="eyebrow">Our capabilities</p>
            <h2>Services</h2>
          </div>
          <div className="capability-list">
            {serviceItems.map((item, index) => (
              <article
                className="capability-row"
                data-reveal
                key={item.id}
                id={item.id}
              >
                <div className="capability-image">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(max-width: 700px) 100vw, 35vw"
                  />
                </div>
                <div className="capability-copy">
                  <span className="item-index">
                    0{index + 1} / 0{serviceItems.length}
                  </span>
                  <h3><Link href={`/services/${item.id}`}>{item.title}</Link></h3>
                  <p>{item.text}</p>
                  <Link className="text-link service-detail-link" href={`/services/${item.id}`}>Explore service <ArrowRight size={17} /></Link>
                  <ul>
                    {item.points.map((point) => (
                      <li key={point}>
                        <ShieldCheck size={16} />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Callout />
    </>
  );
}
function ProjectsPage({ cms }) {
  const projectItems = cms.projects?.length ? cms.projects.map((item) => ({ id: item.slug, title: item.title, location: item.location, stat: item.metric, summary: item.summary, details: item.details, image: cmsImage(item.image, "/banner-home.png") })) : projects;
  return (
    <>
      <section className="inner-intro section" data-reveal>
        <div className="container intro-grid">
          <div>
            <p className="eyebrow">Project experience</p>
            <h2>Engineering work with real operational impact.</h2>
          </div>
          <p>
            Each scope is different. These selected projects show how US GLOBAL IMPEX
            supports brownfield expansions, facility development, safety
            studies, and power infrastructure.
          </p>
        </div>
      </section>
      <section className="inner-list-section section">
        <div className="container">
          <div className="inner-section-heading" data-reveal>
            <p className="eyebrow">Our portfolio</p>
            <h2>Projects Summary</h2>
          </div>
          <div className="portfolio-grid">
            {projectItems.map((project, index) => (
              <article
                className="portfolio-card"
                data-reveal
                key={project.id}
                id={project.id}
              >
                <div className="portfolio-image">
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    sizes="(max-width: 700px) 100vw, 50vw"
                  />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="portfolio-copy">
                  <div className="portfolio-meta">
                    <span>{project.location}</span>
                    <span>{project.stat}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  {project.details && <p>{project.details}</p>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Callout
        title="Have a complex project ahead?"
        text="We would welcome a conversation about the challenges, scope, and schedule."
      />
    </>
  );
}
function SafetyPage() {
  return (
    <>
      <section className="inner-intro section" data-reveal>
        <div className="container intro-grid">
          <div>
            <p className="eyebrow">Process safety management</p>
            <h2>Safety thinking at every stage.</h2>
          </div>
          <p>
            US GLOBAL IMPEX supports the development, review, and improvement of process
            safety programs, from hazard analysis and mechanical integrity to
            audits and emergency response.
          </p>
        </div>
      </section>
      <section className="inner-list-section section">
        <div className="container">
          <div className="inner-section-heading" data-reveal>
            <p className="eyebrow">Technical safety services</p>
            <h2>Know the risk. Strengthen the safeguards.</h2>
          </div>
          <div className="safety-group-grid">
            {safetyGroups.map((group, index) => (
              <article className="safety-group" data-reveal key={group.title}>
                <span className="item-index">0{index + 1}</span>
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>
                      <ShieldCheck size={17} />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Callout
        title="Let’s discuss a safer path forward."
        text="Talk with our team about hazard studies, safety reviews, and program development."
      />
    </>
  );
}
function NewsPage({ cms }) {
  const icons = [Factory, Droplets, Atom, Cloud];
  const articleItems = cms.articles?.length ? cms.articles.map((item) => ({ title: item.title, slug: item.slug, date: item.publishedDate ? new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(new Date(item.publishedDate)) : "", category: item.category, summary: item.excerpt, externalUrl: item.externalUrl })) : articles;
  return (
    <section className="inner-list-section section published-news">
      <div className="container">
        <div className="published-news-heading" data-reveal>
          <div>
            <p className="eyebrow">From US GLOBAL IMPEX</p>
            <h2>Ideas across the energy landscape.</h2>
          </div>
          <p>Discover articles published by US GLOBAL IMPEX on the processes and technologies shaping industrial projects.</p>
        </div>
        <div className="published-news-grid">
          {articleItems.map((article, index) => {
            const Icon = icons[index % icons.length];
            return (
              <article className={`published-news-card ${index === 0 ? "published-news-card-featured" : ""}`} key={article.slug} data-reveal>
                <div className="published-news-art" aria-hidden="true">
                  <span className="published-news-art-index">US GLOBAL IMPEX / {String(index + 1).padStart(2, "0")}</span>
                  <Icon size={index === 0 ? 94 : 74} strokeWidth={1.15} />
                  <span className="published-news-art-line" />
                </div>
                <div className="published-news-card-body">
                  <div className="published-news-meta"><span>{article.category}</span><span>{article.date}</span></div>
                  <h3>{article.title}</h3>
                  {article.summary && <p>{article.summary}</p>}
                  <a href={article.externalUrl || `https://ugicorpgroup.com/${article.slug}`} target="_blank" rel="noopener noreferrer" className="published-news-link" aria-label={`Read ${article.title} on US GLOBAL IMPEX`}>
                    Read article <ArrowUpRight size={18} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
function CareersPage() {
  return (
    <section className="inner-list-section section">
      <div className="container career-layout">
        <div>
          <p className="eyebrow">Careers at US GLOBAL IMPEX</p>
          <h2>Tell us what you bring to the team.</h2>
          <p>
            Share your experience and the type of role you are interested in.
            US GLOBAL IMPEX’s current site invites applications from engineering
            professionals.
          </p>
          <div className="career-note">
            <BriefcaseBusiness />
            <span>Engineering & project delivery opportunities</span>
          </div>
        </div>
        <div className="form-panel" data-reveal>
          <h3>Career enquiry</h3>
          <p>Complete the fields below to prepare an email to our team.</p>
          <InquiryForm career />
        </div>
      </div>
    </section>
  );
}
function ContactPage({ cms }) {
  const officeItems = (cms.offices?.length ? cms.offices : offices).filter(
    (office) => /\b(canada|canadian|pakistan|pakistani)\b/i.test(`${office.name} ${office.address}`),
  );
  const contactEmail = cms.global?.email || "contact@ugicorpgroup.com";
  const contactPhone = cms.global?.phone || "+1 (647) 213-2228";
  return (
    <>
      <section className="inner-list-section section">
        <div className="container contact-page-grid">
          <div>
            <p className="eyebrow">Get in touch</p>
            <h2>We’re ready to hear from you.</h2>
            <p className="contact-page-lead">
              Whether you have a project enquiry or want to learn more about
              US GLOBAL IMPEX, reach out to our team.
            </p>
            <div className="contact-direct">
              <a href={`mailto:${contactEmail}`}>
                <Mail /> {contactEmail}
              </a>
              <a href="tel:+16472132228">
                <Phone /> {contactPhone}
              </a>
            </div>
            <div className="contact-socials">
              <span>Connect with US GLOBAL IMPEX</span>
              <div>
                <a href="https://www.facebook.com/UGICanada/" target="_blank" rel="noopener noreferrer" aria-label="US GLOBAL IMPEX on Facebook"><FacebookIcon size={19}/><span>Facebook</span><ArrowUpRight size={15}/></a>
                <a href="https://www.linkedin.com/company/us-global-impex-corporation/about/" target="_blank" rel="noopener noreferrer" aria-label="US GLOBAL IMPEX on LinkedIn"><LinkedInIcon size={19}/><span>LinkedIn</span><ArrowUpRight size={15}/></a>
              </div>
            </div>
            <div className="office-list">
              <h3>Our offices</h3>
              {officeItems.map((office) => (
                <div key={office.name}>
                  <MapPin size={18} />
                  <div>
                    <strong>{office.name}</strong>
                    <p>{office.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="form-panel" data-reveal>
            <h3>Send an enquiry</h3>
            <p>Tell us a little about your project or question.</p>
            <InquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
const bodies = {
  services: ServicesPage,
  projects: ProjectsPage,
  "process-safety-management": SafetyPage,
  news: NewsPage,
  careers: CareersPage,
  contact: ContactPage,
};
export default async function Page({ params }) {
  const { slug } = await params;
  const cms = await getPageContent(slug);
  const customPage = cms.page;
  const fallbackInfo = pageInfo[slug];
  const info = customPage ? {
    eyebrow: customPage.heroEyebrow || fallbackInfo?.eyebrow,
    title: customPage.heroTitle || fallbackInfo?.title,
    intro: customPage.heroDescription || fallbackInfo?.intro,
    image: cmsImage(customPage.heroImage, fallbackInfo?.image),
  } : fallbackInfo;
  if (!info) notFound();
  const Body = bodies[slug];
  return (
    <>
      <Header settings={cms.global} services={cms.services} />
      <main>
        <PageHero info={info} />
        <Body cms={cms} />
        <CmsSections sections={customPage?.sections} />
      </main>
      <Footer settings={cms.global} />
      <ScrollAnimations />
    </>
  );
}
