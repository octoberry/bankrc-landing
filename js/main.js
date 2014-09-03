$(document).ready(function() {
    $('input[name=phone]').keypress(function(key) {
        if(key.charCode == 13) return true;
        if(key.charCode < 48 || key.charCode > 57) return false;
    });

    //Модальная форма "Оставьте свой телефон"
    $('#call-form').submit(function() {
        var form = $(this);
        var submit = form.find("*[type=submit]");
        submit.attr("disabled", "disabled");
        form.find(".ajax-loader").show();
        form.append('<input type="hidden" name="klaatu" id="klaatu" value="klaatu_ajax" />');
        form.attr("action", GLOBAL.URL_POST);

        var options = {
            dataType: 'json',
            beforeSubmit: function() {
                form.find('.alert, .error').hide();
                form.find('.has-error').removeClass('has-error');
            },
            success: function(data) {
                form.find(".ajax-loader").hide();
                submit.removeAttr("disabled");
                if (data.errors) {
                    $('#klaatu').remove();
                    $.each(data.errors, function(i, n) {
                        if (i == 'required') {
                            for (var j in n) {
                                form.find('*[name=' + n[j] + ']').parent().addClass('has-error');
                            }
                            $("#cf_nodata_error").show();
                        } else {
                            $('#cf_' + i + '_error').show();
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
        form.find(".ajax-loader").show();
        
        var options = {
            dataType: 'json',
            beforeSubmit: function() {
                form.find('.alert, .error').hide();
                form.find('.has-error').removeClass('has-error');
            },
            success: function(data) {
                submit.removeAttr("disabled");
                form.find(".ajax-loader").hide();
                if (data.errors) {
                    $('#klaatu').remove();
                    $.each(data.errors, function(i, n) {
                        if (i == 'required') {
                            for (var j in n) {
                                form.find('*[name=' + n[j] + ']').parent().addClass('has-error');
                            }
                            $("#cfm_nodata_error").show();
                        } else {
                            $('#cfm_' + i + '_error').show();
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