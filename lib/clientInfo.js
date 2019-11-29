let _clientInfoBar = null;
(function(){
  function _ClientInfo() {
    this.os = ''
    this.browser = ''
    this.init()
  }
  // 获取操作系统
  _ClientInfo.prototype.getOs = function () {
    let sUserAgent = navigator.userAgent.toLowerCase()
    let isWin = (navigator.platform == "Win32") || (navigator.platform == "Win64") || (navigator.platform == "wow64");
    let isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
    if (isMac) return "Mac";
    let isUnix = (navigator.platform == "X11") && !isWin && !isMac;
    if (isUnix) return "Unix";
    let isLinux = (String(navigator.platform).indexOf("Linux") > -1);
    let bIsAndroid = sUserAgent.toLowerCase().match(/android/i) == "android";
    if (isLinux) {
      if (bIsAndroid) return "Android";
      else return "Linux";
    }
    if (isWin) {
      let isWin2K = sUserAgent.indexOf("Windows nt 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
      if (isWin2K) return "Win2000";
      let isWinXP = sUserAgent.indexOf("Windows nt 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
      if (isWinXP) return "WinXP";
      let isWin2003 = sUserAgent.indexOf("Windows nt 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
      if (isWin2003) return "Win2003";
      let isWinVista = sUserAgent.indexOf("Windows nt 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
      if (isWinVista) return "WinVista";
      let isWin7 = sUserAgent.indexOf("Windows nt 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
      if (isWin7) return "Win7";
      let isWin8 = sUserAgent.indexOf("windows nt 6.2") > -1 || sUserAgent.indexOf("Windows 8") > -1;
      if (isWin8) return "Win8";
      let isWin10 = sUserAgent.indexOf("windows nt 10.0") > -1 || sUserAgent.indexOf("Windows 10") > -1;
      if (isWin10) return "Win10";
    }
    return '其他'
  }

  // 获取操作系统版本号
  _ClientInfo.prototype.getDigits = function () {
    let sUserAgent = navigator.userAgent.toLowerCase()
    let is64 = sUserAgent.indexOf("win64") > -1 || sUserAgent.indexOf("wow64") > -1;
    return is64 ? '64位' : '32位'
  }

  // 获取浏览器
  _ClientInfo.prototype.getBrowser = function () {
    let rMsie = /(msie\s|trident\/7)([\w\.]+)/;
    let rTrident = /(trident)\/([\w.]+)/;
    let rEdge = /(chrome)\/([\w.]+)/; //IE

    let rFirefox = /(firefox)\/([\w.]+)/; //火狐
    let rOpera = /(opera).+version\/([\w.]+)/; //旧Opera
    let rNewOpera = /(opr)\/(.+)/; //新Opera 基于谷歌
    let rChrome = /(chrome)\/([\w.]+)/; //谷歌 
    let rUC = /(chrome)\/([\w.]+)/; //UC
    let rMaxthon = /(chrome)\/([\w.]+)/; //遨游
    let r2345 = /(chrome)\/([\w.]+)/; //2345
    let rQQ = /(chrome)\/([\w.]+)/; //QQ
    //let rMetasr =  /(metasr)\/([\w.]+)/;//搜狗
    let rSafari = /version\/([\w.]+).*(safari)/;

    let ua = navigator.userAgent.toLowerCase();


    let matchBS = ''
    let matchBS2 = ''

    //IE 低版
    matchBS = rMsie.exec(ua);
    if (matchBS != null) {
      matchBS2 = rTrident.exec(ua);
      if (matchBS2 != null) {
        switch (matchBS2[2]) {
          case "4.0":
            return {
              browser:
                "Microsoft IE",
                version: "IE: 8" //内核版本号
            };
            break;
          case "5.0":
            return {
              browser:
                "Microsoft IE",
                version: "IE: 9"
            };
            break;
          case "6.0":
            return {
              browser:
                "Microsoft IE",
                version: "IE: 10"
            };
            break;
          case "7.0":
            return {
              browser:
                "Microsoft IE",
                version: "IE: 11"
            };
            break;
          default:
            return {
              browser:
                "Microsoft IE",
                version: "Undefined"
            };
        }
      } else {
        return {
          browser: "Microsoft IE",
          version: "IE:" + matchBS[2] || "0"
        };
      }
    }
    //IE最新版
    matchBS = rEdge.exec(ua);
    if ((matchBS != null) && (!(window.attachEvent))) {
      return {
        browser: "Microsoft Edge",
        version: "Chrome/" + matchBS[2] || "0"
      };
    }
    //UC浏览器					  
    matchBS = rUC.exec(ua);
    if ((matchBS != null) && (!(window.attachEvent))) {
      return {
        browser: "UC",
        version: "Chrome/" + matchBS[2] || "0"
      };
    }
    //火狐浏览器
    matchBS = rFirefox.exec(ua);
    if ((matchBS != null) && (!(window.attachEvent))) {
      return {
        browser: "火狐",
        version: "Firefox/" + matchBS[2] || "0"
      };
    }
    //Oper浏览器					 
    matchBS = rOpera.exec(ua);
    if ((matchBS != null) && (!(window.attachEvent))) {
      return {
        browser: "Opera",
        version: "Chrome/" + matchBS[2] || "0"
      };
    }
    //遨游
    matchBS = rMaxthon.exec(ua);
    if ((matchBS != null) && (!(window.attachEvent))) {
      return {
        browser: "遨游",
        version: "Chrome/" + matchBS[2] || "0"
      };
    }
    //2345浏览器					  
    matchBS = r2345.exec(ua);
    if ((matchBS != null) && (!(window.attachEvent))) {
      return {
        browser: "2345",
        version: "Chrome/ " + matchBS[2] || "0"
      };
    }
    //QQ浏览器					  
    matchBS = rQQ.exec(ua);
    if ((matchBS != null) && (!(window.attachEvent))) {
      return {
        browser: "QQ",
        version: "Chrome/" + matchBS[2] || "0"
      };
    }
    //Safari（苹果）浏览器
    matchBS = rSafari.exec(ua);
    if ((matchBS != null) && (!(window.attachEvent)) && (!(window.chrome)) && (!(window.opera))) {
      return {
        browser: "Safari",
        version: "Safari/" + matchBS[1] || "0"
      };
    }
    //谷歌浏览器
    matchBS = rChrome.exec(ua);
    if ((matchBS != null) && (!(window.attachEvent))) {
      matchBS2 = rNewOpera.exec(ua);
      if (matchBS2 == null) {
        return {
          browser: "谷歌",
          version: "Chrome/" + matchBS[2] || "0"
        };
      } else {
        return {
          browser: "Opera",
          version: "opr/" + matchBS2[2] || "0"
        };
      }
    }
  }

  _ClientInfo.prototype.init = function() {
    this.os = this.getOs() + ' ' + this.getDigits()
    if (this.getOs() === 'Mac') {
      this.os = this.getOs()
    }
    this.browser = this.getBrowser().version
  }
  
  _clientInfoBar = new _ClientInfo()
})()

export default _clientInfoBar
