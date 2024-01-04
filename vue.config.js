/*
 * @Author: 1245040330 32012815+1245040330@users.noreply.github.com
 * @Date: 2023-09-16 10:34:31
 * @LastEditors: 1245040330 32012815+1245040330@users.noreply.github.com
 * @LastEditTime: 2024-01-04 18:01:05
 * @FilePath: \vue3-cl-live-video\vue.config.js
 * @Description: cli配置
 */
const { defineConfig } = require('@vue/cli-service');
const path = require('path')
const resolve = (dir) => path.join(__dirname, dir)
module.exports = defineConfig({
  publicPath: './',
  transpileDependencies: true,
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    allowedHosts: 'all',
    hot: true,
    port: 9528,
    open: true,
    client: {
      overlay: {
        warnings: false,
        errors: false,
        runtimeErrors: false
      },
    },

    proxy: {
      ['']: {
        target: 'http://localhost:40081',
        changeOrigin: true,
      },
    },
  },
  chainWebpack: config => {

    config.module.rule('svg').exclude.add(resolve('src/assets/icons')).end()

    config.module
      .rule('svg-sprite-loader')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
  },
  configureWebpack() {
    return {
      resolve: {
        fallback: {
          path: require.resolve('path-browserify')
        },

        alias: {
          '@': resolve('src'),
        },
      },

    }
  },

})
