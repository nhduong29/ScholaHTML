var fillParentInformationView = {
    URL: {
        updateInformation: '',
        fillChildrenInformation: ''
    },
    init: function (url) {
        var base = this;
        base.URL = url;
        $('#btnUpdateInformation').click(function () {
            base._updateInformation();
        });
        base._pressEnterSubmitData();
    },
    _updateInformation: function() {
        var base = this;
        $.ajax({
            type: "POST",
            url: base.URL.updateInformation,
            data: $("#frmParent").serializeArray(),
            beforeSend: function () {
                $('#btnUpdateInformation').attr('disabled', 'disabled');
                $('.show-error').removeClass('show-error');
                $('.error').text('');
            },
            success: function (value) {
                var res = JSON.parse(value);
                if (res.status === 'success') {
                    window.location.href = base.URL.fillChildrenInformation;
                } else {
                    $.each(res.errors, function (index, item) {
                        $('.' + item.key + '-control .error').text(item.value);
                        $('.' + item.key + '-control').addClass('show-error');
                    });
                }
            },
            complete: function () {
                $('#btnUpdateInformation').removeAttr('disabled');
            }
        });
    },
    _pressEnterSubmitData: function () {
        $('#frmParent').keypress(function (e) {
            if (e.which === 13) {
                $('#btnUpdateInformation').click();
                return false;
            }
        });
    }
};