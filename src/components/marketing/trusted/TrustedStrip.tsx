import s from "./TrustedStrip.module.css";

const NAMES = ["GitHub", "Atlassian", "Zoom", "Salesforce", "HackerOne", "Databricks", "Expensify"];
const LOOP = [...NAMES, ...NAMES];

export function TrustedStrip() {
  return (
    <section className={s.trusted} aria-labelledby="trusted-heading">
      <p id="trusted-heading" className={s.label}>
        Trusted by security-conscious teams
      </p>
      <div className={s.trackOuter}>
        <div className={s.track}>
          {LOOP.map((name, i) => (
            <span key={`${name}-${i}`} className={s.item}>
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
