<?php
/**
 * The main template file
 *
 * @package Linku_Landing
 */

get_header();
?>

<main class="site-main">
    <div class="container">
        <?php
        if (have_posts()) :
            while (have_posts()) :
                the_post();
                the_content();
            endwhile;
        else :
            echo '<p>محتوایی یافت نشد.</p>';
        endif;
        ?>
    </div>
</main>

<?php
get_footer();
