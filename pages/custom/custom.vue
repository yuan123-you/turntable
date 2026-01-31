<template>
  <view class="container">
    <view class="header">
      <text class="title">我的转盘</text>
      <button class="btn-add" @click="createNewWheel">+ 新建</button>
    </view>

    <view v-if="!isLoggedIn" class="login-tip">
      <text class="tip-text">请先登录后使用自定义转盘功能</text>
      <button class="btn-login" @click="goToLogin">去登录</button>
    </view>

    <view v-else>
      <view v-if="userWheels.length === 0" class="empty-state">
        <text class="empty-icon">🎡</text>
        <text class="empty-text">还没有创建转盘</text>
        <text class="empty-desc">点击上方"新建"按钮创建你的第一个转盘</text>
      </view>

      <view v-else class="wheel-list">
        <view 
          v-for="wheel in userWheels" 
          :key="wheel.id"
          class="wheel-card"
        >
          <view class="wheel-info">
            <text class="wheel-name">{{ wheel.name }}</text>
            <text class="wheel-options">{{ wheel.options.length }} 个选项</text>
          </view>
          
          <view class="wheel-preview">
            <view 
              v-for="(option, index) in wheel.options" 
              :key="index"
              class="preview-item"
              :style="{ backgroundColor: option.color }"
            ></view>
          </view>
          
          <view class="wheel-actions">
            <button class="btn-edit" @click="editWheel(wheel)">编辑</button>
            <button class="btn-delete" @click="deleteWheel(wheel.id)">删除</button>
          </view>
        </view>
      </view>
    </view>

    <view v-if="showEditor" class="editor-modal" @click="closeEditor">
      <view class="editor-content" @click.stop>
        <view class="editor-header">
          <text class="editor-title">{{ isEditing ? '编辑转盘' : '新建转盘' }}</text>
          <text class="btn-close" @click="closeEditor">×</text>
        </view>

        <view class="editor-body">
          <view class="input-group">
            <text class="input-label">转盘名称</text>
            <input 
              class="input-field" 
              v-model="currentWheel.name" 
              placeholder="请输入转盘名称"
              maxlength="20"
            />
          </view>

          <view class="options-section">
            <view class="section-header">
              <text class="section-title">转盘选项</text>
              <button class="btn-add-option" @click="addOption">+ 添加选项</button>
            </view>

            <view class="options-list">
              <view 
                v-for="(option, index) in currentWheel.options" 
                :key="index"
                class="option-item"
              >
                <view class="option-color" :style="{ backgroundColor: option.color }"></view>
                <input 
                  class="option-name" 
                  v-model="option.name" 
                  placeholder="选项名称"
                  maxlength="10"
                />
                <text class="btn-remove-option" @click="removeOption(index)">×</text>
              </view>
            </view>
          </view>
        </view>

        <view class="editor-footer">
          <button class="btn-cancel" @click="closeEditor">取消</button>
          <button 
            class="btn-save" 
            @click="saveWheel"
            :disabled="!isValid"
          >
            保存
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getUserWheels, addUserWheel, updateUserWheel, deleteUserWheel } from '@/utils/storage.js'
import { generateColor, validateOptions } from '@/utils/wheel.js'

