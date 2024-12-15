<template>
  <div class="fixed inset-0 flex flex-col bg-gray-50">
    <!-- 桌面端侧边导航 -->
    <nav class="hidden lg:flex flex-col w-64 bg-white shadow-soft h-full fixed left-0 top-0">
      <div class="p-6">
        <h1 class="text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">SWUPP</h1>
      </div>
      <div class="flex-1 flex flex-col space-y-1 p-4">
        <router-link to="/" 
          class="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200"
          :class="{ 'bg-primary-50 text-primary-600': $route.path === '/' }">
          <el-icon><List /></el-icon>
          <span class="font-medium">任务中心</span>
        </router-link>
        <router-link to="/market"
          class="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200"
          :class="{ 'bg-primary-50 text-primary-600': $route.path === '/market' }">
          <el-icon><Shop /></el-icon>
          <span class="font-medium">跳蚤市场</span>
        </router-link>
        <router-link to="/publish"
          class="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200"
          :class="{ 'bg-primary-50 text-primary-600': $route.path === '/publish' }">
          <el-icon><Plus /></el-icon>
          <span class="font-medium">发布</span>
        </router-link>
        <router-link to="/messages"
          class="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200"
          :class="{ 'bg-primary-50 text-primary-600': $route.path === '/messages' }">
          <el-icon><Message /></el-icon>
          <span class="font-medium">消息</span>
        </router-link>
        <router-link to="/mine"
          class="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200"
          :class="{ 'bg-primary-50 text-primary-600': $route.path === '/mine' }">
          <el-icon><User /></el-icon>
          <span class="font-medium">我的</span>
        </router-link>
      </div>
    </nav>

    <!-- 主内容区 -->
    <main class="flex-1 overflow-auto lg:ml-64">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- 移动端底部导航 -->
    <nav v-if="$route.path !== '/login'" class="lg:hidden flex items-center bg-white border-t py-2 fixed bottom-0 left-0 right-0">
      <router-link to="/" class="flex-1 flex flex-col items-center">
        <el-icon :class="{ 'text-primary-600': $route.path === '/' }"><List /></el-icon>
        <span class="text-xs mt-1" :class="{ 'text-primary-600': $route.path === '/' }">任务中心</span>
      </router-link>
      <router-link to="/market" class="flex-1 flex flex-col items-center">
        <el-icon :class="{ 'text-primary-600': $route.path === '/market' }"><Shop /></el-icon>
        <span class="text-xs mt-1" :class="{ 'text-primary-600': $route.path === '/market' }">跳蚤市场</span>
      </router-link>
      <div class="flex-1 flex flex-col items-center">
        <router-link to="/publish" class="w-14 h-14 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center -mt-8">
          <el-icon class="text-white text-xl"><Plus /></el-icon>
        </router-link>
        <span class="text-xs mt-1">发布</span>
      </div>
      <router-link to="/messages" class="flex-1 flex flex-col items-center">
        <el-icon :class="{ 'text-primary-600': $route.path === '/messages' }"><Message /></el-icon>
        <span class="text-xs mt-1" :class="{ 'text-primary-600': $route.path === '/messages' }">消息</span>
      </router-link>
      <router-link to="/mine" class="flex-1 flex flex-col items-center">
        <el-icon :class="{ 'text-primary-600': $route.path === '/mine' }"><User /></el-icon>
        <span class="text-xs mt-1" :class="{ 'text-primary-600': $route.path === '/mine' }">我的</span>
      </router-link>
    </nav>

    <!-- 初始化用户信息对话框 -->
    <init-user-dialog 
      v-if="showInitDialog"
      v-model="showInitDialog"
      @updated="handleUserInfoUpdated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { List, Shop, Plus, Message, User } from '@element-plus/icons-vue'
import InitUserDialog from './components/InitUserDialog.vue'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import { useUserStore } from './stores/user'

const route = useRoute()
const userStore = useUserStore()

const showInitDialog = ref(false)

// 检查用户信息是否完整
const checkUserInfo = () => {
  const token = document.cookie.split('; ').find(row => row.startsWith('DoorKey='))
  if (!token) return true // 未登录不需要检查

  const nickname = localStorage.getItem('userNickname')
  const avatar = localStorage.getItem('userAvatar')
  return !!(nickname && avatar)
}

const handleUserInfoUpdated = () => {
  showInitDialog.value = false
  ElMessage.success('个人信息设置成功')
}

onMounted(() => {
  // 每次刷新页面时检查用户信息
  if (!checkUserInfo()) {
    showInitDialog.value = true
  }
  const token = localStorage.getItem('token')
  if (token) {
    userStore.setToken(token)
    userStore.setAuth(true)
  }
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.shadow-soft {
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  height: 100vh;
  height: -webkit-fill-available;
}

body {
  height: 100vh;
  height: -webkit-fill-available;
  width: 100vw;
  overflow: hidden;
  position: fixed;
  inset: 0;
  font-family: 'Inter var', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  height: 100vh;
  height: -webkit-fill-available;
  width: 100vw;
  overflow: hidden;
}

/* 适配暗黑模式 */
@media (prefers-color-scheme: dark) {
  body {
    background-color: #1a1a1a;
    color: #ffffff;
  }
}

/* 适配安全区域 */
@supports (padding: env(safe-area-inset-bottom)) {
  .pb-safe-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.el-icon {
  font-size: 1.25rem;
}

.router-link-active {
  color: var(--el-color-primary);
}
</style>
