$(document).ready(function() {

    //Слайдер для мобильного
    var mySwiper = new Swiper('.swiper-container', {
        pagination: '.pagination',
        loop: true,
        grabCursor: true,
        paginationClickable: true
    })
    $('.arrow-left').on('click', function(e) {
        e.preventDefault()
        mySwiper.swipePrev()
    })
    $('.arrow-right').on('click', function(e) {
        e.preventDefault()
        mySwiper.swipeNext()
    })

    var listRU = $.masksSort($.masksLoad("/js/plugins/inputmask/phones-ru.json"), ['#'], /[0-9]|#/, "mask");
    var optsRU = {
        inputmask: {
            definitions: {
                '#': {validator: "[0-9]", cardinality: 2}
            },
            showMaskOnHover: true, autoUnmask: false, clearIncomplete: false, placeholder: " "
        },
        match: /[0-9]/, replace: '#', list: listRU, listKey: "mask"
    };

    //Формализация ввода телефона
    $('#cf-phone-field').inputmasks(optsRU);
    $('#cfm-phone-field').inputmasks(optsRU);

    $('input[name=phone]').keypress(function(key) {
        if (key.charCode == 13)
            return true;
        if (key.charCode < 48 || key.charCode > 57)
            return false;
    });

    slider.init($("*[data-slider]"));
    $("*[data-slider]").hover(
            function() {
                var $this = $(this);
                var id = $this.attr("data-slider");
                var img = $this.attr("data-info-img");
                $("#" + id).attr("src", img);
            },
            function() {

            }
    );

    //Модальная форма "Оставьте свой телефон"
    $('#call-form').submit(function() {
        var form = $(this);
        var submit = form.find("*[type=submit]");
        submit.attr("disabled", "disabled");
        form.append('<input type="hidden" name="klaatu" id="klaatu" value="klaatu_ajax" />');
        form.attr("action", GLOBAL.URL_POST);
        form.css("opacity", "0.3");
        var options = {
            dataType: 'json',
            beforeSubmit: function() {
                form.find('.alert, .success, .error').hide();
                form.find('.has-error').removeClass('has-error');
            },
            success: function(data) {
                form.css("opacity", "1");
                submit.removeAttr("disabled");
                if (data.errors) {
                    $('#klaatu').remove();
                    $.each(data.errors, function(i, n) {
                        if (i == 'required') {
                            for (var j in n) {
                                form.find('*[name=' + n[j] + ']').parent().addClass('has-error');
                            }
                            //$("#cf_nodata_error").show();
                        } else {
                            //$('#cf_' + i + '_error').show();
                        }
                    });
                } else {
                    form.hide();
                    $('#cf_success').fadeIn();
                    setTimeout(function() {
                        clearForm("call-form");
                        $('#klaatu').remove();
                        form.find('.alert').hide();
                        $('#cf_success').hide();
                        form.show();
                    }, 5000);
                }
            }
        };

        $(this).ajaxSubmit(options);
        return false;
    });

    //Модальная форма "Оставьте свой телефон"
    $('#call-form-modal').submit(function() {
        var form = $(this);
        var submit = form.find("*[type=submit]");
        submit.attr("disabled", "disabled");
        form.append('<input type="hidden" name="klaatu" id="klaatu" value="klaatu_ajax" />');
        form.attr("action", GLOBAL.URL_POST);
        form.css("opacity", "0.3");
        var options = {
            dataType: 'json',
            beforeSubmit: function() {
                form.find('.alert, .success, .error').hide();
                form.find('.has-error').removeClass('has-error');
            },
            success: function(data) {
                submit.removeAttr("disabled");
                form.css("opacity", "1");
                if (data.errors) {
                    $('#klaatu').remove();
                    $.each(data.errors, function(i, n) {
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
                    $('#cfm_success').fadeIn();
                    setTimeout(function() {
                        $('#callModalForm').modal('hide');
                        $('#callModalForm').on('hidden.bs.modal', function(e) {
                            clearForm("call-form-modal");
                            $('#klaatu').remove();
                            $('#cfm_success').hide();
                            form.show();
                        });
                    }, 5000);
                }
            }
        };

        $(this).ajaxSubmit(options);
        return false;
    });
});


slider = {
    ready: [],
    complete: 0,
    current: 0,
    progress: false,
    images: [],
    init: function(images) {
        if (!images || images === undefined || images.length == 0)
            return false;

        images.each(function(i, n) {
            slider.images.push($(this).attr("data-info-img"));
        });

        slider.load();
    },
    load: function(i) {
        if (!i || i === undefined)
            i = 0;

        if (!slider.ready[i]) {
            slider.ready[i] = new Image();
            slider.ready[i].src = slider.images[i];
            setTimeout(function() {
                slider.check(i);
            }, 50);
        }
    },
    check: function(i) {
        if (slider.ready[i].complete) {
            slider.complete++;
            if (i < slider.images.length - 1)
                slider.load(i + 1);
        } else {
            setTimeout(function() {
                slider.check(i);
            }, 50);
            return false;
        }
    }
};
