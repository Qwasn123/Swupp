<template>
  <div class="h-screen flex flex-col bg-gray-100">
    <div class="p-4">
      <div class="max-w-2xl mx-auto">
        <div class="bg-white rounded-lg shadow divide-y">
          <div v-for="message in messages" :key="message.id"
               class="p-4 hover:bg-gray-50 cursor-pointer">
            <div class="flex items-start space-x-3">
              <el-avatar :src="message.avatar" />
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {{ message.name }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ message.time }}
                  </p>
                </div>
                <p class="text-sm text-gray-500 truncate">
                  {{ message.content }}
                </p>
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

const messages = ref([
  {
    id: 1,
    name: '张三',
    avatar: 'https://picsum.photos/50/50',
    content: '你好，请问快递什么时候送到？',
    time: '10:30'
  },
  {
    id: 2,
    name: '李四',
    avatar: 'https://picsum.photos/50/50',
    content: '作业已经完成了，请查收',
    time: '昨天'
  },
  {
    id: 3,
    name: '王五',
    avatar: 'https://picsum.photos/50/50',
    content: '海报的修改建议已经发给你了',
    time: '星期一'
  }
])
</script>
