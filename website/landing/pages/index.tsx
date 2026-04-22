import type { NextPage } from "next";
import Head from "next/head";

import { AdvancedUsage } from "../components/AdvancedUsage";
import { Banner } from "../components/Banner";
import { Community } from "../components/Community";
import { Features } from "../components/Features";
import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { Intro } from "../components/Intro";
import { Showcase } from "../components/Showcase";
import { Users } from "../components/Users";
import { ClipboardProvider } from "../components/common";
import { styled } from "../styles/styled";
import content from "../website.config.json";

import { containerClassName, mainClassName } from "../styles/indexPage.css";

const DEFAULT_HOST = "https://sandpack.codesandbox.io";

const Container = styled("section", containerClassName);

const Main = styled("main", mainClassName);

interface HomeProps {
  host: string | undefined;
}
const Home: NextPage<HomeProps> = () => {
  const { global, meta } = content;

  return (
    <Container>
      <Head>
        <title>{global.title}</title>
        <meta content={global.description} name="description" />
        <link href="/favicon.ico" rel="icon" />

        {/* Open Graph */}
        {meta.map(({ name, value }) => {
          let content = value;

          if (name === "og:url") {
            content = DEFAULT_HOST;
          } else if (name === "og:image") {
            content = `${DEFAULT_HOST}/${content}`;
          }

          return <meta key={name} content={content} name={name} />;
        })}
      </Head>

      <ClipboardProvider>
        <Main>
          <Hero />
          <Features />
          <Intro />
          <AdvancedUsage />
          <Showcase />
          <Users />
          <Banner />
          <Community />
        </Main>
        <Footer />
      </ClipboardProvider>
    </Container>
  );
};

export default Home;
