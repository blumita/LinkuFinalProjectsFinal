import {defineStore} from 'pinia'
import {computed, getCurrentInstance, ref} from 'vue'
import {useRouter} from 'vue-router'

export interface User {
    id: number
    name: string
    username: string
    isPro: boolean
    email: string
    phone: string
    emailVerified: boolean
    role: string
    referralCode: string
    referralBy: number
    location: string
    avatar: string
    profileImage?: string
    subscriptionType: 'free' | 'premium'
    status: 'active' | 'inactive' | 'suspended'
    removeBranding: boolean
    createdAt: string
    updatedAt: string
}
export interface Profile {
    id: number
    name: string
    username: string
    phone: string
    email: string
    profileImage?: string
    subscriptionType: 'free' | 'premium'
    status: 'active' | 'inactive' | 'suspended'
    profileUrl:string
    linkCount:number
    cardCount:number
    subscriptionMonths:number
    subscriptionEndDate:string
    createdAt: string
    lastLogin: string
}

export interface Admin {
    id: number
    firstName: string
    lastName: string
    fullName: string
    username: string
    phone: string
    countryCode: string
    email: string
    password?: string
    status: 'active' | 'inactive'
    createdAt: string
}

export const useUserStore = defineStore('userStore', () => {
    const user = ref<User>({} as User)
    const users = ref<User[]>([])
    const profiles = ref<Profile[]>([])
    //const userLinks=ref([])
    const userCards = ref([])
    const admins = ref<Admin[]>([])
    const fetched = ref(false)
    const router = useRouter()

    const isUserPro = () => !!user.value?.isPro

    const {appContext} = getCurrentInstance()!
    const axios = appContext.config.globalProperties.$axios

    const fetchUser = async () => {
        try {
            const {data} = await axios.get('/user')
            user.value = data.data
            fetched.value = true
        } catch (error) {
            fetched.value = true
            console.error('❌ خطا در دریافت پروفایل:', error)
            // await router.push('/auth/login') // فعال‌سازی در صورت نیاز
        }
    }
    const getMaxCards = (profile:any) => {
        if (!profile) return 0
        return profile.subscriptionType === "premium" ? 5 : 1
    }
    const selectProfile = (profile:any) => {
        const max = getMaxCards(profile)
        const cards = profile.cards ?? []

        //userLinks.value = links.slice(0, max)
        userCards.value=cards.slice(0,max)
    }

    const fetchProfiles = async () => {
        try {
            const { data } = await axios.get('/user/admin/profiles')

            // اضافه کردن cardCount به هر پروفایل
            profiles.value = data.data.map((profile: any) => ({
                ...profile,
                cardCount: profile.cards ? profile.cards.length : 0,
            }))

            console.log('cc',profiles)

            fetched.value = true
        } catch (error) {
            fetched.value = true
            console.error('❌ خطا در دریافت پروفایل:', error)
        }
    }


    const editProfiles = async (id: number, payload: Partial<Profile>) => {
        try {
            const {data} = await axios.put(`/user/admin/profile/${id}`, payload)

        } catch (error) {
            fetched.value = true
            console.error('❌ خطا در ویرایش پروفایل:', error)
        }
    }
    const toggleUserStatus = async (id: number,status:string) => {
        try {
            const {data} = await axios.patch(`/user/admin/profiles/toggleStatus/${id}`,{status:status})
            const index = users.value.findIndex(u => Number(u.id) === Number(id))
            if (index !== -1) users.value[index].status = data.data.status
        } catch (error) {
            console.error('❌ خطا در تغییر وضعیت پروفایل:', error)
        }
    }
    const fetchAdminUser = async () => {
        try {
            const {data} = await axios.get('/user/admin')
            admins.value = data.data
            fetched.value = true
        } catch (error) {
            fetched.value = true
            console.error('❌ خطا در دریافت پروفایل:', error)
            // await router.push('/auth/login') // فعال‌سازی در صورت نیاز
        }
    }
    const createAdminUser = async (adminForm: Admin) => {
        try {
            const {data} = await axios.post('/user/admin/addAdmin', adminForm)
            user.value = data.data

        } catch (error: any) {
            console.error('❌ خطا در ایجاد ادمین:', error)
        }
    }
    const updateAdminUser = async (id: number, payload: Partial<Admin>) => {
        try {
            const {data} = await axios.put(`/user/admin/${id}`, payload)
            const index = admins.value.findIndex(a => a.id === id)
            if (index !== -1) admins.value[index] = data.data
            return data.data
        } catch (error) {
            console.error('❌ خطا در ویرایش ادمین:', error)
            throw error
        }
    }
    const deleteAdminUser = async (id: number) => {
        try {
            await axios.delete(`/user/admin/${id}`)
            admins.value = admins.value.filter(admin => admin.id !== id)
            console.log(`✅ ادمین با شناسه ${id} حذف شد`)
        } catch (error) {
            console.error('❌ خطا در حذف ادمین:', error)
            throw error
        }
    }
    const fetchAllUsers = async () => {
        try {
            const {data} = await axios.get('user/admin/userList')
            users.value = data.data
        } catch (error) {
            console.error('❌ خطا در دریافت لیست کاربران:', error)
        }
    }
    const totalUsers = computed(() => users.value.length)
    const activeUsers = computed(() => users.value.filter(u => u.status === 'active').length)
    const suspendedUsers = computed(() => users.value.filter(u => u.status === 'suspended').length)
    const inactiveUsers = computed(() => users.value.filter(u => u.status === 'inactive').length)
    const adminUsers = computed(() => users.value.filter(u => u.role === 'admin').length)
    const activeAdmins = computed(() => users.value.filter(u => u.role === 'admin' && u.status === 'active').length)

    const clearProfile = () => {
        user.value = {} as User
    }

    return {
        user,
        admins,
        users,
        userCards,
        profiles,
        fetched,

        totalUsers,
        activeUsers,
        suspendedUsers,
        inactiveUsers,
        adminUsers,
        activeAdmins,

        fetchUser,
        fetchProfiles,
        editProfiles,
        toggleUserStatus,
        fetchAllUsers,
        fetchAdminUser,
        createAdminUser,
        updateAdminUser,
        deleteAdminUser,
        selectProfile,
        clearProfile
    }
})
