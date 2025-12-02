import {defineStore} from 'pinia'
import {ref, getCurrentInstance, computed} from 'vue'
import {useUserStore} from '@/stores/user'
import type {Product, ProductResult} from "@/types/product.ts";

export const useProductStore = defineStore('product', () => {
    const userStore = useUserStore()
    const products = ref<Product[]>([])
    const loading = ref(false)

    // ✅ axios از پلاگین global
    const {appContext} = getCurrentInstance()!
    const axios = appContext.config.globalProperties.$axios

    // 📦 دریافت لیست محصولات
    const fetchProducts = async () => {
        loading.value = true
        try {
            const res = await axios.get('user/admin/cardProducts')
            products.value = res.data?.data || res.data || []
        } catch (error) {
            console.error('❌ خطا در دریافت محصولات:', error)
        } finally {
            loading.value = false
        }
    }

    // ➕ افزودن محصول جدید
    const addProduct = async (form: any):Promise<ProductResult> => {
        try {
            const payload = {...form}
            const imageBase64 = payload.image

            if (imageBase64 && !/^https?:\/\//.test(imageBase64)) {
                delete payload.image
            }

            payload.quantity = 1

            const res = await axios.post('user/admin/cardProducts', payload)

            if (res.data.success) {
                const product = res.data?.data || res.data

                if (imageBase64 && !/^https?:\/\//.test(imageBase64)) {
                    await uploadProductImage(product.id, 'cardproduct', imageBase64, 'imageCardProduct')
                    product.image = imageBase64
                }

                products.value.push(product)
                return { success: true, message: res.data.message || 'محصول با موفقیت افزوده شد', data: product }
            } else {
                return { success: false, message: res.data.message || 'خطا در افزودن محصول' , data: res }
            }

        } catch (error: any) {
            console.error('❌ خطا در افزودن محصول:', error)
            return { success: false, message: error.response?.data?.message || 'خطا در برقراری ارتباط با سرور' }
        }
    }

    // ✏️ ویرایش محصول
    const updateProduct = async (id: string, form: any):Promise<ProductResult> => {

        try {
            const payload = {...form}
            const imageBase64 = payload.image

            if (imageBase64 && !/^https?:\/\//.test(imageBase64)) {
                delete payload.image
            }
            payload.quantity = 1
            const res= await axios.put(`user/admin/cardProducts/${id}`, payload)

            if(res.data.success){
                const product = res.data?.data || res.data
                const index = products.value.findIndex(p => p.id === id)

                if (index !== -1) products.value[index] = {...products.value[index], ...payload}

                // اگر image یک فایل بود، آپلودش کن
                if (imageBase64 && !/^https?:\/\//.test(imageBase64)) {
                    await uploadProductImage(id, 'cardproduct', imageBase64, 'imageCardProduct')
                    products.value[index].image = imageBase64 // یا URL بعد از آپلود
                }
                return { success: true, message: res.data.message || 'محصول با موفقیت ویزایش شد', data: product }
            }else{
                return { success: false, message: res.data.message || 'خطا در ویرایض محصول' }
            }

        } catch (error:any) {
            console.error('❌ خطا در ویرایش محصول:', error)
            return { success: false, message: error.response?.data?.message || 'خطا در برقراری ارتباط با سرور' }
        }
    }
    // ❌ حذف محصول
    const deleteProduct = async (id: string) => {
        try {
            // حذف تصویر محصول
            const imageDeleteRes = await axios.delete(`file-manager/${id}/delete`, {
                params: {
                    fieldName: 'imageCardProduct',
                    modelType: 'cardproduct',
                    modelId: id
                }
            })

            console.log('✅ تصویر محصول با موفقیت حذف شد')

            // فقط اگر تصویر حذف شد، محصول رو حذف کن
            await axios.delete(`user/admin/cardProducts/${id}`)
            console.log('✅ محصول با موفقیت حذف شد')

            products.value = products.value.filter(p => p.id !== id)
            return true
        } catch (error) {
            console.error('❌ خطا در حذف تصویر یا محصول:', error)
            throw error
        }
    }


    // 🔁 تغییر وضعیت فعال/غیرفعال
    const toggleStatus = async (id: string) => {
        const product = products.value.find(p => p.id === id)
        if (!product) return
        const newStatus = product.status === 'active' ? 'inactive' : 'active'
        try {
            await axios.patch(`user/admin/cardProducts/${id}/status`, {status: newStatus})
            product.status = newStatus
        } catch (error) {
            console.error('❌ خطا در تغییر وضعیت محصول:', error)
            throw error
        }
    }

    async function uploadProductImage(productId: string, modelType: string, base64Icon: string, fieldName: string) {
        const formData = new FormData()
        formData.append('modelType', modelType)
        formData.append('modelId', productId)
        // تبدیل base64 به Blob
        const byteString = atob(base64Icon.split(',')[1])
        const arrayBuffer = new ArrayBuffer(byteString.length)
        const intArray = new Uint8Array(arrayBuffer)
        for (let i = 0; i < byteString.length; i++) {
            intArray[i] = byteString.charCodeAt(i)
        }
        const blob = new Blob([intArray], {type: 'image/png'})

        // append با نام دقیقا همان چیزی که API انتظار دارد
        formData.append(fieldName, blob, 'image.png')

        try {
            const uploadResponse = await axios.post(`file-manager/${productId}/upload`, formData)
            console.log('Upload response:', uploadResponse.data)
            return uploadResponse
        } catch (error) {
            console.error('❌ خطا در آپلود آیکون سفارشی', error)
        }
    }


    return {
        products,
        loading,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleStatus,

        totalProducts: computed(() => products.value.length),
        activeProducts: computed(() => products.value.filter(p => p.status === 'active').length),
        inactiveProducts: computed(() => products.value.filter(p => p.status === 'inactive').length),
    }
})
