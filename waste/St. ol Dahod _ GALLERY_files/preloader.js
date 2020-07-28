(function(){
    var mobileUserAgentDetectionExperiment = rendererModel.runningExperiments.MobileUserAgentDetection || rendererModel.runningExperiments.mobileuseragentdetection;
    var enabledMobileUserAgentDetectionExperiment = mobileUserAgentDetectionExperiment && (mobileUserAgentDetectionExperiment === "New" || mobileUserAgentDetectionExperiment === "new");

    if (MobileUtils.isMobile() && MobileUtils.isViewportOpen()) {
        if(enabledMobileUserAgentDetectionExperiment && MobileUtils.isMSMobileDevice()){
            var msStyle = document.createElement("style");
            msStyle.appendChild(
                document.createTextNode(
                    "#viewer_preloader {" +

                        "top: 50px;" +
                        "height: 150px;" +
                        "left: 50%;" +
                        "width: 150px;" +
                        "margin-left: -75px;" +
                        "box-shadow: 0px 0px 30px 11px rgba(0, 0, 0, .2);" +
                        "}" +

                        "#viewer_preloader p, #viewer_preloader h2 {" +
                        "font-size: 12px;" +
                        "width: 150px;" +
                        "padding: 0;" +
                        "margin: 0 auto;" +
                        "}" +

                        "#viewer_preloader p {" +
                        "margin-top: 15px;" +
                        "}" +

                        "#userLogo {" +
                        "margin: 10px auto;" +
                        "margin-bottom: 0px;" +
                        "width: 50px;" +
                        "height: 50px;" +
                        "display: block;" +
                        "}" +

                        "#preloader {" +
                        "margin: 10px auto;" +
                        "height: 20px;" +
                        "width: 20px;" +
                        "background-size: contain;"+
                        "}" +


                        "#viewer_preloader.noLogo p {" +
                        "margin-top: 20px;" +
                        "}" +


                        "@media (orientation:landscape) {" +

                        "#viewer_preloader {" +
                        "top: 10px;" +
                        "height: 120px;" +
                        "width: 120px;" +
                        "margin-left: -60px;" +
                        "}" +

                        "#viewer_preloader p, #viewer_preloader h2 {" +
                        "font-size: 12px;" +
                        "width: 80px;" +
                        "padding: 0;" +
                        "}" +

                        "#viewer_preloader p {" +
                        "margin-top: 25px;" +
                        "}"+

                        "#preloader {" +
                        "margin: 20px auto;" +
                        "height: 20px;" +
                        "width: 20px;" +
                        "background-size: contain;" +
                        "}" +
                        "#userLogo {" +
                        "display: none;" +
                        "}" +
                    "}"
                )
            );
            document.getElementsByTagName("body")[0].appendChild(msStyle);
        } else {
            var viewport = document.getElementById('wixMobileViewport');
            var scale = MobileUtils.getInitZoom();
            viewport.setAttribute('content','maximum-scale = '+ scale +', minimum-scale = '+ scale);
        }

        document.getElementById("viewer_preloader").style.display = "block";
    }
})();