export default {
  data() {
    return {
      isLoggedIn: false,
      userWheels: [],
      showEditor: false,
      isEditing: false,
      currentWheel: {
        id: '',
        name: '',
        options: []
      }
    }
  },
  computed: {
    isValid() {
      const validation = validateOptions(this.currentWheel.options)
      return validation.valid && this.currentWheel.name.trim() !== ''
    }
  },
  onLoad(options) {
    this.checkLoginStatus()
    this.loadUserWheels()
    
    if (options.id) {
      this.editWheelById(options.id)
    }
  },
  onShow() {
    this.checkLoginStatus()
    this.loadUserWheels()
  },
  methods: {
    checkLoginStatus() {
      const userInfo = uni.getStorageSync('userInfo')
      this.isLoggedIn = !!userInfo
    },
    loadUserWheels() {
      this.userWheels = getUserWheels()
    },
    editWheelById(wheelId) {
      const wheel = this.userWheels.find(w => w.id === wheelId)
      if (wheel) {
        this.isEditing = true
        this.currentWheel = JSON.parse(JSON.stringify(wheel))
        this.showEditor = true
      }
    },
    createNewWheel() {
      if (!this.isLoggedIn) {
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        })
        return
      }
      
      this.isEditing = false
      this.currentWheel = {
        id: '',
        name: '',
        options: [
          { name: '', color: generateColor(0, 2) },
          { name: '', color: generateColor(1, 2) }
        ]
      }
      this.showEditor = true
    },
    editWheel(wheel) {
      this.isEditing = true
      this.currentWheel = JSON.parse(JSON.stringify(wheel))
      this.showEditor = true
    },
    closeEditor() {
      this.showEditor = false
      this.currentWheel = {
        id: '',
        name: '',
        options: []
      }
    },
    addOption() {
      const newOption = {
        name: '',
        color: generateColor(this.currentWheel.options.length, this.currentWheel.options.length + 1)
      }
      this.currentWheel.options.push(newOption)
    },
    removeOption(index) {
      if (this.currentWheel.options.length <= 2) {
        uni.showToast({
          title: '至少需要2个选项',
          icon: 'none'
        })
        return
      }
      this.currentWheel.options.splice(index, 1)
      
      this.currentWheel.options.forEach((opt, i) => {
        opt.color = generateColor(i, this.currentWheel.options.length)
      })
    },
    saveWheel() {
      if (!this.isValid) {
        const validation = validateOptions(this.currentWheel.options)
        if (!validation.valid) {
          uni.showToast({
            title: validation.message,
            icon: 'none'
          })
        } else if (this.currentWheel.name.trim() === '') {
          uni.showToast({
            title: '请输入转盘名称',
            icon: 'none'
          })
        }
        return
      }
      
      if (this.isEditing) {
        updateUserWheel(this.currentWheel.id, this.currentWheel)
        uni.showToast({
          title: '保存成功',
          icon: 'success'
        })
      } else {
        this.currentWheel.id = 'wheel_' + Date.now()
        addUserWheel(this.currentWheel)
        uni.showToast({
          title: '创建成功',
          icon: 'success'
        })
      }
      
      this.loadUserWheels()
      this.closeEditor()
      
      setTimeout(() => {
        uni.switchTab({
          url: '/pages/mine/mine'
        })
      }, 500)
    },
    deleteWheel(wheelId) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个转盘吗？',
        success: (res) => {
          if (res.confirm) {
            deleteUserWheel(wheelId)
            this.loadUserWheels()
            uni.showToast({
              title: '删除成功',
              icon: 'success'
            })
          }
        }
      })
    },
    goToLogin() {
      uni.navigateTo({
        url: '/pages/login/login'
      })
    }
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #F8F9FB;
  padding: 30rpx;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30rpx;
}

.title {
  font-size: 40rpx;
  font-weight: 600;
  color: #333;
  letter-spacing: 1rpx;
}

.btn-add {
  padding: 18rpx 36rpx;
  background: linear-gradient(135deg, #4ECDC4, #44A08D);
  color: white;
  border-radius: 50rpx;
  font-size: 28rpx;
  border: none;
  font-weight: 500;
  box-shadow: 0 4rpx 15rpx rgba(78, 205, 196, 0.4);
  margin: 0;
}

.login-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 40rpx;
}

.tip-text {
  font-size: 32rpx;
  color: #666;
  margin-bottom: 40rpx;
  font-weight: 400;
}

