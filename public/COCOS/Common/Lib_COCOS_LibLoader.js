/*
    Libloader v 2
    Application libraries loading utility

    Execution flow:
    * Call "COCOS.Cmn.Libloader.Load" method with Application Loader JS library (AppLoader)
    * AppLoader is loaded with COCOS.Cmn.Utility.LoadLibrary
    * when AppLoader loaded, each library from AppLoader's "libraryDependency" list is loaded with COCOS.Cmn.Utility.LoadLibrary
*/

/*****************************************************************
*
*  Namespaces
*
*****************************************************************/
var COCOS = COCOS || {};
COCOS.Cmn = COCOS.Cmn || {};
COCOS.Cmn.Libloader = COCOS.Cmn.Libloader || {};
COCOS.Cmn.Libloader.Enums = COCOS.Cmn.Libloader.Enums || {};
COCOS.Cmn.Patches = COCOS.Cmn.Patches || {};
COCOS.Cmn.Utility = COCOS.Cmn.Utility || {};
COCOS.Cmn.Utility.Enums = COCOS.Cmn.Utility.Enums || {};


/*****************************************************************
*
*  Localization
*
*****************************************************************/
String.locale = "en-US";


/*****************************************************************
*
*  Enumerators
*
*****************************************************************/
COCOS.Cmn.Utility.Enums.HttpType = {
    GET: 0,
    POST: 1
};
COCOS.Cmn.Utility.Enums.LoadMode = {
    Sequential: 0,
    Burst: 1
};


/**
* Enumerators for system libraries
**/
COCOS.Cmn.Libloader.Enums.SysLib = {
};

/**
* Enumerators for various resources eg. css
**/
COCOS.Cmn.Libloader.Enums.SysResources = {
    // Normalize css http://necolas.github.com/normalize.css/
    NormalizeCSS: { path: '/COCOS/Common/Normalize.css', startf: '', thirdparty: true, initialized: false },
    jQueryCSS: { path: '/ThirdPty/jquery-ui.min.css', startf: '', thirdparty: true, initialized: false }
};

// list of loaded libraries
COCOS.Cmn.Libloader.Libraries = {
    ToLoad: {
        list: [],
        Count: function () {return COCOS.Cmn.Libloader.Libraries.ToLoad.list.length;},
        Loading: function (pUrl) {
            for (var li = 0; li < COCOS.Cmn.Libloader.Libraries.ToLoad.list.length; li++) {
                var lo = COCOS.Cmn.Libloader.Libraries.ToLoad.list[li];
                if (lo.path == pUrl && (typeof lo.loading == 'undefined' || lo.loading == false)) return true;
            }
            return false;
        },
    },
    Loaded:{
        list: [],
        CountOfLoaded: function () {return COCOS.Cmn.Libloader.Libraries.Loaded.list.length;},
        CountOfInitialized: function () {
            var liCnt = 0;
            if (!COCOS.Cmn.Libloader.Libraries.AllLoaded()) return false;
            for (var li = 0; li < COCOS.Cmn.Libloader.Libraries.Loaded.list.length; li++) {
                if (typeof COCOS.Cmn.Libloader.Libraries.Loaded.list[li].thirdparty != 'undefined' && !COCOS.Cmn.Libloader.Libraries.Loaded.list[li].thirdparty) {
                    if (COCOS.Cmn.Libloader.Libraries.Loaded.list[li].initialized == true) {
                        liCnt++;
                    }
                }
            }
            return liCnt;
        },
        AllLoaded: function () {return (COCOS.Cmn.Libloader.Libraries.Loaded.list.length == COCOS.Cmn.Libloader.Libraries.ToLoad.list.length + 1);},
        AllInitialized: function () {
            if (!COCOS.Cmn.Libloader.Libraries.AllLoaded()) return false;
            for (var li = 0; li < COCOS.Cmn.Libloader.Libraries.Loaded.list.length; li++) {
                if (typeof COCOS.Cmn.Libloader.Libraries.Loaded.list[li].thirdparty != 'undefined' && !COCOS.Cmn.Libloader.Libraries.Loaded.list[li].thirdparty) {
                    if (!(COCOS.Cmn.Libloader.Libraries.Loaded.list[li].initialized == true)) {
                        return false;
                    }
                }
            }
            return true;
        },
        Exist: function (pUrl) {
            for (var li = 0; li < COCOS.Cmn.Libloader.Libraries.Loaded.list.length; li++) {
                var lo = COCOS.Cmn.Libloader.Libraries.Loaded.list[li];
                if (lo.path == pUrl) return true;
            }
            return false;
        },
    }
};


