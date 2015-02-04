$(document).ready(function () {
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
    
    //анимация кнопки appstore
    $('.ci-block').hover(function() {
        $('img.ci', this).stop();
        $('img.ci', this).fadeIn();
    },function() {
        $('img.ci', this).stop();
        $('img.ci', this).fadeOut();
    });
    
    //Показываем форму "Получить ссылку"
    $("a[href^=#show-form]").click(function(){
        var $this = $(this);
        var form = $this.attr("href").split("/")[1];
        $this.hide();
        $("#" + form).fadeIn();
        return false;
    });
    
    $('form[data-id=get-link]').submit(function () {
        var form = $(this);
        var submit = form.find("*[type=submit]");
        form.append('<input type="hidden" name="klaatu" id="klaatu" value="klaatu_ajax" />');
        form.attr("action", GLOBAL.URL_POST);
        var options = {
            dataType: 'json',
            beforeSubmit: function () {},
            success: function (data) {
                if (data.errors) {
                    $('#klaatu').remove();
                    $.each(data.errors, function (i, n) {
                        if (i == 'required') {
                            for (var j in n) {
                                form.find('*[name=' + n[j] + ']').parent().addClass('has-error');
                            }
                        }
                    });
                } else {
                    form.hide();
                    $('#' + form.attr("id") + '-success').fadeIn();
                }
            }
        };

        $(this).ajaxSubmit(options);
        return false;
    });
    
    $window.scroll(function () {
        var st = $(this).scrollTop();
        if (st > 0){
            $("#arrow-down").fadeOut();
        } else {
            $("#arrow-down").fadeIn();
        }
    });
    
    
    $("*[data-interface-slider]").hover(
        function() {
            var $this = $(this);
            var id = $this.attr("data-interface-slider");
            var img = $this.attr("data-info-img");
            if (img == "") return false;
            if ($("#" + id + "-mp4").attr("src") == img + ".mp4"){
                return false;
            }
            $("#" + id + "-mp4").attr("src", img + ".mp4");
            var video = document.getElementById(id+'-video');
            try{
                video.currentTime = 0;
                video.load().play();
            } catch(e) {

            }
            
        },
        function() {

        }
    );
});

/**
 * Анимированное скроллирование страницы до якоря
 * @param {string} name_id - идентификатор якоря
 */
function scrollWindowToElement(name_id) {
    var headerHeight = 0;
    $('body,html').animate({
        'scrollTop': $(name_id).offset().top - headerHeight
    }, 700, 'swing', function() {
        if ($(window).scrollTop() != ($(name_id).offset().top - headerHeight)) {
            scrollWindowToElement(name_id);
        }
    });

}

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