/* global gapi */


/**
 * A DateRangeSelector component for the Embed API.
 */
gapi.analytics.ready(function() {
  let nDaysAgo = /(\d+)daysAgo/;
  let dateFormat = /\d{4}\-\d{2}\-\d{2}/;

  /**
   * Convert a date acceptable to the Core Reporting API (e.g. `today`,
   * `yesterday` or `NdaysAgo`) into the format YYYY-MM-DD. Dates
   * already in that format are simply returned.
   * @param {string} str The date string to format.
   * @return {string} The formatted date.
   */
  function convertDate(str) {
    // If str is in the proper format, do nothing.
    if (dateFormat.test(str)) return str;

    let match = nDaysAgo.exec(str);
    if (match) {
      return daysAgo(+match[1]);
    } else if (str == 'today') {
      return daysAgo(0);
    } else if (str == 'yesterday') {
      return daysAgo(1);
    } else {
      throw new Error('Cannot convert date ' + str);
    }
  }

  /**
   * Accept a number and return a date formatted as YYYY-MM-DD that
   * represents that many days ago.
   * @param {number} numDays The number of days ago whose date to return.
   * @return {string} The formatted date.
   */
  function daysAgo(numDays) {
    let date = new Date();
    date.setDate(date.getDate() - numDays);
    let month = String(date.getMonth() + 1);
    month = month.length == 1 ? '0' + month: month;
    let day = String(date.getDate());
    day = day.length == 1 ? '0' + day: day;
    return date.getFullYear() + '-' + month + '-' + day;
  }

  /**
   * 
   */
  function setQuery(start, end, gender, age){
    if(gender === 'all' & age==='all'){
      return {
        'start-date': start,
        'end-date': end,
        filters: null,
      };
    }else if(gender === 'all'){
      return {
        'start-date': start,
        'end-date': end,
        'filters': 'ga:userAgeBracket=='+age,
      };
    }else if(age === 'all'){
      return {
        'start-date': start,
        'end-date': end,
        'filters': 'ga:userGender=='+gender,
      };
    }else{
      return {
        'start-date': start,
        'end-date': end,
        'filters': 'ga:userGender=='+gender+';ga:userAgeBracket=='+age,
      };
    }
  }

  gapi.analytics.createComponent('DemographicsSelector', {

    /**
     * Initialize the DateRangeSelector instance and render it to the page.
     * @return {DemographicsSelector} The instance.
     */
    execute: function() {
      let options = this.get();
      //console.log('options')
      //console.log(options)

      options['start-date'] = options['start-date'] || '7daysAgo';
      options['end-date'] = options['end-date'] || 'yesterday';
      options['gender'] = options['gender'] || 'all';
      options['age'] = options['age'] || 'all';

      // Allow container to be a string ID or an HTMLElement.
      this.container = typeof options.container == 'string' ?
        document.getElementById(options.container) : options.container;

      // Allow the template to be overridden.
      if (options.template) this.template = options.template;

      this.container.innerHTML = this.template;
      let dateInputs = this.container.querySelectorAll('input');
      let demographicsInputs = this.container.querySelectorAll('select');

      this.startDateInput = dateInputs[0];
      this.startDateInput.value = convertDate(options['start-date']);
      this.endDateInput = dateInputs[1];
      this.endDateInput.value = convertDate(options['end-date']);

      this.genderInput = demographicsInputs[0];
      this.genderInput.value = options['gender'];
      this.ageInput = demographicsInputs[1];
      this.ageInput.value = options['age'];

      this.setValues();
      this.setMinMax();

      this.container.onchange = this.onChange.bind(this);
      return this;
    },

    /**
     * Emit a change event based on the currently selected dates.
     * Pass an object containing the start date and end date.
     */
    onChange: function() {
      this.setValues();
      this.setMinMax();
      this.emit('change', setQuery(this['start-date'],
                                    this['end-date'],
                                    this['gender'],
                                    this['age'])
                );
    },

    /**
     * Updates the instance properties based on the input values.
     */
    setValues: function() {
      this['start-date'] = this.startDateInput.value;
      this['end-date'] = this.endDateInput.value;
      this['gender'] = this.genderInput.value;
      this['age'] = this.ageInput.value;
    },

    /**
     * Updates the input min and max attributes so there's no overlap.
     */
    setMinMax: function() {
      this.startDateInput.max = this.endDateInput.value;
      this.endDateInput.min = this.startDateInput.value;
    },

    /**
     * The html structure used to build the component. Developers can
     * override this by passing it to the component constructor.
     * The only requirement is that the structure contain two inputs, the
     * first will be the start date and the second will be the end date.
     */
    template:
      '<div class="row">' +
      '<div class="col-md-8 DateRangeSelector">' +
      '  <div class="DateRangeSelector-item">' +
      '    <label>Start Date</label> ' +
      '    <input type="date">' +
      '  </div>' +
      '  <div class="DateRangeSelector-item">' +
      '    <label>End Date</label> ' +
      '    <input type="date">' +
      '  </div>' +
      '</div>' +
      '<div class="col-md-4 ViewSelector2">' +
      '  <div class="col-md-6 ViewSelector2-item">' +
      '    <label>Género</label> ' +
      '    <select class="FormField">' +
      '      <option value="all" selected>Todos</option>' +
      '      <option value="male">Hombre</option>' +
      '      <option value="female">Mujer</option>' +
      '    </select>'+
      '  </div>' +
      '  <div class="col-md-6 ViewSelector2-item"">' +
      '    <label>Edad</label> ' +
      '    <select class="FormField">' +
      '      <option value="all" selected>Todos</option>' +
      '      <option value="18-24">18-24</option>' +
      '      <option value="25-34">25-34</option>' +
      '      <option value="35-44">35-44</option>' +
      '      <option value="45-54">45-54</option>' +
      '      <option value="55-64">55-64</option>' +
      '      <option value="65+">65+</option>' +
      '    </select>'+
      '  </div>' +
      '</div>' +
      '</div>',
  });
});
