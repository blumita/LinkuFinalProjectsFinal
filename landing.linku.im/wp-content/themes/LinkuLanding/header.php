<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header <?php echo get_theme_mod('linku_transparent_header', true) ? 'transparent' : ''; ?> <?php echo get_theme_mod('linku_sticky_header', true) ? 'sticky' : ''; ?>">
    <div class="container">
        <nav class="main-navigation">
            <div class="logo">
                <?php
                if (has_custom_logo()) {
                    the_custom_logo();
                } else {
                    echo '<a href="' . esc_url(home_url('/')) . '" class="logo-text">';
                    echo esc_html(get_theme_mod('linku_logo_text', 'لینکو'));
                    echo '</a>';
                }
                ?>
            </div>
            
            <div class="menu-toggle" aria-label="<?php esc_attr_e('منوی موبایل', 'linku-landing'); ?>">
                <span></span>
                <span></span>
                <span></span>
            </div>
            
            <?php
            wp_nav_menu(array(
                'theme_location' => 'primary',
                'container'      => 'div',
                'container_class' => 'primary-menu',
                'menu_class'     => 'nav-menu',
                'fallback_cb'    => false,
            ));
            ?>
            
            <div class="header-cta">
                <a href="<?php echo esc_url(get_theme_mod('linku_header_cta_link', '#')); ?>" class="btn btn-primary">
                    <?php echo esc_html(get_theme_mod('linku_header_cta_text', 'ثبت نام رایگان')); ?>
                </a>
            </div>
        </nav>
    </div>
</header>
