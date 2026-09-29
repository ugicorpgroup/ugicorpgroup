"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";

const videos = ["/video-1.mp4", "/video-2.mp4"];
const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeToMotion(callback) {
  const media = window.matchMedia(motionQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

export default function HeroVideoSlider({ poster, children }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(null);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState({});
  const reducedMotion = useSyncExternalStore(subscribeToMotion,
    () => window.matchMedia(motionQuery).matches, () => true);
  const isPaused = paused ?? reducedMotion;
  const section = useRef(null);
  const players = useRef([]);
  const progress = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(section.current);
    const onVisibility = () => {
      if (document.hidden) setVisible(false);
      else {
        const bounds = section.current.getBoundingClientRect();
        setVisible(bounds.bottom > 0 && bounds.top < window.innerHeight);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    players.current[active].currentTime = 0;
    progress.current?.style.setProperty("--progress", "0");
  }, [active]);

  useEffect(() => {
    let cancelled = false;
    players.current.forEach((video, index) => {
      if (index === active && !isPaused && visible) {
        video.play().catch(() => {
          if (!cancelled) setPaused(true);
        });
      } else video.pause();
    });
    return () => { cancelled = true; };
  }, [active, isPaused, visible]);

  const advance = (direction) => setActive((index) => (index + direction + videos.length) % videos.length);

  return (
    <section className="hero hero-video-slider" id="home" ref={section} aria-label="UGI Corporation highlights" aria-roledescription="carousel">
      <div className="hero-video-media" aria-hidden="true">
        <Image src={poster} alt="" fill sizes="100vw" preload className="hero-video-poster" />
        {videos.map((src, index) => (
          <video
            key={src}
            ref={(element) => { players.current[index] = element; }}
            className={`hero-video ${active === index && ready[index] ? "is-active" : ""}`}
            src={src}
            muted
            playsInline
            preload="metadata"
            disablePictureInPicture
            tabIndex={-1}
            onPlaying={() => setReady((previous) => ({ ...previous, [index]: true }))}
            onTimeUpdate={(event) => {
              if (index !== active) return;
              const video = event.currentTarget;
              const duration = Math.min(video.duration || 9, 9);
              progress.current?.style.setProperty("--progress", String(Math.min(video.currentTime / duration, 1)));
              if (video.currentTime >= duration && !isPaused && visible) advance(1);
            }}
            onEnded={() => { if (index === active && !isPaused && visible) advance(1); }}
            onError={() => { if (index === active) setPaused(true); }}
          />
        ))}
      </div>
      {children}
      <div className="hero-slider-controls" role="group" aria-label="Banner video controls">
        <button type="button" onClick={() => advance(-1)} aria-label="Previous video"><ArrowLeft size={17} /></button>
        <div className="hero-slider-pagination">
          {videos.map((src, index) => (
            <button key={src} type="button" aria-label={`Show video ${index + 1}`} aria-current={active === index ? "true" : undefined} onClick={() => setActive(index)}>
              {String(index + 1).padStart(2, "0")}
            </button>
          ))}
          <span className="hero-slider-progress" ref={progress}><span /></span>
        </div>
        <button type="button" onClick={() => advance(1)} aria-label="Next video"><ArrowRight size={17} /></button>
        <span className="hero-slider-divider" />
        <button type="button" onClick={() => setPaused(!isPaused)} aria-label={isPaused ? "Play banner videos" : "Pause banner videos"}>
          {isPaused ? <Play size={15} /> : <Pause size={15} />}
        </button>
      </div>
    </section>
  );
}
