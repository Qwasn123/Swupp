<template>
  <div class="h-screen flex flex-col bg-gray-100">
    <div class="p-4">
      <div class="max-w-2xl mx-auto">
        <!-- 切换发布类型 -->
        <el-tabs v-model="activeTab" class="mb-4">
          <el-tab-pane label="发布任务" name="task">
            <el-form :model="taskForm" label-width="100px" :rules="taskRules" ref="taskFormRef">
              <el-form-item label="标题" prop="title">
                <el-input v-model="taskForm.title" placeholder="请输入任务标题"/>
              </el-form-item>
              <el-form-item label="报酬" prop="reward">
                <el-input-number v-model="taskForm.reward" :min="0" :precision="2" :step="10"/>
              </el-form-item>
              <el-form-item label="类型" prop="categoryId">
                <el-select v-model="taskForm.categoryId" placeholder="请选择类型">
                  <el-option 
                    v-for="category in categories" 
                    :key="category.id" 
                    :label="category.name" 
                    :value="category.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="截止日期" prop="deadline">
                <el-date-picker
                  v-model="taskForm.deadline"
                  type="datetime"
                  placeholder="选择截止日期"
                  :min-date="new Date()"
                  format="YYYY-MM-DD HH:mm"
                  value-format="YYYY-MM-DDTHH:mm:ss"
                />
              </el-form-item>
              <el-form-item label="预计工时" prop="estimatedHours">
                <el-input-number v-model="taskForm.estimatedHours" :min="0.5" :max="168" :step="0.5"/>
              </el-form-item>
              <el-form-item label="地点" prop="location">
                <el-input v-model="taskForm.location" placeholder="请输入任务地点"/>
              </el-form-item>
              <el-form-item label="描述" prop="description">
                <el-input v-model="taskForm.description" type="textarea" rows="4"/>
              </el-form-item>
              <el-form-item label="任务图片" prop="images">
                <el-upload
                  v-model:file-list="taskFileList"
                  class="upload-demo"
                  action="#"
                  list-type="picture-card"
                  :auto-upload="false"
                  :on-change="handleTaskImageChange"
                  multiple
                >
                  <el-icon><Plus /></el-icon>
                  <template #tip>
                    <div class="text-xs text-gray-400 mt-1">
                      支持多张图片上传，最多5张
                    </div>
                  </template>
                </el-upload>
              </el-form-item>
              <el-form-item>
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-checkbox v-model="taskForm.isUrgent">加急</el-checkbox>
                  </el-col>
                  <el-col :span="8">
                    <el-checkbox v-model="taskForm.isOnTop">置顶</el-checkbox>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :loading="isTaskSubmitting" @click="submitTask">
                  {{ isTaskSubmitting ? '发布中...' : '发布任务' }}
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="发布商品" name="item">
            <el-form :model="itemForm" label-width="80px" :rules="itemRules" ref="itemFormRef">
              <el-form-item label="标题" prop="title">
                <el-input v-model="itemForm.title" placeholder="请输入商品标题"/>
              </el-form-item>
              <el-form-item label="定价" prop="price">
                <el-input-number v-model="itemForm.price" :min="0" :precision="2" :step="0.1"/>
              </el-form-item>
              <el-form-item label="库存" prop="stock">
                <el-input-number v-model="itemForm.stock" :min="1" :max="999"/>
              </el-form-item>
              <el-form-item label="类型" prop="categoryId">
                <el-select v-model="itemForm.categoryId" placeholder="请选择类型">
                  <el-option 
                    v-for="category in categories" 
                    :key="category.id" 
                    :label="category.name" 
                    :value="category.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="描述" prop="description">
                <el-input v-model="itemForm.description" type="textarea" rows="4"/>
              </el-form-item>
              <el-form-item label="商品图片" prop="images">
                <el-upload
                  v-model:file-list="fileList"
                  class="upload-demo"
                  action="#"
                  list-type="picture-card"
                  :auto-upload="false"
                  :on-change="handleImageChange"
                  multiple
                >
                  <el-icon><Plus /></el-icon>
                  <template #tip>
                    <div class="text-xs text-gray-400 mt-1">
                      支持多张图片上传，建议尺寸800x800px，最多9张
                    </div>
                  </template>
                </el-upload>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :loading="isSubmitting" @click="submitItem">
                  {{ isSubmitting ? '发布中...' : '发布商品' }}
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const activeTab = ref('task')
const itemFormRef = ref(null)
const isSubmitting = ref(false)
const fileList = ref([])

// 商品分类
const categories = [
  { id: 1, name: '数码' },
  { id: 2, name: '书籍' },
  { id: 3, name: '服装' },
  { id: 4, name: '生活用品' },
  { id: 5, name: '其他' }
]

const taskFormRef = ref(null)
const isTaskSubmitting = ref(false)
const taskFileList = ref([])

const taskForm = ref({
  title: '',
  reward: 0,
  categoryId: '',
  description: '',
  deadline: '',
  estimatedHours: 1,
  location: '',
  isUrgent: false,
  isOnTop: false,
  imageUrls: ''
})

const itemForm = ref({
  title: '',
  price: 0,
  categoryId: '',
  description: '',
  stock: 1,
  images: []
})

