<template>
  <div class="h-screen flex flex-col bg-gray-100">
    <div class="p-4">
      <div class="max-w-2xl mx-auto">
        <!-- 切换发布类型 -->
        <el-tabs v-model="activeTab" class="mb-4">
          <el-tab-pane label="发布任务" name="task">
            <el-form :model="taskForm" label-width="80px">
              <el-form-item label="标题">
                <el-input v-model="taskForm.title" placeholder="请输入任务标题"/>
              </el-form-item>
              <el-form-item label="定价">
                <el-input-number v-model="taskForm.price" :min="0" :precision="2"/>
              </el-form-item>
              <el-form-item label="类型">
                <el-select v-model="taskForm.type" placeholder="请选择类型">
                  <el-option label="学习" value="study"/>
                  <el-option label="生活" value="life"/>
                  <el-option label="工作" value="work"/>
                </el-select>
              </el-form-item>
              <el-form-item label="描述">
                <el-input v-model="taskForm.description" type="textarea" rows="4"/>
              </el-form-item>
              <el-form-item label="头图">
                <el-upload
                  class="avatar-uploader"
                  action="#"
                  :show-file-list="false"
                  :auto-upload="false">
                  <img v-if="taskForm.image" :src="taskForm.image" class="avatar">
                  <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
              </el-form-item>
              <el-form-item>
                <el-button type="primary">发布任务</el-button>
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

const taskForm = ref({
  title: '',
  price: 0,
  type: '',
  description: '',
  image: ''
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

// 处理图片变化
const handleImageChange = (uploadFile) => {
  if (fileList.value.length > 9) {
    ElMessage.warning('最多只能上传9张图片')
    fileList.value = fileList.value.slice(0, 9)
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
