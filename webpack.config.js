const path = require("path")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HTMLWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

module.exports = (env) => {
  const optimization = env.production
    ? {
        splitChunks: {
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendor",
              chunks: "all",
            },
            styles: {
              test: /\.css$/,
              name: "style",
              chunks: "all",
            },
          },
        },
      }
    : {}

  return {
    mode: env.production ? "production" : "development",
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "build"),
      filename: env.production ? "[id].[hash].bundle.js" : "[name].bundle.js",
      chunkFilename: env.production
        ? "[id].[hash].bundle.js"
        : "[name].bundle.js",
    },
    node: {
      fs: "empty",
    },
    devtool: env.production ? "none" : "inline-source-map",
    devServer: env.development && {
      contentBase: "./build",
      hot: true,
      compress: true,
      port: 3000,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: env.production ? "[id].[contenthash].css" : "[name].css",
        chunkFilename: env.production ? "[id].[contenthash].css" : "[name].css",
        ignoreOrder: false,
      }),
      new CleanWebpackPlugin(),
      new HTMLWebpackPlugin({
        template: "./public/index.html",
      }),
    ],
    optimization,
  }
}
