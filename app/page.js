import Footer from "./components/footer";
import {
  Header,
  ScrollAnimations,
  DetailButton,
} from "./components/interactions";
import {
  ArrowRight,
  Atom,
  ShieldCheck,
  UsersRound,
  Leaf,
  HardHat,
  Factory,
  Wind,
  Building2,
  Construction,
  Flame,
  ClipboardCheck,
  Mail,
  Phone,
  MapPin,
  Globe,
  ScanSearch,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import InquiryForm from "./components/inquiry-form";
import { articles } from "./content";
import { cmsImage, getHomeContent } from "./lib/cms";
const assets = {
  hero: "/banner-home-2.png",
  engineering: "/who-we-are.png",
  construction: "/photo-1490775949603-0e355e8e01ba.avif",
  safety: "/photo-1607472586893-edb57bdc0e39.avif",
  plant: "/photo-1537053303914-caa41e31185a.avif",
  power: "/photo-1629143194046-6fdcbbbe6f63.avif",
  renewable: "/photo-1595437193398-f24279553f4f.avif",
  worker: "/photo-1498631906572-66c58d46ecf7.avif",
};
const services = [
  {
    title: "Engineering and Design",
    text: "Innovative and efficient engineering design solutions tailored to project requirements.",
    image: assets.engineering,
    icon: Atom,
  },
  {
    title: "EPCM and Turnkey Solutions",
    text: "End-to-end project delivery from concept to commissioning.",
    image: assets.construction,
    icon: HardHat,
  },
  {
    title: "Process Safety Management",
    text: "Risk-based process safety solutions for safer operations and regulatory compliance.",
    image: assets.safety,
    icon: ShieldCheck,
  },
  {
    title: "Oil and Gas Processing",
    text: "Solutions for natural gas and hydrocarbon processing facilities.",
    image: assets.hero,
    icon: Flame,
  },
  {
    title: "Power and Renewable Energy",
    text: "Engineering solutions for conventional and renewable power generation.",
    image: assets.renewable,
    icon: Factory,
  },
  {
    title: "Construction and Commissioning",
    text: "Efficient construction management and commissioning for successful project delivery.",
    image: assets.construction,
    icon: Construction,
  },
];
const iconByName = {
  engineering: Atom, safety: ShieldCheck, people: UsersRound,
  sustainability: Leaf, oil: Factory, power: Flame, renewable: Wind,
  infrastructure: Building2, construction: Construction,
};
function Photo({ src, alt, className = "", priority = false }) {
  return (
    <div className={`photo ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={priority ? "100vw" : "(max-width: 700px) 100vw, 50vw"}
        priority={priority}
      />
    </div>
  );
}
function Button({ children, href = "#contact", outline = false }) {
  return (
    <a className={`button ${outline ? "button-outline" : ""}`} href={href}>
      {children}
      <ArrowRight size={19} />
    </a>
  );
}
function TextLink({ children, href }) {
  return (
    <a className="text-link" href={href}>
      {children}
      <ArrowRight size={18} />
    </a>
  );
}
function Eyebrow({ children }) {
  return <p className="eyebrow">{children}</p>;
}
function Hero({ content = {} }) {
  return (
    <section className="hero" id="home">
      <Photo
        src={cmsImage(content.heroImage, assets.hero)}
        alt="Illuminated oil and gas processing plant at sunset"
        className="hero-photo"
        priority
      />
      <div className="hero-shade" />
      <div className="container hero-content">
        <p className="hero-kicker" data-hero>
          {content.heroEyebrow || "OIL & GAS | POWER | RENEWABLE ENERGY | INFRASTRUCTURE"}
        </p>
        <h1 data-hero>
          {content.heroTitle || "Engineering a"} <br />
          <strong>{content.heroHighlight || "better tomorrow."}</strong>
        </h1>
        <p className="hero-description" data-hero>
          {content.heroDescription || "Engineering, procurement, construction management, and process safety solutions for the oil and gas, petrochemical, power, renewable energy, and infrastructure sectors."}
        </p>
        <p className="hero-capabilities" data-hero>
          Feasibility <span>|</span> FEED <span>|</span> Detailed Engineering{" "}
          <span>|</span> Process Safety <span>|</span> Commissioning
        </p>
        <div className="button-row" data-hero>
          <Button href={content.heroPrimaryHref || "/services"}>{content.heroPrimaryLabel || "Explore Our Services"}</Button>
          <Button href={content.heroSecondaryHref || "/contact"} outline>{content.heroSecondaryLabel || "Request a Proposal"}</Button>
        </div>
      </div>
      <div className="hero-bottom container" data-hero>
        <span className="hero-bottom-label">
          ENGINEERING & TURNKEY SOLUTIONS
        </span>
        <a href="#about">
          Discover UGI <ArrowRight size={17} />
        </a>
      </div>
    </section>
  );
}
function About({ content = {} }) {
  const aboutValues = content.aboutFeatures?.length
    ? content.aboutFeatures.map((item) => [iconByName[item.icon] || Atom, item.title])
    : [[Atom, "Engineering Excellence"], [ShieldCheck, "Safety Driven"], [UsersRound, "Client Focused"], [Leaf, "Sustainable Solutions"]];
  const experience = content.statistics?.[0];
  return (
    <section className="about section" id="about">
      <div className="container about-grid">
        <div data-reveal>
          <Eyebrow>{content.aboutEyebrow || "Who we are"}</Eyebrow>
          <h2>{content.aboutTitle || "A Canada-headquartered engineering consultancy"}</h2>
          <p className="about-lead">
            {content.aboutLead || "with 10 years of experience in the hydrocarbon industry."}
          </p>
          <p>
            {content.aboutBody || "UGI Corporation provides innovative and cost-effective engineering, procurement, construction management, and process safety solutions to clients across the oil and gas, petrochemical, power, renewable energy, and infrastructure sectors."}
          </p>
          <DetailButton
            title="About UGI Corporation"
            description="A Canada-headquartered engineering consultancy with 10 years of experience in the hydrocarbon industry. Our multidisciplinary team supports projects from feasibility and FEED through detailed engineering, procurement, construction, and commissioning."
            className="button"
          >
            Learn More About Us <ArrowRight size={18} />
          </DetailButton>
        </div>
        <div className="about-visual" data-reveal>
          <Photo
            src={cmsImage(content.aboutImage, assets.engineering)}
            alt="Engineering team reviewing technical plans"
          />
          <div className="experience-badge">
            <strong>
              {experience?.value || "10+"}
            </strong>
            <span>
              {experience?.label || "Years of engineering experience"}
            </span>
          </div>
          <div className="values">
            {aboutValues.map(([Icon, label]) => (
              <div key={label}>
                <Icon />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
function Services({ content = {}, items }) {
  const displayServices = items?.length ? items.map((item, index) => ({ title: item.title, text: item.summary, image: cmsImage(item.image, services[index % services.length].image), icon: services[index % services.length].icon, slug: item.slug })) : services;
  return (
    <section className="services section" id="services">
      <div className="container">
        <div className="section-heading" data-reveal>
          <div>
            <Eyebrow>{content.servicesEyebrow || "Our services"}</Eyebrow>
            <h2>{content.servicesTitle || "Integrated Solutions for a Complex World"}</h2>
          </div>
          <TextLink href="/services">View All Services</TextLink>
        </div>
        <div className="service-grid" id="service-grid">
          {displayServices.map(({ title, text, image, icon: Icon, slug }, index) => (
            <article className="service-card" key={title} data-reveal>
              <Photo src={image} alt={title} />
              <span className="card-number" aria-hidden="true">
                0{index + 1}
              </span>
              <div className="service-body">
                <Icon className="service-icon" strokeWidth={1.5} />
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
                <Link
                  href={slug ? `/services#${slug}` : "/services"}
                  className="card-arrow"
                  aria-label={`Learn about ${title}`}
                >
                  <ArrowRight size={22} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
function Projects({ content = {}, items }) {
  const fallbackProjects = [
    {
      title: "Unity Power Plant Expansion",
      location: "South Sudan",
      image: assets.hero,
    },
    {
      title: "Four Wellhead Development",
      location: "South Sudan",
      image: assets.plant,
    },
    {
      title: "Flare System Upgrade Study",
      location: "Nigeria",
      image: assets.power,
    },
  ];
  const displayProjects = items?.length ? items.slice(0, 3).map((project, index) => ({ title: project.title, location: project.location, image: cmsImage(project.image, fallbackProjects[index % fallbackProjects.length].image) })) : fallbackProjects;
  return (
    <section className="projects section" id="projects">
      <div className="container projects-layout">
        <div className="projects-intro" data-reveal>
          <Eyebrow>{content.projectsEyebrow || "Featured projects"}</Eyebrow>
          <h2>{content.projectsTitle || "Delivering Real Project Value"}</h2>
          <p>
            {content.projectsDescription || "We take pride in delivering complex projects that create value for our clients and communities."}
          </p>
          <TextLink href="/projects">View All Projects</TextLink>
        </div>
        <div className="project-grid" id="project-grid">
          {displayProjects.map((p) => (
            <article className="project-card" key={p.title} data-reveal>
              <Photo src={p.image} alt={p.title} />
              <div className="project-body">
                <h3>{p.title}</h3>
                <p>
                  <span>—</span> {p.location}
                </p>
                <Link
                  href="/projects"
                  className="card-arrow"
                  aria-label={`View ${p.title}`}
                >
                  <ArrowRight size={19} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
function Industries({ content = {} }) {
  const industryItems = content.industries?.length
    ? content.industries.map((item) => [iconByName[item.icon] || Factory, item.title, item.text])
    : [[Factory, "Oil & Gas"], [Construction, "Petrochemicals"], [Flame, "Power"], [Wind, "Renewable Energy"], [Building2, "Infrastructure"]];
  return (
    <section className="industries section" id="industries">
      <div className="container">
        <div className="section-heading" data-reveal>
          <div>
            <Eyebrow>{content.industriesEyebrow || "Industries we serve"}</Eyebrow>
            <h2>{content.industriesTitle || "Expertise Across Key Sectors"}</h2>
          </div>
          <div className="heading-copy">
            <p>
              {content.industriesDescription || "We provide sector-specific solutions to meet the evolving needs of our clients worldwide."}
            </p>
            <TextLink href="/services">Explore Industries</TextLink>
          </div>
        </div>
        <div className="industry-grid" id="industry-grid">
          {industryItems.map(([Icon, title, description]) => (
            <DetailButton
              key={title}
              title={title}
              description={description || `Our ${title.toLowerCase()} expertise brings together engineering, project delivery, and process safety to meet your project requirements. Talk to our team about your next project.`}
              className="industry-card"
              reveal
            >
              <Icon strokeWidth={1.25} />
              <span>{title}</span>
              <ArrowRight className="industry-arrow" size={18} />
            </DetailButton>
          ))}
        </div>
      </div>
    </section>
  );
}
function EmergingTrends({ content = {}, items }) {
  const fallback = [
    { title: "Facility Intelligence", description: "Smarter facility projects combining reliable engineering with data-led monitoring, predictive insight, and safer operational decisions.", image: "/service-3.avif" },
    { title: "Pipeline Intelligence", description: "Connected pipeline systems designed for dependable transport, early anomaly detection, and efficient hydrocarbon operations.", image: "/service-2.avif" },
    { title: "Infrastructure Solutions", description: "Integrated civil and mechanical infrastructure solutions supported by modern digital engineering workflows.", image: "/service-5.avif" },
    { title: "Conventional & Heavy Oil", description: "Specialized engineering expertise for complex conventional and heavy oil facilities, from concept through reliable operation.", image: "/project-1.avif" },
  ];
  const cards = items?.length ? items.filter((item) => item.featured !== false).map((item, index) => ({ ...item, image: cmsImage(item.image, fallback[index % fallback.length].image) })) : fallback;
  return (
    <section className="emerging-trends section" id="emerging-trends">
      <div className="container">
        <div className="emerging-heading" data-reveal>
          <div>
            <Eyebrow>{content.trendsEyebrow || "Digital transformation"}</Eyebrow>
            <h2>{content.trendsTitle || "New Emerging AI Trends in Oil & Gas"}</h2>
          </div>
          <p>{content.trendsDescription || "Practical intelligence for safer assets, sharper decisions, and more resilient project delivery."}</p>
        </div>
        <div className="emerging-grid">
          {cards.slice(0, 4).map((item, index) => (
            <article className={`emerging-card emerging-card-${index + 1}`} key={item.slug || item.title} data-reveal>
              <div className="emerging-image">
                <Image src={item.image} alt={item.title} fill sizes="(max-width: 700px) 100vw, 50vw" />
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="emerging-copy">
                <p>AI-ENABLED DELIVERY</p>
                <h3>{item.title}</h3>
                <div><span />{item.description}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
function Safety({ content = {} }) {
  const safetyItems = content.safetySteps?.length
    ? content.safetySteps.map((item) => [iconByName[item.icon] || ShieldCheck, item.title])
    : [[ScanSearch, "Identify Hazards"], [Construction, "Assess Risks"], [ShieldCheck, "Implement Safeguards"], [ClipboardCheck, "Ensure Compliance"]];
  return (
    <section className="safety" id="safety">
      <div className="safety-visual">
        <Photo
          src={cmsImage(content.safetyImage, assets.worker)}
          alt="Professional inspecting an infrastructure site"
          className="safety-image"
        />
        <div className="safety-caption">
          <ShieldCheck />
          <span>
            Safety at every stage.
            <br />
            <strong>Confidence in every decision.</strong>
          </span>
        </div>
      </div>
      <div className="safety-content" data-reveal>
        <Eyebrow>{content.safetyEyebrow || "Process safety management"}</Eyebrow>
        <h2>{content.safetyTitle || "Safer Operations for a Better Tomorrow"}</h2>
        <p>
          {content.safetyDescription || "We integrate process safety into every stage of the project lifecycle, helping our clients manage risk and achieve reliable, efficient operations."}
        </p>
        <DetailButton
          title="Process Safety Management"
          description="We integrate process safety into every stage of the project lifecycle: identifying hazards, assessing risks, implementing safeguards, and supporting compliance. Contact our team to discuss a process safety review for your facility."
          className="button"
        >
          Learn More <ArrowRight size={18} />
        </DetailButton>
      </div>
      <div className="safety-steps" data-reveal>
        {safetyItems.map(([Icon, title], index) => (
          <div key={title}>
            <span className="step-number">0{index + 1}</span>
            <Icon />
            <span>{title}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
function News({ content = {}, items }) {
  const featured = items?.[0] ? { title: items[0].title, summary: items[0].excerpt, image: cmsImage(items[0].coverImage, assets.plant) } : { ...articles[0], image: assets.plant };
  return (
    <section className="news section" id="news">
      <div className="container">
        <div className="news-heading" data-reveal>
          <div>
            <p className="eyebrow">{content.newsEyebrow || "From the newsroom"}</p>
            <h2>{content.newsTitle || "Updates and insights"}</h2>
          </div>
          <p>
            {content.newsDescription || "A space for the ideas, projects and perspectives shaping a safer energy future."}
          </p>
        </div>
        <div className="news-editorial" data-reveal>
          <div className="news-editorial-copy">
            <span className="news-editorial-index">UGI PERSPECTIVES / 01</span>
            <div>
              <span className="news-status">Published article</span>
              <h3>{featured.title}</h3>
              <p>
                {featured.summary}
              </p>
            </div>
            <Link href="/news" className="news-editorial-link">
              Explore the newsroom <ArrowRight size={18} />
            </Link>
          </div>
          <div className="news-editorial-image">
            <Image
              src={featured.image}
              alt="Industrial gas processing facility"
              fill
              sizes="(max-width: 700px) 100vw, 50vw"
            />
            <span>GAS PROCESSING / UGI CORPORATION</span>
          </div>
        </div>
        <div className="news-topics" aria-label="Topics we follow" data-reveal>
          <span>FOCUS AREAS</span>
          {(items?.length ? items.slice(0, 4).map((item) => item.category) : ["Gas Processing", "Water Treatment", "Hydrogen", "Carbon Capture"]).map((topic, index) => <span key={topic}><b>{String(index + 1).padStart(2, "0")}</b> {topic}</span>)}
        </div>
      </div>
    </section>
  );
}
function GetInTouch({ content = {}, global = {} }) {
  global = global || {};
  return (
    <section className="get-in-touch section" id="get-in-touch">
      <div className="container home-form-shell">
        <div className="home-form-intro" data-reveal>
          <p className="eyebrow">{content.contactEyebrow || "Start a conversation"}</p>
          <h2>{content.contactTitle || "Get in Touch"}</h2>
          <p>
            {content.contactDescription || "Tell us what you are planning. Our team can help shape a practical path from your first question to project delivery."}
          </p>
          <div className="home-form-divider" />
          <span className="home-form-direct-label">Prefer to contact us directly?</span>
          <a href={`mailto:${global.email || "contact@ugicorpgroup.com"}`}>
            <Mail size={18} /> {global.email || "contact@ugicorpgroup.com"}
          </a>
          <a href="tel:+16472132228">
            <Phone size={18} /> {global.phone || "+1 (647) 213-2228"}
          </a>
          <span className="home-form-watermark" aria-hidden="true">UGI</span>
        </div>
        <div className="home-form-fields" data-reveal>
          <p className="home-form-kicker">PROJECT ENQUIRY / 01</p>
          <h3>How can we help?</h3>
          <p>Share a few details and we&apos;ll start the conversation.</p>
          <InquiryForm />
        </div>
      </div>
    </section>
  );
}
function Contact({ content = {}, global = {} }) {
  global = global || {};
  return (
    <section className="contact" id="contact">
      <div className="container contact-inner">
        <div data-reveal>
          <Eyebrow>{content.ctaEyebrow || "Let's work together"}</Eyebrow>
          <h2>{content.ctaTitle || "Let's Build a Safer, More Sustainable Future"}</h2>
          <p>
            {content.ctaDescription || "Discuss your project with our team and explore how UGI Corporation can support your goals."}
          </p>
        </div>
        <div className="contact-actions" data-reveal>
          <Button href="/contact">Discuss Your Project</Button>
          <a href={`mailto:${global.email || "contact@ugicorpgroup.com"}`}>
            <Mail size={21} />
            {global.email || "contact@ugicorpgroup.com"}
          </a>
          <a href="tel:+16472132228">
            <Phone size={20} />
            {global.phone || "+1 (647) 213-2228"}
          </a>
        </div>
      </div>
    </section>
  );
}
export default async function Home() {
  const cms = await getHomeContent();
  const content = cms.home || {};
  return (
    <>
      <Header settings={cms.global} />
      <main>
        <Hero content={content} />
        <About content={content} />
        <Services content={content} items={cms.services} />
        <Projects content={content} items={cms.projects} />
        <Industries content={content} />
        <EmergingTrends content={content} items={cms.trends} />
        <Safety content={content} />
        <News content={content} items={cms.articles} />
        <GetInTouch content={content} global={cms.global} />
        <Contact content={content} global={cms.global} />
      </main>
      <Footer settings={cms.global} />
      <ScrollAnimations />
    </>
  );
}
