/* eslint-disable @typescript-eslint/no-var-requires */
const { createVanillaExtractPlugin } = require("@vanilla-extract/next-plugin");

const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
module.exports = withVanillaExtract({
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.woff/,
      use: {
        loader: "url-loader",
      },
    });

    return config;
  },
});
