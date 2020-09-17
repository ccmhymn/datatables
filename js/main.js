$(document).ready(function () {

	/*
    $.fn.dataTable.ext.search.push(
        function(settings, data, dataIndex){
            var min = Date.parse($('#fromDate').val());
            var max = Date.parse($('#toDate').val());
            var targetDate = Date.parse(data[5]);

            if( (isNaN(min) && isNaN(max) ) || 
                (isNaN(min) && targetDate <= max )|| 
                ( min <= targetDate && isNaN(max) ) ||
                ( targetDate >= min && targetDate <= max) ){ 
                    return true;
            }
            return false;
        }
    )
    */

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
            {"data": "first_name"},
            {"data": "last_name"}, 
            {"data": "email"}, 
            {"data": "gender"}, 
            {"data": "date"},
            {"data": "ip_address",
                "render": function(data, type, row){
                    /*
                     * 다른 column의 값을 다루고 싶을 땐
                     * row['COLUMN명'] 으로 꺼내쓸 수 있다.
                     */
                    if(type=='display'){
                        data = '<a href="'+ data + '">' + data + '</a>';
                    }
                    return data;
            }},
            {"data":"money"}
        ],
	    language: lang_kor,
        },
        /* Footer에 금액총합 구하기,
         * filtered data 총합만 계산하도록 함.*/
        "footerCallback":function(){
            var api = this.api(), data;
            var result = 0;
            api.column(7, {search:'applied'}).data().each(function(data,index){
                result += parseFloat(data);
            });
            $(api.column(3).footer()).html(result.toLocaleString()+'원');
        },
        dom : 'Blfrtip',
        buttons:[{
			extend:'csvHtml5',
			text: 'Export CSV',
			footer: true,
			bom: true,
			className: 'exportCSV'
		}]
    });

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
