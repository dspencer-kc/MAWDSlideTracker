<html>
<head>
  <!--Load the AJAX API-->
  <script type="text/javascript" src="http://www.google.com/jsapi"></script>
  <script type="text/javascript" src="jquery-1.9.1.min.js"></script>
  <script type="text/javascript">

  // Load the Visualization API and the piechart,table package.
  google.load('visualization', '1', {'packages':['corechart','table']});

  function drawItems(num) {
    var jsonPieChartData = $.ajax({
      url: "getpiechartdata.php",
      data: "q="+num,
      dataType:"json",
      async: false
    }).responseText;

    var jsonTableData = $.ajax({
      url: "gettabledata.php",
      data: "q="+num,
      dataType:"json",
      async: false
    }).responseText;

    // Create our data table out of JSON data loaded from server.
    var piechartdata = new google.visualization.DataTable(jsonPieChartData);
    var tabledata = new google.visualization.DataTable(jsonTableData);

    // Instantiate and draw our pie chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(piechartdata, {
      width: 700,
      height: 500,
      chartArea: { left:"5%",top:"5%",width:"90%",height:"90%" }
    });

    // Instantiate and draw our table, passing in some options.
    var table = new google.visualization.Table(document.getElementById('table_div'));
    table.draw(tabledata, {showRowNumber: true, alternatingRowStyle: true});
  }

  </script>
</head>
<body>
  <form>
  <select name="users" onchange="drawItems(this.value)">
  <option value="">Select a month:</option>
  <?php
    $dbuser="root";
    $dbname="OPENLIS";
    $dbpass="mawdp@ssword";
    $dbserver="10.24.4.10";
    // Make a MySQL Connection
    $con = mysql_connect($dbserver, $dbuser, $dbpass) or die(mysql_error());
    mysql_select_db($dbname) or die(mysql_error());
    // Create a Query
    $sql_query = "SELECT WhoPrinted, SlideCount FROM tblSlides GROUP BY WhoPrinted ASC";
    // Execute query
    $result = mysql_query($sql_query) or die(mysql_error());
    while ($row = mysql_fetch_array($result)){
    echo '<option value='. $row['WhoPrinted'] . '>'. $row['SlideCount'] . '</option>';
    }
    mysql_close($con);
  ?>
  </select>
  </form>
  <div id="chart_div"></div>
  <div id="table_div"></div>
</body>
</html>