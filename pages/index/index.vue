<template>
  <view class="container">
    <view class="header">
      <text class="title">幸运转盘</text>
      <text class="subtitle">试试你的运气！</text>
    </view>

    <view class="wheel-section">
      <view class="wheel-wrapper">
        <wheel 
          :options="currentWheel.options" 
          :size="wheelSize"
          :can-start="canStartSpin"
          @spin-start="startSpin"
          @spin-end="handleSpinEnd"
        />
      </view>
      
      <view class="result-placeholder"></view>
      
      <view class="result-section" v-if="result">
        <view class="result-card">
          <text class="result-label">恭喜你抽中了</text>
          <text class="result-text">{{ result.option.name }}</text>
        </view>
      </view>
    </view>

    <view class="wheel-selector">
      <text class="selector-title">选择转盘</text>
      <scroll-view class="wheel-list" scroll-x>
        <view 
          v-for="wheel in allWheels" 
          :key="wheel.id"
          class="wheel-item"
          :class="{ active: currentWheel.id === wheel.id }"
          @click="selectWheel(wheel)"
        >
          <text class="wheel-name">{{ wheel.name }}</text>
        </view>
      </scroll-view>
    </view>

    <view class="spin-info" v-if="spinInfo">
      <text class="spin-count">今日抽奖: {{ spinInfo.used }}/{{ spinInfo.limit }}</text>
      <text class="spin-remaining">剩余 {{ spinInfo.remaining }} 次</text>
      <view class="contact-service-btn" @click="contactService">
        <text class="contact-text">联系客服</text>
      </view>
    </view>
  </view>
</template>

<script>
import { defaultWheel, presetWheels } from '@/utils/wheel.js'
import { getUserWheels, addSpinRecord, checkTotalSpinLimit, canSpin, incrementSpinCount, setLastSpinTime, addExtraSpinCount } from '@/utils/storage.js'
import Wheel from '@/components/wheel/wheel.vue'

export default {
  components: {
    Wheel
  },
  data() {
    return {
      currentWheel: defaultWheel,
      allWheels: [],
      result: null,
      spinInfo: {
        canSpin: true,
        remaining: 0,
        used: 0,
        limit: 10
      },
      cooldown: 3,
      isSpinning: false
    }
  },
  computed: {
    wheelSize() {
      const systemInfo = uni.getSystemInfoSync()
      return Math.min(systemInfo.windowWidth, systemInfo.windowHeight) * 0.95
    },
    canStartSpin() {
      if (!this.currentWheel || !this.currentWheel.options || this.currentWheel.options.length === 0) {
        return false
      }
      
      if (!this.spinInfo.canSpin) {
        return false
      }
      
      return true
    }
  },
  onLoad() {
    this.loadUserWheels()
    this.checkSelectedWheel()
    this.updateSpinInfo()
  },
  onShow() {
    this.loadUserWheels()
    this.checkSelectedWheel()
    this.updateSpinInfo()
  },
  methods: {
    loadUserWheels() {
      const userWheels = getUserWheels()
      this.allWheels = [defaultWheel, ...presetWheels, ...userWheels]
      
      if (!this.currentWheel) {
        this.currentWheel = defaultWheel
      }
      
      console.log('加载转盘列表:', this.allWheels.length, '个转盘')
      console.log('当前转盘:', this.currentWheel)
    },
    checkSelectedWheel() {
      const selectedWheel = uni.getStorageSync('selectedWheel')
      if (selectedWheel) {
        const found = this.allWheels.find(w => w.id === selectedWheel.id)
        if (found) {
          this.currentWheel = found
        }
      }
    },
    selectWheel(wheel) {
      if (this.isSpinning) {
        uni.showToast({
          title: '转盘转动中，请稍后再切换',
          icon: 'none'
        })
        return
      }
      this.currentWheel = wheel
      this.result = null
      uni.setStorageSync('selectedWheel', wheel)
    },
    updateSpinInfo() {
      this.spinInfo = checkTotalSpinLimit()
    },
    contactService() {
      addExtraSpinCount(10)
      this.updateSpinInfo()
      uni.showToast({
        title: '联系客服成功，获得10次抽奖机会',
        icon: 'success',
        duration: 2000
      })
    },
    startSpin() {
      if (!this.currentWheel || !this.currentWheel.options || this.currentWheel.options.length === 0) {
        uni.showToast({
          title: '转盘选项为空',
          icon: 'none'
        })
        return
      }
      
      if (!this.spinInfo.canSpin) {
        uni.showToast({
          title: `今日抽奖次数已用完，剩余${this.spinInfo.remaining}次`,
          icon: 'none'
        })
        return
      }
      
      this.isSpinning = true
      return true
    },
    handleSpinEnd(data) {
      const today = new Date().toISOString().split('T')[0]
      incrementSpinCount(today)
      setLastSpinTime(Date.now())
      
      const record = {
        wheelId: this.currentWheel.id,
        wheelName: this.currentWheel.name,
        optionName: data.option.name,
        optionColor: data.option.color
      }
      addSpinRecord(record)
      
      this.updateSpinInfo()
      
      this.result = data
      
      this.isSpinning = false
      
      uni.showToast({
        title: `恭喜抽中${data.option.name}`,
        icon: 'success',
        duration: 2000
      })
    }
  }
}
</script>

