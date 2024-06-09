const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

const crypto = require("crypto");
const crypto_orig_createHash = crypto.createHash;
crypto.createHash = (algorithm) =>
	crypto_orig_createHash(algorithm == "md4" ? "sha256" : algorithm);

const dist = path.resolve(__dirname, "dist");

module.exports = {
	mode: "production",
	entry: {
		index: "./js/index.js",
	},
	output: {
		path: dist,
		filename: "[name].js",
	},
	devServer: {
		contentBase: dist,
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: "babel-loader",
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.(png|j?g|svg|gif)?$/,
				use: "file-loader",
			},
		],
	},
	plugins: [
		new CopyPlugin([path.resolve(__dirname, "static")]),

		new WasmPackPlugin({
			crateDirectory: __dirname,
		}),
	],
};
