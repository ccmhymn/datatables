$(document).ready(function() {
    var table = $('#myTable').DataTable({
        ajax: {
            'url': 'hymn-data.json',
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
/*
columnDefs: [
            { targets: 5, data: "Full가사" },
            ],
*/
         
        columns: [
            {data: "장", title: "장"},         
            {data: "제목", title: "제목"},
            {data: "분류", title: "분류"}, 
            {data: "코드", title: "코드"}, 
            {data: "박자", title: "박자"}, 
            {data: "Full가사"},          
            {data: "Trim가사"},
            {data: "악보-ID"},
            {data: "미디-ID"},
            {data: "가사-ID"}
        ],
 
        columnDefs: [{
                targets: [0, 1, 2, 3, 4],
                visible: true,
                orderable: true,
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

        // Click Row Data
        $('#myTable tbody').on('click', 'tr', function() {
          var data = table.row(this).data();
          var sJson = JSON.stringify(data);
          $('#rowData').html( "All Data : "+sJson);
          alert( 'You clicked on '+data['Full가사']+'\'s row' );
            var simpleTitle = data['제목'];
            var title = data['장'] + ". " + data['제목'] + " | " + data['분류'] + " | " + data['코드'] + " | " + data['박자'];
            var fullText = data['Full가사']; // 가사전체
            var imgUrl = "https://drive.google.com/uc?id=" + data['악보-ID']; // 이미지 다이렉트 링크
            var midiUrl = "https://drive.google.com/uc?export=download&id=" + data['미디-ID']; // 미디 다운로드 링크
            var textUrl = "https://drive.google.com/file/d/" + data['가사-ID'] + "/preview"; // 가사 미리보기 링크
            var youtubeUrl = "https://www.youtube.com/results?search_query=" + simpleTitle;
              
            $('#title').html(title);
            $('#preview').attr('src', imgUrl);
            $('#sheetImg').attr('href', imgUrl);
            $('#youtubeLink').attr('href', youtubeUrl);
            $('#fullText').html('<div class="ui top right attached label">가사</div>' + fullText);
            $('#iframeText').attr('src', textUrl);
          //alert(simpleTitle + fullText + textUrl + youtubeUrl);



        });
        // Click Row Data

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
