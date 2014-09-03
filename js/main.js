$(document).ready(function() {
    
    var listRU = $.masksSort($.masksLoad("/js/plugins/inputmask/phones-ru.json"), ['#'], /[0-9]|#/, "mask");
    var optsRU = {
        inputmask: {
            definitions: {
                '#': {validator: "[0-9]", cardinality: 2}
            },
            showMaskOnHover: true, autoUnmask: false, clearIncomplete: false, placeholder: "  "
        },
        match: /[0-9]/, replace: '#', list: listRU, listKey: "mask"
    };

    //Формализация ввода телефона
    $('#cf-phone-field').inputmasks(optsRU);
    $('#cfm-phone-field').inputmasks(optsRU);
    
    $('input[name=phone]').keypress(function(key) {
        if(key.charCode == 13) return true;
        if(key.charCode < 48 || key.charCode > 57) return false;
    });
  

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