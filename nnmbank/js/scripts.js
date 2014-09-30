$(document).ready(function(){
    $("*[data-form-show=yes]").on("click", function(){
        var $this = $(this);
        var form_id = $this.attr("data-form-id");
        
        $(form_id).fadeIn();
    });
    
    $('input:checkbox, input:radio').each(function() {
        var o = $(this);
        var fc = $('<img/>').width(21).height(22).attr('src', '/css/blank.gif');
        var id = o.attr('id');
        if (!id) {
            id = o.attr('name').replace(/[\[\]]+/g, '');
            o.attr('id', id);
        }
        var fl = $('<label/>').attr('for', id).append(fc).addClass('simpleCheckbox ' + this.type);
        if (this.checked) {
            fl.addClass('fChecked');
        }

        o.data('fCheckbox', fl).after(fl).change(function() {
            var f = $(this).data('fCheckbox');

            if (this.checked) {
                f.addClass('fChecked');
            } else {
                f.removeClass('fChecked');
            }

            if (this.type == 'radio') {
                // это радио, надо выключить остальные кнопки
                var i = this;
                $('input[name=' + i.name.replace(/\[+/g, "\\[").replace(/\]+/g, "\\]") + ']').each(function() {
                    if (this != i) {
                        $(this).data('fCheckbox').removeClass('fChecked');
                    }
                })
            }
        }).css({
            'opacity': 0
        }).appendTo(fl);
    });
});


/**
 * Очищает форму от введенных данных
 * @param {string} form_id - идентификатор формы
 */
function clearForm(form_id) {
    var form = $(form_id);
    if (!form.length)
        return;
    form.find('.alert, .success, .error').hide();
    form.find('.has-error').removeClass('has-error');
    
    form.find('input[type=text], input[type=file], input[type=email], input[type=password]').each(function() {
        $(this).val('');
    });
    
    form.find('textarea').each(function() {
        $(this).val('');
    });
    
    form.find('input[type=checkbox]').each(function() {
        $(this).removeAttr('checked');
    });
    form.find(".fChecked").removeClass("fChecked");
    
    form.find('input[type=radio]').each(function() {
        $(this).removeAttr('checked');
    });
    
    form.find('select').each(function() {
        $(this).find('option').each(function() {
            $(this).removeAttr('selected');
        });
        $(this).find('option[value=0]').attr('selected', 'selected');
    });
}