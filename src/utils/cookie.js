// 获取指定名称的cookie
export const getCookie = (name) => {
  const cookies = document.cookie.split(';')
  const cookie = cookies.find(c => c.trim().startsWith(`${name}=`))
  if (cookie) {
    return cookie.split('=')[1]
  }
  return null
}

// 检查是否存在doorkey cookie
export const hasDoorKey = () => {
  return !!getCookie('DoorKey')
}
