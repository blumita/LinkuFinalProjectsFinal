export const useFormatters = () => {
  const formatPrice = (price: number): string => {
    return Math.floor(price).toLocaleString('fa-IR')
  }

  const toPersian = (number: number | string): string => {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
    return number.toString().replace(/[0-9]/g, (digit) => persianNumbers[parseInt(digit)])
  }

  const toEnglishDigits = (str: string): string => {
    const persianNums = '۰۱۲۳۴۵۶۷۸۹'
    return str.replace(/[۰-۹]/g, (d) => persianNums.indexOf(d).toString())
  }

  return {
    formatPrice,
    toPersian,
    toEnglishDigits
  }
}
