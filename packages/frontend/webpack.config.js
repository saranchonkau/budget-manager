const path = require("path");
const ForkTsCheckerPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ESBuildMinifyPlugin } = require("esbuild-loader");

const jsxPluginReact17 = {
  name: "jsx-react-17",
  setup(build) {
    const fs = require("fs");
    const babel = require("@babel/core");
    const plugin = require("@babel/plugin-transform-react-jsx").default(
      {},
      { runtime: "automatic" }
    );

    build.onLoad({ filter: /\.jsx$/ }, async (args) => {
      const jsx = await fs.promises.readFile(args.path, "utf8");
      const result = babel.transformSync(jsx, { plugins: [plugin] });
      return { contents: result.code };
    });
  },
};
const esbuild = {
  test: /\.(js|jsx|ts|tsx)?$/,
  loader: "esbuild-loader",
  options: {
    loader: "tsx",
    target: "es2020",
  },
  exclude: /node_modules/,
};

const svg = {
  test: /\.svg$/,
  issuer: /\.[jt]sx?$/,
  use: [
    {
      loader: "@svgr/webpack",
      options: {
        native: true,
      },
    },
  ],
};

const css = {
  test: /\.css$/i,
  use: ["style-loader", "css-loader"],
};

const images = {
  test: /\.(png|svg|jpg|jpeg|gif)$/i,
  type: "asset/resource",
};

const fonts = {
  test: /\.(woff|woff2|eot|ttf|otf)$/i,
  type: "asset/resource",
};

// Environment config
const isDevelopment = process.env.NODE_ENV !== "production";
const mode = isDevelopment ? "development" : "production";

module.exports = {
  mode: "production",
  target: ["web", "es2020"],
  entry: "./src/index.tsx",
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devServer: {
    static: "./dist",
  },
  stats: "errors-only",
  module: {
    rules: [esbuild, svg, css, images, fonts],
  },
  plugins: [
    new ForkTsCheckerPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./public/index.html"),
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json"],
  },
};
