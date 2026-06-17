"use client";
import { useState } from "react";
import Link from "next/link";
import type { Post } from "./posts-data";
import s from "./Blog.module.css";

export function BlogCard({ post }: { post: Post }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [navigating, setNavigating] = useState(false);

  const hasImage = "imageCover" in post && post.imageCover;
  const imageCover = hasImage ? (post as Post & { imageCover: string }).imageCover : "";
  // Animated SVGs must be embedded via <object> — <img> renders SMIL animations as static
  const isAnimatedSvg = imageCover.endsWith(".svg");

  return (
    <article className={s.card}>

      {/* Cover */}
      <Link
        href={`/blog/${post.slug}`}
        className={s.coverWrap}
        tabIndex={-1}
        aria-hidden="true"
        onClick={() => setNavigating(true)}
      >
        {/* Navigation spinner — shown when user clicks */}
        {navigating && (
          <span className={s.navSpinner} aria-hidden="true" />
        )}

        {hasImage ? (
          <>
            {!imgLoaded && <span className={s.imgSpinner} aria-hidden="true" />}
            {isAnimatedSvg ? (
              /* <object> is required for SMIL <animate>/<animateTransform> to play.
                 pointer-events:none lets clicks pass through to the parent <Link>. */
              <object
                data={imageCover}
                type="image/svg+xml"
                aria-label={post.title}
                className={s.coverImg}
                style={{ opacity: imgLoaded ? 1 : 0, transition: "opacity .3s ease", pointerEvents: "none" }}
                onLoad={() => setImgLoaded(true)}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageCover}
                alt={post.title}
                className={s.coverImg}
                style={{ opacity: imgLoaded ? 1 : 0, transition: "opacity .3s ease" }}
                onLoad={() => setImgLoaded(true)}
              />
            )}
          </>
        ) : (
          <div className={s.cover} style={{ background: post.gradient }}>
            <span className={s.deco1} style={{ background: post.accentColor }} />
            <span className={s.deco2} style={{ background: post.accentColor }} />
            <div className={s.coverTextWrap}>
              {post.shortTitle.split("\n").map((line, i) => (
                <span
                  key={i}
                  className={s.coverLine}
                  style={i === 1 ? { color: post.accentColor } : undefined}
                >
                  {line}
                </span>
              ))}
            </div>
          </div>
        )}
      </Link>

      {/* Body */}
      <div className={s.cardBody}>
        <div className={s.meta}>
          <time dateTime={post.date}>{post.dateLabel}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readTime}</span>
        </div>

        <h2 className={s.cardTitle}>
          <Link
            href={`/blog/${post.slug}`}
            className={s.cardLink}
            onClick={() => setNavigating(true)}
          >
            {post.title}
          </Link>
        </h2>

        <p className={s.excerpt}>{post.excerpt}</p>
      </div>

    </article>
  );
}
