/* eslint-disable @typescript-eslint/no-explicit-any */
import lazy from "next/dynamic";
import React from "react";

import { styled } from "../../styles/styled";

import { illustrationWrapperClassName } from "./ExampleIllustration.css";

const ClientIllustration = lazy(import("./illustrations/Client/Client"), {
  ssr: false,
}) as any;

const ComponentsIllustration = lazy(
  import("./illustrations/Components/Components"),
  {
    ssr: false,
  }
) as any;

const ProviderIllustration = lazy(import("./illustrations/Provider/Provider"), {
  ssr: false,
}) as any;

const IllustrationWrapper = styled<"div", { visible?: boolean }>(
  "div",
  illustrationWrapperClassName,
);

interface ExampleIllustrationProps {
  illustrationKey: string;
  visible: boolean;
}
export const ExampleIllustration: React.FC<ExampleIllustrationProps> = ({
  illustrationKey,
  visible,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const illustrations: any = {
    providers: <ProviderIllustration isActive={visible} />,
    components: <ComponentsIllustration isActive={visible} />,
    client: <ClientIllustration isActive={visible} />,
  };

  return (
    <IllustrationWrapper visible={visible}>
      {illustrations[illustrationKey]}
    </IllustrationWrapper>
  );
};
