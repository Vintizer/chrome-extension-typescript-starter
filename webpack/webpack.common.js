const ZipPlugin = require('zip-webpack-plugin');
const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src");

const fs = require('fs');
const filePath = path.join(__dirname, '../public/manifest.json');

const data = fs.readFileSync(filePath);
const version = JSON.parse(data)?.version;

module.exports = {
    entry: {
      popup: path.join(srcDir, 'popup.ts'),
      options: path.join(srcDir, 'options.ts'),
      background: path.join(srcDir, 'background.ts'),
      content_script: path.join(srcDir, 'content_script.ts'),
    },
    output: {
        path: path.join(__dirname, "../dist/js"),
        filename: "[name].js",
    },
    optimization: {
        splitChunks: {
            name: "vendor",
            chunks(chunk) {
              return chunk.name !== 'background';
            }
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: ".", to: "../", context: "public" }],
            options: {},
        }),
        new ZipPlugin({
            filename: version + '.zip',
            pathPrefix: './dist',
            path: '../',
        })
    ],
};
