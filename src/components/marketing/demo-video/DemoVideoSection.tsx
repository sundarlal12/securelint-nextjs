"use client";

import { useState } from "react";
import s from "./DemoVideo.module.css";

const YT_ID = "SHK2mkos8Co";

export function DemoVideoSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className={s.section}>
      <div className={s.inner}>
        <div className={s.head}>
          <div className={s.overline}>Watch it work</div>
          <h2 className={s.h2}>
            See SecureLint catch threats —{" "}
            <em className={s.italic}>in real time.</em>
          </h2>
        </div>

        <div className={s.frame}>
          {playing ? (
            <iframe
              className={s.iframe}
              src={`https://www.youtube-nocookie.com/embed/${YT_ID}?autoplay=1&rel=0`}
              title="SecureLint demo video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              className={s.facade}
              onClick={() => setPlaying(true)}
              aria-label="Play SecureLint demo video"
            >
              <img
                className={s.thumb}
                src={`https://img.youtube.com/vi/${YT_ID}/maxresdefault.jpg`}
                alt="SecureLint demo video thumbnail"
                loading="lazy"
              />
              <span className={s.scrim} aria-hidden="true" />
              <span className={s.playBtn} aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M6 4.5v15l14-7.5-14-7.5z" fill="#fff" />
                </svg>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