.btn-login {
  padding: 25rpx 70rpx;
  background: linear-gradient(135deg, #4ECDC4, #44A08D);
  color: white;
  border-radius: 50rpx;
  font-size: 32rpx;
  border: none;
  font-weight: 600;
  box-shadow: 0 6rpx 20rpx rgba(78, 205, 196, 0.4);
  letter-spacing: 1rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 150rpx 40rpx;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 30rpx;
  opacity: 0.6;
}

.empty-text {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 20rpx;
  font-weight: 500;
}

.empty-desc {
  font-size: 28rpx;
  color: #999;
  text-align: center;
  font-weight: 400;
}

.wheel-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.wheel-card {
  background: white;
  border-radius: 24rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.wheel-info {
  margin-bottom: 24rpx;
}

.wheel-name {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 12rpx;
  letter-spacing: 1rpx;
}

.wheel-options {
  font-size: 26rpx;
  color: #999;
  font-weight: 400;
}

.wheel-preview {
  display: flex;
  height: 24rpx;
  border-radius: 12rpx;
  overflow: hidden;
  margin-bottom: 24rpx;
}

.preview-item {
  height: 100%;
  flex: 1;
}

.wheel-actions {
  display: flex;
  gap: 20rpx;
}

.btn-edit,
.btn-delete {
  flex: 1;
  height: 70rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  border: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-edit {
  background: linear-gradient(135deg, #45B7D1, #2196F3);
  color: white;
  box-shadow: 0 4rpx 15rpx rgba(33, 150, 243, 0.3);
}

.btn-delete {
  background: linear-gradient(135deg, #FF6B6B, #EE5A5A);
  color: white;
  box-shadow: 0 4rpx 15rpx rgba(255, 107, 107, 0.3);
}

.editor-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(10rpx);
}

.editor-content {
  background: white;
  border-radius: 30rpx;
  width: 90%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 12rpx 50rpx rgba(0, 0, 0, 0.25);
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 35rpx 30rpx;
  border-bottom: 2rpx solid #F5F7FA;
}

.editor-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  letter-spacing: 1rpx;
}

.btn-close {
  font-size: 60rpx;
  color: #999;
  line-height: 1;
  font-weight: 300;
}

.editor-body {
  flex: 1;
  overflow-y: auto;
  padding: 35rpx 30rpx;
}

.input-group {
  margin-bottom: 45rpx;
}

.input-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 18rpx;
  font-weight: 500;
}

.input-field {
  width: 100%;
  height: 85rpx;
  padding: 0 25rpx;
  border: 2rpx solid #E8ECF1;
  border-radius: 12rpx;
  font-size: 28rpx;
  background: #F8F9FB;
  transition: all 0.3s ease;
}

.input-field:focus {
  background: white;
  border-color: #4ECDC4;
}

.options-section {
  margin-bottom: 30rpx;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25rpx;
}

.section-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.btn-add-option {
  padding: 12rpx 24rpx;
  background: linear-gradient(135deg, #4ECDC4, #44A08D);
  color: white;
  border-radius: 50rpx;
  font-size: 24rpx;
  border: none;
  font-weight: 500;
  box-shadow: 0 2rpx 10rpx rgba(78, 205, 196, 0.3);
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 18rpx;
}

.option-color {
  width: 65rpx;
  height: 65rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.option-name {
  flex: 1;
  height: 65rpx;
  padding: 0 18rpx;
  border: 2rpx solid #E8ECF1;
  border-radius: 12rpx;
  font-size: 26rpx;
  background: #F8F9FB;
  transition: all 0.3s ease;
}

.option-name:focus {
  background: white;
  border-color: #4ECDC4;
}

.btn-remove-option {
  width: 65rpx;
  height: 65rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FF6B6B, #EE5A5A);
  color: white;
  border-radius: 12rpx;
  font-size: 40rpx;
  line-height: 1;
  box-shadow: 0 2rpx 10rpx rgba(255, 107, 107, 0.3);
}

.editor-footer {
  display: flex;
  gap: 20rpx;
  padding: 35rpx 30rpx;
  border-top: 2rpx solid #F5F7FA;
}

.btn-cancel,
.btn-save {
  flex: 1;
  height: 85rpx;
  border-radius: 12rpx;
  font-size: 32rpx;
  border: none;
  font-weight: 600;
  letter-spacing: 1rpx;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: #F5F7FA;
  color: #666;
}

.btn-cancel:active {
  background: #E8ECF1;
}

.btn-save {
  background: linear-gradient(135deg, #4ECDC4, #44A08D);
  color: white;
  box-shadow: 0 4rpx 15rpx rgba(78, 205, 196, 0.4);
}

.btn-save:active {
  box-shadow: 0 2rpx 10rpx rgba(78, 205, 196, 0.3);
}

.btn-save[disabled] {
  opacity: 0.5;
  box-shadow: none;
}
</style>