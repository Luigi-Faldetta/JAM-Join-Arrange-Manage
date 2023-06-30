export interface ApiResponse<T> {
    data: T
    success: boolean
    message: string
    error?: string | null
}
export const uid = localStorage.getItem('token')