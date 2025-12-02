import { defineStore } from 'pinia'

// Invoice Type
export interface Invoice {
  id: string | number
  invoiceNumber: string
  description: string
  amount: number
  issueDate: string
  dueDate: string
  status: 'paid' | 'pending' | 'overdue' | 'cancelled'
  paymentMethod: string
  items?: InvoiceItem[]
}

export interface InvoiceItem {
  id: string | number
  name: string
  quantity: number
  price: number
  total: number
}

// Payment Type
export interface Payment {
  id: string | number
  title: string
  amount: number
  date: string
  time?: string
  status: 'موفق' | 'ناموفق' | 'در انتظار'
  method: 'درگاه بانکی' | 'کارت به کارت' | 'کیف پول' | string
  transactionId: string
  description?: string
  icon?: string
}

// Transaction Stats
export interface TransactionStats {
  totalPayments: number
  thisMonthPayments: number
  successfulCount: number
  failedCount: number
}

export const useFinancialStore = defineStore('financial', {
  state: () => ({
    invoices: [] as Invoice[],
    payments: [] as Payment[],
    stats: null as TransactionStats | null,
    loading: false,
    error: null as string | null
  }),

  getters: {
    // Filter invoices by status
    getInvoicesByStatus: (state) => (status: string) => {
      if (status === 'all') return state.invoices
      return state.invoices.filter(inv => inv.status === status)
    },

    // Filter payments by status
    getPaymentsByStatus: (state) => (status: string) => {
      if (status === 'all') return state.payments
      return state.payments.filter(pay => pay.status === status)
    },

    // Get total payments amount
    getTotalPaymentsAmount: (state) => {
      return state.payments
        .filter(p => p.status === 'موفق')
        .reduce((sum, p) => sum + p.amount, 0)
    },

    // Get this month payments
    getThisMonthPayments: (state) => {
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()

      return state.payments.filter(payment => {
        // Parse Persian date (assuming format: 1403/08/15)
        const dateParts = payment.date.split('/')
        if (dateParts.length !== 3) return false

        const year = parseInt(dateParts[0])
        const month = parseInt(dateParts[1])

        // Simple check - you may need to convert to Gregorian
        return year === currentYear && month === currentMonth
      })
    }
  },

  actions: {
    // Fetch all invoices from API
    async fetchInvoices() {
      this.loading = true
      this.error = null

      try {
        const { $axios } = useNuxtApp() as any
        const response = await $axios.get('invoices/list')

        if (response.data && response.data.data) {
          this.invoices = response.data.data
        }
      } catch (error: any) {
        this.error = error.message || 'خطا در دریافت فاکتورها'
        this.invoices = []
      } finally {
        this.loading = false
      }
    },

    // Fetch payment history from API
    async fetchPaymentHistory() {
      this.loading = true
      this.error = null

      try {
        const { $axios } = useNuxtApp() as any
        const response = await $axios.get('transactions/list')

        if (response.data && response.data.data) {
          // Map transactions to payments
          this.payments = response.data.data.map((tx: any) => ({
            id: tx.id,
            title: tx.plan || tx.description || 'پرداخت',
            amount: typeof tx.amount === 'string' ? parseInt(tx.amount.replace(/,/g, '')) : tx.amount,
            date: tx.date,
            time: tx.time,
            status: tx.status === 'success' ? 'موفق' : tx.status === 'failed' ? 'ناموفق' : 'در انتظار',
            method: tx.method || 'درگاه بانکی',
            transactionId: tx.ref || tx.transactionId || '',
            description: tx.description,
            icon: this.getPaymentIcon(tx.method)
          }))

          // Calculate stats
          this.calculateStats()
        }
      } catch (error: any) {
        this.error = error.message || 'خطا در دریافت تاریخچه پرداخت'
        this.payments = []
      } finally {
        this.loading = false
      }
    },

    // Calculate transaction statistics
    calculateStats() {
      const successful = this.payments.filter(p => p.status === 'موفق')
      const failed = this.payments.filter(p => p.status === 'ناموفق')

      this.stats = {
        totalPayments: successful.reduce((sum, p) => sum + p.amount, 0),
        thisMonthPayments: this.getThisMonthPayments.reduce((sum, p) => {
          if (p.status === 'موفق') return sum + p.amount
          return sum
        }, 0),
        successfulCount: successful.length,
        failedCount: failed.length
      }
    },

    // Download invoice PDF
    async downloadInvoice(invoiceId: string | number) {
      try {
        const { $axios } = useNuxtApp() as any
        const response = await $axios.get(`invoices/${invoiceId}/download`, {
          responseType: 'blob'
        })

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `invoice_${invoiceId}.pdf`)
        document.body.appendChild(link)
        link.click()
        link.remove()
      } catch (error: any) {
        throw new Error('خطا در دانلود فاکتور')
      }
    },

    // Get invoice details
    async getInvoiceDetails(invoiceId: string | number): Promise<Invoice | null> {
      try {
        const { $axios } = useNuxtApp() as any
        const response = await $axios.get(`invoices/${invoiceId}`)

        if (response.data && response.data.data) {
          return response.data.data
        }
        return null
      } catch (error: any) {
        return null
      }
    },

    // Helper: Get payment method icon
    getPaymentIcon(method: string): string {
      const icons: { [key: string]: string } = {
        'درگاه بانکی': 'ti ti-building-bank',
        'کارت به کارت': 'ti ti-credit-card',
        'کیف پول': 'ti ti-wallet'
      }
      return icons[method] || 'ti ti-credit-card'
    }
  }
})
