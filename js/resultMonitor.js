window.hrm = window.hrm || {};

/**
 * History speed rating
 */
hrm.resultMonitor = {

    /**
     * Config base collection.
     */
    consts: {},

    /**
     * Common messages
     */
    messages: {},

    /**
     * Config selectors collection.
     */
    selectors: {
        inputRaceDate: '.js-race-date',
        buttonInDevelopment: '.js-in-development',
        meetingLink: '.js-meeting-link',
        meetingDetails: '#meeting-details-tmpl',
    },

    /**
     * Init complete
     */
    initComplete: function() {
        this.get('datepicker').initDatePicker(this.selectors.inputRaceDate, {
            validate: true,
        }, this.onSelectRaceDate.bind(this));
    },

    /**
     * On select new race date
     */
    onSelectRaceDate: function(date) {
        var dbDate = date.split('/').reverse().join('-');
        window.location.href = this.options.pageUrl + '/' + dbDate;
    },

    /**
     * Events initialization.
     */
    initEvents: function () {
        this.$elements.buttonInDevelopment.registerEvent('click', app.common.underConstruction);
        this.$elements.meetingLink.registerEvent('click', this.onMeetingDetailsClick);
    },

    /**
     * On meeting details click
     * @param e
     */
    onMeetingDetailsClick: function(e) {
        var code = e.target.dataset.code;
        $.tinybox.modal($(this.selectors.meetingDetails).tmpl({
            data: this.options.meetings[code].races,
        }));
        return false;
    },

};

extend(base, hrm.resultMonitor);
