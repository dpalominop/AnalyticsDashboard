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
   * Create a new ViewSelector instance to be rendered inside of an
   * element with the id "view-selector-container".
   */
  var viewSelector = new gapi.analytics.ViewSelector({
    container: 'view-selector-container'
  });

  // Render the view selector to the page.
  viewSelector.execute();


  /**
   * Create a new DataChart instance with the given query parameters
   * and Google chart options. It will be rendered inside an element
   * with the id "chart-container".
   */
  var dataChart = new gapi.analytics.googleCharts.DataChart({
    query: {
      metrics: 'ga:sessions',
      dimensions: 'ga:country',
      'start-date': '31daysAgo',
      'end-date': 'yesterday'
    },
    chart: {
      container: 'chart-container',
      type: 'GEO',
      options: {
        width: '100%'
      }
    }
  });

  /**
   * Create a new DataChart for New Users
   */
  var newUsersDataChart = new gapi.analytics.googleCharts.DataChart({
    query: {
      metrics: 'ga:newUsers',
      dimensions: 'ga:date',
      'start-date': '31daysAgo',
      'end-date': 'yesterday'
    },
    chart: {
      container: 'new-users-chart-container',
      type: 'LINE',
      options: {
        width: '100%'
      }
    }
  });

  /**
   * Create a new DataChart for Users
   */
  var usersDataChart = new gapi.analytics.googleCharts.DataChart({
    query: {
      metrics: 'ga:users',
      dimensions: 'ga:date',
      'start-date': '31daysAgo',
      'end-date': 'yesterday'
    },
    chart: {
      container: 'users-chart-container',
      type: 'LINE',
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
      type: 'TABLE',
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
      metrics: 'ga:users',
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
      metrics: 'ga:users',
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
   * Render the dataChart on the page whenever a new view is selected.
   */
  viewSelector.on('change', function(ids) {
    dataChart.set({query: {ids: ids}}).execute();
    newUsersDataChart.set({query: {ids:ids}}).execute();
    usersDataChart.set({query: {ids:ids}}).execute();
    sessionsByBrowsersDataChart.set({query: {ids:ids}}).execute();
    topLandingDataChart.set({query: {ids:ids}}).execute();
    allPagesDataChart.set({query: {ids:ids}}).execute();
  });

});