/*****************************************************************
*
*  Global Variables
*
*****************************************************************/
COCOS.Cmn.Libloader.C_MaxWaitTime = 10000; //ms
COCOS.Cmn.Libloader.C_LoopInterval = 20; //ms

COCOS.Cmn.Libloader.libraryName = 'Lib_COCOS_LibLoader.js';
COCOS.Cmn.Libloader.config = {
    rootPath: '.',
    loadMode: COCOS.Cmn.Utility.Enums.LoadMode.Sequential,
    ajaxPreload: true
};


/**
* This function is used in dependant libraries in their IsInitialized function
* to check if the libraries are loaded
**/
COCOS.Cmn.Libloader.CheckPrereqLibsStatus = function (listOflibs, callback, counter) {
    if (counter === undefined) counter = 0;

    /*if (typeof console != "undefined") {
        //COCOS.Cmn.Utility.Logger.debug(arguments.callee.caller);
        COCOS.Cmn.Utility.Logger.debug("counter: " + counter);
    }*/

    for (i = 0; i < listOflibs.length; i++) {
        var obj = listOflibs[i];
        for (var id in obj) {
            // check only ones not initialized
            if (!obj[id].initialized) {
                if (obj[id].thirdparty) {
                    if (typeof window[obj[id].startf] == 'undefined')
                        recCall = true;
                    else
                        obj[id].initialized = true;
                }
                else {

                    if (!COCOS.Cmn.Utility.IsFunctionAvailable(obj[id].startf, "IsInitialized")
                        || COCOS.Cmn.Utility.CallFunctionWithNs(obj[id].startf, "IsInitialized") !== true) {

                        // Too many loops display failed
                        if (counter >= 100) {
                            /*
                            var liblist = "";
                            for (i = 0; i < listOflibs.length; i++) {
                                var obj = listOflibs[i];
                                for (var id in obj) {
                                    // check only ones not initialized
                                    if (!obj[id].initialized) {
                                        liblist += obj[id].path + " ";
                                    }
                                }
                            }
                            */
                            if (counter == 100)
                                alert("Library: " + obj[id].path + " failed to load.");
                            //alert("Library: " + liblist + " failed to load.");
                            return false;

                        }
                        counter++;
                        COCOS.Cmn.Libloader.CheckPrereqLibsStatus(listOflibs, callback, counter);
                        return false;
                        // setTimeout(function () { counter++;COCOS.Cmn.Libloader.CheckPrereqLibsStatus(listOflibs, callback, counter); }, 50)
                    }
                    else {
                        obj[id].initialized = true;
                    }
                }
            }
        }
    }
    // alert(callback);
    if (callback) callback();
    return true;
};


