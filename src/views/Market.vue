<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部搜索栏 -->
    <div class="sticky top-0 z-50 bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-3">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <el-input
              placeholder="搜索商品"
              class="w-full"
              prefix-icon="el-icon-search"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 分类筛选区 -->
    <div class="bg-white mb-4">
      <div class="max-w-7xl mx-auto px-4 py-3">
        <!-- 类型筛选 -->
        <div class="flex items-center py-2 border-b">
          <span class="text-gray-600 font-medium w-16">类型：</span>
          <div class="flex-1">
            <el-radio-group v-model="typeFilter" class="flex flex-wrap gap-4">
              <el-radio-button label="all" class="!rounded-full">全部</el-radio-button>
              <el-radio-button label="digital" class="!rounded-full">数码</el-radio-button>
              <el-radio-button label="books" class="!rounded-full">书籍</el-radio-button>
              <el-radio-button label="clothing" class="!rounded-full">服装</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        
        <!-- 性质筛选 -->
        <div class="flex items-center py-2">
          <span class="text-gray-600 font-medium w-16">性质：</span>
          <div class="flex-1">
            <el-radio-group v-model="natureFilter" class="flex flex-wrap gap-4">
              <el-radio-button label="all" class="!rounded-full">全部</el-radio-button>
              <el-radio-button label="new" class="!rounded-full">全新</el-radio-button>
              <el-radio-button label="second" class="!rounded-full">二手</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品列表区域 -->
    <div class="max-w-7xl mx-auto px-4 pb-8">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <el-loading />
      </div>

      <!-- 商品网格 -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <div v-for="item in items" :key="item.id"
          class="bg-white rounded-lg hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
          @click="viewDetail(item)">
          <!-- 商品图片 -->
          <div class="relative pt-[100%] rounded-t-lg overflow-hidden">
            <img 
              :src="item.imageUrl ? item.imageUrl.split(',')[0] : ''" 
              :alt="item.title"
              class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            >
          </div>
          
          <!-- 商品信息 -->
          <div class="p-3 space-y-2">
            <!-- 商品标题 -->
            <h3 class="text-sm text-gray-800 line-clamp-2 h-10">{{ item.title }}</h3>
            
            <!-- 价格区域 -->
            <div class="flex items-end space-x-2">
              <span class="text-lg font-bold text-red-500">¥{{ item.price.toFixed(2) }}</span>
              <span class="text-xs text-gray-400 line-through">¥{{ (item.price * 1.2).toFixed(2) }}</span>
            </div>
            
            <!-- 底部信息 -->
            <div class="flex items-center justify-between">
              <el-tag 
                size="small" 
                :type="item.status === 'ON_SALE' ? 'success' : 'info'"
                class="!rounded-full"
              >
                {{ item.status === 'ON_SALE' ? '在售' : (item.status === 'SOLD' ? '已售' : '未知') }}
              </el-tag>
              <span class="text-xs text-gray-400">库存: {{ item.stock }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div v-if="hasMore && !loading" class="text-center mt-8">
        <el-button 
          type="primary" 
          class="!rounded-full px-8" 
          @click="loadMore"
        >
          加载更多
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { ElMessage, ElLoading } from 'element-plus'

const typeFilter = ref('all')
const natureFilter = ref('all')
const items = ref([])
const loading = ref(false)
const page = ref(1)
const pageSize = ref(20)
const hasMore = ref(true)

// 获取商品列表
const fetchItems = async (isLoadMore = false) => {
  if (loading.value) return
  try {
    loading.value = true
    const token = document.cookie.split('; ').find(row => row.startsWith('DoorKey='))?.split('=')[1] || ''
    const response = await axios.get('/secondhand/list', {
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
      const responseData = response.data.data
      if (isLoadMore) {
        items.value = [...items.value, ...responseData]
      } else {
        items.value = responseData
      }
      // 如果返回的数据长度小于 pageSize，说明没有更多数据了
      hasMore.value = responseData.length === pageSize.value
    } else {
      ElMessage.error(response.data.message || '获取商品列表失败')
    }
  } catch (error) {
    console.error('获取商品列表失败:', error)
    ElMessage.error('获取商品列表失败')
  } finally {
    loading.value = false
  }
}

// 加载更多
const loadMore = () => {
  if (hasMore.value && !loading.value) {
    page.value += 1
    fetchItems(true)
  }
}

// 查看详情
const viewDetail = (item) => {
  console.log('查看商品详情:', item)
  ElMessage.info('商品详情功能开发中')
}

// 监听筛选条件变化
watch([typeFilter, natureFilter], () => {
  items.value = [] // 清空商品列表
  page.value = 1 // 重置页数
  fetchItems() // 重新加载数据
})

// 初始化数据
onMounted(() => {
  fetchItems()
})
</script>

<style scoped>
.el-radio-button :deep(.el-radio-button__inner) {
  border-radius: 9999px;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
