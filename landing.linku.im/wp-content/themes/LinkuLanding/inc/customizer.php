<?php
/**
 * Theme Customizer
 * 
 * @package Linku_Landing_Pro
 */

if (!defined('ABSPATH')) exit;

/**
 * افزودن تنظیمات Customizer
 */
function linku_customize_register($wp_customize) {
    
    // ============ بخش عمومی ============
    $wp_customize->add_section('linku_general', array(
        'title'    => __('تنظیمات عمومی', 'linku-landing'),
        'priority' => 30,
    ));
    
    // سایز لوگو
    $wp_customize->add_setting('linku_logo_size', array(
        'default'           => 120,
        'sanitize_callback' => 'absint',
        'transport'         => 'postMessage',
    ));
    $wp_customize->add_control('linku_logo_size', array(
        'label'       => __('سایز لوگو (پیکسل)', 'linku-landing'),
        'section'     => 'linku_general',
        'type'        => 'range',
        'input_attrs' => array(
            'min'  => 40,
            'max'  => 300,
            'step' => 5,
        ),
    ));
    
    // رنگ اصلی
    $wp_customize->add_setting('linku_primary_color', array(
        'default'           => '#000000',
        'sanitize_callback' => 'sanitize_hex_color',
        'transport'         => 'postMessage',
    ));
    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'linku_primary_color', array(
        'label'    => __('رنگ اصلی (مشکی)', 'linku-landing'),
        'section'  => 'linku_general',
        'settings' => 'linku_primary_color',
    )));
    
    // رنگ ثانویه
    $wp_customize->add_setting('linku_secondary_color', array(
        'default'           => '#ffffff',
        'sanitize_callback' => 'sanitize_hex_color',
        'transport'         => 'postMessage',
    ));
    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'linku_secondary_color', array(
        'label'    => __('رنگ ثانویه (سفید)', 'linku-landing'),
        'section'  => 'linku_general',
        'settings' => 'linku_secondary_color',
    )));
    
    // رنگ خاکستری
    $wp_customize->add_setting('linku_gray_color', array(
        'default'           => '#f5f5f5',
        'sanitize_callback' => 'sanitize_hex_color',
        'transport'         => 'postMessage',
    ));
    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'linku_gray_color', array(
        'label'    => __('رنگ خاکستری', 'linku-landing'),
        'section'  => 'linku_general',
        'settings' => 'linku_gray_color',
    )));
    
    // ============ بخش Hero ============
    $wp_customize->add_section('linku_hero', array(
        'title'    => __('بخش Hero', 'linku-landing'),
        'priority' => 31,
    ));
    
    // عنوان اصلی
    $wp_customize->add_setting('linku_hero_title_1', array(
        'default'           => 'شروع با تو،',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));
    $wp_customize->add_control('linku_hero_title_1', array(
        'label'    => __('عنوان اصلی (خط اول)', 'linku-landing'),
        'section'  => 'linku_hero',
        'type'     => 'text',
    ));
    
    $wp_customize->add_setting('linku_hero_title_2', array(
        'default'           => 'بقیه‌اش با لینکو',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));
    $wp_customize->add_control('linku_hero_title_2', array(
        'label'    => __('عنوان اصلی (خط دوم)', 'linku-landing'),
        'section'  => 'linku_hero',
        'type'     => 'text',
    ));
    
    // توضیحات Hero
    $wp_customize->add_setting('linku_hero_description', array(
        'default'           => 'درباره خودتان یا کسب‌و‌کارتان بنویسید، لینک‌های مهم‌تان را به اشتراک بگذارید',
        'sanitize_callback' => 'sanitize_textarea_field',
        'transport'         => 'postMessage',
    ));
    $wp_customize->add_control('linku_hero_description', array(
        'label'    => __('توضیحات Hero', 'linku-landing'),
        'section'  => 'linku_hero',
        'type'     => 'textarea',
    ));
    
    // دکمه اول
    $wp_customize->add_setting('linku_hero_btn1_text', array(
        'default'           => 'ساخت لینکو رایگان',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));
    $wp_customize->add_control('linku_hero_btn1_text', array(
        'label'    => __('متن دکمه اول', 'linku-landing'),
        'section'  => 'linku_hero',
        'type'     => 'text',
    ));
    
    $wp_customize->add_setting('linku_hero_btn1_url', array(
        'default'           => '#',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control('linku_hero_btn1_url', array(
        'label'    => __('لینک دکمه اول', 'linku-landing'),
        'section'  => 'linku_hero',
        'type'     => 'url',
    ));
    
    // دکمه دوم
    $wp_customize->add_setting('linku_hero_btn2_text', array(
        'default'           => 'مشاهده نمونه‌ها',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));
    $wp_customize->add_control('linku_hero_btn2_text', array(
        'label'    => __('متن دکمه دوم', 'linku-landing'),
        'section'  => 'linku_hero',
        'type'     => 'text',
    ));
    
    $wp_customize->add_setting('linku_hero_btn2_url', array(
        'default'           => '#',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control('linku_hero_btn2_url', array(
        'label'    => __('لینک دکمه دوم', 'linku-landing'),
        'section'  => 'linku_hero',
        'type'     => 'url',
    ));
    
    // ============ بخش آمار ============
    $wp_customize->add_section('linku_stats', array(
        'title'    => __('بخش آمار', 'linku-landing'),
        'priority' => 32,
    ));
    
    // نمایش/عدم نمایش بخش آمار
    $wp_customize->add_setting('linku_stats_show', array(
        'default'           => true,
        'sanitize_callback' => 'wp_validate_boolean',
    ));
    $wp_customize->add_control('linku_stats_show', array(
        'label'    => __('نمایش بخش آمار', 'linku-landing'),
        'section'  => 'linku_stats',
        'type'     => 'checkbox',
    ));
    
    // عنوان بخش
    $wp_customize->add_setting('linku_stats_title', array(
        'default'           => 'آمار و ارقام لینکو',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));
    $wp_customize->add_control('linku_stats_title', array(
        'label'    => __('عنوان بخش آمار', 'linku-landing'),
        'section'  => 'linku_stats',
        'type'     => 'text',
    ));
    
    // ============ بخش CTA ============
    $wp_customize->add_section('linku_cta', array(
        'title'    => __('بخش فراخوان (CTA)', 'linku-landing'),
        'priority' => 33,
    ));
    
    // عنوان CTA
    $wp_customize->add_setting('linku_cta_title', array(
        'default'           => 'همین الان شروع کنید',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));
    $wp_customize->add_control('linku_cta_title', array(
        'label'    => __('عنوان CTA', 'linku-landing'),
        'section'  => 'linku_cta',
        'type'     => 'text',
    ));
    
    // توضیحات CTA
    $wp_customize->add_setting('linku_cta_description', array(
        'default'           => 'در کمتر از ۲ دقیقه صفحه لینک حرفه‌ای خود را بسازید',
        'sanitize_callback' => 'sanitize_textarea_field',
        'transport'         => 'postMessage',
    ));
    $wp_customize->add_control('linku_cta_description', array(
        'label'    => __('توضیحات CTA', 'linku-landing'),
        'section'  => 'linku_cta',
        'type'     => 'textarea',
    ));
    
    // متن دکمه CTA
    $wp_customize->add_setting('linku_cta_button_text', array(
        'default'           => 'ساخت پروفایل رایگان',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));
    $wp_customize->add_control('linku_cta_button_text', array(
        'label'    => __('متن دکمه CTA', 'linku-landing'),
        'section'  => 'linku_cta',
        'type'     => 'text',
    ));
    
    // لینک دکمه CTA
    $wp_customize->add_setting('linku_cta_button_url', array(
        'default'           => 'https://dash.linku.im/auth/login',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control('linku_cta_button_url', array(
        'label'    => __('لینک دکمه CTA', 'linku-landing'),
        'section'  => 'linku_cta',
        'type'     => 'url',
    ));
    
    // رنگ پس‌زمینه CTA
    $wp_customize->add_setting('linku_cta_bg_color', array(
        'default'           => '#000000',
        'sanitize_callback' => 'sanitize_hex_color',
        'transport'         => 'postMessage',
    ));
    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'linku_cta_bg_color', array(
        'label'    => __('رنگ پس‌زمینه CTA', 'linku-landing'),
        'section'  => 'linku_cta',
        'settings' => 'linku_cta_bg_color',
    )));
    
    // ============ بخش فوتر ============
    $wp_customize->add_section('linku_footer', array(
        'title'    => __('تنظیمات فوتر', 'linku-landing'),
        'priority' => 34,
    ));
    
    // متن کپی‌رایت
    $wp_customize->add_setting('linku_copyright_text', array(
        'default'           => '© 2025 Linku. تمامی حقوق محفوظ است.',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));
    $wp_customize->add_control('linku_copyright_text', array(
        'label'    => __('متن کپی‌رایت', 'linku-landing'),
        'section'  => 'linku_footer',
        'type'     => 'text',
    ));
    
    // رنگ پس‌زمینه فوتر
    $wp_customize->add_setting('linku_footer_bg_color', array(
        'default'           => '#f5f5f5',
        'sanitize_callback' => 'sanitize_hex_color',
        'transport'         => 'postMessage',
    ));
    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'linku_footer_bg_color', array(
        'label'    => __('رنگ پس‌زمینه فوتر', 'linku-landing'),
        'section'  => 'linku_footer',
        'settings' => 'linku_footer_bg_color',
    )));
}
add_action('customize_register', 'linku_customize_register');

/**
 * خروجی CSS سفارشی بر اساس تنظیمات Customizer
 */
function linku_customizer_css() {
    $primary_color = get_theme_mod('linku_primary_color', '#000000');
    $secondary_color = get_theme_mod('linku_secondary_color', '#ffffff');
    $gray_color = get_theme_mod('linku_gray_color', '#f5f5f5');
    $cta_bg_color = get_theme_mod('linku_cta_bg_color', '#000000');
    $footer_bg_color = get_theme_mod('linku_footer_bg_color', '#f5f5f5');
    $logo_size = get_theme_mod('linku_logo_size', 120);
    
    ?>
    <style type="text/css">
        :root {
            --color-primary: <?php echo esc_attr($primary_color); ?>;
            --color-secondary: <?php echo esc_attr($secondary_color); ?>;
            --color-gray: <?php echo esc_attr($gray_color); ?>;
        }
        
        .logo img,
        .custom-logo {
            max-width: <?php echo esc_attr($logo_size); ?>px !important;
            height: auto !important;
        }
        
        .btn-primary,
        .linku-hero .primary-button {
            background-color: <?php echo esc_attr($primary_color); ?>;
        }
        
        .btn-outline {
            border-color: <?php echo esc_attr($primary_color); ?>;
            color: <?php echo esc_attr($primary_color); ?>;
        }
        
        .btn-outline:hover {
            background-color: <?php echo esc_attr($primary_color); ?>;
            color: <?php echo esc_attr($secondary_color); ?>;
        }
        
        .linku-cta {
            background-color: <?php echo esc_attr($cta_bg_color); ?>;
        }
        
        .linku-footer {
            background-color: <?php echo esc_attr($footer_bg_color); ?>;
        }
    </style>
    <?php
}
add_action('wp_head', 'linku_customizer_css');

/**
 * پیش‌نمایش زنده Customizer
 */
function linku_customizer_live_preview() {
    wp_enqueue_script(
        'linku-customizer',
        LINKU_THEME_URI . '/assets/js/customizer.js',
        array('jquery', 'customize-preview'),
        LINKU_THEME_VERSION,
        true
    );
}
add_action('customize_preview_init', 'linku_customizer_live_preview');
