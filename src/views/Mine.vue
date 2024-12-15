<template>
  <div class="h-full w-full flex flex-col bg-gray-50">
    <!-- 用户信息 -->
    <div class="bg-white shadow-card flex-shrink-0">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8 py-6">
        <div class="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div class="relative">
            <el-avatar 
              :size="80" 
              :src="userAvatar || 'https://picsum.photos/100/100'" 
              class="ring-4 ring-white shadow-soft" 
            />
            <div class="absolute -bottom-1 -right-1 bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
              Lv.1
            </div>
          </div>
          <div class="flex-1 text-center sm:text-left">
            <h2 class="text-2xl font-bold text-gray-900">{{ userNickname || '未设置昵称' }}</h2>
            <p class="text-gray-500 mt-1">积分：0</p>
          </div>
          <el-button 
            type="primary" 
            class="bg-gradient-to-r from-primary-500 to-secondary-500 border-none shadow-soft hover:shadow-lg transition-all duration-200"
            @click="showEditDialog = true"
          >
            编辑资料
          </el-button>
        </div>
      </div>
    </div>

    <!-- 数据统计 -->
    <div class="bg-white shadow-card mt-2 flex-shrink-0">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8 py-4">
        <div class="grid grid-cols-3 gap-8">
          <div class="text-center">
            <div class="text-2xl font-bold text-primary-600">{{ stats.favorites }}</div>
            <div class="text-sm text-gray-500 mt-1">收藏</div>
          </div>
          <div class="text-center border-x border-gray-100">
            <div class="text-2xl font-bold text-primary-600">{{ stats.views }}</div>
            <div class="text-sm text-gray-500 mt-1">浏览</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-primary-600">{{ stats.follows }}</div>
            <div class="text-sm text-gray-500 mt-1">关注</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="flex-1 overflow-y-auto">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8 py-6">
        <el-tabs class="custom-tabs">
          <!-- 我的任务 -->
          <el-tab-pane label="我的任务">
            <div class="space-y-4">
              <div v-for="task in myTasks" :key="task.id"
                   class="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-lg font-semibold">{{ task.title }}</h3>
                    <p class="text-gray-600 mt-1">{{ task.description }}</p>
                    <div class="mt-2 text-sm text-gray-500">
                      状态：{{ task.status }}
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-lg font-bold text-primary-600">￥{{ task.price }}</div>
                    <div class="mt-2">
                      <el-button size="small" type="primary" v-if="task.status === '进行中'">
                        查看详情
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <!-- 我的宝贝 -->
          <el-tab-pane label="我的宝贝">
            <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <div v-for="item in myItems" :key="item.id"
                   class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div class="aspect-w-1 aspect-h-1 w-full">
                  <img :src="item.image" alt="商品图片" class="object-cover">
                </div>
                <div class="p-4">
                  <h3 class="text-lg font-semibold">{{ item.title }}</h3>
                  <p class="text-primary-600 font-bold mt-2">￥{{ item.price }}</p>
                  <div class="mt-2 flex justify-between items-center">
                    <span class="text-sm text-gray-500">状态：{{ item.status }}</span>
                    <el-button size="small" type="primary">管理</el-button>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <!-- 设置 -->
          <el-tab-pane label="设置">
            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="space-y-6">
                <div>
                  <h3 class="text-lg font-medium">账号设置</h3>
                  <div class="mt-4 space-y-4">
                    <div class="flex items-center justify-between">
                      <span>通知设置</span>
                      <el-switch v-model="settings.notifications" />
                    </div>
                    <div class="flex items-center justify-between">
                      <span>隐私设置</span>
                      <el-switch v-model="settings.privacy" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 编辑资料对话框 -->
    <init-user-dialog 
      v-if="showEditDialog"
      v-model="showEditDialog"
      :initial-nickname="userNickname"
      :initial-avatar="userAvatar"
      @updated="handleUserInfoUpdated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import InitUserDialog from '../components/InitUserDialog.vue'

// 用户信息
const userAvatar = ref(localStorage.getItem('userAvatar'))
const userNickname = ref(localStorage.getItem('userNickname'))
const showEditDialog = ref(false)

// 统计数据
const stats = ref({
  favorites: 0,
  views: 0,
  follows: 0
})

// 我的任务列表
const myTasks = ref([
  {
    id: 1,
    title: '帮取快递',
    description: '帮忙到菜鸟驿站取快递',
    price: 5,
    status: '进行中'
  },
  // 更多任务...
])

// 我的宝贝列表
const myItems = ref([
  {
    id: 1,
    title: '二手书籍',
    price: 20,
    image: 'https://picsum.photos/300/300',
    status: '在售'
  },
  // 更多商品...
])

// 设置
const settings = ref({
  notifications: true,
  privacy: false
})

// 处理用户信息更新
const handleUserInfoUpdated = (userInfo) => {
  // 更新本地显示
  userNickname.value = userInfo.nickname
  userAvatar.value = userInfo.avatar
  showEditDialog.value = false
  ElMessage.success('更新成功')
}

onMounted(() => {
  // TODO: 获取用户统计数据
  // TODO: 获取任务列表
  // TODO: 获取商品列表
})
</script>

<style scoped>
.custom-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 1px;
}

.shadow-soft {
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.shadow-card {
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
</style>