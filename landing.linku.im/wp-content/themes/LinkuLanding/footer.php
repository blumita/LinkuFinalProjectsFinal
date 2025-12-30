<footer class="site-footer" style="background-color: <?php echo esc_attr(get_theme_mod('linku_footer_bg_color', '#f5f5f5')); ?>;">
    <div class="container">
        <?php if (is_active_sidebar('footer-1') || is_active_sidebar('footer-2') || is_active_sidebar('footer-3') || is_active_sidebar('footer-4')) : ?>
        <div class="footer-widgets">
            <div class="footer-row">
                <?php for ($i = 1; $i <= 4; $i++) : ?>
                    <div class="footer-column">
                        <?php 
                        if (is_active_sidebar('footer-' . $i)) {
                            dynamic_sidebar('footer-' . $i); 
                        }
                        ?>
                    </div>
                <?php endfor; ?>
            </div>
        </div>
        <?php endif; ?>
        
        <?php if (get_theme_mod('linku_show_social', true)) : ?>
            <div class="social-links">
                <?php
                $social_networks = array(
                    'instagram' => array('icon' => 'fab fa-instagram', 'label' => 'اینستاگرام'),
                    'telegram'  => array('icon' => 'fab fa-telegram', 'label' => 'تلگرام'),
                    'twitter'   => array('icon' => 'fab fa-twitter', 'label' => 'توییتر'),
                    'linkedin'  => array('icon' => 'fab fa-linkedin', 'label' => 'لینکدین'),
                    'youtube'   => array('icon' => 'fab fa-youtube', 'label' => 'یوتیوب'),
                    'whatsapp'  => array('icon' => 'fab fa-whatsapp', 'label' => 'واتساپ'),
                );
                
                foreach ($social_networks as $network => $data) {
                    $url = get_theme_mod('linku_social_' . $network);
                    if ($url) {
                        echo '<a href="' . esc_url($url) . '" target="_blank" rel="noopener" aria-label="' . esc_attr($data['label']) . '">';
                        echo '<i class="' . esc_attr($data['icon']) . '"></i>';
                        echo '</a>';
                    }
                }
                ?>
            </div>
        <?php endif; ?>
        
        <div class="footer-bottom">
            <div class="copyright">
                <?php echo wp_kses_post(get_theme_mod('linku_copyright_text', '© 2025 Linku. تمامی حقوق محفوظ است.')); ?>
            </div>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
