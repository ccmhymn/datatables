$(document).ready(function() {
    var table = $('#myTable').DataTable({
        ajax: {
            //'url':'https://SaintSilver.github.io/datatables-ex/MOCK_DATA.json', 
            'url': 'MOCK_DATA.json',

            //'type': 'POST',
            'dataSrc': ''
        },
        select: true,
        responsive: true,
        orderMulti: true,
        processing: true,
        fixedHeader: false,
        filter: true,
        ordering: true,
        pageLength: 25,
        order: [
            [0, 'asc']
        ],

        columns: [
            {"data": "장"},
            {"data": "제목"},
            {"data": "분류"}, 
            {"data": "코드"}, 
            {"data": "박자"}, 
            {"data": "Trim가사"},
            {"data": "Full가사"}, 
            {"data": "악보-ID"},
            {"data": "미디-ID"},
            {"data": "가사-ID"}
        ],
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
            addFooter();
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
    }); //DataTable

    $('#myTable tbody').on('click', 'tr', function() {
        this_row = table.rows(this).data();
        alert("All Data : " + table.row(this).data());
    });

    /* Column별 검색기능 추가 
    $('#myTable_filter').prepend('<select id="select"></select>');
    $('#myTable > thead > tr').children().each(function (indexInArray, valueOfElement) { 
        $('#select').append('<option>'+valueOfElement.innerHTML+'</option>');
    });
    
    $('.dataTables_filter input').unbind().bind('keyup', function () {
        var colIndex = document.querySelector('#select').selectedIndex;
        table.column(colIndex).search(this.value).draw();
    });
    */

    /* 날짜검색 이벤트 리바인딩 
    $('#myTable_filter').prepend('<input type="text" id="toDate" placeholder="yyyy-MM-dd"> ');
    $('#myTable_filter').prepend('<input type="text" id="fromDate" placeholder="yyyy-MM-dd">~');
    $('#toDate, #fromDate').unbind().bind('keyup',function(){
        table.draw();
    });
    */


}); //document Ready

function addFooter() {
    $("#myTable").append('<tfoot></tfoot>');
    var cloneFooter = $("#myTable thead tr").clone().appendTo($("#myTable tfoot"));
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
