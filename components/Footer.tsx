
import { GitBranch, Globe, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="section-wrap footer-bottom">
      <a className="wordmark" href="#top">
        AM<span>.</span>
      </a>

      <p>
        DESIGNED & BUILT WITH INTENTION.
        <br />
        © 2026 ASHISH MEWADA
      </p>

      <div className="social-links">
        <a
          href="https://github.com/ashishpatel3630-art"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
        >
          <GitBranch size={17} />
        </a>

        <a
          href="https://linkedin.com/in/ashish-mewada-0499ba379"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
        >
          <Globe size={17} />
        </a>

        <a
          href="mailto:ashishpatel3630@gmail.com"
          aria-label="Email"
        >
          <Mail size={17} />
        </a>
      </div>

      <a href="#top" className="back-top">
        BACK TO TOP ↑
      </a>
    </footer>
  );
}
