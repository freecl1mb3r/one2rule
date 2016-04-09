/*****************************************************************
*
*  Namespaces
*
*****************************************************************/
var COCOS = COCOS || {};
COCOS.Cmn = COCOS.Cmn || {};
COCOS.Cmn.Time = COCOS.Cmn.Time || {};


/*****************************************************************
*
*  Variables
*
*****************************************************************/
COCOS.Cmn.Time.cSecond = 1000; //in ms
COCOS.Cmn.Time.cMinute = 60 * 1000; //in ms
COCOS.Cmn.Time.cHour = 60 * 60 * 1000; //in ms
COCOS.Cmn.Time.cDay = 24 * 60 * 60 * 1000; //in ms
COCOS.Cmn.Time.cWeek = 7 * 24 * 60 * 60 * 1000; //in ms


/*****************************************************************
*
*  Variables
*
*****************************************************************/
COCOS.Cmn.Time.DefaultTimeZone = null;

COCOS.Cmn.Time.DST = {
    Enabled: false,
    Offset: 0 // minutes
};
COCOS.Cmn.Time.TimeZone = null;
COCOS.Cmn.Time.DateFormat = null;
COCOS.Cmn.Time.TimeFormat = '24';
COCOS.Cmn.Time.DateDelimiter = '/';

COCOS.Cmn.Time.BrowserTimeOffset = 0; //minutes


