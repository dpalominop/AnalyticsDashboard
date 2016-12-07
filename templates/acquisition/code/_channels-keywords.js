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
   * Query params representing the first chart's date demographics.
   */
  var dateDemographic = {
    'start-date': '31daysAgo',
    'end-date': '1daysAgo',
    'gender': 'all',
    'age':  'all'
  };

  /**
   * Create a new ViewSelector2 instance to be rendered inside of an
   * element with the id "view-selector-container".
   */
  var viewSelector = new gapi.analytics.ext.ViewSelector2({
    container: 'view-selector-container',
  })
  .execute();

  /**
   * "demographics-selector" selecciona opciones de género y edad 
   * para usarlos como filtros en los queries realizados a Google Analytics
   */
  var demographicSelector = new gapi.analytics.ext.DemographicsSelector({
    container: 'demographics-selector-container'
  })
  .set(dateDemographic)
  .execute();

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
   * Create a table chart showing Top Landing Page over time for the country the
   * user selected in the main chart.
   */
  var landingPathChart = new gapi.analytics.googleCharts.DataChart({
    query: {
      'metrics': 'ga:sessions,ga:users',
      'dimensions': 'ga:landingPagePath',
      'start-date': '31daysAgo',
      'end-date': 'yesterday',
      'sort': '-ga:users',
      'max-results': '8'
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
   * Create a table chart showing Inicial Pade next to Landing Page for the country the
   * user selected in the main chart.
   */
  var channelChart = new gapi.analytics.googleCharts.DataChart({
    query: {
      'metrics': 'ga:sessions',
      'dimensions': 'ga:channelGrouping',
      'start-date': '31daysAgo',
      'end-date': 'yesterday',
      'sort': '-ga:sessions',
      'max-results': '5'
    },
    chart: {
      type: 'PIE',
      container: 'channel-chart-container',
      options: {
        width: '100%'
      }
    }
  });

  /**
   * Create a table chart showing Inicial Pade next to Landing Page for the country the
   * user selected in the main chart.
   */
  var keywordChart = new gapi.analytics.googleCharts.DataChart({
    query: {
      'metrics': 'ga:sessions',
      'dimensions': 'ga:keyword',
      'start-date': '31daysAgo',
      'end-date': 'yesterday',
      'sort': '-ga:sessions',
      'max-results': '5'
    },
    chart: {
      type: 'PIE',
      container: 'keyword-chart-container',
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
  var countryChartClickListener;
  var landingPathChartRowClickListener;
  var channelChartRowClickListener;
  var country = null;
  var landingPagePath = null;
  /**
   * Update the activeUsers component, the Chartjs charts, and the dashboard
   * title whenever the user changes the view.
   */
  viewSelector.on('viewChange', function(data) {
    var title = document.getElementById('view-name');
    title.innerHTML = data.property.name + ' (' + data.view.name + ')';

    country = null;
    landingPagePath = null;
    var options = {query: {ids: data.ids,
                          filters: null,
                          },
                    chart: {
                      options: {
                        title: null
                      }
                    }
                };

    // Clean up any event listeners registered on the main chart before
    // rendering a new one.
    if (countryChartClickListener) {
      google.visualization.events.removeListener(countryChartClickListener);
    }

    if (landingPathChartRowClickListener) {
      google.visualization.events.removeListener(landingPathChartRowClickListener);
    }

    if (channelChartRowClickListener) {
      google.visualization.events.removeListener(channelChartRowClickListener);
    }

    // Render all the of charts for this view.
    countryChart.set(options).execute();
    landingPathChart.set(options).execute();
    channelChart.set(options).execute();
    keywordChart.set({query: {'dimensions': 'ga:keyword'}});
    keywordChart.set(options).execute();

    // Only render the breakdown chart if a Country filter has been set.
    //if (landingPathChart.get().query.filters) landingPathChart.execute();
    //if (channelChart.get().query.filters && landingPathChart.get().query.filters) channelChart.execute();
    //if (keywordChart.get().query.filters && channelChart.get().query.filters && landingPathChart.get().query.filters) keywordChart.execute();

  });

  /**
   * 
   */
  demographicSelector.on('change', function(data) {
    //console.log("demographicSelector");
    //console.log(data);
    country = null;
    landingPagePath = null;
    var options = {query: data,
                    chart: {
                      options: {
                        title: null
                      }
                    }
                  };
    console.log(options);

    // Clean up any event listeners registered on the main chart before
    // rendering a new one.
    if (countryChartClickListener) {
      google.visualization.events.removeListener(countryChartClickListener);
    }

    if (landingPathChartRowClickListener) {
      google.visualization.events.removeListener(landingPathChartRowClickListener);
    }

    if (channelChartRowClickListener) {
      google.visualization.events.removeListener(channelChartRowClickListener);
    }

    // Render all the of charts for this view.
    countryChart.set(options).execute();
    landingPathChart.set(options).execute();
    channelChart.set(options).execute();
    keywordChart.set({query: {'dimensions': 'ga:keyword'}});
    keywordChart.set(options).execute();

    // Only render the breakdown chart if a Country filter has been set.
    //if (landingPathChart.get().query.filters) landingPathChart.execute();
    //if (channelChart.get().query.filters && landingPathChart.get().query.filters) channelChart.execute();
    //if (keywordChart.get().query.filters && channelChart.get().query.filters && landingPathChart.get().query.filters) keywordChart.execute();

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
    countryChartClickListener = google.visualization.events
        .addListener(chart, 'select', function(event) {

      // When you unselect a row, the "select" event still fires
      // but the selection is empty. Ignore that case.
      if (!chart.getSelection().length) return;

      var row =  chart.getSelection()[0].row;
      country =  dataTable.getValue(row, 0);
      landingPagePath = null;
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
      channelChart.set(options).execute();
      keywordChart.set({query: {'dimensions': 'ga:keyword'}});
      keywordChart.set(options).execute();

      var title = document.getElementById('landing-subtitle');
      title.innerHTML = country;
    });
  });

    /**
   * Each time the landing chart is rendered, add an event listener to it so
   * that when the user clicks on a row, the line chart is updated with
   * the data from the country in the clicked row.
   */
  landingPathChart.on('success', function(response) {
    var chart = response.chart;
    var dataTable = response.dataTable;

    // Store a reference to this listener so it can be cleaned up later.
    landingPathChartRowClickListener = google.visualization.events
        .addListener(chart, 'select', function(event) {

      // When you unselect a row, the "select" event still fires
      // but the selection is empty. Ignore that case.
      if (!chart.getSelection().length) return;

      var row =  chart.getSelection()[0].row;
      landingPagePath = dataTable.getValue(row, 0);
      if (country){
        var options = {
          query: {
            filters: 'ga:country==' + country + ';' + 'ga:landingPagePath==' + landingPagePath
          },
          chart: {
            options: {
              title: country + ': ' + landingPagePath
            }
          }
        };
      }else{
        var options = {
          query: {
            filters: 'ga:landingPagePath==' + landingPagePath
          },
          chart: {
            options: {
              title: landingPagePath
            }
          }
        };
      }

      channelChart.set(options).execute();
      keywordChart.set({query: {'dimensions': 'ga:keyword'}});
      keywordChart.set(options).execute();
    });
  });

  /**
   * Each time the landing chart is rendered, add an event listener to it so
   * that when the user clicks on a row, the line chart is updated with
   * the data from the country in the clicked row.
   */
  channelChart.on('success', function(response) {
    var chart = response.chart;
    var dataTable = response.dataTable;

    // Store a reference to this listener so it can be cleaned up later.
    channelChartRowClickListener = google.visualization.events
        .addListener(chart, 'select', function(event) {

      // When you unselect a row, the "select" event still fires
      // but the selection is empty. Ignore that case.
      if (!chart.getSelection().length) return;

      var row =  chart.getSelection()[0].row;
      var channel = dataTable.getValue(row, 0);
      if(channel === "Organic Search") {
          keywordChart.set({query: {
              'dimensions': 'ga:keyword',
                }
          });
      }else if(channel === "Referral"){
        keywordChart.set({query: {
              'dimensions': 'ga:source',
                }
          });
      }else if(channel === "Social"){
        keywordChart.set({query: {
              'dimensions': 'ga:socialNetwork',
                }
          });
      } if(channel === "Direct"){
        keywordChart.set({query: {
              'dimensions': 'ga:landingPagePath',
                }
          });
      }

      if (country && landingPagePath){
        var options = {
          query: {
            filters: 'ga:country==' + country + ';ga:landingPagePath==' + landingPagePath + ';ga:channelGrouping==' + channel
          },
          chart: {
            options: {
              title: country + ': ' + landingPagePath + ': ' + channel
            }
          }
        };
      }else if(country){
        var options = {
          query: {
            filters: 'ga:country==' + country + ';ga:channelGrouping==' + channel
          },
          chart: {
            options: {
              title: country + ': ' + channel
            }
          }
        };
      }else if(landingPagePath){
        var options = {
          query: {
            filters: 'ga:landingPagePath==' + landingPagePath + ';ga:channelGrouping==' + channel
          },
          chart: {
            options: {
              title: landingPagePath + ': ' + channel
            }
          }
        };
      }else{
        var options = {
          query: {
            filters: 'ga:channelGrouping==' + channel
          },
          chart: {
            options: {
              title: channel
            }
          }
        };
      }

      keywordChart.set(options).execute();
    });
  });

  // Set some global Chart.js defaults.
  Chart.defaults.global.animationSteps = 60;
  Chart.defaults.global.animationEasing = 'easeInOutQuart';
  Chart.defaults.global.responsive = true;
  Chart.defaults.global.maintainAspectRatio = false;
});