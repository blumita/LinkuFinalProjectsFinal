<?php
/**
 * Linku Landing Theme Functions
 * قالب اختصاصی با متاباکس‌های حرفه‌ای و Repeater دستی
 * 
 * @package Linku_Landing
 * @since 1.0.0
 */

if (!defined('ABSPATH')) exit;

// تعریف ثابت‌ها
define('LINKU_THEME_VERSION', '1.0.0');
define('LINKU_THEME_DIR', get_template_directory());
define('LINKU_THEME_URI', get_template_directory_uri());

/**
 * تنظیمات اولیه قالب
 */
function linku_theme_setup() {
    // پشتیبانی از زبان
    load_theme_textdomain('linku-landing', LINKU_THEME_DIR . '/languages');
    
    // پشتیبانی از قابلیت‌های وردپرس
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('automatic-feed-links');
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));
    
    // تصاویر شاخص سفارشی
    add_image_size('linku-hero', 1200, 800, true);
    add_image_size('linku-feature', 600, 400, true);
    add_image_size('linku-thumbnail', 400, 300, true);
    
    // منوها
    register_nav_menus(array(
        'primary' => __('منوی اصلی', 'linku-landing'),
        'footer' => __('منوی فوتر', 'linku-landing'),
    ));
    
    // پشتیبانی از لوگوی سفارشی
    add_theme_support('custom-logo', array(
        'height'      => 100,
        'width'       => 400,
        'flex-height' => true,
        'flex-width'  => true,
    ));
    
    // پشتیبانی از رنگ‌های سفارشی
    add_theme_support('custom-background');
    add_theme_support('customize-selective-refresh-widgets');
    
    // پشتیبانی از ویرایشگر بلوکی
    add_theme_support('align-wide');
    add_theme_support('responsive-embeds');
    add_theme_support('editor-styles');
}
add_action('after_setup_theme', 'linku_theme_setup');

/**
 * ثبت و بارگذاری اسکریپت‌ها و استایل‌ها
 */
function linku_enqueue_scripts() {
    // فونت وزیر - لوکال
    wp_enqueue_style('vazirmatn-font', LINKU_THEME_URI . '/assets/css/fonts.css', array(), LINKU_THEME_VERSION);
    
    // استایل اصلی
    wp_enqueue_style('linku-style', get_stylesheet_uri(), array('vazirmatn-font'), LINKU_THEME_VERSION);
    wp_enqueue_style('linku-main', LINKU_THEME_URI . '/assets/css/style.css', array('vazirmatn-font'), LINKU_THEME_VERSION);
    
    // اسکریپت‌ها
    wp_enqueue_script('linku-main', LINKU_THEME_URI . '/assets/js/main.js', array('jquery'), LINKU_THEME_VERSION, true);
    
    // داده‌های PHP به JS
    wp_localize_script('linku-main', 'linkuData', array(
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('linku-nonce'),
        'siteUrl' => home_url('/'),
    ));
    
    // RTL Support
    if (is_rtl()) {
        wp_enqueue_style('linku-rtl', LINKU_THEME_URI . '/assets/css/rtl.css', array('linku-style'), LINKU_THEME_VERSION);
    }
}
add_action('wp_enqueue_scripts', 'linku_enqueue_scripts');

/**
 * ثبت ناحیه‌های ویجت
 */
function linku_widgets_init() {
    register_sidebar(array(
        'name'          => __('نوار کناری', 'linkulanding'),
        'id'            => 'sidebar-1',
        'description'   => __('ناحیه ویجت نوار کناری', 'linkulanding'),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ));
    
    // فوتر ویجت‌ها
    register_sidebar(array(
        'name'          => __('ستون فوتر 1', 'linkulanding'),
        'id'            => 'footer-1',
        'description'   => __('ناحیه ویجت ستون اول فوتر', 'linkulanding'),
        'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ));
    
    register_sidebar(array(
        'name'          => __('ستون فوتر 2', 'linkulanding'),
        'id'            => 'footer-2',
        'description'   => __('ناحیه ویجت ستون دوم فوتر', 'linkulanding'),
        'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ));
    
    register_sidebar(array(
        'name'          => __('ستون فوتر 3', 'linkulanding'),
        'id'            => 'footer-3',
        'description'   => __('ناحیه ویجت ستون سوم فوتر', 'linkulanding'),
        'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ));
    
    register_sidebar(array(
        'name'          => __('ستون فوتر 4', 'linkulanding'),
        'id'            => 'footer-4',
        'description'   => __('ناحیه ویجت ستون چهارم فوتر', 'linkulanding'),
        'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ));
}
add_action('widgets_init', 'linku_widgets_init');

/**
 * فایل‌های اضافی
 */
require_once LINKU_THEME_DIR . '/inc/customizer.php';
require_once LINKU_THEME_DIR . '/inc/meta-boxes.php';
require_once LINKU_THEME_DIR . '/inc/demo-importer.php';

/**
 * اضافه کردن دکمه‌های ویرایش inline
 */
function linku_add_edit_buttons() {
    if (!is_user_logged_in() || !current_user_can('edit_theme_options')) {
        return;
    }
    
    wp_enqueue_style('linku-editor', LINKU_THEME_URI . '/assets/css/editor.css', array(), LINKU_THEME_VERSION);
    wp_enqueue_script('linku-editor', LINKU_THEME_URI . '/assets/js/editor.js', array('jquery'), LINKU_THEME_VERSION, true);
}
add_action('wp_enqueue_scripts', 'linku_add_edit_buttons');

/**
 * اضافه کردن استایل‌ها به ادمین
 */
function linku_admin_scripts($hook) {
    // فقط در صفحه ویرایش پست
    if ('post.php' !== $hook && 'post-new.php' !== $hook) {
        return;
    }
    
    // jQuery UI Sortable
    wp_enqueue_script('jquery-ui-sortable');
    
    // Media Uploader
    wp_enqueue_media();
    
    // استایل و اسکریپت ادمین
    wp_enqueue_style('linku-admin', LINKU_THEME_URI . '/assets/css/admin.css', array(), LINKU_THEME_VERSION);
    wp_enqueue_script('linku-admin', LINKU_THEME_URI . '/assets/js/admin.js', array('jquery', 'jquery-ui-sortable'), LINKU_THEME_VERSION, true);
    
    // Font Awesome برای آیکون‌ها
    wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', array(), '6.4.0');
}
add_action('admin_enqueue_scripts', 'linku_admin_scripts');
