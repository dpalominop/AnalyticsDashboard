// == NOTE ==
// This code uses ES6 promises. If you want to use this code in a browser
// that doesn't supporting promises natively, you'll have to include a polyfill.

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
   * Create a new ViewSelector2 instance to be rendered inside of an
   * element with the id "view-selector-container".
   */
  var viewSelector = new gapi.analytics.ext.ViewSelector2({
    container: 'view-selector-container',
  })
  .execute();

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
   * Update the activeUsers component, the Chartjs charts, and the dashboard
   * title whenever the user changes the view.
   */
  viewSelector.on('viewChange', function(data) {
    var title = document.getElementById('view-name');
    title.innerHTML = data.property.name + ' (' + data.view.name + ')';

    // Start tracking active users for this view.
    activeUsers.set(data).execute();

    // Render all the of charts for this view.
    countryChart.set({query: {ids: data.ids}}).execute();
    userNewUserDataChart.set({query: {ids: data.ids}}).execute();
    deviceDataChart.set({query: {ids:data.ids}}).execute();
    sessionsByBrowsersDataChart.set({query: {ids:data.ids}}).execute();
    topLandingDataChart.set({query: {ids:data.ids}}).execute();
    allPagesDataChart.set({query: {ids:data.ids}}).execute();
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

    // Render all the of charts for this view.
    countryChart.set(options).execute();
    userNewUserDataChart.set(options).execute();
    deviceDataChart.set(options).execute();
    sessionsByBrowsersDataChart.set(options).execute();
    topLandingDataChart.set(options).execute();
    allPagesDataChart.set(options).execute();

    // Update the "period" dates text.
    var datefield = document.getElementById('period');
    datefield.innerHTML = data['start-date'] + '&mdash;' + data['end-date'];
  });

  var countryChart = new gapi.analytics.googleCharts.DataChart({
    query: {
      metrics: 'ga:sessions',
      dimensions: 'ga:country',
      'start-date': '31daysAgo',
      'end-date': 'yesterday',
      'sort': '-ga:sessions',
      'max-results': '21'
    },
    chart: {
      container: 'country-container',
      type: 'GEO',
      options: {
        width: '100%'
      }
    }
  });


  /**
   * Create a new DataChart for Users
   */
  var deviceDataChart = new gapi.analytics.googleCharts.DataChart({
    query: {
      metrics: 'ga:sessions,ga:bounces',
      dimensions: 'ga:deviceCategory',
      'start-date': '31daysAgo',
      'end-date': 'yesterday'
    },
    chart: {
      container: 'device-chart-container',
      type: 'COLUMN',
      options: {
        width: '100%'
      }
    }
  });

  /**
   * Create a new DataChart for Sessions by Browsers
   */
  var sessionsByBrowsersDataChart = new gapi.analytics.googleCharts.DataChart({
    query: {
      metrics: 'ga:sessions',
      dimensions: 'ga:browser',
      'start-date': '31daysAgo',
      'end-date': 'yesterday',
      'sort': '-ga:sessions',
      'max-results': '6'
    },
    chart: {
      container: 'sessions-browsers-chart-container',
      type: 'PIE',
      options: {
        width: '100%'
      }
    }
  });

    /**
   * Create a new DataChart for Top Landing Pages
   */
  var topLandingDataChart = new gapi.analytics.googleCharts.DataChart({
    query: {
      metrics: 'ga:users,ga:sessions',
      dimensions: 'ga:landingPagePath',
      'start-date': '31daysAgo',
      'end-date': 'yesterday',
      'sort': '-ga:users',
      'max-results': '10'
    },
    chart: {
      container: 'top-landing-chart-container',
      type: 'TABLE',
      options: {
        width: '100%'
      }
    }
  });

    /**
   * Create a new DataChart for All Pages (Top Content)
   */
  var allPagesDataChart = new gapi.analytics.googleCharts.DataChart({
    query: {
      metrics: 'ga:users,ga:sessions',
      dimensions: 'ga:pagePath',
      'start-date': '31daysAgo',
      'end-date': 'yesterday',
      'sort': '-ga:users',
      'max-results': '10'
    },
    chart: {
      container: 'all-pages-chart-container',
      type: 'TABLE',
      options: {
        width: '100%'
      }
    }
  });

/**
 * 
 */

  var userNewUserDataChart = new gapi.analytics.googleCharts.DataChart({
    query:{
      metrics: 'ga:users,ga:newUsers',
      dimensions: 'ga:date',
      'start-date': '31daysAgo',
      'end-date': 'yesterday',
      'sort': 'ga:date'
    },
    chart:{
      type: 'LINE',
      container: 'userNewUser-container',
      option: {
        width: '100%'
      }
    }
  });

  // Set some global Chart.js defaults.
  Chart.defaults.global.animationSteps = 60;
  Chart.defaults.global.animationEasing = 'easeInOutQuart';
  Chart.defaults.global.responsive = true;
  Chart.defaults.global.maintainAspectRatio = false;

});
