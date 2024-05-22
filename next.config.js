const { type } = require('os')

/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {nextConfig,
    typescript: {
        ignoreBuildErrors: true,
    },
}