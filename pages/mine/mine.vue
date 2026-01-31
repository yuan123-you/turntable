<template>
  <view class="container">
    <view class="user-section">
      <view v-if="!isLoggedIn" class="login-card">
        <text class="login-icon">👤</text>
        <text class="login-title">未登录</text>
        <text class="login-desc">登录后可创建和管理自定义转盘</text>
        <button class="btn btn-primary" @click="goToLogin">立即登录</button>
      </view>

      <view v-else class="user-card">
        <view class="user-info-left">
          <button class="user-avatar-btn" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
            <image v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" class="avatar-img" />
            <text v-else class="avatar-text">{{ userInfo.nickName ? userInfo.nickName[0] : 'U' }}</text>
          </button>
          <view class="user-name-wrapper">
            <input 
              v-if="editingNickname" 
              v-model="tempNickname" 
              class="nickname-input"
              type="text"
              placeholder="请输入昵称"
              @blur="saveNickname"
              @confirm="saveNickname"
              @focus="handleInputFocus"
            />
            <text v-else class="user-name" @click="startEditNickname">{{ userInfo.nickName || '微信用户' }}</text>
          </view>
        </view>
        <view class="user-info-right">
          <button class="btn-logout" @click="handleLogout">退出登录</button>
        </view>
      </view>
    </view>

    <view v-if="isLoggedIn" class="my-wheels-section">
      <view class="section-header">
        <text class="section-title">我的转盘</text>
        <view class="header-actions">
          <text class="wheel-count">{{ myWheels.length }} 个</text>
          <button class="btn-add-small" @click="goToCreateWheel">+ 添加</button>
        </view>
      </view>

      <view v-if="myWheels.length === 0" class="empty-state">
        <text class="empty-icon">🎡</text>
        <text class="empty-text">还没有创建转盘</text>
        <button class="btn btn-success" @click="goToCreateWheel">创建第一个转盘</button>
      </view>

      <view v-else class="wheel-list">
        <view 
          v-for="wheel in (wheelsExpanded ? myWheels : myWheels.slice(0, 1))" 
          :key="wheel.id"
          class="wheel-item"
        >
          <view class="wheel-preview">
            <view 
              v-for="(option, index) in wheel.options.slice(0, 6)" 
              :key="index"
              class="preview-item"
              :style="{ backgroundColor: option.color }"
            ></view>
          </view>

          <view class="wheel-info">
            <text class="wheel-name">{{ wheel.name }}</text>
            <text class="wheel-options">{{ wheel.options.length }} 个选项</text>
          </view>

          <view class="wheel-actions">
            <button class="btn-edit" @click="editWheel(wheel)">编辑</button>
            <button class="btn-delete" @click="deleteWheel(wheel.id)">删除</button>
          </view>
        </view>
        
        <view v-if="myWheels.length > 1" class="expand-btn" @click="wheelsExpanded = !wheelsExpanded">
          <text class="expand-text">{{ wheelsExpanded ? '收起' : `查看更多 (${myWheels.length - 1})` }}</text>
          <text class="expand-icon">{{ wheelsExpanded ? '▲' : '▼' }}</text>
        </view>
      </view>
    </view>

    <view v-if="isLoggedIn" class="history-section">
      <view class="section-header">
        <text class="section-title">抽奖历史</text>
        <text class="clear-btn" @click="clearHistory">清空</text>
      </view>

      <view v-if="spinRecords.length === 0" class="empty-state">
        <text class="empty-icon">📋</text>
        <text class="empty-text">暂无抽奖记录</text>
      </view>

      <scroll-view v-else class="history-list" scroll-y>
        <view 
          v-for="record in (historyExpanded ? spinRecords : spinRecords.slice(0, 1))" 
          :key="record.id"
          class="history-item"
        >
          <view class="history-info">
            <text class="history-wheel">{{ record.wheelName }}</text>
            <text class="history-time">{{ formatTime(record.timestamp) }}</text>
          </view>
          <view class="history-result">
            <view class="result-color" :style="{ backgroundColor: record.optionColor }"></view>
            <text class="result-name">{{ record.optionName }}</text>
          </view>
        </view>
        
        <view v-if="spinRecords.length > 1" class="expand-btn" @click="historyExpanded = !historyExpanded">
          <text class="expand-text">{{ historyExpanded ? '收起' : `查看更多 (${spinRecords.length - 1})` }}</text>
          <text class="expand-icon">{{ historyExpanded ? '▲' : '▼' }}</text>
        </view>
      </scroll-view>
    </view>

    <view class="menu-section">
      <view class="menu-item-wrapper">
        <button class="menu-item menu-contact" open-type="contact">
          <text class="menu-icon">📞</text>
          <text class="menu-text">联系客服</text>
          <text class="menu-arrow">›</text>
        </button>
      </view>
      <view class="menu-item" @click="goToGuide">
        <text class="menu-icon">📖</text>
        <text class="menu-text">功能介绍</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getUserWheels, saveUserWheels, getSpinRecords, clearSpinRecords } from '@/utils/storage.js'

