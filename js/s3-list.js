if (typeof S3BL_IGNORE_PATH == 'undefined' || S3BL_IGNORE_PATH!=true) {
  var S3BL_IGNORE_PATH = false;
}

function renderBucket(el, bucket_url) {
  var s3_rest_url = createS3QueryUrl(bucket_url);
  // set loading notice
  $("#" + el).spin({top: '20px'});
  $.get(s3_rest_url)
    .done(function(data) {
      var xml = $(data);
      var info = getInfoFromS3Data(xml);
      var table = renderTable(info, bucket_url);
      $("#" + el + " tbody").html(table);
      $("#" + el).spin(false);

      // initialize datatables
      // $("#" + el).dataTable( {
      //     "aaSorting": [ [0,'desc'] ],
      //     "aoColumns": [
      //         null,
      //         null,
      //         null
      //     ],
      //     "bInfo": false,
      //     "bFilter": false,
      //     "bPaginate": false
      // });
    })
    .fail(function(error) {
      alert('There was an error');
      console.log(error);
    });
}

function createS3QueryUrl(bucket_url) {

  bucket_url += '?delimiter=/';

  // handle pathes / prefixes - 2 options
  //
  // 1. Using the pathname
  // {bucket}/{path} => prefix = {path}
  // 
  // 2. Using ?prefix={prefix}
  //
  // Why both? Because we want classic directory style listing in normal
  // buckets but also allow deploying to non-buckets
  //
  // Can explicitly disable using path (useful if *not* deploying to an s3
  // bucket) by setting
  //
  // S3BL_IGNORE_PATH = true
  var rx = /.*[?&]prefix=([^&]+)(&.*)?$/;
  var prefix = '';
  if (S3BL_IGNORE_PATH==false) {
    var prefix = location.pathname.replace(/^\//, '');
  }
  var match = location.search.match(rx);
  if (match) {
    prefix = match[1];
  }
  if (prefix) {
    // make sure we end in /
    var prefix = prefix.replace(/\/$/, '') + '/';
    bucket_url += '&prefix=' + prefix;
  }
  return bucket_url;
}

function getInfoFromS3Data(xml) {
  var files = $.map(xml.find('Contents'), function(item) {
    item = $(item);
    return {
      Key: item.find('Key').text(),
      LastModified: item.find('LastModified').text(),
      Size: item.find('Size').text(),
      Type: 'file'
    }
  });
  var directories = $.map(xml.find('CommonPrefixes'), function(item) {
    item = $(item);
    return {
      Key: item.find('Prefix').text(),
      LastModified: '',
      Size: '0',
      Type: 'directory'
    }
  });
  return {
    files: files,
    directories: directories,
    prefix:  $(xml.find('Prefix')[0]).text()
  }
}

function renderTable(info, bucket_url) {

  var result = "";
  var files = info.files;

  jQuery.each(files, function(idx, item) {

    var last_mod = "";
    if (item.LastModified)
      last_mod = moment(item.LastModified).format('MMM D, YYYY h:mma');

    result += "\
      <tr>\
        <td>" + '<a href="' + bucket_url + item.Key + '"> <i class="fa fa-download"></i> ' + item.Key + '</a>' + "</td>\
        <td>" + bytesToSize(item.Size) + "</td>\
        <td>" + last_mod + "</td>\
      </tr>\
    ";
  });

  return result;
}

function bytesToSize(bytes) {
   if(bytes == 0) return '0 Byte';
   var k = 1000;
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
   var i = Math.floor(Math.log(bytes) / Math.log(k));
   return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}