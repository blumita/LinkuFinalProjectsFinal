<?php
/**
 * Custom Meta Boxes با Repeater دستی
 * 
 * @package Linku_Landing
 */

if (!defined('ABSPATH')) exit;

/**
 * ثبت Meta Boxes
 */
function linku_register_meta_boxes() {
    add_meta_box(
        'linku_hero_settings',
        __('تنظیمات هیرو', 'linku-landing'),
        'linku_hero_metabox_callback',
        'page',
        'normal',
        'high'
    );
    
    add_meta_box(
        'linku_features',
        __('ویژگی‌ها', 'linku-landing'),
        'linku_features_metabox_callback',
        'page',
        'normal',
        'high'
    );
    
    add_meta_box(
        'linku_stats',
        __('آمار و ارقام', 'linku-landing'),
        'linku_stats_metabox_callback',
        'page',
        'normal',
        'high'
    );
    
    add_meta_box(
        'linku_blocks',
        __('بلوک‌ها', 'linku-landing'),
        'linku_blocks_metabox_callback',
        'page',
        'normal',
        'high'
    );
    
    add_meta_box(
        'linku_faq',
        __('سوالات متداول', 'linku-landing'),
        'linku_faq_metabox_callback',
        'page',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'linku_register_meta_boxes');

/**
 * متاباکس تنظیمات هیرو
 */
function linku_hero_metabox_callback($post) {
    wp_nonce_field('linku_save_hero', 'linku_hero_nonce');
    
    $hero_title = get_post_meta($post->ID, '_linku_hero_title', true);
    $hero_subtitle = get_post_meta($post->ID, '_linku_hero_subtitle', true);
    $hero_description = get_post_meta($post->ID, '_linku_hero_description', true);
    $hero_button_text = get_post_meta($post->ID, '_linku_hero_button_text', true) ?: 'شروع رایگان';
    $hero_button_link = get_post_meta($post->ID, '_linku_hero_button_link', true) ?: '#';
    $hero_image = get_post_meta($post->ID, '_linku_hero_image', true);
    ?>
    
    <div class="linku-metabox">
        <table class="form-table">
            <tr>
                <th><label for="linku_hero_title"><?php _e('عنوان اصلی', 'linku-landing'); ?></label></th>
                <td>
                    <input type="text" id="linku_hero_title" name="linku_hero_title" 
                           value="<?php echo esc_attr($hero_title); ?>" class="widefat">
                </td>
            </tr>
            
            <tr>
                <th><label for="linku_hero_subtitle"><?php _e('زیرعنوان', 'linku-landing'); ?></label></th>
                <td>
                    <input type="text" id="linku_hero_subtitle" name="linku_hero_subtitle" 
                           value="<?php echo esc_attr($hero_subtitle); ?>" class="widefat">
                </td>
            </tr>
            
            <tr>
                <th><label for="linku_hero_description"><?php _e('توضیحات', 'linku-landing'); ?></label></th>
                <td>
                    <textarea id="linku_hero_description" name="linku_hero_description" 
                              rows="4" class="widefat"><?php echo esc_textarea($hero_description); ?></textarea>
                </td>
            </tr>
            
            <tr>
                <th><label for="linku_hero_button_text"><?php _e('متن دکمه', 'linku-landing'); ?></label></th>
                <td>
                    <input type="text" id="linku_hero_button_text" name="linku_hero_button_text" 
                           value="<?php echo esc_attr($hero_button_text); ?>" class="widefat">
                </td>
            </tr>
            
            <tr>
                <th><label for="linku_hero_button_link"><?php _e('لینک دکمه', 'linku-landing'); ?></label></th>
                <td>
                    <input type="url" id="linku_hero_button_link" name="linku_hero_button_link" 
                           value="<?php echo esc_url($hero_button_link); ?>" class="widefat">
                </td>
            </tr>
            
            <tr>
                <th><label><?php _e('تصویر', 'linku-landing'); ?></label></th>
                <td>
                    <div class="linku-image-upload">
                        <input type="hidden" id="linku_hero_image" name="linku_hero_image" 
                               value="<?php echo esc_attr($hero_image); ?>">
                        <div class="image-preview">
                            <?php if ($hero_image): ?>
                                <img src="<?php echo esc_url(wp_get_attachment_url($hero_image)); ?>" style="max-width: 200px;">
                            <?php endif; ?>
                        </div>
                        <button type="button" class="button linku-upload-image">
                            <?php _e('انتخاب تصویر', 'linku-landing'); ?>
                        </button>
                        <button type="button" class="button linku-remove-image" <?php echo $hero_image ? '' : 'style="display:none;"'; ?>>
                            <?php _e('حذف تصویر', 'linku-landing'); ?>
                        </button>
                    </div>
                </td>
            </tr>
        </table>
    </div>
    <?php
}

/**
 * متاباکس ویژگی‌ها با Repeater
 */
function linku_features_metabox_callback($post) {
    wp_nonce_field('linku_save_features', 'linku_features_nonce');
    
    $features = get_post_meta($post->ID, '_linku_features', true);
    if (!is_array($features)) {
        $features = array();
    }
    ?>
    
    <div class="linku-repeater-wrap">
        <div class="linku-repeater-header">
            <button type="button" class="button button-primary linku-add-row">
                <span class="dashicons dashicons-plus-alt"></span>
                <?php _e('افزودن ویژگی جدید', 'linku-landing'); ?>
            </button>
        </div>
        
        <div class="linku-repeater-items sortable" data-field="features">
            <?php
            if (!empty($features)) {
                foreach ($features as $index => $feature) {
                    linku_render_feature_row($index, $feature);
                }
            }
            ?>
        </div>
        
        <!-- Template برای آیتم جدید -->
        <script type="text/template" id="linku-feature-template">
            <?php linku_render_feature_row('{{INDEX}}', array()); ?>
        </script>
    </div>
    <?php
}

/**
 * رندر کردن یک ردیف ویژگی
 */
function linku_render_feature_row($index, $data) {
    $icon = isset($data['icon']) ? $data['icon'] : '';
    $title = isset($data['title']) ? $data['title'] : '';
    $description = isset($data['description']) ? $data['description'] : '';
    ?>
    <div class="linku-repeater-item" data-index="<?php echo esc_attr($index); ?>">
        <div class="repeater-handle">
            <span class="dashicons dashicons-menu"></span>
        </div>
        
        <div class="repeater-content">
            <div class="repeater-field">
                <label><?php _e('آیکون (کلاس)', 'linku-landing'); ?></label>
                <input type="text" name="linku_features[<?php echo $index; ?>][icon]" 
                       value="<?php echo esc_attr($icon); ?>" 
                       placeholder="fa fa-star">
            </div>
            
            <div class="repeater-field">
                <label><?php _e('عنوان', 'linku-landing'); ?></label>
                <input type="text" name="linku_features[<?php echo $index; ?>][title]" 
                       value="<?php echo esc_attr($title); ?>">
            </div>
            
            <div class="repeater-field">
                <label><?php _e('توضیحات', 'linku-landing'); ?></label>
                <textarea name="linku_features[<?php echo $index; ?>][description]" 
                          rows="3"><?php echo esc_textarea($description); ?></textarea>
            </div>
        </div>
        
        <div class="repeater-actions">
            <button type="button" class="button button-link-delete linku-remove-row">
                <span class="dashicons dashicons-trash"></span>
            </button>
        </div>
    </div>
    <?php
}

/**
 * متاباکس آمار و ارقام
 */
function linku_stats_metabox_callback($post) {
    wp_nonce_field('linku_save_stats', 'linku_stats_nonce');
    
    $stats = get_post_meta($post->ID, '_linku_stats', true);
    if (!is_array($stats)) {
        $stats = array();
    }
    ?>
    
    <div class="linku-repeater-wrap">
        <div class="linku-repeater-header">
            <button type="button" class="button button-primary linku-add-row">
                <span class="dashicons dashicons-plus-alt"></span>
                <?php _e('افزودن آمار جدید', 'linku-landing'); ?>
            </button>
        </div>
        
        <div class="linku-repeater-items sortable" data-field="stats">
            <?php
            if (!empty($stats)) {
                foreach ($stats as $index => $stat) {
                    linku_render_stat_row($index, $stat);
                }
            }
            ?>
        </div>
        
        <script type="text/template" id="linku-stat-template">
            <?php linku_render_stat_row('{{INDEX}}', array()); ?>
        </script>
    </div>
    <?php
}

/**
 * رندر کردن یک ردیف آمار
 */
function linku_render_stat_row($index, $data) {
    $number = isset($data['number']) ? $data['number'] : '';
    $label = isset($data['label']) ? $data['label'] : '';
    ?>
    <div class="linku-repeater-item" data-index="<?php echo esc_attr($index); ?>">
        <div class="repeater-handle">
            <span class="dashicons dashicons-menu"></span>
        </div>
        
        <div class="repeater-content">
            <div class="repeater-field">
                <label><?php _e('عدد', 'linku-landing'); ?></label>
                <input type="text" name="linku_stats[<?php echo $index; ?>][number]" 
                       value="<?php echo esc_attr($number); ?>" 
                       placeholder="750,000+">
            </div>
            
            <div class="repeater-field">
                <label><?php _e('برچسب', 'linku-landing'); ?></label>
                <input type="text" name="linku_stats[<?php echo $index; ?>][label]" 
                       value="<?php echo esc_attr($label); ?>" 
                       placeholder="کاربر فعال">
            </div>
        </div>
        
        <div class="repeater-actions">
            <button type="button" class="button button-link-delete linku-remove-row">
                <span class="dashicons dashicons-trash"></span>
            </button>
        </div>
    </div>
    <?php
}

/**
 * متاباکس بلوک‌ها
 */
function linku_blocks_metabox_callback($post) {
    wp_nonce_field('linku_save_blocks', 'linku_blocks_nonce');
    
    $blocks = get_post_meta($post->ID, '_linku_blocks', true);
    if (!is_array($blocks)) {
        $blocks = array();
    }
    ?>
    
    <div class="linku-repeater-wrap">
        <div class="linku-repeater-header">
            <button type="button" class="button button-primary linku-add-row">
                <span class="dashicons dashicons-plus-alt"></span>
                <?php _e('افزودن بلوک جدید', 'linku-landing'); ?>
            </button>
        </div>
        
        <div class="linku-repeater-items sortable" data-field="blocks">
            <?php
            if (!empty($blocks)) {
                foreach ($blocks as $index => $block) {
                    linku_render_block_row($index, $block);
                }
            }
            ?>
        </div>
        
        <script type="text/template" id="linku-block-template">
            <?php linku_render_block_row('{{INDEX}}', array()); ?>
        </script>
    </div>
    <?php
}

/**
 * رندر کردن یک ردیف بلوک
 */
function linku_render_block_row($index, $data) {
    $icon = isset($data['icon']) ? $data['icon'] : '';
    $title = isset($data['title']) ? $data['title'] : '';
    $description = isset($data['description']) ? $data['description'] : '';
    ?>
    <div class="linku-repeater-item" data-index="<?php echo esc_attr($index); ?>">
        <div class="repeater-handle">
            <span class="dashicons dashicons-menu"></span>
        </div>
        
        <div class="repeater-content">
            <div class="repeater-field">
                <label><?php _e('آیکون', 'linku-landing'); ?></label>
                <input type="text" name="linku_blocks[<?php echo $index; ?>][icon]" 
                       value="<?php echo esc_attr($icon); ?>">
            </div>
            
            <div class="repeater-field">
                <label><?php _e('عنوان', 'linku-landing'); ?></label>
                <input type="text" name="linku_blocks[<?php echo $index; ?>][title]" 
                       value="<?php echo esc_attr($title); ?>">
            </div>
            
            <div class="repeater-field">
                <label><?php _e('توضیحات', 'linku-landing'); ?></label>
                <textarea name="linku_blocks[<?php echo $index; ?>][description]" 
                          rows="3"><?php echo esc_textarea($description); ?></textarea>
            </div>
        </div>
        
        <div class="repeater-actions">
            <button type="button" class="button button-link-delete linku-remove-row">
                <span class="dashicons dashicons-trash"></span>
            </button>
        </div>
    </div>
    <?php
}

/**
 * متاباکس سوالات متداول
 */
function linku_faq_metabox_callback($post) {
    wp_nonce_field('linku_save_faq', 'linku_faq_nonce');
    
    $faqs = get_post_meta($post->ID, '_linku_faqs', true);
    if (!is_array($faqs)) {
        $faqs = array();
    }
    ?>
    
    <div class="linku-repeater-wrap">
        <div class="linku-repeater-header">
            <button type="button" class="button button-primary linku-add-row">
                <span class="dashicons dashicons-plus-alt"></span>
                <?php _e('افزودن سوال جدید', 'linku-landing'); ?>
            </button>
        </div>
        
        <div class="linku-repeater-items sortable" data-field="faqs">
            <?php
            if (!empty($faqs)) {
                foreach ($faqs as $index => $faq) {
                    linku_render_faq_row($index, $faq);
                }
            }
            ?>
        </div>
        
        <script type="text/template" id="linku-faq-template">
            <?php linku_render_faq_row('{{INDEX}}', array()); ?>
        </script>
    </div>
    <?php
}

/**
 * رندر کردن یک ردیف FAQ
 */
function linku_render_faq_row($index, $data) {
    $question = isset($data['question']) ? $data['question'] : '';
    $answer = isset($data['answer']) ? $data['answer'] : '';
    ?>
    <div class="linku-repeater-item" data-index="<?php echo esc_attr($index); ?>">
        <div class="repeater-handle">
            <span class="dashicons dashicons-menu"></span>
        </div>
        
        <div class="repeater-content">
            <div class="repeater-field">
                <label><?php _e('سوال', 'linku-landing'); ?></label>
                <input type="text" name="linku_faqs[<?php echo $index; ?>][question]" 
                       value="<?php echo esc_attr($question); ?>">
            </div>
            
            <div class="repeater-field">
                <label><?php _e('پاسخ', 'linku-landing'); ?></label>
                <textarea name="linku_faqs[<?php echo $index; ?>][answer]" 
                          rows="4"><?php echo esc_textarea($answer); ?></textarea>
            </div>
        </div>
        
        <div class="repeater-actions">
            <button type="button" class="button button-link-delete linku-remove-row">
                <span class="dashicons dashicons-trash"></span>
            </button>
        </div>
    </div>
    <?php
}

/**
 * ذخیره کردن متاباکس‌ها
 */
function linku_save_meta_boxes($post_id) {
    // چک کردن autosave
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    // چک کردن مجوز
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    
    // ذخیره هیرو
    if (isset($_POST['linku_hero_nonce']) && wp_verify_nonce($_POST['linku_hero_nonce'], 'linku_save_hero')) {
        if (isset($_POST['linku_hero_title'])) {
            update_post_meta($post_id, '_linku_hero_title', sanitize_text_field($_POST['linku_hero_title']));
        }
        if (isset($_POST['linku_hero_subtitle'])) {
            update_post_meta($post_id, '_linku_hero_subtitle', sanitize_text_field($_POST['linku_hero_subtitle']));
        }
        if (isset($_POST['linku_hero_description'])) {
            update_post_meta($post_id, '_linku_hero_description', sanitize_textarea_field($_POST['linku_hero_description']));
        }
        if (isset($_POST['linku_hero_button_text'])) {
            update_post_meta($post_id, '_linku_hero_button_text', sanitize_text_field($_POST['linku_hero_button_text']));
        }
        if (isset($_POST['linku_hero_button_link'])) {
            update_post_meta($post_id, '_linku_hero_button_link', esc_url_raw($_POST['linku_hero_button_link']));
        }
        if (isset($_POST['linku_hero_image'])) {
            update_post_meta($post_id, '_linku_hero_image', absint($_POST['linku_hero_image']));
        }
    }
    
    // ذخیره ویژگی‌ها
    if (isset($_POST['linku_features_nonce']) && wp_verify_nonce($_POST['linku_features_nonce'], 'linku_save_features')) {
        if (isset($_POST['linku_features']) && is_array($_POST['linku_features'])) {
            $features = array_map(function($feature) {
                return array(
                    'icon' => sanitize_text_field($feature['icon']),
                    'title' => sanitize_text_field($feature['title']),
                    'description' => sanitize_textarea_field($feature['description']),
                );
            }, $_POST['linku_features']);
            update_post_meta($post_id, '_linku_features', $features);
        } else {
            delete_post_meta($post_id, '_linku_features');
        }
    }
    
    // ذخیره آمار
    if (isset($_POST['linku_stats_nonce']) && wp_verify_nonce($_POST['linku_stats_nonce'], 'linku_save_stats')) {
        if (isset($_POST['linku_stats']) && is_array($_POST['linku_stats'])) {
            $stats = array_map(function($stat) {
                return array(
                    'number' => sanitize_text_field($stat['number']),
                    'label' => sanitize_text_field($stat['label']),
                );
            }, $_POST['linku_stats']);
            update_post_meta($post_id, '_linku_stats', $stats);
        } else {
            delete_post_meta($post_id, '_linku_stats');
        }
    }
    
    // ذخیره بلوک‌ها
    if (isset($_POST['linku_blocks_nonce']) && wp_verify_nonce($_POST['linku_blocks_nonce'], 'linku_save_blocks')) {
        if (isset($_POST['linku_blocks']) && is_array($_POST['linku_blocks'])) {
            $blocks = array_map(function($block) {
                return array(
                    'icon' => sanitize_text_field($block['icon']),
                    'title' => sanitize_text_field($block['title']),
                    'description' => sanitize_textarea_field($block['description']),
                );
            }, $_POST['linku_blocks']);
            update_post_meta($post_id, '_linku_blocks', $blocks);
        } else {
            delete_post_meta($post_id, '_linku_blocks');
        }
    }
    
    // ذخیره FAQ
    if (isset($_POST['linku_faq_nonce']) && wp_verify_nonce($_POST['linku_faq_nonce'], 'linku_save_faq')) {
        if (isset($_POST['linku_faqs']) && is_array($_POST['linku_faqs'])) {
            $faqs = array_map(function($faq) {
                return array(
                    'question' => sanitize_text_field($faq['question']),
                    'answer' => sanitize_textarea_field($faq['answer']),
                );
            }, $_POST['linku_faqs']);
            update_post_meta($post_id, '_linku_faqs', $faqs);
        } else {
            delete_post_meta($post_id, '_linku_faqs');
        }
    }
}
add_action('save_post', 'linku_save_meta_boxes');
