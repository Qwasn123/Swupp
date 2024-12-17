# SWUPP Frontend | SWUPP 前端项目

[English](#english) | [中文](#chinese)

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
```

---

<a id="chinese"></a>
## 中文

这是一个使用 Vue 3 和 Vite 构建的现代化 Web 应用程序，旨在为大学社区内的二手商品交易提供流畅的用户体验。该应用程序具有健壮的身份验证系统、高效的文件上传功能，并使用 Element Plus 提供清晰直观的用户界面。

### 🚀 功能特性

#### 核心功能
- **用户认证**
  - 安全的登录和注册系统
  - 基于 JWT 的身份验证
  - 密码加密和安全措施
  - 用户资料管理

- **商品管理**
  - 创建和编辑商品列表
  - 多图片上传支持
  - 富文本描述编辑器
  - 分类和标签管理

- **用户界面**
  - 适配所有设备的响应式设计
  - 使用 Element Plus 的现代清爽界面
  - 流畅的动画和过渡效果
  - 直观的导航系统

- **搜索和筛选**
  - 高级搜索功能
  - 基于分类的筛选
  - 价格区间筛选
  - 多种排序方式

### 🛠 技术栈

#### 核心技术
- **Vue 3**: 最新的 Vue 框架，使用组合式 API
- **Vite**: 下一代前端构建工具
- **Element Plus**: 高品质 UI 组件库
- **Pinia**: 支持 Vue 3 的状态管理
- **Vue Router**: 官方路由管理器
- **Tailwind CSS**: 实用优先的 CSS 框架
- **Axios**: 基于 Promise 的 HTTP 客户端

#### 开发工具
- **ESLint**: JavaScript 代码检查工具
- **Prettier**: 代码格式化工具
- **PostCSS**: CSS 转换工具
- **Autoprefixer**: 自动添加浏览器前缀

### 📁 项目结构

```
src/
├── api/                  # API 集成层
│   ├── auth.js          # 认证相关 API
│   └── upload.js        # 文件上传处理
├── assets/              # 静态资源（图片、字体）
├── components/          # 可复用的 Vue 组件
│   ├── common/          # 通用 UI 组件
│   └── product/         # 商品相关组件
├── router/              # 路由配置
│   └── index.js         # 主路由设置
├── stores/              # Pinia 状态存储
│   ├── auth.js          # 认证状态
│   └── product.js       # 商品管理状态
├── utils/               # 工具函数
│   ├── request.js       # Axios 配置
│   └── validators.js    # 表单验证器
└── views/               # 页面组件
    ├── Login.vue        # 用户认证
    ├── Mine.vue         # 用户资料
    └── Product/         # 商品相关页面
```

### 🚦 快速开始

#### 环境要求
- Node.js (v16.0.0 或更高)
- npm (v7.0.0 或更高) 或 yarn
- 现代浏览器

#### 安装
```bash
git clone [仓库地址]
cd swupp-frontend
npm install  # 或 yarn install
```

#### 开发
```bash
npm run dev  # 或 yarn dev
```
访问 `http://localhost:5173`

#### 生产构建
```bash
npm run build  # 或 yarn build
npm run preview  # 或 yarn preview
```

### 🔧 配置

#### 环境变量
创建 `.env` 文件：
```env
VITE_API_BASE_URL=你的API基础URL
VITE_UPLOAD_URL=你的上传端点
```

### 📝 开发指南

#### 组件开发
- 使用 Vue 3 的 `<script setup>` 语法
- 实现适当的 prop 验证和文档
- 使用组合式函数进行逻辑复用
- 遵循 Vue.js 风格指南建议

#### 状态管理
- 使用 Pinia 存储进行全局状态管理
- 实现模块化的存储设计
- 使用计算属性处理派生状态
- 在 actions 中处理异步操作

#### API 集成
- 在 `api` 目录中集中管理 API 调用
- 实现适当的错误处理
- 使用拦截器处理通用请求/响应
- 适当缓存响应数据

#### CSS/样式
- 使用 Tailwind 工具类进行自定义样式
- 遵循 BEM 方法论编写自定义 CSS
- 保持响应式设计原则
- 使用 CSS 变量进行主题设置

### 🤝 贡献指南

1. Fork 仓库
2. 创建特性分支 (`git checkout -b feature/新特性`)
3. 提交更改 (`git commit -m '添加新特性'`)
4. 推送到分支 (`git push origin feature/新特性`)
5. 提交 Pull Request

### 📄 许可证

本项目基于 MIT 许可证开源 - 查看 LICENSE 文件了解详情

### 📞 支持

如需支持，请联系开发团队或在仓库中提出 Issue。