export default {
  data() {
    return {
      isLoggedIn: false,
      userInfo: null,
      myWheels: [],
      spinRecords: [],
      wheelsExpanded: false,
      historyExpanded: false,
      editingNickname: false,
      tempNickname: ''
    }
  },
  onLoad() {
    this.checkLoginStatus()
  },
  onShow() {
    this.checkLoginStatus()
    if (this.isLoggedIn) {
      this.loadMyWheels()
      this.loadSpinRecords()
    }
  },
  methods: {
    checkLoginStatus() {
      const userInfo = uni.getStorageSync('userInfo')
      this.isLoggedIn = !!userInfo
      this.userInfo = userInfo
    },
    loadMyWheels() {
      this.myWheels = getUserWheels()
    },
    loadSpinRecords() {
      this.spinRecords = getSpinRecords()
    },
    goToLogin() {
      uni.navigateTo({
        url: '/pages/login/login'
      })
    },
    handleLogout() {
      uni.showModal({
        title: '确认退出',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            uni.removeStorageSync('userInfo')
            uni.removeStorageSync('token')
            this.isLoggedIn = false
            this.userInfo = null
            this.myWheels = []
            this.spinRecords = []
            uni.showToast({
              title: '已退出登录',
              icon: 'success'
            })
          }
        }
      })
    },
    goToCreateWheel() {
      uni.navigateTo({
        url: '/pages/custom/custom'
      })
    },
    editWheel(wheel) {
      uni.navigateTo({
        url: `/pages/custom/custom?id=${wheel.id}`
      })
    },
    deleteWheel(wheelId) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个转盘吗？',
        success: (res) => {
          if (res.confirm) {
            const wheels = getUserWheels()
            const newWheels = wheels.filter(w => w.id !== wheelId)
            saveUserWheels(newWheels)
            this.loadMyWheels()
            uni.showToast({
              title: '删除成功',
              icon: 'success'
            })
          }
        }
      })
    },
    clearHistory() {
      uni.showModal({
        title: '确认清空',
        content: '确定要清空所有抽奖记录吗？',
        success: (res) => {
          if (res.confirm) {
            clearSpinRecords()
            this.spinRecords = []
            uni.showToast({
              title: '已清空',
              icon: 'success'
            })
          }
        }
      })
    },
    formatTime(timestamp) {
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now - date
      
      if (diff < 60000) {
        return '刚刚'
      } else if (diff < 3600000) {
        return `${Math.floor(diff / 60000)}分钟前`
      } else if (diff < 86400000) {
        return `${Math.floor(diff / 3600000)}小时前`
      } else if (diff < 604800000) {
        return `${Math.floor(diff / 86400000)}天前`
      } else {
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        const hour = date.getHours().toString().padStart(2, '0')
        const minute = date.getMinutes().toString().padStart(2, '0')
        return `${month}-${day} ${hour}:${minute}`
      }
    },
    onChooseAvatar(e) {
      const { avatarUrl } = e.detail
      this.userInfo.avatarUrl = avatarUrl
      uni.setStorageSync('userInfo', this.userInfo)
    },
    startEditNickname() {
      this.tempNickname = this.userInfo.nickName || ''
      this.editingNickname = true
    },
    handleInputFocus(e) {
      e.stopPropagation()
    },
    saveNickname(e) {
      if (e) {
        e.stopPropagation()
      }
      if (this.tempNickname && this.tempNickname.trim()) {
        this.userInfo.nickName = this.tempNickname.trim()
        uni.setStorageSync('userInfo', this.userInfo)
        uni.showToast({
          title: '昵称修改成功',
          icon: 'success'
        })
      }
      this.editingNickname = false
    },
    goToGuide() {
      uni.navigateTo({
        url: '/pages/guide/guide'
      })
    }
  }
}
</script>

