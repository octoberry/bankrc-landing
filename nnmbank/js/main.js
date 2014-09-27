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
    if ($("#border-page").length){
        $("#border-page").css({height: h + "px"});
        $("#border-page .inner").css({height: (h - (parseInt($("#border-page").css("border-top-width").replace("px", "")) * 2)) + "px"});
    }
}