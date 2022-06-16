const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
module.exports = (env, argv) => {
  console.log(env);
  const mode = argv.mode; // argv prende tutti gli argomenti del tipo --mode production
  const environment = mode === "production" ? "production" : "develpoment";

  return {
    mode: environment,
    devtool: "inline-source-map",
    entry: {
      // app: "./app.ts",
      app: { import: "./app.ts", dependOn: "shared" },
      app2: { import: "./app2.ts", dependOn: "shared" },
      shared: {
        import: "./environment.ts",
      },
    },
    output: {
      filename: "[name].js",
      assetModuleFilename: "assets/[name][ext]",
      clean: true,
    },
    context: path.resolve(__dirname, "src/app"), //  da questa cartella inizia a cercare tutti i file con cui fare il bundle
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader", // questo è per caricare tutti i file ts
          exclude: /node_modules/,
        },
        {
          test: /\.(scss|css)$/,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
        },
        {
          test: /\.html$/i,
          loader: "html-loader",
        },
      ], // qui dentro metti tutti i file e come devono essere risolti,
    },
    devServer: {
      open: true,
      port: 4000,
      https: false,
      hot: true,
      historyApiFallback: true,
    },

    optimization: {
      runtimeChunk: 'single', //crea solo istanze singole di ogni modulo
      minimize: false,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
            keep_classnames: true,
            keep_fnames: true,
            sourceMap: false,
          },
          extractComments: false,
        }),
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: "../index.html",
      }),
    ],

    resolve: {
      extensions: [".ts", ".js"],
      alias: {
        // styles: path.resolve(__dirname, 'src/styles'), //dico a webpack che styles è l'equivalente di __dirname/src/styles
        // assets: path.resolve(__dirname, 'src/assets'), //dico a webpack che assets è l'equivalente di __dirname/src/assets
        // '~': path.resolve(__dirname, 'src/app') //dico a webpack che tilde è l'equivalente di __dirname/src/app
      },
      modules: ["node_modules"],
    },
  };
};
