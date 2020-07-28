function GetRadWindow() {
    var oWindow = null;
    if (window.radWindow) oWindow = window.radWindow;
    else if (window.frameElement.radWindow) oWindow = window.frameElement.radWindow;
    return oWindow;
}

function OpenRADWindow(URL, Window) {
    radopen(URL, Window);
}

function CloseWindow() {
    var oWindow = GetRadWindow();
    oWindow.Close();
}