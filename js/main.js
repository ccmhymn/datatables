$(document).ready(function () {
    var table = $('#myTable').DataTable({
        ajax: {
            'url':'MOCK_DATA.json', 
            //'type': 'POST',
            'dataSrc':''
        },
        responsive: true,
        orderMulti: true,
        order : [[1, 'desc']],
	
        columns: [
	    {"data": "id"},	
            {"data": "name"},
            {"data": "last_name"},
            {"data": "email"}, 
            {"data": "gender"}, 
            {"data": "date"}, 
            {"data": "ip_address"},
            {"data": "money"}
        ],
	
        language: lang_kor,
	    
        initComplete: function() {
		addFooter();
	}	    
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


});

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
