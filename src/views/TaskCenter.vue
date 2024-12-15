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
        <div v-for="task in tasks" :key="task.id" 
             class="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-3">
          <div class="flex items-start">
            <img :src="task.avatar" class="w-10 h-10 rounded-full mr-3" />
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <span class="font-medium">{{ task.title }}</span>
                <span class="text-[#7269ef] font-bold">¥{{ task.price }}</span>
              </div>
              <p class="text-gray-500 text-sm mt-1 line-clamp-2">{{ task.description }}</p>
              <div class="flex items-center justify-between mt-2">
                <div class="flex items-center text-xs text-gray-400">
                  <span>{{ task.publisher }}</span>
                  <span class="mx-2">·</span>
                  <span>{{ task.time }}</span>
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
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

const searchQuery = ref('')

const tasks = [
  {
    id: 1,
    avatar: 'https://placeholder.co/100',
    title: '帮忙取快递',
    price: 5,
    description: '菜鸟驿站有一个快递，需要帮忙取一下，送到xxx宿舍楼下即可',
    publisher: '张同学',
    time: '10分钟前'
  },
  {
    id: 2,
    avatar: 'https://placeholder.co/100',
    title: '高数辅导',
    price: 50,
    description: '期末考试快到了，需要一位学霸帮忙辅导高等数学，主要是微积分部分',
    publisher: '李同学',
    time: '30分钟前'
  },
  {
    id: 3,
    avatar: 'https://placeholder.co/100',
    title: '帮买午餐',
    price: 8,
    description: '中午有课，需要帮忙从学生食堂打包午餐，要求12点前送到',
    publisher: '王同学',
    time: '1小时前'
  }
]
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
