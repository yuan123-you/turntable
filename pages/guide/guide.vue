<template>
  <view class="container">
    <view class="header">
      <text class="title">功能介绍</text>
      <text class="subtitle">幸运转盘 v1.0.0</text>
    </view>

    <scroll-view class="content" scroll-y>
      <view class="section">
        <view class="section-title">
          <text class="icon">🎯</text>
          <text class="text">快速抽奖</text>
        </view>
        <view class="section-content">
          <view class="item">
            <text class="item-title">开始抽奖</text>
            <text class="item-desc">点击"开始"按钮即可启动转盘</text>
          </view>
          <view class="item">
            <text class="item-title">自动停止</text>
            <text class="item-desc">转盘会自动停止并显示结果</text>
          </view>
        </view>
      </view>

      <view class="section">
        <view class="section-title">
          <text class="icon">⚙️</text>
          <text class="text">自定义转盘</text>
        </view>
        <view class="section-content">
          <view class="item">
            <text class="item-title">个性化设置</text>
            <text class="item-desc">可创建个性化转盘</text>
          </view>
          <view class="item">
            <text class="item-title">自定义选项</text>
            <text class="item-desc">自定义选项名称和颜色</text>
          </view>
          <view class="item">
            <text class="item-title">灵活添加</text>
            <text class="item-desc">支持添加任意数量的选项</text>
          </view>
        </view>
      </view>

      <view class="section">
        <view class="section-title">
          <text class="icon">📋</text>
          <text class="text">抽奖记录</text>
        </view>
        <view class="section-content">
          <view class="item">
            <text class="item-title">自动保存</text>
            <text class="item-desc">自动保存抽奖历史</text>
          </view>
          <view class="item">
            <text class="item-title">随时查看</text>
            <text class="item-desc">随时查看过往结果</text>
          </view>
        </view>
      </view>

      <view class="section">
        <view class="section-title">
          <text class="icon">🔧</text>
          <text class="text">转盘管理</text>
        </view>
        <view class="section-content">
          <view class="item">
            <text class="item-title">编辑转盘</text>
            <text class="item-desc">编辑已创建的转盘</text>
          </view>
          <view class="item">
            <text class="item-title">删除转盘</text>
            <text class="item-desc">删除不需要的转盘</text>
          </view>
        </view>
      </view>

      <view class="footer">
        <text class="footer-text">使用方法简单直观，适合各种抽奖场景！</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #F8F9FB;
  display: flex;
  flex-direction: column;
}

.header {
  background: linear-gradient(135deg, #FF6B6B, #FF8E53);
  padding: 70rpx 30rpx 50rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 52rpx;
  font-weight: 600;
  color: white;
  margin-bottom: 12rpx;
  letter-spacing: 2rpx;
}

.subtitle {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 400;
}

.content {
  flex: 1;
  padding: 30rpx;
}

.section {
  background: white;
  border-radius: 24rpx;
  padding: 35rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.section:active {
  transform: translateY(-2rpx);
  box-shadow: 0 6rpx 25rpx rgba(0, 0, 0, 0.08);
}

.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 25rpx;
  padding-bottom: 25rpx;
  border-bottom: 2rpx solid #F5F7FA;
}

.icon {
  font-size: 44rpx;
  margin-right: 18rpx;
}

.text {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  letter-spacing: 1rpx;
}

.section-content {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.item {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.item-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.item-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.7;
  font-weight: 400;
}

.footer {
  text-align: center;
  padding: 50rpx 30rpx;
}

.footer-text {
  font-size: 26rpx;
  color: #999;
  line-height: 1.7;
  font-weight: 400;
}
</style>
