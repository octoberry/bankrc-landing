var scrollSection = [
    'is-header',
    'is-interface-info',
    'is-advantage-info',
    'is-wisdom',
    'is-price',
    'is-warranty',
    'is-account',
    'is-leaders'
];
scrollPage($(window).scrollTop());

$(document).ready(function () {
    //Слайдер для мобильного разрешения
    var mySwiper = new Swiper('.swiper-container', {
        pagination: '.pagination',
        loop: true,
        grabCursor: true,
        paginationClickable: true
    });
    $('.arrow-left').on('click', function(e) {
        e.preventDefault();
        mySwiper.swipePrev();
    });
    $('.arrow-right').on('click', function(e) {
        e.preventDefault();
        mySwiper.swipeNext();
    });
    
    var mySwiper2 = new Swiper('.swiper-container.sc2', {
        pagination: '.pagination.sc2',
        loop: true,
        grabCursor: true,
        paginationClickable: true
    });
    $('.arrow-left.sc2').on('click', function(e) {
        e.preventDefault();
        mySwiper2.swipePrev();
    });
    $('.arrow-right.sc2').on('click', function(e) {
        e.preventDefault();
        mySwiper2.swipeNext();
    });
    //--------------------------------------------------------------------------
    
    //Формализация ввода телефона
    var listRU = $.masksSort($.masksLoad("/js/plugins/inputmask/phones-ru.json"), ['#'], /[0-9]|#/, "mask");
    var optsRU = {
        inputmask: {
            definitions: {
                '#': {validator: "[0-9]", cardinality: 2}
            },
            showMaskOnHover: true,
            autoUnmask: true,
            clearIncomplete: false,
            placeholder: "_"
        },
        match: /[0-9]/,
        replace: '#',
        list: listRU,
        listKey: "mask"
    };
    $('#glt-phone-field').inputmasks(optsRU);
    $('#glm-phone-field').inputmasks(optsRU);
    $('#glb-phone-field').inputmasks(optsRU);
    $('form').on("keypress", "input[name=phone]", (function(key) {
        if (key.keyCode == 13){
            $(this).closest("form").submit();
            return false;
        }
        if (key.charCode < 48 || key.charCode > 57){
            return false;
        }
    }));
    $('form input[name=phone]').focus(function(){
        if (!$(this).val()){
            $(this).val(7);
        }
    });
    $('form input[name=phone]').blur(function(){
        if ($(this).val() == 7){
            $(this).val('');
        }
    });
    //--------------------------------------------------------------------------
    
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
    //--------------------------------------------------------------------------
    
    //анимация кнопки appstore
    $('.ci-block').hover(function() {
        $('img.ci', this).stop();
        $('img.ci', this).fadeIn();
    },function() {
        $('img.ci', this).stop();
        $('img.ci', this).fadeOut();
    });
    //--------------------------------------------------------------------------
    
    //Показываем форму "Получить ссылку"
    $("a[href^=#show-form]").click(function(){
        var $this = $(this);
        var form = $this.attr("href").split("/")[1];
        $this.hide();
        $("#" + form).fadeIn(function(){
            $(this).find("input[name=phone]").focus();
        });
        return false;
    });
    //--------------------------------------------------------------------------
    
    $('form[data-id=get-link]').submit(function () {
        var form = $(this);
        var submit = form.find("*[type=submit]");
        form.append('<input type="hidden" name="klaatu" id="klaatu" value="klaatu_ajax" />');
        form.attr("action", GLOBAL.URL_POST);
        var options = {
            dataType: 'json',
            beforeSubmit: function () {
                form.find(".has-error .text-danger").hide();
            },
            success: function (data) {
                if (data.errors) {
                    $('#klaatu').remove();
                    $.each(data.errors, function (i, n) {
                        if (i == 'required') {
                            for (var j in n) {
                                form.find('*[name=' + n[j] + ']').parent().addClass('has-error');
                            }
                        } else {
                            $('#'+form.attr("data-form-selector")+'-' + i + '-error').fadeIn();
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
    
    $(window).scroll(function () {
        var st = $(this).scrollTop();
        if (st > 0){
            $("#arrow-down").fadeOut();
        } else {
            $("#arrow-down").fadeIn();
        }
        
        scrollPage(st);
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
    $('body,html').stop().animate({
        'scrollTop': $(name_id).offset().top - headerHeight
    }, 700, 'swing', function() {
        if ($(window).scrollTop() != ($(name_id).offset().top - headerHeight)) {
            scrollWindowToElement(name_id);
        }
    });

}

function scrollPage(st){
    if (st > 0) {
        var pageNum = scrollSection.length-1;
        for( var i=0; i <= scrollSection.length-1; i++){
            if ($("#" + scrollSection[i]).offset().top >= st){
                pageNum = i;
                break;
            }
        }
    } else {
        var pageNum = 0;
    }

    if (pageNum > 0 && pageNum < scrollSection.length-1){
        $('.page-arrow-down .up').show().attr("onclick", "scrollWindowToElement('#"+scrollSection[pageNum-1]+"')");
        $('.page-arrow-down .down').show().attr("onclick", "scrollWindowToElement('#"+scrollSection[pageNum+1]+"')");
    } else {
        if (pageNum == scrollSection.length-1){
            $('.page-arrow-down .up').show().attr("onclick", "scrollWindowToElement('#"+scrollSection[pageNum-1]+"')");
            $('.page-arrow-down .down').hide();
        } else {
            if (pageNum == 0){
                $('.page-arrow-down .up').hide();
                $('.page-arrow-down .down').show().attr("onclick", "scrollWindowToElement('#"+scrollSection[pageNum+1]+"')");
            }
        }
    }
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