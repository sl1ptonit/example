window.hrm = hrm || {};

hrm.resultEditHorseRace = {
    /**
     * Config options collection.
     */
    options: {
        raceListUrl: null,
        runnerListUrl: null,
        saveRaceRunnerUrl: null,
        currencyConvertToolUrl: null,
        currencyConvertUrl: null,
    },

    /**
     * Common messages
     */
    messages: {
        RACE_RUNNER_EMPTY_DISTANCE: 'Distance: Value is required and can\'t be empty',
        RACE_RUNNER_EMPTY_COURSE: 'Course: Value is required and can\'t be empty',
        RACE_RUNNER_EMPTY_TIME: 'Time: Value is required and can\'t be empty',
        RACE_RUNNER_EMPTY_RACE_TYPE: 'Type: Value is required and can\'t be empty',
        RACE_RUNNER_EMPTY_POSITION: 'Position: Value is required and can\'t be empty',
    },

    /**
     * Config base collection.
     */
    base: {
        rowHighlightClass: 'row-highlight',
        editMode: false,
        selectedRace: null,
    },

    /**
     * Config selectors collection.
     */
    selectors: {
        addResultForm: '.js-add-result-form',
        date: '.js-add-result-date',
        buttonNewRace: '.js-add-result-button-new-race',
        raceDataInputs: '.js-add-result-race-data',
        raceDataCourse: '.js-add-result-course-select',
        raceDataTime: '.js-add-result-time',
        raceDataType: '.js-add-result-type-select',
        raceDataM: '.js-add-result-m',
        raceDataF: '.js-add-result-f',
        raceDataY: '.js-add-result-y',
        raceDataGoing: '.js-add-result-going-select',
        raceDataRaceUid: '.js-add-result-race-uid',
        runnerDataInputs: '.js-add-result-runner-data',
        runnerDataPosition: '.js-add-result-position-select',
        runnerDataPrize: '.js-add-result-prize',
        buttonCurrencyConverter: '.js-add-result-button-convert',
        buttonSaveClose: '.js-add-result-button-save-close',
        raceListBlock: '.js-add-result-race-list',
        raceRow: '.js-add-result-race-row',
        runnersListBlock: '.js-add-result-runners-list',
        buttonSelectRace: '.js-add-result-button-select-race',
        errorContainer: '.js-error-container',
        currencyToolAmount: '.js-currency-convert-amount',
        currencyToolCurrency: '.js-currency-convert-currency',
        currencyToolButtonConvert: '.js-currency-convert-button-convert',
        currencyToolButtonCancel: '.js-currency-convert-button-cancel',
    },

    /**
     * Config elements collection.
     */
    $el: {
        addResultForm: null,
        date: null,
        buttonNewRace: null,
        raceDataInputs: null,
        raceDataCourse: null,
        raceDataTime: null,
        raceDataType: null,
        raceDataM: null,
        raceDataF: null,
        raceDataY: null,
        raceDataGoing: null,
        raceDataRaceUid: null,
        runnerDataInputs: null,
        runnerDataPosition: null,
        runnerDataPrize: null,
        buttonCurrencyConverter: null,
        buttonSaveClose: null,
        raceListBlock: null,
        raceRow: null,
        runnersListBlock: null,
        buttonSelectRace: null,
        errorContainer: null,
        currencyToolAmount: null,
        currencyToolCurrency: null,
        currencyToolButtonConvert: null,
        currencyToolButtonCancel: null,
    },

    /**
     * Initialization.
     * @constructor
     */
    init: function (options) {
        this.options = options;
        this.base.editMode = false;

        this.initElements();
        this.initEvents();
        this.initDatepickers();
    },

    /**
     * Elements initialization.
     */
    initElements: function () {
        for (var property in this.selectors) {
            if (this.$el[property] !== undefined && this.selectors.hasOwnProperty(property)) {
                this.$el[property] = $(this.selectors[property]);
            }
        }
    },

    /**
     * Events initialization
     */
    initEvents: function () {
        this.$el.buttonNewRace.on('click', $.proxy(this.onNewRaceButtonClick, this));
        this.$el.buttonSelectRace.on('click', $.proxy(this.onSelectRaceButtonClick, this));
        this.$el.buttonCurrencyConverter.on('click', $.proxy(this.onConvertButtonClick, this));
        this.$el.buttonSaveClose.on('click', $.proxy(this.onSaveCloseButtonClick, this));
    },

    /**
     * Events initialization
     */
    initRaceEvents: function () {
        this.$el.raceRow.on('click', $.proxy(this.onRaceRowClick, this));
    },

    /**
     * Events initialization
     */
    initConvertToolEvents: function () {
        $(this.selectors.currencyToolButtonConvert).on('click',
            $.proxy(this.onConvertToolConvertButtonClick, this));
        $(this.selectors.currencyToolButtonCancel).on('click',
            $.proxy(this.onConvertToolCancelButtonClick, this));
    },

    /**
     * Init datepickers
     */
    initDatepickers: function () {
        components.datepicker.initDatePicker(this.selectors.date, {
            onInputChange: true,
        }, this.onDatepickerChange.bind(this));
    },

    /**
     * Init race custom elements
     */
    initRaceCustomElements: function () {
        components.multifieldCombobox.initCombobox(this.selectors.raceDataCourse, {
            autoSelect: true,
            autoFocus: true,
        });
        components.multifieldCombobox.initCombobox(this.selectors.raceDataGoing, {
            autoSelect: true,
            autoFocus: true,
        });

        $.maskinput.definitions['H'] = '[0-2]';
        $.maskinput.definitions['h'] = '[0-9]';
        $.maskinput.definitions['M'] = '[0-5]';
        $.maskinput.definitions['m'] = '[0-9]';
        this.$el.raceDataTime.maskinput('Hh:Mm');
        this.$el.raceDataTime.on('blur', $.proxy(function () {
            var val = this.$el.raceDataTime.val();
            if (val.length > 0) {
                var time = val.split(':');
                if (parseInt(time[0], 10) > 23) {
                    this.$el.raceDataTime.val('');
                }
            }
        }, this));

        this.$el.raceDataM.autoNumeric('init', {
            vMin: '0',
            vMax: '9',
            aSep: '',
        });
        this.$el.raceDataF.autoNumeric('init', {
            vMin: '0',
            vMax: '7',
            aSep: '',
        });
        this.$el.raceDataY.autoNumeric('init', {
            vMin: '0',
            vMax: '219',
            aSep: '',
        });
    },

    /**
     * Init runner custom elements
     */
    initRunnerCustomElements: function () {
        this.$el.runnerDataPosition.combobox();

        this.$el.runnerDataPrize.autoNumeric('init', {
            vMin: '0.00',
            vMax: '99999999.99',
            aSep: '',
        });
    },

    /**
     * Init convert tool custom elements
     */
    initConvertToolCustomElements: function () {
        $(this.selectors.currencyToolAmount).autoNumeric('init', {
            vMin: '0.00',
            vMax: '99999999.99',
            aSep: '',
        });

        var self = this;
        $(this.selectors.currencyToolCurrency).combobox({
            select: function() {
                if ($(self.selectors.currencyToolCurrency).val() !== '0') {
                    $(self.selectors.currencyToolButtonConvert).removeAttr('disabled');
                } else {
                    $(self.selectors.currencyToolButtonConvert).attr('disabled', 'disabled');
                }
            },
        });
        var input = $(this.selectors.currencyToolCurrency).next().find('input');
        input.on('blur', function() {
            if (input.val() !== '' && $(self.selectors.currencyToolCurrency).val() !== '0') {
                $(self.selectors.currencyToolButtonConvert).removeAttr('disabled');
            } else {
                $(self.selectors.currencyToolButtonConvert).attr('disabled', 'disabled');
            }
        }).on('focus', function () {
            $(this).select();
        }).autocomplete('option', 'autoFocus', true);
    },

    /**
     * Race date changed
     */
    onDatepickerChange: function () {
        var $dateEl = $(this.selectors.date);
        if (!moment($dateEl.val(), 'DD/MM/YYYY', true).isValid()) {
            $dateEl.val($dateEl.attr('data-default-date'));
            if ($dateEl.val() === '') {
                return true;
            }
        } else {
            $dateEl.attr('data-default-date', $dateEl.val());
        }

        this.$el.date.datepicker('hide');

        this.requestRaces($dateEl.val());
        return true;
    },

    /**
     * Request a list of races for a given date
     */
    requestRaces: function (date) {
        $.ajax(
            this.options.raceListUrl, {
                type: 'post',
                data: {
                    date: date,
                },
                beforeSend: app.common.hideTinybox.bind(app.common),
                success: $.proxy(this.onRequestRacesStatus, this),
            }
        );
    },

    /**
     * Request races status
     */
    onRequestRacesStatus: function (response) {
        app.common.showTinybox();
        this.$el.raceListBlock.html(response.races);
        this.$el.runnersListBlock.html(response.runners);
        this.initElements();
        this.initRaceEvents();
        this.enableButtonNewRace();
    },

    /**
     * Enable new race button
     */
    enableButtonNewRace: function () {
        this.$el.buttonNewRace.removeAttr('disabled');
    },

    /**
     * Disable new race button
     */
    disableButtonNewRace: function () {
        this.$el.buttonNewRace.attr('disabled', 'disabled');
    },

    /**
     * Enable currency converter button
     */
    enableButtonCurrencyConverter: function () {
        this.$el.buttonCurrencyConverter.removeAttr('disabled');
    },

    /**
     * Enable select race button
     */
    enableButtonSelectRace: function () {
        this.$el.buttonSelectRace.removeAttr('disabled');
    },

    /**
     * Disable select race button
     */
    disableButtonSelectRace: function () {
        this.$el.buttonSelectRace.attr('disabled', 'disabled');
    },

    /**
     * Enable select race button
     */
    enableButtonSaveClose: function () {
        this.$el.buttonSaveClose.removeAttr('disabled');
    },

    /**
     * New Race button clicked
     */
    onNewRaceButtonClick: function () {
        this.base.editMode = true;

        this.disableButtonNewRace();
        this.disableButtonSelectRace();
        this.enableButtonCurrencyConverter();
        this.enableButtonSaveClose();

        this.$el.date.datepicker('disable');
        this.$el.raceDataInputs.removeAttr('disabled');
        this.$el.runnerDataInputs.removeAttr('disabled');

        this.initRaceCustomElements();
        this.initRunnerCustomElements();
    },

    /**
     * Select Race button clicked
     */
    onSelectRaceButtonClick: function () {
        this.base.editMode = true;

        this.disableButtonNewRace();
        this.disableButtonSelectRace();
        this.enableButtonCurrencyConverter();
        this.enableButtonSaveClose();

        this.$el.date.datepicker('disable');
        this.$el.runnerDataInputs.removeAttr('disabled');

        this.initRunnerCustomElements();

        var $race = this.base.selectedRace;
        if ($race) {
            this.$el.raceDataCourse.val($race.data('course-uid'));
            this.$el.raceDataTime.val($race.data('time'));
            this.$el.raceDataType.val($race.data('type-code'));
            this.$el.raceDataM.val($race.data('m'));
            this.$el.raceDataF.val($race.data('f'));
            this.$el.raceDataY.val($race.data('y'));
            this.$el.raceDataGoing.val($race.data('going-code'));
            this.$el.raceDataRaceUid.val($race.data('race-uid'));
        }
    },

    /**
     * Convert currency button clicked
     */
    onConvertButtonClick: function () {
        this.$el.addResultForm.detach();
        $.ajax(
            this.options.currencyConvertToolUrl, {
                type: 'post',
                data: {
                    date: this.$el.date.val(),
                },
                beforeSend: app.common.hideTinybox.bind(app.common),
                success: $.proxy(this.onConvertStatus, this),
            }
        );
    },

    /**
     * Convert tool status
     */
    onConvertStatus: function (response) {
        app.common.showTinybox();
        $.tinybox.modal(response);
        this.initConvertToolCustomElements();
        this.initConvertToolEvents();
    },

    /**
     * Convert tool - Convert clicked
     */
    onConvertToolConvertButtonClick: function () {
        $.ajax(
            this.options.currencyConvertUrl, {
                type: 'post',
                data: {
                    year: $(this.selectors.currencyToolButtonConvert).data('year'),
                    amount: $(this.selectors.currencyToolAmount).val(),
                    currencyUid: $(this.selectors.currencyToolCurrency).val(),
                },
                beforeSend: app.common.hideTinybox.bind(app.common),
                success: $.proxy(this.onConvertToolConvertStatus, this),
            }
        );
    },

    /**
     * Convert tool - Convert status
     */
    onConvertToolConvertStatus: function (response) {
        app.common.showTinybox();
        if (response.updateStatus) {
            $.tinybox.hideModal();
            $.tinybox.modal(this.$el.addResultForm);
            if (response.payload && response.payload.prize) {
                this.$el.runnerDataPrize.val(response.payload.prize);
            }
        } else {
            this.convertToolError(response);
        }
    },

    /**
     * Convert tool - Cancel clicked
     */
    onConvertToolCancelButtonClick: function () {
        $.tinybox.hideModal();
        $.tinybox.modal(this.$el.addResultForm);
    },

    /**
     * Save and Close button clicked
     */
    onSaveCloseButtonClick: function () {
        this.clearDataError();
        if (this.isValidData()) {
            this.saveRequest();
        }
    },

    /**
     * Get data
     */
    getData: function () {
        return {
            raceUid: this.$el.raceDataRaceUid.val(),
            horseUid: this.$el.buttonSaveClose.data('horse-uid'),
            courseUid: this.$el.raceDataCourse.val(),
            date: this.$el.date.val(),
            time: this.$el.raceDataTime.val(),
            raceType: this.$el.raceDataType.val(),
            distance: this.calculateTotalYards(),
            goingCode: this.$el.raceDataGoing.val(),
            position: this.$el.runnerDataPosition.val(),
            prize: this.$el.runnerDataPrize.val(),
        };
    },

    /**
     * Calculate total yards
     */
    calculateTotalYards: function () {
        var y = this.$el.raceDataY.val() * 1;
        var f = this.$el.raceDataF.val() * 220;
        var m = this.$el.raceDataM.val() * 1760;

        return y + f + m;
    },

    /**
     * Validate data
     */
    isValidData: function () {
        var data = this.getData();
        var valid = true;

        if (data.raceUid === '') {
            valid = data.courseUid !== '0' && data.courseUid !== null;
            if (!valid) {
                this.dataError({
                    errorMessage: this.messages.RACE_RUNNER_EMPTY_COURSE,
                });
                return valid;
            }

            valid = data.time !== '';
            if (!valid) {
                this.dataError({
                    errorMessage: this.messages.RACE_RUNNER_EMPTY_TIME,
                });
                return valid;
            }

            valid = data.raceType !== '';
            if (!valid) {
                this.dataError({
                    errorMessage: this.messages.RACE_RUNNER_EMPTY_RACE_TYPE,
                });
                return valid;
            }

            valid = data.distance > 0;
            if (!valid) {
                this.dataError({
                    errorMessage: this.messages.RACE_RUNNER_EMPTY_DISTANCE,
                });
                return valid;
            }
        }

        valid = data.position !== '' && data.position !== null;
        if (!valid) {
            this.dataError({
                errorMessage: this.messages.RACE_RUNNER_EMPTY_POSITION,
            });
            return valid;
        }
        return valid;
    },

    /**
     * Save race runner request
     */
    saveRequest: function () {
        $.ajax(
            this.options.saveRaceRunnerUrl, {
                type: 'post',
                data: this.getData(),
                beforeSend: app.common.hideTinybox.bind(app.common),
                success: $.proxy(this.onSaveRunnerStatus, this),
            }
        );
    },

    /**
     * Save race runner status
     */
    onSaveRunnerStatus: function (response) {
        app.common.showTinybox();

        if (response.updateStatus) {
            $.tinybox.hideModal();
            hrm.resultHrmMaintenance.onButtonHorseSearchClick();
        } else {
            this.dataError(response);
        }
    },

    /**
     * Race row clicked
     */
    onRaceRowClick: function (e) {
        var $el = $(e.currentTarget);
        this.selectRow($el);
    },

    /**
     * Highlight selected row, update race runners
     */
    selectRow: function ($el) {
        if (!this.base.editMode) {
            this.base.selectedRace = $el;
            $('.' + this.base.rowHighlightClass).removeClass(this.base.rowHighlightClass);
            $el.addClass(this.base.rowHighlightClass);
            this.requestRunners($el.data('race-uid'));
        }
    },

    /**
     * Request runners list
     */
    requestRunners: function (raceUid) {
        $.ajax(
            this.options.runnerListUrl, {
                type: 'post',
                data: {
                    raceUid: raceUid,
                },
                beforeSend: app.common.hideTinybox.bind(app.common),
                success: $.proxy(this.onRequestRunnersStatus, this),
            }
        );
    },

    /**
     * Request runners status
     */
    onRequestRunnersStatus: function (response) {
        app.common.showTinybox();
        this.$el.runnersListBlock.html(response);
        this.enableButtonSelectRace();
    },

    /**
     * Clear error
     */
    clearDataError: function () {
        this.$el.errorContainer.text('');
    },

    /**
     * Error
     */
    dataError: function (response) {
        this.$el.errorContainer.text(response.errorMessage);
    },

    /**
     * Convert tool - Error
     */
    convertToolError: function (response) {
        $(this.selectors.errorContainer).text(response.errorMessage);
    },
};
