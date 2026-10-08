"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, ClipboardList, Gauge, Flame, Factory, HardHat, PackageSearch, ShieldCheck } from "lucide-react";
import { services as fallbackServices } from "../content";

const serviceDetails = {
  "engineering-project-management": { icon: ClipboardList, description: "From feasibility studies to successful project delivery." },
  "asset-management": { icon: Gauge, description: "Improve reliability, performance and asset value." },
  "natural-gas-processing": { icon: Flame, description: "Safe, efficient solutions for gas processing facilities." },
  "oil-refinery-services": { icon: Factory, description: "Engineering and optimization for refinery operations." },
  "construction-management": { icon: HardHat, description: "Coordinated site execution, quality and safety." },
  "procurement-sourcing": { icon: PackageSearch, description: "The right equipment and materials for your project." },
};

export default function ServicesDropdown({ label, services, active, onNavigate }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const trigger = useRef(null);
  const items = services?.length ? services : fallbackServices;

  useEffect(() => {
    if (!open) return;
    const dismiss = (event) => {
      if (!root.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        if (root.current?.contains(document.activeElement)) trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  const navigate = () => { setOpen(false); onNavigate(); };

  return (
    <div
      ref={root}
      className="services-nav"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse" && window.matchMedia("(min-width: 1121px)").matches) setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse" && !root.current?.contains(document.activeElement)) setOpen(false);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button ref={trigger} type="button" className={`services-trigger ${active || open ? "active" : ""}`} aria-expanded={open} aria-controls="services-dropdown" onClick={() => setOpen(!open)}>
        {label}<ChevronDown size={13} aria-hidden="true" />
      </button>
      <div id="services-dropdown" className="services-dropdown" hidden={!open}>
        <div className="services-dropdown-grid">
          {items.map((item) => {
            const slug = item.slug || item.id;
            const detail = serviceDetails[slug];
            const Icon = detail?.icon || ClipboardList;
            const description = detail?.description || (Array.isArray(item.points) && item.points.slice(0, 2).join(" · ")) || item.summary || "Engineering expertise tailored to your project.";
            return (
              <Link className="service-menu-item" key={slug} href={slug ? `/services/${slug}` : "/services"} onClick={navigate}>
                <span className="service-menu-icon"><Icon size={21} strokeWidth={1.6} aria-hidden="true" /></span>
                <span className="service-menu-copy"><strong>{item.title}</strong><span>{description}</span></span>
              </Link>
            );
          })}
          <Link className="service-menu-item" href="/process-safety-management" onClick={navigate}>
            <span className="service-menu-icon"><ShieldCheck size={21} strokeWidth={1.6} aria-hidden="true" /></span>
            <span className="service-menu-copy"><strong>Process Safety Management</strong><span>Understand hazards. Protect people and operations.</span></span>
          </Link>
        </div>
        <aside className="services-dropdown-callout">
          <p className="services-callout-eyebrow">Not sure where to start?</p>
          <h2>Tell us about your project.</h2>
          <p>Share your scope or engineering challenge. Our team will help you find the right solution.</p>
          <Link className="services-callout-button" href="/contact" onClick={navigate}>Start a project <ArrowRight size={16} aria-hidden="true" /></Link>
          <Link className="services-view-all" href="/services" onClick={navigate}>View all services <ArrowRight size={14} aria-hidden="true" /></Link>
        </aside>
      </div>
    </div>
  );
}

