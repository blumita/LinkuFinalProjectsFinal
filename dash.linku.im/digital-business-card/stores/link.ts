// stores/link.ts
import { defineStore } from 'pinia'
import type {AxiosInstance} from "axios";
import {useNuxtApp} from "nuxt/app";

export interface CardLink {
    id: number
    cardId: number
    modelType: string
    hash: string
    name: string
    title?: string
    description?: string
    action?: string
    type: 'link' | 'block'
    baseUrl?: string
    value?: string
    icon?: any
    placeholder?: any
    customIcon?: string | null
    fileData?: string | null
    clicks: number
    enabled: boolean
    asSelectedSingleLink: boolean
    order: number
    created_at: string
    updated_at: string
    selectedItems?: any[]
}

export const useLinkStore = defineStore('linkStore', {
    state: () => ({
        links: [] as CardLink[],
    }),

    getters: {
        enabledLinks: (state) => state.links.filter(link => link.enabled),
        linkTypeItems: (state) => state.links.filter(link => link.type === 'link'),
        blockTypeItems: (state) => state.links.filter(link => link.type === 'block'),
        contactCardLinks: (state) => state.links.filter(link => link.action === 'contactcard'),
        selectedSingleLink: (state) => state.links.find(link => link.asSelectedSingleLink),
        totalClicks: (state) => state.links.reduce((sum, link) => sum + (link.clicks || 0), 0),
    },

    actions: {
        setLinks(links: CardLink[]) {
            this.links = links
        },

        updateLink(link: CardLink) {
            const idx = this.links.findIndex(l => l.id === link.id)
            if (idx !== -1) this.links[idx] = link
        },

        clearLinks() {
            this.links = []
        },

        async fetchLinks(cardId: number | string) {
            try {
                const { $axios } = useNuxtApp()
                const axios = $axios as AxiosInstance

                const response = await axios.get(`v1/cards/${cardId}`) // فرض بر اینه که getCard همین روته
                const cardData = response.data?.data

                if (cardData?.linksDataList && Array.isArray(cardData.linksDataList)) {
                    const normalizedLinks = cardData.linksDataList.map((link:any) => this.normalizeLink(link))
                    this.setLinks(normalizedLinks)
                } else {
                    this.clearLinks()
                }

            } catch (error) {
                this.clearLinks()
            }
        },
        normalizeLink(link: any): CardLink {
            return {
                ...link,
                icon: link.icon ? this.safeJsonParse(link.icon) : null,
                placeholder: link.placeholder ? this.safeJsonParse(link.placeholder) : null,
            }
        },

        safeJsonParse(str: any) {
            try {
                return typeof str === 'string' ? JSON.parse(str) : str
            } catch {
                return str
            }
        },

    },
})