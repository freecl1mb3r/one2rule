/*****************************************************************
*
*  Namespaces
*
*****************************************************************/
var COCOS = COCOS || {};
COCOS.Cmn = COCOS.Cmn || {};
COCOS.Cmn.Utility = COCOS.Cmn.Utility || {};
COCOS.Cmn.Utility.Enums = COCOS.Cmn.Utility.Enums || {};
COCOS.Cmn.Utility.Utf8 = COCOS.Cmn.Utility.Utf8 || {};

/*****************************************************************
*
*  Libraries that must be loaded
*
*****************************************************************/
COCOS.Cmn.Utility.libraryDependency =
    [
        { jQuery: COCOS.Cmn.Libloader.Enums.SysLib.jQuery }
    ];


// var $ = $ || null;
/*****************************************************************
*
*  Constants
*
*****************************************************************/
COCOS.Cmn.Utility.libraryName = 'COCOS Utility Library (Lib_COCOS_Utility.js)';
COCOS.Cmn.Utility.initialized = false;

if (!COCOS.Cmn.Utility.rootPath) COCOS.Cmn.Utility.rootPath = '../..';

/*****************************************************************
*
*  Enumerators
*
*****************************************************************/


/*****************************************************************
*
*  Common Library Methods
*  * Check library prerequisites
*  * Handle library initialization status
*****************************************************************/


/**
* Is library initialized
* Check if all dependencies are loaded
*/
COCOS.Cmn.Utility.IsInitialized = function () {

    COCOS.Cmn.Libloader.CheckPrereqLibsStatus(COCOS.Cmn.Utility.libraryDependency,
        function () { COCOS.Cmn.Utility.initialized = true; });

    // Check jQuery
    // var lbJQuery = $ || 'undefined';
    // if (lbJQuery != 'undefined') COCOS.Cmn.Utility.jQueryInitialized = true;

    if (!COCOS.Cmn.Utility.initialized) {
        // alert('Library "' + COCOS.Cmn.Utility.libraryName + '" not properly initialized. Check prerequisites.');
        return false;
    }
    return true;
};

/**
* Init (instantiate objects, etc..) the library
* Dependency libraries are loaded and initialized
*/
COCOS.Cmn.Utility.Init = function () {

};

/**
*  Main method is executed on library load
*/
COCOS.Cmn.Utility.Main = function() {
};

/********************************************************************************************
*
*  SYSTEM
*
********************************************************************************************/
COCOS.Cmn.Utility.GetCurrentPageName = function() {
    var sURL = window.location.pathname;
    var sPage = sURL.substring(sURL.lastIndexOf('/') + 1);
    return sPage;
}

COCOS.Cmn.Utility.GetCurrentPagePath = function() {
    var sURL = window.location.toString();
    var sPath = sURL.substring(0, sURL.lastIndexOf('/'));
    return sPath;
}

COCOS.Cmn.Utility.GetWindowSize = function() {
    var loResult = {w: 0, h: 0};
    if (document.body && document.body.offsetWidth) {
        loResult.w = document.body.offsetWidth;
        loResult.h = document.body.offsetHeight;
    }
    if (document.compatMode=='CSS1Compat' &&
        document.documentElement &&
        document.documentElement.offsetWidth ) {
        loResult.w = document.documentElement.offsetWidth;
        loResult.h = document.documentElement.offsetHeight;
    }
    if (window.innerWidth && window.innerHeight) {
        loResult.w = window.innerWidth;
        loResult.h = window.innerHeight;
    }
    return loResult;
}

/********************************************************************************************
*
*  GUID
*
********************************************************************************************/
COCOS.Cmn.Utility.NullGUID = '00000000-0000-0000-0000-000000000000';

COCOS.Cmn.Utility.NewGUID = function() {
    return (COCOS.Cmn.Utility.UtlS4() + COCOS.Cmn.Utility.UtlS4() + "-" + COCOS.Cmn.Utility.UtlS4() + "-" + COCOS.Cmn.Utility.UtlS4() + "-" + COCOS.Cmn.Utility.UtlS4() + "-" + COCOS.Cmn.Utility.UtlS4() + COCOS.Cmn.Utility.UtlS4() + COCOS.Cmn.Utility.UtlS4());
};

COCOS.Cmn.Utility.IsValidGUID = function (guidCheck) {
    var valid = /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/.test(guidCheck);
    return valid;
};

COCOS.Cmn.Utility.NewUUID = function() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return uuid;
};

COCOS.Cmn.Utility.ClearGUID = function(pGUID) {
    return pGUID.toString().replace(/\{/g, '').replace(/\}/g, '').replace(/\-/g, '').toUpperCase();
};

COCOS.Cmn.Utility.AddDashToGUID = function(pGUID) {
    var lsR = COCOS.Cmn.Utility.ClearGUID(pGUID);
    lsR = lsR.splice(20, 0, '-');
    lsR = lsR.splice(16, 0, '-');
    lsR = lsR.splice(12, 0, '-');
    lsR = lsR.splice(8, 0, '-');
    return lsR;
};



COCOS.Cmn.Utility.GUIDCompare = function(pGUID1, pGUID2) {
    if (pGUID1 && pGUID2) {
        var lsGUID1 = pGUID1.toString().toLowerCase().replace('{', '').replace('}', '').replace('-', '');
        var lsGUID2 = pGUID2.toString().toLowerCase().replace('{', '').replace('}', '').replace('-', '');
        if (lsGUID1 == lsGUID2) return true;
    }
    return false;
}

/********************************************************************************************
*
*  STYLES
*
********************************************************************************************/
COCOS.Cmn.Utility.SetOpacity = function(pObj, pValue) {
    if (pObj) {
        pObj.style.opacity = pValue/10;
        pObj.style.filter = 'alpha(opacity=' + pValue*10 + ')';
    }
}

COCOS.Cmn.Utility.AddCss = function(cssCode) {
    var loStyleEl = document.createElement('style');
    loStyleEl.type = 'text/css';
    if (loStyleEl.styleSheet) {
        loStyleEl.styleSheet.cssText = cssCode;
    } else {
        loStyleEl.appendChild(document.createTextNode(cssCode));
    }
    document.getElementsByTagName('head')[0].appendChild(loStyleEl);
}

