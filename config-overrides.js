const {override, fixBabelImports, addLessLoader} = require('customize-cra');
module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd-mobile',
        libraryDirectory: 'es',
        style: true,
    }),
    addLessLoader({
        lessOptions: { // 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。
            modifyVars: {
                'brand-primary': '#1DA57A',// 全局主色
                'link-color': '#1DA57A',// 链接色
                'border-radius-base': '2px',// 组件/浮层圆角
            },
         javascriptEnabled: true,
        },
    })
);
