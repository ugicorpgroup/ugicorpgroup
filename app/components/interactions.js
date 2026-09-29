"use client";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();
  useLayoutEffect(() => {
    if (window.location.hash) return;

    const resetScroll = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    resetScroll();
    // Finish after the router's layout effects so its scroll handling cannot
    // override the new page's starting position.
    const frame = window.requestAnimationFrame(resetScroll);
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);
  return null;
}
export function Header({ settings = {} }) {
  settings = settings || {};
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const defaultLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Projects", href: "/projects" },
    { label: "Process Safety Management", href: "/process-safety-management" },
    { label: "News", href: "/news" },
    { label: "Careers", href: "/careers" },
  ];
  const configuredLinks = settings.navigation?.filter((link) => !link.isButton);
  const links = configuredLinks?.length ? configuredLinks : defaultLinks;
  const buttonLink = settings.navigation?.find((link) => link.isButton);
  const email = settings.email || "contact@ugicorpgroup.com";
  const phone = settings.phone || "+1 (647) 213-2228";
  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);
  return (
    <header className="header">
      <div className="header-utility">
        <div className="header-utility-inner">
          <span className="utility-location"><MapPin size={13} /> Canada head office <span className="utility-divider" /> Engineering worldwide</span>
          <div className="utility-contact">
            <a href={`mailto:${email}`}><Mail size={13} /> {email}</a>
            <span className="utility-divider" />
            <a href={`tel:${phone.replace(/[^+\d]/g, "")}`}><Phone size={13} /> {phone}</a>
          </div>
        </div>
      </div>
      <div className="header-main">
        <div className="header-inner">
          <Link href="/" className="brand" aria-label="UGI Corporation home" onClick={() => setOpen(false)}>
            <span className="brand-image"><Image src="/logo.jpeg" alt="UGI Corporation" width={118} height={70} priority /></span>
          </Link>
          <button className="menu-toggle" type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
          <nav id="main-navigation" className={`navigation ${open ? "is-open" : ""}`} aria-label="Main navigation">
            <div className="nav-links">
              {links.map(({ label, href }) => (
                <Link key={href} href={href} className={pathname === href ? "active" : ""} aria-current={pathname === href ? "page" : undefined} onClick={() => setOpen(false)}>{label}</Link>
              ))}
            </div>
            <Link href={buttonLink?.href || "/contact"} className={`nav-contact ${pathname === (buttonLink?.href || "/contact") ? "active" : ""}`} onClick={() => setOpen(false)}><span>{buttonLink?.label || "Start a project"}</span><ArrowUpRight size={18} /></Link>
            <div className="nav-mobile-contact"><a href={`mailto:${email}`}><Mail size={16} />{email}</a><a href={`tel:${phone.replace(/[^+\d]/g, "")}`}><Phone size={16} />{phone}</a></div>
          </nav>
        </div>
      </div>
    </header>
  );
}
export function DetailButton({
  title,
  description,
  children,
  className,
  label,
  reveal = false,
}) {
  const dialog = useRef(null);
  return (
    <>
      <button
        type="button"
        className={className}
        aria-label={label}
        data-reveal={reveal ? "" : undefined}
        onClick={() => dialog.current?.showModal()}
      >
        {children}
      </button>
      <dialog
        ref={dialog}
        className="detail-dialog"
        aria-label={title}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current.close();
        }}
      >
        <button
          className="dialog-close"
          aria-label="Close details"
          onClick={() => dialog.current.close()}
        >
          <X />
        </button>
        <p className="eyebrow">UGI Corporation</p>
        <h2>{title}</h2>
        <p>{description}</p>
        <a
          className="button"
          href="mailto:contact@ugicorpgroup.com?subject=UGI%20Inquiry"
        >
          Talk to Our Team <ArrowRight size={18} />
        </a>
      </dialog>
    </>
  );
}
export function ScrollAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      if (document.querySelector("[data-hero]")) {
        gsap.from("[data-hero]", {
          y: 22,
          opacity: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: "power2.out",
          clearProps: "all",
        });
      }
      gsap.utils.toArray("[data-reveal]").forEach((element) => {
        gsap.from(element, {
          y: 25,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          clearProps: "all",
          scrollTrigger: { trigger: element, start: "top 94%", once: true },
        });
      });
      if (document.querySelector(".hero-photo")) {
        gsap.to(".hero-photo", {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    });
    return () => media.revert();
  }, []);
  return null;
}
