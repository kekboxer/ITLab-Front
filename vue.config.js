module.exports = {
  productionSourceMap: false,
  configureWebpack: (config) => {
    optimization: {
      splitChunks: {
        chunks: 'all';
      }
    }
  }
};
