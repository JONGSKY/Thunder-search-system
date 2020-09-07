function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#profile-img-tag').attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

$("#profile-img").change(function () {
    readURL(this);
    let fileName = $(this).val().split('\\').pop();
    $(this).siblings('.custom-file-label').addClass('selected').html(fileName);
});


function upload(event) {
    event.preventDefault();
    var data = new FormData($('#image_form').get(0));
    $.ajax({
        url: 'predict_code',
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
            $('#result_section').removeClass('display-none');
            $('.wrap-loading').addClass('display-none');
            $.each(data, function (index, item) {
                    var row = '<tr>\n'+
                    '<td><input id="'+index+'" style="margin-left:5px;" type="checkbox"/></td>\n'+
                    '<td>'+item.code+'</td>\n'+
                    '<td>'+item.info+'</td>\n'+
                    '</tr>\n'
                    $('#rows').append(row);
                    var offset = $("#result_section").offset();
                    $('html, body').animate({scrollTop: offset.top}, 400);
        });
        }
    });
    return false;
}

$(function () {
    $('#image_form').submit(upload);
});


function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink;
    csvFile = new Blob([csv], {type: "text/csv"})
    downloadLink = document.createElement("a")
    downloadLink.href = window.URL.createObjectURL(csvFile)
    downloadLink.download = filename
    downloadLink.style.display = "none"
    document.body.appendChild(downloadLink)
    downloadLink.click()
}

function getCSV(filename) {
    var csv = []
    var rows = document.querySelectorAll("table#result-table tbody#rows tr")
    csv.push('Code\tName') 
    for (var i = 0; i< rows.length; i++) {
        var row = []
        cols = rows[i].querySelectorAll("td")
        if ($('#'+i).is(':checked')) {
        for (var j = 1; j < cols.length; j++){
            row.push(cols[j].innerText.trim())
            }
        }
        csv.push(row.join("\t"))
    
    }
    downloadCSV(csv.join("\n"), filename)
}

document.addEventListener('DOMContentLoaded', e=> {
    document.querySelector('#csvDownload').addEventListener('click', e=>{
        e.preventDefault()
        getCSV('viennaPrediction.tsv')
})
})
