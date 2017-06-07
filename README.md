# webpack-react-demo

参考文件
https://fakefish.github.io/react-webpack-cookbook/Introduction-to-Webpack.html

demo-1:实现以下功能

1. 配置了基本的webpack功能
2. 配置了依赖包，webpack，webpack-dev-server
3. 配置了自动刷新
4. 引用文件在这个阶段只能使用cmd模式，es6不支持，支持es6需要安装bebel;
 
这里的自动刷新写的有点问题，需要在webpack-config.js中配合插件

    module.exports = {
        entry : [
            'webpack/hot/dev-server', 
            'webpack-dev-server/client?http://localhost:8080', 
            path.resolve(__dirname, 'main.js')
        ],
        output: {
            path : path.resolve(__dirname, 'build'),
            filename: 'bundle.js'
        },
        /** 自动刷新，
            1. 需要配置此插件，
            2. 启动脚本也要加 --hot
            3. entry 配置
                'webpack/hot/dev-server', 
                'webpack-dev-server/client?http://localhost:8080', 
        */
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ]
    }

demo-2: 实现以下功能

实现两个js文件，使用cmd规范
入口文件main.js
组件文件component.js

demo-3:

配置react，以及babel转换es6；import语法实现；

### 安装react

package.json
    
    "react": "^15.3.2",
    "react-dom": "^15.3.2"

配置babel以及转换es6

package.json

    "babel-core": "^6.14.0",
    "babel-loader": "^6.2.5",
    "babel-preset-es2015": "^6.14.0",
    "babel-preset-react": "~6.0.15",

命令行
    
    npm install --save

我们创建两个文件来实践一下
[react文档](http://reactjs.cn/react/docs/getting-started-zh-CN.html)
main.js

    import React from 'react';
    import ReactDOM from 'react-dom';
    import Hello from './component.js';

    ReactDOM.render(<Hello/>, document.getElementById("app"));

component.js

    import React from 'react';

    class Hello extends React.Component {
        constructor(props) {
            super(props);
            this.displayName = 'Hello';
        }
        render() {
            return <div>Hello</div>;
        }
    }

    export default Hello;

webpack.config.js
    
    //配置loaders
    module: {
        loaders:[
            { test: /\.js[x]?$/, exclude: /node_modules/, loader: 'babel-loader?presets[]=es2015&presets[]=react'}
        ]
    }

demo-4 实现以下功能
(参考文档)[http://cn.redux.js.org/index.html]
使用redux管理state

安装

    npm install --save redux
    多数情况下，你还需要使用 React 绑定库和开发者工具。

    npm install --save react-redux
    npm install --save-dev redux-devtools

main.js 一个简单例子实现redux管理state；

demo-5 使用react实现一个todoMvc实例

有几个新方法要理解。
action:一个字面量对象{type:''},包含一个type必选字段；
action创建函数：返回一个action

reducer：一个接受旧的state，返回新的state的函数；
redux.combineReduces 合并多个reduces，返回一个新的state；

store：存储state数据；
redux.createStore(action|action创建函数);
