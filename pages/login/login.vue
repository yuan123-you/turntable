<template>
  <view class="container">
    <view class="login-card">
      <view class="logo-section">
        <text class="logo-icon">🎡</text>
        <text class="app-name">幸运转盘</text>
        <text class="app-desc">自定义你的专属转盘</text>
      </view>

      <view class="login-section">
        <button 
          class="btn-wechat" 
          @click="handleWechatLogin"
        >
          <text class="btn-icon">💬</text>
          <text class="btn-text">微信一键登录</text>
        </button>

        <view class="tips">
          <text class="tips-text">登录后可以：</text>
          <text class="tips-item">• 创建自定义转盘</text>
          <text class="tips-item">• 保存你的转盘配置</text>
          <text class="tips-item">• 随时使用自定义转盘</text>
        </view>
      </view>

      <view class="skip-section">
        <text class="skip-text" @click="handleSkip">暂不登录，先看看</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false
    }
  },
  methods: {
    async handleWechatLogin() {
      if (this.isLoading) return
      
      this.isLoading = true
      
      try {
        uni.showLoading({
          title: '登录中...'
        })
        
        const userInfo = await this.getUserProfile()
        
        const loginRes = await this.getWxLoginCode()
        
        const userData = {
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl,
          gender: userInfo.gender,
          language: userInfo.language,
          city: userInfo.city,
          province: userInfo.province,
          country: userInfo.country,
          loginTime: Date.now()
        }
        
        uni.setStorageSync('userInfo', userData)
        uni.setStorageSync('loginCode', loginRes.code)
        
        uni.hideLoading()
        
        uni.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1500
        })
        
        setTimeout(() => {
          uni.reLaunch({
            url: '/pages/index/index'
          })
        }, 1500)
        
      } catch (error) {
        uni.hideLoading()
        uni.showToast({
          title: '登录失败，请重试',
          icon: 'none'
        })
        console.error('登录错误:', error)
      } finally {
        this.isLoading = false
      }
    },
    
    getWxLoginCode() {
      return new Promise((resolve, reject) => {
        uni.login({
          provider: 'weixin',
          success: (res) => {
            resolve(res)
          },
          fail: (err) => {
            reject(err)
          }
        })
      })
    },
    
    getUserProfile() {
      return new Promise((resolve, reject) => {
        uni.getUserProfile({
          desc: '用于完善用户资料',
          success: (res) => {
            resolve(res.userInfo)
          },
          fail: (err) => {
            reject(err)
          }
        })
      })
    },
    
    handleSkip() {
      uni.reLaunch({
        url: '/pages/index/index'
      })
    }
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #FF6B6B 0%, #FF8E53 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.login-card {
  background: white;
  border-radius: 30rpx;
  padding: 70rpx 50rpx;
  width: 100%;
  box-shadow: 0 12rpx 50rpx rgba(0, 0, 0, 0.25);
}

.logo-section {
  text-align: center;
  margin-bottom: 90rpx;
}

.logo-icon {
  display: block;
  font-size: 130rpx;
  margin-bottom: 25rpx;
}

.app-name {
  display: block;
  font-size: 48rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 12rpx;
  letter-spacing: 2rpx;
}

.app-desc {
  display: block;
  font-size: 28rpx;
  color: #999;
  font-weight: 400;
}

.login-section {
  margin-bottom: 70rpx;
}

.btn-wechat {
  width: 100%;
  height: 95rpx;
  background: linear-gradient(135deg, #07C160, #06AD56);
  border-radius: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 8rpx 25rpx rgba(7, 193, 96, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-wechat:active {
  transform: scale(0.96);
  box-shadow: 0 4rpx 15rpx rgba(7, 193, 96, 0.4);
}

.btn-icon {
  font-size: 44rpx;
  margin-right: 12rpx;
}

.btn-text {
  font-size: 32rpx;
  font-weight: 600;
  color: white;
  letter-spacing: 1rpx;
}

.tips {
  margin-top: 45rpx;
  padding: 35rpx;
  background: #F5F7FA;
  border-radius: 24rpx;
}

.tips-text {
  display: block;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 25rpx;
  font-weight: 500;
}

.tips-item {
  display: block;
  font-size: 26rpx;
  color: #999;
  margin-bottom: 12rpx;
  padding-left: 20rpx;
  font-weight: 400;
}

.tips-item:last-child {
  margin-bottom: 0;
}

.skip-section {
  text-align: center;
}

.skip-text {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: underline;
  font-weight: 400;
  transition: opacity 0.3s ease;
}

.skip-text:active {
  opacity: 0.7;
}
</style>