export function PageHoverStyles() {
  return (
    <style>{`
      .sl-btn-primary {
        transition: all 0.25s ease !important;
      }
      .sl-btn-primary:hover {
        background: #22b6a1 !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 16px 36px rgba(40,204,181,0.40) !important;
      }
      .sl-btn-secondary {
        transition: background 0.25s ease !important;
      }
      .sl-btn-secondary:hover {
        background: rgba(255,255,255,0.12) !important;
      }
      .sl-hover-card {
        transition: transform 0.25s ease, box-shadow 0.25s ease !important;
      }
      .sl-hover-card:hover {
        transform: translateY(-6px) !important;
        box-shadow: 0 16px 40px rgba(0,0,0,0.28) !important;
      }
      .sl-faq-card {
        transition: border-color 0.25s ease, box-shadow 0.25s ease !important;
      }
      .sl-faq-card:hover {
        border-color: rgba(40,204,181,0.30) !important;
        box-shadow: 0 4px 20px rgba(0,0,0,0.18) !important;
      }
      .sl-provider-card {
        transition: transform 0.25s ease, box-shadow 0.25s ease !important;
      }
      .sl-provider-card:hover {
        transform: translateY(-4px) !important;
        box-shadow: 0 10px 28px rgba(0,0,0,0.22) !important;
      }
      .sl-platform-pill {
        transition: transform 0.2s ease, background 0.2s ease !important;
      }
      .sl-platform-pill:hover {
        transform: translateY(-3px) !important;
        background: rgba(139,92,246,0.12) !important;
      }
      .sl-link-pill {
        transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease !important;
      }
      .sl-link-pill:hover {
        transform: translateY(-3px) !important;
        box-shadow: 0 8px 24px rgba(0,0,0,0.22) !important;
      }
      .sl-problem-item {
        transition: transform 0.25s ease, box-shadow 0.25s ease !important;
      }
      .sl-problem-item:hover {
        transform: translateX(4px) !important;
        box-shadow: 0 8px 28px rgba(0,0,0,0.18) !important;
      }
      .sl-pricing-card {
        transition: transform 0.25s ease !important;
      }
      .sl-pricing-card:hover {
        transform: translateY(-4px) !important;
      }
      .sl-scenario-card {
        transition: border-color 0.25s ease, box-shadow 0.25s ease !important;
      }
      .sl-scenario-card:hover {
        border-color: rgba(40,204,181,0.30) !important;
        box-shadow: 0 6px 24px rgba(0,0,0,0.18) !important;
      }
    `}</style>
  );
}
