//// 검색결과

function format(d) {
    return '<h5>Abstract</h5>' + d.abstract + '<br>';
}

const color = ["#FF0000", "#FF5E00", "#FFE400", "#1DDB16", "#00D8FF", "#0054FF", "#B3AEFF", "#FF00DD", "#785D12", "#8C8C8C"];

// 키워드 + 추가키워드로 검색결과 확인하기
$('#search_patent').click(function () {
    var keywords = $('#search_keyword').val().trim();
    $("input[name=add_keyword]").each(function (idx) {
        var add_keyword = $("input[name=add_keyword]:eq(" + idx + ")").val().trim();
        if (add_keyword !== "") {
            keywords = keywords + " " + add_keyword;
        }
    });
    if (keywords === "") {
        alert('검색어를 입력 후 검색해주세요!');
    } else {
        $.ajax({
            method: "GET",
            url: 'text_result',
            data: {'keyword': keywords},
            beforeSend: function () {
                // $('html').css("cursor", "wait");
                $('#keyword_list').css('display', 'none');
                $('.wrap-loading').removeClass('display-none');
            },
            complete: function () {
                //통신이 완료된 후 처리되는 함수
                $('#keyword_list').css('display', '');
                // $('html').css("cursor", "auto");
                // $('.wrap-loading').addClass('display-none');
            },
            success: function (result) {
                if (result === "") {
                    alert(' 죄송합니다. \n 해당 검색어로는 result 결과물이 없습니다! \n 다른 검색어로 검색해주세요');
                } else {
                    $('#wordcloud_section').css('display', 'none');
                    $('#map_section').css('display', 'block');
                    $('#result_section').css('display', 'block');
                    $('#result_pagination').css('display', 'block');
                    $('#search_keyword').val(keywords);
                    $('#keyword_list').empty();
                    // $("#accordion").empty();
                    $("#cloud_s").remove();
                    $("#result_table_wrapper").remove();

                    $('#result_div').append(
                        "<table id=\"result_table\" class=\"display\" style=\"width:100%\">\n" +
                        "            <thead>\n" +
                        "            <tr>\n" +
                        "                <th></th>\n" +
                        "                <th>patent_id</th>\n" +
                        "                <th>title</th>\n" +
                        "                <th>country</th>\n" +
                        "                <th>date</th>\n" +
                        "                <th>site</th>\n" +
                        "            </tr>\n" +
                        "            </thead>\n" +
                        "            <tfoot>\n" +
                        "            <tr>\n" +
                        "                <th></th>\n" +
                        "                <th>patent_id</th>\n" +
                        "                <th>title</th>\n" +
                        "                <th>country</th>\n" +
                        "                <th>date</th>\n" +
                        "                <th>site</th>\n" +
                        "            </tr>\n" +
                        "            </tfoot>\n" +
                        "        </table>"
                    );

                    var dt = $('#result_table').DataTable({
                        data: result['data_list'],
                        columns: [
                            {
                                "class": "details-control",
                                "orderable": false,
                                "data": null,
                                "defaultContent": ""
                            },
                            {data: 'patent_id'},
                            {data: 'title'},
                            {data: 'country'},
                            {data: 'date'},
                            {
                                data: "country",
                                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                                    $(nTd).html("<a target='_blank' href='http://patents.google.com/patent/" + oData.country + oData.number + oData.kind + "'>Info</a>");
                                }
                            }
                        ],
                        "order": [[4, 'desc']]
                    });

                    // Array to track the ids of the details displayed rows
                    var detailRows = [];
                    $('#result_table tbody').on('click', 'tr td.details-control', function () {
                        var tr = $(this).closest('tr');
                        var row = dt.row(tr);
                        var idx = $.inArray(tr.attr('id'), detailRows);

                        if (row.child.isShown()) {
                            tr.removeClass('details');
                            row.child.hide();

                            // Remove from the 'open' array
                            detailRows.splice(idx, 1);
                        } else {
                            tr.addClass('details');
                            row.child(format(row.data())).show();

                            // Add to the 'open' array
                            if (idx === -1) {
                                detailRows.push(tr.attr('id'));
                            }
                        }
                    });

                    // On each draw, loop over the `detailRows` array and show any child rows

                    dt.on('draw', function () {
                        $.each(detailRows, function (i, id) {
                            $('#' + id + ' td.details-control').trigger('click');
                        });
                    });


                    $(document).ready(function () {
                        /* Column별 검색기능 추가 */
                        $('#result_table_filter').prepend('<select id="select"></select>');
                        $('#result_table > thead > tr').children().each(function (indexInArray, valueOfElement) {
                            if (indexInArray == 0 | indexInArray == 5) {
                            } else {
                                $('#select').append('<option>' + valueOfElement.innerHTML + '</option>');
                            }
                        });

                        $('.dataTables_filter input').unbind().bind('keyup', function () {
                            var colIndex = document.querySelector('#select').selectedIndex + 1;
                            dt.column(colIndex).search(this.value).draw();
                        });

                    });


                    $.ajax({
                        method: "GET",
                        dataType: "json",
                        url: 'clustering_map',
                        beforeSend: function () {
                            // $('html').css("cursor", "wait");
                            // $('.wrap-loading').removeClass('display-none');
                        },
                        complete: function () {
                            //통신이 완료된 후 처리되는 함수
                            // $('html').css("cursor", "auto");
                            $('.wrap-loading').addClass('display-none');
                        },
                        success: function (result) {

                            var data = [];
                            $.each(result, function (index, item) {
                                var cluster = {
                                    name: item['label'],
                                    type: 'scatter',
                                    data: item['data'],
                                    dimensions: ['x', 'y'],
                                    symbolSize: item['size_data'],
                                    itemStyle: {
                                        opacity: 0.4,
                                        color: color[index],
                                    },
                                    large: true,
                                };
                                data.push(cluster);
                            });

                            var myChart = echarts.init(document.getElementById('chart_div'));

                            var option = {
                                title: {
                                    text: 'Patent Landscape',
                                    subtext: 'Click the point to change the datatable.',
                                    // sublink: 'https://github.com/ecomfe/echarts-stat',
                                    left: 'center'
                                },
                                grid: {
                                    // left: 40,
                                    // top: 40,
                                    // right: 40,
                                    bottom: 80
                                },
                                tooltip: {
                                    formatter: function (params) {
                                        return '[' + params.seriesName + ' ]' + '<br/>' + 'patent_id : ' + params.value[2];
                                    }
                                },
                                legend: {
                                    x: 'center', // 'center' | 'left' | {number},
                                    y: 'bottom',
                                    type: 'scroll',
                                    orient: 'horizontal', // 'vertical horizontal'
                                    // bottom:0
                                    // right: 0,
                                    // padding: 10,    // [5, 10, 15, 20]
                                },
                                xAxis: [{}],
                                yAxis: [{}],
                                animation: false,
                                series: data
                            };

                            myChart.on('click', function (params) {
                                $.ajax({
                                    method: "GET",
                                    url: 'change_data_table',
                                    data: {'index': params['seriesName']},
                                    beforeSend: function () {
                                        // $('html').css("cursor", "wait");
                                        $('.wrap-loading').removeClass('display-none');
                                    },
                                    complete: function () {
                                        //통신이 완료된 후 처리되는 함수
                                        // $('html').css("cursor", "auto");
                                        $('.wrap-loading').addClass('display-none');
                                    },
                                    success: function (result) {
                                        // console.log(result['table_list']);

                                        $('#wordcloud_section').css('display', 'none');
                                        $('#map_section').css('display', 'block');
                                        $('#result_section').css('display', 'block');
                                        $('#result_pagination').css('display', 'block');
                                        $('#search_keyword').val(keywords);
                                        $('#keyword_list').empty();
                                        // $("#accordion").empty();
                                        $("#cloud_s").remove();
                                        $("#result_table_wrapper").remove();

                                        $('#result_div').append(
                                            "<table id=\"result_table\" class=\"display\" style=\"width:100%\">\n" +
                                            "            <thead>\n" +
                                            "            <tr>\n" +
                                            "                <th></th>\n" +
                                            "                <th>patent_id</th>\n" +
                                            "                <th>title</th>\n" +
                                            "                <th>country</th>\n" +
                                            "                <th>date</th>\n" +
                                            "                <th>site</th>\n" +
                                            "            </tr>\n" +
                                            "            </thead>\n" +
                                            "            <tfoot>\n" +
                                            "            <tr>\n" +
                                            "                <th></th>\n" +
                                            "                <th>patent_id</th>\n" +
                                            "                <th>title</th>\n" +
                                            "                <th>country</th>\n" +
                                            "                <th>date</th>\n" +
                                            "                <th>site</th>\n" +
                                            "            </tr>\n" +
                                            "            </tfoot>\n" +
                                            "        </table>"
                                        );

                                        var dt = $('#result_table').DataTable({
                                            data: result['table_list'],
                                            columns: [
                                                {
                                                    "class": "details-control",
                                                    "orderable": false,
                                                    "data": null,
                                                    "defaultContent": ""
                                                },
                                                {data: 'patent_id'},
                                                {data: 'title'},
                                                {data: 'country'},
                                                {data: 'date'},
                                                {
                                                    data: "country",
                                                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                                                        $(nTd).html("<a target='_blank' href='http://patents.google.com/patent/" + oData.country + oData.number + oData.kind + "'>Info</a>");
                                                    }
                                                }
                                            ],
                                            "order": [[4, 'desc']]
                                        });

                                        // Array to track the ids of the details displayed rows
                                        var detailRows = [];
                                        $('#result_table tbody').on('click', 'tr td.details-control', function () {
                                            var tr = $(this).closest('tr');
                                            var row = dt.row(tr);
                                            var idx = $.inArray(tr.attr('id'), detailRows);

                                            if (row.child.isShown()) {
                                                tr.removeClass('details');
                                                row.child.hide();

                                                // Remove from the 'open' array
                                                detailRows.splice(idx, 1);
                                            } else {
                                                tr.addClass('details');
                                                row.child(format(row.data())).show();

                                                // Add to the 'open' array
                                                if (idx === -1) {
                                                    detailRows.push(tr.attr('id'));
                                                }
                                            }
                                        });

                                        // On each draw, loop over the `detailRows` array and show any child rows

                                        dt.on('draw', function () {
                                            $.each(detailRows, function (i, id) {
                                                $('#' + id + ' td.details-control').trigger('click');
                                            });
                                        });


                                        $(document).ready(function () {
                                            /* Column별 검색기능 추가 */
                                            $('#result_table_filter').prepend('<select id="select"></select>');
                                            $('#result_table > thead > tr').children().each(function (indexInArray, valueOfElement) {
                                                if (indexInArray == 0 | indexInArray == 5) {
                                                } else {
                                                    $('#select').append('<option>' + valueOfElement.innerHTML + '</option>');
                                                }
                                            });

                                            $('.dataTables_filter input').unbind().bind('keyup', function () {
                                                var colIndex = document.querySelector('#select').selectedIndex + 1;
                                                dt.column(colIndex).search(this.value).draw();
                                            });

                                        });

                                        var offset = $("#result_section").offset();
                                        $('html, body').animate({scrollTop: offset.top}, 400);
                                    }
                                });
                            });
                            myChart.setOption(option);

                            var offset = $("#map_section").offset();
                            $('html, body').animate({scrollTop: offset.top}, 400);
                        }
                    })
                }
            }
        })
    }
});


