# 幸运转盘微信小程序

基于uniapp开发的幸运转盘微信小程序，支持自定义转盘标题、选项和颜色。

## 功能特性

- 🎡 默认转盘：开发者预设的默认转盘，所有用户都可以使用
- 🔐 微信登录：支持微信一键登录
- ✨ 自定义转盘：登录后可创建多个自定义转盘
- 🎨 自动配色：转盘选项颜色自动生成，支持彩色样式
- 📊 百分比控制：可精确控制每个选项的占比
- 💾 本地存储：用户转盘配置本地保存

## 项目结构

```
turntable/
├── components/          # 组件目录
│   └── wheel/          # 转盘组件
│       └── wheel.vue   # 转盘组件实现
├── pages/              # 页面目录
│   ├── index/          # 首页
│   │   └── index.vue   # 转盘展示页面
│   ├── login/          # 登录页
│   │   └── login.vue   # 微信登录页面
│   └── custom/         # 自定义页
│       └── custom.vue  # 自定义转盘页面
├── static/             # 静态资源
│   └── css/            # 样式文件
│       └── common.css  # 公共样式
├── utils/              # 工具函数
│   ├── wheel.js        # 转盘相关工具
│   └── storage.js      # 存储相关工具
├── App.vue             # 应用入口
├── main.js             # 主入口文件
├── pages.json          # 页面配置
├── manifest.json       # 应用配置
└── package.json        # 依赖配置
```

## 使用说明

### 1. 安装依赖

```bash
npm install
```

### 2. 开发运行

```bash
npm run dev:mp-weixin
```

### 3. 构建发布

```bash
npm run build:mp-weixin
```

### 4. 微信开发者工具

1. 打开微信开发者工具
2. 导入项目，选择 `dist/dev/mp-weixin` 目录
3. 在 `manifest.json` 中配置你的小程序 `appid`

## 主要功能说明

### 转盘组件

转盘组件支持以下配置：
- `options`: 转盘选项数组，每个选项包含 `name`（名称）、`percentage`（百分比）、`color`（颜色）
- `size`: 转盘大小，默认300px
- `duration`: 转动时长，默认3000ms

### 自定义转盘

登录后可以创建自定义转盘：
- 设置转盘名称
- 添加多个选项（至少2个）
- 设置每个选项的百分比（总和必须为100%）
- 颜色自动生成
- 支持编辑和删除

### 数据存储

- 使用 `uni.setStorageSync` 和 `uni.getStorageSync` 进行本地存储
- 用户信息存储在 `userInfo` 中
- 转盘数据存储在 `turntable_data` 中

## 注意事项

1. 首次使用需要在 `manifest.json` 中配置微信小程序 `appid`
2. 微信登录功能需要在小程序后台配置相关权限
3. 转盘选项百分比总和必须为100%
4. 至少需要2个转盘选项

## 技术栈

- uniapp：跨平台开发框架
- Vue 3：前端框架
- Canvas：转盘绘制
- 微信小程序API：登录、存储等

## 开发建议

1. 使用HBuilderX进行开发，可以获得更好的开发体验
2. 转盘组件可以独立使用，支持在其他项目中复用
3. 可以根据需要调整转盘的动画效果和样式
4. 建议添加更多的转盘模板供用户选择

## 许可证

MIT License