const itemRules = {
  title: [
    { required: true, message: '请输入商品标题', trigger: 'blur' },
    { min: 2, max: 50, message: '标题长度应在2-50个字符之间', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '价格必须大于0', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择商品类型', trigger: 'change' }
  ],
  description: [
    { required: false, message: '请输入商品描述', trigger: 'blur' },
    { min: 2, max: 500, message: '描述长度应在10-500个字符之间', trigger: 'blur' }
  ],
  stock: [
    { required: true, message: '请输入库存数量', trigger: 'blur' },
    { type: 'number', min: 1, max: 999, message: '库存必须在1-999之间', trigger: 'blur' }
  ]
}

const taskRules = {
  title: [
    { required: true, message: '请输入任务标题', trigger: 'blur' },
    { min: 2, max: 50, message: '标题长度应在2-50个字符之间', trigger: 'blur' }
  ],
  reward: [
    { required: true, message: '请输入任务报酬', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '报酬必须大于0', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择任务类型', trigger: 'change' }
  ],
  deadline: [
    { required: true, message: '请选择截止日期', trigger: 'change' }
  ],
  estimatedHours: [
    { required: true, message: '请输入预计工时', trigger: 'blur' }
  ],
  location: [
    { required: true, message: '请输入任务地点', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入任务描述', trigger: 'blur' },
    { min: 10, max: 500, message: '描述长度应在10-500个字符之间', trigger: 'blur' }
  ]
}

// 处理图片变化
const handleImageChange = (uploadFile) => {
  if (fileList.value.length > 9) {
    ElMessage.warning('最多只能上传9张图片')
    fileList.value = fileList.value.slice(0, 9)
    return
  }
}

// 处理任务图片变化
const handleTaskImageChange = (uploadFile) => {
  if (taskFileList.value.length > 5) {
    ElMessage.warning('最多只能上传5张图片')
    taskFileList.value = taskFileList.value.slice(0, 5)
    return
  }
}

// 上传图片到OSS
const uploadImageToOSS = async (file) => {
  try {
    const token = document.cookie.split('; ').find(row => row.startsWith('DoorKey='))?.split('=')[1] || ''
    
    // 获取上传签名
    const signatureResponse = await axios.post('/file/upload', null, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!signatureResponse.data.success) {
      throw new Error('获取上传签名失败')
    }

    const signatureData = signatureResponse.data.data
    const fileName = `${Date.now()}-${file.name}`
    const filePath = signatureData.keyPath + fileName

    // 构建上传表单
    const formData = new FormData()
    formData.append('key', filePath)
    formData.append('policy', signatureData.policy)
    formData.append('q-ak', signatureData['q-ak'])
    formData.append('q-sign-algorithm', signatureData['q-sign-algorithm'])
    formData.append('q-key-time', signatureData['q-key-time'])
    formData.append('q-signature', signatureData['q-signature'])
    formData.append('file', file.raw)

    // 上传到OSS
    await axios.post('/upload', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })

    return `https://data.swu.social/${filePath}`
  } catch (error) {
    console.error('上传图片失败:', error)
    throw error
  }
}

// 提交商品
const submitItem = async () => {
  if (!itemFormRef.value) return
  
  try {
    await itemFormRef.value.validate()
    
    if (fileList.value.length === 0) {
      ElMessage.warning('请至少上传一张商品图片')
      return
    }

    isSubmitting.value = true

    // 上传所有图片
    const uploadPromises = fileList.value.map(file => uploadImageToOSS(file))
    const imageUrls = await Promise.all(uploadPromises)
    // console.log('上传的图片URL:', imageUrls)
    // 构建提交数据
    const submitData = {
      title: itemForm.value.title,
      description: itemForm.value.description,
      categoryId: itemForm.value.categoryId,
      stock: itemForm.value.stock,
      price: itemForm.value.price,
      sellerId: 5, // 这里应该从用户状态中获取
      imageUrl: imageUrls.join(',')
    }

    const token = document.cookie.split('; ').find(row => row.startsWith('DoorKey='))?.split('=')[1] || ''
    const response = await axios.post('/secondhand/submit', submitData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (response.data.success) {
      ElMessage.success(response.data.message || '商品发布成功')
      // 重置表单
      itemFormRef.value.resetFields()
      fileList.value = []
    } else {
      throw new Error(response.data.message || '发布失败')
    }
  } catch (error) {
    console.error('发布商品失败:', error)
    ElMessage.error(error.message || '发布失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}

// 提交任务
const submitTask = async () => {
  if (!taskFormRef.value) return
  
  try {
    await taskFormRef.value.validate()
    
    if (taskFileList.value.length === 0) {
      ElMessage.warning('请至少上传一张任务相关图片')
      return
    }

    isTaskSubmitting.value = true

    // 上传所有图片
    const uploadPromises = taskFileList.value.map(file => uploadImageToOSS(file))
    const imageUrls = await Promise.all(uploadPromises)
    const publisherId = localStorage.getItem('id')

    // 构建提交数据
    const submitData = {
      title: taskForm.value.title,
      description: taskForm.value.description,
      categoryId: taskForm.value.categoryId,
      reward: taskForm.value.reward,
      deadline: taskForm.value.deadline,
      estimatedHours: taskForm.value.estimatedHours,
      location: taskForm.value.location,
      isUrgent: taskForm.value.isUrgent,
      isOnTop: taskForm.value.isOnTop,
      publisherId: publisherId,
      imageUrls: imageUrls.join(',')
    }

    const token = document.cookie.split('; ').find(row => row.startsWith('DoorKey='))?.split('=')[1] || ''
    const response = await axios.post('/task/publish', submitData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (response.data.success) {
      ElMessage.success(response.data.message || '任务发布成功')
      // 重置表单
      taskFormRef.value.resetFields()
      taskFileList.value = []
    } else {
      throw new Error(response.data.message || '发布失败')
    }
  } catch (error) {
    console.error('发布任务失败:', error)
    ElMessage.error(error.message || '发布失败，请重试')
  } finally {
    isTaskSubmitting.value = false
  }
}
</script>

<style scoped>
.avatar-uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
}
.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

:deep(.el-upload--picture-card) {
  --el-upload-picture-card-size: 120px;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  --el-upload-list-picture-card-size: 120px;
}
</style>
