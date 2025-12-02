import { defineStore } from 'pinia'
import moment from 'moment-jalaali'
import * as ContactIcons from '~/components/ui/icons/contact'
import * as BusinessIcons from '~/components/ui/icons/Business'
import * as SocialMediaIcons from '~/components/ui/icons/SocialMedia'
import type {Component} from "vue";

moment.loadPersian({ dialect: 'persian-modern' })

export interface StatItem {
  key: string
  label: string
  value: number | string
  trend: number[]
  tooltip: string
  date: string
}

export interface StatLinkItem {
  customIcon: string
  icon: any  // می‌تونه string یا object باشه
  label: string
  sub: string
  clicks: number
  date: string
}

export interface StatsState {
  stats: StatItem[]
  links: StatLinkItem[]
  dateRange: [string, string]
}

export const useStatsStore = defineStore('stats', {
  state: (): StatsState => ({
    stats: [],
    links: [],
    dateRange: ['', '']
  }),

  getters: {
    filteredStats(state): StatItem[] {
      const [start, end] = state.dateRange
      if (!start || !end) return state.stats

      return state.stats.filter(item => {
        const d = moment(item.date, 'YYYY-MM-DD')
        return d.isSameOrAfter(start) && d.isSameOrBefore(end)
      })
    },

    statsCards(state): StatItem[] {
      const filtered = (this as any).filteredStats as StatItem[]

      const grouped = filtered.reduce<Record<string, StatItem[]>>((acc, item) => {
        if (!acc[item.key]) acc[item.key] = []
        acc[item.key].push(item)
        return acc
      }, {})

      return Object.entries(grouped).map(([key, items]) => {
        const last = items.at(-1)!
        
        // اگر آیتم آخر داده trend دارد، از آن استفاده کن
        // وگرنه از مقادیر value آیتم‌ها trend بساز
        let trend = last.trend && last.trend.length > 0 
          ? last.trend 
          : items
              .map(i =>
                typeof i.value === 'string' ? parseInt(i.value) : Number(i.value)
              )
              .slice(-7) // محدود به ۷ مقدار آخر

        // اگر هنوز هم trend خالی است، داده تصادفی بساز
        if (!trend || trend.length === 0) {
          trend = Array.from({ length: 7 }, () => Math.floor(Math.random() * 50) + 20)
        }
        return {
          key,
          label: last.label,
          value: last.value,
          trend,
          tooltip: last.tooltip,
          date: last.date
        }
      })
    },

    getLinks(state): StatLinkItem[] {
      const [start, end] = state.dateRange
      if (!start || !end) return state.links

      return state.links.filter(link => {
        const d = moment(link.date, 'YYYY-MM-DD')
        return d.isSameOrAfter(start) && d.isSameOrBefore(end)
      })
    }
  },

  actions: {
    setRange(range: [string, string]) {
      this.dateRange = range
    },

    generateMockData(clicksByDate: Record<string, number>,viewsByDate: Record<string, number>, linkTypes: any) {
      const today = moment().format('YYYY-MM-DD')
      this.stats = []
      this.links = []

      if (Object.keys(clicksByDate).length === 0) {
        clicksByDate[today] = 0
      }

      if (Object.keys(viewsByDate).length === 0) {
        viewsByDate[today] = 0
      }

      const statTypes = [
        {key: 'pops', label: 'بازدید', tooltip: 'تعداد بازدید کلی'},
        {key: 'linkTaps', label: 'کلیک لینک', tooltip: 'کلیک روی لینک‌ها'},
        {key: 'connections', label: 'اتصالات جدید', tooltip: 'کاربران جدید'},
        {key: 'ctr', label: 'نرخ کلیک‌پذیری', tooltip: 'نسبت کلیک به بازدید'},
        {key: 'mapView', label: 'مشاهده روی نقشه (بزودی)', tooltip: 'نمایش روی نقشه'},
        {key: 'ranking', label: 'رتبه بندی (بزودی)', tooltip: 'رتبه جستجو'}
      ]
      const sortedDates = Array.from(
          new Set([
            ...Object.keys(viewsByDate),
            ...Object.keys(clicksByDate)
          ])
      ).sort()
//
      sortedDates.forEach((date) => {
        statTypes.forEach((t, idx) => {
          const value = (() => {
            if (t.key === 'linkTaps') {
              return clicksByDate[date] ?? 0
            } else if (t.key === 'pops') {
              return viewsByDate[date] ?? 0
            } else if (t.key === 'ctr') {
              const clicks = clicksByDate[date] ?? 0
              const views = viewsByDate[date] ?? 0
              return views === 0 ? '0%' : `${Math.floor((clicks / views) * 100)}%`
            } else {
              return 0 // 100 + idx * 20 + Math.floor(Math.random() * 30)
            }
          })()



          this.stats.push({
            key: t.key,
            label: t.label,
            value,
            trend: [],
            tooltip: t.tooltip,
            date
          })
        })
      })
      ///
      // ساخت لینک
      linkTypes.forEach((link: { customIcon: string; icon: any; label?: string; title?: string; name?: string; displayName?: string; sub?: string; description?: string; clicks?: number }) => {
        // استخراج نام لینک از فیلدهای مختلف
        const linkLabel = link.displayName || link.title || link.name || link.label || 'بدون نام'
        
        this.links.push({
          customIcon: link.customIcon,
          icon: link.icon,
          label: linkLabel,
          sub: link.sub || link.description || '',
          clicks: link.clicks || 0,
          date: moment().format('YYYY-MM-DD')
        });
      });
    },


    // فقط یک روز تستی (مثلاً امروز)
    generateTodaySample() {
      const date = moment().format('YYYY-MM-DD')
      this.stats = [
        {
          key: 'pops',
          label: 'بازدید',
          value: 120,
          trend: [40, 55, 70],
          tooltip: 'تعداد بازدید امروز',
          date
        },
        {
          key: 'linkTaps',
          label: 'کلیک لینک',
          value: 45,
          trend: [15, 25, 35],
          tooltip: 'کلیک‌های امروز',
          date
        }
      ]

      /*this.links = [
        {
          customIcon:'',
          icon: ContactIcons.telegram,
          label: 'تلگرام',
          clicks: 32,
          sub: '',
          date
        },
        {
          customIcon:'',
          icon: SocialMediaIcons.instagram,
          label: 'اینستاگرام',
          clicks: 28,
          sub: '',
          date
        },
        {
          customIcon:'',
          icon: BusinessIcons.website,
          label: 'وب‌سایت',
          clicks: 18,
          sub: '',
          date
        },
        {
          customIcon:'',
          icon: SocialMediaIcons.youtube,
          label: 'یوتیوب',
          clicks: 15,
          sub: '',
          date
        }
      ]*/
    }
  }
})