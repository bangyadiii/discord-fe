/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        minimumCacheTTL: 5 * 60,
        remotePatterns: [
            {
                hostname: "utfs.io",
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
            },
        ],
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: [
                {
                    loader: "@svgr/webpack",
                    options: {
                        icon: true,
                    },
                },
            ],
        });

        return config;
    },
};

export default nextConfig;