/*****************************************************************
*
*  Utility Methods
*
*****************************************************************/
COCOS.Cmn.Utility.XmlHttpPost = function (pURL, pCallParams, pCallback, pCallbackError, pAdditionalParams)
{
    var runjQuery = true;
    if (runjQuery) {
        var timeout = (pCallParams && pCallParams.Timeout ? pCallParams.Timeout : 0);
        var shortTimout = 2000;

        if (pCallParams.Data.indexOf('openSession') > -1) {
            COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Call openSession.');
        } else if (pCallParams.Data.indexOf('closeSession') > -1) {
            COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Call closeSession.');
            timeout = shortTimout;
        } else if (pCallParams.Data.indexOf('monitorStart') > -1) {
            COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Call monitorStart.');
            timeout = shortTimout;
        } else if (pCallParams.Data.indexOf('monitorStop') > -1) {
            COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Call monitorStop.');
            timeout = shortTimout;
        } else if (pCallParams.Data.indexOf('getNextEvent') > -1) {
            COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Call getNextEvent.');
        } else if (pCallParams.Data.indexOf('makeCall') > -1) {
            COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Call makeCall.');
            timeout = shortTimout;
        } else if (pCallParams.Data.indexOf('answerCall') > -1) {
            COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Call answerCall.');
            timeout = shortTimout;
        } else if (pCallParams.Data.indexOf('clearConnection') > -1) {
            COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Call clearConnection.');
            timeout = shortTimout;
        } else if (pCallParams.Data.indexOf('holdCall') > -1) {
            COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Call holdCall.');
            timeout = shortTimout;
        } else if (pCallParams.Data.indexOf('transferCall') > -1) {
            COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Call transferCall.');
            timeout = shortTimout;
        } else if (pCallParams.Data.indexOf('singleStepTransfer') > -1) {
            COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Call singleStepTransfer.');
            timeout = shortTimout;
        } else if (pCallParams.Data.indexOf('conferenceCall') > -1) {
            COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Call conferenceCall.');
            timeout = shortTimout;
        } else if (pCallParams.Data.indexOf('CustomMacro') > -1) {
            COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Custom macro.');
            timeout = shortTimout;
        } else if (pCallParams.Data.indexOf('sendCustomMessage') > -1) {
            COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Custom message.');
            timeout = shortTimout;
        } else if (pCallParams.Data.indexOf('callSendCustomMessage') > -1) {
            COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Custom message with call.');
            timeout = shortTimout;
        } else if (pCallParams.Data.indexOf('setPresenceStatus') > -1) {
            COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Set presence status.');
            timeout = shortTimout;
        }
        var data =(pCallParams && pCallParams.Data ? pCallParams.Data : '');
        var accepts = (pCallParams && pCallParams.Accepts ? pCallParams.Accepts : null);
        var type = (pCallParams && pCallParams.Type ? pCallParams.Type : 'POST');
        //COCOS.Cmn.Utility.Logger.debug("AJAX request: DATA:" + data);
        var dataType = (pCallParams && pCallParams.DataType ? pCallParams.DataType : 'text');
        if (pCallParams.Async === undefined)
            var async = true;
        else
            var async = pCallParams.Async;
        COCOS.Cmn.Utility.ConsoleLogger("Timeout " + timeout + ", datatype: " + dataType + ", async: " + async + ", type: " + type + ", active: " + $.active);

        var laHeaders = { 'Content-Type': 'application/x-www-form-urlencoded' };
        if (pCallParams.Headers) {
            //laHeaders = laHeaders.concat(pCallParams.Headers);
            for (var attrname in pCallParams.Headers) { laHeaders[attrname] = pCallParams.Headers[attrname]; }
        }

        if(typeof app !== 'undefined' && typeof app.config != 'undefined' && app.config.debugDataToServer) {
            console.log('SENDING:------------------>', data);
        }

        // if(window.already) {
        //     console.error('Not sending');
        //     return;
        // }

        // window.already = 1;


        return $.ajax({
            url: pURL,
            //accepts: accepts,
            type: type,
            data: data,
            tryCount: 0,
            retryLimit: 2,
            timeout: timeout,
            //contentType: 'text/xml', //; charset="utf-8"',
            headers: laHeaders,
            dataType: dataType,
            async: async,
            global: false,
            beforeSend: (function (pHeaders) {
                return function (xhr) {
                }
            })(laHeaders),
            complete: function () {
            },
            success: (function (pCallback, pAdditionalParams)
            {
                return function (data, textStatus, request)
                {
                    //COCOS.Cmn.Utility.ConsoleLogger('success: ' + data);
                    if (typeof app !== 'undefined' && typeof app.config != 'undefined' && app.config.debugDataFromServer) {
                        console.log('DATA FROM SERVER...', data);
                    }
                    if (data.indexOf('getNextEvent') > -1) {
                        COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Response getNextEvent.');
                    } else if (data.indexOf('closeSession') > -1) {
                        COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Response closeSession.');
                    } else if (data.indexOf('monitorStart') > -1) {
                        COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Response monitorStart.');
                    } else if (data.indexOf('monitorStop') > -1) {
                        COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Response monitorStop.');
                    } else if (data.indexOf('holdCall') > -1) {
                        COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Response holdCall.');
                    } else if (data.indexOf('transferCall') > -1) {
                        COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Response transferCall.');
                    } else if (data.indexOf('singleStepTransfer') > -1) {
                        COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Response singleStepTransfer.');
                    } else if (data.indexOf('conferenceCall') > -1) {
                        COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Response conferenceCall.');
                    } else if (data.indexOf('CustomMacro') > -1) {
                        COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Response CustomMacro.');
                    } else if (data.indexOf('sendCustomMessage') > -1) {
                        COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Response sendCustomMessage.');
                    } else if (data.indexOf('callSendCustomMessage') > -1) {
                        COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Response callSendCustomMessage.');
                    }
                    if (data.indexOf('CustomMacro') < 0) {
                        COCOS.Cmn.Utility.ConsoleLogger('::Response::' + data + '.');
                    }

                    //console.error($(data).find('out_Event_List').text());
                    if (pCallback) {
                        pCallback(data, textStatus, request, pAdditionalParams);
                    }
                };
            })(pCallback, pAdditionalParams),
            error: (function (pCallbackError, pAdditionalParams) {
                return function (request, type, errorThrown)
                {
                    if (type === "timeout")
                    {
                        var retry = false;
                        if (
                            (this.data.indexOf("closeSession") > -1) || (this.data.indexOf("conferenceCall"))
                            ||
                            (this.data.indexOf("singleStepTransfer") > -1)
                            ||
                            (this.data.indexOf("holdCall") > -1)
                            ||
                            (this.data.indexOf("clearConnection") > -1)
                            ||
                            (this.data.indexOf("answerCall") > -1)
                            ||
                            (this.data.indexOf("makeCall") > -1)
                            ||
                            (this.data.indexOf("monitorStart") > -1)
                            ||
                            (this.data.indexOf("CustomMacro") > -1)
                            ){
                            retry = true;
                        }
                        //retry
                        if (retry) {
                            this.tryCount++;
                            if (this.tryCount <= this.retryLimit) {
                                COCOS.Cmn.Utility.ConsoleLogger("Warning timeout request: " + this.data);
                                //try again
                                $.ajax(this);
                                return;
                            }
                        }
                        return;
                    }
                    if (request && request.data) {
                        if (request.data.indexOf('getNextEvent') > -1) {
                            COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Response[ERROR] getNextEvent.');
                        } else if (request.data.indexOf('closeSession') > -1) {
                            COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Response[ERROR] closeSession.');
                        } else if (request.data.indexOf('monitorStart') > -1) {
                            COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Response[ERROR] monitorStart.');
                        } else if (request.data.indexOf('monitorStop') > -1) {
                            COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Response[ERROR] monitorStop.');
                        } else if (request.data.indexOf('holdCall') > -1) {
                            COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Response[ERROR] holdCall.');
                        } else if (request.data.indexOf('transferCall') > -1) {
                            COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Response[ERROR] transferCall.');
                        } else if (request.data.indexOf('singleStepTransfer') > -1) {
                            COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Response[ERROR] singleStepTransfer.');
                        } else if (request.data.indexOf('conferenceCall') > -1) {
                            COCOS.Cmn.Utility.ConsoleLogger('::XmlHttpPost', '::-Response[ERROR] conferenceCall.');
                        }
                    }
                    if (request && this.data) {
                        COCOS.Cmn.Utility.ConsoleLogger('::Response-error::' + this.data + '.');
                    }
                    if (pCallbackError) {
                        pCallbackError(request, type, errorThrown, pAdditionalParams);
                    }
                };
            })(pCallbackError, pAdditionalParams)
        });
        /*}*/
    }
    else {
        var async =  true; //(typeof (pCallParams.Async) != undefined ? pCallParams.Async : true);
        return COCOS.Cmn.Utility.XmlHttpPostNative(
            pURL,
            (pCallParams && pCallParams.Type ? pCallParams.Type : COCOS.Cmn.Utility.Enums.HttpType.POST),
            (pCallParams && pCallParams.Data ? pCallParams.Data : ''),
            async,
            pCallback,
            pCallbackError,
            pAdditionalParams
        );
    }
};

