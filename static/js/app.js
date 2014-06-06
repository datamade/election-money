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