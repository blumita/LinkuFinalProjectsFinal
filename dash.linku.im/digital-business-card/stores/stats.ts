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
      // بر اساس key گروه‌بندی کن و آخرین مقدار را برگردان
      const grouped = state.stats.reduce<Record<string, StatItem>>((acc, item) => {
        // اگر این key قبلاً وجود نداشت یا تاریخ جدیدتری دارد، جایگزین کن
        if (!acc[item.key] || moment(item.date).isAfter(moment(acc[item.key].date))) {
          acc[item.key] = item
        }
        return acc
      }, {})

      // تبدیل به آرایه و مرتب‌سازی
      return Object.values(grouped).map(item => ({
        ...item,
        // اطمینان از اینکه trend همیشه آرایه است
        trend: Array.isArray(item.trend) ? item.trend : []
      }))
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

      // ساخت آرایه تاریخ‌ها برای محاسبه trend
      const sortedDates = Array.from(
          new Set([
            ...Object.keys(viewsByDate),
            ...Object.keys(clicksByDate)
          ])
      ).sort()

      // محاسبه trend ها (داده‌های روزانه)
      const viewsTrend = sortedDates.map(date => viewsByDate[date] || 0)
      const clicksTrend = sortedDates.map(date => clicksByDate[date] || 0)
      const ctrTrend = sortedDates.map(date => {
        const clicks = clicksByDate[date] || 0
        const views = viewsByDate[date] || 0
        return views === 0 ? 0 : Math.floor((clicks / views) * 100)
      })

      // محاسبه مجموع برای نمایش
      const totalViews = Object.values(viewsByDate).reduce((sum, val) => sum + val, 0)
      const totalClicks = Object.values(clicksByDate).reduce((sum, val) => sum + val, 0)
      const avgCTR = totalViews === 0 ? 0 : Math.floor((totalClicks / totalViews) * 100)

      // ساخت آمار با trend های واقعی
      const statTypes = [
        {key: 'pops', label: 'بازدید', value: totalViews, trend: viewsTrend, tooltip: 'تعداد کل بازدید در بازه انتخابی'},
        {key: 'linkTaps', label: 'کلیک لینک', value: totalClicks, trend: clicksTrend, tooltip: 'تعداد کل کلیک روی لینک‌ها'},
        {key: 'ctr', label: 'نرخ کلیک', value: `${avgCTR}%`, trend: ctrTrend, tooltip: 'نسبت کلیک به بازدید (CTR)'},
      ]

      // اضافه کردن یک آیتم برای هر نوع آمار
      statTypes.forEach((t) => {
        this.stats.push({
          key: t.key,
          label: t.label,
          value: t.value,
          trend: t.trend,
          tooltip: t.tooltip,
          date: today
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