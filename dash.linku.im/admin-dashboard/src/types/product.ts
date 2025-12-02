export interface Product {
  id: string
  identifier:string
  name: string
  description?: string
  image?: string
  stock:number
  disabled:boolean
  status: 'active' | 'inactive'
}

export interface ProductResult{
  success: boolean
  message: string
  data?: any
}

