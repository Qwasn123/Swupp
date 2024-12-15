import { defineStore } from 'pinia'
import { login } from '../api/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    isAuthenticated: !!localStorage.getItem('doorkey'),
    user: null
  }),

  actions: {
    setAuth(status) {
      this.isAuthenticated = status
    },

    setUser(userData) {
      this.user = userData
    },

    async login(credentials) {
      try {
        const data = await login(credentials.studentId, credentials.password)
        if (data) {
          this.setUser(data)
          this.setAuth(true)
          return data
        }
        throw new Error('登录失败')
      } catch (error) {
        this.logout()
        throw error
      }
    },

    logout() {
      this.setUser(null)
      this.setAuth(false)
      localStorage.removeItem('doorkey')
    }
  }
})
