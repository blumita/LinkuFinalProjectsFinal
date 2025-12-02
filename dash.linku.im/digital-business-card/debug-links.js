// اضافه کردن این کد به console browser برای force update همه لینک‌ها
if (window.form && window.form.links) {
  window.form.links.forEach(link => {
    if (link.showDescription === undefined || link.showDescription === null) {
      link.showDescription = false
      console.log(`Updated ${link.title || link.name} showDescription to false`)
    }
  })
  console.log('All links updated. Reload preview to see changes.')
}