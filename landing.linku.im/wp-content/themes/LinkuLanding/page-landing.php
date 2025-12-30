<?php
/**
 * Template Name: صفحه اصلی لندینگ
 * 
 * @package Linku_Landing
 */

get_header();
?>

<?php while (have_posts()) : the_post(); ?>

<!-- بخش هیرو -->
<section class="hero-section">
    <div class="container">
        <div class="hero-content">
            <div class="hero-text">
                <?php
                $hero_title = get_post_meta(get_the_ID(), '_linku_hero_title', true);
                $hero_subtitle = get_post_meta(get_the_ID(), '_linku_hero_subtitle', true);
                $hero_description = get_post_meta(get_the_ID(), '_linku_hero_description', true);
                $hero_button_text = get_post_meta(get_the_ID(), '_linku_hero_button_text', true) ?: 'شروع رایگان';
                $hero_button_link = get_post_meta(get_the_ID(), '_linku_hero_button_link', true) ?: '#';
                ?>
                
                <?php if ($hero_title) : ?>
                    <h1 class="hero-title animate-fade-in">
                        <?php echo esc_html($hero_title); ?>
                    </h1>
                <?php endif; ?>
                
                <?php if ($hero_subtitle) : ?>
                    <p class="hero-subtitle">
                        <?php echo esc_html($hero_subtitle); ?>
                    </p>
                <?php endif; ?>
                
                <?php if ($hero_description) : ?>
                    <p class="hero-description">
                        <?php echo esc_html($hero_description); ?>
                    </p>
                <?php endif; ?>
                
                <div class="hero-buttons">
                    <a href="<?php echo esc_url($hero_button_link); ?>" class="btn btn-primary btn-lg">
                        <?php echo esc_html($hero_button_text); ?>
                    </a>
                </div>
            </div>
            
            <div class="hero-image">
                <?php
                $hero_image_id = get_post_meta(get_the_ID(), '_linku_hero_image', true);
                if ($hero_image_id) {
                    echo wp_get_attachment_image($hero_image_id, 'linku-hero', false, array('class' => 'animate-slide-up'));
                }
                ?>
            </div>
        </div>
    </div>
</section>

<!-- بخش آمار -->
<?php
$stats = get_post_meta(get_the_ID(), '_linku_stats', true);
if (!empty($stats)) :
?>
<section class="stats-section">
    <div class="container">
        <div class="stats-grid">
            <?php foreach ($stats as $stat) : ?>
                <div class="stat-item">
                    <div class="stat-number"><?php echo esc_html($stat['number']); ?></div>
                    <div class="stat-label"><?php echo esc_html($stat['label']); ?></div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
<?php endif; ?>

<!-- بخش ویژگی‌ها -->
<?php
$features = get_post_meta(get_the_ID(), '_linku_features', true);
if (!empty($features)) :
?>
<section class="features-section">
    <div class="container">
        <div class="section-header text-center">
            <h2>ویژگی‌های لینکو</h2>
            <p>ابزارهای قدرتمند برای رشد آنلاین شما</p>
        </div>
        
        <div class="features-grid">
            <?php foreach ($features as $feature) : ?>
                <div class="feature-card">
                    <?php if (!empty($feature['icon'])) : ?>
                        <div class="feature-icon">
                            <i class="<?php echo esc_attr($feature['icon']); ?>"></i>
                        </div>
                    <?php endif; ?>
                    
                    <h3 class="feature-title"><?php echo esc_html($feature['title']); ?></h3>
                    <p class="feature-description"><?php echo esc_html($feature['description']); ?></p>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
<?php endif; ?>

<!-- بخش بلوک‌ها -->
<?php
$blocks = get_post_meta(get_the_ID(), '_linku_blocks', true);
if (!empty($blocks)) :
?>
<section class="blocks-section">
    <div class="container">
        <div class="section-header text-center">
            <h2>آشنایی با بلوک‌ها</h2>
            <p>ابزارهای متنوع برای ساخت صفحه حرفه‌ای</p>
        </div>
        
        <div class="blocks-grid">
            <?php foreach ($blocks as $block) : ?>
                <div class="block-card">
                    <?php if (!empty($block['icon'])) : ?>
                        <div class="block-icon">
                            <i class="<?php echo esc_attr($block['icon']); ?>"></i>
                        </div>
                    <?php endif; ?>
                    
                    <h3 class="block-title"><?php echo esc_html($block['title']); ?></h3>
                    <p class="block-description"><?php echo esc_html($block['description']); ?></p>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
<?php endif; ?>

<!-- بخش سوالات متداول -->
<?php
$faqs = get_post_meta(get_the_ID(), '_linku_faqs', true);
if (!empty($faqs)) :
?>
<section class="faq-section">
    <div class="container">
        <div class="section-header text-center">
            <h2>سوالات پرتکرار</h2>
            <p>پاسخ سوالات شما درباره لینکو</p>
        </div>
        
        <div class="faq-accordion">
            <?php foreach ($faqs as $index => $faq) : ?>
                <div class="faq-item">
                    <button class="faq-question" aria-expanded="false">
                        <?php echo esc_html($faq['question']); ?>
                        <span class="faq-toggle"></span>
                    </button>
                    <div class="faq-answer" style="display: none;">
                        <p><?php echo esc_html($faq['answer']); ?></p>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
<?php endif; ?>

<!-- بخش CTA -->
<section class="cta-section" style="background-color: <?php echo esc_attr(get_theme_mod('linku_cta_bg_color', '#000000')); ?>;">
    <div class="container">
        <div class="cta-content text-center">
            <h2><?php echo esc_html(get_theme_mod('linku_cta_title', 'همین الان شروع کنید')); ?></h2>
            <p><?php echo esc_html(get_theme_mod('linku_cta_description', 'در کمتر از ۲ دقیقه صفحه لینک خود را بسازید')); ?></p>
            <div class="cta-buttons">
                <a href="<?php echo esc_url(get_theme_mod('linku_cta_button_url', 'https://dash.linku.im/auth/login')); ?>" class="btn btn-secondary btn-lg" target="_blank" rel="noopener noreferrer">
                    <?php echo esc_html(get_theme_mod('linku_cta_button_text', 'ساخت پروفایل رایگان')); ?>
                </a>
            </div>
        </div>
    </div>
</section>

<?php endwhile; ?>

<?php get_footer(); ?>
