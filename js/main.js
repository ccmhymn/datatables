$(document).ready(function () {

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

var table = $('#myTable').DataTable( {
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
            {"data": "ip_address"},
            {"data":"money"}
        ]
     dom : 'Blfrtip',
    
} );
 
});
