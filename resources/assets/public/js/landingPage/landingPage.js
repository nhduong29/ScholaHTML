var landingPageView = {
    URL: {
        register: '',
        registerForm: '',
        loginFb: ''
    },
    MESSAGE: {
        registerTrialSuccess: '',
        registerTrialError: ''
    },
    setUrl: function (url) {
        this.URL = url
    },
    setMessage: function (message) {
        this.MESSAGE = message
    },
    init: function() {
        var base = this;
        $('.btnGetTrial').on('click', function () {
            var input = $(this).parent().children('input');
            var number = $(input).val();
            if (number) {
                base._registerPhone(number);
                $(input).val('');
            } else {
                $(input).focus();
            }
        });

        $('#btnRegister').on('click', function () {
            base._register();
        });

        $('.btnLoginFacebook, #btnLoginFacebook, #btnLoginFacebookMobile').on('click', function () {
            base._loginFacebook();
        });

    },
    _registerPhone: function (phoneNumber) {
        var base = this;
        if (phoneNumber) {
            $.ajax({
                type: 'POST',
                url: base.URL.register,
                data: {
                    phone: phoneNumber
                },
                success: function (data) {
                    var res = JSON.parse(data);
                    if (res.status == 'success') {
                        $('#dialogMsgRegister .message').text(base.MESSAGE.registerTrialSuccess);
                        $('#dialogMsgRegister').modal('show');
                    } else if (res.status == 'error') {
                        $('#dialogMsgRegister .message').text(base.MESSAGE.registerTrialError);
                        $('#dialogMsgRegister').modal('show');
                    }
                }
            });
        }
    },
    _register: function () {
        var base = this;
        $('.show-error').removeClass('show-error');
        $.ajax({
            type: 'POST',
            url: base.URL.registerForm,
            data: $('#formRegister').serializeArray(),
            success: function (data) {
                var res = JSON.parse(data);
                if (res.status == 'success') {
                    $('#dialogMsgRegister .message').text(base.MESSAGE.registerTrialSuccess);
                    $('#dialogMsgRegister').modal('show');
                    $('#formRegister input').val('');
                } else if (res.status == 'error') {
                    $.each(res.errors, function (index, item) {
                        $('.' + item.key + '-control .error').text(item.value);
                        $('.' + item.key + '-control').addClass('show-error');
                    });
                }
            }
        });
    },
    _loginFacebook: function() {
        var base = this;
        $.ajax({
            type: "POST",
            url: base.URL.loginFb,
            data: {'loginAsTeacher': false},
            success: function () {
                window.location.href = '/wp-login.php?loginSocial=facebook';
            }
        });
    }
}