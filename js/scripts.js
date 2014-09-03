var animate_succes = 1;
$(document).ready(function(){
    
    //Очищаем форму перед вызовом
    $('.modal').on('show.bs.modal', function(e) {
        var form_id = $(this).find('form').attr('id');
        clearForm(form_id);
    });
    
    //Если при загрузке странице есть hash c якорем, то скролим до якоря 
    var hash = document.location.hash;
    var name_id = hash.replace("page-", "is-");
    if (hash && $(name_id).length) {
        scrollWindowToElement(name_id);
    }

    //Прерываем анимацию скролла до якоря если пользователь воспользовался
    //колесом мышки
    $('body, html').mousewheel(function(event) {
        animate_succes = 0;
        $('body, html').stop();
    });
    //тачем на телефоне
    document.body.addEventListener('touchmove', function(event) {
        animate_succes = 0;
        $('body,html').stop();
    });
    
    //Разворачивание/сворачивание блоков
    $("*[href^=#expand]").on("click", function(){
        var $this = $(this);
        var id = $this.attr("href").split("/")[1];
        var obj = $("#"+id);
        
        if (obj.css("display") == "none"){
            obj.slideDown();
            $this.html($this.html().replace(/показать/g, "скрыть"));
        } else {
            obj.slideUp();
            $this.html($this.html().replace(/скрыть/g, "показать"));
        }
        return false;
    });
    
});

/**
 * Анимированное скроллирование страницы до якоря
 * @param {string} name_id - идентификатор якоря
 */
function scrollWindowToElement(name_id) {
    var headerHeight = 40;
    $('body,html').animate({
        'scrollTop': $(name_id).offset().top - headerHeight
    }, 700, 'swing', function() {
        if ($(window).scrollTop() != ($(name_id).offset().top - headerHeight) && animate_succes) {
            animate_succes = 0;
            scrollWindowToElement(name_id);
        } else {
            $('body,html').stop();
        }
    });
    return false;
}

/**
 * Очищает форму от введенных данных
 * @param {string} form_id - идентификатор формы
 */
function clearForm(form_id) {
    var form = $('#' + form_id);
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