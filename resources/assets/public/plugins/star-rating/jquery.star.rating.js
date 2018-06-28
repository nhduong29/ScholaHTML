/**
 * jQuery Star Rating plugin
 * Joost van Velzen - http://joost.in
 *
 * v 1.0.3
 *
 * cc - attribution + share alike
 * http://creativecommons.org/licenses/by-sa/4.0/
 */

(function( $ ) {
	$.fn.addRating = function(options) {
		var obj = this;
		var settings = $.extend({
			max : 5,
			half : true,
			fieldName : 'rating',
			fieldId : 'rating',
			icon : 'star',
            callback : null
		}, options );
		this.settings = settings;
        // create the stars
        for(var i = 1 ; i <= settings.max ; i++)
		{
			var star = $('<i/>').addClass('material-icons').html(this.settings.icon+'_border').data('rating', i).appendTo(this)
                .click(function(){
                    var rate = $(this).data('rating');
                    obj.setRating(rate);
                    if (obj.settings.callback != null) {
                        obj.settings.callback($(this).parent(), rate);
                    }
				})
                .hover(
                    function(e){
                        obj.showRating($(this).data('rating'), false);
                    }, function(){
                        obj.showRating(0,false);
                    }
			    );
		}
		$(this).append('<input type="hidden" name="'+settings.fieldName+'" id="'+settings.fieldId+'" />');
	};

	$.fn.addModalRating = function(options) {
		var obj = this;
		var settings = $.extend({
			max : 5,
			half : true,
			fieldName : 'rating',
			fieldId : 'modalrating',
			icon : 'star',
            callback : null
		}, options );
		this.settings = settings;
        var startCount = $('#rating').val();
		for(var i = 1 ; i <= settings.max ; i++)
		{		
			var star_class = this.settings.icon+'_border';
			if(i <=startCount){
				star_class = this.settings.icon;
			}else{
				star_class = this.settings.icon+'_border';
			}
			var star = $('<i/>').addClass('material-icons').html(star_class).data('rating', i).appendTo(this)
                .click(function(){
                    var rate = $(this).data('rating');
					obj.setRating(rate);
                    if (obj.settings.callback != null) {
                        obj.settings.callback($(this).parent(), rate);
                    }
				})
                .hover(
                    function(e){
                    	obj.setRating($(this).data('rating'));
                        obj.showRating($(this).data('rating'), false);
                    }, function(){
                    	obj.setRating($(this).data('rating'));
                    	obj.showRating($(this).data('rating'), false);
                        /*obj.modalshowRating(0,false);*/
                    }
			    );
		}
		$(this).append('<input type="hidden" name="'+settings.fieldName+'" id="'+settings.fieldId+'" />');
	};


	$.fn.setRating = function(numRating) {
		var obj = this;
		$('#'+obj.settings.fieldId).val(numRating);
		obj.showRating(numRating, true);
	};

	$.fn.showRating = function(numRating, force) {
        obj = this;
        $(obj).find('i').each(function(){
            var icon = obj.settings.icon+'_border';
            $(this).removeClass('selected');

            if($(this).data('rating') <= numRating)
            {
                icon = obj.settings.icon;
                $(this).addClass('selected');
                $(this).css('cursor', 'pointer');
            }
            $(this).html(icon);
        })
	}

	$.fn.modalshowRating = function(numRating, force) {
        obj = this;
        /*obj.setRating(numRating);*/
        $(obj).find('i').each(function(){
            var icon = obj.settings.icon+'_border';
            $(this).removeClass('selected');

            if($(this).data('rating') <= numRating)
            {
                icon = obj.settings.icon;
                $(this).addClass('selected');
                $(this).css('cursor', 'pointer');
            }
            $(this).html(icon);
        })
	}


}( jQuery ));
