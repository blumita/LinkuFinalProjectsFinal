<?php
/**
 * Theme Demo Importer
 * ایمپورتر اختصاصی برای قالب LinkuLanding
 * 
 * @package LinkuLanding
 * @version 2.0.0
 */

if (!defined('ABSPATH')) exit;

class Linku_Demo_Importer {
    
    private $demo_file;
    
    public function __construct() {
        $this->demo_file = LINKU_THEME_DIR . '/inc/demo-data.json';
        
        add_action('admin_menu', array($this, 'add_importer_page'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('wp_ajax_linku_import_demo', array($this, 'ajax_import_demo'));
    }
    
    /**
     * اضافه کردن صفحه ایمپورتر به منوی ادمین
     */
    public function add_importer_page() {
        add_theme_page(
            'ایمپورت محتوای نمونه',
            'ایمپورت دمو',
            'manage_options',
            'linku-demo-importer',
            array($this, 'importer_page')
        );
    }
    
    /**
     * بارگذاری اسکریپت‌ها
     */
    public function enqueue_scripts($hook) {
        if ($hook !== 'appearance_page_linku-demo-importer') {
            return;
        }
        
        wp_enqueue_style('linku-importer', LINKU_THEME_URI . '/assets/css/importer.css', array(), LINKU_THEME_VERSION);
        wp_enqueue_script('linku-importer', LINKU_THEME_URI . '/assets/js/importer.js', array('jquery'), LINKU_THEME_VERSION, true);
        
        wp_localize_script('linku-importer', 'linkuImporter', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('linku-import-demo'),
        ));
    }
    
    /**
     * صفحه ایمپورتر
     */
    public function importer_page() {
        ?>
        <div class="wrap linku-importer-wrap">
            <h1>ایمپورت محتوای نمونه LinkuLanding</h1>
            
            <div class="linku-importer-content">
                <div class="importer-notice">
                    <h3>⚠️ قبل از ایمپورت:</h3>
                    <ul>
                        <li>✅ حتماً از دیتابیس خود نسخه پشتیبان بگیرید</li>
                        <li>✅ این ایمپورتر محتوای نمونه کامل را وارد می‌کند</li>
                        <li>✅ شامل: صفحات، تنظیمات، منوها</li>
                        <li>⚠️ صفحات تکراری ایجاد نمی‌شوند</li>
                    </ul>
                </div>
                
                <div class="importer-box">
                    <div class="importer-preview">
                        <img src="<?php echo LINKU_THEME_URI; ?>/screenshot.png" alt="نمایش دمو">
                        <h2>محتوای نمونه لینکو</h2>
                        <p>لندینگ پیج کامل با تمام بخش‌ها، تنظیمات و محتوای حرفه‌ای</p>
                    </div>
                    
                    <div class="importer-items">
                        <h3>موارد قابل ایمپورت:</h3>
                        <ul class="import-checklist">
                            <li>
                                <label>
                                    <input type="checkbox" name="import_pages" checked disabled>
                                    <span>صفحات (صفحه اصلی، درباره ما، تماس، قوانین، حریم خصوصی)</span>
                                </label>
                            </li>
                            <li>
                                <label>
                                    <input type="checkbox" name="import_customizer" checked disabled>
                                    <span>تنظیمات Customizer (رنگ‌ها، فونت‌ها، CTA)</span>
                                </label>
                            </li>
                            <li>
                                <label>
                                    <input type="checkbox" name="import_menus" checked disabled>
                                    <span>منوها (منوی اصلی + فوتر)</span>
                                </label>
                            </li>
                            <li>
                                <label>
                                    <input type="checkbox" name="import_meta" checked disabled>
                                    <span>محتوای متاباکس‌ها (ویژگی‌ها، آمار، FAQ)</span>
                                </label>
                            </li>
                        </ul>
                    </div>
                    
                    <div class="importer-actions">
                        <button type="button" class="button button-primary button-hero" id="linku-start-import">
                            <span class="dashicons dashicons-download"></span>
                            شروع ایمپورت
                        </button>
                    </div>
                    
                    <div class="importer-progress" style="display: none;">
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                        <p class="progress-text">در حال ایمپورت...</p>
                    </div>
                    
                    <div class="importer-result" style="display: none;"></div>
                </div>
            </div>
        </div>
        <?php
    }
    
    /**
     * AJAX Handler برای ایمپورت
     */
    public function ajax_import_demo() {
        check_ajax_referer('linku-import-demo', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error('دسترسی غیرمجاز');
        }
        
        // خواندن فایل دمو
        if (!file_exists($this->demo_file)) {
            wp_send_json_error('فایل دمو یافت نشد');
        }
        
        $demo_data = json_decode(file_get_contents($this->demo_file), true);
        
        if (!$demo_data) {
            wp_send_json_error('خطا در خواندن فایل دمو');
        }
        
        $results = array();
        
        // ایمپورت صفحات
        if (isset($demo_data['pages'])) {
            $results['pages'] = $this->import_pages($demo_data['pages']);
        }
        
        // ایمپورت تنظیمات Customizer
        if (isset($demo_data['customizer'])) {
            $results['customizer'] = $this->import_customizer($demo_data['customizer']);
        }
        
        // ایمپورت منوها
        if (isset($demo_data['menus'])) {
            $results['menus'] = $this->import_menus($demo_data['menus']);
        }
        
        wp_send_json_success($results);
    }
    
    /**
     * ایمپورت صفحات
     */
    private function import_pages($pages) {
        $imported = array();
        
        foreach ($pages as $page_data) {
            // چک کردن وجود صفحه با slug
            $slug = isset($page_data['slug']) ? $page_data['slug'] : sanitize_title($page_data['title']);
            $existing = get_page_by_path($slug);
            
            if ($existing) {
                $page_id = $existing->ID;
                // آپدیت صفحه موجود
                wp_update_post(array(
                    'ID' => $page_id,
                    'post_content' => isset($page_data['content']) ? $page_data['content'] : '',
                    'page_template' => isset($page_data['template']) ? $page_data['template'] : '',
                ));
            } else {
                // ساخت صفحه جدید
                $page_id = wp_insert_post(array(
                    'post_title'     => $page_data['title'],
                    'post_name'      => $slug,
                    'post_content'   => isset($page_data['content']) ? $page_data['content'] : '',
                    'post_status'    => 'publish',
                    'post_type'      => 'page',
                    'page_template'  => isset($page_data['template']) ? $page_data['template'] : '',
                ));
            }
            
            if ($page_id && !is_wp_error($page_id)) {
                // ذخیره متادیتا
                if (isset($page_data['meta']) && is_array($page_data['meta'])) {
                    foreach ($page_data['meta'] as $key => $value) {
                        update_post_meta($page_id, $key, $value);
                    }
                }
                
                $imported[] = array(
                    'id' => $page_id,
                    'title' => $page_data['title'],
                    'url' => get_permalink($page_id)
                );
                
                // تنظیم صفحه اصلی
                if (isset($page_data['is_front_page']) && $page_data['is_front_page']) {
                    update_option('show_on_front', 'page');
                    update_option('page_on_front', $page_id);
                }
            }
        }
        
        return $imported;
    }
    
    /**
     * ایمپورت تنظیمات Customizer
     */
    private function import_customizer($settings) {
        $imported = 0;
        
        foreach ($settings as $key => $value) {
            set_theme_mod($key, $value);
            $imported++;
        }
        
        return $imported;
    }
    
    /**
     * ایمپورت منوها
     */
    private function import_menus($menus) {
        $imported = array();
        
        foreach ($menus as $menu_data) {
            // حذف منوی قدیمی اگر وجود داشت
            $existing = wp_get_nav_menu_object($menu_data['name']);
            if ($existing) {
                wp_delete_nav_menu($existing->term_id);
            }
            
            // ساخت منوی جدید
            $menu_id = wp_create_nav_menu($menu_data['name']);
            
            if ($menu_id && !is_wp_error($menu_id)) {
                // اضافه کردن آیتم‌ها
                if (isset($menu_data['items']) && is_array($menu_data['items'])) {
                    foreach ($menu_data['items'] as $item) {
                        wp_update_nav_menu_item($menu_id, 0, array(
                            'menu-item-title'   => $item['title'],
                            'menu-item-url'     => $item['url'],
                            'menu-item-status'  => 'publish',
                            'menu-item-position' => isset($item['order']) ? $item['order'] : 0
                        ));
                    }
                }
                
                // تخصیص به لوکیشن
                if (isset($menu_data['location'])) {
                    $locations = get_theme_mod('nav_menu_locations');
                    if (!is_array($locations)) {
                        $locations = array();
                    }
                    $locations[$menu_data['location']] = $menu_id;
                    set_theme_mod('nav_menu_locations', $locations);
                }
                
                $imported[] = $menu_data['name'];
            }
        }
        
        return $imported;
    }
}

// Initialize
new Linku_Demo_Importer();