<style scoped>
.container {
  height: 100vh;
  background: linear-gradient(180deg, #FF6B6B 0%, #FF8E53 100%);
  padding: 20rpx 30rpx;
  padding-bottom: 120rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.header {
  text-align: center;
}

.title {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  color: white;
  margin-bottom: 8rpx;
  letter-spacing: 2rpx;
}

.subtitle {
  display: block;
  text-align: center;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 300;
}

.wheel-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10rpx;
  flex: 1;
  justify-content: center;
  min-height: 0;
  position: relative;
}

.result-placeholder {
  width: calc(100% - 60rpx);
  height: 90rpx;
  margin-top: 10rpx;
}

.result-section {
  position: absolute;
  top: calc(50% + 330rpx);
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;

}

.result-card {
  margin-bottom: -20rpx;
  width: 100%;
  background: white;
  border-radius: 20rpx;
  padding: 20rpx;
  text-align: center;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.12);
  animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.spin-info {
  display: flex;
  gap: 20rpx;
  padding: 10rpx 40rpx;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 50rpx;
  backdrop-filter: blur(10rpx);
  align-items: center;
  justify-content: space-between;
  position: fixed;
  bottom: 5rpx;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.12);
  width: calc(100% - 130rpx);
}

.spin-count,
.spin-remaining {
  font-size: 28rpx;
  color: grey;
  font-weight: 500;
}

.spin-remaining {
  color: #FFEAA7;
  font-weight: 600;
}

.contact-service-btn {
  padding: 10rpx 25rpx;
  background: linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%);
  border-radius: 40rpx;
  box-shadow: 0 4rpx 15rpx rgba(107, 114, 128, 0.3);
  transition: all 0.3s ease;
}

.contact-service-btn:active {
  box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.3);
}

.contact-text {
  font-size: 28rpx;
  color: white;
  font-weight: 600;
}

.wheel-wrapper {
  background: white;
  border-radius: 50%;
  box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.25);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-label {
  display: block;
  font-size: 30rpx;
  color: #666;
  margin-bottom: 10rpx;
  font-weight: 400;
}

.result-text {
  display: block;
  font-size: 60rpx;
  font-weight: bold;
  color: #FF6B6B;
  letter-spacing: 1rpx;
}

.wheel-selector {
  text-align: center;
  background: white;
  border-radius: 20rpx;
  padding: 20rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.12);
  margin-bottom: -30rpx;
}

.selector-title {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  letter-spacing: 1rpx;
}

.wheel-list {
  white-space: nowrap;
}

.wheel-item {
  display: inline-block;
  padding: 14rpx 28rpx;
  margin-right: 15rpx;
  background: #F5F7FA;
  border-radius: 50rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.wheel-item.active {
  background: linear-gradient(135deg, #FF6B6B, #FF8E53);
  border-color: #FF6B6B;
  box-shadow: 0 4rpx 15rpx rgba(255, 107, 107, 0.4);
}

.wheel-item.active .wheel-name {
  color: white;
  font-weight: 600;
}

.wheel-name {
  font-size: 28rpx;
  color: #666;
  transition: all 0.3s ease;
}
</style>