$('#all_view').click(function () {
    var keywords = $('#search_keyword').val().trim();
    if (keywords === "") {
        alert('검색어를 입력 후 검색해주세요!');
    } else {
        $.ajax({
            method: "GET",
            url: 'text_result',
            data: {'keyword': keywords},
            beforeSend: function () {
                // $('html').css("cursor", "wait");
                $('#keyword_list').css('display', 'none');
                $('.wrap-loading').removeClass('display-none');
            },
            complete: function () {
                //통신이 완료된 후 처리되는 함수
                $('#keyword_list').css('display', '');
                // $('html').css("cursor", "auto");
                $('.wrap-loading').addClass('display-none');
            },
            success: function (result) {
                if (result === "") {
                    alert(' 죄송합니다. \n 해당 검색어로는 result 결과물이 없습니다! \n 다른 검색어로 검색해주세요');
                } else {
                    $('#wordcloud_section').css('display', 'none');
                    $('#map_section').css('display', 'block');
                    $('#result_section').css('display', 'block');
                    $('#result_pagination').css('display', 'block');
                    $('#search_keyword').val(keywords);
                    $('#keyword_list').empty();
                    // $("#accordion").empty();
                    $("#cloud_s").remove();
                    $("#result_table_wrapper").remove();

                    $('#result_div').append(
                        "<table id=\"result_table\" class=\"display\" style=\"width:100%\">\n" +
                        "            <thead>\n" +
                        "            <tr>\n" +
                        "                <th></th>\n" +
                        "                <th>patent_id</th>\n" +
                        "                <th>title</th>\n" +
                        "                <th>country</th>\n" +
                        "                <th>date</th>\n" +
                        "                <th>site</th>\n" +
                        "            </tr>\n" +
                        "            </thead>\n" +
                        "            <tfoot>\n" +
                        "            <tr>\n" +
                        "                <th></th>\n" +
                        "                <th>patent_id</th>\n" +
                        "                <th>title</th>\n" +
                        "                <th>country</th>\n" +
                        "                <th>date</th>\n" +
                        "                <th>site</th>\n" +
                        "            </tr>\n" +
                        "            </tfoot>\n" +
                        "        </table>"
                    );

                    var dt = $('#result_table').DataTable({
                        data: result['data_list'],
                        columns: [
                            {
                                "class": "details-control",
                                "orderable": false,
                                "data": null,
                                "defaultContent": ""
                            },
                            {data: 'patent_id'},
                            {data: 'title'},
                            {data: 'country'},
                            {data: 'date'},
                            {
                                data: "country",
                                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                                    $(nTd).html("<a target='_blank' href='http://patents.google.com/patent/" + oData.country + oData.number + oData.kind + "'>Info</a>");
                                }
                            }
                        ],
                        "order": [[4, 'desc']]
                    });

                    // Array to track the ids of the details displayed rows
                    var detailRows = [];
                    $('#result_table tbody').on('click', 'tr td.details-control', function () {
                        var tr = $(this).closest('tr');
                        var row = dt.row(tr);
                        var idx = $.inArray(tr.attr('id'), detailRows);

                        if (row.child.isShown()) {
                            tr.removeClass('details');
                            row.child.hide();

                            // Remove from the 'open' array
                            detailRows.splice(idx, 1);
                        } else {
                            tr.addClass('details');
                            row.child(format(row.data())).show();

                            // Add to the 'open' array
                            if (idx === -1) {
                                detailRows.push(tr.attr('id'));
                            }
                        }
                    });

                    // On each draw, loop over the `detailRows` array and show any child rows

                    dt.on('draw', function () {
                        $.each(detailRows, function (i, id) {
                            $('#' + id + ' td.details-control').trigger('click');
                        });
                    });


                    $(document).ready(function () {
                        /* Column별 검색기능 추가 */
                        $('#result_table_filter').prepend('<select id="select"></select>');
                        $('#result_table > thead > tr').children().each(function (indexInArray, valueOfElement) {
                            if (indexInArray == 0 | indexInArray == 5) {
                            } else {
                                $('#select').append('<option>' + valueOfElement.innerHTML + '</option>');
                            }
                        });

                        $('.dataTables_filter input').unbind().bind('keyup', function () {
                            var colIndex = document.querySelector('#select').selectedIndex + 1;
                            dt.column(colIndex).search(this.value).draw();
                        });

                    });

                    var offset = $("#result_section").offset();
                    $('html, body').animate({scrollTop: offset.top}, 400);

                }
            }
        })
    }
});