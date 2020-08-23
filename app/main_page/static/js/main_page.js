function setThumbnail(event) {
    var reader = new FileReader();
    reader.onload = function(event) {
        var img = document.createElement("img");
        img.setAttribute("src", event.target.result);
        img.setAttribute("style", "width:100%;", "height:100%;");
        document.querySelector("div#image_container").appendChild(img);
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
                $(img.target).css({
            "background-image": "url(" + window.URL.createObjectURL(files[0]) + ")",
            "outline": "none",
            "background-size": "100%"
        });
        $('#image_container_text').css({
            "display":"none",
        })
    }else{
    alert('이미지가 아닙니다.');
    return;
    }
}
$(document).ready(function(){

// 라디오버튼 클릭시 이벤트 발생
$("input:radio[name=inlineRadioOptions]").click(function(){

    if($("input[name=inlineRadioOptions]:checked").val() == "option1"){
        $(".text-search").css("display", "");
        $(".image-search").css("display", "none");

        // radio 버튼의 value 값이 1이라면 활성화

    }else if($("input[name=inlineRadioOptions]:checked").val() == "option2"){
        $(".text-search").css("display", "none");
        $(".image-search").css("display", "");
        // radio 버튼의 value 값이 0이라면 비활성화
    }
});
});
$('.page-item').click(function() {
$(this).addClass('active').siblings().removeClass('active');
})