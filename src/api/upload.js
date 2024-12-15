import axios from 'axios'

/**
 * 获取图片上传签名
 * @returns {Promise<{
 *   accessid: string,
 *   policy: string,
 *   signature: string,
 *   dir: string,
 *   host: string,
 *   expire: number
 * }>}
 */
export const getImageUploadSignature = async () => {
  try {
    const doorKey = document.cookie.split('; ').find(row => row.startsWith('DoorKey='))?.split('=')[1] || ''
    const response = await axios.post('https://swupp.swu.social/secondhand/submit', null, {
      headers: {
        'Authorization': `Bearer ${doorKey}`,
        'Content-Type': 'application/json'
      }
    })
    if (response.data.success && response.data.code === 200) {
      return response.data.data
    }
    throw new Error(response.data.message || '获取上传签名失败')
  } catch (error) {
    console.error('获取上传签名失败:', error)
    throw error
  }
}
