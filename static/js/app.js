function makeDataTable(el) {
  $("#" + el).dataTable( {
      "aaSorting": [ [0,'desc'] ],
      "aoColumns": [
          null,
          null,
          null
      ],
      "bInfo": false,
      "bFilter": false,
      "bPaginate": false
  });
}