var loginView = {
    URL: {
        login: '',
        loginFb: '',
        teacherDashboard: '',
        thankYou: '',
        studentDashboard: '',
        childrenInformation: ''
    },
    init: function (url) {
        var base = this;
        base.URL = url;
        $('#btn-login').click(function () {
            base._authentication();
        });
        base._enterSubmitLogin();

        $('#loginFacebook').click(function () {
            base._loginFacebook();
        });
    },
    _authentication: function() {
        var base = this;
        $.ajax({
            type: "POST",
            url: base.URL.login,
            data: $('#frmLogin').serializeArray(),
            beforeSend: function () {
                $('#btn-login').attr('disabled', 'disabled');
                $('.show-error').removeClass('show-error');
            },
            success: function (value) {
                var res = JSON.parse(value);
                if (res.status === 'success') {
                    if(res.data.isAdmin) {
                        window.location.href = res.data.adminUrl;
                    } else if (res.data.isTeacher) {
                        if(res.data.isApprove) {
                            window.location.href = base.teacherDashboard;
                        } else {
                            window.location.href = base.thankYou;
                        }
                    } else {
                        if(res.data.existProfileStudent) {
                            window.location.href = base.studentDashboard;
                        } else {
                            window.location.href = base.childrenInformation;
                        }
                    }
                } else {
                    $.each(res.errors, function (index, item) {
                        $('.' + item.key + '-error .error').html(item.value);
                        $('.' + item.key + '-error').addClass('show-error');
                        setTimeout(function () {
                            $('.' + item.key + '-error').removeClass('show-error');
                        }, 3000);
                    });
                }
            },
            complete: function () {
                $('#btn-login').removeAttr('disabled');
            }
        });
    },
    _enterSubmitLogin: function () {
        $('#frmLogin').keypress(function (e) {
            if (e.which === 13) {
                $('#btn-login').click();
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