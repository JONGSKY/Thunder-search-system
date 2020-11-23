function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#profile-img-tag').attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

$("#profile-img").change(function () { //index.html line 53
    readURL(this);
    let fileName = $(this).val().split('\\').pop();
    $(this).siblings('.custom-file-label').addClass('selected').html(fileName);
});


function upload(event) {
    event.preventDefault();
    var data = new FormData($('#image_form').get(0)); //index.html line 50
    $.ajax({
        url: 'image_upload',
        type: 'POST',
        data: data,
        contentType: 'multipart/form-data',
        processData: false,
        contentType: false,
        beforeSend: function () {
            $('#results').empty()
            $('.wrap-loading').removeClass('display-none');
        },
        success: function (data) {
            $('#result_section').css('display', 'block'); // result section 보이게
            $('.wrap-loading').addClass('display-none'); // 로딩중 gif가 구현 굳이 필요는 X
            $.each(data, function (index, item) { // 여기서부터 업로드 했을 때 사진 크기 정하는 부분 같음
                var img = new Image();
                img.onload = function(){
                    var width = this.width;
                    var height = this.height;
                 
                var maxWidth = 246;
                var maxHeight = 270;
                if (width > maxWidth) {
                    ratio = maxWidth / width;
                    height = height * ratio;
                    width = width * ratio;
                }
                if (height > maxHeight) {
                    ratio = maxHeight / height;
                    height = parseInt(height * ratio);
                    width = parseInt(width * ratio);
                }
                if (height < maxHeight) {
                    var topMargin = parseInt((maxHeight - height) / 2);
                }
                if (width < maxWidth) {
                    var leftMargin = parseInt((maxWidth - width) / 2);
                    var rightMargin = parseInt((maxWidth - width) / 2);
                }

                var card_front = '<div class="col-md-3 col-sm-6 thumbnail-img">\n' +
                    '<a href="#" class="btn" data-toggle="modal" data-target="#modal-'+item.id+'">\n'+
                    '<div class="card result">\n' +
                    '<img id='+item.id+' src="/images/' + item.id + '" onerror="this.onerror=null; this.src=\'/static/image_search/images/default.png\'">\n' +
                    '<div class="card-body">\n' +
                    item.title+'\n'+
                    '</div>\n' +
                    '</div>\n' +
                    '</a>\n' +
                    '</div>';
                var modal = '<div class="modal fade" id="modal-'+item.id+'" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">\n'+
                '<div class="modal-dialog" role="document">\n'+
                '<div class="modal-content">\n'+
                '<div class="modal-header">\n'+
                '<h5 class="modal-title" id="ModalLabel">'+item.title+'</h5>\n'+
                '<button type="button" class="close" data-dismiss="modal" aria-label="Close">\n'+
                '<span aria-hidden="true">&times;</span>\n'+
                '</button>\n'+
                '</div>\n'+
                '<div class="modal-body" style="width:500px; height:270px;">\n'+
                '<span style="position:absolute; top:30px;">\n'+
                    '<img style="width:200px; height:200px;" id='+item.id+' src="/images/' + item.id + '" onerror="this.onerror=null; this.src=\'/static/image_search/images/default.png\'">\n' + 
                '</span>\n'+
                '<span style="position:absolute; right:70px; top:30px;">\n'+
                '<p>Number : '+item.number+'</p>\n'+
                '<p>Date : '+item.date+'</p>\n'+
                '<p>Status : '+item.current+'</p>\n'+
                '<p>Code : '+item.code+'</p>\n'+
                '</span>\n'+
                '<button type="button" onclick="window.open(\'http://kdtj.kipris.or.kr/kdtj/searchLogina.do?method=loginTM\');" target="_blank" class="btn btn-outline-primary" style="position:absolute; right:20px; bottom:20px;">search</button>\n'+
                '</div>\n'+
                '</div>\n'+
                '</div>\n'+
                '</div>'

                $('#results').append(card_front); // 업로드 후 결과 화면 구성
                $('#results').append(modal); // 상세 결과 modal 구현
                    var offset = $("#result_section").offset();
                    $('html, body').animate({scrollTop: offset.top}, 400);
                $('#'+item.id).css('margin-top', topMargin).css('margin-left', leftMargin).css('margin-right', rightMargin).css('height', height).css('width',width);
                $('.logo-title').css('display','inline-block').css('white-space', 'nowrap').css('overflow','hidden').css('text-overflow','ellipsis');
        };
        img.src = '/images/'+item.id
        });
        }
    });
    return false;
}

$(function () {
    $('#image_form').submit(upload);
});
