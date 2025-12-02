// stores/reportStore.ts
import { defineStore } from 'pinia'
import {ref, computed, getCurrentInstance} from 'vue'
import type {AxiosInstance} from "axios";

export interface Report {
    id: number
    reporterName: string
    reporterEmail: string
    type: 'spam' | 'inappropriate' | 'harassment' | 'copyright' | 'fake' | 'other'
    status: 'open' | 'reviewing' | 'resolved' | 'rejected'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    targetType: 'profile' | 'link' | 'content'
    targetName: string
    targetUrl: string
    description: string
    evidence?: string[]
    adminNotes?: string
    createdAt: string
    updatedAt: string
    resolvedAt?: string
}

export const useReportStore = defineStore('report', () => {
    // --- Reactive state ---
    const reports = ref<Report[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)
    const { appContext } = getCurrentInstance()!
    const axios = appContext.config.globalProperties.$axios as AxiosInstance
    const fetchReports=async ()=>{
        loading.value = true
        error.value = null
        try {
            const res = await axios.get('user/admin/reports')
            reports.value = Array.isArray(res.data.data) ? res.data.data : []
        } catch (err: any) {
            console.error('❌ خطا در دریافت گزارش ها:', err)
            error.value = err.message || 'خطا در دریافت گزارش ها'
        } finally {
            loading.value = false
        }
    }
    const toggleReportStatus = async (id: number,status:string) => {
        try {
            const {data} = await axios.patch(`/user/admin/reports/toggleStatus/${id}`,{status:status})
            const index = reports.value.findIndex(r => Number(r.id) === Number(id))
            if (index !== -1) reports.value[index].status = data.data.status
        } catch (error) {
            console.error('❌ خطا در تغییر وضعیت پروفایل:', error)
        }
    }

    // --- Computed properties ---
    const openReports = computed(() => reports.value.filter(r => r.status === 'open').length)
    const reviewingReports = computed(() => reports.value.filter(r => r.status === 'reviewing').length)
    const resolvedReports = computed(() => reports.value.filter(r => r.status === 'resolved').length)
    const totalReports = computed(() => reports.value.length)


    const resolveReport = (reportId: number) => {
        const report = reports.value.find(r => r.id === reportId)
        if (report) {
            report.status = 'resolved'
            report.resolvedAt = new Date().toLocaleDateString('fa-IR')
            report.updatedAt = new Date().toLocaleDateString('fa-IR')
        }
    }

    const rejectReport = (reportId: number) => {
        const report = reports.value.find(r => r.id === reportId)
        if (report) {
            report.status = 'rejected'
            report.updatedAt = new Date().toLocaleDateString('fa-IR')
        }
    }

    const refreshReports = () => {
        // TODO: call API to fetch latest reports
        console.log('گزارش‌ها بروزرسانی شدند')
    }

    return {
        reports,
        openReports,
        reviewingReports,
        resolvedReports,
        totalReports,
        fetchReports,
        resolveReport,
        toggleReportStatus,
        rejectReport,
        refreshReports
    }
})
