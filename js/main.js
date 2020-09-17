$(document).ready(function () {

//$('#demo').html('<table id="myTable" class="ui fixed blue single line selectable table responsive nowrap unstackable" style="width:100%;"></table>');
	
    var table = $('#myTable').DataTable({
        ajax: {
            'url':'MOCK_DATA.json', 
            //'type': 'POST',
            'dataSrc':''
        },
            columnDefs: [{
                    targets: [0, 1, 2, 3, 4],
                    visible: true,
                    orderable: true,
                    searchable: true
                },
                {
                    targets: [5],
                    searchable: true
                },
                {
                    targets: '_all',
                    visible: false,
                    orderable: false,
                    searchable: false
                }
            ],

            language: lang_kor,

            fnDrawCallback: function() {
                $("input[type='search']").attr("id", "searchBox");
            },

            initComplete: function() {
                addFooter(); //add footer from header
                // https://datatables.net/extensions/fixedheader/examples/options/columnFiltering.html
                var cloneHeader = $('#myTable thead tr').clone().appendTo('#myTable thead');
                cloneHeader.children('th').removeClass('sorting_asc');
                cloneHeader.children('th').removeClass('sorting');
                $('#myTable thead tr:eq(1) th').each(function(i) {
                    var title = $(this).text(); //<div class="ui left corner label"><i class="asterisk icon"></i></div>
                    $(this).html('<div class="ui mini left corner labeled input" style="width:100%"><input type="text" placeholder="' + title + '" class="column_search"/><div class="ui left corner label"><i class="search icon"></i></div></div>');
                    $('input', this).on('keyup change', function() {
                        if (table.column(i).search() !== this.value) {
                            table
                                .column(i)
                                .search(this.value)
                                .draw();
                        }
                    }); //on keypress 

                }); //each

            } //initComplete
        }); //.DataTable()

    /* Column별 검색기능 추가 */
    $('#myTable_filter').prepend('<select id="select"></select>');
    $('#myTable > thead > tr').children().each(function (indexInArray, valueOfElement) { 
        $('#select').append('<option>'+valueOfElement.innerHTML+'</option>');
    });
    
    $('.dataTables_filter input').unbind().bind('keyup', function () {
        var colIndex = document.querySelector('#select').selectedIndex;
        table.column(colIndex).search(this.value).draw();
    });

    /* 날짜검색 이벤트 리바인딩 */
    $('#myTable_filter').prepend('<input type="text" id="toDate" placeholder="yyyy-MM-dd"> ');
    $('#myTable_filter').prepend('<input type="text" id="fromDate" placeholder="yyyy-MM-dd">~');
    $('#toDate, #fromDate').unbind().bind('keyup',function(){
        table.draw();
    })


});

function addFooter() {
    $("#myTable").append('<tfoot></tfoot>');
    var cloneFooter = $("#example thead tr").clone().appendTo($("#example tfoot"));
}



// create table headers
function cHeader(r) {
    var jArray = [];
    for (var i in r[0]) {
        var jobj = new Object();
        jobj.title = r[0][i];
        jobj.targets = i;
        jArray.push(jobj);
    }
    // var sJson = JSON.stringify(jArray);
    return jArray;
}

// DataTables Default
var lang_eng = {
    decimal: "",
    emptyTable: "No data available in table",
    info: "Showing _START_ to _END_ of _TOTAL_ entries",
    infoEmpty: "Showing 0 to 0 of 0 entries",
    infoFiltered: "(filtered from _MAX_ total entries)",
    infoPostFix: "",
    thousands: ",",
    lengthMenu: "Show _MENU_ entries",
    loadingRecords: "Loading...",
    processing: "Processing...",
    search: "Search : ",
    zeroRecords: "No matching records found",
    paginate: {
        first: "First",
        last: "Last",
        next: "Next",
        previous: "Previous"
    },
    aria: {
        sortAscending: " :  activate to sort column ascending",
        sortDescending: " :  activate to sort column descending"
    }
};



// Korean
var lang_kor = {
    decimal: "",
    emptyTable: "데이터가 없습니다.",
    info: "_TOTAL_ 개 항목 중 _START_-_END_ 표시",
    infoEmpty: "전체 0 개 항목 중 0 ~ 0 개 보기",
    infoFiltered: "(총 _MAX_ 개 항목에서 필터링 됨)",
    infoPostFix: "",
    thousands: ",",
    lengthMenu: " _MENU_ 개씩 보기",
    loadingRecords: "로딩중...",
    processing: "처리중...",
    search: "전체검색:",
    zeroRecords: "검색된 데이터가 없습니다.",
    paginate: {
        first: "처음",
        last: "마지막",
        next: "다음",
        previous: "이전"
    },
    aria: {
        sortAscending: ": 오름차순 정렬",
        sortDescending: ": 내림차순 정렬"
    }
};
