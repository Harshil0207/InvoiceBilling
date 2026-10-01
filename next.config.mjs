/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  output: "export",
  images: {
    unoptimized: true,
  },
  compiler: {
    styledComponents: {
      displayName: true, // Shows component name in DevTools: "BillingForm__Section-sc-xxx"
      ssr: true, // Required for SSR/Next.js
      fileName: true, // Includes the filename prefix in the class name
      meaningfulLabel: true, // Uses the variable name as the label
      minify: false, // Keep readable class names in dev
    },
  },
};

export default nextConfig;
