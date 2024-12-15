<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl w-full space-y-8 bg-white p-8 rounded-2xl shadow-soft">
      <!-- Logo和标题 -->
      <div class="text-center">
        <img class="mx-auto h-16 w-auto" src="/logo.svg" alt="Logo" />
        <h2 class="mt-6 font-extrabold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
          <span class="text-2xl">欢迎使用</span>
          <br />
          <span class="text-5xl tracking-wide">SWUPP</span>
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          西南大学校园互助平台
        </p>
      </div>

      <!-- 登录表单 -->
      <form class="mt-8 space-y-8 max-w-xl mx-auto" @submit.prevent="handleLogin">
        <div class="rounded-md space-y-6">
          <div>
            <label for="studentId" class="sr-only">学号</label>
            <el-input
              id="studentId"
              v-model="studentId"
              type="text"
              placeholder="请输入学号"
              class="appearance-none relative block w-full text-lg h-12"
              :input-style="{ height: '48px' }"
            >
              <template #prefix>
                <el-icon class="text-xl"><User /></el-icon>
              </template>
            </el-input>
          </div>
          <div>
            <label for="password" class="sr-only">密码</label>
            <el-input
              id="password"
              v-model="password"
              type="password"
              placeholder="请输入密码"
              class="appearance-none relative block w-full text-lg h-12"
              :input-style="{ height: '48px' }"
            >
              <template #prefix>
                <el-icon class="text-xl"><Lock /></el-icon>
              </template>
            </el-input>
          </div>
        </div>

        <div>
          <el-button
            type="primary"
            native-type="submit"
            class="relative w-full bg-gradient-to-r from-primary-500 to-secondary-500 border-none h-12 text-lg font-medium"
            :loading="loading"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { login } from '../api/auth'

const router = useRouter()
const studentId = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  if (!studentId.value || !password.value) {
    ElMessage.warning('请输入学号和密码')
    return
  }

  loading.value = true
  try {
    const response = await login(studentId.value, password.value)
    if (response.data?.success) {
      ElMessage.success('登录成功')
      router.replace('/')
    } else {
      ElMessage.error(response.data?.message || '登录失败，请检查学号和密码')
    }
  } catch (error) {
    console.error('Login error:', error)
    ElMessage.error(error.message || '登录失败，请检查学号和密码')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.el-input {
  --el-input-bg-color: transparent;
  --el-input-border-color: #e5e7eb;
  --el-input-hover-border-color: var(--el-color-primary);
}

.el-button {
  height: 42px;
  font-size: 16px;
}
</style>
