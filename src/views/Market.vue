<template>
  <div class="h-screen flex flex-col bg-gray-100">
    <!-- 筛选栏 -->
    <div class="p-4 bg-white shadow">
      <div class="max-w-2xl mx-auto space-y-4">
        <!-- 类型筛选 -->
        <div class="flex items-center space-x-4">
          <span class="text-gray-600">类型：</span>
          <el-radio-group v-model="typeFilter">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="digital">数码</el-radio-button>
            <el-radio-button label="books">书籍</el-radio-button>
            <el-radio-button label="clothing">服装</el-radio-button>
          </el-radio-group>
        </div>

        <!-- 性质筛选 -->
        <div class="flex items-center space-x-4">
          <span class="text-gray-600">性质：</span>
          <el-radio-group v-model="natureFilter">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="new">全新</el-radio-button>
            <el-radio-button label="second">二手</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>

    <!-- 商品瀑布流 -->
    <div class="flex-1 overflow-y-auto p-4">
      <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-if="loading" class="col-span-full flex justify-center items-center py-8">
          <el-loading />
        </div>
        <template v-else>
          <div v-for="item in items" :key="item.id" 
               class="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
               @click="viewDetail(item)">
            <div class="aspect-w-1 aspect-h-1">
              <img :src="item.images ? item.images.split(',')[0] : ''" :alt="item.title" 
                   class="w-full h-full object-cover">
            </div>
            <div class="p-3">
              <h3 class="text-sm font-medium truncate">{{ item.title }}</h3>
              <div class="mt-1 flex items-center justify-between">
                <span class="text-red-500 font-medium">¥{{ item.price }}</span>
                <el-tag size="small" :type="item.stock > 0 ? 'success' : 'info'">
                  {{ item.stock > 0 ? '有货' : '已售罄' }}
                </el-tag>
              </div>
            </div>
          </div>
        </template>
      </div>
      
      <!-- 加载更多 -->
      <div v-if="hasMore && !loading" class="text-center py-4">
        <el-button @click="loadMore">加载更多</el-button>
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
      if (isLoadMore) {
        items.value = [...items.value, ...response.data.data.items]
      } else {
        items.value = response.data.data.items
      }
      hasMore.value = response.data.data.hasMore
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
  page.value++
  fetchItems(true)
}

// 查看详情
const viewDetail = (item) => {
  // TODO: 实现商品详情页面
  console.log('查看商品详情:', item)
}

// 监听筛选条件变化
watch([typeFilter, natureFilter], () => {
  page.value = 1
  hasMore.value = true
  fetchItems()
})

// 初始加载
onMounted(() => {
  fetchItems()
})
</script>
