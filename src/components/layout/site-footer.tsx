import React from "react";
import { PageContainer } from "@/components/layout/page-container";
import { NAV_LINKS, CONTACT_DATA } from "@/data/contact";
import { ArrowUp } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./../ui/icons";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <PageContainer>
        <div className="footer__top">
          <div className="footer__brand">
            <span className="footer__logo">Julio's</span>
            <p className="footer__tagline">Built with intention.</p>
          </div>

          <nav className="footer__nav" aria-label="Footer navigation">
            <ul className="footer__nav-list">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="footer__nav-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {currentYear} Julio Del Rosario
          </p>

          <div className="footer__actions">
            <div className="footer__socials">
              {CONTACT_DATA.socials.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__social-link"
                  aria-label={social.platform}
                >
                  {social.icon === "github" && <GithubIcon className="w-5 h-5" />}
                  {social.icon === "linkedin" && <LinkedinIcon className="w-5 h-5" />}
                </a>
              ))}
            </div>

            <a className="footer__back-to-top" href="#main-content" aria-label="Back to top">
              <span>Top</span>
              <ArrowUp className="w-4 h-4" />
            </a>
          </div>
        </div>
      </PageContainer>
    </footer>
  );
}
