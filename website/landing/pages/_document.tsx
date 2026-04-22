import { getSandpackCssText } from "@codesandbox/sandpack-react";
import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import React from "react";

import { themeClass } from "../styles/vars.css";

export default class Document extends NextDocument {
  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
          <style
            dangerouslySetInnerHTML={{ __html: getSandpackCssText() }}
            id="sandpack"
          />
        </Head>
        <body className={themeClass}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
