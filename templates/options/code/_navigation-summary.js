gapi.analytics.ready(function() {

  /**
   * Authorize the user immediately if the user has already granted access.
   * If no access has been created, render an authorize button inside the
   * element with the ID "embed-api-auth-container".
   */
  gapi.analytics.auth.authorize({
    container: 'embed-api-auth-container',
    clientid: 'REPLACE WITH YOUR CLIENT ID'
  });

  /**
   * Query params representing the first chart's date range.
   */
  var dateRange = {
    'start-date': '31daysAgo',
    'end-date': '1daysAgo'
  };

  /**
   * Create a new ViewSelector instance to be rendered inside of an
   * element with the id "view-selector-container".
   */
  var viewSelector = new gapi.analytics.ext.ViewSelector2({
    container: 'view-selector-container'
  });

  // Render the view selector to the page.
  viewSelector.execute();

  /**
   * Create a new DateRangeSelector instance to be rendered inside of an
   * element with the id "date-range-selector-container", set its date range
   * and then render it to the page.
   */
  var dateRangeSelector = new gapi.analytics.ext.DateRangeSelector({
    container: 'date-range-selector-container'
  })
  .set(dateRange)
  .execute();

  /**
   * Create a table chart showing top browsers for users to interact with.
   * Clicking on a row in the table will update a second timeline chart with
   * data from the selected browser.
   */
  var pageChart = new gapi.analytics.googleCharts.DataChart({
    query: {
      'metrics': 'ga:pageviews',
      'dimensions': 'ga:country',
      'start-date': '31daysAgo',
      'end-date': 'yesterday',
      'sort': '-ga:pageviews',
      'max-results': '20'
    },
    chart: {
      type: 'TABLE',
      container: 'page-container',
      options: {
        width: '100%'
      }
    }
  });

  /**
   * Create a table chart showing users by device for the country the
   * user selected in the main chart.
   */
  var previousChart = new gapi.analytics.googleCharts.DataChart({
    query: {
      metrics: 'ga:users',
      dimensions: 'ga:deviceCategory',
      'start-date': '30daysAgo',
      'end-date': 'yesterday',
      'max-results': 6,
      sort: '-ga:users'
    },
    chart: {
      container: 'previous-container',
      type: 'TABLE',
      options: {
        width: '100%',
        pieHole: 4/9
      }
    }
  });

  /**
   * Create a table chart showing users by device for the country the
   * user selected in the main chart.
   */
  var nextChart = new gapi.analytics.googleCharts.DataChart({
    query: {
      metrics: 'ga:users',
      dimensions: 'ga:userGender',
      'start-date': '30daysAgo',
      'end-date': 'yesterday',
      'max-results': 6,
      sort: '-ga:users'
    },
    chart: {
      container: 'next-container',
      type: 'TABLE',
      options: {
        width: '100%',
        pieHole: 4/9
      }
    }
  });


  /**
   * Store a refernce to the row click listener variable so it can be
   * removed later to prevent leaking memory when the chart instance is
   * replaced.
   */
  var mainChartRowClickListener;

  /**
   * Update both charts whenever the selected view changes.
   */
  viewSelector.on('viewChange', function(data) {
    var options = {query: {ids: data.ids}};

    // Clean up any event listeners registered on the main chart before
    // rendering a new one.
    if (mainChartRowClickListener) {
      google.visualization.events.removeListener(mainChartRowClickListener);
    }

    pageChart.set(options).execute();
    previousChart.set(options).execute();
    nextChart.set(options).execute();
    
    var title = document.getElementById('view-name');
    title.innerHTML = data.property.name + ' (' + data.view.name + ')';
  });

  /**
   * Register a handler to run whenever the user changes the date range from
   * the first datepicker. The handler will update the first dataChart
   * instance as well as change the dashboard subtitle to reflect the range.
   */
  dateRangeSelector.on('change', function(data) {
    var options = {query: data};

    // Clean up any event listeners registered on the main chart before
    // rendering a new one.
    if (mainChartRowClickListener) {
      google.visualization.events.removeListener(mainChartRowClickListener);
    }

    pageChart.set(options).execute();
    
    previousChart.set(options).execute();
    nextChart.set(options).execute();

    // Update the "period" dates text.
    var datefield = document.getElementById('period');
    datefield.innerHTML = data['start-date'] + '&mdash;' + data['end-date'];
    var datefield2 = document.getElementById('period2');
    datefield2.innerHTML = data['start-date'] + '&mdash;' + data['end-date'];
  });


  /**
   * Each time the main chart is rendered, add an event listener to it so
   * that when the user clicks on a row, the line chart is updated with
   * the data from the browser in the clicked row.
   */
  pageChart.on('success', function(response) {
    var chart = response.chart;
    var dataTable = response.dataTable;

    // Store a reference to this listener so it can be cleaned up later.
    mainChartRowClickListener = google.visualization.events
        .addListener(chart, 'select', function(event) {

      // When you unselect a row, the "select" event still fires
      // but the selection is empty. Ignore that case.
      if (!chart.getSelection().length) return;

      var row =  chart.getSelection()[0].row;
      var country =  dataTable.getValue(row, 0);
      var options = {
        query: {
          filters: 'ga:country==' + country
        },
        chart: {
          options: {
            title: country
          }
        }
      };
      
      previousChart.set(options).execute();
      nextChart.set(options).execute();
    });
  });

});