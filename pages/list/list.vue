<template>
  <view class="container">
    <view class="search-bar">
      <input 
        class="search-input" 
        v-model="searchKeyword" 
        placeholder="搜索转盘"
        @input="handleSearch"
      />
    </view>

    <view class="category-tabs">
      <view 
        v-for="category in categories" 
        :key="category.id"
        class="category-tab"
        :class="{ active: activeCategory === category.id }"
        @click="selectCategory(category.id)"
      >
        <text class="category-name">{{ category.name }}</text>
      </view>
    </view>

    <scroll-view class="wheel-list" scroll-y>
      <view v-if="filteredWheels.length === 0" class="empty-state">
        <text class="empty-icon">🎡</text>
        <text class="empty-text">没有找到转盘</text>
      </view>

      <view v-else class="wheel-grid">
        <view 
          v-for="wheel in filteredWheels" 
          :key="wheel.id"
          class="wheel-card"
          @click="selectWheel(wheel)"
        >
          <view class="wheel-preview">
            <view 
              v-for="(option, index) in wheel.options.slice(0, 8)" 
              :key="index"
              class="preview-item"
              :style="{ backgroundColor: option.color }"
            ></view>
          </view>
          
          <view class="wheel-info">
            <text class="wheel-name">{{ wheel.name }}</text>
            <text class="wheel-count">{{ wheel.options.length }} 个选项</text>
          </view>

          <view class="wheel-type">
            <text v-if="wheel.isPreset" class="type-badge preset">系统</text>
            <text v-else class="type-badge custom">自定义</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { defaultWheel, presetWheels } from '@/utils/wheel.js'
import { getUserWheels } from '@/utils/storage.js'

export default {
  data() {
    return {
      searchKeyword: '',
      activeCategory: 'all',
      categories: [
        { id: 'all', name: '全部' },
        { id: 'preset', name: '系统转盘' },
        { id: 'custom', name: '我的转盘' }
      ],
      allWheels: []
    }
  },
  computed: {
    filteredWheels() {
      let wheels = this.allWheels

      if (this.searchKeyword) {
        wheels = wheels.filter(wheel => 
          wheel.name.toLowerCase().includes(this.searchKeyword.toLowerCase())
        )
      }

      if (this.activeCategory === 'preset') {
        wheels = wheels.filter(wheel => wheel.isPreset)
      } else if (this.activeCategory === 'custom') {
        wheels = wheels.filter(wheel => !wheel.isPreset)
      }

      return wheels
    }
  },
  onLoad() {
    this.loadWheels()
  },
  onShow() {
    this.loadWheels()
  },
  methods: {
    loadWheels() {
      const userWheels = getUserWheels()
      const presetWheelsWithFlag = presetWheels.map(wheel => ({
        ...wheel,
        isPreset: true
      }))
      const userWheelsWithFlag = userWheels.map(wheel => ({
        ...wheel,
        isPreset: false
      }))
      
      this.allWheels = [
        { ...defaultWheel, isPreset: true },
        ...presetWheelsWithFlag,
        ...userWheelsWithFlag
      ]
    },
    handleSearch() {
    },
    selectCategory(categoryId) {
      this.activeCategory = categoryId
    },
    selectWheel(wheel) {
      uni.setStorageSync('selectedWheel', wheel)
      uni.switchTab({
        url: '/pages/index/index'
      })
    }
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #F8F9FB;
  width: 100%;
  margin: 0 auto;
  margin-left: -30rpx; 
  box-sizing: border-box;
}

.search-bar {
  padding: 30rpx;
  background: white;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  width: 100%;
}

.search-input {
  width: 90%;
  height: 88rpx;
  padding: 0 30rpx;
  background: #F5F7FA;
  border-radius: 44rpx;
  font-size: 30rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
  color: #333;
}

.search-input:focus {
  background: white;
  border-color: #FF6B6B;
}

.category-tabs {
  display: flex;
  padding: 0 30rpx;
  background: white;
  border-bottom: 2rpx solid #E8ECF1;
  width: 100%;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}

.category-tab {
  flex: 1;
  text-align: center;
  padding: 36rpx 0;
  position: relative;
  transition: all 0.3s ease;
}

.category-tab.active {
  color: #FF6B6B;
}

.category-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 4rpx;
  background: linear-gradient(90deg, #FF6B6B, #FF8E53);
  border-radius: 2rpx;
}

.category-name {
  font-size: 30rpx;
  color: #666;
  transition: all 0.3s ease;
  font-weight: 500;
}

.category-tab.active .category-name {
  font-weight: 600;
}

.wheel-list {
  width: 100%;
  margin: 0 auto;
  height: calc(100vh - 300rpx);
  padding: 30rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 150rpx 30rpx;
  width: 100%;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 30rpx;
  opacity: 0.6;
}

.empty-text {
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
}

.wheel-grid {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.wheel-card {
  background: white;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 6rpx 24rpx rgba(0, 0, 0, 0.08);
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  border: 1rpx solid #F0F0F0;
}

.wheel-card:active {
  transform: scale(0.98);
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.12);
}

.wheel-preview {
  display: flex;
  height: 100rpx;
  padding: 12rpx;
  gap: 3rpx;
}

.preview-item {
  flex: 1;
  border-radius: 4rpx;
}

.wheel-info {
  padding: 28rpx 24rpx;
}

.wheel-name {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 12rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wheel-count {
  display: block;
  font-size: 26rpx;
  color: #666;
}

.wheel-type {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
}

.type-badge {
  padding: 10rpx 18rpx;
  border-radius: 24rpx;
  font-size: 22rpx;
  font-weight: 600;
}

.type-badge.preset {
  background: linear-gradient(135deg, #FF6B6B, #FF8E53);
  color: white;
  box-shadow: 0 2rpx 8rpx rgba(255, 107, 107, 0.3);
}

.type-badge.custom {
  background: linear-gradient(135deg, #4ECDC4, #44A08D);
  color: white;
  box-shadow: 0 2rpx 8rpx rgba(78, 205, 196, 0.3);
}
</style>