/********************************************************************************************
*
*  COOKIES
*
********************************************************************************************/
/**
* allCookies.setItem(sKey, sValue, vEnd, sPath, sDomain, bSecure)
*
* @argument sKey (String): the name of the cookie;
* @argument sValue (String): the value of the cookie;
* @optional argument vEnd (Number - finite or Infinity, String, Date object or null): the max-age in seconds (e.g.
* 31536e3 for a year) or the expires date in GMTString format or in Date Object format; if not specified it will
* expire at the end of session;
* @optional argument sPath (String or null): e.g., "/", "/mydir"; if not specified, defaults to the current path
* of the current document location;
* @optional argument sDomain (String or null): e.g., "example.com", ".example.com" (includes all subdomains) or
* "subdomain.example.com"; if not specified, defaults to the host portion of the current document location;
* @optional argument bSecure (Boolean or null): cookie will be transmitted only over secure protocol as https;
* @return undefined;
**/

COCOS.Cmn.Utility.Cookies = {
    GetItem: function (sKey) {
        if (!sKey || !this.HasItem(sKey)) { return null; }
        return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
    },
    SetItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return; }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Tue, 19 Jan 2038 03:14:07 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toGMTString();
                    break;
            }
        }
        document.cookie = escape(sKey) + "=" + escape(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "; path=/") + (bSecure ? "; secure" : "");
    },
    RemoveItem: function (sKey, sPath) {
        if (!sKey || !this.HasItem(sKey)) { return; }
        document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sPath ? "; path=" + sPath : "; path=/");
    },
    HasItem: function (sKey) {
        return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    Keys: /* optional method: you can safely remove it! */ function () {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = unescape(aKeys[nIdx]); }
        return aKeys;
    }
};

/********************************************************************************************
*
*  NUMBERS
*
********************************************************************************************/
COCOS.Cmn.Utility.IsNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/********************************************************************************************
*
*  STRINGS
*
********************************************************************************************/
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.splice = function( idx, rem, s ) {
    return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
};

// Adding trim functions to String for browsers not supporting it (IE8)
if (!String.prototype.trim) {
    String.prototype.trim=function(){return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace(/\0/g, '');};
    String.prototype.ltrim=function(){return this.replace(/^\s+/,'');}
    String.prototype.rtrim=function(){return this.replace(/\s+$/,'');}
    String.prototype.fulltrim=function(){return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');}
}

// pad with 0
COCOS.Cmn.Utility.Pad = function (number, length) {

    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }

    return str;
};
/**
/ Pad number with zeros
* @param {string} num number to be padded
* @param {string} len length of zeroes
*/

COCOS.Cmn.Utility.padWithZeroes = function(num, len) {
    var str = "" + num;
    while (str.length < len) {
        str = "0" + str;
    }
    return str;
};

COCOS.Cmn.Utility.padWithSpaces = function(str, len) {
    while (str.length < len) {
        str += " ";
    }
    return str;
};

COCOS.Cmn.Utility.padCustom = function(chr, len) {
    var str = '';
    while (str.length < len) {
        str += chr;
    }
    return str;
};

String.prototype.replaceAt = function(pIndex, pFrom, pTo) {
    return this.substr(0, pIndex) + pTo + this.substr(pIndex + pFrom.length);
};

COCOS.Cmn.Utility.Highlight = function (s, t) {
    var matcher = new RegExp("("+$.ui.autocomplete.escapeRegex(t)+")", "ig" );
    return s.replace(matcher, "<highlight>$1</highlight>");
}
/********************************************************************************************
*
*  DATE-TIME
*
********************************************************************************************/
COCOS.Cmn.Utility.FormatDateTime = function(pDateTime, pFormatString) {
    var lsResult = pFormatString;
    var d = pDateTime.getDate().toString();
    var dd = (d.toString().length == 1 ? '0' : '') + d;
    var M = (pDateTime.getMonth() + 1).toString();
    var MM = (M.toString().length == 1 ? '0' : '') + M;
    var yy = pDateTime.getFullYear().toString().substring(2,2);;
    var yyyy = pDateTime.getFullYear();
    var H = pDateTime.getHours();
    var HH = (H.toString().length == 1 ? '0' : '') + H;
    var m = pDateTime.getMinutes();
    var mm = (m.toString().length == 1 ? '0' : '') + m;
    var s = pDateTime.getSeconds();
    var ss = (s.toString().length == 1 ? '0' : '') + s;
    var nnn = COCOS.Cmn.Utility.padWithZeroes(pDateTime.getMilliseconds(), 3);

    lsResult = lsResult.replace('yyyy', yyyy).replace('yy', yy).replace('MM', MM).replace('M', M).replace('dd', dd).replace('d', d);
    lsResult = lsResult.replace('HH', HH).replace('H', H).replace('mm', mm).replace('m', m).replace('ss', ss).replace('s', s).replace('nnn', nnn);

    return lsResult;
}

/********************************************************************************************
*
*  ARRAYS
*
********************************************************************************************/
COCOS.Cmn.Utility.IsArray = function(pVar) {
    if( Object.prototype.toString.call( pVar ) === '[object Array]' ) return true;
    return false;
};

COCOS.Cmn.Utility.SearchStringInArray = function(str, strArray) {
    for (var j=0; j<strArray.length; j++) {
        if (strArray[j].toLowerCase().match(str)) return j;
    }
    return -1;
};

//Return object form retValues collection coundle
COCOS.Cmn.Utility.ObjectFromBoundle = function (boundle) {
    var arrObjects = [];
    if (boundle.values) {
        for (var i = 0; i < boundle.values.length; i++) {
            var object = {};
            var values = boundle.values[i];

            for (var c = 0; c < boundle.columns.length; c++) {
                var column = boundle.columns[c];
                object[column] = values[c];
            }
            arrObjects.push(object);
        }
        //values.pus
        return arrObjects;
    }
    else {
        for (var i = 0; i < boundle.length; i++) {
            var value = boundle[i];
            var object = { participantDirectoryNumber: value };
            arrObjects.push(object);
        }
        return arrObjects;
    }
};


/********************************************************************************************
*
*  URLs
*
********************************************************************************************/
COCOS.Cmn.Utility.UrlToAbsolute = function (href) {
    var link = document.createElement('a');
    link.href = href;
    return (link.protocol + '//' + link.host + link.pathname + link.search + link.hash);
}

