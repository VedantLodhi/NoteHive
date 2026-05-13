import React from "react";

/**
 * Consistent page wrapper: responsive padding, optional editorial header.
 */
export default function PageLayout({ eyebrow, title, subtitle, children, className = "" }) {
  return (
    <div className={`w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 ${className}`}>
      {(eyebrow || title || subtitle) && (
        <header className="mb-10 md:mb-12">
          {eyebrow && (
            <p className="text-xs sm:text-sm font-sans font-semibold uppercase tracking-[0.22em] text-nh-muted mb-3">
              {eyebrow}
            </p>
          )}
          {title && (
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-nh-text text-balance">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="mt-4 text-base sm:text-lg text-nh-muted max-w-2xl leading-relaxed">{subtitle}</p>
          )}
          <div className="nh-divider mt-8 max-w-md" />
        </header>
      )}
      {children}
    </div>
  );
}
