<template>
  <div class="task-center pb-16">
    <!-- 搜索栏 -->
    <div class="bg-gradient-to-r from-[#7269ef] to-[#9c95f5] px-4 pt-4 pb-3">
      <div class="relative">
        <div class="flex bg-white/90 backdrop-blur-sm rounded-full overflow-hidden shadow-lg">
          <el-input
            v-model="searchQuery"
            placeholder="搜索任务"
            class="flex-1 !border-none !shadow-none search-input"
          >
            <template #prefix>
              <el-icon class="text-[#7269ef]"><Search /></el-icon>
            </template>
          </el-input>
          <div class="px-4 py-2 bg-[#7269ef] text-white font-medium cursor-pointer hover:bg-[#8982f1] transition-colors flex items-center">
            搜索
          </div>
        </div>
      </div>
    </div>

    <!-- 轮播图 -->
    <div class="px-4 mt-4">
      <el-carousel height="150px" :interval="3000" type="card">
        <el-carousel-item v-for="item in 4" :key="item">
          <div class="bg-gradient-to-r from-[#7269ef] to-[#9c95f5] h-full rounded-lg flex items-center justify-center text-white">
            活动广告位 {{ item }}
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 任务列表 -->
    <div class="mt-6">
      <!-- 标题栏 -->
      <div class="flex items-center justify-between px-4 mb-4">
        <h2 class="text-lg font-bold">任务列表</h2>
      </div>

      <!-- 任务卡片列表 -->
      <div class="px-4">
        <div v-for="task in tasks" :key="task.id" class="bg-white rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-start space-x-4">
            <el-avatar :size="50" :src="task.avatar" />
            <div class="flex-1">
              <div class="flex justify-between items-start">
                <h3 class="text-lg font-medium">{{ task.title }}</h3>
                <div class="text-orange-500 font-medium">¥{{ task.reward }}</div>
              </div>
              <div class="mt-2">
                <p class="text-gray-600 text-sm max-w-[85%]">{{ task.description }}</p>
                <div class="flex justify-between items-center mt-3">
                  <span class="text-gray-400 text-xs">{{ formatTime(task.createTime) }}</span>
                  <el-button 
                    class="!bg-[#7269ef] hover:!bg-[#8982f1] border-none" 
                    type="primary" 
                    size="small" 
                    round
                  >接单</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const searchQuery = ref('')
const tasks = ref([])
const page = ref(1)
const pageSize = ref(10)
const typeFilter = ref('all')
const natureFilter = ref('all')
const loading = ref(false)

// 格式化时间
const formatTime = (timeStr) => {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}.${month}.${day} ${hours}:${minutes}`
}

// 获取任务列表
const fetchTasks = async (newPage) => {
  if (loading.value) return
  if (newPage) {
    page.value = newPage
  }
  try {
    loading.value = true
    const token = document.cookie.split('; ').find(row => row.startsWith('DoorKey='))?.split('=')[1] || ''
    const response = await axios.get('/task/list', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization'
      },
      params: {
        page: page.value,
        size: pageSize.value,
        type: typeFilter.value === 'all' ? undefined : typeFilter.value,
        nature: natureFilter.value === 'all' ? undefined : natureFilter.value
      }
    })

    if (response.data.success) {
      tasks.value = response.data.data
      // 滚动到顶部
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
      localStorage.setItem('tasks', JSON.stringify(tasks.value))
    } else {
      ElMessage.error(response.data.message || '获取任务列表失败')
    }
  } catch (error) {
    console.error('获取任务列表失败:', error)
    ElMessage.error('获取任务列表失败')
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取任务列表
onMounted(() => {
  fetchTasks()
})
</script>

<style scoped>
.task-center {
  min-height: 100vh;
  background-color: #f5f5f5;
}

:deep(.el-carousel__item) {
  border-radius: 8px;
}

:deep(.el-input__wrapper) {
  box-shadow: none !important;
  padding-left: 8px;
  background: transparent;
}

:deep(.el-input__inner) {
  border: none !important;
  padding-left: 4px;
}

.search-input :deep(.el-input__wrapper) {
  background: transparent !important;
}
</style>
