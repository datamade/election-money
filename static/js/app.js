(function(){

    initQualityChart('quality_chart');

    load_list('candidates');
    load_list('committees');
    load_list('receipts');
    load_list('expenditures');
    load_list('officers');
    load_list('reports');
})()

function load_list(el){
    $('#' + el + '_list').spin('large');
    $.when(get_list(el)).then(
        function(resp){
            var html = append_resp(resp);
            $('#' + el + '_list').spin(false)
            $('#' + el + '_list tbody').append(html)

            makeDataTable(el + '_list');
        }
    )
}

function get_list(list_type){
    //console.log('/list/' + list_type + '/')
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

function initQualityChart(el) {
  $('#' + el).highcharts({
      chart: {
          type: 'bar'
      },
      title: {
          text: null
      },
      xAxis: {
        title: null,
          labels: {
            enabled: false
          }
      },
      yAxis:{
          title: null,
          min: 1989,
          max: 2015
      },
      plotOptions: {
          series: {
              stacking: 'true'
          }
      },
      tooltip: {
        borderColor: "#ccc",
        formatter: function() {
          return this.series.name;
        }
      },
      legend: { reversed: true },
      series: [
        {
          name: '2000 on: Electronic filings',
          data: [ 15 ],
          color: "#43ac6a",
        },
        {
          name: '1999: Incomplete',
          data: [ 1 ],
          color: "#d9edf7"
        },
        {
          name: '1994 - 1999: Manually entered',
          data: [ 5 ],
          color: "#43ac6a"
        }, 
        {
          name: '1989 - 1994: Bad entries',
          data: [ 1994 ],
          color: "#d9edf7"
        }
      ]
  });
}