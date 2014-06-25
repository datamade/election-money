(function(){
    $('table').spin('large');
    $.when(get_list('candidates')).then(
        function(resp){
            $('#candidate_list').spin(false)
            var html = append_resp(resp);
            $('#candidate_list tbody').append(html)
        }
    )
    $.when(get_list('committees')).then(
        function(resp){
            $('#committee_list').spin(false)
            var html = append_resp(resp);
            $('#committee_list tbody').append(html)
        }
    )
    $.when(get_list('receipts')).then(
        function(resp){
            var html = append_resp(resp);
            $('#receipts_list').spin(false)
            $('#receipts_list tbody').append(html)
            makeDataTable('receipts_list');
        }
    )
    $.when(get_list('expenditures')).then(
        function(resp){
            var html = append_resp(resp);
            $('#expenditures_list').spin(false)
            $('#expenditures_list tbody').append(html)
            makeDataTable('expenditures_list');
        }
    )
    $.when(get_list('officers')).then(
        function(resp){
            var html = append_resp(resp);
            $('#officers_list').spin(false)
            $('#officers_list tbody').append(html)
        }
    )
    function get_list(list_type){
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
})()