/**
* Old XmlHttpPost for compatibility and if jQuery doesnt exists
*/
COCOS.Cmn.Utility.XmlHttpPostNative = function (pURL, pType, pData, pAsync, pCallback, pCallbackError, pAdditionalParams) {
    var xmlHttpReq = null;
    var self = this;
    var XHR = null;
    var lbAsync = (pAsync ? true : false);
    var lsType = 'GET';
    if (pType && pType == COCOS.Cmn.Utility.Enums.HttpType.POST) lsType = 'POST';

    if (typeof XMLHttpRequest === "undefined") {
        XHR = function () {
            try {
                return new ActiveXObject("Msxml2.XMLHTTP.6.0");
            } catch (xhrEx1) { }
            try {
                return new ActiveXObject("Msxml2.XMLHTTP.3.0");
            } catch (xhrEx2) { }
            try {
                return new ActiveXObject("Msxml2.XMLHTTP");
            } catch (xhrEx3) { }
            try {
                return new ActiveXObject("Microsoft.XMLHTTP");
            } catch (xhrEx4) { }

            throw new Error("XMLHttpRequest not supported by this browser.");
        };
    } else {
        XHR = XMLHttpRequest;
    }

    self.xmlHttpReq = new XHR();
    self.xmlHttpReq.open(lsType, pURL, lbAsync);
    if (lsType == 'POST') {
        self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    } else {
        if (self.xmlHttpReq.overrideMimeType) self.xmlHttpReq.overrideMimeType('text/xml');
    }

    if (pCallback) {
        self.xmlHttpReq.onreadystatechange = (function (pCB, pAdditionalParams, pXhr) {
            return function () {
                if (pXhr.readyState == 4) {
                    // status used in ie (internet explorer)
                    if (pXhr.status == 404) COCOS.Cmn.Utility.ConsoleLogger(COCOS.Cmn.LibloaderlibraryName, "File not found: " + pURL, true);
                    if (pXhr.status == 12029) COCOS.Cmn.Utility.ConsoleLogger(COCOS.Cmn.LibloaderlibraryName, "ERROR_INTERNET_CANNOT_CONNECT: " + pURL, true);
                    pCB(pXhr.responseText, "success", null, pAdditionalParams);
                }
            };
        })(pCallback, pAdditionalParams, self.xmlHttpReq);
    }
    if (pCallbackError) {
        self.xmlHttpReq.onerror = (function (pData, pCBError, pAdditionalParams) {
            return function () {
                COCOS.Cmn.Utility.Logger.debug("ON error");
                pCBError(pData, "error", "", pAdditionalParams);
            };
        })(pData, pCallbackError, pAdditionalParams);
        self.xmlHttpReq.ontimeout = (function (pData, pCBError, pAdditionalParams) {
            return function () {
                COCOS.Cmn.Utility.Logger.debug("ON timeout");
                pCBError(pData, "error", "",pAdditionalParams);
            };
        })(pData, pCallbackError, pAdditionalParams);
    }
    //COCOS.Cmn.Utility.Logger.debug("SENDING DATA: " + pData);
    self.xmlHttpReq.send(pData);
    //COCOS.Cmn.Utility.Logger.debug("DATA SEND: " + pData);
    return self.xmlHttpReq;
};

