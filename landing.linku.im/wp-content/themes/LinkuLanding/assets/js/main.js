(function($) {
    'use strict';

    /**
     * Mobile Menu Toggle
     */
    function initMobileMenu() {
        const menuToggle = $('.menu-toggle');
        const primaryMenu = $('.primary-menu');

        menuToggle.on('click', function() {
            primaryMenu.toggleClass('active');
            $(this).toggleClass('active');
        });
    }

    /**
     * Sticky Header
     */
    function initStickyHeader() {
        const header = $('.site-header');
        
        if (!header.hasClass('sticky')) {
            return;
        }

        $(window).on('scroll', function() {
            if ($(window).scrollTop() > 100) {
                header.addClass('scrolled');
                header.removeClass('transparent');
            } else {
                header.removeClass('scrolled');
                if (header.data('transparent')) {
                    header.addClass('transparent');
                }
            }
        });
    }

    /**
     * FAQ Accordion
     */
    function initFaqAccordion() {
        $('.faq-question').on('click', function() {
            const $this = $(this);
            const $answer = $this.next('.faq-answer');
            const isExpanded = $this.attr('aria-expanded') === 'true';

            // بستن همه آکاردیون‌ها
            $('.faq-question').attr('aria-expanded', 'false');
            $('.faq-answer').slideUp(300);

            // باز کردن آکاردیون کلیک شده
            if (!isExpanded) {
                $this.attr('aria-expanded', 'true');
                $answer.slideDown(300);
            }
        });
    }

    /**
     * Smooth Scroll
     */
    function initSmoothScroll() {
        $('a[href*="#"]').not('[href="#"]').not('[href="#0"]').on('click', function(e) {
            if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') 
                && location.hostname === this.hostname) {
                
                const target = $(this.hash);
                const $target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                
                if ($target.length) {
                    e.preventDefault();
                    $('html, body').animate({
                        scrollTop: $target.offset().top - 80
                    }, 800, 'swing');
                }
            }
        });
    }

    /**
     * Scroll Animations
     */
    function initScrollAnimations() {
        const $animatedElements = $('.feature-card, .block-card, .stat-item');

        function checkIfInView() {
            const windowHeight = $(window).height();
            const scrollTop = $(window).scrollTop();

            $animatedElements.each(function() {
                const $element = $(this);
                const elementTop = $element.offset().top;

                if (elementTop < scrollTop + windowHeight - 100) {
                    $element.addClass('animate-fade-in');
                }
            });
        }

        $(window).on('scroll', checkIfInView);
        checkIfInView();
    }

    /**
     * CTA Form Handler
     */
    function initCtaForm() {
        $('.cta-section .btn').on('click', function(e) {
            e.preventDefault();
            
            const username = $(this).siblings('.cta-input').val().trim();
            
            if (username === '') {
                alert('لطفاً نام کاربری خود را وارد کنید');
                return;
            }

            // اینجا می‌تونید لاجیک ثبت نام رو اضافه کنید
            // مثلاً AJAX به API یا redirect به صفحه ثبت نام
            
            const signupUrl = '/signup?username=' + encodeURIComponent(username);
            window.location.href = signupUrl;
        });

        // Enter key support
        $('.cta-input').on('keypress', function(e) {
            if (e.which === 13) {
                $(this).siblings('.btn').click();
            }
        });
    }

    /**
     * Video Player (if exists)
     */
    function initVideoPlayer() {
        const $videoPlayers = $('.video-player');

        $videoPlayers.each(function() {
            const $player = $(this);
            const $video = $player.find('video');
            const $playBtn = $player.find('.play-button');

            if ($playBtn.length && $video.length) {
                $playBtn.on('click', function() {
                    if ($video[0].paused) {
                        $video[0].play();
                        $(this).hide();
                    }
                });

                $video.on('play', function() {
                    $playBtn.hide();
                });

                $video.on('pause', function() {
                    $playBtn.show();
                });
            }
        });
    }

    /**
     * Counter Animation
     */
    function initCounterAnimation() {
        const $counters = $('.stat-number');

        function animateCounter($counter) {
            const target = parseInt($counter.text().replace(/[^0-9]/g, ''));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const timer = setInterval(function() {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                $counter.text(Math.floor(current).toLocaleString('fa-IR'));
            }, 16);
        }

        $(window).on('scroll', function() {
            $counters.each(function() {
                const $counter = $(this);
                if (!$counter.hasClass('counted')) {
                    const elementTop = $counter.offset().top;
                    const scrollTop = $(window).scrollTop();
                    const windowHeight = $(window).height();

                    if (elementTop < scrollTop + windowHeight - 100) {
                        $counter.addClass('counted');
                        animateCounter($counter);
                    }
                }
            });
        });
    }

    /**
     * Initialize All
     */
    $(document).ready(function() {
        initMobileMenu();
        initStickyHeader();
        initFaqAccordion();
        initSmoothScroll();
        initScrollAnimations();
        initCtaForm();
        initVideoPlayer();
        initCounterAnimation();

        // Remove loading class
        $('body').removeClass('loading');
    });

})(jQuery);
