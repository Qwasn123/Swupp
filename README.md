# SWUPP Frontend | SWUPP 前端项目

[中文](#chinese) | [English](#english)

<a id="chinese"></a>
## 🌟 SWUPP - 校园二手交易平台

> 让闲置物品流转起来，让校园生活更加环保与便利

SWUPP 是一个专为大学校园打造的现代化二手交易平台，采用 Vue 3 和 Vite 构建，致力于为校园社区提供安全、便捷、高效的二手物品交易体验。项目特色包括强大的用户认证系统、高效的文件处理能力，以及基于 Element Plus 打造的简洁优雅的用户界面。

### ✨ 核心特性

#### 🔐 用户体验
- **智能认证系统**
  - 安全可靠的登录注册流程
  - JWT 令牌认证机制
  - 多重安全防护措施
  - 个性化用户主页

#### 🛍️ 商品管理
- **全方位交易支持**
  - 便捷的商品发布与编辑
  - 智能图片批量上传
  - 专业富文本编辑器
  - 灵活的分类标签系统

#### 🎨 界面设计
- **现代化交互体验**
  - 全设备自适应布局
  - 简约时尚的视觉风格
  - 流畅细腻的动效设计
  - 人性化的操作逻辑

#### 🔍 智能检索
- **精准查找功能**
  - 多维度搜索系统
  - 智能分类筛选
  - 价格区间划分
  - 个性化排序选项

### 🛠️ 技术方案

#### 核心技术栈
- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 新一代前端构建工具
- **Element Plus** - 优质组件库
- **Pinia** - 现代化状态管理
- **Vue Router** - 路由管理器
- **Tailwind CSS** - 实用型样式框架
- **Axios** - HTTP 网络请求

#### 开发工具链
- **ESLint** - 代码质量把控
- **Prettier** - 代码风格统一
- **PostCSS** - CSS 后处理器
- **Autoprefixer** - 浏览器兼容优化

### 📦 项目结构

```
src/
├── api/                  # API 接口层
│   ├── auth.js          # 认证接口
│   └── upload.js        # 上传处理
├── assets/              # 静态资源
├── components/          # 组件库
│   ├── common/          # 通用组件
│   └── product/         # 商品组件
├── router/              # 路由配置
├── stores/              # 状态管理
├── utils/               # 工具函数
└── views/               # 页面视图
```

### 🚀 快速上手

#### 环境准备
- Node.js (v16.0.0+)
- npm (v7.0.0+) 或 yarn
- 现代浏览器支持

#### 安装部署
```bash
# 克隆项目
git clone [仓库地址]
cd swupp-frontend

# 安装依赖
npm install  # 或 yarn install

# 启动开发服务器
npm run dev  # 或 yarn dev

# 生产环境构建
npm run build  # 或 yarn build
```

#### 环境配置
创建 `.env` 文件：
```env
VITE_API_BASE_URL=你的API地址
VITE_UPLOAD_URL=上传服务端点
```

---

<a id="english"></a>
## English

A modern web application built with Vue 3 and Vite, designed to provide a seamless user experience for second-hand product trading within university communities. The application features a robust authentication system, efficient file upload capabilities, and a clean, intuitive user interface powered by Element Plus.

### 🚀 Features

#### Core Functionality
- **User Authentication**
  - Secure login and registration system
  - JWT-based authentication
  - Password encryption and security measures
  - User profile management

- **Product Management**
  - Create and edit product listings
  - Multi-image upload support
  - Rich text description editor
  - Category and tag management

- **User Interface**
  - Responsive design for all devices
  - Modern and clean UI with Element Plus
  - Smooth animations and transitions
  - Intuitive navigation system

- **Search & Filter**
  - Advanced search functionality
  - Category-based filtering
  - Price range filtering
  - Sort by various criteria

### 🛠 Tech Stack

#### Core Technologies
- **Vue 3**: Latest Vue framework with Composition API
- **Vite**: Next-generation frontend build tool
- **Element Plus**: Premium UI components
- **Pinia**: State management with Vue 3 compatibility
- **Vue Router**: Official router
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: Promise-based HTTP client

#### Development Tools
- **ESLint**: JavaScript linting utility
- **Prettier**: Code formatter
- **PostCSS**: CSS transformation tool
- **Autoprefixer**: Vendor prefix management

### 📁 Project Structure

```
src/
├── api/                  # API integration layers
│   ├── auth.js          # Authentication related APIs
│   └── upload.js        # File upload handling
├── assets/              # Static assets (images, fonts)
├── components/          # Reusable Vue components
│   ├── common/          # Generic UI components
│   └── product/         # Product-specific components
├── router/              # Route configurations
│   └── index.js         # Main router setup
├── stores/              # Pinia state stores
│   ├── auth.js          # Authentication state
│   └── product.js       # Product management state
├── utils/               # Utility functions
│   ├── request.js       # Axios configuration
│   └── validators.js    # Form validators
└── views/               # Page components
    ├── Login.vue        # User authentication
    ├── Mine.vue         # User profile
    └── Product/         # Product-related pages
```

### 🚦 Getting Started

#### Prerequisites
- Node.js (v16.0.0 or higher)
- npm (v7.0.0 or higher) or yarn
- Modern web browser

#### Installation
```bash
git clone [repository-url]
cd swupp-frontend
npm install  # or yarn install
```

#### Development
```bash
npm run dev  # or yarn dev
```
Access at `http://localhost:5173`

#### Production Build
```bash
npm run build  # or yarn build
npm run preview  # or yarn preview
```

### 🔧 Configuration

#### Environment Variables
Create `.env`:
```env
VITE_API_BASE_URL=your_api_base_url
VITE_UPLOAD_URL=your_upload_endpoint
