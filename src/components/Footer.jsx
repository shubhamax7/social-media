import { FiGithub, FiTwitter, FiLinkedin, FiInstagram } from "react-icons/fi";
import { RiSparklingFill } from "react-icons/ri";

const currentYear = new Date().getFullYear();

const Footer = () => (
  <footer className="app-footer">
    <div className="footer-inner">
      <div className="footer-brand">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <RiSparklingFill style={{ color: "var(--color-accent-primary)", fontSize: "20px" }} />
          <span className="footer-brand-name">SocialSphere</span>
        </div>
        <span className="footer-brand-tagline">
          Connect, share, and discover with your community.
        </span>
      </div>

      <div className="footer-social">
        {[
          { Icon: FiGithub,    href: "https://github.com",    label: "GitHub"    },
          { Icon: FiTwitter,   href: "https://twitter.com",   label: "Twitter"   },
          { Icon: FiLinkedin,  href: "https://linkedin.com",  label: "LinkedIn"  },
          { Icon: FiInstagram, href: "https://instagram.com", label: "Instagram" },
        ].map(({ Icon, href, label }) => (
          <a
            key={label}
            href={href}
            className="footer-social-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
          >
            <Icon />
          </a>
        ))}
      </div>
    </div>

    <div className="footer-bottom">
      <p className="footer-copyright">
        &copy; {currentYear} SocialSphere, Inc. All rights reserved.
      </p>
      <nav className="footer-links" aria-label="Footer navigation">
        {["Privacy", "Terms", "Cookies", "About"].map((link) => (
          <a key={link} href="#" className="footer-link">
            {link}
          </a>
        ))}
      </nav>
    </div>
  </footer>
);

export default Footer;
