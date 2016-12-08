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
   * Create a new ActiveUsers instance to be rendered inside of an
   * element with the id "active-users-container" and poll for changes every
   * five seconds.
   */
  var activeUsers = new gapi.analytics.ext.ActiveUsers({
    container: 'active-users-container',
    pollingInterval: 5
  });


  /**
   * Add CSS animation to visually show the when users come and go.
   */
  activeUsers.once('success', function() {
    var element = this.container.firstChild;
    var timeout;

    this.on('change', function(data) {
      var element = this.container.firstChild;
      var animationClass = data.delta > 0 ? 'is-increasing' : 'is-decreasing';
      element.className += (' ' + animationClass);

      clearTimeout(timeout);
      timeout = setTimeout(function() {
        element.className =
            element.className.replace(/ is-(increasing|decreasing)/g, '');
      }, 3000);
    });
  });


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
  var countryChart = new gapi.analytics.googleCharts.DataChart({
    query: {
      'metrics': 'ga:sessions',
      'dimensions': 'ga:country',
      'start-date': '31daysAgo',
      'end-date': 'yesterday',
      'sort': '-ga:sessions',
      'max-results': '21'
    },
    chart: {
      type: 'GEO',
      container: 'country-chart-container',
      options: {
        width: '100%'
      }
    }
  });


  /**
   * Create a table chart showing Top Landing Page over time for the country the
   * user selected in the country chart.
   */
  var landingPathChart = new gapi.analytics.googleCharts.DataChart({
    query: {
      'metrics': 'ga:sessions,ga:users,ga:bounceRate',
      'dimensions': 'ga:landingPagePath',
      'start-date': '31daysAgo',
      'end-date': 'yesterday',
      'sort': '-ga:users',
      'max-results': '10'
    },
    chart: {
      type: 'TABLE',
      container: 'landingpath-chart-container',
      options: {
        width: '100%'
      }
    }
  });

  /**
   * Store a refernce to the row click listener variable so it can be
   * removed later to prevent leaking memory when the chart instance is
   * replaced.
   */
  var countryChartRowClickListener;

  var country;
  /**
   * Update both charts whenever the selected view changes.
   */
  viewSelector.on('viewChange', function(data) {
    var title = document.getElementById('view-name');
    title.innerHTML = data.property.name + ' (' + data.view.name + ')';
    // Start tracking active users for this view.
    activeUsers.set(data).execute();

    var options = {query: {ids: data.ids}};

    // Clean up any event listeners registered on the main chart before
    // rendering a new one.
    if (countryChartRowClickListener) {
      google.visualization.events.removeListener(countryChartRowClickListener);
    }

    countryChart.set(options).execute();
    landingPathChart.set(options);

    // Only render the breakdown chart if a Country filter has been set.
    if (landingPathChart.get().query.filters) landingPathChart.execute();
  });

  /**
   * Register a handler to run whenever the user changes the date range from
   * the first datepicker. The handler will update the first dataChart
   * instance as well as change the dashboard subtitle to reflect the range.
   */
  dateRangeSelector.on('change', function(data) {
    var options = {query: data};

    // Start tracking active users for this view.
    activeUsers.set(data).execute();

    // Clean up any event listeners registered on the main chart before
    // rendering a new one.
    if (countryChartRowClickListener) {
      google.visualization.events.removeListener(countryChartRowClickListener);
    }

    countryChart.set(options).execute();
    landingPathChart.set(options);

    // Only render the breakdown chart if a Country filter has been set.
    if (landingPathChart.get().query.filters) landingPathChart.execute();

    // Update the "period" dates text.
    var datefield = document.getElementById('period');
    datefield.innerHTML = data['start-date'] + '&mdash;' + data['end-date'];
  });

  /**
   * Each time the main chart is rendered, add an event listener to it so
   * that when the user clicks on a row, the line chart is updated with
   * the data from the browser in the clicked row.
   */
  countryChart.on('success', function(response) {
    var chart = response.chart;
    var dataTable = response.dataTable;

    // Store a reference to this listener so it can be cleaned up later.
    countryChartRowClickListener = google.visualization.events
        .addListener(chart, 'select', function(event) {

      // When you unselect a row, the "select" event still fires
      // but the selection is empty. Ignore that case.
      if (!chart.getSelection().length) return;

      var row =  chart.getSelection()[0].row;
      country =  dataTable.getValue(row, 0);
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

      landingPathChart.set(options).execute();
    });
  });

  // Set some global Chart.js defaults.
  Chart.defaults.global.animationSteps = 60;
  Chart.defaults.global.animationEasing = 'easeInOutQuart';
  Chart.defaults.global.responsive = true;
  Chart.defaults.global.maintainAspectRatio = false;

});
