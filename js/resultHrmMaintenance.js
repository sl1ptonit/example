window.hrm = window.hrm || {};

/**
 * Result speed rating
 */
hrm.resultHrmMaintenance = {

    /**
     * Config base collection.
     */
    consts: {
        multifieldCombobox: 'multifieldCombobox',
        timeInterval: 10,
        minYear: 1900,
    },

    /**
     * Common messages
     */
    messages: {
        DEFAULT_SEARCH_TEXT: 'Define inputs then click search icon',
        EXCEED_LIMIT_MESSAGE: 'Your search has returned more than 500 records. Only the first ' +
        ' 500 have been returned - refine your search to see other records.',
        HORSE_SEARCH_ERROR: 'No horse exist with uid provided',
    },

    /**
     * Config selectors collection.
     */
    selectors: {
        inputSearchDate: '.js-search-date',
        selectCountry: '#country_list',
        selectCourse: '#course_list',
        selectRaceType: '#race_type_list',
        wrapperSearchTable:  '.js-search-wrapper',
        noRecordsRow: '.no-records',

        inputSearchHorseId: '.js-horse-search-id',
        inputSearchHorseName: '.js-horse-search-name',
        buttonSearchHorseId: '.js-button-search-horse',

        buttonDaySearchAction: '.js-day-search-action',
        buttonHorseSearchAction: '.js-horse-search-action',
        buttonAddHorseResult: '.js-add-horse-result',
        buttonEditResult: '.js-edit-result-button',

        wrapperCourse: '.js-search-course-wrapper',

        searchTable: '.js-search-table',
        buttonInDevelopment: '.js-in-development',
        horseResultsAlertCloseButton: '#-alert-lightbox-button',
        resultHorseSearchRecord: '.js-horse-search-record',
        searchError: '.js-search-error',
    },

    params: {},

    base: {
        horseResultsOverlay: null,
        maxResult: 500,
        horseSearch: false,
    },

    /**
     * Init custom elements
     * @override
     */
    initCustomElements: function () {
        this.get('datepicker').initDatePicker(
            this.selectors.inputSearchDate, {
                onInputChange: true,
                validate: true,
                minYear: 1900,
            }, this.onDatepickerSelect.bind(this)
        );

        $(this.selectors.inputSearchHorseId).autoNumeric('init', {
            vMin: 0,
            vMax: 999999999,
            aSep: '',
        });

        this.initFilterDropdowns();
    },

    /**
     * Init filter dropdowns
     */
    initFilterDropdowns: function () {
        this.initCountryDropdown();
        this.initCourseDropdown();
    },

    /**
     * Init country dropdown
     */
    initCountryDropdown: function () {
        this.get(this.consts.multifieldCombobox).initCombobox(this.selectors.selectCountry, {
            autoSelect: true,
            autoFocus: true,
        }, this.requestCourseByDateCountry.bind(this));
    },

    /**
     * Init course dropdown
     */
    initCourseDropdown: function () {
        this.get(this.consts.multifieldCombobox).initCombobox(this.selectors.selectCourse, {
            autoSelect: true,
            autoFocus: true,
        }, this.beforeTriggerSearch.bind(this));
    },

    /**
     * Events initialization.
     */
    initEvents: function () {
        this.$elements.buttonInDevelopment.registerEvent('click', app.common.underConstruction);
        this.$elements.inputSearchHorseName.registerEvent('keyup input', this.onHorseSearchNameKeyUp);
        this.$elements.buttonSearchHorseId.registerEvent('click', this.onSearchHorseButtonClick);
        this.$elements.resultHorseSearchRecord.registerEvent('click', this.onSearchResultRecordClick);

        this.$elements.buttonDaySearchAction.registerEvent('click', this.onButtonDaySearchClick);
        this.$elements.buttonHorseSearchAction.registerEvent('click', this.onButtonHorseSearchClick);
        this.$elements.inputSearchHorseId.registerEvent('keyup input', this.onSearchHorseIdKeyup);

        this.$elements.buttonAddHorseResult.registerEvent('click', this.onAddHorseResultButtonClick);
        this.$elements.buttonEditResult.registerEvent('click', this.onEditResultButtonClick);
    },

    /**
     * Control keyup event for search by horse name
     * @param e
     */
    onHorseSearchNameKeyUp: function (e) {
        var $el = $(e.currentTarget);
        if($.trim($el.val())) {
            $(this.selectors.inputSearchHorseId).attr('disabled', 'disabled');
            $(this.selectors.buttonSearchHorseId).removeAttr('disabled');
        } else {
            $(this.selectors.inputSearchHorseId).removeAttr('disabled');
            $(this.selectors.buttonSearchHorseId).attr('disabled', 'disabled');
        }
    },

    /**
     * Id filter
     * @param e
     */
    onSearchHorseIdKeyup: function (e) {
        var $el = $(e.currentTarget);
        if($.trim($el.val())) {
            this.enableHorseSearch();
        } else {
            this.disableHorseSearch();
            this.disableAddHorseResult();
        }
    },

    /**
     * Enable horse search button
     */
    enableHorseSearch: function () {
        $(this.selectors.buttonHorseSearchAction).removeAttr('disabled');
    },

    /**
     * Disable horse search button
     */
    disableHorseSearch: function () {
        $(this.selectors.buttonHorseSearchAction).attr('disabled', 'disabled');
    },

    /**
     * Enable add horse result button
     */
    enableAddHorseResult: function () {
        $(this.selectors.buttonAddHorseResult).removeAttr('disabled');
        var successUid = $(this.selectors.inputSearchHorseId).val();
        $(this.selectors.inputSearchHorseId).data('last-successful-uid', successUid);
    },

    /**
     * Disable add horse result button
     */
    disableAddHorseResult: function () {
        $(this.selectors.buttonAddHorseResult).attr('disabled', 'disabled');
    },

    /**
     * Select date
     */
    onDatepickerSelect: function () {
        var $dateFrom = $(this.selectors.inputSearchDate);

        if (!this.dateIsValid($dateFrom.val())
            || !app.common.isValidDate($dateFrom.val(), {'minYear': this.consts.minYear})) {

            $dateFrom.val($dateFrom.data('default'));
            return;
        }

        this.updateCourseDropdown();
    },

    /**
     * Update course dropdown after datepicker changes
     */
    updateCourseDropdown: function () {
        this.resetCourseDropdown();
        this.requestCourseByDateCountry();
    },

    /**
     * Set default value for course dropdown
     */
    resetCourseDropdown: function () {
        this.get('multifieldCombobox').setValue(this.selectors.selectCourse, '0');
    },

    /**
     * Request Course by country
     */
    requestCourseByDateCountry: function () {
        var $dateFrom = $(this.selectors.inputSearchDate);
        var $country  = $(this.selectors.selectCountry);

        this.sendRequestFilterCourse($dateFrom.val(), $country.val());
    },

    /**
     * Request course by date
     * @param date
     */
    sendRequestFilterCourse: function (dateFrom, countryCode) {
        $.ajax(
            this.options.getCoursesByDateUrl,
            {
                type: 'get',
                data: {
                    date_from: dateFrom,
                    country_code: countryCode,
                },
                beforeSend: app.common.showLoading,
                success: this.onRequestCourseComplete.bind(this),
                complete: app.common.hideLoading,
            }
        );
    },

    /**
     * On course request complete
     * @param response
     */
    onRequestCourseComplete: function (response) {
        $(this.selectors.wrapperCourse).html(response.result);
        this.initCourseDropdown();
        $(this.selectors.wrapperSearchTable)
            .find(this.selectors.noRecordsRow)
            .text(this.messages.DEFAULT_SEARCH_TEXT);
    },

    /**
     * Validate date
     * @param dateString
     * @returns {*}
     */
    dateIsValid: function (dateString) {
        return moment(dateString, 'DD/MM/YYYY', true).isValid();
    },

    /**
     * Collect filter params to execute search
     */
    beforeTriggerSearch: function () {
        return true;
    },

    /**
     * Click on search/find horse button
     */
    onSearchHorseButtonClick: function () {
        var horseToFind = $.trim($(this.selectors.inputSearchHorseName).val());
        this.requestFindHorses(horseToFind);
    },

    /**
     * Senf request to find horses
     * @param data
     */
    requestFindHorses: function (data) {
        $.ajax(
            this.options.findHorseUrl,
            {
                type: 'get',
                data: {
                    horse_to_find: data,
                },
                beforeSend: app.common.showLoading,
                success: this.onRequestHorseComplete.bind(this),
                complete: app.common.hideLoading,
            }
        );
    },

    /**
     * Search player status
     */
    onRequestHorseComplete: function (response) {
        if (response) {
            this.base.horseResultsOverlay = response.result || response;
            if (response.exceed) {
                app.common.commonAlert(this.messages.EXCEED_LIMIT_MESSAGE);
                this.initHorseResultsAlertEvents();
            } else {
                this.showHorseResultsOverlay();
            }
        } else {
            this.base.horseResultsOverlay = false;
        }
    },

    /**
     * How horse result overlay
     */
    showHorseResultsOverlay: function () {
        $.tinybox.modal($($.parseHTML(this.base.horseResultsOverlay)));
    },

    /**
     * Events for player results exceed alert initialization
     */
    initHorseResultsAlertEvents: function() {
        $(this.selectors.horseResultsAlertCloseButton)
            .removeClass('tinyboxHide')
            .on('click', $.proxy(this.showHorseResultsOverlay, this));
    },

    /**
     * Click on search horse result record
     * @param e
     */
    onSearchResultRecordClick: function (e) {
        var $el = $(e.currentTarget);
        this.$elements.inputSearchHorseName.val($.trim($el.data('horse-name')));
        this.$elements.inputSearchHorseId.val($.trim($el.data('horse-uid')));
        this.enableHorseSearch();
        this.enableAddHorseResult();

        $.tinybox.hideModal();
    },

    /**
     * On horse search button click
     */
    onButtonHorseSearchClick: function () {
        this.base.horseSearch = true;
        var horseUid = $(this.selectors.inputSearchHorseId).val();
        this.triggerSearch({
            horse_uid: horseUid,
        }, this.onSearchComplete.bind(this));
    },

    /**
     * On day search button click
     */
    onButtonDaySearchClick: function () {
        this.base.horseSearch = false;
        var date = $(this.selectors.inputSearchDate).val();
        var country = $(this.selectors.selectCountry).val();
        var course = $(this.selectors.selectCourse).val();
        var type = $(this.selectors.selectRaceType).val();

        this.triggerSearch({
            date: date,
            country: country,
            course: course,
            type: type,
        }, this.onSearchComplete.bind(this));
    },

    /**
     * Execute main search
     * @param data
     * @param callback
     */
    triggerSearch: function(data, callback) {
        this.clearErrors();
        $.ajax(
            this.options.searchUrl,
            {
                type: 'post',
                data: data,
                beforeSend: app.common.showLoading,
                success: callback,
                complete: app.common.hideLoading,
            }
        );
    },

    /**
     * On search complete
     * @param response
     */
    onSearchComplete: function (response) {
        response.searchStatus ? this.onSearchSuccess(response) : this.onSearchError(response);
    },

    /**
     * Search success
     * @param response
     */
    onSearchSuccess: function (response) {
        $(this.selectors.wrapperSearchTable).html(response.result);
        if (this.base.horseSearch) {
            this.enableAddHorseResult();
        }
    },

    /**
     * Search error
     * @param response
     */
    onSearchError: function (response) {
        $(this.selectors.searchError).text(response.errorMessage);
        $(this.selectors.wrapperSearchTable).html(response.result);
        this.disableAddHorseResult();
    },

    /**
     * Clear error
     */
    clearErrors: function () {
        $(this.selectors.searchError).text('');
    },

    /**
     * Add horse result button clicked
     */
    onAddHorseResultButtonClick: function () {
        $.ajax(this.options.addHorseResultFormUrl, {
            type: 'get',
            data: {
                horseUid: $(this.selectors.inputSearchHorseId).data('last-successful-uid'),
            },
            beforeSend: app.common.showLoading,
            success: $.proxy(this.onAddHorseResultStatus, this),
            complete: app.common.hideLoading,
        });
    },

    /**
     * Show add horse result form
     */
    onAddHorseResultStatus: function(response) {
        $.tinybox.modal(response);
    },

    /**
     * Edit button click
     * @param e
     */
    onEditResultButtonClick: function (e) {
        var $el = $(e.currentTarget);
        window.open($el.data('url'),'_blank');
    },
};

extend(base, hrm.resultHrmMaintenance);
