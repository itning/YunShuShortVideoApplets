# 云舒短视频小程序

> 使用MpVue构建的微信小程序
>
> 实现了类似抖音的短视频功能

[![GitHub stars](https://img.shields.io/github/stars/itning/YunShuShortVideoApplets.svg?style=social&label=Stars)](https://github.com/itning/YunShuShortVideoApplets/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/itning/YunShuShortVideoApplets.svg?style=social&label=Fork)](https://github.com/itning/YunShuShortVideoApplets/network/members)
[![GitHub watchers](https://img.shields.io/github/watchers/itning/YunShuShortVideoApplets.svg?style=social&label=Watch)](https://github.com/itning/YunShuShortVideoApplets/watchers)
[![GitHub followers](https://img.shields.io/github/followers/itning.svg?style=social&label=Follow)](https://github.com/itning?tab=followers)

[![GitHub issues](https://img.shields.io/github/issues/itning/YunShuShortVideoApplets.svg)](https://github.com/itning/YunShuShortVideoApplets/issues)
[![GitHub license](https://img.shields.io/github/license/itning/YunShuShortVideoApplets.svg)](https://github.com/itning/YunShuShortVideoApplets/blob/master/LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/itning/YunShuShortVideoApplets.svg)](https://github.com/itning/YunShuShortVideoApplets/commits)
[![GitHub release](https://img.shields.io/github/release/itning/YunShuShortVideoApplets.svg)](https://github.com/itning/YunShuShortVideoApplets/releases)
[![GitHub repo size in bytes](https://img.shields.io/github/repo-size/itning/YunShuShortVideoApplets.svg)](https://github.com/itning/YunShuShortVideoApplets)
[![HitCount](http://hits.dwyl.io/itning/YunShuShortVideoApplets.svg)](http://hits.dwyl.io/itning/YunShuShortVideoApplets)
[![language](https://img.shields.io/badge/language-Vue-green.svg)](https://github.com/itning/YunShuShortVideoApplets)

## 构建步骤

``` bash
# 安装依赖
npm install

# 开发时构建
npm dev

# 打包构建
npm build

# 开发时构建
npm dev:wx

# 打包构建
npm build:wx

# 生成 bundle 分析报告
npm run build --report
```

## 主界面预览

![](https://raw.githubusercontent.com/itning/YunShuShortVideoApplets/master/pic/main.png)

## 为什么使用MpVue来开发微信小程序？

首先，微信小程序官方IDE提供功能有限，相比前端成熟IDE例如WebStorm可以说官方提供的IDE是~~玩具~~。

小程序本身定位为一个简单的逻辑视图层框架，官方并不推荐用来开发复杂应用，但业务需求却难以做到精简。但是随着业务发展，应用的复杂化对于开发方式提出了较高要求例如组件，模块化开发，自动集成，复用等等，而微信小程序开发方式并不能很好的解决这些问题。况且小程序开发的学习成本并不低，所以在会用Vue这个框架的基础上使用微信小程序API来进行开发是一种非常好的选择。

告别刀耕火种，一次开发多端部署！（目前mpvue已经支持支付宝，头条小程序的构建）