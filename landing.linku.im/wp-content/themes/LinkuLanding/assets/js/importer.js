(function($) {
    'use strict';

    let isImporting = false;

    /**
     * شروع ایمپورت
     */
    $('#linku-start-import').on('click', function() {
        if (isImporting) {
            return;
        }

        const confirmed = confirm(
            'آیا مطمئن هستید که می‌خواهید محتوای نمونه را ایمپورت کنید؟\n\n' +
            'توصیه می‌شود قبل از ایمپورت، از دیتابیس خود نسخه پشتیبان تهیه کنید.'
        );

        if (!confirmed) {
            return;
        }

        isImporting = true;

        // نمایش progress
        $('.importer-actions').hide();
        $('.importer-progress').show();
        $('.importer-result').hide();

        // شروع انیمیشن progress
        animateProgress();

        // ارسال درخواست AJAX
        $.ajax({
            url: linkuImporter.ajaxUrl,
            type: 'POST',
            data: {
                action: 'linku_import_demo',
                nonce: linkuImporter.nonce
            },
            success: function(response) {
                if (response.success) {
                    showSuccess(response.data);
                } else {
                    showError(response.data || 'خطا در ایمپورت محتوا');
                }
            },
            error: function(xhr, status, error) {
                showError('خطای سرور: ' + error);
            },
            complete: function() {
                isImporting = false;
                $('.importer-progress').hide();
            }
        });
    });

    /**
     * انیمیشن progress bar
     */
    function animateProgress() {
        let progress = 0;
        const interval = setInterval(function() {
            if (!isImporting || progress >= 90) {
                clearInterval(interval);
                return;
            }

            progress += Math.random() * 15;
            if (progress > 90) progress = 90;

            $('.progress-fill').css('width', progress + '%');
        }, 300);
    }

    /**
     * نمایش پیام موفقیت
     */
    function showSuccess(data) {
        $('.progress-fill').css('width', '100%');

        let html = '<div class="result-success">';
        html += '<h3><span class="dashicons dashicons-yes-alt"></span> ایمپورت با موفقیت انجام شد!</h3>';

        if (data.pages && data.pages.length > 0) {
            html += '<h4>صفحات ایمپورت شده:</h4>';
            html += '<ul class="result-list">';
            data.pages.forEach(function(page) {
                html += '<li><span class="dashicons dashicons-yes"></span>' + page.title + '</li>';
            });
            html += '</ul>';
        }

        if (data.customizer) {
            html += '<p><span class="dashicons dashicons-yes"></span> ' + data.customizer + ' تنظیم Customizer ایمپورت شد</p>';
        }

        if (data.menus && data.menus.length > 0) {
            html += '<h4>منوهای ایمپورت شده:</h4>';
            html += '<ul class="result-list">';
            data.menus.forEach(function(menu) {
                html += '<li><span class="dashicons dashicons-yes"></span>' + menu + '</li>';
            });
            html += '</ul>';
        }

        if (data.widgets) {
            html += '<p><span class="dashicons dashicons-yes"></span> ' + data.widgets + ' ویجت ایمپورت شد</p>';
        }

        html += '<p style="margin-top: 20px;"><strong>مرحله بعدی:</strong> می‌توانید از منوی <a href="customize.php">تنظیمات ظاهری</a> قالب را شخصی‌سازی کنید.</p>';
        html += '<p><a href="' + (typeof adminpage !== 'undefined' ? '../' : '/') + '" class="button button-primary" target="_blank">مشاهده صفحه اصلی</a></p>';
        html += '</div>';

        $('.importer-result').html(html).slideDown();

        // Auto reload after 3 seconds
        setTimeout(function() {
            if (confirm('می‌خواهید صفحه را رفرش کنید تا تغییرات کامل اعمال شود؟')) {
                location.reload();
            }
        }, 3000);
    }

    /**
     * نمایش پیام خطا
     */
    function showError(message) {
        $('.progress-fill').css('width', '0%');

        let html = '<div class="result-error">';
        html += '<h3><span class="dashicons dashicons-no-alt"></span> خطا در ایمپورت</h3>';
        html += '<p>' + message + '</p>';
        html += '<p style="margin-top: 15px;"><button type="button" class="button" onclick="location.reload()">تلاش مجدد</button></p>';
        html += '</div>';

        $('.importer-result').html(html).slideDown();
        $('.importer-actions').show();
    }

})(jQuery);
