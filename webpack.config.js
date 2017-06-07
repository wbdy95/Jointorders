var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	entry : {
		/*'webpack/hot/dev-server',
		'webpack-dev-server/client?http://localhost:8080', */
		main : path.resolve(__dirname, 'app/router.js'),
		vendor : ['react', 'react-dom']
	},
	output: {
		path : path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	//http://test.youmeishi.cn/Weixin/dinner/loadinfo.do
	devServer:{
		contentBase: '/app',
		devtool: 'eval',
		hot: true,        //ie8
		inline: true,     //ie8
		port: 9090,       //Port Number
		proxy: {
			"/WeixinServer/*": {
				changeOrigin:true,
				//target: "http://172.16.38.222:8888/"
				target : "http://test8.youmeishi.cn/"
				// target : "http://172.16.38.242:8080/"
			}
		},
  	},
	/** 自动刷新，
		1. 需要配置此插件，
		2. 启动脚本也要加 --hot
		3. entry 配置
	*/
	plugins: [
    	new webpack.HotModuleReplacementPlugin(),
    	new ExtractTextPlugin("styles.css"),
    	new webpack.optimize.CommonsChunkPlugin({
			  name: "vendor",
			  // (the commons chunk name)

			  filename: "vendor.bundle.js",
			  // (the filename of the commons chunk)

			  // minChunks: 3,
			  // (Modules must be shared between 3 entries)

			  // chunks: ["pageA", "pageB"],
			  // (Only use these entries)
			})
    ],

    //m.news.baidu.com/news?tn=bdapipchot&m=rddata&v=hot_word&type=0&date=&_t=1479197394934


    //配置loaders
    module: {
    	loaders:[
    		{ test: /\.js[x]?$/, exclude: /node_modules/, loader: 'babel-loader?presets[]=es2015&presets[]=react'},
    		{ test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") },
    		{ test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
    			loader: 'url-loader?limit=30000&name=[path][name].[ext]'
    		}
    	]
    }
}
