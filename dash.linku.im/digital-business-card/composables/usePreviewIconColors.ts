// Preview Icon Colors Composable
// این composable برای مدیریت رنگ‌بندی آیکون‌ها در preview components استفاده می‌شود

export const usePreviewIconColors = () => {
  const getPreviewColors = (config?: {
    iconColor?: string
    backgroundColor?: string
  }) => {
    return {
      iconColor: config?.iconColor || '#374151', // default gray-700
      backgroundColor: config?.backgroundColor || 'transparent'
    }
  }

  return {
    getPreviewColors
  }
}