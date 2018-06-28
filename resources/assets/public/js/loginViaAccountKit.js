var accountKitLogin = {
    URL: {
        loginViaAccountKit: '',
        childrenFillInformation: '',
    },
    accountKitInfo: {
        fbAppId: '135132240621564',
        accountKitVersion: 'v1.0',
        accountKitNonceField: '01ba997bf10b4c00954e56ce59634ad7'
    },
    messages: {
        loginFail: '',
    },
    init: function () {
        $('.btnLoginAccountKit, #btnLoginAccountKit, #btnLoginAccountKitMobile').click(function () {
            accountKitLogin.smsLogin();
        });
        var state = $('#' + accountKitLogin.accountKitInfo.accountKitNonceField).val();
        AccountKit_OnInteractive = function(){
            AccountKit.init(
                {
                    appId: accountKitLogin.accountKitInfo.fbAppId,
                    state: state,
                    version: accountKitLogin.accountKitInfo.accountKitVersion,
                    fbAppEventsEnabled:true,
                    debug:true
                }
            );
        };
    },
    smsLogin: function () {
        AccountKit.login(
            'PHONE',
            {countryCode: '+84'},
            accountKitLogin.loginCallback
        );
    },
    loginCallback: function (response) {
        if (response.status === "PARTIALLY_AUTHENTICATED") {
            var code = response.code;
            var state = response.state;
            accountKitLogin.actionLogin(state, code);
        }
        else if (response.status === "NOT_AUTHENTICATED") {

        }
        else if (response.status === "BAD_PARAMS") {
            alert ('Please fill correct your phone number');
        }
    },
    actionLogin : function(state, code) {
        $.ajax({
            type: 'POST',
            url: accountKitLogin.URL.loginViaAccountKit,
            data: {
                state: state,
                code: code
            },
            success: function (data) {
                var res = JSON.parse(data);
                if (res.status == 'success') {
                    if (res.redirect) {
                        window.location.href = res.redirect;
                    }
                } else {
                    alert(accountKitLogin.messages.loginFail);
                }
            }
        });
    }
};