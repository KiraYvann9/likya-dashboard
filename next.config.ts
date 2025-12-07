import type { NextConfig } from "next";

const withPWA = require("@ducanh2912/next-pwa").default({
    dest: "public",


    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    swcMinify: true,
    disable: false,

});

const nextConfig: NextConfig = withPWA({
    /* config options here */
    reactStrictMode: false,
    // turbo: {},
});

export default nextConfig;
