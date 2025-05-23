module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          fs: false,
          path: require.resolve('path-browserify'),
          crypto: require.resolve('crypto-browserify'),
          stream: require.resolve('stream-browserify'),
          buffer: require.resolve('buffer/'),
        },
      },
    },
  },
};
