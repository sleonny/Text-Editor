const HtmlWebpackPlugin = require("html-webpack-plugin"); // Helps in creating HTML files
const WebpackPwaManifest = require("webpack-pwa-manifest"); // Helps in creating manifest for PWA (Progressive Web App)
const path = require("path"); // Built-in Node.js module to work with file paths
const { InjectManifest } = require("workbox-webpack-plugin"); // Helps in handling service worker files for caching

module.exports = () => {
  return {
    mode: "development", // Specifies development mode (other option could be "production")
    entry: {
      // Entry points for various JavaScript files
      main: "./src/js/index.js",
      install: "./src/js/install.js",
      database: "./src/js/database.js",
      editor: "./src/js/editor.js",
      header: "./src/js/header.js",
    },
    output: {
      // Configuration for output files
      filename: "[name].bundle.js", // Specifies naming pattern for the output files
      path: path.resolve(__dirname, "dist"), // Sets the output directory as "dist" folder
    },
    plugins: [
      // Array of plugins used
      new HtmlWebpackPlugin({
        // Plugin to create an HTML file
        template: "./index.html", // Template file to use
        title: "Just Another Text Editor", // Title for the HTML document
      }),
      new InjectManifest({
        // Plugin to handle service worker
        swSrc: "./src-sw.js", // Source file for service worker
        swDest: "src-sw.js", // Destination file for service worker
      }),
      new WebpackPwaManifest({
        // Plugin to create a manifest for PWA
        fingerprints: false,
        inject: true,
        name: "Just Another Text Editor", // Full name of the app
        short_name: "JATE", // Short name of the app
        description: "Just Another Text Editor", // Description of the app
        background_color: "#710C04", // Background color
        start_url: "/", // Starting URL when the app is opened
        publicPath: "/", // Public path

        // Icon settings for different sizes
        icons: [
          {
            src: path.resolve("src/images/logo.png"), // Source image for the icons
            sizes: [96, 128, 192, 256, 384, 512], // Sizes for the icons
            destination: path.join("icons"), // Destination folder for the icons
          },
        ],
      }),
    ],

    module: {
      rules: [
        // Rules for processing different types of files
        { test: /\.css$/i, use: ["style-loader", "css-loader"] }, // Handling CSS files
        {
          test: /\.js$/, // Handling JavaScript files
          exclude: /node_modules/, // Excluding files in the "node_modules" folder
          use: {
            loader: "babel-loader", // Using Babel to transpile ES6 code
            options: {
              presets: ["@babel/preset-env"], // Using preset for latest JavaScript features
              plugins: [
                // Additional plugins for Babel
                "@babel/plugin-proposal-object-rest-spread",
                "@babel/transform-runtime",
              ],
            },
          },
        },
      ],
    },
  };
};
