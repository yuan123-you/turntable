<template>
  <view class="wheel-container" :style="{ width: size + 'px', height: size + 'px' }">
    <canvas 
      class="wheel-canvas" 
      :canvas-id="canvasId"
      :id="canvasId"
      type="2d"
      :style="{ width: size + 'px', height: size + 'px' }"
      @tap="handleCanvasClick"
    ></canvas>
  </view>
</template>

<script>
export default {
  name: 'Wheel',
  props: {
    options: {
      type: Array,
      required: true,
      default: () => []
    },
    size: {
      type: Number,
      default: 300
    },
    duration: {
      type: Number,
      default: 3000
    },
    canStart: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      canvasId: 'wheelCanvas',
      isSpinning: false,
      currentRotation: 0,
      ctx: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initCanvas()
    })
  },
  watch: {
    options: {
      handler() {
        this.$nextTick(() => {
          this.initCanvas()
        })
      },
      deep: true
    }
  },
  methods: {
    initCanvas() {
      const query = uni.createSelectorQuery().in(this)
      query.select(`#${this.canvasId}`)
        .fields({ node: true, size: true })
        .exec((res) => {
          if (res && res[0]) {
            const canvas = res[0].node
            const ctx = canvas.getContext('2d')
            const dpr = uni.getSystemInfoSync().pixelRatio || 1
            
            canvas.width = this.size * dpr
            canvas.height = this.size * dpr
            ctx.scale(dpr, dpr)
            
            this.ctx = ctx
            this.drawWheel()
          } else {
            console.error('Canvas节点获取失败', res)
          }
        })
    },
    drawWheel() {
      if (!this.ctx) {
        console.error('Canvas上下文未初始化')
        return
      }
      
      if (!this.options || this.options.length === 0) {
        console.error('转盘选项为空')
        return
      }
      
      console.log('绘制转盘，选项数量:', this.options.length)
      
      const ctx = this.ctx
      const centerX = this.size / 2
      const centerY = this.size / 2
      const radius = this.size / 2
      
      ctx.clearRect(0, 0, this.size, this.size)
      
      let startAngle = -Math.PI / 2
      
      this.options.forEach((option, index) => {
        const sliceAngle = (2 * Math.PI) / this.options.length
        const endAngle = startAngle + sliceAngle
        
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, startAngle, endAngle)
        ctx.closePath()
        
        ctx.fillStyle = option.color
        ctx.fill()
        
        ctx.strokeStyle = '#FFFFFF'
        ctx.lineWidth = 2
        ctx.stroke()
        
        const textAngle = startAngle + sliceAngle / 2
        const textRadius = radius * 0.75
        const textX = centerX + textRadius * Math.cos(textAngle)
        const textY = centerY + textRadius * Math.sin(textAngle)
        
        ctx.save()
        ctx.translate(textX, textY)
        ctx.rotate(textAngle)
        
        ctx.fillStyle = '#FFFFFF'
        
        const fontSize = this.options.length > 20 ? 12 : 16
        ctx.font = `bold ${fontSize}px Arial`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        
        const text = option.name
        const maxWidth = radius * 0.6
        const words = text.split('')
        let line = ''
        let lineHeight = fontSize + 2
        let lines = []
        
        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i]
          const metrics = ctx.measureText(testLine)
          if (metrics.width > maxWidth && i > 0) {
            lines.push(line)
            line = words[i]
          } else {
            line = testLine
          }
        }
        lines.push(line)
        
        const startY = -((lines.length - 1) * lineHeight) / 2
        lines.forEach((l, i) => {
          ctx.fillText(l, 0, startY + i * lineHeight)
        })
        
        ctx.restore()
      
      startAngle = endAngle
    })
    
    const buttonRadius = this.size * 0.12
    
    const pointerX = centerX
    const pointerY = centerY - radius * 0.85 + this.size * 0.12 * 0.3 + this.size * 0.25 * 0.3
    const pointerWidth = this.size * 0.04 * 0.5
    const pointerHeight = this.size * 0.12 * 0.7
    const pointerStickHeight = this.size * 0.25 * 0.8
    
    ctx.save()
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
    ctx.shadowBlur = 8
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 4
    
    ctx.beginPath()
    ctx.moveTo(pointerX, pointerY)
    ctx.lineTo(pointerX - pointerWidth / 2, pointerY + pointerHeight)
    ctx.lineTo(pointerX - pointerWidth / 3, pointerY + pointerHeight)
    ctx.lineTo(pointerX - pointerWidth / 3, pointerY + pointerHeight + pointerStickHeight)
    ctx.lineTo(pointerX + pointerWidth / 3, pointerY + pointerHeight + pointerStickHeight)
    ctx.lineTo(pointerX + pointerWidth / 3, pointerY + pointerHeight)
    ctx.lineTo(pointerX + pointerWidth / 2, pointerY + pointerHeight)
    ctx.closePath()
    
    const pointerGradient = ctx.createLinearGradient(pointerX, pointerY, pointerX, pointerY + pointerHeight + pointerStickHeight)
    pointerGradient.addColorStop(0, '#FF6B9D')
    pointerGradient.addColorStop(0.5, '#FF8E72')
    pointerGradient.addColorStop(1, '#FFA07A')
    ctx.fillStyle = pointerGradient
    ctx.fill()
    
    ctx.strokeStyle = '#FF5C8D'
    ctx.lineWidth = 1.5
    ctx.stroke()
    
    ctx.restore()
    
    ctx.beginPath()
    ctx.arc(centerX, centerY, buttonRadius, 0, 2 * Math.PI)
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, buttonRadius)
    gradient.addColorStop(0, '#FF8E53')
    gradient.addColorStop(1, '#FF6B6B')
    ctx.fillStyle = gradient
    ctx.fill()
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 3
    ctx.stroke()
    
    ctx.fillStyle = '#FFFFFF'
    const buttonText = this.isSpinning ? '转动中' : '开始'
    const buttonFontSize = this.size * 0.053
    ctx.font = `bold ${buttonFontSize}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(buttonText, centerX, centerY)
  },
  handleCanvasClick(e) {
    if (this.isSpinning) return
    this.startSpin()
  },
    startSpin() {
      if (this.isSpinning) return
      
      if (!this.canStart) {
        this.$emit('spin-start')
        return
      }
      
      this.$emit('spin-start')
      
      this.isSpinning = true
      
      const startRotation = this.currentRotation
      const minSpins = 3
      const maxSpins = 6
      const spins = Math.floor(Math.random() * (maxSpins - minSpins + 1)) + minSpins
      const randomAngle = Math.random() * 360
      const deltaRotation = spins * 360 + randomAngle
      
      const startTime = Date.now()
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / this.duration, 1)
        
        const easeOut = 1 - Math.pow(1 - progress, 3)
        this.currentRotation = startRotation + deltaRotation * easeOut
        
        this.drawWheelWithRotation(this.currentRotation)
        
        if (progress < 1) {
          setTimeout(animate, 16)
        } else {
          const finalAngle = this.currentRotation % 360
          const normalizedAngle = (360 - finalAngle + 360) % 360
          const sliceAngle = 360 / this.options.length
          const optionIndex = Math.floor(normalizedAngle / sliceAngle) % this.options.length
          const option = this.options[optionIndex]
          
          this.isSpinning = false
          this.currentRotation = finalAngle
          this.drawWheelWithRotation(this.currentRotation)
          this.$emit('spin-end', { option, index: optionIndex })
          uni.showToast({
            title: `恭喜您抽中了${option.name}`,
            icon: 'none',
            duration: 2000
          })
        }
      }
      
      setTimeout(animate, 16)
    },
    drawWheelWithRotation(rotation) {
      if (!this.ctx) {
        console.error('Canvas上下文未初始化')
        return
      }
      
      if (!this.options || this.options.length === 0) {
        console.error('转盘选项为空')
        return
      }
      
      const ctx = this.ctx
      const centerX = this.size / 2
      const centerY = this.size / 2
      const radius = this.size / 2
      
      ctx.clearRect(0, 0, this.size, this.size)
      
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(rotation * Math.PI / 180)
      ctx.translate(-centerX, -centerY)
      
      let startAngle = -Math.PI / 2
      
      this.options.forEach((option) => {
        const sliceAngle = (2 * Math.PI) / this.options.length
        const endAngle = startAngle + sliceAngle
        
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, startAngle, endAngle)
        ctx.closePath()
        
        ctx.fillStyle = option.color
        ctx.fill()
        
        ctx.strokeStyle = '#FFFFFF'
        ctx.lineWidth = 2
        ctx.stroke()
        
        const textAngle = startAngle + sliceAngle / 2
        const textRadius = radius * 0.75
        const textX = centerX + textRadius * Math.cos(textAngle)
        const textY = centerY + textRadius * Math.sin(textAngle)
        
        ctx.save()
        ctx.translate(textX, textY)
        ctx.rotate(textAngle)
        
        ctx.fillStyle = '#FFFFFF'
        
        const fontSize = this.options.length > 20 ? 12 : 16
        ctx.font = `bold ${fontSize}px Arial`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        
        const text = option.name
        const maxWidth = radius * 0.6
        const words = text.split('')
        let line = ''
        let lineHeight = fontSize + 2
        let lines = []
        
        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i]
          const metrics = ctx.measureText(testLine)
          if (metrics.width > maxWidth && i > 0) {
            lines.push(line)
            line = words[i]
          } else {
            line = testLine
          }
        }
        lines.push(line)
        
        const startY = -((lines.length - 1) * lineHeight) / 2
        lines.forEach((l, i) => {
          ctx.fillText(l, 0, startY + i * lineHeight)
        })
        
        ctx.restore()
      
      startAngle = endAngle
    })
    
    ctx.restore()
    
    const buttonRadius = this.size * 0.12
    
    const pointerX = centerX
    const pointerY = centerY - radius * 0.85 + this.size * 0.12 * 0.3 + this.size * 0.25 * 0.3
    const pointerWidth = this.size * 0.04 * 0.5
    const pointerHeight = this.size * 0.12 * 0.7
    const pointerStickHeight = this.size * 0.25 * 0.8
    
    ctx.save()
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
    ctx.shadowBlur = 8
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 4
    
    ctx.beginPath()
    ctx.moveTo(pointerX, pointerY)
    ctx.lineTo(pointerX - pointerWidth / 2, pointerY + pointerHeight)
    ctx.lineTo(pointerX - pointerWidth / 3, pointerY + pointerHeight)
    ctx.lineTo(pointerX - pointerWidth / 3, pointerY + pointerHeight + pointerStickHeight)
    ctx.lineTo(pointerX + pointerWidth / 3, pointerY + pointerHeight + pointerStickHeight)
    ctx.lineTo(pointerX + pointerWidth / 3, pointerY + pointerHeight)
    ctx.lineTo(pointerX + pointerWidth / 2, pointerY + pointerHeight)
    ctx.closePath()
    
    const pointerGradient = ctx.createLinearGradient(pointerX, pointerY, pointerX, pointerY + pointerHeight + pointerStickHeight)
    pointerGradient.addColorStop(0, '#FF6B9D')
    pointerGradient.addColorStop(0.5, '#FF8E72')
    pointerGradient.addColorStop(1, '#FFA07A')
    ctx.fillStyle = pointerGradient
    ctx.fill()
    
    ctx.strokeStyle = '#FF5C8D'
    ctx.lineWidth = 1.5
    ctx.stroke()
    
    ctx.restore()
    
    ctx.beginPath()
    ctx.arc(centerX, centerY, buttonRadius, 0, 2 * Math.PI)
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, buttonRadius)
    gradient.addColorStop(0, '#FF8E53')
    gradient.addColorStop(1, '#FF6B6B')
    ctx.fillStyle = gradient
    ctx.fill()
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 3
    ctx.stroke()
    
    ctx.fillStyle = '#FFFFFF'
    const buttonText = this.isSpinning ? '转动中' : '开始'
    const buttonFontSize = this.size * 0.053
    ctx.font = `bold ${buttonFontSize}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(buttonText, centerX, centerY)
  },
    getRandomOption() {
      return Math.floor(Math.random() * this.options.length)
    }
  }
}
</script>

<!-- #ifdef H5 -->
<style scoped>
.wheel-container {
  position: relative;
  display: inline-block;
}

.wheel-canvas {
  border-radius: 50%;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transform: translateY(-20rpx);
}
</style>
<!-- #endif -->

<!-- #ifdef MP-WEIXIN -->
<style scoped>
.wheel-container {
  position: relative;
  display: inline-block;
}

.wheel-canvas {
  border-radius: 50%;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  transform: translateY(-20rpx);
}
</style>
<!-- #endif -->