(function () {
    var _addClass, _doc_element, _find, _handleOrientation, _hasClass, _orientation_event, _removeClass, _supports_orientation, _user_agent;

    window.device = {};

    _doc_element = window.document.documentElement;

    _user_agent = window.navigator.userAgent.toLowerCase();

    device.ios = function () {
        return device.iphone() || device.ipod() || device.ipad();
    };

    device.iphone = function () {
        return _find('iphone');
    };

    device.ipod = function () {
        return _find('ipod');
    };

    device.ipad = function () {
        return _find('ipad');
    };

    device.android = function () {
        return _find('android');
    };

    device.androidPhone = function () {
        return (device.android() && (_find('mobile') || _find('mobi')));
    };

    device.androidTablet = function () {
        return (device.android() && (!_find('mobile') && !_find('mobi')));
    };

    device.blackberry = function () {
        return _find('blackberry') || _find('bb10') || _find('rim');
    };

    device.blackberryPhone = function () {
        return device.blackberry() && !_find('tablet');
    };

    device.blackberryTablet = function () {
        return device.blackberry() && _find('tablet');
    };

    device.windows = function () {
        return _find('windows');
    };

    device.windowsPhone = function () {
        return device.windows() && _find('phone');
    };

    device.windowsTablet = function () {
        return device.windows() && _find('touch');
    };

    device.fxos = function () {
        return _find('(mobile; rv:') || _find('(tablet; rv:');
    };

    device.fxosPhone = function () {
        return device.fxos() && _find('mobile');
    };

    device.fxosTablet = function () {
        return device.fxos() && _find('tablet');
    };

    device.mobile = function () {
        return device.android() || device.androidPhone() || device.iphone() || device.ipod() || device.windowsPhone() || device.blackberryPhone() || device.fxosPhone();
    };

    device.tablet = function () {
        return device.ipad() || device.androidTablet() || device.blackberryTablet() || device.windowsTablet() || device.fxosTablet();
    };

    device.portrait = function () {
        if (window.orientation) {
            return Math.abs(window.orientation) !== 90;
        } else {
            return screen.width < screen.height;
        }
    };

    device.landscape = function () {
        if (window.orientation) {
            return Math.abs(window.orientation) === 90;
        } else {
            return screen.width > screen.height;
        }
    };

    _find = function (needle) {
        return _user_agent.indexOf(needle) !== -1;
    };

    _hasClass = function (class_name) {
        var regex;
        regex = new RegExp(class_name, 'i');
        return _doc_element.className.match(regex);
    };

    _addClass = function (class_name) {
        if (!_hasClass(class_name)) {
            return _doc_element.className += " " + class_name;
        }
    };

    _removeClass = function (class_name) {
        if (_hasClass(class_name)) {
            return _doc_element.className = _doc_element.className.replace(class_name, "");
        }
    };

    _setViewportForMobile = function () {
        if (device.windowsPhone() || device.windows() || device.windowsTablet()) {
            var msViewportStyle = document.createElement("style");
            if (device.landscape()) {
                msViewportStyle.appendChild(document.createTextNode("@-ms-viewport{width:769px!important}"));
            } else {
                msViewportStyle.appendChild(document.createTextNode("@-ms-viewport{width:445px!important}"));
            }
            document.getElementsByTagName("head")[0].
                    appendChild(msViewportStyle);
        }
        if (device.landscape()) {
            $('#viewport').attr('content', 'width=769');
        } else {
            $('#viewport').attr('content', 'width=445');
        }

    };
    
    _setViewportForTablet = function(){
        if (device.windowsPhone() || device.windows() || device.windowsTablet()) {
            var msViewportStyle = document.createElement("style");
            if (device.landscape()) {
                msViewportStyle.appendChild(document.createTextNode("@-ms-viewport{width:769px!important}"));
            } else {
                msViewportStyle.appendChild(document.createTextNode("@-ms-viewport{width:445px!important}"));
            }
            document.getElementsByTagName("head")[0].
                    appendChild(msViewportStyle);
        }
        if (device.landscape()) {
            $('#viewport').attr('content', 'width=769');
            $("body").addClass("landscape");
            $("body").removeClass("not-landscape");
        } else {
            $('#viewport').attr('content', 'width=445');
            $("body").removeClass("landscape");
            $("body").addClass("not-landscape");
        }
    };

    //Устанавливаем правильный viewport
    if (device.mobile()) {
        $("body").addClass("mobile");
        _handleOrientation = function () {
            _setViewportForMobile();
        };
        _supports_orientation = "onorientationchange" in window;

        _orientation_event = _supports_orientation ? "orientationchange" : "resize";

        if (window.addEventListener) {
            window.addEventListener(_orientation_event, _handleOrientation, false);
        } else if (window.attachEvent) {
            window.attachEvent(_orientation_event, _handleOrientation);
        } else {
            window[_orientation_event] = _handleOrientation;
        }

        _handleOrientation();
    } else if (device.tablet()) {
        $("body").addClass("tablet");
        _handleOrientation = function() {
            _setViewportForTablet();
        };
        _supports_orientation = "onorientationchange" in window;

        _orientation_event = _supports_orientation ? "orientationchange" : "resize";

        if (window.addEventListener) {
            window.addEventListener(_orientation_event, _handleOrientation, false);
        } else if (window.attachEvent) {
            window.attachEvent(_orientation_event, _handleOrientation);
        } else {
            window[_orientation_event] = _handleOrientation;
        }

        _handleOrientation();
    } else {
        $("body").addClass("desktop");
    }

}).call(this);