COCOS.Cmn.Utility.XDomainRequest = function (pURL, pType, pData, pAsync, pCallback, pCallbackError, pAdditionalParams) {
    var xdr;
    var lbAsync = (pAsync ? true : false);
    var lsType = 'GET';
    if (pType && pType == COCOS.Cmn.Utility.Enums.HttpType.POST) lsType = 'POST';

    // Use Microsoft XDR
    xdr = new XDomainRequest();
    xdr.open(lsType, pURL);

    if (pCallback) {
        xdr.onload = (function (pCB, pAdditionalParams) {
            return function () {
                pCB(this.responseText, pAdditionalParams);
            };
        })(pCallback, pAdditionalParams);
    }
    if (pCallbackError) {
        xdr.onerror = (function (pCBError, pAdditionalParams) {
            return function () {
                pCBError(pAdditionalParams);
            };
        })(pCallbackError, pAdditionalParams);
        xdr.ontimeout = (function (pCBError, pAdditionalParams) {
            return function () {
                pCBError(pAdditionalParams);
            };
        })(pCallbackError, pAdditionalParams);
    }
    xdr.send(pData);
};

COCOS.Cmn.Utility.getAjaxErrorDescription = function (pRequest, pType, pErrorThrown) {
    var lsDescErr = '';
    var lsMessage = '';
    switch (pType) {
        case 'timeout':
            lsMessage += "The request timed out.";
            break;
        case 'notmodified':
            lsMessage += "The request was not modified but was not retrieved from the cache.";
            break;
        case 'parseerror':
            lsMessage += "XML/Json format is bad.";
            break;
        default:
            lsMessage += "HTTP Error (" + pRequest.status + " " + pRequest.statusText + ").";
            if (pErrorThrown) {
                lsDescErr += 'Error[' + pErrorThrown.number + ']:';
                if (pErrorThrown.name) {
                    lsDescErr += ' ' + pErrorThrown.name + '';
                }
                if (pErrorThrown.message || pErrorThrown.description) {
                    if (pErrorThrown.message) {
                        lsDescErr += '\n* ' + jQuery.trim(pErrorThrown.message) + '';
                    } else {
                        if (pErrorThrown.description) lsDescErr += '\n* ' + jQuery.trim(pErrorThrown.description) + '';
                    }
                }
            }
            if (lsDescErr) lsMessage += '\n' + lsDescErr;
    }
    return lsMessage;
};

