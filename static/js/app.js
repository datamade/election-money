(function(){
    load_list('candidates');
    load_list('committees');
    load_list('receipts');
    load_list('expenditures');
    load_list('officers');
})()

function load_list(el){
    $('#' + el + '_list').spin('large');
    $.when(get_list(el)).then(
        function(resp){
            var html = append_resp(resp);
            $('#' + el + '_list').spin(false)
            $('#' + el + '_list tbody').append(html)
        }
    )
}

function get_list(list_type){
    console.log('/list/' + list_type + '/')
    return $.getJSON('/list/' + list_type + '/')
}
function append_resp(data){
    var d = '';
    $.each(data, function(i, item){
        d += '<tr><td>';
        d += '<a href="https://s3.amazonaws.com/' + item.bucket + '/' + item.name + '">';
        d += ' <i class="fa fa-download"></i> ' + item.name + '</td>';
        d += '<td><span data-value="' + item.size + '">' + item.size + '</span></td>';
        d += '<td><span data-value="' + item.last_modified + '">' + item.modified_date + '</span></td></tr>';
    });
    return d
}
function makeDataTable(el) {
  $("#" + el).dataTable( {
      "aaSorting": [ [0,'desc'] ],
      "aoColumns": [
          null,
          { "sType": "data-value-num" },
          { "sType": "data-value-string" }
      ],
      "bInfo": false,
      "bFilter": false,
      "bPaginate": false
  });
}
