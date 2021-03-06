(function ($, undefined) {

    /*
     * Slider object.
     */
    $.Slider = function (options, element) {


        this.$el = $(element);

        this._init(options);

    };

    $.Slider.defaults = {
        current: 0, // index of current slide
        bgincrement: 50, // increment the bg position (parallax effect) when sliding
        autoplay: false, // slideshow on / off
        interval: 4000  // time between transitions
    };

    $.Slider.prototype = {
        _init: function (options) {
            this.K = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|Windows Phone|Tizen|Bada)/);
            this.k = $(window).height();
            this.Y;

            this.options = $.extend(true, {}, $.Slider.defaults, options);

            this.$slides = this.$el.children('div.da-slide');
            this.$slides.addClass("da-table").wrapInner('<div class="da-tableCell" style="height:' + this.k + 'px;" />')
            this.slidesCount = this.$slides.length;

            this.current = this.options.current;

            if (this.current < 0 || this.current >= this.slidesCount) {

                this.current = 0;

            }

            this.$slides.eq(this.current).addClass('da-slide-current');

            var $navigation = $('<nav class="da-dots"/>');
            for (var i = 0; i < this.slidesCount; ++i) {

                $navigation.append('<span/>');

            }
            $navigation.appendTo(this.$el);

            this.$pages = this.$el.find('nav.da-dots > span');
            this.$navNext = this.$el.find('span.da-arrows-next');
            this.$navPrev = this.$el.find('span.da-arrows-prev');

            this.isAnimating = false;

            this.bgpositer = 0;

            this.cssAnimations = Modernizr.cssanimations;
            this.cssTransitions = Modernizr.csstransitions;

            if (!this.cssAnimations || !this.cssAnimations) {

                this.$el.addClass('da-slider-fb');

            }

            this._resize();

            this._updatePage();

            // load the events
            this._loadEvents();

            // slideshow
            if (this.options.autoplay) {

                this._startSlideshow();

            }

        },
        _navigate: function (page, dir) {

            var $current = this.$slides.eq(this.current), $next, _self = this;

            if (this.current === page || this.isAnimating)
                return false;

            this.isAnimating = true;

            var classTo, classToAnimate, classFrom, classFromAnimate, d;

            // check dir
            if (!dir) {
                (page > this.current) ? d = 'next' : d = 'prev';
            } else {
                d = dir;
            }

            //Убираем зацикливание
            if (this.current + 1 == this.slidesCount && d == 'next') {
                this.isAnimating = false;
                return false;
            }
            if (this.current == 0 && d == 'prev') {
                this.isAnimating = false;
                return false;
            }

            if (this.cssAnimations && this.cssAnimations) {

                if (d === 'next') {

                    classTo = 'da-slide-toleft ';
                    classToAnimate = 'animated fadeOutUp';
                    classFrom = 'da-slide-fromright';
                    classFromAnimate = 'animated fadeInUp';
                    ++this.bgpositer;

                }
                else {

                    classTo = 'da-slide-toright';
                    classToAnimate = 'animated fadeOutDown';
                    classFrom = 'da-slide-fromleft';
                    classFromAnimate = 'animated fadeInDown';
                    --this.bgpositer;

                }

                this.$el.css('background-position', this.bgpositer * this.options.bgincrement + '% 0%');

            }
            this.current = page;

            $next = this.$slides.eq(this.current);

            if (this.cssAnimations && this.cssAnimations) {

                var rmClasses = 'da-slide-toleft da-slide-toright da-slide-fromleft da-slide-fromright';
                var rmClassesAnimate = 'fadeInUp fadeOutUp fadeOutDown fadeInDown';
                $current.removeClass(rmClasses);
                $current.find(".animated").removeClass(rmClassesAnimate);
                $next.removeClass(rmClasses);
                $next.find(".animated").removeClass(rmClassesAnimate);

                $current.addClass(classTo);
                var isTimeout = 0;
                $current.find(".animated").each(function (i, n) {
                    var $this = $(this);
                    setTimeout(function () {
                        $this.addClass(classToAnimate);
                    }, isTimeout);
                    isTimeout = isTimeout + 100;
                });

                setTimeout(function () {
                    $next.addClass(classFrom);
                    $next.find(".animated").addClass(classFromAnimate);

                    $current.removeClass('da-slide-current');
                    $next.addClass('da-slide-current');
                }, 800);

            }

            // fallback
            if (!this.cssAnimations || !this.cssAnimations) {
                $next.css('left', (d === 'next') ? '100%' : '-100%').stop().animate({
                    left: '0%'
                }, 1000, function () {
                    _self.isAnimating = false;
                });
                $current.stop().animate({
                    left: (d === 'next') ? '-100%' : '100%'
                }, 1000, function () {
                    $current.removeClass('da-slide-current');
                });

            }

            this._updatePage();

        },
        _resize: function () {
            var sliderHeight;
            sliderHeight = $(window).height();
            $("#da-slider").css("height", sliderHeight + "px");

            $("body").find(".da-tableCell").css("height", sliderHeight + "px");

            var mh = 0;
            var obj = $("#da-slider *[data-general-vert=yes]");
            obj.each(function () {
                var h_block = parseInt($(this).height());
                if (h_block > mh) {
                    mh = h_block;
                }
            });
            obj.height(mh);
        },
        _updatePage: function () {
            this.$pages.removeClass('da-dots-current');
            this.$pages.eq(this.current).addClass('da-dots-current');
        },
        _startSlideshow: function () {

            var _self = this;

            this.slideshow = setTimeout(function () {

                var page = (_self.current < _self.slidesCount - 1) ? page = _self.current + 1 : page = 0;
                _self._navigate(page, 'next');

                if (_self.options.autoplay) {

                    _self._startSlideshow();

                }

            }, this.options.interval);

        },
        _loadEvents: function () {
            var K = this.K;
            var Y = this.Y;
            var _self = this;

            function movePrev() {
                if (_self.options.autoplay) {
                    clearTimeout(_self.slideshow);
                    _self.options.autoplay = false;
                }

                var page = (_self.current > 0) ? page = _self.current - 1 : page = _self.slidesCount - 1;
                _self._navigate(page, 'prev');
                return false;
            }

            function moveNext() {
                if (_self.options.autoplay) {
                    clearTimeout(_self.slideshow);
                    _self.options.autoplay = false;

                }
                var page = (_self.current < _self.slidesCount - 1) ? page = _self.current + 1 : page = 0;
                _self._navigate(page, 'next');
                return false;
            }

            this.$pages.on('click.cslider', function (event) {
                if (_self.options.autoplay) {
                    clearTimeout(_self.slideshow);
                    _self.options.autoplay = false;
                }
                _self._navigate($(this).index());
                return false;

            });

            $("*[data-slide-go]").on("click", function (event) {
                var $this = $(this);
                var slide = $this.attr("data-slide-go");
                if (_self.options.autoplay) {
                    clearTimeout(_self.slideshow);
                    _self.options.autoplay = false;
                }
                _self._navigate(slide);
                return false;
            });

            this.$navNext.on('click.cslider', function (event) {
                moveNext();
            });
            this.$navPrev.on('click.cslider', function (event) {
                movePrev();
            });

            if (this.cssTransitions) {
                this.$el.on('webkitTransitionEnd.cslider transitionend.cslider OTransitionEnd.cslider', function (event) {
                    if (event.target.id === _self.$el.attr('id'))
                        _self.isAnimating = false;
                });
            }


            //for full screen
            $(window).resize(function () {
                _self._reBuild();
            });
            $('body').bind('orientationchange', function () {
                _self._reBuild();
            });


            //mouse scrolling
            function m(b) {
                b = window.event || b;
                b = Math.max(-1, Math.min(1, b.wheelDelta || -b.deltaY || -b.detail));
                if (0 > b) {
                    //следующий
                    moveNext();
                } else {
                    //предыдущий
                    movePrev();
                }
                return!1;
            }
            $ ? document.addEventListener ? (document.addEventListener("mousewheel", m, !1), document.addEventListener("wheel", m, !1)) : document.attachEvent("onmousewheel", m) : document.addEventListener ? (document.removeEventListener("mousewheel", m, !1), document.removeEventListener("wheel", m, !1)) : document.detachEvent("onmousewheel", m)


            //keybord scrolling
            $(document).keydown(function (b) {
                switch (b.which) {
                    case 38:
                    case 33:
                        //предыдущий
                        movePrev();
                        break;
                    case 40:
                    case 34:
                        //следующий
                        moveNext();
                        break;
                }
            });

            //mobile touch
            var q = 0, z = 0, n = 0, y = 0;
            function fa(b) {
                var d = b.originalEvent;
                b.preventDefault();

                if (d = Q(d), n = d.y, y = d.x, Math.abs(z - y) > Math.abs(q - n)) {
                    return true;
                    //Math.abs(z - y) > $(window).width() / 100 * 5 && (z > y ? !!!RIGHT!!! : !!!LEFT!!!) 
                } else {
                    Math.abs(q - n) > $(window).height() / 100 * 5 && (q > n ? moveNext() : n > q && movePrev());
                }
            }
            function Q(a) {
                var c = [];
                if (window.navigator.msPointerEnabled) {
                    c.y = a.pageY;
                    c.x = a.pageX;
                } else {
                    c.y = a.touches[0].pageY;
                    c.x = a.touches[0].pageX;
                }
                return c;
            }
            function ga(b) {
                b = Q(b.originalEvent);
                q = b.y;
                z = b.x;
            }

            MSPointer = window.PointerEvent ? {down: "pointerdown", move: "pointermove"} : {down: "MSPointerDown", move: "MSPointerMove"};
            $(document).off("touchstart " + MSPointer.down)
                    .on("touchstart " + MSPointer.down, ga);
            $(document).off("touchmove " + MSPointer.move)
                    .on("touchmove " + MSPointer.move, fa);
        },
        _reBuild: function () {
            this._resize();
        }
    };

    var logError = function (message) {
        if (this.console) {
            console.error(message);
        }
    };

    $.fn.cslider = function (options) {

        if (typeof options === 'string') {

            var args = Array.prototype.slice.call(arguments, 1);

            this.each(function () {

                var instance = $.data(this, 'cslider');

                if (!instance) {
                    logError("cannot call methods on cslider prior to initialization; " +
                            "attempted to call method '" + options + "'");
                    return;
                }

                if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
                    logError("no such method '" + options + "' for cslider instance");
                    return;
                }

                instance[ options ].apply(instance, args);

            });

        }
        else {

            this.each(function () {

                var instance = $.data(this, 'cslider');
                if (!instance) {
                    $.data(this, 'cslider', new $.Slider(options, this));
                }
            });

        }

        return this;

    };

})(jQuery);