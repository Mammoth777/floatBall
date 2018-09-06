# TweenLite 笔记
> TweenLite是一个非常快速、轻量级和灵活的动画工具，是GreenSock动画平台（GSAP）的基础。可以单独使用，体积很小, 简单易用

## 引入方式
安装 `gsap`
```bash
npm i gsap --save
```
引入 `TweenLite`
```javascript
import { TweenLite } from "gsap/TweenMax"
```

## 使用方式
TweenLite.to( target:Object, duration:Number, vars:Object )
- target: 目标对象
- duration: 时间(秒)
- vars: 定义每个属性的最终值的对象, 也包含一些特殊配置[详见官网](https://greensock.com/docs/TweenLite/static.to)
```javascript
var obj = {x: 0, y: 0}
TweenLite.to(obj, 1, {x: 100, delay: 3}) // obj在等待3秒后, x在1s内变为100 => {x: 100, y: 0}
```