"use client";
import { useEffect } from "react";

/**
 * Drop this inside any layout to fully suppress the StartupBar widget.
 * On unmount (navigation away) everything is restored automatically.
 */
export function HideStartupBar() {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    function suppress() {
      // Hide the iframe itself
      const iframe = document.querySelector<HTMLIFrameElement>(
        'iframe[title="StartupBar"]'
      );
      if (iframe) iframe.style.setProperty("display", "none", "important");

      // Collapse the space it occupies
      root.style.setProperty("--sb-height", "0px");
      root.style.scrollPaddingTop = "0px";

      // Remove the body padding the loader injected
      const pad = parseFloat(getComputedStyle(body).paddingTop) || 0;
      if (pad > 0) body.style.paddingTop = "0px";
    }

    // Run immediately and once more after a short delay in case the
    // StartupBar hasn't injected yet when this layout mounts.
    suppress();
    const t1 = setTimeout(suppress, 200);
    const t2 = setTimeout(suppress, 800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);

      // Restore the iframe
      const iframe = document.querySelector<HTMLIFrameElement>(
        'iframe[title="StartupBar"]'
      );
      if (iframe) iframe.style.removeProperty("display");

      // Let the CSS rule in globals.css take over again
      root.style.removeProperty("--sb-height");

      // Restore scroll padding if the bar is still injected
      const barHeight =
        root.getAttribute("data-startupbar-injected") === "1" ? 36 : 0;
      root.style.scrollPaddingTop = barHeight ? "36px" : "";
      body.style.paddingTop = barHeight ? "36px" : "";
    };
  }, []);

  return null;
}
