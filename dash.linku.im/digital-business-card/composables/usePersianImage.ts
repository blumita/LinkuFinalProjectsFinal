// Composable for Persian invoice image generation
export function usePersianImage() {
  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان'
  }

  const getStatusText = (status: string): string => {
    const statusMap: Record<string, string> = {
      'paid': 'پرداخت شده',
      'pending': 'در انتظار پرداخت',
      'overdue': 'سررسید گذشته',
      'cancelled': 'لغو شده',
      'refunded': 'بازپرداخت شده'
    }
    return statusMap[status] || status
  }

  const downloadInvoiceImage = async (invoice: any): Promise<void> => {
    // Simple implementation - can be enhanced with html2canvas
    const invoiceText = `
      فاکتور شماره: ${invoice.invoiceNumber}
      مبلغ: ${formatPrice(invoice.amount)}
      وضعیت: ${getStatusText(invoice.status)}
      تاریخ صدور: ${invoice.issueDate}
    `
    
    // Create a blob and download
    const blob = new Blob([invoiceText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `invoice-${invoice.invoiceNumber}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return {
    formatPrice,
    getStatusText,
    downloadInvoiceImage
  }
}
