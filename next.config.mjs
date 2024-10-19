/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
      },
    env: {
      NEXT_PUBLIC_AWS_BUCKET_REGION: process.env.NEXT_PUBLIC_AWS_BUCKET_REGION,
      NEXT_PUBLIC_ACCESS_KEY_ID: process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
      NEXT_PUBLIC_SECRET_ACCESS_KEY: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY,
    },
};

export default nextConfig;