// Handling IE incompatibility caused by XDomainnRequest object
COCOS.Cmn.Utility.response2Xml = function (pRequest) {
    var loResult = null;

    if (pRequest.responseXML) {
        loResult = pRequest.responseXML;
    } else {
        // Create the xml document from the responseText string.
        // This uses the w3schools method.
        // see also
        if (window.DOMParser) {
            var parser = new DOMParser();
            loResult = parser.parseFromString(pRequest.responseText, 'text/xml');
            // Internet Explorer
        } else {
            loResult = new ActiveXObject('Microsoft.XMLDOM');
            loResult.async = 'false';
            loResult.loadXML(pRequest.responseText);
        }
    }
    return loResult;
};

/**
/ Pad number with zeros
* @param {string} num number to be padded
* @param {string} len length of zeroes
*/
var padWithZeroes = function(num, len) {
    var str = "" + num;
    while (str.length < len) {
        str = "0" + str;
    }
    return str;
};

/**
* @param {string} source  The source where the logging data is comming from
* @param {string} data  Data to be displayed
* @param {string} showAlert  Alerts can be enabled
*/
COCOS.Cmn.Utility.ConsoleLogger = function(source, data, showAlert) {
    var date = new Date();
    var formattedDate =
        padWithZeroes(date.getHours(), 2) + ":" +
        padWithZeroes(date.getMinutes(), 2) + ":" +
        padWithZeroes(date.getSeconds(), 2) + "." +
        padWithZeroes(date.getMilliseconds(), 3);

    if (window.console) console.log(formattedDate + " " +
        source + " - " + data);

    if (((showAlert != undefined) && (showAlert)) || COCOS.Cmn.Utility.showAlert)
        alert(source + "\n" + data);
};
