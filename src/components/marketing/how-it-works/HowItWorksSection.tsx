"use client";

import { useEffect, useState } from "react";
import s from "./HowItWorks.module.css";

const SECRET_LINES = [
  "AWS_ACCESS_KEY=AKIAIOSFODNN7",
  "DB_PASSWORD=super_secret_123",
  "STRIPE_KEY=sk_live_abc123xyz",
];

export function HowItWorksSection() {
  const [text, setText] = useState("");
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    const line = SECRET_LINES[lineIdx % SECRET_LINES.length];
    let t: ReturnType<typeof setTimeout>;
    if (charIdx <= line.length) {
      t = setTimeout(() => {
        setText(line.slice(0, charIdx));
        setCharIdx((c) => c + 1);
      }, 45 + Math.random() * 30);
      return () => clearTimeout(t);
    }
    t = setTimeout(() => {
      setLineIdx((i) => i + 1);
      setCharIdx(0);
    }, 800);
    return () => clearTimeout(t);
  }, [charIdx, lineIdx]);

  return (
    <section id="how-it-works" className={s.section}>
      <div className={s.inner}>
        <header className={s.head}>
          <h2>How Real-Time API Key &amp; Credential Detection Works</h2>
          <p>Three simple steps. Zero configuration. Your API keys, passwords, and secrets are protected the moment you install the SecureLint Chrome extension.</p>
        </header>

        <div className={s.grid}>
          <div className={s.step}>
            <div className={s.stepNum}>1</div>
            <div className={`${s.demoBox} ${s.demoFlex}`}>
              <div className={s.terminal}>
                {text}
                <span className={s.cursor}>|</span>
              </div>
            </div>
            <h3>Type or Paste in Any Web Editor</h3>
            <p>Start typing in any web editor — Gmail, Notion, GitHub, Slack, ChatGPT, or any textarea. SecureLint watches silently in the background.</p>
          </div>

          <div className={s.step}>
            <div className={s.stepNum}>2</div>
            <div className={`${s.demoBox} ${s.demoFlex}`}>
              {[
                { text: "AWS_KEY=AKIA...", chip: "Critical", cls: s.chipRed },
                { text: "STRIPE_SK=sk_live...", chip: "High", cls: s.chipOrange },
                { text: "DB_HOST=internal...", chip: "Medium", cls: s.chipAmber },
              ].map((row) => (
                <div key={row.text} className={s.rowLine}>
                  <span />
                  <span className={s.mono}>{row.text}</span>
                  <span className={row.cls}>{row.chip}</span>
                </div>
              ))}
            </div>
            <h3>Real-Time Secret &amp; Credential Detection</h3>
            <p>
              100+ patterns instantly scan for API keys, AWS credentials, JWT tokens, database passwords, and private keys — entirely in-browser. No data leaves your machine.
            </p>
          </div>

          <div className={s.step}>
            <div className={s.stepNum}>3</div>
            <div className={`${s.demoBox} ${s.demoFlex}`}>
              {[
                { key: "AWS_KEY", val: "AKIA████████XXXX" },
                { key: "STRIPE_SK", val: "sk_live_████████" },
                { key: "DB_HOST", val: "██████████████" },
              ].map((row) => (
                <div key={row.key} className={s.maskRow}>
                  <span className={s.check}>✓</span>
                  <span className={s.key}>{row.key}</span>
                  <span className={s.mono}> = </span>
                  <span className={s.val}>{row.val}</span>
                </div>
              ))}
            </div>
            <h3>Instant Masking — Secrets Never Leave Your Browser</h3>
            <p>Detected credentials are masked in real-time. Your API keys, passwords, and tokens stay 100% local — zero data sent to any server.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
