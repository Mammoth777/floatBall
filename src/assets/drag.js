import { TweenLite } from "gsap/TweenMax"

/* 
  注意, head需设置viewport
  实例方法:
  onDrag(coord) // 拖动时触发
  onClick() // 点击时触发
  active() // 使悬浮球处于活动状态
  inactive() // 使悬浮球处于不活动状态

*/

export default class {
  /**
   * @param {HTMLElement,String} domeEle 可传入html元素或元素id
   * @param {Number, String} coordinate.x x坐标, 数字则默认单位为px, 可选单位'vw'
   * @param {Number, String} coordinate.y y坐标, 数字则默认单位为px, 可选单位'vh'
   * @param {Number} coordinate.w width
   * @param {Number} coordinate.h height
   */
  constructor (domEle, coordinate = {}) {
    // 1. 初始化
    // 1.1 初始化状态
    this.readyMove = false // a) 点击浮球触发readeyMove
    this.isMoving = false // b) touchmove && readyMove, 触发isMoveing
    this.isActive = false // 是否是活动状态, 活动状态则可触发用户定义事件
    // 1.2 初始化dom元素
    const dom = domEle instanceof HTMLElement ?
      domEle :
      document.getElementById(domEle)

    this.dom = dom
    // 1.3 初始化dom样式, 宽高, 屏幕宽高
    dom.style.position = 'fixed'
    dom.style.zIndex = 1000
    this.coord = {}
    this.coord.w = coordinate.w/1 || dom.offsetWidth
    this.coord.h = coordinate.h/1 || dom.offsetHeight
    this.coord.maxX = window.screen.width - this.coord.w / 2
    this.coord.maxY = window.screen.height - this.coord.h / 2
    // 1.4 绑定数据和dom样式
    Object.defineProperties(this.coord, {
      x: {
        configurable: false,
        enumerable: true,
        get: function () {
          return this._x
        },
        set: function (value) {
          if (checkCssLength(value) === 'number'){
            let calcRes = value
            let minX = -this.w / 2
            if (calcRes > this.maxX) {
              this._x = this.maxX
            } else if (calcRes < minX) {
              this._x = minX
            } else {
              this._x = calcRes
            }
            dom.style.left = this._x + 'px'
          } else if (checkCssLength(value) === 'string') {
            dom.style.left = value
            this._x = dom.offsetLeft
          } else {
            console.warn('横坐标类型错误');
            this._x = 0
            dom.style.left = 0
          }
        }
      },
      y: {
        configurable: false,
        enumerable: true,
        get: function () {
          return this._y
        },
        set: function (value) {
          if (checkCssLength(value) === 'number') {
            let calcRes = value
            let minY = -this.h / 2
            if (calcRes > this.maxY) {
              this._y = this.maxY
            } else if (calcRes < minY) {
              this._y = minY
            } else {
              this._y = calcRes
            }
            dom.style.top = this._y + 'px'
          } else if (checkCssLength(value) === 'string') {
            dom.style.top = value
            this._y = dom.offsetTop
          } else {
            console.warn('纵坐标类型错误');
            this._y = 0
            dom.style.top = 0
          }
        }
      }
    })
    // 1.5 初始化坐标
    if (checkCssLength(coordinate.x)) {
      this.coord.x = coordinate.x
    } else {
      this.coord.x = -this.coord.w / 2
    }
    if (checkCssLength(coordinate.y)) {
      this.coord.y = coordinate.y
    } else {
      this.coord.y = 100
    }
    
    // 2. 绑定事件
    dom.addEventListener('touchstart', startHandler.bind(this), false)
    dom.addEventListener('touchmove', moveHandler.bind(this), false)
    window.addEventListener('touchend', endHandler.bind(this), false)
    dom.addEventListener('click', clickHandler.bind(this), false)
    console.log('dragbox created');
  }
  // 拖动触发事件
  _onDrag () {
    this.onDrag && this.onDrag(this.coord)
  }
  /**
   * 悬浮球贴边
   * @param {Boolean} isActive 是否是活动状态
   */
  _gotoEdge (isActive) {
    console.log('goto edge', isActive);
    let config = {}
    // 左半边则贴左, 右半边则贴右
    if (this.coord.x < this.coord.maxX / 2) {
      config = isActive ?
        {x: this.coord.w / 2} :
        {x: -this.coord.w / 2, delay: 0.2, ease: Quint.easeOut}
    } else {
      config = isActive ?
        {x: this.coord.maxX - this.coord.w} :
        {x: this.coord.maxX + this.coord.w / 2, delay: 0.2, ease: Quint.easeOut}
    }
    // 贴边效果
    const duration = isActive ? .2 : 1
    TweenLite.to(this.coord, duration, config)
  }
  active () {
    console.log('active');
    if (this.isMoving || this.isActive) return
    // 在贴边状态下
    // 贴左侧
    this._gotoEdge(true)
    this.isActive = true
    setTimeout(() => {
      this.inactive()
    }, 2000);
  }
  inactive () {
    console.log('inactive');
    if (this.isActive) {
      this.isActive = false
      this._gotoEdge()
    }
  }
}

function startHandler (event) {
  // 获取初始位置 screenX, screenY
  let sx = event.touches[0].clientX,
  sy = event.touches[0].clientY
  this.deltaX = sx - this.coord.x
  this.deltaY = sy - this.coord.y
  this.readyMove = true
}

function moveHandler (event) {
  event.preventDefault()
  if (this.readyMove) {
    this.isMoving = true
    this.coord.x = event.changedTouches[0].clientX - this.deltaX
    this.coord.y = event.changedTouches[0].clientY - this.deltaY
    this._onDrag()
  } else {
    console.log('not moving');
  }
}

function endHandler (event) {
  if (this.isMoving) {
    this._gotoEdge()
    this.isMoving = false
    this.readyMove= false
  }
}

function clickHandler () {
  if (this.isMoving) return  
  if (this.isActive) {
    const {x, y} = this.coord
    this.onClick && this.onClick({x, y})
  } else {
    this.active()
  }
}

function checkCssLength (val) {
  // 如果是数字, 则返回 'number'
  if (val === +val) {
    return 'number'
  } else if (/^(100|\d{1,2})(\.\d+)?v[wh]$/.test(val)) {
    // 如果是设置vw或者vh, 则返回 'string', 最大只能 '100vw'
    return 'string'
  } else {
    return null
  }
}