var signupView = {
    URL: {
        signup: '',
        loginFb: '',
        fillDataStep1: '',
        childrenInformation: ''
    },
    init: function (url) {
        var base = this;
        base.URL = url;
        $('#btn-signup').click(function () {
            base._signup();
        });
        base._enterSubmitSignup();

        $('#loginFacebook').click(function () {
            base._loginFacebook();
        });
    },
    _signup: function() {
        var base = this;
        $.ajax({
            type: "POST",
            url: base.URL.signup,
            data: $('#frmSignup').serializeArray(),
            beforeSend: function(){
                $('#btn-signup').attr('disabled','disabled');
                $('.show-error').removeClass('show-error');
                $('.error').text('');
            },
            success: function (value) {
                var res = JSON.parse(value);
                if (res.status === 'success') {
                    if(res.data.isTeacher) {
                        window.location.href = base.URL.fillDataStep1;
                    } else {
                        window.location.href = base.URL.childrenInformation;
                    }
                } else {
                    $.each(res.errors, function (index, item) {
                        $('.' + item.key + '-control .error').text(item.value);
                        $('.' + item.key + '-control').addClass('show-error');
                    });
                }
            },
            complete: function () {
                $('#btn-signup').removeAttr('disabled');
            }
        });
    },
    _enterSubmitSignup: function () {
        $('#frmSignup').keypress(function (e) {
            if (e.which === 13) {
                $('#btn-signup').click();
                return false;
            }
        });
    },
    _loginFacebook: function() {
        var base = this;
        $.ajax({
            type: "POST",
            url: base.URL.loginFb,
            data: {'loginAsTeacher': true},
            success: function () {
                window.location.href = '/wp-login.php?loginSocial=facebook';
            }
        });
    }
};