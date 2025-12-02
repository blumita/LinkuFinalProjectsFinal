import { ref, computed } from 'vue'

interface IconData {
  type: string
  path: string
}

interface CategoryItem {
  id: string
  name: string
  icon: IconData
  action?: string
}

interface Category {
  title: string
  type: string
  items: CategoryItem[]
}

interface ApiResponse {
  categories: Category[]
}

const iconsCache = ref<{ [key: string]: string }>({})
const apiData = ref<ApiResponse | null>(null)

export const useIcons = () => {
  // دریافت داده‌های API
  const fetchApiData = async () => {
    if (apiData.value) return apiData.value

    try {
      const data = await $fetch<ApiResponse>('/api/routes/data')
      apiData.value = data
      return data
    } catch (error) {
      return null
    }
  }

  // پیدا کردن آیکون بر اساس action یا id
  const getIconPath = async (identifier: string): Promise<string> => {
    
    // اگر در کش موجود است، برگردان
    if (iconsCache.value[identifier]) {
      return iconsCache.value[identifier]
    }

    // دریافت داده‌های API
    const data = await fetchApiData()
    if (!data) {
      return `/icons/${identifier}.svg` // fallback
    }

    // جستجو در تمام دسته‌ها
    for (const category of data.categories) {
      for (const item of category.items) {
        if (item.id === identifier || item.action === identifier) {
          const iconPath = item.icon.path
          iconsCache.value[identifier] = iconPath
          return iconPath
        }
      }
    }

    // آیکون‌های پیش‌فرض برای موارد رایج
    const defaultIcons: { [key: string]: string } = {
      phone: '/icons/contact/call.svg',
      call: '/icons/contact/call.svg',
      telegram: '/icons/contact/telegram.svg',
      email: '/icons/contact/email.svg',
      number: '/icons/contact/number.svg',
      link: '/icons/link.svg'
    }

    const fallbackPath = defaultIcons[identifier] || `/icons/${identifier}.svg`
    iconsCache.value[identifier] = fallbackPath
    return fallbackPath
  }

  // دریافت تمام آیکون‌ها بر اساس دسته
  const getIconsByCategory = async (categoryTitle: string): Promise<CategoryItem[]> => {
    const data = await fetchApiData()
    if (!data) return []

    const category = data.categories.find(cat => cat.title === categoryTitle)
    return category ? category.items : []
  }

  return {
    getIconPath,
    getIconsByCategory,
    iconsCache: computed(() => iconsCache.value)
  }
}
