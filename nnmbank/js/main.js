$(document).ready(function () {
    
    if (device.mobile()) {
        $("body").addClass("mobile");
        
        if (device.landscape()) {
            $("body").addClass("landscape");
            $("body").removeClass("not-landscape");
        } else {
            $("body").removeClass("landscape");
            $("body").addClass("not-landscape");
        }
    }
    
    setBorderPage();
    $(window).resize(function () {
        setBorderPage();
    });
    $('body').bind('orientationchange', function () {
        setBorderPage();
    });

    $('#fullpage').fullpage({
        verticalCentered: true,
        resize: false,
        sectionsColor: ['white'],
        anchors: [],
        scrollingSpeed: 700,
        easing: 'fadeIn',
        menu: false,
        navigation: true,
        navigationPosition: 'right',
        slidesNavigation: false,
        loopBottom: false,
        loopTop: false,
        loopHorizontal: false,
        autoScrolling: true,
        scrollOverflow: false,
        css3: true,
        paddingTop: '0px',
        paddingBottom: '0px',
        normalScrollElements: '',
        normalScrollElementTouchThreshold: 5,
        keyboardScrolling: false,
        touchSensitivity: 15,
        continuousVertical: false,
        animateAnchor: true,
        sectionSelector: '.section',
        slideSelector: '.slide',
        //events
        onLeave: function (index, nextIndex, direction) {
            $.fn.fullpage.moveTo(nextIndex, 0);
            if (nextIndex == 4 || index == 4){
                $(".btn-fix").fadeOut();
            } else {
                $(".btn-fix").fadeIn();
            }
            setBorderPage();
        },
        afterLoad: function (anchorLink, index) {
        },
        afterRender: function () {
        },
        afterResize: function () {
        },
        beforeSlideLoad: function (anchorLink, index, slideAnchor, slideIndex) {
            if (slideIndex != 0) {
                $(".btn-fix").fadeOut();
            }
        },
        afterSlideLoad: function (anchorLink, index, slideAnchor, slideIndex) {
            if (slideIndex == 0 && index != 4) {
                $(".btn-fix").fadeIn();
            }
        },
        onSlideLeave: function (anchorLink, index, slideIndex, direction) {
        }
    });
    
     $('form input').focus(function() {
       
    }).blur(function() {
        setBorderPage();
        $.fn.fullpage.reBuild();
    });

    var listRU = $.masksSort($.masksLoad("/js/plugins/inputmask/phones-ru.json"), ['#'], /[0-9]|#/, "mask");
    var optsRU = {
        inputmask: {
            definitions: {
                '#': {validator: "[0-9]", cardinality: 2}
            },
            showMaskOnHover: false, autoUnmask: false, clearMaskOnLostFocus: true, clearIncomplete: true, placeholder: "_"
        },
        match: /[0-9]/, replace: '#', list: listRU, listKey: "mask"
    };
    //Формализация ввода телефона
    $('#rf1-phone-field').inputmasks(optsRU);
    $('#rf2-phone-field').inputmasks(optsRU);
    $('#rf3-phone-field').inputmasks(optsRU);
    $('#rf4-phone-field').inputmasks(optsRU);
    
    $('#rf1-phone-field, #rf2-phone-field, #rf3-phone-field, #rf4-phone-field').focus(function () {
        if (!$(this).val()) {
            $(this).val(7);
        }
    });
    $('#rf1-phone-field, #rf2-phone-field, #rf3-phone-field, #rf4-phone-field').blur(function () {
        var str = $(this).val();
        var count = 0;
        for (var i = 0; i < str.length; i++) {
            if (/\d/.test(str[i])) count++;
        }
        if (count == 1) {
            $(this).val("");
        }
    });
    $('input[name=phone]').on("keypress", function (key) {
        if (key.charCode == 13)
            return true;
        if (key.charCode < 48 || key.charCode > 57)
            return false;
    });
    
    $("*[data-id=feature-5]").change(function(){
        var $this = $(this);
        var _this = this;
        var form_prefix = $(this).attr("data-form-prefix");
        if (_this.checked) {
            $("#" + form_prefix + "-feature-my-block").removeClass("disabled");
            $("#" + form_prefix + "-feature-my-field").removeAttr("disabled");
        } else {
            $("#" + form_prefix + "-feature-my-block").addClass("disabled");
            $("#" + form_prefix + "-feature-my-field").attr("disabled", "disabled");
        }
    });


    //Модальная форма "Оставьте свой телефон"
    $('*[data-id=request-form]').submit(function () {
        var form = $(this);
        var submit = form.find("*[type=submit]");
        submit.attr("disabled", "disabled");
        form.append('<input type="hidden" name="klaatu" id="klaatu" value="klaatu_ajax" />');
        form.attr("action", GLOBAL.URL_POST);
        var options = {
            dataType: 'json',
            beforeSubmit: function () {
                form.find('.alert, .success, .error').hide();
                form.find('.has-error').removeClass('has-error');
            },
            success: function (data) {
                submit.removeAttr("disabled");
                if (data.errors) {
                    $('#klaatu').remove();
                    $.each(data.errors, function (i, n) {
                        if (i == 'required') {
                            for (var j in n) {
                                form.find('*[name=' + n[j] + ']').parent().addClass('has-error');
                            }
                            //$("#cfm_nodata_error").show();
                        } else {
                            //$('#cfm_' + i + '_error').show();
                        }
                    });
                } else {
                    form.hide();
                    $('#rf_success_'+form.attr("id").split('-')[2]).fadeIn();
                    
                }
            }
        };

        $(this).ajaxSubmit(options);
        return false;
    });
});

function formRefresh(){
    $('*[id^=rf_success').hide();
    $('*[data-id=request-form]').show();
    clearForm("*[data-id=request-form]");
}

function setBorderPage() {
    var h = $(window).height();
    $("#border-page").css({height: h + "px"});
    $("#border-page .inner").css({height: (h - (parseInt($("#border-page").css("border-top-width").replace("px", "")) * 2)) + "px"});
}