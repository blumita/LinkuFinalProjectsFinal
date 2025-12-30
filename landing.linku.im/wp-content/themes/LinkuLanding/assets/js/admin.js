/**
 * Admin Scripts - Repeater & Drag and Drop
 */

jQuery(document).ready(function($) {
    
    // Sortable - Drag and Drop
    if (typeof $.fn.sortable !== 'undefined') {
        $('.linku-repeater-items.sortable').sortable({
            handle: '.repeater-handle',
            axis: 'y',
            opacity: 0.7,
            cursor: 'move',
            placeholder: 'sortable-placeholder',
            start: function(e, ui) {
                ui.placeholder.height(ui.item.height());
            },
            update: function(e, ui) {
                updateIndexes($(this));
            }
        });
    }
    
    // افزودن ردیف جدید
    $(document).on('click', '.linku-add-row', function(e) {
        e.preventDefault();
        
        var $wrapper = $(this).closest('.linku-repeater-wrap');
        var $container = $wrapper.find('.linku-repeater-items');
        var field = $container.data('field');
        var template = $('#linku-' + field.slice(0, -1) + '-template').html();
        
        if (!template) return;
        
        // پیدا کردن آخرین ایندکس
        var lastIndex = 0;
        $container.find('.linku-repeater-item').each(function() {
            var currentIndex = parseInt($(this).data('index'));
            if (currentIndex > lastIndex) {
                lastIndex = currentIndex;
            }
        });
        
        var newIndex = lastIndex + 1;
        var newRow = template.replace(/\{\{INDEX\}\}/g, newIndex);
        
        $container.append(newRow);
        
        // Re-initialize sortable
        if (typeof $.fn.sortable !== 'undefined') {
            $container.sortable('refresh');
        }
    });
    
    // حذف ردیف
    $(document).on('click', '.linku-remove-row', function(e) {
        e.preventDefault();
        
        if (confirm(linkuAdmin.confirmDelete || 'آیا مطمئن هستید؟')) {
            var $item = $(this).closest('.linku-repeater-item');
            var $container = $item.closest('.linku-repeater-items');
            
            $item.fadeOut(300, function() {
                $(this).remove();
                updateIndexes($container);
            });
        }
    });
    
    // آپلود تصویر
    $(document).on('click', '.linku-upload-image', function(e) {
        e.preventDefault();
        
        var $button = $(this);
        var $wrapper = $button.closest('.linku-image-upload');
        var $input = $wrapper.find('input[type="hidden"]');
        var $preview = $wrapper.find('.image-preview');
        var $removeBtn = $wrapper.find('.linku-remove-image');
        
        var frame = wp.media({
            title: 'انتخاب تصویر',
            button: {
                text: 'استفاده از این تصویر'
            },
            multiple: false
        });
        
        frame.on('select', function() {
            var attachment = frame.state().get('selection').first().toJSON();
            
            $input.val(attachment.id);
            $preview.html('<img src="' + attachment.url + '" style="max-width: 200px;">');
            $removeBtn.show();
        });
        
        frame.open();
    });
    
    // حذف تصویر
    $(document).on('click', '.linku-remove-image', function(e) {
        e.preventDefault();
        
        var $button = $(this);
        var $wrapper = $button.closest('.linku-image-upload');
        var $input = $wrapper.find('input[type="hidden"]');
        var $preview = $wrapper.find('.image-preview');
        
        $input.val('');
        $preview.html('');
        $button.hide();
    });
    
    // به‌روزرسانی ایندکس‌ها بعد از مرتب‌سازی
    function updateIndexes($container) {
        $container.find('.linku-repeater-item').each(function(index) {
            var $item = $(this);
            var oldIndex = $item.data('index');
            
            // آپدیت data-index
            $item.attr('data-index', index);
            $item.data('index', index);
            
            // آپدیت نام‌های input
            $item.find('input, textarea, select').each(function() {
                var $field = $(this);
                var name = $field.attr('name');
                
                if (name) {
                    // جایگزینی ایندکس قدیمی با جدید
                    var newName = name.replace('[' + oldIndex + ']', '[' + index + ']');
                    $field.attr('name', newName);
                }
            });
        });
    }
    
    // Accordion برای متاباکس‌ها
    $(document).on('click', '.linku-repeater-item .repeater-content label', function() {
        var $item = $(this).closest('.linku-repeater-item');
        $item.toggleClass('collapsed');
    });
    
    // اعتبارسنجی فرم قبل از ارسال
    $('form#post').on('submit', function() {
        var valid = true;
        
        // چک کردن فیلدهای ضروری
        $('.linku-repeater-item').each(function() {
            var $item = $(this);
            var $titleField = $item.find('input[name*="[title]"]');
            
            if ($titleField.length && !$titleField.val().trim()) {
                $titleField.css('border-color', '#dc3232');
                valid = false;
            } else if ($titleField.length) {
                $titleField.css('border-color', '');
            }
        });
        
        if (!valid) {
            alert('لطفاً تمام فیلدهای ضروری را پر کنید.');
            return false;
        }
        
        return true;
    });
    
    // پیش‌نمایش زنده
    $(document).on('input', '.linku-metabox input, .linku-metabox textarea', function() {
        // می‌توانید اینجا پیش‌نمایش زنده اضافه کنید
        updateLivePreview();
    });
    
    function updateLivePreview() {
        // پیش‌نمایش زنده - می‌توانید بعداً پیاده‌سازی کنید
    }
    
    // ذخیره خودکار draft
    var autoSaveTimeout;
    $(document).on('input', '.linku-metabox input, .linku-metabox textarea', function() {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(function() {
            // ذخیره خودکار
            if (typeof wp !== 'undefined' && typeof wp.autosave !== 'undefined') {
                wp.autosave.server.triggerSave();
            }
        }, 3000);
    });
});
