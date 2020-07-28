var MobileUtils = {
    MOBILE_MAX_WIDTH:600,

    isMobile: function(){
        if (typeof this._isMobile === 'boolean'){
            return this._isMobile;
        }
        var screenWidth = this.getScreenWidth();
        var isMobileScreenSize = screenWidth < this.MOBILE_MAX_WIDTH;

        var isMobileUserAgent = false;
        this._isMobile = isMobileScreenSize && this.isTouchScreen();
        return this._isMobile;
    },

    _isMobileUserAgent:function(){
        return (/iphone|ipod|android.*mobile|windows.*phone|blackberry.*mobile/i.test(window.navigator.userAgent.toLowerCase()));
    },

    getScreenWidth: function(){
        var smallerSide = Math.min(screen.width, screen.height);
        if(this.isAndroidMobileDevice() && !this.isNewChromeOnAndroid()){
            smallerSide = smallerSide/window.devicePixelRatio;
        }
        return smallerSide;
    },

    isAppleMobileDevice: function(){
        return (/iphone|ipod|ipad|Macintosh/i.test(navigator.userAgent.toLowerCase()));
    },

    isAndroidMobileDevice:function(){
        return (/android/i.test(navigator.userAgent.toLowerCase()));
    },

    isNewChromeOnAndroid:function(){
        if(this.isAndroidMobileDevice()){
            var userAgent = navigator.userAgent.toLowerCase();
            if((/chrome/i.test(userAgent))){
                var parts = userAgent.split('chrome/');

                var fullVersionString = parts[1].split(" ")[0];
                var versionString = fullVersionString.split('.')[0];
                var version = parseInt(versionString);

                if(version >= 27){
                    return true;
                }
            }
        }
        return false;
    },

    isTouchScreen: function(){
        return (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
    },

    isViewportOpen: function() {
        return !!document.getElementById('wixMobileViewport');
    },

    getInitZoom: function(){
        if(!this._initZoom){
            var screenWidth = Math.min(screen.height, screen.width);
            if(this.isAndroidMobileDevice() && !this.isNewChromeOnAndroid()){
                screenWidth = screenWidth/window.devicePixelRatio;
            }
            this._initZoom = screenWidth /document.body.offsetWidth;
        }
        return this._initZoom;
    },

    getZoom: function(){
        var screenWidth = (Math.abs(window.orientation) === 90) ? Math.max(screen.height, screen.width) : Math.min(screen.height, screen.width);
        if(this.isAndroidMobileDevice() && !this.isNewChromeOnAndroid()){
            screenWidth = screenWidth/window.devicePixelRatio;
        }
        return screenWidth / window.innerWidth;
    }
};

if (!Function.prototype.bind) {
  Function.prototype.bindContextForMobile = function (oThis) {
    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}else{
    Function.prototype.bindContextForMobile = Function.prototype.bind;
}

if (!document.getElementsByClassName) {
  document.getElementsByClassNameForMobile = function(search) {
    var d = document, elements, pattern, i, results = [];
    if (d.querySelectorAll) { // IE8
      return d.querySelectorAll("." + search);
    }
    if (d.evaluate) { // IE6, IE7
      pattern = ".//*[contains(concat(' ', @class, ' '), ' " + search + " ')]";
      elements = d.evaluate(pattern, d, null, 0, null);
      while ((i = elements.iterateNext())) {
        results.push(i);
      }
    } else {
      elements = d.getElementsByTagName("*");
      pattern = new RegExp("(^|\\s)" + search + "(\\s|$)");
      for (i = 0; i < elements.length; i++) {
        if ( pattern.test(elements[i].className) ) {
          results.push(elements[i]);
        }
      }
    }
    return results;
  }
}else{
    document.getElementsByClassNameForMobile = document.getElementsByClassName;
}

(function(){
    var mobileUserAgentDetectionExperiment = rendererModel.runningExperiments.MobileUserAgentDetection || rendererModel.runningExperiments.mobileuseragentdetection;
    var enabledMobileUserAgentDetectionExperiment = mobileUserAgentDetectionExperiment && (mobileUserAgentDetectionExperiment === "New" || mobileUserAgentDetectionExperiment === "new");
    if(enabledMobileUserAgentDetectionExperiment){
        MobileUtils.isMSMobileDevice = function(){
            return (/iemobile/i.test(navigator.userAgent.toLowerCase()));
        };

        MobileUtils._getDevicePixelRatio = function(){
            if(this.isMSMobileDevice()){
                return Math.round(window.screen.availWidth / document.documentElement.clientWidth);
            }
            return window.devicePixelRatio;
        };

        MobileUtils._getDeviceParamsByUA = function getDeviceParamsByUA(){
            if(!(navigator && navigator.userAgent)) {return false;}
            var ua = navigator.userAgent.toLowerCase();

            var specificAndroidParams = this._paramsForSpecificAndroidDevices(ua);

            var width  = Math.min(screen.width, screen.height);
            var height = Math.max(screen.width, screen.height);
            if(specificAndroidParams){
                width = specificAndroidParams.width;
                height = specificAndroidParams.height;
            }

            switch(true){
                case /ip(hone|od|ad)/i.test(ua):
                    break;
                case /android/i.test(ua):
                    if (!this.isNewChromeOnAndroid() || specificAndroidParams) {
                        width  = width / this._getDevicePixelRatio();
                        height = height / this._getDevicePixelRatio();
                    }
                    break;
                case /iemobile/i.test(ua):
                    width  = document.documentElement.clientWidth;
                    height = document.documentElement.clientHeight;
                    break;
                default:
//                    width =  screen.width;
//                    height = screen.height;
                    break;
            }
            return {width:width, height: height};
        };

        MobileUtils.getScreenWidth = function () {
            var sizes = this._getDeviceParamsByUA();
            if(sizes && sizes.width){
                return sizes.width;
            }
            return false;
        };

        MobileUtils.getScreenHeight = function () {
            var sizes = this._getDeviceParamsByUA();
            if(sizes && sizes.height){
                return sizes.height;
            }
            return false;
        };

        MobileUtils.getZoom = function(){
            var screenWidth = (Math.abs(window.orientation) === 90) ? this.getScreenHeight() : this.getScreenWidth();
            if (this.isAndroidMobileDevice() && !this.isNewChromeOnAndroid()) {
                screenWidth = screenWidth / this._getDevicePixelRatio();
            }
            return (screenWidth /  window.innerWidth);
        };

        MobileUtils.getInitZoom = function(){
            if(!this._initZoom){
                var screenWidth = this.getScreenWidth();
                this._initZoom = screenWidth /document.body.offsetWidth;
            }
            return this._initZoom;
        };

        MobileUtils.isMobile = function(){
            if (typeof this._isMobile === 'boolean'){
                return this._isMobile;
            }
            var screenWidth = this.getScreenWidth();
            var isMobileScreenSize = screenWidth < this.MOBILE_MAX_WIDTH;

            if(this.isTouchScreen()){
                this._isMobile = isMobileScreenSize && true;
                //This is temporary until we fix the preloader and
            } else if(this.isMSMobileDevice()){
                this._isMobile = false;
            } else {
                this._isMobile = false;
            }

            return this._isMobile;
        };

        MobileUtils._paramsForSpecificAndroidDevices = function(userAgent){
            switch(true){
                case (/(GT-S5300B|GT-S5360|GT-S5367|GT-S5570I|GT-S6102B|LG-E400f|LG-E400g|LG-E405f|LG-L38C|LGL35G)/i).test(userAgent):
                    return {width:240, height: 320};
                    break;
                case (/(Ls 670|GT-S5830|GT-S5839i|GT-S6500D|GT-S6802B|GT-S7500L|H866C|Huawei-U8665|LG-C800|LG-MS695|LG-VM696|LGL55C|M865|Prism|SCH-R720|SCH-R820|SCH-S720C|SPH-M820-BST|SPH-M930BST|U8667|X501_USA_Cricket|ZTE-Z990G)/i).test(userAgent):
                    return {width:320, height: 480};
                    break;
                case (/(5860E|ADR6300|ADR6330VW|ADR8995|APA9292KT|C771|GT-I8160|GT-I9070|GT-I9100|HTC-A9192|myTouch4G|N860|PantechP9070|PC36100|pcdadr6350|SAMSUNG-SGH-I727|SAMSUNG-SGH-I777|SAMSUNG-SGH-I997|SC-03D|SCH-I405|SCH-I500|SCH-I510|SCH-R760|SGH-S959G|SGH-T679|SGH-T769|SGH-T959V|SGH-T989|SPH-D700)/i).test(userAgent):
                    return {width:480, height: 800};
                    break;
                case (/(DROIDX|SonyEricssonSO-02C|SonyEricssonST25i)/i).test(userAgent):
                    return {width:480, height: 854};
                    break;
                case (/(DROID3|MB855)/i).test(userAgent):
                    return {width:540, height: 960};
                    break;
                case (/F-05D/i).test(userAgent):
                    return {width:720, height: 1280};
                    break;
                default:
                    return false;
                    break;
            }
        };

    }
}());