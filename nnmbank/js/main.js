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

    //Модальная форма "Оставьте свой телефон"
    $('#subscribe-form').submit(function () {
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
                    $('#sf_success').fadeIn();
                    
                }
            }
        };

        $(this).ajaxSubmit(options);
        return false;
    });
});

function formRefresh(){
    $('*[id^=sf_success').hide();
    $('#subscribe-form').show();
    clearForm("#subscribe-form");
}

function setBorderPage() {
    var h = $(window).height();
}