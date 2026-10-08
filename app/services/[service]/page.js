import { cache } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, ShieldCheck } from "lucide-react";
import { Header, ScrollAnimations } from "../../components/interactions";
import Footer from "../../components/footer";
import { services as fallbackServices } from "../../content";
import { cmsImage, getServiceContent } from "../../lib/cms";

const loadContent = cache(getServiceContent);

function resolveService(cms, slug) {
  const fallback = fallbackServices.find((item) => item.id === slug);
  const item = cms.services?.find((item) => item.slug === slug);
  if (!item && !fallback) return null;
  return {
    slug,
    title: item?.title || fallback.title,
    summary: item?.summary || fallback.text,
    body: item?.body || "",
    image: cmsImage(item?.image, fallback?.image || "/service-banner.png"),
    points: Array.isArray(item?.points) ? item.points.filter((point) => typeof point === "string") : fallback?.points || [],
  };
}

export async function generateMetadata({ params }) {
  const { service: slug } = await params;
  const item = resolveService(await loadContent(), slug);
  if (!item) return { title: "Service not found | US GLOBAL IMPEX" };
  return { title: `${item.title} | US GLOBAL IMPEX`, description: item.summary.slice(0, 160) };
}

export default async function ServicePage({ params }) {
  const { service: slug } = await params;
  const cms = await loadContent();
  const item = resolveService(cms, slug);
  if (!item) notFound();
  const links = cms.services?.length ? cms.services.map((entry) => ({ slug: entry.slug, title: entry.title })) : fallbackServices.map((entry) => ({ slug: entry.id, title: entry.title }));
  return (
    <>
      <Header settings={cms.global} services={cms.services} />
      <main>
        <section className="inner-hero service-detail-hero">
          <div className="inner-hero-image"><Image src={item.image} alt="" fill priority sizes="100vw" /></div>
          <div className="container inner-hero-content">
            <p className="eyebrow">Our expertise</p>
            <h1>{item.title}</h1>
            <nav className="inner-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/services">Services</Link><span aria-hidden="true">/</span><span aria-current="page">{item.title}</span></nav>
          </div>
        </section>
        <section className="section service-detail-section">
          <div className="container service-detail-grid">
            <article className="service-detail-copy" data-reveal>
              <p className="eyebrow">US GLOBAL IMPEX</p>
              <h2>{item.title}</h2>
              <p className="service-detail-summary">{item.summary}</p>
              {item.body && <div className="cms-richtext service-detail-body" dangerouslySetInnerHTML={{ __html: item.body }} />}
              {item.points.length > 0 && <div className="service-detail-scope"><h3>Our capabilities</h3><ul>{item.points.map((point) => <li key={point}><ShieldCheck size={20} aria-hidden="true" /><span>{point}</span></li>)}</ul></div>}
              <Link className="button" href="/contact">Discuss your project <ArrowRight size={18} /></Link>
            </article>
            <aside className="service-detail-sidebar">
              <nav aria-label="Our services"><h2>Our services</h2>{links.map((entry) => <Link href={`/services/${entry.slug}`} key={entry.slug} aria-current={slug === entry.slug ? "page" : undefined}>{entry.title}<ArrowUpRight size={16} aria-hidden="true" /></Link>)}<Link href="/process-safety-management">Process Safety Management<ArrowUpRight size={16} aria-hidden="true" /></Link></nav>
              <div className="service-detail-contact"><p className="eyebrow">Start a conversation</p><h2>Tell us about your project.</h2><p>Share your scope or engineering challenge. Our team will help you find the right solution.</p><Link href="/contact" className="button">Contact our team <ArrowRight size={18} /></Link></div>
            </aside>
          </div>
        </section>
      </main>
      <Footer settings={cms.global} />
      <ScrollAnimations />
    </>
  );
}
