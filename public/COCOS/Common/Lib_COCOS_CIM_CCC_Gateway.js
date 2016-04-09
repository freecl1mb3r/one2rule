var COCOS = COCOS || {};
COCOS.CRM = COCOS.CRM || {};
COCOS.CRM.B00C = COCOS.CRM.B00C || {};
COCOS.Cmn = COCOS.Cmn || {};
COCOS.Cmn.Utility = COCOS.Cmn.Utility || {};

//**************************************************************************
// Utility
//**************************************************************************
COCOS.Cmn.Utility.UrlProtocolHandler = COCOS.Cmn.Utility.UrlProtocolHandler || function (pUrl, pProtocol) {
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

//**************************************************************************
// RPC handlers
//**************************************************************************
COCOS.CRM.CCC_getIVRParam = function (pArray, pName) {
  for (var li = 0; li < pArray.length; li++) {
    if (pArray[li][0].toLowerCase() == pName.toLowerCase()) return pArray[li][1];
  }
  return null;
}

COCOS.CRM.CCC_B00C_Handler = function (pData) {
  $('#fAS-from').val('');
  $('#fAS-history').val('');
  $('#fAS-content').val('');
  $('#fAS-response').val('');
  $('#fAS-response').val('');
  $("input[id^=CPIVR_]").val('');

  COCOS.CRM.B00C = pData;
  
  //alert(JSON.stringify(pData));
  var a = pData;
  var aAll = [];
  var s = null;
  $('#b00c').val(JSON.stringify(pData));
  for (var key in a) {
    if (a.hasOwnProperty(key)) {
      if (key != '*') {
        s = a[key];
        if (typeof s != 'undefined' && s.indexOf('=?UTF-8?b?') == 0) s = decode64(s.substr('=?UTF-8?b?'.length).replace(/\?=/gi, ''));
        $('#' + key.toUpperCase()).val(s);
        if (key.indexOf('cpIVR_') == 0) aAll.push([key.replace(/cpIVR\_/gi, ''), s]);
      }
    }
  }
  $('#contact-data-list').html('');
  for (var li = 0; li < aAll.length; li++) {
    s = '<tr><td>' + aAll[li][0] + '</td><td>' + aAll[li][1] + '</td></tr>';
    if ($('#contact-data-list tr:last').length > 0) {
      $('#contact-data-list tr:last').after(s);
    } else {
      $('#contact-data-list').html(s);
    }
  }
  
  //Setting values
  $('#lblCAMPAIGN').html(($('#CAMPAIGN').val() ? $('#CAMPAIGN').val() : 'No data'));
  if ($('#FIRST_NAME').val() || $('#LAST_NAME').val()) {
    $('#lblCALLINGDATA').html($('#FIRST_NAME').val()  + ' ' + $('#LAST_NAME').val());
    $('#lblCALLINGDATA2').html(($('#CALLEDTELNUM').val() ? ($('#CALLEDTELNUM').val()).split('/')[0] : 'No data'));
  } else {
    $('#lblCALLINGDATA').html(($('#CALLEDTELNUM').val() ? ($('#CALLEDTELNUM').val()).split('/')[0] : 'No data'));
    $('#lblCALLINGDATA2').html('');
  }
  
  //Find Client By Phone / Address
  if ($('#CALLEDTELNUM').val()) {
    var a = COCOS.CRM.FindClientByAddress($('#CALLEDTELNUM').val());
  }
  
  //Campaign Type Related
  var contactType = $('#CALLTYPE').val();
  if (!contactType) contactType = 'call';
  switch (contactType.toLowerCase()) {
    case 'chat':
      var msgType = null;
      $('#header-message').addClass('hidden');
      $('#header-message-logo').addClass('hidden');
      $('#header-message-reply').addClass('hidden');

      // Facebook
      var sPost = null;
      if ($('#CALLUUI').val()) {
        sPost = $('#CALLUUI').val();
        if (sPost.substr(0, '$CHAT:'.length) == '$CHAT:') {
          sPost = sPost.substr('$CHAT:'.length);
          //sPost = sPost.replace(/\\/gi, '');
        }
        var post = null;
        try {
          console.log('CCC_B00C_Handler: parsing JSON.');
          post = JSON.parse(sPost);
          console.log('CCC_B00C_Handler: JSON parsed OK.');
        } catch (err) {
          sPost = null;
          post = null;
        }
      }
      if (post) {
        msgType = 'facebook';
        if (typeof post.provider != 'undefined' && typeof post.provider.objectType != 'undefined' && post.provider.objectType != '') {
          msgType = post.provider.objectType;
        }
      }
      if (!msgType) {
        sPost = $('#CPIVR_MESSAGE').val();
        if (sPost) {
          msgType = 'RTS'
        }
      }
      $('#MESSAGE_TYPE').val(msgType);
      switch (msgType) {
        case 'facebook':
          if (post.returnAddress) $('#CPIVR_RETURN_ADDRESS').val(post.returnAddress);
          if (typeof post.object != 'undefined') {
            if (post.object.id) $('#CPIVR_POSTID').val(post.object.id);
            if (post.object.objectType) $('#CPIVR_POSTTYPE').val(post.object.objectType);
            if (post.object.link) $('#CPIVR_LINK').val(post.object.link);
            if (post.object.body) $('#CPIVR_BODY').val(post.object.body);
            if (post.object.body) $('#header-message-content').html(post.object.body);
          }
          if (typeof post.target != 'undefined') {
            if (post.target.id) $('#CPIVR_POSTID').val(post.target.id);
            if (post.target.objectType) $('#CPIVR_POSTTYPE').val(post.target.objectType);
          }
          if (typeof post.actor != 'undefined') {
            if (post.actor.id) {
              $('#lblCALLINGDATA2').html('ID: ' + post.actor.id);
              $('#lblCALLINGDATA2').prop('title', 'Facebook Id');
            }
            if (post.actor.displayName) {
              if (post.actor.displayName) $('#lblCALLINGDATA').html(post.actor.displayName);
            }
          }
          /*if (post.postId) $('#CPIVR_POSTID').val(post.postId);
          if (post.orgPostId) $('#CPIVR_ORGPOSTID').val(post.orgPostId);
          if (post.link) $('#CPIVR_LINK').val(post.link);
          if (post.body) $('#CPIVR_BODY').val(post.body);
          if (post.body) $('#header-message-content').html(post.body);
          if (post.from && post.from.name) $('#lblCALLINGDATA').html(post.from.name);
          if (post.from && post.from.id) {
            $('#lblCALLINGDATA2').html('ID: ' + post.from.id);
            $('#lblCALLINGDATA2').prop('title', 'Facebook Id');
          }*/
          $('#header-message').removeClass('hidden');
          $('#header-message-logo').removeClass('hidden');
          $('#header-message-reply').removeClass('hidden');
          break;
        case 'twitter':
          if (post.returnAddress) $('#CPIVR_RETURN_ADDRESS').val(post.returnAddress);
          if (typeof post.object != 'undefined') {
            if (post.object.id) $('#CPIVR_POSTID').val(post.object.id);
            if (post.object.objectType) $('#CPIVR_POSTTYPE').val(post.object.objectType);
            if (post.object.link) $('#CPIVR_LINK').val(post.object.link);
            if (post.object.body) $('#CPIVR_BODY').val(post.object.body);
            if (post.object.body) $('#header-message-content').html(post.object.body);
          }
          if (typeof post.target != 'undefined') {
            if (post.target.id) $('#CPIVR_POSTID').val(post.target.id);
            if (post.target.objectType) $('#CPIVR_POSTTYPE').val(post.target.objectType);
          }
          if (typeof post.actor != 'undefined') {
            if (post.actor.id) {
              $('#lblCALLINGDATA2').html('ID: ' + post.actor.id);
              $('#lblCALLINGDATA2').prop('title', 'Twitter Id');
            }
            if (post.actor.displayName) {
              if (post.actor.displayName) $('#lblCALLINGDATA').html(post.actor.displayName);
            }
          }
          $('#header-message').removeClass('hidden');
          $('#header-message-logo').removeClass('hidden');
          $('#header-message-reply').removeClass('hidden');
          break;
        case 'RTS':
          if (sPost) $('#header-message-content').html(sPost);
          $('#header-message').removeClass('hidden');
          $('#header-message-reply').removeClass('hidden');
          break;
      }
      break;
    case 'email':
      var sPost = null;
      if ($('#CALLUUI').val()) {
        sPost = $('#CALLUUI').val();
        if (sPost.substr(0, '$ADD:EMAIL:'.length) == '$ADD:EMAIL:') {
          sPost = sPost.substr('$ADD:EMAIL:'.length);
          //sPost = sPost.replace(/\\/gi, '');
        }
        if (sPost != null && sPost != '') {
          document.getElementById('my_iframe').src = sPost;
          var lsMailEditorUrl = '../mail/mailClient/mail.html';
          if (COCOS != 'undefined' && COCOS.Cmn != 'undefined' && COCOS.Cmn.config != 'undefined' && COCOS.Cmn.config.webServerAddress_public != 'undefined') {
            var lsPrefix = '';
            var cfg = COCOS.Cmn.config;
            //localhost || internal address
            if ((location.hostname == 'localhost') || (cfg.webServerAddress_internal.indexOf(location.hostname) != -1)) {
              lsMailEditorUrl = COCOS.Cmn.Utility.UrlProtocolHandler(cfg.webServerAddress_internal) + 'mail/mailClient/mail.html';
            //public address
            } else { 
              lsMailEditorUrl = COCOS.Cmn.Utility.UrlProtocolHandler(cfg.webServerAddress_public) + 'mail/mailClient/mail.html';
            }
          }
          var lsOperator = '';
          if (typeof COCOS.CRM.B00C != 'undefined' && COCOS.CRM.B00C.OPERATOR != 'undefined') {
            lsOperator = COCOS.CRM.B00C.OPERATOR;
          }
          var lsCallerAddress = '';
          if (typeof COCOS.CRM.B00C != 'undefined' && COCOS.CRM.B00C.CalledTelNum != 'undefined') {
            lsCallerAddress = COCOS.CRM.B00C.CalledTelNum;
          }
          lsMailEditorUrl += '?mailPath=' + sPost + '&historyValues=OPERATER|' + lsOperator + ';ID_HISTORY_TYPE|5wq1ADA974-831B-4BED-8FFE-125D7ED9E8A6;OPOMBA|Sender:' + lsCallerAddress + ';CATI|' + '';
          $('#header-mail-logo').off('click');
          $('#header-mail-logo').click(function (e) {
            window.open(lsMailEditorUrl, 'maileditor', 'width=1024, height=768');
          });
          $('#header-mail-logo').removeClass('hidden');
        }
      }
      break;
    case 'acts':
      var sPrm = null;
      var msgType = COCOS.CRM.CCC_getIVRParam(aAll, 'ACTS_ProviderObjectType');
      if (msgType == null) {
        COCOS.CRM.toast('Contact type "acts" - no provider.', 'Info');
        return;
      }

      $('#header-message').addClass('hidden');
      $('#header-message-logo').addClass('hidden');
      $('#header-message-logo').addClass('hidden');
      $('#header-message-reply').addClass('hidden');

      $('#MESSAGE_TYPE').val(msgType);
      var sPost = COCOS.CRM.CCC_getIVRParam(aAll, 'ACTS_ObjectBody');
      if (sPost) {
        $('#CPIVR_BODY').val(sPost);
        $('#header-message-content').html(sPost);
        $('#fAS-content').val(sPost).keyup();
      }
      sPrm = COCOS.CRM.CCC_getIVRParam(aAll, 'ACTS_ObjID');
      if (sPrm) $('#CPIVR_POSTID').val(sPrm);
      sPrm = COCOS.CRM.CCC_getIVRParam(aAll, 'ACTS_Verb');
      if (sPrm) $('#CPIVR_POSTTYPE').val(sPrm);
      sPrm = COCOS.CRM.CCC_getIVRParam(aAll, 'ACTS_ObjLink');
      if (sPrm) $('#CPIVR_LINK').val(sPrm);
      sPrm = COCOS.CRM.CCC_getIVRParam(aAll, 'ACTS_ObjAttLink');
      if (sPrm) $('#CPIVR_ATT_LINK').val(sPrm);

      sPrm = COCOS.CRM.CCC_getIVRParam(aAll, 'ACTS_ActorDisplayName');
      if (sPrm) $('#fAS-from').val(sPrm).keyup();
      sPrm = COCOS.CRM.CCC_getIVRParam(aAll, 'ACTS_Published');
      sPrm = COCOS.CRM.CCC_getIVRParam(aAll, 'ACTS_replySvcAddr');
      sPrm = COCOS.CRM.CCC_getIVRParam(aAll, 'cpIVR_ACTS_replyQueueAddr');
      sPrm = COCOS.CRM.CCC_getIVRParam(aAll, 'ACTS_ProvID');
      sPrm = COCOS.CRM.CCC_getIVRParam(aAll, 'ACTS_Msg_History');
      if (sPrm) $('#fAS-history').val(sPrm).keyup();

      $('#header-message').removeClass('hidden');
      $('#header-message-detail').removeClass('hidden');
      $('#header-message-logo').removeClass('hidden');
      $('#header-message-reply').removeClass('hidden');
      break;
  }
}

COCOS.CRM.CCC_focus_REQ_Handler = function () {
  window.focus();
}

COCOS.CRM.CCC_B00E_REQ_Handler = function () {
  var data = {};

  if ($('#FIRST_NAME') && $('#FIRST_NAME').val() != null && $('#FIRST_NAME').val() != '') data.FIRST_NAME = $('#FIRST_NAME').val();
  if ($('#LAST_NAME') && $('#LAST_NAME').val() != null && $('#LAST_NAME').val() != '') data.LAST_NAME = $('#LAST_NAME').val();
  if ($('#PHONE') && $('#PHONE').val() != null && $('#PHONE').val() != '') data.PHONE = $('#PHONE').val();
  if ($('#PHONE2') && $('#PHONE2').val() != null && $('#PHONE2').val() != '') data.PHONE2 = $('#PHONE2').val();
  if ($('#E_MAIL') && $('#E_MAIL').val() != null && $('#E_MAIL').val() != '') data.E_MAIL = $('#E_MAIL').val();
  if ($('#ADDRESS') && $('#ADDRESS').val() != null && $('#ADDRESS').val() != '') data.ADDRESS = $('#ADDRESS').val();
  if ($('#ZIP_CODE') && $('#ZIP_CODE').val() != null && $('#ZIP_CODE').val() != '') data.ZIP_CODE = $('#ZIP_CODE').val();
  if ($('#CITY') && $('#CITY').val() != null && $('#CITY').val() != '') data.CITY = $('#CITY').val();
  if ($('#CAMPAIGN') && $('#CAMPAIGN').val() != null && $('#CAMPAIGN').val() != '') data.CAMPAIGN = $('#CAMPAIGN').val();
  if ($('#CALLEDTELNUM') && $('#CALLEDTELNUM').val() != null && $('#CALLEDTELNUM').val() != '') data.CALLEDTELNUM = $('#CALLEDTELNUM').val();
  if ($('#CPIVR_MESSAGE') && $('#CPIVR_MESSAGE').val() != null && $('#CPIVR_MESSAGE').val() != '') data.CPIVR_MESSAGE = $('#CPIVR_MESSAGE').val();
  if ($('#MESSAGE_TYPE') && $('#MESSAGE_TYPE').val() != null && $('#MESSAGE_TYPE').val() != '') data.MESSAGE_TYPE = $('#MESSAGE_TYPE').val();

  if ($('#CALLTYPE') && $('#CALLTYPE').val() != null && $('#CALLTYPE').val() != '') data.CALLTYPE = $('#CALLTYPE').val();
  if ($('#CALLUUI') && $('#CALLUUI').val() != null && $('#CALLUUI').val() != '') data.CALLUUI = $('#CALLUUI').val();

  if ($('#CPIVR_POSTID') && $('#CPIVR_POSTID').val() != null && $('#CPIVR_POSTID').val() != '') data.CPIVR_POSTID = $('#CPIVR_POSTID').val();
  if ($('#CPIVR_POSTTYPE') && $('#CPIVR_POSTTYPE').val() != null && $('#CPIVR_POSTTYPE').val() != '') data.CPIVR_POSTTYPE = $('#CPIVR_POSTTYPE').val();
  if ($('#CPIVR_ORGPOSTID') && $('#CPIVR_ORGPOSTID').val() != null && $('#CPIVR_ORGPOSTID').val() != '') data.CPIVR_ORGPOSTID = $('#CPIVR_ORGPOSTID').val();
  if ($('#CPIVR_ORGPOSTTYPE') && $('#CPIVR_ORGPOSTTYPE').val() != null && $('#CPIVR_ORGPOSTTYPE').val() != '') data.CPIVR_ORGPOSTTYPE = $('#CPIVR_ORGPOSTTYPE').val();
  if ($('#CPIVR_BODY') && $('#CPIVR_BODY').val() != null && $('#CPIVR_BODY').val() != '') data.CPIVR_BODY = $('#CPIVR_BODY').val();
  if ($('#CPIVR_RETURN_ADDRESS') && $('#CPIVR_RETURN_ADDRESS').val() != null && $('#CPIVR_RETURN_ADDRESS').val() != '') data.CPIVR_RETURN_ADDRESS = $('#CPIVR_RETURN_ADDRESS').val();
  if ($('#CPIVR_LINK') && $('#CPIVR_LINK').val() != null && $('#CPIVR_LINK').val() != '') data.CPIVR_LINK = $('#CPIVR_LINK').val();
  if ($('#CPIVR_ATT_LINK') && $('#CPIVR_ATT_LINK').val() != null && $('#CPIVR_ATT_LINK').val() != '') data.CPIVR_ATT_LINK = $('#CPIVR_ATT_LINK').val();
  if ($('#ACTS_REPLYSVCADDR') && $('#ACTS_REPLYSVCADDR').val() != null && $('#ACTS_REPLYSVCADDR').val() != '') data.ACTS_REPLYSVCADDR = $('#ACTS_REPLYSVCADDR').val();
  if ($('#CPIVR_ACTS_REPLYQUEUEADDR') && $('#CPIVR_ACTS_REPLYQUEUEADDR').val() != null && $('#CPIVR_ACTS_REPLYQUEUEADDR').val() != '') data.CPIVR_ACTS_REPLYQUEUEADDR = $('#CPIVR_ACTS_REPLYQUEUEADDR').val();

  COCOS.CatiRPC(
    "CCC.B00E", 
    data, 
    function () {}
  );
}
