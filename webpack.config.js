const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    entry: "./src/scripts/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProduction
        ? "scripts/[name].[contenthash].js"
        : "scripts/[name].js",
      clean: true,
      assetModuleFilename: "assets/[name].[hash][ext]",
      publicPath: "./",
    },
    devtool: isProduction ? false : "source-map",
    devServer: {
      static: path.resolve(__dirname, "dist"),
      open: true,
      hot: true,
      port: 8080,
      historyApiFallback: true,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        {
          test: /\.css$/i,
          use: [
            isProduction
              ? MiniCssExtractPlugin.loader
              : "style-loader",
            "css-loader",
            "postcss-loader",
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|webp|woff2?)$/i,
          type: "asset/resource",
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./index.html",
      }),
      ...(isProduction
        ? [
            new MiniCssExtractPlugin({
              filename: "styles/[name].[contenthash].css",
            }),
          ]
        : []),
    ],
  };
};
