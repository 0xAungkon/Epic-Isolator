import apiService from './api'

export interface LoginCredentials {
  username: string
  password: string
}

export interface User {
  id: string
  username: string
  email: string
}

export class AuthService {
  async login(credentials: LoginCredentials): Promise<User> {
    return apiService.post<User>('/auth/login', credentials)
  }

  async logout(): Promise<void> {
    return apiService.post('/auth/logout', {})
  }

  async getCurrentUser(): Promise<User> {
    return apiService.get<User>('/auth/me')
  }

  async refreshToken(): Promise<{ token: string }> {
    return apiService.post('/auth/refresh', {})
  }
}

export const authService = new AuthService()