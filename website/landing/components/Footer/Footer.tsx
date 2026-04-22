import Image from "next/image";

import content from "../../website.config.json";

import { footerClassName, footerTextClassName } from "./Footer.css";

export const Footer: React.FC = () => {
  const { footer } = content;

  return (
    <footer aria-labelledby="footer-label" className={footerClassName}>
      <p className={footerTextClassName} id="footer-label">
        {footer.text}
      </p>
      <Image
        alt="CodeSandbox"
        height={32}
        src="/assets/logos/CodeSandbox.svg"
        width={198}
      />
    </footer>
  );
};
