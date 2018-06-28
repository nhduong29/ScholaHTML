var feedback = {
	URL : {
		feedbackAction:""
	},
	init: function(URL){
		var base = this;
		base.URL = URL;
		$("input[name='filterComment']").on("click", function(){
			base.getListFeedback($(this).val());
		});
		$(window).on("scroll", function() {
			var scrollHeight = $(document).height();
			var scrollPosition = $(window).height() + $(window).scrollTop();
			if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
				base.lazyLoad();
			}
		});
	},
	getListFeedback: function(selected){
		$.ajax({
			type: 'POST',
			url: this.URL.feedbackAction,
			data: {filter:selected, action:1},
			success: function (data) {
				$("#feedbackList").html(data);
			}
		});
	},
	lazyLoad: function(){
		var cOffset = parseInt($("#currentOffset").val());
		var maxSize = parseInt($("#maxFeedback").val());
		var selected = parseInt($("input[name='filterComment']:checked").val());
		if(cOffset < maxSize){
			cOffset = cOffset + 20;
			$("#currentOffset").val(cOffset);
			$.ajax({
			type: 'POST',
			url: this.URL.feedbackAction,
			data: {filter:selected,offset:cOffset,action:2},
			success: function (data) {
				var cData = $("#feedbackList").html();
				$("#feedbackList").html(cData + data);
			}
		});
		}
	}
};