/*****************************************************************
*
*  Methods
*
*****************************************************************/
COCOS.Cmn.Time.Format = function (date, format) //author: meizz
{
    var o = {
        "M+": date.getMonth() + 1, //month
        "d+": date.getDate(), //day
        "h+": date.getHours(), //hour
        "m+": date.getMinutes(), //minute
        "s+": date.getSeconds(), //second
        "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
        "S": date.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1,
        (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};


//UTC to local date
COCOS.Cmn.Time.utcToLocal = function (utcDateString)
{
    var dateStr = utcDateString; //returned from mysql timestamp/datetime field
    var a = dateStr.split(" ");
    var d = a[0].split("-");
    var t = a[1].split(":");
    var date = new Date(d[0], (d[1] - 1), d[2], t[0], t[1], t[2]);
    //return date;
    return this.convertUTCDateToLocalDate(date);
}


COCOS.Cmn.Time.convertUTCDateToLocalDate = function(date) {
    var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();
    newDate.setHours(hours - offset);
    return newDate;
}


/*
COCOS.Cmn.Time.toHHMMSS = function (time) {
    var sec_num = parseInt(time, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    var time = hours + ':' + minutes + ':' + seconds;
    return time;
};*/

COCOS.Cmn.Time.Reload = function () {
    $('#date-time-format').html(COCOS.Cmn.Time.DateFormat.displayName.replace('yyyy',(new Date()).getFullYear()).replace(/\//g, COCOS.Cmn.Time.DateDelimiter));
    $("input[name='date-delimiter'][value='" + COCOS.Cmn.Time.DateDelimiter + "']").attr('checked', 'checked');
    $("input[name='time-format'][value='" + COCOS.Cmn.Time.TimeFormat + "']").attr('checked', 'checked');
    $('#time-zone').html(COCOS.Cmn.Time.TimeZone.displayName);

    if ($('#daylight-saving-time-switch').length > 0) {
        if (COCOS.Cmn.Time.DST.Enabled) {
            $('#daylight-saving-time-switch').bootstrapSwitch('setState', true);
        } else {
            $('#daylight-saving-time-switch').bootstrapSwitch('setState', false);
        }
    }
    $('#daylight-saving-time-offset').val(COCOS.Cmn.Time.DST.Offset);
    $('#daylight-saving-time').html((COCOS.Cmn.Time.DST.Enabled ? 'Enabled.' : 'Disabled.'));
    COCOS.Cmn.Time.PopulateDateDelimiterList();
    $('#status-date-time-zone').html(COCOS.Cmn.Time.TimeZone.displayName.split(' ')[0] + (COCOS.Cmn.Time.DST.Enabled ? '+DST' : ''));
}

COCOS.Cmn.Time.DateFormatListItemDOM = function (pItem) {
    if (!pItem || !pItem.format) return null;
    var loItm = document.createElement('li');
    $(loItm).html(pItem.displayName.replace('yyyy',(new Date()).getFullYear()).replace(/\//g, COCOS.Cmn.Time.DateDelimiter));
    $(loItm).click((function (pI) {
        return function () {
            COCOS.Cmn.Time.SetDateFormat(pI.format);
            $($("a[value='#page-advanced-date-time']")[0]).click();
        }
    })(pItem));
    return loItm;
}

COCOS.Cmn.Time.PopulateDateFormatList = function () {
    $('#date-time-format-selector').html('');
    for (var li = 0; li < COCOS.Cmn.Time.ListOfDateFormats.length; li++) {
        $('#date-time-format-selector').append(COCOS.Cmn.Time.DateFormatListItemDOM(COCOS.Cmn.Time.ListOfDateFormats[li]));
    }
}




COCOS.Cmn.Time.PopulateDateDelimiterList = function () {
    var lsD = COCOS.Cmn.Time.DateFormat.displayName.replace('yyyy',(new Date()).getFullYear());
    $('#date-delimiter-slash-label').html('&nbsp;' + lsD + '&nbsp;');
    $('#date-delimiter-dot-label').html('&nbsp;' + lsD.replace(/\//g, '.') + '&nbsp;');
    $('#date-delimiter-minus-label').html('&nbsp;' + lsD.replace(/\//g, '-') + '&nbsp;');
}

COCOS.Cmn.Time.TimeZoneListItemDOM = function (pItem) {
    if (!pItem || !pItem.id) return null;
    var loItm = document.createElement('li');
    $(loItm).html(pItem.name + '<br/><small>' + pItem.displayName + '</small>');
    $(loItm).click((function (pI) {
        return function () {
            COCOS.Cmn.Time.SetTimeZone(pI.id);
            $($("a[value='#page-advanced-date-time']")[0]).click();
        }
    })(pItem));
    return loItm;
}

COCOS.Cmn.Time.PopulateTimeZoneList = function () {
    $('#time-zone-selector').html('');
    for (var li = 0; li < COCOS.Cmn.Time.ListOfTimeZones.length; li++) {
        $('#time-zone-selector').append(COCOS.Cmn.Time.TimeZoneListItemDOM(COCOS.Cmn.Time.ListOfTimeZones[li]));
    }
}

COCOS.Cmn.Time.DateFormatReadCookies = function () {
    var lsF = COCOS.Cmn.Utility.Cookies.GetItem('DateFormat');
    if (!lsF || !COCOS.Cmn.Time.GetDateFormat(lsF)) return false;
    COCOS.Cmn.Time.DateFormat = COCOS.Cmn.Time.GetDateFormat(lsF);
    return true;
}

COCOS.Cmn.Time.DateDelimiterReadCookies = function () {
    var lsD = COCOS.Cmn.Utility.Cookies.GetItem('DateDelimit');
    if (!lsD) return false;
    COCOS.Cmn.Time.DateDelimiter = lsD;
    return true;
}

COCOS.Cmn.Time.TimeFormatReadCookies = function () {
    var lsF = COCOS.Cmn.Utility.Cookies.GetItem('TimeFormat');
    if (!lsF) return false;
    COCOS.Cmn.Time.TimeFormat = lsF;
    return true;
}

COCOS.Cmn.Time.DSTReadCookies = function () {
    var loDST = {
        Enabled: COCOS.Cmn.Utility.Cookies.GetItem('DSTEnabled'),
        Offset: COCOS.Cmn.Utility.Cookies.GetItem('DSTOffset')
    }
    if (loDST.Enabled == null || loDST.Enabled == '' || loDST.Offset == null) return false;
    COCOS.Cmn.Time.DST.Enabled = (loDST.Enabled == 'true' ? true : false);
    COCOS.Cmn.Time.DST.Offset = (loDST.Offset ? loDST.Offset : 0);
}

COCOS.Cmn.Time.TimeZoneReadCookies = function () {
    var lsTZ = COCOS.Cmn.Utility.Cookies.GetItem('TimeZone');
    if (!lsTZ || !COCOS.Cmn.Time.GetTimeZone(lsTZ)) return false;
    COCOS.Cmn.Time.TimeZone = COCOS.Cmn.Time.GetTimeZone(lsTZ);
    return true;
}

COCOS.Cmn.Time.GetDateFormat = function (pFormat) {
    if (typeof pFormat == 'undefined' || pFormat == null || pFormat == '') return null;
    for (var li = 0; li < COCOS.Cmn.Time.ListOfDateFormats.length; li++) {
        if (pFormat == COCOS.Cmn.Time.ListOfDateFormats[li].format) return COCOS.Cmn.Time.ListOfDateFormats[li];
    }
    return null;
}

COCOS.Cmn.Time.GetTimeZone = function (pId) {
    if (typeof pId == 'undefined' || pId == null || pId == '') return null;
    for (var li = 0; li < COCOS.Cmn.Time.ListOfTimeZones.length; li++) {
        if (pId == COCOS.Cmn.Time.ListOfTimeZones[li].id) return COCOS.Cmn.Time.ListOfTimeZones[li];
    }
    return null;
}

COCOS.Cmn.Time.GetTimeZoneByOlsen = function (pOlsen) {
    if (typeof pOlsen == 'undefined' || pOlsen == null || pOlsen == '') return null;
    var lsO = pOlsen.split('/');
    if (lsO.length < 2)  return null;
    lsO = lsO[1];
    for (var li = 0; li < COCOS.Cmn.Time.ListOfTimeZones.length; li++) {
        if (COCOS.Cmn.Time.ListOfTimeZones[li].displayName.toLowerCase().indexOf(lsO.toLowerCase()) != -1) return COCOS.Cmn.Time.ListOfTimeZones[li];
    }
    return null;
}

COCOS.Cmn.Time.SetDateDelimiter = function (pDelimiter) {
    if (!pDelimiter) return false;
    COCOS.Cmn.Time.DateDelimiter = pDelimiter;
    var ld = new Date();
    ld.setTime(ld.getTime() + COCOS.CPhone.Preferences.cookieExpiration * 24 * 60 * 60 * 1000);
    COCOS.Cmn.Time.Reload();
    COCOS.Cmn.Time.PopulateDateFormatList();
    return COCOS.Cmn.Utility.Cookies.SetItem('DateDelimit', pDelimiter, ld);
}

COCOS.Cmn.Time.SetDateFormat = function(pFormat) {
    var loF = COCOS.Cmn.Time.GetDateFormat(pFormat);
    if (!loF) return false;
    COCOS.Cmn.Time.DateFormat = loF;
    var ld = new Date();
    ld.setTime(ld.getTime() + COCOS.CPhone.Preferences.cookieExpiration * 24 * 60 * 60 * 1000);
    COCOS.Cmn.Time.Reload();
    return COCOS.Cmn.Utility.Cookies.SetItem('DateFormat', pFormat, ld);
};

COCOS.Cmn.Time.SetTimeFormat = function(pFormat) {
    if (!pFormat) return false;
    COCOS.Cmn.Time.TimeFormat = pFormat;
    var ld = new Date();
    ld.setTime(ld.getTime() + COCOS.CPhone.Preferences.cookieExpiration * 24 * 60 * 60 * 1000);
    COCOS.Cmn.Time.Reload();
    return COCOS.Cmn.Utility.Cookies.SetItem('TimeFormat', pFormat, ld);
};

COCOS.Cmn.Time.SetDST = function(pEnabled, pOffset) {
    if ((typeof pEnabled == 'undefined' || pEnabled == null)
        && (typeof pOffset == 'undefined' || pOffset == null)) return false;
    if (typeof pEnabled != 'undefined' && pEnabled != null) COCOS.Cmn.Time.DST.Enabled = pEnabled;
    if (typeof pOffset != 'undefined' && pOffset != null) COCOS.Cmn.Time.DST.Offset = pOffset;
    var ld = new Date();
    ld.setTime(ld.getTime() + COCOS.CPhone.Preferences.cookieExpiration * 24 * 60 * 60 * 1000);
    if (typeof pEnabled != 'undefined' && pEnabled != null) COCOS.Cmn.Utility.Cookies.SetItem('DSTEnabled', COCOS.Cmn.Time.DST.Enabled.toString(), ld);
    if (typeof pOffset != 'undefined' && pOffset != null) COCOS.Cmn.Utility.Cookies.SetItem('DSTOffset', COCOS.Cmn.Time.DST.Offset.toString(), ld);
    return true;
};

COCOS.Cmn.Time.SetTimeZone = function(pId) {
    var loTZ = COCOS.Cmn.Time.GetTimeZone(pId);
    if (!loTZ) return false;
    if (loTZ == COCOS.Cmn.Time.GetTimeZone('Auto Detect')) {
        var tz = jstz.determine(); // Determines the time zone of the browser client
        loTZ = COCOS.Cmn.Time.GetTimeZoneByOlsen(tz.name());
        if (!loTZ) return false;
    }
    COCOS.Cmn.Time.TimeZone = loTZ;
    var ld = new Date();
    ld.setTime(ld.getTime() + COCOS.CPhone.Preferences.cookieExpiration * 24 * 60 * 60 * 1000);
    COCOS.Cmn.Time.Reload();
    return COCOS.Cmn.Utility.Cookies.SetItem('TimeZone', COCOS.Cmn.Time.TimeZone.id, ld);
};

COCOS.Cmn.Time.GetDateFormatString = function() {
    return COCOS.Cmn.Time.DateFormat.displayName.replace('31', 'dd').replace('12', 'MM').replace(/\//g, COCOS.Cmn.Time.DateDelimiter)
};

COCOS.Cmn.Time.GetTimeFormatString = function (pShowSeconds) {
    return (COCOS.Cmn.Time.TimeFormat == '12' ? 'hh' : 'HH') + ':mm' + (pShowSeconds ? ':ss' : '');
}

COCOS.Cmn.Time.Replace = function (pString, pFrom, pTo, pMask) {
    if (pMask) {
        var lsString = pString;
        var lsMask = pMask.replace(pFrom, COCOS.Cmn.Utility.padCustom('#', pFrom.length));
        if (lsMask != pMask) {
            for (var li = 0; li < pMask.length; li++) {
                if (lsMask[li] != pMask[li]) {
                    lsString = pString.replaceAt(li, pFrom, pTo.toString());
                    break;
                }
            }
        }
        return {mask: pMask.replace(pFrom, COCOS.Cmn.Utility.padCustom('#', pTo.toString().length)), string: lsString};
    } else {
        return pString.replace(pFrom, pTo);
    }
}


/*****************************************************************
*
*  Date & Time Methods
*
*****************************************************************/
Date.prototype.C_ToUTC = function () {
    var lr = new Date(this.getTime());
    lr.setTime(this.getTime() + this.getTimezoneOffset() * COCOS.Cmn.Time.cMinute);
    return lr;
}

Date.prototype.C_LocalToUTC = function () {
    var lr = new Date(this.getTime());
    //if (COCOS.Cmn.Time.TimeZone) lr.setTime(this.getTime() - COCOS.Cmn.Time.TimeZone.offset * COCOS.Cmn.Time.cHour - (COCOS.Cmn.Time.DST.Enabled ? COCOS.Cmn.Time.DST.Offset * COCOS.Cmn.Time.cMinute : 0));
    lr.setTime(this.getTime() + this.getTimezoneOffset() * COCOS.Cmn.Time.cMinute);
    return lr;
}

Date.prototype.C_UTCToLocal = function () {
    var lr = new Date(this.getTime());
    //if (COCOS.Cmn.Time.TimeZone) lr.setTime(this.getTime() + COCOS.Cmn.Time.TimeZone.offset * COCOS.Cmn.Time.cHour + (COCOS.Cmn.Time.DST.Enabled ? COCOS.Cmn.Time.DST.Offset * COCOS.Cmn.Time.cMinute : 0));
    lr.setTime(this.getTime() - this.getTimezoneOffset() * COCOS.Cmn.Time.cMinute);
    return lr;
}

Date.prototype.C_TimeZoneToUTC = function (pTimeZone) {
    var lr = new Date(this.getTime());
    if (pTimeZone) {
        var loTZ = COCOS.Cmn.Time.GetTimeZone(pTimeZone)
        if (loTZ) lr.setTime(this.getTime() - loTZ.offset * COCOS.Cmn.Time.cHour - (COCOS.Cmn.Time.DST.Enabled ? COCOS.Cmn.Time.DST.Offset * COCOS.Cmn.Time.cMinute : 0));
    }
    return lr;
}

Date.prototype.C_UTCToTimeZone = function (pTimeZone) {
    var lr = new Date(this.getTime());
    if (pTimeZone) {
        var loTZ = COCOS.Cmn.Time.GetTimeZone(pTimeZone)
        if (loTZ) lr.setTime(this.getTime() + loTZ.offset * COCOS.Cmn.Time.cHour + (COCOS.Cmn.Time.DST.Enabled ? COCOS.Cmn.Time.DST.Offset * COCOS.Cmn.Time.cMinute : 0));
    }
    return lr;
}

Date.prototype.C_LocalToTimeZone = function (pTimeZone) {
    var lr = this.C_LocalToUTC().C_UTCToTimeZone(pTimeZone);
    return lr;
}

Date.prototype.C_TimeZoneToLocal = function (pTimeZone) {
    var lr = this.C_TimeZoneToUTC(pTimeZone).C_UTCToLocal();
    return lr;
}

Date.prototype.C_ToString = function (pFormat, pMonths, pDays) { 
    var loR = {mask: pFormat, string: pFormat};
    //var lsR = pFormat;
    var yyyy,yy,MMMM,MMM,MM,M,dddd,ddd,dd,d,hh,h,HH,H,mm,m,ss,s,ap,dMod,th;
    yy = ((yyyy=this.getFullYear())+"").substr(2,2);
    MM = (M=this.getMonth()+1)<10?('0'+M):M;
    MMM = (MMMM=(pMonths ? pMonths : ['January','February','March','April','May','June','July','August','September','October','November','December'])[M-1]).substr(0,3);
    dd = (d=this.getDate())<10?('0'+d):d;
    ddd = (dddd=(pDays ? pDays : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'])[this.getDay()]).substr(0,3);
    th=(d>=10&&d<=20)?'th':((dMod=d%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
    //lsR = lsR.replace('yyyy',yyyy).replace('yy',yy).replace('MMMM',MMMM).replace('MMM',MMM).replace('MM',MM).replace('M',M).replace('dddd',dddd).replace('ddd',ddd).replace('dd',dd).replace('d',d).replace('th',th);
    loR = COCOS.Cmn.Time.Replace(loR.string, 'yyyy', yyyy, loR.mask);
    loR = COCOS.Cmn.Time.Replace(loR.string, 'yy', yy, loR.mask);
    loR = COCOS.Cmn.Time.Replace(loR.string, 'MMMM', MMMM, loR.mask);
    loR = COCOS.Cmn.Time.Replace(loR.string, 'MMM', MMM, loR.mask);
    loR = COCOS.Cmn.Time.Replace(loR.string, 'MM', MM, loR.mask);
    loR = COCOS.Cmn.Time.Replace(loR.string, 'M', M, loR.mask);
    loR = COCOS.Cmn.Time.Replace(loR.string, 'dddd', dddd, loR.mask);
    loR = COCOS.Cmn.Time.Replace(loR.string, 'ddd', ddd, loR.mask);
    loR = COCOS.Cmn.Time.Replace(loR.string, 'dd', dd, loR.mask);
    loR = COCOS.Cmn.Time.Replace(loR.string, 'd', d, loR.mask);

    h=this.getHours();
    H=this.getHours();
    if (h==0) h=24;
    ap=h<12?'AM':'PM';
    if (h>12) h-=12;
    hh = h<10?('0'+h):h;
    HH = H<10?('0'+H):H;
    mm=(m=this.getMinutes())<10?('0'+m):m;
    ss=(s=this.getSeconds())<10?('0'+s):s;
    var lb=(loR.string.indexOf('h')>-1);
    //return lsR.replace('hh',hh).replace('h',h).replace('HH',HH).replace('H',H).replace('mm',mm).replace('m',m).replace('ss',ss).replace('s',s).replace('ap','') + (lb ? ' ' + ap : '');
    loR = COCOS.Cmn.Time.Replace(loR.string, 'hh', hh, loR.mask);
    loR = COCOS.Cmn.Time.Replace(loR.string, 'h', h, loR.mask);
    loR = COCOS.Cmn.Time.Replace(loR.string, 'HH', HH, loR.mask);
    loR = COCOS.Cmn.Time.Replace(loR.string, 'H', H, loR.mask);
    loR = COCOS.Cmn.Time.Replace(loR.string, 'mm', mm, loR.mask);
    loR = COCOS.Cmn.Time.Replace(loR.string, 'm', m, loR.mask);
    loR = COCOS.Cmn.Time.Replace(loR.string, 'ss', ss, loR.mask);
    loR = COCOS.Cmn.Time.Replace(loR.string, 's', s, loR.mask);
    return loR.string.replace('ap','') + (lb ? ' ' + ap : '');
}

Date.prototype.C_ToStringL = function (pShowSeconds) { 
    var lsDFormat = COCOS.Cmn.Time.GetDateFormatString();
    var lsTFormat = COCOS.Cmn.Time.GetTimeFormatString(pShowSeconds);
    return this.C_ToString(lsDFormat + ' ' + lsTFormat);
}

Date.prototype.C_FromStringL = function (pSting, pFormat) { 
    var lsF = (pFormat ? pFormat : COCOS.Cmn.Time.GetDateFormatString() + ' ' + COCOS.Cmn.Time.GetTimeFormatString());
    this.C_FromStringCoreL(pSting, lsF);
}

Date.prototype.C_FromStringCoreL = function (pSting, pFormat) { 
    var lsFormat = pFormat;
    var laMMMM = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var laMMM = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var ladddd = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var laddd = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    var yyyy,yy,MMMM,MMM,MM,M,dddd,ddd,dd,d,hh,h,HH,H,mm,m,ss,s,ap,dMod,th;

    yyyy = COCOS.Cmn.Time.GetPart('yyyy', pSting, lsFormat);
    if (!yyyy) yy = COCOS.Cmn.Time.GetPart('yy', pSting, lsFormat);
    MMMM = COCOS.Cmn.Time.GetPart('MMMM', pSting, lsFormat);
    if (!MMMM) MMM = COCOS.Cmn.Time.GetPart('MMM', pSting, lsFormat, ['MMMM']);
    else {
        M = COCOS.Cmn.Time.GetArrayIndex(MMMM, laMMMM);
    }
    if (!MMMM && !MMM) MM = COCOS.Cmn.Time.GetPart('MM', pSting, lsFormat, ['MMMM', 'MMM']);
    else if (MMM) {
        M = COCOS.Cmn.Time.GetArrayIndex(MMM, laMMM, lsFormat);
    }
    if (!MMMM && !MMM && !MM) M = COCOS.Cmn.Time.GetPart('M', pSting, lsFormat, ['MMMM', 'MMM', 'MM']);
    dddd = COCOS.Cmn.Time.GetPart('dddd', pSting, lsFormat);
    if (!dddd) ddd = COCOS.Cmn.Time.GetPart('ddd', pSting, pSting, lsFormat, ['dddd']);
    dd = COCOS.Cmn.Time.GetPart('dd', pSting, lsFormat, ['dddd', 'ddd']);
    if (!dd) d = COCOS.Cmn.Time.GetPart('d', pSting, lsFormat, ['dddd', 'ddd', 'dd']);
    hh = COCOS.Cmn.Time.GetPart('hh', pSting, lsFormat);
    if (!hh) h = COCOS.Cmn.Time.GetPart('h', pSting, lsFormat, ['hh']);
    HH = COCOS.Cmn.Time.GetPart('HH', pSting, lsFormat);
    if (!HH) H = COCOS.Cmn.Time.GetPart('H', pSting, lsFormat, ['HH']);
    mm = COCOS.Cmn.Time.GetPart('mm', pSting, lsFormat);
    if (!mm) m = COCOS.Cmn.Time.GetPart('m', pSting, lsFormat, ['mm']);
    ss = COCOS.Cmn.Time.GetPart('ss', pSting, lsFormat);
    if (!ss) s = COCOS.Cmn.Time.GetPart('s', pSting, lsFormat, ['ss']);
    ap = COCOS.Cmn.Time.GetPart('AM', pSting, lsFormat);
    if (!ap) ap = COCOS.Cmn.Time.GetPart('PM', pSting, lsFormat);
    if (ap && ap == 'PM') {
        if (hh) HH = parseInt(hh) + 12;
        if (h) H = parseInt(h) + 12;
    }
    this.setFullYear( (yyyy ? parseInt(yyyy) : 1900) );
    this.setMonth( (MM ? parseInt(MM)-1 : (M ? parseInt(M)-1 : 0)) );
    this.setDate( (dd ? parseInt(dd) : (d ? parseInt(d) : 1)) );
    this.setHours( (HH ? parseInt(HH) : (H ? parseInt(H) : 0)) );
    this.setMinutes( (mm ? parseInt(mm) : (m ? parseInt(m) : 0)) );
    this.setSeconds( (ss ? parseInt(ss) : 0) );
}


/*****************************************************************
*
*  Helper Methods
*
*****************************************************************/
COCOS.Cmn.Time.GetPart = function (pPart, pString, pFormat, pExclude) {
    if (pExclude) {
        for (var li = 0; li < pExclude.length; li++) {
            pFormat.replace(pExclude, COCOS.Cmn.Utility.Pad('', pExclude.length))
        }
    }
    var liI = pFormat.indexOf(pPart);
    if (liI == -1) return null;
    var liL = pPart.length;
    return pString.substring(liI, liI + liL);
}

COCOS.Cmn.Time.GetArrayIndex = function (pElement, pArray) {
    for (var li = 0; li < pArray.length; li++) {
        if (pArray[li] == pElement) return li;
    }
    return -1;
}


/*****************************************************************
*
*  Formats
*
*****************************************************************/
COCOS.Cmn.Time.ListOfDateFormats = [
    {format:"dd/MM/yyyy",displayName:"31/12/yyyy"},
    {format:"MM/dd/yyyy",displayName:"12/31/yyyy"},
    {format:"yyyy/MM/dd",displayName:"yyyy/12/31"},
];


/*****************************************************************
*
*  Time Zones List
*
*****************************************************************/
COCOS.Cmn.Time.ListOfTimeZones = [
    {id:"Auto Detect",offset:0,name:"Auto Detect Zone",displayName:"Auto Detect Zone",dst:true},
    {id:"Dateline Standard Time",offset:-12,name:"Dateline Standard Time",displayName:"(GMT-12:00) International Date Line West",dst:false},
    {id:"Samoa Standard Time",offset:-11,name:"Samoa Standard Time",displayName:"(GMT-11:00) Midway Island, Samoa",dst:false},
    {id:"Hawaiian Standard Time",offset:-10,name:"Hawaiian Standard Time",displayName:"(GMT-10:00) Hawaii",dst:false},
    {id:"Alaskan Standard Time",offset:-9,name:"Alaskan Standard Time",displayName:"(GMT-09:00) Alaska",dst:true},
    {id:"Pacific Standard Time (Mexico)",offset:-8,name:"Pacific Standard Time (Mexico)",displayName:"(GMT-08:00) Tijuana, Baja California",dst:true},
    {id:"Pacific Standard Time",offset:-8,name:"Pacific Standard Time",displayName:"(GMT-08:00) Pacific Time (US & Canada)",dst:true},
    {id:"Mountain Standard Time",offset:-7,name:"Mountain Standard Time",displayName:"(GMT-07:00) Mountain Time (US & Canada)",dst:true},
    {id:"Mountain Standard Time (Mexico)",offset:-7,name:"Mountain Standard Time (Mexico)",displayName:"(GMT-07:00) Chihuahua, La Paz, Mazatlan",dst:true},
    {id:"US Mountain Standard Time",offset:-7,name:"US Mountain Standard Time",displayName:"(GMT-07:00) Arizona",dst:false},
    {id:"Canada Central Standard Time",offset:-6,name:"Canada Central Standard Time",displayName:"(GMT-06:00) Saskatchewan",dst:false},
    {id:"Central Standard Time (Mexico)",offset:-6,name:"Central Standard Time (Mexico)",displayName:"(GMT-06:00) Guadalajara, Mexico City, Monterrey",dst:true},
    {id:"Central Standard Time",offset:-6,name:"Central Standard Time",displayName:"(GMT-06:00) Central Time (US & Canada)",dst:true},
    {id:"Central America Standard Time",offset:-6,name:"Central America Standard Time",displayName:"(GMT-06:00) Central America",dst:false},
    {id:"US Eastern Standard Time",offset:-5,name:"US Eastern Standard Time",displayName:"(GMT-05:00) Indiana (East)",dst:false},
    {id:"Eastern Standard Time",offset:-5,name:"Eastern Standard Time",displayName:"(GMT-05:00) Eastern Time (US & Canada)",dst:true},
    {id:"SA Pacific Standard Time",offset:-5,name:"SA Pacific Standard Time",displayName:"(GMT-05:00) Bogota, Lima, Quito, Rio Branco",dst:false},
    {id:"Venezuela Standard Time",offset:-4.5,name:"Venezuela Standard Time",displayName:"(GMT-04:30) Caracas",dst:false},
    {id:"Pacific SA Standard Time",offset:-4,name:"Pacific SA Standard Time",displayName:"(GMT-04:00) Santiago",dst:true},
    {id:"Central Brazilian Standard Time",offset:-4,name:"Central Brazilian Standard Time",displayName:"(GMT-04:00) Manaus",dst:true},
    {id:"SA Western Standard Time",offset:-4,name:"SA Western Standard Time",displayName:"(GMT-04:00) La Paz",dst:false},
    {id:"Atlantic Standard Time",offset:-4,name:"Atlantic Standard Time",displayName:"(GMT-04:00) Atlantic Time (Canada)",dst:true},
    {id:"Newfoundland Standard Time",offset:-3.5,name:"Newfoundland Standard Time",displayName:"(GMT-03:30) Newfoundland",dst:true},
    {id:"Montevideo Standard Time",offset:-3,name:"Montevideo Standard Time",displayName:"(GMT-03:00) Montevideo",dst:true},
    {id:"Greenland Standard Time",offset:-3,name:"Greenland Standard Time",displayName:"(GMT-03:00) Greenland",dst:true},
    {id:"SA Eastern Standard Time",offset:-3,name:"SA Eastern Standard Time",displayName:"(GMT-03:00) Georgetown",dst:false},
    {id:"Argentina Standard Time",offset:-3,name:"Argentina Standard Time",displayName:"(GMT-03:00) Buenos Aires",dst:true},
    {id:"E. South America Standard Time",offset:-3,name:"E. South America Standard Time",displayName:"(GMT-03:00) Brasilia",dst:true},
    {id:"Mid-Atlantic Standard Time",offset:-2,name:"Mid-Atlantic Standard Time",displayName:"(GMT-02:00) Mid-Atlantic",dst:true},
    {id:"Cape Verde Standard Time",offset:-1,name:"Cape Verde Standard Time",displayName:"(GMT-01:00) Cape Verde Is.",dst:false},
    {id:"Azores Standard Time",offset:-1,name:"Azores Standard Time",displayName:"(GMT-01:00) Azores",dst:true},
    {id:"Morocco Standard Time",offset:0,name:"Morocco Standard Time",displayName:"(GMT) Casablanca",dst:true},
    {id:"GMT Standard Time",offset:0,name:"GMT Standard Time",displayName:"(GMT) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London",dst:true},
    {id:"Greenwich Standard Time",offset:0,name:"Greenwich Standard Time",displayName:"(GMT) Monrovia, Reykjavik",dst:false},
    {id:"W. Europe Standard Time",offset:1,name:"W. Europe Standard Time",displayName:"(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna",dst:true},
    {id:"Central Europe Standard Time",offset:1,name:"Central Europe Standard Time",displayName:"(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague",dst:true},
    {id:"Romance Standard Time",offset:1,name:"Romance Standard Time",displayName:"(GMT+01:00) Brussels, Copenhagen, Madrid, Paris",dst:true},
    {id:"Central European Standard Time",offset:1,name:"Central European Standard Time",displayName:"(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb",dst:true},
    {id:"W. Central Africa Standard Time",offset:1,name:"W. Central Africa Standard Time",displayName:"(GMT+01:00) West Central Africa",dst:false},
    {id:"Jordan Standard Time",offset:2,name:"Jordan Standard Time",displayName:"(GMT+02:00) Amman",dst:true},
    {id:"GTB Standard Time",offset:2,name:"GTB Standard Time",displayName:"(GMT+02:00) Athens, Bucharest, Istanbul",dst:true},
    {id:"Middle East Standard Time",offset:2,name:"Middle East Standard Time",displayName:"(GMT+02:00) Beirut",dst:true},
    {id:"Egypt Standard Time",offset:2,name:"Egypt Standard Time",displayName:"(GMT+02:00) Cairo",dst:true},
    {id:"South Africa Standard Time",offset:2,name:"South Africa Standard Time",displayName:"(GMT+02:00) Harare, Pretoria",dst:false},
    {id:"FLE Standard Time",offset:2,name:"FLE Standard Time",displayName:"(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius",dst:true},
    {id:"Israel Standard Time",offset:2,name:"Jerusalem Standard Time",displayName:"(GMT+02:00) Jerusalem",dst:true},
    {id:"E. Europe Standard Time",offset:2,name:"E. Europe Standard Time",displayName:"(GMT+02:00) Minsk",dst:true},
    {id:"Namibia Standard Time",offset:2,name:"Namibia Standard Time",displayName:"(GMT+02:00) Windhoek",dst:true},
    {id:"Arabic Standard Time",offset:3,name:"Arabic Standard Time",displayName:"(GMT+03:00) Baghdad",dst:true},
    {id:"Arab Standard Time",offset:3,name:"Arab Standard Time",displayName:"(GMT+03:00) Kuwait, Riyadh",dst:false},
    {id:"Russian Standard Time",offset:3,name:"Russian Standard Time",displayName:"(GMT+03:00) Moscow, St. Petersburg, Volgograd",dst:true},
    {id:"E. Africa Standard Time",offset:3,name:"E. Africa Standard Time",displayName:"(GMT+03:00) Nairobi",dst:false},
    {id:"Georgian Standard Time",offset:3,name:"Georgian Standard Time",displayName:"(GMT+03:00) Tbilisi",dst:false},
    {id:"Iran Standard Time",offset:3.5,name:"Iran Standard Time",displayName:"(GMT+03:30) Tehran",dst:true},
    {id:"Arabian Standard Time",offset:4,name:"Arabian Standard Time",displayName:"(GMT+04:00) Abu Dhabi, Muscat",dst:false},
    {id:"Azerbaijan Standard Time",offset:4,name:"Azerbaijan Standard Time",displayName:"(GMT+04:00) Baku",dst:true},
    {id:"Mauritius Standard Time",offset:4,name:"Mauritius Standard Time",displayName:"(GMT+04:00) Port Louis",dst:true},
    {id:"Caucasus Standard Time",offset:4,name:"Caucasus Standard Time",displayName:"(GMT+04:00) Yerevan",dst:true},
    {id:"Afghanistan Standard Time",offset:4.5,name:"Afghanistan Standard Time",displayName:"(GMT+04:30) Kabul",dst:false},
    {id:"Ekaterinburg Standard Time",offset:5,name:"Ekaterinburg Standard Time",displayName:"(GMT+05:00) Ekaterinburg",dst:true},
    {id:"Pakistan Standard Time",offset:5,name:"Pakistan Standard Time",displayName:"(GMT+05:00) Islamabad, Karachi",dst:true},
    {id:"West Asia Standard Time",offset:5,name:"West Asia Standard Time",displayName:"(GMT+05:00) Tashkent",dst:false},
    {id:"India Standard Time",offset:5.5,name:"India Standard Time",displayName:"(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi",dst:false},
    {id:"Sri Lanka Standard Time",offset:5.5,name:"Sri Lanka Standard Time",displayName:"(GMT+05:30) Sri Jayawardenepura",dst:false},
    {id:"Nepal Standard Time",offset:5.75,name:"Nepal Standard Time",displayName:"(GMT+05:45) Kathmandu",dst:false},
    {id:"N. Central Asia Standard Time",offset:6,name:"N. Central Asia Standard Time",displayName:"(GMT+06:00) Almaty, Novosibirsk",dst:true},
    {id:"Central Asia Standard Time",offset:6,name:"Central Asia Standard Time",displayName:"(GMT+06:00) Astana, Dhaka",dst:false},
    {id:"Myanmar Standard Time",offset:6.5,name:"Myanmar Standard Time",displayName:"(GMT+06:30) Yangon (Rangoon)",dst:false},
    {id:"SE Asia Standard Time",offset:7,name:"SE Asia Standard Time",displayName:"(GMT+07:00) Bangkok, Hanoi, Jakarta",dst:false},
    {id:"North Asia Standard Time",offset:7,name:"North Asia Standard Time",displayName:"(GMT+07:00) Krasnoyarsk",dst:true},
    {id:"China Standard Time",offset:8,name:"China Standard Time",displayName:"(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi",dst:false},
    {id:"North Asia East Standard Time",offset:8,name:"North Asia East Standard Time",displayName:"(GMT+08:00) Irkutsk, Ulaan Bataar",dst:true},
    {id:"Singapore Standard Time",offset:8,name:"Malay Peninsula Standard Time",displayName:"(GMT+08:00) Kuala Lumpur, Singapore",dst:false},
    {id:"W. Australia Standard Time",offset:8,name:"W. Australia Standard Time",displayName:"(GMT+08:00) Perth",dst:true},
    {id:"Taipei Standard Time",offset:8,name:"Taipei Standard Time",displayName:"(GMT+08:00) Taipei",dst:false},
    {id:"Tokyo Standard Time",offset:9,name:"Tokyo Standard Time",displayName:"(GMT+09:00) Osaka, Sapporo, Tokyo",dst:false},
    {id:"Korea Standard Time",offset:9,name:"Korea Standard Time",displayName:"(GMT+09:00) Seoul",dst:false},
    {id:"Yakutsk Standard Time",offset:9,name:"Yakutsk Standard Time",displayName:"(GMT+09:00) Yakutsk",dst:true},
    {id:"Cen. Australia Standard Time",offset:9.5,name:"Cen. Australia Standard Time",displayName:"(GMT+09:30) Adelaide",dst:true},
    {id:"AUS Central Standard Time",offset:9.5,name:"AUS Central Standard Time",displayName:"(GMT+09:30) Darwin",dst:false},
    {id:"E. Australia Standard Time",offset:10,name:"E. Australia Standard Time",displayName:"(GMT+10:00) Brisbane",dst:false},
    {id:"AUS Eastern Standard Time",offset:10,name:"AUS Eastern Standard Time",displayName:"(GMT+10:00) Canberra, Melbourne, Sydney",dst:true},
    {id:"West Pacific Standard Time",offset:10,name:"West Pacific Standard Time",displayName:"(GMT+10:00) Guam, Port Moresby",dst:false},
    {id:"Tasmania Standard Time",offset:10,name:"Tasmania Standard Time",displayName:"(GMT+10:00) Hobart",dst:true},
    {id:"Vladivostok Standard Time",offset:10,name:"Vladivostok Standard Time",displayName:"(GMT+10:00) Vladivostok",dst:true},
    {id:"Central Pacific Standard Time",offset:11,name:"Central Pacific Standard Time",displayName:"(GMT+11:00) Magadan, Solomon Is., New Caledonia",dst:false},
    {id:"New Zealand Standard Time",offset:12,name:"New Zealand Standard Time",displayName:"(GMT+12:00) Auckland, Wellington",dst:true},
    {id:"Fiji Standard Time",offset:12,name:"Fiji Standard Time",displayName:"(GMT+12:00) Fiji, Kamchatka, Marshall Is.",dst:false},
    {id:"Tonga Standard Time",offset:13,name:"Tonga Standard Time",displayName:"(GMT+13:00) Nuku'alofa",dst:false},
];


/*****************************************************************
*
*  Languages List
*
*****************************************************************/
COCOS.Cmn.Time.ListOfLanguages = [
    {iso639_2:'abk',name:'Abkhazian'},
    {iso639_2:'ace',name:'Achinese'},
    {iso639_2:'ach',name:'Acoli'},
    {iso639_2:'ada',name:'Adangme'},
    {iso639_2:'ady',name:'Adyghe; Adygei'},
    {iso639_2:'aar',name:'Afar'},
    {iso639_2:'afh',name:'Afrihili'},
    {iso639_2:'afr',name:'Afrikaans'},
    {iso639_2:'afa',name:'Afro-Asiatic languages',enabled:false},
    {iso639_2:'ain',name:'Ainu'},
    {iso639_2:'aka',name:'Akan'},
    {iso639_2:'akk',name:'Akkadian'},
    {iso639_2:'alb',name:'Albanian'},
    {iso639_2:'ale',name:'Aleut'},
    {iso639_2:'alg',name:'Algonquian languages',enabled:false},
    {iso639_2:'tut',name:'Altaic languages',enabled:false},
    {iso639_2:'amh',name:'Amharic'},
    {iso639_2:'anp',name:'Angika'},
    {iso639_2:'apa',name:'Apache languages',enabled:false},
    {iso639_2:'ara',name:'Arabic'},
    {iso639_2:'arg',name:'Aragonese'},
    {iso639_2:'arp',name:'Arapaho'},
    {iso639_2:'arw',name:'Arawak'},
    {iso639_2:'arm',name:'Armenian'},
    {iso639_2:'rup',name:'Aromanian; Arumanian; Macedo-Romanian'},
    {iso639_2:'art',name:'Artificial languages',enabled:false},
    {iso639_2:'asm',name:'Assamese'},
    {iso639_2:'ast',name:'Asturian; Bable; Leonese; Asturleonese'},
    {iso639_2:'ath',name:'Athapascan languages',enabled:false},
    {iso639_2:'aus',name:'Australian languages',enabled:false},
    {iso639_2:'map',name:'Austronesian languages',enabled:false},
    {iso639_2:'ava',name:'Avaric'},
    {iso639_2:'ave',name:'Avestan'},
    {iso639_2:'awa',name:'Awadhi'},
    {iso639_2:'aym',name:'Aymara'},
    {iso639_2:'aze',name:'Azerbaijani'},
    {iso639_2:'ban',name:'Balinese'},
    {iso639_2:'bat',name:'Baltic languages',enabled:false},
    {iso639_2:'bal',name:'Baluchi'},
    {iso639_2:'bam',name:'Bambara'},
    {iso639_2:'bai',name:'Bamileke languages',enabled:false},
    {iso639_2:'bad',name:'Banda languages',enabled:false},
    {iso639_2:'bnt',name:'Bantu languages',enabled:false},
    {iso639_2:'bas',name:'Basa'},
    {iso639_2:'bak',name:'Bashkir'},
    {iso639_2:'baq',name:'Basque'},
    {iso639_2:'btk',name:'Batak languages',enabled:false},
    {iso639_2:'bej',name:'Beja; Bedawiyet'},
    {iso639_2:'bel',name:'Belarusian'},
    {iso639_2:'bem',name:'Bemba'},
    {iso639_2:'ben',name:'Bengali'},
    {iso639_2:'ber',name:'Berber languages',enabled:false},
    {iso639_2:'bho',name:'Bhojpuri'},
    {iso639_2:'bih',name:'Bihari languages',enabled:false},
    {iso639_2:'bik',name:'Bikol'},
    {iso639_2:'bin',name:'Bini; Edo'},
    {iso639_2:'bis',name:'Bislama'},
    {iso639_2:'byn',name:'Blin; Bilin'},
    {iso639_2:'zbl',name:'Blissymbols; Blissymbolics; Bliss'},
    {iso639_2:'nob',name:'Bokmal, Norwegian; Norwegian Bokmal'},
    {iso639_2:'bos',name:'Bosnian'},
    {iso639_2:'bra',name:'Braj'},
    {iso639_2:'bre',name:'Breton'},
    {iso639_2:'bug',name:'Buginese'},
    {iso639_2:'bul',name:'Bulgarian'},
    {iso639_2:'bua',name:'Buriat'},
    {iso639_2:'bur',name:'Burmese'},
    {iso639_2:'cad',name:'Caddo'},
    {iso639_2:'cat',name:'Catalan; Valencian'},
    {iso639_2:'cau',name:'Caucasian languages',enabled:false},
    {iso639_2:'ceb',name:'Cebuano'},
    {iso639_2:'cel',name:'Celtic languages',enabled:false},
    {iso639_2:'cai',name:'Central American Indian languages',enabled:false},
    {iso639_2:'khm',name:'Central Khmer'},
    {iso639_2:'chg',name:'Chagatai'},
    {iso639_2:'cmc',name:'Chamic languages',enabled:false},
    {iso639_2:'cha',name:'Chamorro'},
    {iso639_2:'che',name:'Chechen'},
    {iso639_2:'chr',name:'Cherokee'},
    {iso639_2:'chy',name:'Cheyenne'},
    {iso639_2:'chb',name:'Chibcha'},
    {iso639_2:'nya',name:'Chichewa; Chewa; Nyanja'},
    {iso639_2:'chi',name:'Chinese'},
    {iso639_2:'chn',name:'Chinook jargon'},
    {iso639_2:'chp',name:'Chipewyan; Dene Suline'},
    {iso639_2:'cho',name:'Choctaw'},
    {iso639_2:'chk',name:'Chuukese'},
    {iso639_2:'chv',name:'Chuvash'},
    {iso639_2:'syc',name:'Classical Syriac'},
    {iso639_2:'cop',name:'Coptic'},
    {iso639_2:'cor',name:'Cornish'},
    {iso639_2:'cos',name:'Corsican'},
    {iso639_2:'cre',name:'Cree'},
    {iso639_2:'mus',name:'Creek'},
    {iso639_2:'crp',name:'Creoles and pidgins'},
    {iso639_2:'cpe',name:'Creoles and pidgins, English based'},
    {iso639_2:'cpf',name:'Creoles and pidgins, French-based'},
    {iso639_2:'cpp',name:'Creoles and pidgins, Portuguese-based'},
    {iso639_2:'crh',name:'Crimean Tatar; Crimean Turkish'},
    {iso639_2:'hrv',name:'Croatian'},
    {iso639_2:'cus',name:'Cushitic languages',enabled:false},
    {iso639_2:'cze',name:'Czech'},
    {iso639_2:'dak',name:'Dakota'},
    {iso639_2:'dan',name:'Danish'},
    {iso639_2:'dar',name:'Dargwa'},
    {iso639_2:'del',name:'Delaware'},
    {iso639_2:'din',name:'Dinka'},
    {iso639_2:'div',name:'Divehi; Dhivehi; Maldivian'},
    {iso639_2:'doi',name:'Dogri'},
    {iso639_2:'dgr',name:'Dogrib'},
    {iso639_2:'dra',name:'Dravidian languages',enabled:false},
    {iso639_2:'dua',name:'Duala'},
    {iso639_2:'dut',name:'Dutch; Flemish'},
    {iso639_2:'dyu',name:'Dyula'},
    {iso639_2:'dzo',name:'Dzongkha'},
    {iso639_2:'frs',name:'Eastern Frisian'},
    {iso639_2:'efi',name:'Efik'},
    {iso639_2:'eka',name:'Ekajuk'},
    {iso639_2:'elx',name:'Elamite'},
    {iso639_2:'eng',name:'English'},
    {iso639_2:'myv',name:'Erzya'},
    {iso639_2:'epo',name:'Esperanto'},
    {iso639_2:'est',name:'Estonian'},
    {iso639_2:'ewe',name:'Ewe'},
    {iso639_2:'ewo',name:'Ewondo'},
    {iso639_2:'fan',name:'Fang'},
    {iso639_2:'fat',name:'Fanti'},
    {iso639_2:'fao',name:'Faroese'},
    {iso639_2:'fij',name:'Fijian'},
    {iso639_2:'fil',name:'Filipino; Pilipino'},
    {iso639_2:'fin',name:'Finnish'},
    {iso639_2:'fiu',name:'Finno-Ugrian languages',enabled:false},
    {iso639_2:'fon',name:'Fon'},
    {iso639_2:'fre',name:'French'},
    {iso639_2:'fur',name:'Friulian'},
    {iso639_2:'ful',name:'Fulah'},
    {iso639_2:'gaa',name:'Ga'},
    {iso639_2:'gla',name:'Gaelic; Scottish Gaelic'},
    {iso639_2:'car',name:'Galibi Carib'},
    {iso639_2:'glg',name:'Galician'},
    {iso639_2:'lug',name:'Ganda'},
    {iso639_2:'gay',name:'Gayo'},
    {iso639_2:'gba',name:'Gbaya'},
    {iso639_2:'gez',name:'Geez'},
    {iso639_2:'geo',name:'Georgian'},
    {iso639_2:'ger',name:'German'},
    {iso639_2:'gem',name:'Germanic languages',enabled:false},
    {iso639_2:'gil',name:'Gilbertese'},
    {iso639_2:'gon',name:'Gondi'},
    {iso639_2:'gor',name:'Gorontalo'},
    {iso639_2:'got',name:'Gothic'},
    {iso639_2:'grb',name:'Grebo'},
    {iso639_2:'gre',name:'Greek'},
    {iso639_2:'grn',name:'Guarani'},
    {iso639_2:'guj',name:'Gujarati'},
    {iso639_2:'gwi',name:'Gwich\'in'},
    {iso639_2:'hai',name:'Haida'},
    {iso639_2:'hat',name:'Haitian; Haitian Creole'},
    {iso639_2:'hau',name:'Hausa'},
    {iso639_2:'haw',name:'Hawaiian'},
    {iso639_2:'heb',name:'Hebrew'},
    {iso639_2:'her',name:'Herero'},
    {iso639_2:'hil',name:'Hiligaynon'},
    {iso639_2:'him',name:'Himachali languages; Western Pahari languages',enabled:false},
    {iso639_2:'hin',name:'Hindi'},
    {iso639_2:'hmo',name:'Hiri Motu'},
    {iso639_2:'hit',name:'Hittite'},
    {iso639_2:'hmn',name:'Hmong; Mong'},
    {iso639_2:'hun',name:'Hungarian'},
    {iso639_2:'hup',name:'Hupa'},
    {iso639_2:'iba',name:'Iban'},
    {iso639_2:'ice',name:'Icelandic'},
    {iso639_2:'ido',name:'Ido'},
    {iso639_2:'ibo',name:'Igbo'},
    {iso639_2:'ijo',name:'Ijo languages',enabled:false},
    {iso639_2:'ilo',name:'Iloko'},
    {iso639_2:'smn',name:'Inari Sami'},
    {iso639_2:'inc',name:'Indic languages',enabled:false},
    {iso639_2:'ine',name:'Indo-European languages',enabled:false},
    {iso639_2:'ind',name:'Indonesian'},
    {iso639_2:'inh',name:'Ingush'},
    {iso639_2:'iku',name:'Inuktitut'},
    {iso639_2:'ipk',name:'Inupiaq'},
    {iso639_2:'ira',name:'Iranian languages',enabled:false},
    {iso639_2:'gle',name:'Irish'},
    {iso639_2:'iro',name:'Iroquoian languages',enabled:false},
    {iso639_2:'ita',name:'Italian'},
    {iso639_2:'jpn',name:'Japanese'},
    {iso639_2:'jav',name:'Javanese'},
    {iso639_2:'jrb',name:'Judeo-Arabic'},
    {iso639_2:'jpr',name:'Judeo-Persian'},
    {iso639_2:'kbd',name:'Kabardian'},
    {iso639_2:'kab',name:'Kabyle'},
    {iso639_2:'kac',name:'Kachin; Jingpho'},
    {iso639_2:'kal',name:'Kalaallisut; Greenlandic'},
    {iso639_2:'xal',name:'Kalmyk; Oirat'},
    {iso639_2:'kam',name:'Kamba'},
    {iso639_2:'kan',name:'Kannada'},
    {iso639_2:'kau',name:'Kanuri'},
    {iso639_2:'krc',name:'Karachay-Balkar'},
    {iso639_2:'kaa',name:'Kara-Kalpak'},
    {iso639_2:'krl',name:'Karelian'},
    {iso639_2:'kar',name:'Karen languages',enabled:false},
    {iso639_2:'kas',name:'Kashmiri'},
    {iso639_2:'csb',name:'Kashubian'},
    {iso639_2:'kaw',name:'Kawi'},
    {iso639_2:'kaz',name:'Kazakh'},
    {iso639_2:'kha',name:'Khasi'},
    {iso639_2:'khi',name:'Khoisan languages',enabled:false},
    {iso639_2:'kho',name:'Khotanese; Sakan'},
    {iso639_2:'kik',name:'Kikuyu; Gikuyu'},
    {iso639_2:'kmb',name:'Kimbundu'},
    {iso639_2:'kin',name:'Kinyarwanda'},
    {iso639_2:'kir',name:'Kirghiz; Kyrgyz'},
    {iso639_2:'tlh',name:'Klingon; tlhIngan-Hol'},
    {iso639_2:'kom',name:'Komi'},
    {iso639_2:'kon',name:'Kongo'},
    {iso639_2:'kok',name:'Konkani'},
    {iso639_2:'kor',name:'Korean'},
    {iso639_2:'kos',name:'Kosraean'},
    {iso639_2:'kpe',name:'Kpelle'},
    {iso639_2:'kro',name:'Kru languages',enabled:false},
    {iso639_2:'kua',name:'Kuanyama; Kwanyama'},
    {iso639_2:'kum',name:'Kumyk'},
    {iso639_2:'kur',name:'Kurdish'},
    {iso639_2:'kru',name:'Kurukh'},
    {iso639_2:'kut',name:'Kutenai'},
    {iso639_2:'lad',name:'Ladino'},
    {iso639_2:'lah',name:'Lahnda'},
    {iso639_2:'lam',name:'Lamba'},
    {iso639_2:'day',name:'Land Dayak languages',enabled:false},
    {iso639_2:'lao',name:'Lao'},
    {iso639_2:'lat',name:'Latin'},
    {iso639_2:'lav',name:'Latvian'},
    {iso639_2:'lez',name:'Lezghian'},
    {iso639_2:'lim',name:'Limburgan; Limburger; Limburgish'},
    {iso639_2:'lin',name:'Lingala'},
    {iso639_2:'lit',name:'Lithuanian'},
    {iso639_2:'jbo',name:'Lojban'},
    {iso639_2:'nds',name:'Low German; Low Saxon; German, Low; Saxon, Low'},
    {iso639_2:'dsb',name:'Lower Sorbian'},
    {iso639_2:'loz',name:'Lozi'},
    {iso639_2:'lub',name:'Luba-Katanga'},
    {iso639_2:'lua',name:'Luba-Lulua'},
    {iso639_2:'lui',name:'Luiseno'},
    {iso639_2:'smj',name:'Lule Sami'},
    {iso639_2:'lun',name:'Lunda'},
    {iso639_2:'luo',name:'Luo (Kenya and Tanzania)'},
    {iso639_2:'lus',name:'Lushai'},
    {iso639_2:'ltz',name:'Luxembourgish; Letzeburgesch'},
    {iso639_2:'mac',name:'Macedonian'},
    {iso639_2:'mad',name:'Madurese'},
    {iso639_2:'mag',name:'Magahi'},
    {iso639_2:'mai',name:'Maithili'},
    {iso639_2:'mak',name:'Makasar'},
    {iso639_2:'mlg',name:'Malagasy'},
    {iso639_2:'may',name:'Malay'},
    {iso639_2:'mal',name:'Malayalam'},
    {iso639_2:'mlt',name:'Maltese'},
    {iso639_2:'mnc',name:'Manchu'},
    {iso639_2:'mdr',name:'Mandar'},
    {iso639_2:'man',name:'Mandingo'},
    {iso639_2:'mni',name:'Manipuri'},
    {iso639_2:'mno',name:'Manobo languages',enabled:false},
    {iso639_2:'glv',name:'Manx'},
    {iso639_2:'mao',name:'Maori'},
    {iso639_2:'arn',name:'Mapudungun; Mapuche'},
    {iso639_2:'mar',name:'Marathi'},
    {iso639_2:'chm',name:'Mari'},
    {iso639_2:'mah',name:'Marshallese'},
    {iso639_2:'mwr',name:'Marwari'},
    {iso639_2:'mas',name:'Masai'},
    {iso639_2:'myn',name:'Mayan languages',enabled:false},
    {iso639_2:'men',name:'Mende'},
    {iso639_2:'mic',name:'Mi\'kmaq; Micmac'},
    {iso639_2:'min',name:'Minangkabau'},
    {iso639_2:'mwl',name:'Mirandese'},
    {iso639_2:'moh',name:'Mohawk'},
    {iso639_2:'mdf',name:'Moksha'},
    {iso639_2:'lol',name:'Mongo'},
    {iso639_2:'mon',name:'Mongolian'},
    {iso639_2:'mkh',name:'Mon-Khmer languages',enabled:false},
    {iso639_2:'mos',name:'Mossi'},
    {iso639_2:'mul',name:'Multiple languages',enabled:false},
    {iso639_2:'mun',name:'Munda languages',enabled:false},
    {iso639_2:'nah',name:'Nahuatl languages',enabled:false},
    {iso639_2:'nau',name:'Nauru'},
    {iso639_2:'nav',name:'Navajo; Navaho'},
    {iso639_2:'nde',name:'Ndebele, North; North Ndebele'},
    {iso639_2:'nbl',name:'Ndebele, South; South Ndebele'},
    {iso639_2:'ndo',name:'Ndonga'},
    {iso639_2:'nap',name:'Neapolitan'},
    {iso639_2:'new',name:'Nepal Bhasa; Newari'},
    {iso639_2:'nep',name:'Nepali'},
    {iso639_2:'nia',name:'Nias'},
    {iso639_2:'nic',name:'Niger-Kordofanian languages',enabled:false},
    {iso639_2:'ssa',name:'Nilo-Saharan languages',enabled:false},
    {iso639_2:'niu',name:'Niuean'},
    {iso639_2:'nqo',name:'N\'Ko'},
    {iso639_2:'zxx',name:'No linguistic content; Not applicable'},
    {iso639_2:'nog',name:'Nogai'},
    {iso639_2:'nai',name:'North American Indian languages',enabled:false},
    {iso639_2:'frr',name:'Northern Frisian'},
    {iso639_2:'sme',name:'Northern Sami'},
    {iso639_2:'nor',name:'Norwegian'},
    {iso639_2:'nno',name:'Norwegian Nynorsk; Nynorsk, Norwegian'},
    {iso639_2:'nub',name:'Nubian languages',enabled:false},
    {iso639_2:'nym',name:'Nyamwezi'},
    {iso639_2:'nyn',name:'Nyankole'},
    {iso639_2:'nyo',name:'Nyoro'},
    {iso639_2:'nzi',name:'Nzima'},
    {iso639_2:'oci',name:'Occitan (post 1500)'},
    {iso639_2:'oji',name:'Ojibwa'},
    {iso639_2:'ori',name:'Oriya'},
    {iso639_2:'orm',name:'Oromo'},
    {iso639_2:'osa',name:'Osage'},
    {iso639_2:'oss',name:'Ossetian; Ossetic'},
    {iso639_2:'oto',name:'Otomian languages',enabled:false},
    {iso639_2:'pal',name:'Pahlavi'},
    {iso639_2:'pau',name:'Palauan'},
    {iso639_2:'pli',name:'Pali'},
    {iso639_2:'pam',name:'Pampanga; Kapampangan'},
    {iso639_2:'pag',name:'Pangasinan'},
    {iso639_2:'pan',name:'Panjabi; Punjabi'},
    {iso639_2:'pap',name:'Papiamento'},
    {iso639_2:'paa',name:'Papuan languages',enabled:false},
    {iso639_2:'nso',name:'Pedi; Sepedi; Northern Sotho'},
    {iso639_2:'per',name:'Persian'},
    {iso639_2:'phi',name:'Philippine languages',enabled:false},
    {iso639_2:'phn',name:'Phoenician'},
    {iso639_2:'pon',name:'Pohnpeian'},
    {iso639_2:'pol',name:'Polish'},
    {iso639_2:'por',name:'Portuguese'},
    {iso639_2:'pra',name:'Prakrit languages',enabled:false},
    {iso639_2:'pus',name:'Pushto; Pashto'},
    {iso639_2:'que',name:'Quechua'},
    {iso639_2:'raj',name:'Rajasthani'},
    {iso639_2:'rap',name:'Rapanui'},
    {iso639_2:'rar',name:'Rarotongan; Cook Islands Maori'},
    {iso639_2:'roa',name:'Romance languages',enabled:false},
    {iso639_2:'rum',name:'Romanian; Moldavian; Moldovan'},
    {iso639_2:'roh',name:'Romansh'},
    {iso639_2:'rom',name:'Romany'},
    {iso639_2:'run',name:'Rundi'},
    {iso639_2:'rus',name:'Russian'},
    {iso639_2:'sal',name:'Salishan languages',enabled:false},
    {iso639_2:'sam',name:'Samaritan Aramaic'},
    {iso639_2:'smi',name:'Sami languages',enabled:false},
    {iso639_2:'smo',name:'Samoan'},
    {iso639_2:'sad',name:'Sandawe'},
    {iso639_2:'sag',name:'Sango'},
    {iso639_2:'san',name:'Sanskrit'},
    {iso639_2:'sat',name:'Santali'},
    {iso639_2:'srd',name:'Sardinian'},
    {iso639_2:'sas',name:'Sasak'},
    {iso639_2:'sco',name:'Scots'},
    {iso639_2:'sel',name:'Selkup'},
    {iso639_2:'sem',name:'Semitic languages',enabled:false},
    {iso639_2:'srp',name:'Serbian'},
    {iso639_2:'srr',name:'Serer'},
    {iso639_2:'shn',name:'Shan'},
    {iso639_2:'sna',name:'Shona'},
    {iso639_2:'iii',name:'Sichuan Yi; Nuosu'},
    {iso639_2:'scn',name:'Sicilian'},
    {iso639_2:'sid',name:'Sidamo'},
    {iso639_2:'sgn',name:'Sign Languages',enabled:false},
    {iso639_2:'bla',name:'Siksika'},
    {iso639_2:'snd',name:'Sindhi'},
    {iso639_2:'sin',name:'Sinhala; Sinhalese'},
    {iso639_2:'sit',name:'Sino-Tibetan languages',enabled:false},
    {iso639_2:'sio',name:'Siouan languages',enabled:false},
    {iso639_2:'sms',name:'Skolt Sami'},
    {iso639_2:'den',name:'Slave (Athapascan)'},
    {iso639_2:'sla',name:'Slavic languages',enabled:false},
    {iso639_2:'slo',name:'Slovak'},
    {iso639_2:'slv',name:'Slovenian'},
    {iso639_2:'sog',name:'Sogdian'},
    {iso639_2:'som',name:'Somali'},
    {iso639_2:'son',name:'Songhai languages',enabled:false},
    {iso639_2:'snk',name:'Soninke'},
    {iso639_2:'wen',name:'Sorbian languages',enabled:false},
    {iso639_2:'sot',name:'Sotho, Southern'},
    {iso639_2:'sai',name:'South American Indian languages',enabled:false},
    {iso639_2:'alt',name:'Southern Altai'},
    {iso639_2:'sma',name:'Southern Sami'},
    {iso639_2:'spa',name:'Spanish; Castilian'},
    {iso639_2:'srn',name:'Sranan Tongo'},
    {iso639_2:'zgh',name:'Standard Moroccan Tamazight'},
    {iso639_2:'suk',name:'Sukuma'},
    {iso639_2:'sux',name:'Sumerian'},
    {iso639_2:'sun',name:'Sundanese'},
    {iso639_2:'sus',name:'Susu'},
    {iso639_2:'swa',name:'Swahili'},
    {iso639_2:'ssw',name:'Swati'},
    {iso639_2:'swe',name:'Swedish'},
    {iso639_2:'gsw',name:'Swiss German; Alemannic; Alsatian'},
    {iso639_2:'syr',name:'Syriac'},
    {iso639_2:'tgl',name:'Tagalog'},
    {iso639_2:'tah',name:'Tahitian'},
    {iso639_2:'tai',name:'Tai languages',enabled:false},
    {iso639_2:'tgk',name:'Tajik'},
    {iso639_2:'tmh',name:'Tamashek'},
    {iso639_2:'tam',name:'Tamil'},
    {iso639_2:'tat',name:'Tatar'},
    {iso639_2:'tel',name:'Telugu'},
    {iso639_2:'ter',name:'Tereno'},
    {iso639_2:'tet',name:'Tetum'},
    {iso639_2:'tha',name:'Thai'},
    {iso639_2:'tib',name:'Tibetan'},
    {iso639_2:'tig',name:'Tigre'},
    {iso639_2:'tir',name:'Tigrinya'},
    {iso639_2:'tem',name:'Timne'},
    {iso639_2:'tiv',name:'Tiv'},
    {iso639_2:'tli',name:'Tlingit'},
    {iso639_2:'tpi',name:'Tok Pisin'},
    {iso639_2:'tkl',name:'Tokelau'},
    {iso639_2:'tog',name:'Tonga (Nyasa)'},
    {iso639_2:'ton',name:'Tonga (Tonga Islands)'},
    {iso639_2:'tsi',name:'Tsimshian'},
    {iso639_2:'tso',name:'Tsonga'},
    {iso639_2:'tsn',name:'Tswana'},
    {iso639_2:'tum',name:'Tumbuka'},
    {iso639_2:'tup',name:'Tupi languages',enabled:false},
    {iso639_2:'tur',name:'Turkish'},
    {iso639_2:'tuk',name:'Turkmen'},
    {iso639_2:'tvl',name:'Tuvalu'},
    {iso639_2:'tyv',name:'Tuvinian'},
    {iso639_2:'twi',name:'Twi'},
    {iso639_2:'udm',name:'Udmurt'},
    {iso639_2:'uga',name:'Ugaritic'},
    {iso639_2:'uig',name:'Uighur; Uyghur'},
    {iso639_2:'ukr',name:'Ukrainian'},
    {iso639_2:'umb',name:'Umbundu'},
    {iso639_2:'mis',name:'Uncoded languages',enabled:false},
    {iso639_2:'und',name:'Undetermined'},
    {iso639_2:'hsb',name:'Upper Sorbian'},
    {iso639_2:'urd',name:'Urdu'},
    {iso639_2:'uzb',name:'Uzbek'},
    {iso639_2:'vai',name:'Vai'},
    {iso639_2:'ven',name:'Venda'},
    {iso639_2:'vie',name:'Vietnamese'},
    {iso639_2:'vol',name:'Volapük'},
    {iso639_2:'vot',name:'Votic'},
    {iso639_2:'wak',name:'Wakashan languages',enabled:false},
    {iso639_2:'wln',name:'Walloon'},
    {iso639_2:'war',name:'Waray'},
    {iso639_2:'was',name:'Washo'},
    {iso639_2:'wel',name:'Welsh'},
    {iso639_2:'fry',name:'Western Frisian'},
    {iso639_2:'wal',name:'Wolaitta; Wolaytta'},
    {iso639_2:'wol',name:'Wolof'},
    {iso639_2:'xho',name:'Xhosa'},
    {iso639_2:'sah',name:'Yakut'},
    {iso639_2:'yao',name:'Yao'},
    {iso639_2:'yap',name:'Yapese'},
    {iso639_2:'yid',name:'Yiddish'},
    {iso639_2:'yor',name:'Yoruba'},
    {iso639_2:'ypk',name:'Yupik languages',enabled:false},
    {iso639_2:'znd',name:'Zande languages',enabled:false},
    {iso639_2:'zap',name:'Zapotec'},
    {iso639_2:'zza',name:'Zaza; Dimili; Dimli; Kirdki; Kirmanjki; Zazaki'},
    {iso639_2:'zen',name:'Zenaga'},
    {iso639_2:'zha',name:'Zhuang; Chuang'},
    {iso639_2:'zul',name:'Zulu'},
    {iso639_2:'zun',name:'Zuni'}
];


/*****************************************************************
*
*  Initialization
*
*****************************************************************/
COCOS.Cmn.Time.DefaultTimeZone = COCOS.Cmn.Time.GetTimeZone('GMT Standard Time');

COCOS.Cmn.Time.DST = {
    Enabled: false,
    Offset: 0 // minutes
};
COCOS.Cmn.Time.TimeZone = COCOS.Cmn.Time.GetTimeZone('GMT Standard Time');
COCOS.Cmn.Time.DateFormat = COCOS.Cmn.Time.GetDateFormat('MM/dd/yyyy');

COCOS.Cmn.Time.BrowserTimeOffset = (new Date()).getTimezoneOffset();

//COCOS.Cmn.Time.DateDelimiterReadCookies();
//COCOS.Cmn.Time.DateFormatReadCookies();
//COCOS.Cmn.Time.TimeFormatReadCookies();
//COCOS.Cmn.Time.DSTReadCookies();
//COCOS.Cmn.Time.TimeZoneReadCookies();
