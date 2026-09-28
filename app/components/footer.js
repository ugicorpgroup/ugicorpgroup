import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon, LinkedInIcon } from "./social-icons";

const FACEBOOK_URL = "https://www.facebook.com/UGICanada/";
const LINKEDIN_URL = "https://www.linkedin.com/company/us-global-impex-corporation/about/";

const explore = [
  ["Home", "/"],
  ["Services", "/services"],
  ["Projects", "/projects"],
  ["Process Safety Management", "/process-safety-management"],
  ["News", "/news"],
  ["Careers", "/careers"],
];
const expertise = [
  ["Engineering & Design", "/services#engineering-project-management"],
  ["Natural Gas Processing", "/services#natural-gas-processing"],
  ["Construction Management", "/services#construction-management"],
  ["Process Safety Management", "/process-safety-management"],
];

export default function Footer({ settings = {} }) {
  settings = settings || {};
  const email = settings.email || "contact@ugicorpgroup.com";
  const phone = settings.phone || "+1 (647) 213-2228";
  return (
    <footer className="site-footer">
      <div className="container footer-topline">
        <span>ENGINEERING EXCELLENCE</span>
        <span>SAFETY FIRST</span>
        <span>GLOBAL PERSPECTIVE</span>
      </div>
      <div className="container footer-primary">
        <div className="footer-identity">
          <Link href="/" className="footer-wordmark" aria-label="UGI Corporation home">
            <Image src="/logo.jpeg" alt="UGI Corporation" width={126} height={74} />
          </Link>
          <p>{settings.footerSummary || "Practical engineering and project delivery for a safer, more sustainable future."}</p>
          <div className="footer-socials" aria-label="UGI social media">
            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="UGI Corporation on Facebook"><FacebookIcon size={17} /></a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="UGI Corporation on LinkedIn"><LinkedInIcon size={17} /></a>
          </div>
          <Link href="/contact" className="footer-cta">Let&apos;s work together <ArrowUpRight size={18} /></Link>
        </div>
        <div className="footer-column">
          <h2>Explore</h2>
          <nav aria-label="Footer navigation">{explore.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</nav>
        </div>
        <div className="footer-column">
          <h2>Expertise</h2>
          <nav aria-label="Expertise links">{expertise.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</nav>
        </div>
        <div className="footer-column footer-connect">
          <h2>Start a conversation</h2>
          <p>Have a project in mind? Connect with our team.</p>
          <a href={`mailto:${email}`}><span><Mail size={17} /></span>{email}</a>
          <a href={`tel:${phone.replace(/[^+\d]/g, "")}`}><span><Phone size={17} /></span>{phone}</a>
          <div className="footer-location"><MapPin size={17} /><span>Canada Head Office<br />Calgary, Alberta</span></div>
        </div>
      </div>
      <div className="footer-bottomline">
        <div className="container footer-bottomline-inner">
          <p>{settings.copyright || `© ${new Date().getFullYear()} UGI Corporation. All rights reserved.`}</p>
          <span>Engineered for a brighter tomorrow.</span>
          <Link href="/contact">Contact us <ArrowUpRight size={15} /></Link>
        </div>
      </div>
    </footer>
  );
}
