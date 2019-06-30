/**
 * Created by huahua on 19/1/28.
 */
class Dots {
    canvas: any // 画布相关
    ctx: any // 画布相关
    x: number // 绘制点相关
    y: number // 绘制点相关
    r: number // 绘制点相关
    sx: number // 移动相关
    sy: number // 移动相关
    constructor(canvas: any) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
    }
    init(x?: number, y?: number): void {
        this.x = x ? x * 2 : Math.random() * this.canvas.width
        this.y = y ? y * 2 : Math.random() * this.canvas.height
        this.r = Math.random() * 4 // 随机生成 <4 的半径值
        // 随机确定点的移动速度与方向 速度值在 [-2, 2) 之间 提高数值可加快速度
        this.sx = Math.random() * 4 - 2
        this.sy = Math.random() * 4 - 2

        this.ctx.beginPath()
        this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
        this.ctx.fillStyle = 'rgba(255,255,255,.8)'
        this.ctx.fill()
        this.ctx.closePath()
    }
    update(): void {
        this.x = this.x + this.sx
        this.y = this.y + this.sy
        // 点超出canvas范围时另其"重生"
        if (this.x < 0 || this.x > this.canvas.width) {
            this.init()
        }
        if (this.y < 0 || this.y > this.canvas.height) {
            this.init()
        }
        this.ctx.beginPath()
        this.ctx.arc(this.x, this.y, this.r + 0.5, 0, 2 * Math.PI)
        this.ctx.fillStyle = 'rgba(255,255,255,.8)'
        this.ctx.fill()
        this.ctx.closePath()
    }
}

export class Canvasbg {
    name: 'canvas-line'
    dotsArr: any[]
    dotsNum: number
    maxDotsNum: number
    overNum: number
    dotsDistance: number
    canvas: object
    ctx: any
    width: number
    height: number
    requestAnimFrame: any
    constructor(canvas: any) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.dotsArr = []
        this.overNum = 0
        this.dotsDistance = 240
        this.width = document.documentElement.clientWidth
        this.height = document.documentElement.clientHeight
        let cssText = `width: ${this.width}px; height: ${this.height}px;`
        canvas.setAttribute('style', cssText)
        canvas.width = (this.width * 2).toString()
        canvas.height = (this.height * 2).toString()
    }
    init(): void {
        let area = this.width * this.height
        this.dotsNum = Math.floor(area / 6000)
        this.maxDotsNum = this.dotsNum * 2
        this.createPoint()

        //动画与连线
        this.requestAnimFrame = requestAnimationFrame // 兼容不同浏览器的requestAnimationFrame
        requestAnimationFrame(() => {
            this.animateUpdate()
        })
    }
    createPoint(): void {
        for (let i = 0; i < this.dotsNum; i++) {
            var dot = new Dots(this.canvas)
            this.dotsArr.push(dot)
            dot.init()
        }
    }
    animateUpdate(): void {
        this.ctx.clearRect(0, 0, this.width * 2, this.height * 2) // 清空canvas中原有的内容
        // 更新点的位置 数量超出最大值时舍弃旧的点
        if (this.dotsNum > this.maxDotsNum) {
            this.overNum = this.dotsNum - this.maxDotsNum
        }

        for (let m = this.overNum; m < this.dotsNum; m++) {
            this.dotsArr[m].update()
        }

        // 绘制连线
        for (var i = this.overNum; i < this.dotsNum; i++) {
            for (var j = i + 1; j < this.dotsNum; j++) {
                var tx = this.dotsArr[i].x - this.dotsArr[j].x,
                    ty = this.dotsArr[i].y - this.dotsArr[j].y,
                    s = Math.sqrt(Math.pow(tx, 2) + Math.pow(ty, 2))

                if (s < this.dotsDistance) {
                    this.ctx.beginPath()

                    this.ctx.moveTo(this.dotsArr[i].x, this.dotsArr[i].y)
                    this.ctx.lineTo(this.dotsArr[j].x, this.dotsArr[j].y)
                    this.ctx.strokeStyle =
                        'rgba(255,255,255,' +
                        (this.dotsDistance - s) / this.dotsDistance +
                        ')'
                    this.ctx.strokeWidth = 1
                    this.ctx.stroke()
                    this.ctx.closePath()
                }
            }
        }

        requestAnimationFrame(() => {
            this.animateUpdate()
        })
    }
}
