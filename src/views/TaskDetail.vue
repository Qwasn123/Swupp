<template>
  <div class="task-detail min-h-screen bg-gray-100">
    <div class="max-w-4xl mx-auto p-4">
      <!-- 返回按钮 -->
      <div class="mb-4">
        <el-button @click="goBack" :icon="ArrowLeft">返回</el-button>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
        <el-skeleton :rows="10" animated />
      </div>

      <!-- 任务详情 -->
      <div v-else-if="task" class="bg-white rounded-lg shadow-sm">
        <!-- 任务标题和状态 -->
        <div class="p-6 border-b">
          <div class="flex justify-between items-start">
            <h1 class="text-2xl font-bold text-gray-900">{{ task.title }}</h1>
            <el-tag 
              :type="getStatusType(task.status)"
              class="ml-4"
            >
              {{ getStatusText(task.status) }}
            </el-tag>
          </div>
          <div class="mt-4 flex items-center text-gray-500 text-sm gap-4">
            <span>发布时间：{{ formatTime(task.createTime) }}</span>
            <span>截止时间：{{ formatTime(task.deadline) }}</span>
            <span>预计工时：{{ task.estimatedHours }}小时</span>
          </div>
        </div>

        <!-- 任务详情 -->
        <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- 左侧图片展示 -->
          <div class="md:col-span-2">
            <div v-if="task.imageUrls" class="mb-6">
              <el-carousel height="400px" :autoplay="false">
                <el-carousel-item v-for="(url, index) in task.imageUrls.split(',')" :key="index">
                  <el-image
                    :src="url"
                    fit="contain"
                    class="w-full h-full"
                    :preview-src-list="task.imageUrls.split(',')"
                  />
                </el-carousel-item>
              </el-carousel>
            </div>
            
            <!-- 任务描述 -->
            <div class="mt-6">
              <h2 class="text-lg font-semibold mb-4">任务描述</h2>
              <p class="text-gray-600 whitespace-pre-wrap">{{ task.description }}</p>
            </div>
          </div>

          <!-- 右侧信息栏 -->
          <div class="bg-gray-50 p-4 rounded-lg h-fit">
            <!-- 报酬信息 -->
            <div class="mb-6">
              <div class="text-3xl font-bold text-orange-500">
                ¥{{ task.reward }}
              </div>
              <div class="text-sm text-gray-500 mt-1">任务报酬</div>
            </div>

            <!-- 任务地点 -->
            <div class="mb-6">
              <h3 class="text-sm font-medium text-gray-500 mb-2">任务地点</h3>
              <p class="text-gray-900">{{ task.location }}</p>
            </div>

            <!-- 接单按钮 -->
            <el-button 
              type="primary" 
              class="w-full !bg-[#7269ef] hover:!bg-[#8982f1] border-none"
              :loading="submitting"
              :disabled="!canAcceptTask(task)"
              @click="handleAcceptTask"
            >
              {{ getActionButtonText(task?.status) }}
            </el-button>
          </div>
        </div>
      </div>

      <!-- 错误提示 -->
      <div v-else class="text-center py-8">
        <el-empty description="任务不存在或已被删除" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const task = ref(null)
const loading = ref(true)
const submitting = ref(false)

// 添加返回函数
const goBack = () => {
  const lastPage = localStorage.getItem('lastTaskPage') || 1
  router.push(`/?page=${lastPage}`)
}

// 格式化时间
const formatTime = (timeStr) => {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
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

// 检查是否可以接单
const canAcceptTask = (task) => {
  return task && task.status === 'PENDING'
}

// 获取操作按钮文本
const getActionButtonText = (status) => {
  const textMap = {
    'PENDING': '接单',
    'ACCEPTED': '已被接单',
    'IN_PROGRESS': '进行中',
    'COMPLETED': '已完成',
    'CANCELLED': '已取消',
    'EXPIRED': '已过期'
  }
  return textMap[status] || '接单'
}

// 获取任务详情
const fetchTaskDetail = async () => {
  const taskId = route.params.id
  if (!taskId) {
    ElMessage.error('任务ID不能为空')
    return
  }

  loading.value = true
  try {
    const token = document.cookie.split('; ').find(row => row.startsWith('DoorKey='))?.split('=')[1] || ''
    const response = await axios.get(`/task/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.data?.success) {
      task.value = response.data.data
    } else {
      ElMessage.warning(response.data?.message || '获取任务详情失败')
    }
  } catch (error) {
    console.error('获取任务详情失败:', error)
    ElMessage.error('获取任务详情失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 接单处理
const handleAcceptTask = async () => {
  if (!canAcceptTask(task.value)) return

  submitting.value = true
  try {
    const token = document.cookie.split('; ').find(row => row.startsWith('DoorKey='))?.split('=')[1] || ''
    const response = await axios.post(`/task/${task.value.id}/accept`, null, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.data?.success) {
      ElMessage.success('接单成功')
      // 刷新任务状态
      await fetchTaskDetail()
    } else {
      ElMessage.warning(response.data?.message || '接单失败')
    }
  } catch (error) {
    console.error('接单失败:', error)
    ElMessage.error('接单失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

// 页面加载时获取任务详情
onMounted(() => {
  fetchTaskDetail()
})
</script>

<style scoped>
.task-detail :deep(.el-carousel__item) {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
}
</style>
