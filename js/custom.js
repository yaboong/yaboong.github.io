/**
 * Main JS file for BlogInn behaviours
 */

/*globals jQuery, document */
(function ($) {
    "use strict";

    $(document).ready(function(){
        // Responsive video embeds
        $('.entry-content').fitVids();

        // Navigation
        $('#menu-toggle').click(function(){
            var _this = $(this);
            _this.toggleClass( 'toggled-on' ).attr('aria-expanded', _this.attr('aria-expanded') === 'false' ? 'true' : 'false');
            $('.nav-menu').slideToggle();
        });
        $(window).bind('resize orientationchange', function() {
            if ( $('#menu-toggle').is(':hidden') ) {
                $('#menu-toggle').removeClass('toggled-on').attr('aria-expanded', 'false');
                $('.nav-menu').removeAttr('style');
            }
        });

        // Scroll to top
        $('#top-link').on('click', function(e) {
            $('html, body').animate({'scrollTop': 0});
            e.preventDefault();
        });

        // Wrap tables so wide ones scroll horizontally instead of breaking layout
        $('.entry-content table').wrap('<div class="table-scroll-wrap"></div>');

        // Sidebar table of contents, built from the content's section headings
        var $tocHeadings = $('.entry-content h2[id]');
        var $toc = $('.widget-toc');
        if ($toc.length && $tocHeadings.length >= 3) {
            var $tocList = $toc.find('.toc-list');
            $tocHeadings.each(function() {
                $('<a>').attr('href', '#' + this.id).text($(this).text())
                    .appendTo($('<li>').appendTo($tocList));
            });
            $toc.removeAttr('hidden').closest('.inner').addClass('has-toc');

            // Highlight the section currently being read
            var $tocLinks = $tocList.find('a');
            var tocTicking = false;
            var updateToc = function() {
                tocTicking = false;
                var current = 0;
                $tocHeadings.each(function(i) {
                    if (this.getBoundingClientRect().top <= 80) { current = i; }
                });
                var $active = $tocLinks.removeClass('is-active').eq(current).addClass('is-active');
                // Keep the highlighted link visible when the list itself scrolls
                var box = $toc[0].getBoundingClientRect();
                var link = $active[0].getBoundingClientRect();
                if (link.top < box.top) {
                    $toc[0].scrollTop -= box.top - link.top;
                } else if (link.bottom > box.bottom) {
                    $toc[0].scrollTop += link.bottom - box.bottom;
                }
            };
            $(window).on('scroll resize', function() {
                if (!tocTicking) {
                    tocTicking = true;
                    window.requestAnimationFrame(updateToc);
                }
            });
            updateToc();
        }
    });

}(jQuery));
