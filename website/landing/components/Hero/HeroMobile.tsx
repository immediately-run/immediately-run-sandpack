import {
  Clipboard,
  Resources,
  SandpackLogo,
  SandpackPreview,
} from "../common";

import {
  heroLogoColumnClassName,
  heroLogoSizerClassName,
  heroPreviewWrapperClassName,
  heroSectionClassName,
  heroSubtitleClassName,
  heroTitleClassName,
  heroTitleColumnClassName,
} from "./HeroMobile.css";

export const HeroMobile: React.FC = () => {
  return (
    <section className={heroSectionClassName}>
      <div className={heroLogoColumnClassName}>
        <div className={heroLogoSizerClassName}>
          <SandpackLogo theme="light" />
        </div>
        <div className={heroTitleColumnClassName}>
          <h1 className={heroTitleClassName}>Sandpack</h1>
          <p className={heroSubtitleClassName}>
            Run any JavaScript and Node.js app
            <br /> in any browser,
            <br />
            powered by CodeSandbox.
          </p>
        </div>
      </div>
      <Clipboard />
      <Resources />
      <div className={heroPreviewWrapperClassName}>
        <SandpackPreview />
      </div>
    </section>
  );
};
