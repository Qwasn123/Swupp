<template>
  <el-dialog
    v-model="dialogVisible"
    title="完善个人信息"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    width="400px"
  >
    <div class="space-y-6">
      <div class="flex flex-col items-center space-y-4">
        <el-upload
          class="avatar-uploader"
          action="#"
          :headers="uploadHeaders"
          :show-file-list="false"
          :http-request="customUpload"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="form.avatar" :src="form.avatar" class="w-24 h-24 rounded-full object-cover" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
        <span class="text-gray-500 text-sm">点击上传头像</span>
      </div>

      <el-form :model="form" label-position="top">
        <el-form-item label="昵称" required>
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <el-button type="primary" :loading="loading" @click="handleSubmit">确认</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getCookie } from '../utils/cookie'

const props = defineProps({
  modelValue: Boolean,
  initialNickname: {
    type: String,
    default: ''
  },
  initialAvatar: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'updated'])

const dialogVisible = ref(props.modelValue)
const loading = ref(false)
const form = ref({
  nickname: props.initialNickname,
  avatar: props.initialAvatar
})

// 监听 modelValue 的变化
watch(() => props.modelValue, (newVal) => {
  dialogVisible.value = newVal
})

// 监听对话框的变化
watch(() => dialogVisible.value, (newVal) => {
  emit('update:modelValue', newVal)
})

// 监听初始值的变化
watch(() => props.initialNickname, (newVal) => {
  form.value.nickname = newVal
})

watch(() => props.initialAvatar, (newVal) => {
  form.value.avatar = newVal
})

// 保存当前头像的引用
const currentAvatar = ref('')

const uploadHeaders = computed(() => ({
  Referer: 'https://servicewechat.com/wxb4ebb8cefaf549c2/devtools/page-frame.html'
}))

// 自定义上传方法
const customUpload = async (options) => {
  try {
    const { file } = options
    // 保存当前头像以备回退
    currentAvatar.value = form.value.avatar
    loading.value = true

    const token = getCookie('DoorKey')
    const fileName = Date.now().toString()

    // 获取上传签名
    const signResponse = await fetch('/file/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Referer': 'https://servicewechat.com/wxb4ebb8cefaf549c2/devtools/page-frame.html'
      }
    })

    const signData = await signResponse.json()
    if (!signData.success) {
      throw new Error('获取上传签名失败')
    }

    // 构建表单数据
    const formData = new FormData()
    const filePath = signData.data.keyPath + fileName
    formData.append('key', filePath)
    formData.append('policy', signData.data.policy)
    formData.append('q-ak', signData.data['q-ak'])
    formData.append('q-sign-algorithm', signData.data['q-sign-algorithm'])
    formData.append('q-key-time', signData.data['q-key-time'])
    formData.append('q-signature', signData.data['q-signature'])
    formData.append('file', file)

    // 上传到OSS
    const uploadResponse = await fetch('/upload/', {
      method: 'POST',
      headers: {
        'Referer': 'https://servicewechat.com/wxb4ebb8cefaf549c2/devtools/page-frame.html'
      },
      body: formData
    })

    if ([200, 204].includes(uploadResponse.status)) {
      // 获取上传后的图片位置并替换域名
      const location = uploadResponse.headers.get('location').replace('upload.swu.social', 'data.swu.social')
      form.value.avatar = location
      ElMessage.success('头像上传成功')
      return location
    } else {
      throw new Error('上传失败')
    }
  } catch (error) {
    console.error('Upload error:', error)
    form.value.avatar = currentAvatar.value
    ElMessage.error(error.message || '上传失败')
    throw error
  } finally {
    loading.value = false
  }
}

const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件！')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB！')
    return false
  }
  return true
}

const handleSubmit = async () => {
  if (!form.value.nickname || !form.value.avatar) {
    ElMessage.warning('请填写昵称并上传头像')
    return
  }

  loading.value = true
  try {
    const token = getCookie('DoorKey')
    const response = await fetch('/user/profile/update', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nickname: form.value.nickname,
        avatar: form.value.avatar
      })
    })
    
    const result = await response.json()
    if (result.success) {
      // 保存到本地存储
      localStorage.setItem('userNickname', form.value.nickname)
      localStorage.setItem('userAvatar', form.value.avatar)
      
      dialogVisible.value = false
      emit('updated', form.value)
      ElMessage.success('保存成功')
    } else {
      throw new Error(result.message || '保存失败')
    }
  } catch (error) {
    ElMessage.error(error.message || '保存失败')
  } finally {
    loading.value = false
  }
}

// 取消编辑
const handleCancel = () => {
  // 恢复初始值
  form.value.nickname = props.initialNickname
  form.value.avatar = props.initialAvatar
  dialogVisible.value = false
}
</script>

<style scoped>
.avatar-uploader {
  @apply border-2 border-dashed border-gray-300 rounded-full w-24 h-24 flex items-center justify-center cursor-pointer hover:border-primary-500 transition-colors duration-300;
}

.avatar-uploader-icon {
  @apply text-gray-400;
}

.avatar-uploader:hover .avatar-uploader-icon {
  @apply text-primary-500;
}
</style>
