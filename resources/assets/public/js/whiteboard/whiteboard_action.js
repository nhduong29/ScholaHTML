var objPdf;
var pageNum = 0;
var CURRENT_PAGE = 1;
var fileId = 0;
var whiteBoard = {
    URL: {
        actionLink: "",
        pdfUrl: "",
        workerSrc: "",
        fileUploadService: ""
    },
    init: function(URL){
        this.URL = URL;
        OT.checkSystemRequirements = function () {
            return true;
        };
        angular.module('demo', ['opentok', 'opentok-whiteboard']).controller('DemoCtrl', ['$scope', 'OTSession', function ($scope, OTSession) {
            $scope.connected = false;
            OTSession.init(apiKey, sessionId, token, function (err) {
                if (!err) {
                    $scope.$apply(function () {
                        $scope.connected = true;
                    });
                }
            });
        }]);
        PDFJS.workerSrc = this.URL.workerSrc;
        //this.loadPdf(this.URL.pdfUrl);
    },
    loadPdf:function (url){
        var base = this;
        var loadingTask = PDFJS.getDocument(url);
        loadingTask.promise.then(function(pdf) {
            objPdf = pdf;
            pageNum = pdf.numPages;
			$('#pdfMaxPage').html(pageNum);
            console.log('PDF loaded');
            base.loadPage(CURRENT_PAGE, pdf);
        }, function (reason) {
            console.error(reason);
        });
    },
    nextPage: function(){
        if(CURRENT_PAGE < pageNum){
            CURRENT_PAGE ++;
            this.loadPage(CURRENT_PAGE, objPdf);
            $("#pageNumber").val(CURRENT_PAGE);
        }
    },

    previous: function(){
        if(CURRENT_PAGE > 1){
            CURRENT_PAGE --;
            this.loadPage(CURRENT_PAGE, objPdf);
            $("#pageNumber").val(CURRENT_PAGE);
        }
    },
    goToPage: function (page){
        if(page >= 0 && page <= pageNum ){
            CURRENT_PAGE = page;
            this.loadPage(page, objPdf);
            $("#pageNumber").val(CURRENT_PAGE);
        }
    },
    loadPage: function(pageNum, pdf){
        $("#cPageNumber").val(pageNum);
        var pageNumber = pageNum;
        pdf.getPage(pageNumber).then(function(page) {
            var scale = 2;
            var viewport = page.getViewport(scale);
            // Prepare canvas using PDF page dimensions
            var canvas = document.getElementById('the-canvas');
            var context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            // Render PDF page into canvas context
            var renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            var renderTask = page.render(renderContext);
            renderTask.then(function () {
                console.log('Page rendered');
            });
        });
    },
    getHistory: function(page){
        var resData = "";
        $.ajax({
            async: false,
            dataType: 'json',
            type: 'POST',
            url: this.URL.actionLink,
            data: {fileId:fileId, page:page, action:"2"},
            success: function (data) {
                resData = data;
            }
        });
        return resData;
    },
    setHistory: function(page, historyData){
        $.ajax({
            type: 'POST',
            url: this.URL.actionLink,
            data: {fileId:fileId, page:page, data:historyData, action:"1"},
            success: function (resData) {

            }
        });
    },
	btnUploadAction: function(){
		var lock = $('#btnLock').val();
		if(lock === 'true'){
			return;
		}
		$('#openDocument').click();
	},
    uploadDocument: function (evt){
        var files = evt.target.files;
        var base = this;
		$('.loadingPdf').css('visibility','');
		this.lockCursor();
        if(files.length !== 0 && window.FormData !== undefined){
            var data = new FormData();
            data.append('action',4);
            for(var i = 0; i < files.length; i++){
                data.append('document',files[i]);
            }
            $.ajax({
                type: 'POST',
                url: base.URL.fileUploadService,
                data: data,
                contentType: false,
                processData: false,
                success: function (data) {
					$('#documentData').html(data);
					$('.loadingPdf').css('visibility','hidden');
					base.unlockCursor();
                }
            });
        }
		$(evt.target).val('');
    },
	lockCursor: function(){
		$('.btnOpenFile, .btnDeleteFile').addClass('disabled');
		$('.uploadBtn').css('cursor','not-allowed');
		$('#btnLock').val('true');
	},
	unlockCursor: function(){
		$('.btnOpenFile').removeClass('disabled');
		$('.uploadBtn').css('cursor','');
		$('#btnLock').val('false');
	},
	openDialogDocument: function(){
		var base = this;
		var selected = parseInt($('#selectDocType').val());
		if(selected === 3){
			$('.myFileControl').show();
		}else{
			$('.myFileControl').hide();
		}
		$.ajax({
			type: 'POST',
			url: base.URL.fileUploadService,
			data: {action:selected},
			success: function (data) {
				$('#documentData').html(data);
				$('#dialogDocument').modal('show');
			}
		});
	},
	browseFolder: function(path){
		var base = this;
		$.ajax({
			type: 'POST',
			url: base.URL.fileUploadService,
			data: {action:7, dirPath:path},
			success: function (data) {
				$('#documentData').html(data);
			}
		});
	},
	deleteDocument: function(target){
		var lock = $('#btnLock').val();
		if(lock === 'true'){
			return;
		}
		var base = this;
		var fileId = $(target).data('file-id');
		$.ajax({
			type: 'POST',
			url: base.URL.fileUploadService,
			data: {action:6, fileId:fileId},
			success: function (data) {
				if(data !== ''){
					$('#documentData').html(data);
				}
			}
		});
	},
	openPdfFromDialog: function(target){
		var lock = $('#btnLock').val();
		if(lock === 'true'){
			return;
		}
		var path = $(target).data('file-path');
		this.loadPdf(path);
		$("#cPdfUrl").val(path);
		fileId =  parseInt($(target).data('file-id'));
		$("#tmpOnloadPdf").click();
		$('#dialogDocument').modal('hide');
	},
	changeBrowserType: function(target){
		var base = this;
		var selected = parseInt($(target).val());
		if(selected === 3){
			$('.myFileControl').show();
		}else{
			$('.myFileControl').hide();
		}
		$.ajax({
			type: 'POST',
			url: base.URL.fileUploadService,
			data: {action:selected},
			success: function (data) {
				$('#documentData').html(data);
			}
		});
	}
};