<style scoped>
.container {
  height: calc(100vh - 120rpx);
  background: #F5F7FA;
  overflow: hidden;
  box-sizing: border-box;
}

.user-section {
  background: linear-gradient(135deg, #FF8A80 0%, #FF6B6B 50%, #FF8E53 100%);
  /* padding: 30rpx 30rpx 25rpx; */
  position: relative;
  overflow: hidden;
}

.user-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 300rpx;
  height: 300rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  pointer-events: none;
}

.login-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 30rpx;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #FF8A80 0%, #FF6B6B 50%, #FF8E53 100%);
  /* background: rgba(255, 255, 255, 0.95); */
  backdrop-filter: blur(10rpx);
}

.login-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10rpx);
  }
}

.login-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #333;
  margin-bottom: 10rpx;
  letter-spacing: 2rpx;
}

.login-desc {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 30rpx;
  text-align: center;
  line-height: 1.6;
}

.user-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 25rpx 30rpx;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #FF8A80 0%, #FF6B6B 50%, #FF8E53 100%);
  /* background: rgba(255, 255, 255, 0.95); */
  backdrop-filter: blur(10rpx);
}

.user-info-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.user-name-wrapper {
  flex: 1;
  margin-left: 20rpx;
}

.user-info-right {
  flex-shrink: 0;
}

.user-avatar-btn {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B6B, #FF8E53);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 6rpx 20rpx rgba(255, 107, 107, 0.4);
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  padding: 0;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.user-avatar-btn::after {
  border: none;
}

.user-avatar-btn:active {
  opacity: 0.8;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.avatar-text {
  font-size: 40rpx;
  font-weight: 700;
  color: white;
}

.user-name {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #333;
  letter-spacing: 1rpx;
  cursor: pointer;
}

.nickname-input {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #333;
  letter-spacing: 1rpx;
  border: none;
  background: transparent;
  padding: 0;
  width: 100%;
  outline: none;
}

.btn-logout {
  padding: 16rpx 32rpx;
  background: rgba(255, 255, 255, 0.8);
  color: #333;
  border-radius: 50rpx;
  font-size: 24rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.9);
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}

.btn-logout:active {
  background: rgba(255, 255, 255, 0.9);
}

.my-wheels-section {
  padding: 20rpx;
  background: white;
  border-radius: 24rpx;
  margin: 20rpx 0 0;
  box-shadow: 0 6rpx 24rpx rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15rpx;
  width: 100%;
}

.section-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #333;
  letter-spacing: 1rpx;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 18rpx;
}

.wheel-count {
  font-size: 26rpx;
  color: #999;
  font-weight: 500;
}

.btn-add-small {
  padding: 8rpx 40rpx;
  background: linear-gradient(135deg, #4ECDC4, #44A08D);
  color: white;
  border-radius: 50rpx;
  font-size: 30rpx;
  font-weight: 600;
  border: none;
  box-shadow: 0 6rpx 20rpx rgba(78, 205, 196, 0.4);
  transition: all 0.3s ease;
}

.btn-add-small:active {
  opacity: 0.8;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20rpx 20rpx 0;
  width: 100%;
}

.empty-icon {
  font-size: 100rpx;
  margin-bottom: 20rpx;
  opacity: 0.5;
  animation: float 3s ease-in-out infinite;
}

.empty-text {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 30rpx;
  font-weight: 500;
}

.wheel-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-bottom: 12rpx;
  width: 100%;
  max-height: 320rpx;
  overflow-y: auto;
}

.expand-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10rpx;
  background: linear-gradient(135deg, #F5F7FA, #E8ECF1);
  border-radius: 20rpx;
  transition: all 0.3s ease;
  border: 2rpx solid transparent;
}

