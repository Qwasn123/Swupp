<template>
  <div class="task-center pb-16">
    <!-- 搜索栏 -->
    <div class="bg-gradient-to-r from-[#7269ef] to-[#9c95f5] px-4 pt-4 pb-3">
      <div class="relative">
        <div class="flex bg-white/90 backdrop-blur-sm rounded-full overflow-hidden shadow-lg">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索任务"
            class="flex-1 !border-none !shadow-none search-input"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon class="text-[#7269ef]"><Search /></el-icon>
            </template>
          </el-input>
          <div 
            class="px-4 py-2 bg-[#7269ef] text-white font-medium cursor-pointer hover:bg-[#8982f1] transition-colors flex items-center"
            @click="handleSearch"
          >
            搜索
          </div>
        </div>
      </div>
    </div>

    <!-- 轮播图 -->
    <div class="px-4 mt-4">
      <el-carousel height="150px" :interval="3000" type="card">
        <el-carousel-item v-for="item in carouselImages" :key="item.title">
          <img :src="item.url" :alt="item.title" class="w-full h-full object-cover rounded-lg">
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 任务卡片列表 -->
    <div class="px-4 max-w-2xl mx-auto">
      <h2 class="text-xl font-bold mb-4 mt-4 text-left">任务中心</h2>
      <div v-for="task in tasks" :key="task.id" 
        class="bg-white rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        @click="router.push(`/task/${task.id}`)"
      >
        <div class="flex items-start space-x-4">
          <div class="w-[50px] h-[50px] rounded-lg overflow-hidden flex-shrink-0">
            <img 
              :src="task.imageUrls ? task.imageUrls.split(',')[0] : ''" 
              class="w-full h-full object-cover"
              alt="任务图片"
            />
          </div>
          <div class="flex-1">
            <div class="flex justify-between items-start">
              <h3 class="text-lg font-medium">{{ task.title }}</h3>
              <div class="flex items-center gap-2">
                <el-tag :type="getStatusType(task.status)" size="small">
                  {{ getStatusText(task.status) }}
                </el-tag>
                <div class="text-orange-500 font-medium">¥{{ task.reward }}</div>
              </div>
            </div>
            <div class="mt-2">
              <p class="text-gray-600 text-sm max-w-[85%]">{{ task.description }}</p>
              <!-- 任务图片展示 -->
              <div v-if="task.imageUrls" class="mt-2 flex gap-2 overflow-x-auto">
                <el-image
                  v-for="(url, index) in task.imageUrls.split(',').slice(1)"
                  :key="index"
                  :src="url"
                  :preview-src-list="task.imageUrls.split(',').slice(1)"
                  fit="cover"
                  class="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />
              </div>
              <div class="flex justify-between items-center mt-3">
                <div class="flex items-center gap-4">
                  <span class="text-gray-400 text-xs">{{ formatTime(task.createTime) }}</span>
                  <span class="text-gray-400 text-xs">预计{{ task.estimatedHours }}小时</span>
                  <span class="text-gray-400 text-xs">{{ task.location }}</span>
                </div>
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
      <!-- 翻页 -->
      <div class="flex justify-center mt-8 mb-8">
        <el-pagination
          :default-page-size="pageSize"
          :current-page="page"
          @current-change="fetchTasks"
          :total="100"
          layout="prev, pager, next"
          background
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import carousel1 from '@/assets/carousel/1.png'
import carousel2 from '@/assets/carousel/2.svg'
import carousel3 from '@/assets/carousel/3.svg'
import carousel4 from '@/assets/carousel/4.svg'

const router = useRouter()
const route = useRoute()

const searchKeyword = ref('')
const tasks = ref([])
const page = ref(1)
const pageSize = ref(10)
const typeFilter = ref('all')
const natureFilter = ref('all')
const loading = ref(false)

const carouselImages = [
  { url: carousel1, title: '校园任务平台' },
  { url: carousel2, title: '轻松发布任务' },
  { url: carousel3, title: '快速接单赚钱' },
  { url: carousel4, title: '安全可靠保障' }
]

// 格式化时间
const formatTime = (timeStr) => {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${month}.${day} ${hours}:${minutes}`
}

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    'PENDING': 'primary',
    'ACCEPTED': 'success',
    'IN_PROGRESS': 'warning',
    'COMPLETED': 'info',
    'CANCELLED': 'danger',
    'EXPIRED': 'info'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    'PENDING': '待接单',
    'ACCEPTED': '已接单',
    'IN_PROGRESS': '进行中',
    'COMPLETED': '已完成',
    'CANCELLED': '已取消',
    'EXPIRED': '已过期'
  }
  return textMap[status] || status
}

// 获取任务列表
const fetchTasks = async (newPage) => {
  if (loading.value) return
  if (newPage) {
    page.value = newPage
  }
  // 保存当前页码
  localStorage.setItem('lastTaskPage', page.value.toString())
  try {
    loading.value = true
    const token = document.cookie.split('; ').find(row => row.startsWith('DoorKey='))?.split('=')[1] || ''
    const response = await axios.get('/task/list', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        page: page.value,
        size: pageSize.value,
        type: typeFilter.value === 'all' ? undefined : typeFilter.value,
        nature: natureFilter.value === 'all' ? undefined : natureFilter.value
      }
    })

    if (response.data.success) {
      // 处理任务数据
      tasks.value = response.data.data.map(task => ({
        ...task,
        imageUrls: task.imageUrls || ''  // 确保imageUrls存在
      }))
      
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
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

// 搜索任务
const handleSearch = async () => {
  if (!searchKeyword.value.trim()) {
    return
  }

  loading.value = true
  const token = document.cookie.split('; ').find(row => row.startsWith('DoorKey='))?.split('=')[1] || ''
  try {
    const response = await axios.get('/search/tasks/quickSearch', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        keyword: searchKeyword.value
      }
    })

    if (response.data?.success) {
      tasks.value = response.data.data
    } else {
      ElMessage.warning(response.data?.message || '搜索失败')
    }
  } catch (error) {
    console.error('Search error:', error)
    ElMessage.error('搜索失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 监听路由参数变化
watch(
  () => route.query.page,
  (newPage) => {
    if (newPage) {
      page.value = parseInt(newPage)
      fetchTasks()
    }
  }
)

// 初始化时从 URL 参数获取页码
onMounted(() => {
  const pageFromUrl = parseInt(route.query.page) || 1
  page.value = pageFromUrl
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

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: var(--el-color-primary);
}

:deep(.el-pagination.is-background .el-pager li) {
  border-radius: 9999px;
}
</style>
