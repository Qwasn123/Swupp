<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部搜索栏 -->
    <div class="sticky top-0 z-50 bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-3">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索商品..."
              class="w-full"
              clearable
              @input="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
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
        <div 
          v-for="item in filteredItems" 
          :key="item.id" 
          class="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer"
          @click="goToDetail(item.id)"
        >
          <!-- 商品图片 -->
          <div class="relative pt-[100%] rounded-t-lg overflow-hidden">
            <img 
              :src="item.imageUrl && item.imageUrl.trim() !== '' ? item.imageUrl.split(',')[0] : defaultGoodsImg" 
              :alt="item.title"
              class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
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
              <!-- <el-tag 
                size="small" 
                :type="item.status === 'ON_SALE' ? 'success' : 'info'"
                class="!rounded-full"
              >
                {{ item.status === 'ON_SALE' ? '在售' : (item.status === 'SOLD' ? '已售' : '未知') }}
              </el-tag> -->
              <span class="text-xs text-gray-400">库存: {{ item.stock }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 翻页 -->
      <div class="flex justify-center mt-8 mb-16">
        <el-pagination
          :default-page-size="pageSize"
          :current-page="page"
          @current-change="fetchItems"
          :total="100"
          layout="prev, pager, next"
          background
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import axios from 'axios'
import { ElMessage, ElLoading } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import defaultGoodsImg from '@/assets/goods/default-goods-img.png'
import { Search } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const typeFilter = ref('all')
const natureFilter = ref('all')
const items = ref([])
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)
const searchKeyword = ref('')

// 获取商品列表
const fetchItems = async (newPage) => {
  if (loading.value) return
  if (newPage) {
    page.value = newPage
  }
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
      items.value = response.data.data
      // 滚动到顶部
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
      localStorage.setItem('goods', JSON.stringify(items.value))
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

// 跳转到商品详情页
const goToDetail = (id) => {
  // 保存当前页码
  localStorage.setItem('lastMarketPage', page.value)
  router.push(`/product/${id}`)
}

// 查看详情
const viewDetail = (item) => {
  console.log('查看商品详情:', item)
  ElMessage.info('商品详情功能开发中')
}

// 监听筛选条件变化
watch([typeFilter, natureFilter], () => {
  page.value = 1 // 重置页数
  fetchItems() // 重新加载数据
})

// 监听路由参数变化
watch(
  () => route.query.page,
  (newPage) => {
    if (newPage) {
      page.value = parseInt(newPage)
      fetchItems()
    }
  }
)

// 监听搜索关键词变化
watch(searchKeyword, (newKeyword) => {
  if (!newKeyword.trim()) {
    return
  }
  handleSearch()
})

// 搜索商品
const handleSearch = async () => {
  if (!searchKeyword.value.trim()) {
    return
  }

  loading.value = true
  const token = document.cookie.split('; ').find(row => row.startsWith('DoorKey='))?.split('=')[1] || ''
  try {
    const response = await axios.get('/search/products/quickSearch', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        keyword: searchKeyword.value
      }
    })

    if (response.data?.success) {
      items.value = response.data.data
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

// 初始化时从 URL 参数获取页码
onMounted(() => {
  const pageFromUrl = parseInt(route.query.page) || 1
  page.value = pageFromUrl
  fetchItems()
})

// 计算属性：根据筛选条件过滤商品
const filteredItems = computed(() => {
  return items.value.filter(item => {
    if (typeFilter.value !== 'all' && item.type !== typeFilter.value) return false
    if (natureFilter.value !== 'all' && item.nature !== natureFilter.value) return false
    return true
  })
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

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: var(--el-color-primary);
}

:deep(.el-pagination.is-background .el-pager li) {
  border-radius: 9999px;
}
</style>
