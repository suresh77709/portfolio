import React from "react";
import {
  TypographySettings,
  buildGoogleFontsUrl,
  getFontFamilyCss,
} from "@/data/fonts";

interface TypographyStylesProps {
  settings: TypographySettings;
}

export function TypographyStyles({ settings }: TypographyStylesProps) {
  const googleFontsUrl = buildGoogleFontsUrl(settings);
  const globalFont = settings.globalFont || "default";

  const getCssFamily = (fontId: string) => getFontFamilyCss(fontId, globalFont);

  const heroFont = getCssFamily(settings.heroTitle?.fontFamily || "default");
  const sectionFont = getCssFamily(settings.sectionHeadings?.fontFamily || "default");
  const bodyFont = getCssFamily(settings.bodyText?.fontFamily || "default");
  const navFont = getCssFamily(settings.navigation?.fontFamily || "default");
  const btnFont = getCssFamily(settings.buttons?.fontFamily || "default");
  const portTitleFont = getCssFamily(settings.portfolioTitles?.fontFamily || "default");
  const portDescFont = getCssFamily(settings.portfolioDescriptions?.fontFamily || "default");
  const labelFont = getCssFamily(settings.labels?.fontFamily || "default");
  const footerFont = getCssFamily(settings.footer?.fontFamily || "default");
  const displayFont = getCssFamily(settings.specialDisplay?.fontFamily || "default");

  const css = `
    :root {
      --font-global-custom: ${getCssFamily(globalFont)};

      --font-hero-title: ${heroFont};
      --weight-hero-title: ${settings.heroTitle?.fontWeight || 700};
      --spacing-hero-title: ${settings.heroTitle?.letterSpacing ?? -0.02}em;
      --leading-hero-title: ${settings.heroTitle?.lineHeight ?? 0.95};

      --font-section-heading: ${sectionFont};
      --weight-section-heading: ${settings.sectionHeadings?.fontWeight || 700};
      --spacing-section-heading: ${settings.sectionHeadings?.letterSpacing ?? -0.02}em;
      --leading-section-heading: ${settings.sectionHeadings?.lineHeight ?? 1.05};

      --font-body-text: ${bodyFont};
      --weight-body-text: ${settings.bodyText?.fontWeight || 400};
      --spacing-body-text: ${settings.bodyText?.letterSpacing ?? 0}em;
      --leading-body-text: ${settings.bodyText?.lineHeight ?? 1.6};

      --font-nav: ${navFont};
      --weight-nav: ${settings.navigation?.fontWeight || 500};
      --spacing-nav: ${settings.navigation?.letterSpacing ?? 0.05}em;

      --font-btn: ${btnFont};
      --weight-btn: ${settings.buttons?.fontWeight || 600};
      --spacing-btn: ${settings.buttons?.letterSpacing ?? 0.08}em;

      --font-portfolio-title: ${portTitleFont};
      --weight-portfolio-title: ${settings.portfolioTitles?.fontWeight || 600};
      --spacing-portfolio-title: ${settings.portfolioTitles?.letterSpacing ?? -0.01}em;

      --font-portfolio-desc: ${portDescFont};
      --weight-portfolio-desc: ${settings.portfolioDescriptions?.fontWeight || 400};
      --leading-portfolio-desc: ${settings.portfolioDescriptions?.lineHeight ?? 1.5};

      --font-label: ${labelFont};
      --weight-label: ${settings.labels?.fontWeight || 500};
      --spacing-label: ${settings.labels?.letterSpacing ?? 0.1}em;

      --font-footer: ${footerFont};
      --weight-footer: ${settings.footer?.fontWeight || 400};

      --font-display: ${displayFont};
      --weight-display: ${settings.specialDisplay?.fontWeight || 800};
    }

    .font-hero-title {
      font-family: var(--font-hero-title, inherit) !important;
      font-weight: var(--weight-hero-title, inherit) !important;
      letter-spacing: var(--spacing-hero-title, inherit) !important;
      line-height: var(--leading-hero-title, inherit) !important;
    }
    .font-section-heading {
      font-family: var(--font-section-heading, inherit) !important;
      font-weight: var(--weight-section-heading, inherit) !important;
      letter-spacing: var(--spacing-section-heading, inherit) !important;
      line-height: var(--leading-section-heading, inherit) !important;
    }
    .font-body-text {
      font-family: var(--font-body-text, inherit) !important;
      font-weight: var(--weight-body-text, inherit) !important;
      line-height: var(--leading-body-text, inherit) !important;
    }
    .font-nav {
      font-family: var(--font-nav, inherit) !important;
      font-weight: var(--weight-nav, inherit) !important;
      letter-spacing: var(--spacing-nav, inherit) !important;
    }
    .font-btn {
      font-family: var(--font-btn, inherit) !important;
      font-weight: var(--weight-btn, inherit) !important;
      letter-spacing: var(--spacing-btn, inherit) !important;
    }
    .font-portfolio-title {
      font-family: var(--font-portfolio-title, inherit) !important;
      font-weight: var(--weight-portfolio-title, inherit) !important;
      letter-spacing: var(--spacing-portfolio-title, inherit) !important;
    }
    .font-portfolio-desc {
      font-family: var(--font-portfolio-desc, inherit) !important;
      font-weight: var(--weight-portfolio-desc, inherit) !important;
      line-height: var(--leading-portfolio-desc, inherit) !important;
    }
    .font-label {
      font-family: var(--font-label, inherit) !important;
      font-weight: var(--weight-label, inherit) !important;
      letter-spacing: var(--spacing-label, inherit) !important;
    }
    .font-footer {
      font-family: var(--font-footer, inherit) !important;
      font-weight: var(--weight-footer, inherit) !important;
    }
    .font-display {
      font-family: var(--font-display, inherit) !important;
      font-weight: var(--weight-display, inherit) !important;
    }
  `;

  return (
    <>
      {googleFontsUrl && (
        <>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link rel="stylesheet" href={googleFontsUrl} />
        </>
      )}
      <style dangerouslySetInnerHTML={{ __html: css }} />
    </>
  );
}
