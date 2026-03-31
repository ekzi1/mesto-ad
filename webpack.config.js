const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

require("dotenv").config({ path: path.resolve(__dirname, ".env") });

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
      // В dev — абсолютный путь, чтобы с localhost всегда подтягивался память-бандл, а не старый dist
      publicPath: isProduction ? "./" : "/",
    },
    devtool: isProduction ? false : "source-map",
    devServer: {
      // Не раздаём папку dist с диска: там может лежать старый index.html без актуального JS/CSS
      static: false,
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
      new webpack.DefinePlugin({
        "process.env.MESTO_COHORT": JSON.stringify(
          process.env.MESTO_COHORT || ""
        ),
        "process.env.MESTO_TOKEN": JSON.stringify(
          process.env.MESTO_TOKEN || ""
        ),
      }),
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