.expand-btn:active {
  background: linear-gradient(135deg, #E8ECF1, #DDE2E6);
}

.expand-text {
  font-size: 24rpx;
  color: #666;
  font-weight: 500;
}

.expand-icon {
  font-size: 20rpx;
  color: #999;
}

.wheel-item {
  background: linear-gradient(135deg, #FFFFFF, #FAFBFC);
  border-radius: 20rpx;
  padding: 20rpx;
  margin: 0 0 10rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 2rpx solid #F0F2F5;
}

.wheel-item:active {
  transform: translateY(-2rpx);
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.12);
}

.wheel-preview {
  display: flex;
  height: 50rpx;
  border-radius: 12rpx;
  overflow: hidden;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.preview-item {
  flex: 1;
}

.wheel-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.wheel-name {
  font-size: 28rpx;
  font-weight: 700;
  color: #333;
}

.wheel-options {
  font-size: 24rpx;
  color: #999;
  font-weight: 500;
}

.wheel-actions {
  display: flex;
  gap: 14rpx;
}

.btn-edit,
.btn-delete {
  flex: 1;
  height: 70rpx;
  border-radius: 16rpx;
  font-size: 26rpx;
  border: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-edit {
  background: linear-gradient(135deg, #45B7D1, #2196F3);
  color: white;
  box-shadow: 0 4rpx 15rpx rgba(33, 150, 243, 0.35);
}

.btn-edit:active {
  opacity: 0.8;
}

.btn-delete {
  background: linear-gradient(135deg, #FF6B6B, #EE5A5A);
  color: white;
  box-shadow: 0 4rpx 15rpx rgba(255, 107, 107, 0.35);
}

.btn-delete:active {
  opacity: 0.8;
}

.menu-section {
  padding: 20rpx;
  background: white;
  border-radius: 24rpx;
  margin: 20rpx 0 0;
  box-shadow: 0 6rpx 24rpx rgba(0, 0, 0, 0.08);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  width: 100%;
  background: transparent;
  border: none;
  font-size: 28rpx;
  color: #333;
  text-align: left;
  border-radius: 16rpx;
  box-shadow: none;
  line-height: normal;
  transition: all 0.3s ease;
}

.menu-item-wrapper {
  margin-bottom: 12rpx;
}

.menu-item + .menu-item {
  margin-top: 12rpx;
  border-top: 2rpx solid #F5F7FA;
}

.menu-item:active {
  background: #F8F9FB;
  transform: translateX(5rpx);
}

.menu-item::after {
  border: none;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.menu-text {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.menu-arrow {
  font-size: 40rpx;
  color: #CCC;
  transition: all 0.3s ease;
}

.menu-item:active .menu-arrow {
  color: #999;
  transform: translateX(5rpx);
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80rpx;
  border-radius: 50rpx;
  font-size: 30rpx;
  font-weight: 700;
  border: none;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.18);
  letter-spacing: 2rpx;
  transition: all 0.3s ease;
}

.btn:active {
  opacity: 0.8;
}

.btn-primary {
  background: linear-gradient(135deg, #FF6B6B, #FF8E53);
  color: white;
  box-shadow: 0 8rpx 24rpx rgba(255, 107, 107, 0.45);
}

.btn-success {
  background: linear-gradient(135deg, #4ECDC4, #44A08D);
  color: white;
  box-shadow: 0 8rpx 24rpx rgba(78, 205, 196, 0.45);
}

.history-section {
  padding: 20rpx;
  background: white;
  border-radius: 24rpx;
  margin: 20rpx 0 0;
  box-shadow: 0 6rpx 24rpx rgba(0, 0, 0, 0.08);
}

.clear-btn {
  font-size: 26rpx;
  color: #FF6B6B;
  font-weight: 600;
  padding: 16rpx 24rpx;
  border-radius: 50rpx;
  background: rgba(255, 107, 107, 0.1);
  transition: all 0.3s ease;
}

.clear-btn:active {
  background: rgba(255, 107, 107, 0.2);
}

.history-list {
  max-height: 220rpx;
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  border-bottom: 2rpx solid #F5F7FA;
  transition: all 0.3s ease;
  border-radius: 12rpx;
}

.history-item:active {
  background: #F8F9FB;
  transform: translateX(5rpx);
}

.history-item:last-child {
  border-bottom: none;
}

.history-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.history-wheel {
  font-size: 26rpx;
  color: #666;
  font-weight: 600;
}

.history-time {
  font-size: 22rpx;
  color: #999;
  font-weight: 500;
}

.history-result {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 10rpx 16rpx;
  background: linear-gradient(135deg, #F8F9FB, #F0F2F5);
  border-radius: 50rpx;
}

.result-color {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  box-shadow: 0 3rpx 10rpx rgba(0, 0, 0, 0.15);
  border: 2rpx solid rgba(255, 255, 255, 0.5);
}

.result-name {
  font-size: 26rpx;
  font-weight: 700;
  color: #333;
}
</style>