COCOS.Cmn.Utility.UrlProtocolHandler = function (pUrl, pProtocol) {
  var lsPrefix = '';
  if (pUrl.indexOf('http://') == 0 || pUrl.indexOf('https://') == 0) {
    lsPrefix = '';
  } else if (pUrl.indexOf('//') == 0) {
    lsPrefix = (typeof pProtocol != 'undefined' ? pProtocol : location.protocol);
  } else {
    lsPrefix = (typeof pProtocol != 'undefined' ? pProtocol : location.protocol) + '//';
  }
  return lsPrefix + pUrl + (!pUrl.endsWith('/') ? '/' : '');
}

/********************************************************************************************
*
*  UTF8
*
********************************************************************************************/
// public method for url encoding
COCOS.Cmn.Utility.Utf8.Encode = function (string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);

        if (c < 128) {
            utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }
    }
    return utftext;
}

// public method for url decoding
COCOS.Cmn.Utility.Utf8.Decode = function (utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;

    while ( i < utftext.length ) {
        c = utftext.charCodeAt(i);

        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        }
        else if((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i+1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        }
        else {
            c2 = utftext.charCodeAt(i+1);
            c3 = utftext.charCodeAt(i+2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }
    }
    return string;
}





/********************************************************************************************
*
*  MD5
*
********************************************************************************************/
COCOS.Cmn.Utility.MD5 = function (string) {
    function RotateLeft(lValue, iShiftBits) {
        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    }

    function AddUnsigned(lX,lY) {
        var lX4,lY4,lX8,lY8,lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }

    function F(x,y,z) { return (x & y) | ((~x) & z); }
    function G(x,y,z) { return (x & z) | (y & (~z)); }
    function H(x,y,z) { return (x ^ y ^ z); }
    function I(x,y,z) { return (y ^ (x | (~z))); }

    function FF(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function GG(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function HH(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function II(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1=lMessageLength + 8;
        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
        var lWordArray=Array(lNumberOfWords-1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while ( lByteCount < lMessageLength ) {
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount-(lByteCount % 4))/4;
        lBytePosition = (lByteCount % 4)*8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
        lWordArray[lNumberOfWords-2] = lMessageLength<<3;
        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
        return lWordArray;
    };

    function WordToHex(lValue) {
        var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
        for (lCount = 0;lCount<=3;lCount++) {
            lByte = (lValue>>>(lCount*8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
        }
        return WordToHexValue;
    };

    function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };

    var x=Array();
    var k,AA,BB,CC,DD,a,b,c,d;
    var S11=7, S12=12, S13=17, S14=22;
    var S21=5, S22=9 , S23=14, S24=20;
    var S31=4, S32=11, S33=16, S34=23;
    var S41=6, S42=10, S43=15, S44=21;

    string = Utf8Encode(string);
    x = ConvertToWordArray(string);
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

    for (k=0;k<x.length;k+=16) {
        AA=a; BB=b; CC=c; DD=d;
        a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
        d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
        c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
        b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
        a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
        d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
        c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
        b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
        a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
        d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
        c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
        b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
        a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
        d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
        c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
        b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
        a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
        d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
        c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
        b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
        a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
        d=GG(d,a,b,c,x[k+10],S22,0x2441453);
        c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
        b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
        a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
        d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
        c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
        b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
        a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
        d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
        c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
        b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
        a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
        d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
        c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
        b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
        a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
        d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
        c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
        b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
        a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
        d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
        c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
        b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
        a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
        d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
        c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
        b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
        a=II(a,b,c,d,x[k+0], S41,0xF4292244);
        d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
        c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
        b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
        a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
        d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
        c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
        b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
        a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
        d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
        c=II(c,d,a,b,x[k+6], S43,0xA3014314);
        b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
        a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
        d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
        c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
        b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
        a=AddUnsigned(a,AA);
        b=AddUnsigned(b,BB);
        c=AddUnsigned(c,CC);
        d=AddUnsigned(d,DD);
    }

    var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

    return temp.toLowerCase();
}

/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
COCOS.Cmn.Utility.MD5_MD = function () {
    /*
     * Configurable variables. You may need to tweak these to be compatible with
     * the server-side, but the defaults work in most cases.
     */
    var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase */
    var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance */
    var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode */

    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */
    var safe_add = function (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    };

    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    var bit_rol = function (num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    };

    /*
     * Convert a string to an array of little-endian words
     * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
     */
    var str2binl = function (str) {
        var bin = [];
        var mask = (1 << chrsz) - 1;
        for(var i = 0; i < str.length * chrsz; i += chrsz)
        {
            bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
        }
        return bin;
    };

    /*
     * Convert an array of little-endian words to a string
     */
    var binl2str = function (bin) {
        var str = "";
        var mask = (1 << chrsz) - 1;
        for(var i = 0; i < bin.length * 32; i += chrsz)
        {
            str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
        }
        return str;
    };

    /*
     * Convert an array of little-endian words to a hex string.
     */
    var binl2hex = function (binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for(var i = 0; i < binarray.length * 4; i++)
        {
            str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
                hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
        }
        return str;
    };

    /*
     * Convert an array of little-endian words to a base-64 string
     */
    var binl2b64 = function (binarray) {
        var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var str = "";
        var triplet, j;
        for(var i = 0; i < binarray.length * 4; i += 3)
        {
            triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16) |
                (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 ) |
                ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
            for(j = 0; j < 4; j++)
            {
                if(i * 8 + j * 6 > binarray.length * 32) { str += b64pad; }
                else { str += tab.charAt((triplet >> 6*(3-j)) & 0x3F); }
            }
        }
        return str;
    };

    /*
     * These functions implement the four basic operations the algorithm uses.
     */
    var md5_cmn = function (q, a, b, x, s, t) {
        return safe_add(bit_rol(safe_add(safe_add(a, q),safe_add(x, t)), s),b);
    };

    var md5_ff = function (a, b, c, d, x, s, t) {
        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    };

    var md5_gg = function (a, b, c, d, x, s, t) {
        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    };

    var md5_hh = function (a, b, c, d, x, s, t) {
        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
    };

    var md5_ii = function (a, b, c, d, x, s, t) {
        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    };

    /*
     * Calculate the MD5 of an array of little-endian words, and a bit length
     */
    var core_md5 = function (x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var a =  1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d =  271733878;

        var olda, oldb, oldc, oldd;
        for (var i = 0; i < x.length; i += 16)
        {
            olda = a;
            oldb = b;
            oldc = c;
            oldd = d;

            a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
            d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
            b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
            d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
            c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
            d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
            d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

            a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
            d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
            c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
            b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
            a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
            d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
            c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
            d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
            c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
            a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
            d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
            c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
            b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

            a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
            d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
            b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
            d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
            c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
            d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
            c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
            a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
            d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
            b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

            a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
            d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
            c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
            d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
            d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
            a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
            d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
            b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
        }
        return [a, b, c, d];
    };

    /*
     * Calculate the HMAC-MD5, of a key and some data
     */
    var core_hmac_md5 = function (key, data) {
        var bkey = str2binl(key);
        if(bkey.length > 16) { bkey = core_md5(bkey, key.length * chrsz); }

        var ipad = new Array(16), opad = new Array(16);
        for(var i = 0; i < 16; i++)
        {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }

        var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
        return core_md5(opad.concat(hash), 512 + 128);
    };

    var obj = {
        /*
         * These are the functions you'll usually want to call.
         * They take string arguments and return either hex or base-64 encoded
         * strings.
         */
        hexdigest: function (s) {
            return binl2hex(core_md5(str2binl(s), s.length * chrsz));
        },

        b64digest: function (s) {
            return binl2b64(core_md5(str2binl(s), s.length * chrsz));
        },

        hash: function (s) {
            return binl2str(core_md5(str2binl(s), s.length * chrsz));
        },

        hmac_hexdigest: function (key, data) {
            return binl2hex(core_hmac_md5(key, data));
        },

        hmac_b64digest: function (key, data) {
            return binl2b64(core_hmac_md5(key, data));
        },

        hmac_hash: function (key, data) {
            return binl2str(core_hmac_md5(key, data));
        },

        /*
         * Perform a simple self-test to see if the VM is working
         */
        test: function () {
            return MD5.hexdigest("abc") === "900150983cd24fb0d6963f7d28e17f72";
        }
    };

    return obj;
};

/* randomUUID.js - Version 1.0
*
* Copyright 2008, Robert Kieffer
*
* This software is made available under the terms of the Open Software License
* v3.0 (available here: http://www.opensource.org/licenses/osl-3.0.php )
*
* The latest version of this file can be found at:
* http://www.broofa.com/Tools/randomUUID.js
*
* For more information, or to comment on this, please go to:
* http://www.broofa.com/blog/?p=151
*/

/**
* Create and return a "version 4" RFC-4122 UUID string.
*/
COCOS.Cmn.Utility.randomUUID = function () {
    var s = [], itoh = '0123456789ABCDEF';

    // Make array of random hex digits. The UUID only has 32 digits in it, but we
    // allocate an extra items to make room for the '-'s we'll be inserting.
    for (var i = 0; i < 36; i++) s[i] = Math.floor(Math.random() * 0x10);

    // Conform to RFC-4122, section 4.4
    s[14] = 4;  // Set 4 high bits of time_high field to version
    s[19] = (s[19] & 0x3) | 0x8;  // Specify 2 high bits of clock sequence

    // Convert to hex chars
    for (var i = 0; i < 36; i++) s[i] = itoh[s[i]];

    // Insert '-'s
    s[8] = s[13] = s[18] = s[23] = '-';

    return s.join('');
};



/********************************************************************************************
*
*  HELPER METHODS
*
********************************************************************************************/
COCOS.Cmn.Utility.Random = function (min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
};

COCOS.Cmn.Utility.UtlS4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};


COCOS.Cmn.Utility.GetEnumName = function(pEnum, pValue) {
    for (var lsName in pEnum) {
        if (pEnum[lsName] == pValue)
            return lsName;
    }
    return pValue;
};

//replace all
COCOS.Cmn.Utility.ReplaceAll = function (find, replace, str) {
    return str.replace(new RegExp(COCOS.Cmn.Utility.escapeRegExp(find), 'g'), replace);
};

COCOS.Cmn.Utility.escapeRegExp = function (str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};


COCOS.Cmn.Utility.stringToBoolean = function (string) {
    if (string == true)
        return true;
    else if (string == false)
        return false;
    try
    {
        if (string.toLowerCase() =="true")
            return true;
        else
            return false;
    } catch (ex) {
        return false;
    }
};

COCOS.Cmn.Utility.CleanAddress = function (pAddress, pDomain) {
    if (!pAddress) return null;
    var la = pAddress.split(',');
    var lsResult = '';
    for (var li = 0; li < la.length; li++) {
        if (la[li]) {
            var lsA = la[li].trim();
            lsResult +=
                (lsResult != '' ? ',' : '')
                + lsA
                + (pDomain && (lsA.indexOf('@') != -1 || COCOS.Cmn.Utility.IsNumber(lsA)) ? '' : '@' + pDomain);
        }
    }
    return lsResult;
}



// *************************************************************************************************************/
//                      Image Handling
// *************************************************************************************************************/

COCOS.Cmn.Utility.ImageHandling = COCOS.Cmn.Utility.ImageHandling || {};

// List of images to be pre-cached
COCOS.Cmn.Utility.ImageHandling.imagesToBeCached = [];
COCOS.Cmn.Utility.ImageHandling.imagesToBeCached.push({id: 'no-picture.svg', type: 'svg'});

COCOS.Cmn.Utility.ImageHandling.unavailableTo = 30 * 60 * 1000;  // 30 minutes
COCOS.Cmn.Utility.ImageHandling.cache = {};
COCOS.Cmn.Utility.ImageHandling.imageTypeHeaders = {
    svg: 'data:image/svg+xml;charset=utf-8,',
    jpg: 'data:image/jpg;base64,',
    png: 'data:image/png;base64,',
    gif: 'data:image/gif;base64,'
};
COCOS.Cmn.Utility.ImageHandling.imageTypeHeaderDefault = 'data:image/png;base64,';
COCOS.Cmn.Utility.ImageHandling.getImageCacheData = function (pPath) {
    var arr = COCOS.Cmn.Utility.ImageHandling.imagesToBeCached;
    var id = null;
    for (var li = 0; li < arr.length; li++) {
        id = arr[li].id.replace(/\W+/g, '');
        if (pPath.endsWith(id)) return arr[li];
    }
    return null;
};
COCOS.Cmn.Utility.ImageHandling.getImageTypeHeader = function (pType) {
    return COCOS.Cmn.Utility.ImageHandling.imageTypeHeaders[pType] || COCOS.Cmn.Utility.ImageHandling.imageTypeHeaderDefault;
};

COCOS.Cmn.Utility.ImageHandling.imageData = function (pAvailable) {
    this.available = (typeof pAvailable != 'undefined' ? pAvailable : true);
    this.dateChecked = new Date();
    this.data = null;
};

COCOS.Cmn.Utility.ImageHandling.loadImage = function (pPath, pImageDOM, pPathFallback, pCallback) {
    if (typeof pPath == 'undefined' || pPath == null || pPath == '' || pPath == 'undefined') return;

    // Clean path to alphanumeric, add safety prefix
    var pathId = 'path_' + pPath.replace(/\W+/g, '');

    // Check if pathId in list
    // If exist and unavailable and 
    //   timeout expired => delete data for image
    //   else => load pPathFallback if available
    if (pathId.indexOf('421') != -1) {
        var dummy = 0;
    }
    if (typeof COCOS.Cmn.Utility.ImageHandling.cache[pathId] != 'undefined') {
        var itm = COCOS.Cmn.Utility.ImageHandling.cache[pathId];
        if (!COCOS.Cmn.Utility.ImageHandling.cache[pathId].available) {
            if ((new Date()).getTime() - itm.dateChecked.getTime() > COCOS.Cmn.Utility.ImageHandling.unavailableTo) {
                delete COCOS.Cmn.Utility.ImageHandling.cache[pathId]
            } else {
                if (typeof pPathFallback != 'undefined' && pPathFallback != null && pPathFallback != '' && pPathFallback != 'undefined') {
                    COCOS.Cmn.Utility.ImageHandling.loadImage(pPathFallback, pImageDOM, null, pCallback);
                }
                return;
            }
        }
    }

    // Load image content from cache, if pre-cached (list of pre-cached images: COCOS.Cmn.Utility.ImageHandling.imagesToBeCached)
    if (typeof COCOS.Cmn.Utility.ImageHandling.cache[pathId] != 'undefined') {
        if (COCOS.Cmn.Utility.ImageHandling.cache[pathId].data != null) {
            var loImg = null;
            if (typeof pImageDOM == 'undefined' || pImageDOM == null || pImageDOM == '' || pImageDOM == 'undefined' || $(pImageDOM).length == 0) {
                loImg = new Image();
            } else {
                loImg = $(pImageDOM)[0];
            }
            loImg.src = COCOS.Cmn.Utility.ImageHandling.cache[pathId].data;
            return;
        }
    }

    COCOS.Cmn.Utility.XmlHttpPost(
        pPath,
        {
            Type: 'GET',
            DataType: 'text',
            Data: '',
            Timeout: 5000,
            Cache: true
        },
        (function(pId, pPth, pImgDOM, pCB) {
            return function (pResponseText, ajaxTextStatus, jqXHR, pParams) {
                var pathId = pId;
                if (pathId.indexOf('421') != -1) {
                    var dummy = 0;
                }
                var loImg = null;
                if (typeof pImgDOM == 'undefined' || pImgDOM == null || pImgDOM == '' || pImgDOM == 'undefined' || $(pImgDOM).length == 0) {
                    loImg = new Image();
                } else {
                    loImg = $(pImgDOM)[0];
                }
                loImg.src = pPth;

                if (typeof COCOS.Cmn.Utility.ImageHandling.cache[pathId] == 'undefined') {
                    COCOS.Cmn.Utility.ImageHandling.cache[pathId] = new COCOS.Cmn.Utility.ImageHandling.imageData(true);
                } else {
                    COCOS.Cmn.Utility.ImageHandling.cache[pathId].available = true;
                }
                var imgCacheData = COCOS.Cmn.Utility.ImageHandling.getImageCacheData(pathId);
                if (imgCacheData != null) {
                    COCOS.Cmn.Utility.ImageHandling.cache[pathId].data = COCOS.Cmn.Utility.ImageHandling.getImageTypeHeader(imgCacheData.type) + pResponseText;
                }

                if (typeof pCB != 'undefined' && pCB != null && pCB != '' && pCB != 'undefined') pCB(loImg);
            };
        })(pathId, pPath, pImageDOM, pCallback),
        (function(pId, pPth, pImgDOM, pCB) {
            return function () {
                var pathId = pId;
                if (pathId.indexOf('421') != -1) {
                    var dummy = 0;
                }
                if (typeof COCOS.Cmn.Utility.ImageHandling.cache[pathId] == 'undefined') {
                    COCOS.Cmn.Utility.ImageHandling.cache[pathId] = new COCOS.Cmn.Utility.ImageHandling.imageData(false);
                } else {
                    COCOS.Cmn.Utility.ImageHandling.cache[pathId].available = false;
                }
                if (typeof pPth == 'undefined' || pPth == null || pPth == '' || pPth == 'undefined') return;
                COCOS.Cmn.Utility.ImageHandling.loadImage(pPth, pImgDOM, null, pCB);
            };
        })(pathId, (typeof pPathFallback != 'undefined' && pPathFallback != null && pPathFallback != '' ? pPathFallback : null), pImageDOM, pCallback),
        null
    );
};



// *************************************************************************************************************/
//                      Cache
// *************************************************************************************************************/

COCOS.Cmn.Utility.Cache = COCOS.Cmn.Utility.Cache || {};

COCOS.Cmn.Utility.Cache.Prefix = 'C.Cmn.Cache_';
COCOS.Cmn.Utility.Cache.Items = new Object();

COCOS.Cmn.Utility.Cache.Set = function (pId, pItem, pPermanent) {
    if (COCOS.Cmn.isIE) {
        Object.defineProperty(COCOS.Cmn.Utility.Cache.Items, pId, {
            value: pItem,
            writable: true,
            enumerable: true,
            configurable: true
        });
    } else {
        COCOS.Cmn.Utility.Cache.Items[pId] = pItem;
    }
}

COCOS.Cmn.Utility.Cache.Get = function (pId) {
    var lo = (typeof COCOS.Cmn.Utility.Cache.Items[pId] != 'undefined' ? COCOS.Cmn.Utility.Cache.Items[pId] : null);
    // TODO: deserilization
    return lo;
}

COCOS.Cmn.Utility.Cache.Remove = function (pId) {
    delete COCOS.Cmn.Utility.Cache.Items[pId];
}

COCOS.Cmn.Utility.Cache.Load = function () {
}

COCOS.Cmn.Utility.Cache.ImageToBase64 = function (pURL, pCallback, pCallbackError) {
    var img = new Image();
    img.onload = (function (pCB) {
        return function () {
            var canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0);

            var dataURL = pURL;
            //var dataURL = canvas.toDataURL("image/png");

            //if (pCallback) pCallback(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
            if (pCallback) pCallback(dataURL);
        }
    })(pCallback);
    if (pCallbackError) img.onerror = pCallbackError();
    img.src = pURL;
}


/********************************************************************************************
*
*  UI Lists
*
********************************************************************************************/

COCOS.Cmn.Utility.UIList = COCOS.Cmn.Utility.UIList || {};

COCOS.Cmn.Utility.UIList.Types = {
    Item: 0,
    Delimiter: 1
}

COCOS.Cmn.Utility.UIList.CEntry = function (pItem, pType) {
    this.Type = (typeof pType == 'undefined' ? COCOS.Cmn.Utility.UIList.Types.Item : pType);
    this.Item = pItem;
    this.ItemDOM = null;
    this.DelimiterEntry = null;
}

COCOS.Cmn.Utility.UIList.CList = function (pHolder, pName) {
    this.Id = COCOS.Cmn.Utility.NewGUID().toUpperCase();
    this.Holder = pHolder;
    this.Name = pName;
    this.Entries = new Array(); // Of objects CEntry
    //Methods to be overridden
    this.Compare = function (pA, pB) {return (pA > pB ? 1 : (pA < pB ? -1 : 0))};
    this.CompareDelimiter = function (pA, pB) {return (pA > pB ? 1 : (pA < pB ? -1 : 0))};
    this.GenerateDOM = function (pItem) {return ''};
    this.GenerateDelimiterDOM = function (pItem) {return ''};
}

COCOS.Cmn.Utility.UIList.CList.prototype.Get = function (pItem, pReturnIndex) {
    for (var li = 0; li < this.Entries.length; li++) {
        if (this.Entries[li].Type == COCOS.Cmn.Utility.UIList.Types.Item) {
            if (this.Compare(pItem, this.Entries[li].Item) == 0) {
                return (typeof pReturnIndex != 'undefined' && pReturnIndex == true ? li : this.Entries[li]);
            }
        }
    }
    return null;
}

COCOS.Cmn.Utility.UIList.CList.prototype.GetDelimiter = function (pItem) {
    var liI = this.GetIndex(pItem);
    var loE = null;
    //Last Item
    if (liI == null) {
        loE = this.GetLast();
    //First Item
    } else if (liI == 0) {
        return null;
    //Somewhere in the middle
    } else {
        var lo = this.Get(pItem);
        //Existing item
        if (lo && lo.DelimiterEntry) return lo.DelimiterEntry;
        //New item
        loE = this.GetPrevious(pItem);
    }
    if (loE && loE.DelimiterEntry && this.CompareDelimiter(pItem, loE.Item) == 0) return loE.DelimiterEntry;
    return null;
};

COCOS.Cmn.Utility.UIList.CList.prototype.Add = function (pItem) {
    var loE = this.Get(pItem);
    if (!loE) {
        var liI = this.GetIndex(pItem);
        loE = new COCOS.Cmn.Utility.UIList.CEntry(pItem);
        loE.ItemDOM = this.GenerateDOM(loE.Item);
        //Last Item
        if (liI == null) {
            this.Entries.push(loE);
        //First Item or somewhere in the middle
        } else {
            this.Entries.splice(liI, 0, loE);
        }
        loPE = this.GetPrevious(pItem);
        if (loPE && loPE.ItemDOM) {
            loE.ItemDOM = $(loE.ItemDOM).insertAfter(loPE.ItemDOM);
        } else {
            loE.ItemDOM = $(loE.ItemDOM).appendTo(this.Holder);
        }
    }
    if (!loE.DelimiterEntry) {
        var loDE = this.GetDelimiter(pItem);
        if (loDE) {
            loE.DelimiterEntry = loDE;
        } else {
            loDE = new COCOS.Cmn.Utility.UIList.CEntry(null, COCOS.Cmn.Utility.UIList.Types.Delimiter);
            loDE.ItemDOM = this.GenerateDelimiterDOM(loE.Item);
            loE.DelimiterEntry = loDE;
            if (loE && loE.ItemDOM) {
                loDE.ItemDOM = $(loDE.ItemDOM).insertBefore(loE.ItemDOM);
            } else {
                loDE.ItemDOM = $(loDE.ItemDOM).appendTo(this.Holder);
            }
        }
    }
}

COCOS.Cmn.Utility.UIList.CList.prototype.GetIndex = function (pItem) {
    for (var li = this.Entries.length; li > 0; li--) {
        var liI = li - 1;
        if (this.Entries[liI].Type == COCOS.Cmn.Utility.UIList.Types.Item) {
            var liCompare = this.Compare(pItem, this.Entries[liI].Item);
            if (liCompare == 0) {
                return liI;
            } else if (liCompare == 1) {
                return (li == this.Entries.length ? null : liI + 1);
            }
        }
    }
    return 0;
}

COCOS.Cmn.Utility.UIList.CList.prototype.GetPrevious = function (pItem) {
    var liStart = this.Entries.length;
    var liI = this.GetIndex(pItem);
    if (liI == 0) return null; //First Item in list
    if (liI != null) liStart = liI;
    for (var li = liStart; li > 0; li--) {
        if (this.Entries[li - 1].Type == COCOS.Cmn.Utility.UIList.Types.Item) {
            return this.Entries[li - 1];
        }
    }
    return null; //First Item in list
};

COCOS.Cmn.Utility.UIList.CList.prototype.GetNext = function (pItem) {
};

COCOS.Cmn.Utility.UIList.CList.prototype.GetLast = function () {
    for (var li = this.Entries.length; li > 0; li--) {
        var liI = li - 1;
        if (this.Entries[liI].Type == COCOS.Cmn.Utility.UIList.Types.Item) {
            return this.Entries[liI].Item;
        }
    }
    return null;
}


// *************************************************************************************************************/
//                      Logging
// *************************************************************************************************************/

COCOS.Cmn.Utility.showAlert = false;
/**
* @param {string} source  The source where the logging data is comming from
* @param {string} data  Data to be displayed
* @param {string} showAlert  Alerts can be enabled
*/
COCOS.Cmn.Utility.ConsoleLogger = function(source, data, showAlert) {
    var date = new Date();
    var formattedDate =
        COCOS.Cmn.Utility.padWithZeroes(date.getHours(), 2) + ":" +
        COCOS.Cmn.Utility.padWithZeroes(date.getMinutes(), 2) + ":" +
        COCOS.Cmn.Utility.padWithZeroes(date.getSeconds(), 2) + "." +
        COCOS.Cmn.Utility.padWithZeroes(date.getMilliseconds(), 3);

    if (window.console) {
        //console.log(formattedDate + " " + source + " - \r\n" + data);
    }

    if (((showAlert != undefined) && (showAlert)) || COCOS.Cmn.Utility.showAlert)
          alert(source + "\n" + data);
};

// -------------------------------------------------------------------------------------------/
// ===================================== Logger ===============================================
// -------------------------------------------------------------------------------------------/
var newLine = "\r\n";



// ---------------- Logging events ----------------
COCOS.Cmn.Utility.COCOSLogEvent = function(timeStamp, level, messages, exception) {
    this.timeStamp = timeStamp;
    this.level = level;
    this.messages = messages;
    this.exception = exception;
};

COCOS.Cmn.Utility.COCOSLogEvent.prototype = {
    getThrowableStrRep: function() {
        return this.exception ? getExceptionStringRep(this.exception) : "";
    },
    getCombinedMessages: function() {
        return (this.messages.length === 1) ? this.messages[0] : this.messages.join(newLine);
    }
};

// ---------------- Log Levels --------------
COCOS.Cmn.Utility.COCOSLogLevel = function(level, name) {
    this.level = level;
    this.name = name;
};

COCOS.Cmn.Utility.COCOSLogLevel.prototype = {
    toString: function() {
        return this.name;
    },
    equals: function(level) {
        return this.level == level.level;
    },
    isGreaterOrEqual: function(level) {
        return this.level >= level.level;
    }
};

COCOS.Cmn.Utility.COCOSLogLevel.ALL = new COCOS.Cmn.Utility.COCOSLogLevel(Number.MIN_VALUE, "ALL");
COCOS.Cmn.Utility.COCOSLogLevel.TRACE = new COCOS.Cmn.Utility.COCOSLogLevel(10000, "TRACE");
COCOS.Cmn.Utility.COCOSLogLevel.DEBUG = new COCOS.Cmn.Utility.COCOSLogLevel(20000, "DEBUG");
COCOS.Cmn.Utility.COCOSLogLevel.INFO = new COCOS.Cmn.Utility.COCOSLogLevel(30000, "INFO");
COCOS.Cmn.Utility.COCOSLogLevel.WARN = new COCOS.Cmn.Utility.COCOSLogLevel(40000, "WARN");
COCOS.Cmn.Utility.COCOSLogLevel.ERROR = new COCOS.Cmn.Utility.COCOSLogLevel(50000, "ERROR");
COCOS.Cmn.Utility.COCOSLogLevel.FATAL = new COCOS.Cmn.Utility.COCOSLogLevel(60000, "FATAL");
COCOS.Cmn.Utility.COCOSLogLevel.OFF = new COCOS.Cmn.Utility.COCOSLogLevel(Number.MAX_VALUE, "OFF");


COCOS.Cmn.Utility.COCOSLogger = function() {
    var logger = this;
    logger.eventQueue = [];
    logger.initialized = false;
    if (typeof console === "undefined" || typeof console.log === "undefined") {
        console = {};
        console.log = function(mess) {
            // last ditch loging uncomment this
            //    alert(mess)
        };
    }
    logger.initialized = true;
    logger.flushEventQueue();
};

// Main function for logging
COCOS.Cmn.Utility.COCOSLogger.prototype.log = function(level, params) {

    var exception;
    var finalParamIndex = params.length - 1;
    var lastParam = params[params.length - 1];
    if (params.length > 1 && isError(lastParam)) {
        exception = lastParam;
        finalParamIndex--;
    }

    var messages = [];
    for (var i = 0; i <= finalParamIndex; i++) {
        messages[i] = params[i];
    }

    var loggingEvent = new  COCOS.Cmn.Utility.COCOSLogEvent(new Date(), level , messages, exception);
    this.eventQueue.push(loggingEvent);

    this.flushEventQueue();
};

COCOS.Cmn.Utility.COCOSLogger.prototype.flushEventQueue = function() {
    if(this.initialized) {
        var logger = this;
        if (typeof $ != 'undefined') {
            $.each(this.eventQueue, function(idx, event) {
                COCOS.Cmn.Utility.COCOSEvents.trigger(logger, "log", event);
            });
        }
        this.eventQueue = [];
    }
};

COCOS.Cmn.Utility.COCOSLogger.prototype.debug = function() {
    this.log(COCOS.Cmn.Utility.COCOSLogLevel.DEBUG, arguments);
};

COCOS.Cmn.Utility.COCOSLogger.prototype.info = function() {
    this.log(COCOS.Cmn.Utility.COCOSLogLevel.INFO, arguments);
};

COCOS.Cmn.Utility.COCOSLogger.prototype.warn = function() {
    this.log(COCOS.Cmn.Utility.COCOSLogLevel.WARN, arguments);
};

COCOS.Cmn.Utility.COCOSLogger.prototype.error = function() {
    this.log(COCOS.Cmn.Utility.COCOSLogLevel.ERROR, arguments);
};

// ---------------- Utils for loggger --------------
function getExceptionMessage(ex) {
    if (ex.message) {
        return ex.message;
    } else if (ex.description) {
        return ex.description;
    } else {
        return toStr(ex);
    }
}

// Gets the portion of the URL after the last slash
function getUrlFileName(url) {
    var lastSlashIndex = Math.max(url.lastIndexOf("/"), url.lastIndexOf("\\"));
    return url.substr(lastSlashIndex + 1);
}

//Pars Domain from username
COCOS.Cmn.Utility.GetDomainFromUserN = function (userName) {
    var indSt = userName.indexOf("@");
    if (indSt > -1) {
        indSt = indSt + 1;
        return userName.substring(indSt, userName.length);
    }
    else
        return userName;
}

function getUrlFileName(url) {
    var lastSlashIndex = Math.max(url.lastIndexOf("/"), url.lastIndexOf("\\"));
    return url.substr(lastSlashIndex + 1);
}


// Returns a nicely formatted representation of an error
function getExceptionStringRep(ex) {
    if (ex) {
        var exStr = "Exception: " + getExceptionMessage(ex);
        try {
            if (ex.lineNumber) {
                exStr += " on line number " + ex.lineNumber;
            }
            if (ex.fileName) {
                exStr += " in file " + getUrlFileName(ex.fileName);
            }
        } catch (localEx) {
        }
        if (showStackTraces && ex.stack) {
            exStr += newLine + "Stack trace:" + newLine + ex.stack;
        }
        return exStr;
    }
    return null;
}

function isError(err) {
    return (err instanceof Error);
}

function bool(obj) {
    return Boolean(obj);
}


//String function!!
// insert
String.prototype.insert = function (index, string) {
    if (index > 0)
        return this.substring(0, index) + string + this.substring(index, this.length);
    else
        return string + this;
};

// Create logger instance
COCOS.Cmn.Utility.Logger = new COCOS.Cmn.Utility.COCOSLogger();

// -------------------------------------------------------------------------------------------/
// ================================ End logger ================================================
// -------------------------------------------------------------------------------------------/

// -------------------------------------------------------------------------------------------/
// ================================ COCOS_Phone Events ===========================================
// -------------------------------------------------------------------------------------------/
COCOS.Cmn.Utility.COCOSEvents = {
   handlerCount: 1,
   add: function(target, type, handler) {
      // ignore case
      type = type.toLowerCase();
        // assign each event handler a unique ID
        if (!handler.$$guid) handler.$$guid = this.handlerCount++;
        // create a hash table of event types for the target
        if (!target.events) target.events = {};
        // create a hash table of event handlers for each target/event pair
        var handlers = target.events[type];
        if (!handlers) {
            handlers = target.events[type] = {};
            // store the existing event handler (if there is one)
            if (target["on" + type]) {
                handlers[0] = target["on" + type];
            }
        }
        // store the event handler in the hash table
        handlers[handler.$$guid] = handler;
        // assign a global event handler to do all the work
        target["on" + type] = this.handle;
   },
   bind: function(target, config) {
      var name;
      for (var evnt in config) {
        // Bind custom events
        if(evnt.match("^on")) {
            this.add(target, evnt.substr(2).toLowerCase(), config[evnt]);
        }

        // Bind Response events
        if(evnt.match("Response"+"$")) {
            this.addResponseHandler(target, evnt.substr(0,evnt.length -"Response".length).toLowerCase(),
                config[evnt]);
        }

        // Bind next event reponse event
        if(evnt.match("Event"+"$")) {
            this.addEventResponseHandler(target, evnt.substr(0,evnt.length -"Event".length).toLowerCase(),
                config[evnt]);
        }
      }
   },
   remove: function(target, type, handler) {
      // ignore case
      type = type.toLowerCase();
        // delete the event handler from the hash table
        if (target.events && target.events[type]) {
            delete target.events[type][handler.$$guid];
        }
   },
   trigger: function(target, type, event, data) {
      event = event || {};
      event.type = type;
      var handler = target["on"+type.toLowerCase()];
      if(handler) {
         // Don't log log events ;-)
         if("log" != type.toLowerCase()) {
             COCOS.Cmn.Utility.Logger.info("[EVENT] " + type + "[" + data + "]");
         }
         handler.call(target, event, data);
      }
   },
   handle: function(event, data) {
    // get a reference to the hash table of event handlers
    var handlers = this.events[event.type.toLowerCase()];
    // set event source
    event.source = this;
    // build arguments
    var args = [];
    args.push(event);
    if(data) {
       var i;
       for(i=0; i<data.length; i++) {
          args.push(data[i]);
       }
    }
    var target = this;
    // execute each event handler
    $.each(handlers, function() {
         this.apply(target,args);
    });
   }
};

// Register Loggign Callback
COCOS.Cmn.Utility.COCOSEvents.add(COCOS.Cmn.Utility.Logger, "log", function(event) {
  var date = event.timeStamp;
  var formattedDate =
        COCOS.Cmn.Utility.padWithZeroes(date.getHours(), 2) + ":" +
        COCOS.Cmn.Utility.padWithZeroes(date.getMinutes(), 2) + ":" +
        COCOS.Cmn.Utility.padWithZeroes(date.getSeconds(), 2) + "." +
        COCOS.Cmn.Utility.padWithZeroes(date.getMilliseconds(), 3);
  var formattedMessage = formattedDate + " " + COCOS.Cmn.Utility.padWithSpaces(event.level.name, 5) + " - " + event.getCombinedMessages();
  var throwableStringRep = event.getThrowableStrRep();
  if (throwableStringRep) {
    formattedMessage += newLine + throwableStringRep;
  }
  if (formattedMessage.indexOf('PresenceMonitorStart') > -1) {
      var ll = '';
  }
  console.log(formattedMessage);
});
// -------------------------------------------------------------------------------------------/
// ================================ End COCOS_Phone Events ====================================
// -------------------------------------------------------------------------------------------/

// *************************************************************************************************************/
//                      Internet Explorer versions
// *************************************************************************************************************/

COCOS.Cmn.Utility.GetInternetExplorerVersion = function()
    // Returns the version of Internet Explorer or a -1
    // (indicating the use of another browser).
{
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
    }
    return rv;
}

COCOS.Cmn.Utility.FindById = function(source, id)
{
    for (var i = 0; i < source.length; i++) {
        if (source[i].id === id) {
            return source[i];
        }
    }
    return null;
}



COCOS.Cmn.Utility.CheckVersion = function() {
    var msg = "You're not using Internet Explorer.";
    var ver = getInternetExplorerVersion();

    if (ver > -1) {
        if (ver >= 8.0)
            msg = "You're using a recent copy of Internet Explorer."
        else
            msg = "You should upgrade your copy of Internet Explorer.";
    }
    alert(msg);
}