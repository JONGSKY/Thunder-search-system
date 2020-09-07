// 워드클라우드

// 워드클라우드 검색어로 생성하기
$('#submit_keyword').click(function () {
    var keywords = $('#search_keyword').val().trim();
    if (keywords === "") {
        alert('검색어를 입력 후 검색해주세요!');
    } else {
        $.ajax({
            method: "GET",
            url: 'wordcloud',
            data: {'keyword': keywords},
            beforeSend: function () {
                $('html').css("cursor", "wait");
            },
            complete: function () {
                $('html').css("cursor", "auto");
            },
            success: function (data) {
                myWords = data['myWords'];
                if (myWords == "") {
                    alert(' 죄송합니다. \n 해당 검색어로는 wordcloud 제작이 어렵습니다! \n 다른 검색어로 검색해주세요');
                } else {
                    $('#result_section').css('display', 'none');
                    $('#map_section').css('display', 'none');
                    $('#wordcloud_section').css('display', 'block');
                    createWordCloud(myWords);

                    var offset = $("#wordcloud_section").offset();
                    $('html, body').animate({scrollTop: offset.top}, 400);
                }
            }
        })
    }
});

// 워드클라우드 변수 지정
var margin = {top: 10, right: 10, bottom: 10, left: 10}
var width = 568 - margin.left - margin.right;
var height = 450 - margin.top - margin.bottom;
var myWords;
var svg = d3.select("#wordcloud_svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var layout = d3.layout.cloud().size([width, height]);

// 워드클라우드 생성 함수
function createWordCloud(myWords) {
    $("#cloud_s").remove();
    layout = layout.words(myWords.map(function (d) {
        return {text: d.word, size: d.size};
    }))
        .padding(5)        //space between words
        .rotate(function () {
            return ~~(Math.random() * 2) * 90;
        })
        .fontSize(function (d) {
            return d.size;
        })      // font size of words
        .on("end", draw);
    layout.start();
}

// 워드클라우드 그리기 힘수
function draw(words) {
    svg.append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .attr("id", "cloud_s")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", function (d) {
            return d.size;
        })
        .style("fill", "#69b3a2")
        .attr("text-anchor", "middle")
        .style("font-family", "Impact")
        .attr("transform", function (d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function (d) {
            return d.text;
        })
        .on("click", function (d) {
            var ctr = d.text;
            var keyword_tag = '<div class="input-group form-inline col-3 add_keyword_group" style="margin-top: 5px;">\n' +
                '    <input type="text" name="add_keyword" class="form-control keywords" value="' + ctr + '">\n' +
                '    <div class="input-group-append div_add_keyword">\n' +
                '      <button class="btn btn-danger button_add_keyword" type="button"><i class="fa fa-times"></i></button>  \n' +
                '     </div>\n' +
                '  </div>';

            $('#keyword_list').append(keyword_tag);
            $("#cloud_s").remove();

            for (var i in myWords) {
                if (myWords[i].word === d.text) {
                    myWords.splice(i, 1);
                }
            }
            var layout = d3.layout.cloud()
                .size([width, height])
                .words(myWords.map(function (d) {
                    return {text: d.word, size: d.size};
                }))
                .padding(5)        //space between words
                .rotate(function () {
                    return ~~(Math.random() * 2) * 90;
                })
                .fontSize(function (d) {
                    return d.size;
                })      // font size of words
                .on("end", draw);
            layout.start();
        })
    ;
}

// 추가 키워드 제거 후 워드클라우드 재생성
$('body').on("click", ".div_add_keyword", function () {
    $(this).parent("div").remove();

    var del_val = $(this).parent("div").children("input").attr('value');
    $("#cloud_s").remove();
    myWords.push({word: del_val, size: "40"});

    var layout = d3.layout.cloud()
        .size([width, height])
        .words(myWords.map(function (d) {
            return {text: d.word, size: d.size};
        }))
        .padding(5)        //space between words
        .rotate(function () {
            return ~~(Math.random() * 2) * 90;
        })
        .fontSize(function (d) {
            return d.size;
        })      // font size of words
        .on("end", draw);
    layout.start();
});