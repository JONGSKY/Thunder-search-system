function setThumbnail(events) {
    var reader = new FileReader();
    reader.onload = function(event) {
        $('#image_container').html('');
        var img = document.createElement("img");
        img.setAttribute("id", "innerImg");
        img.setAttribute("src", event.target.result);
        img.setAttribute("style", "height:90%;");
        document.querySelector("div#image_container").appendChild(img);
        $('#image_container').css({
            'outline':'none',
        });
        $('#image_container').css({
            'background-color' : '#28b76b',
            'border' : 'none',
            'outline':'none',
        });
        var imgName = document.createElement("p");
        document.getElementById("image_container").appendChild(imgName);
        imgName.setAttribute('style', 'font-size:12px');
        imgName.setAttribute('id', 'imgTitle');
        $('#imgTitle').text(events.target.files[0].name);
    };
    
    reader.readAsDataURL(event.target.files[0]);
}
$('#image_container')
.on("dragover", dragOver)
.on("dragleave", dragOver)
.on("drop", uploadFiles);

function dragOver(img){
    img.stopPropagation();
    img.preventDefault();
    
}

function uploadFiles(img) {
    img.stopPropagation();
    img.preventDefault();
    dragOver(img);

    img.dataTransfer = img.originalEvent.dataTransfer;
    var files = img.target.files || img.dataTransfer.files;
    if (files.length > 1) {
        alert('하나만 올려주세요.');
        return;
    }
    if (files[0].type.match(/image.*/)) {
            var addImg = document.getElementById("image_container");
            var img = document.createElement("img");
            $('#image_container').html('');
            img.setAttribute('id','innerImg');
            img.setAttribute('src', window.URL.createObjectURL(files[0]));
            addImg.appendChild(img);
            $('#innerImg').css({
                'height':'90%',
            })
            $('#image_container').css({
                'background-color' : '#28b76b',
                'border' : 'none',
                'outline':'none',
            });
            $('#image_container_text').css({
                'display':'none',
            });
            var imgName = document.createElement("p");
            addImg.appendChild(imgName);
            imgName.setAttribute('style', 'font-size:12px');
            imgName.setAttribute('id', 'imgTitle');
            $('#imgTitle').text(files[0].name);
            
    }else{
    alert('이미지가 아닙니다.');
    return;
    }
}
$(document).ready(function(){

// 라디오버튼 클릭시 이벤트 발생
$("input:radio[name=inlineRadioOptions]").click(function(){

    if($("input[name=inlineRadioOptions]:checked").val() == "option1"){
        $(".tm-search").css("display", "");
        $(".vienna-search").css("display", "none");
        // radio 버튼의 value 값이 1이라면 활성화

    }else if($("input[name=inlineRadioOptions]:checked").val() == "option2"){
        $(".tm-search").css("display", "none");
        $(".vienna-search").css("display", "");
        // radio 버튼의 value 값이 0이라면 비활성화
    }
});
});

// ------ auto re-size image ------

$(document).ready(function(){
    $(".thumbnail-img").each(function (index, img){
        if($(img).width() < $(img).height()){
            $(img).addClass("thumbnail-height");
        }else if($(img).width() > $(img).height()){
            $(img).addClass("thumbnail-width");
        }else {
            $(img).addClass("thumbnail-width");
        }
    })
    
});

// ------ auto resize modal image ------
$('.card').click(function(){
    $(".thumbnail-img").each(function (index, img){
        if($(img).width() < $(img).height()){
            $(img).addClass("thumbnail-height");
        }else if($(img).width() > $(img).height()){
            $(img).addClass("thumbnail-width");
        }else {
            $(img).addClass("thumbnail-width");
        }
    })
});

$(document).ready(function(){
    $(".thumbnail-img").each(function (index, img){
        console.log($(img).height());
        console.log($(img).width());
    });
});
// ------ pagination control ------

$('.page-num').click(function() {
    $(this).addClass('active').siblings().removeClass('active');
});

$('.page-next').click(function(){
    $('.active').next(".page-num").addClass('active').siblings().removeClass('active');
});

$('.page-pre').click(function(){
    $('.active').prev('.page-num').addClass('active').siblings().removeClass('active');
});