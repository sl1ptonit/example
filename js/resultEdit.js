window.hrm = window.hrm || {};

/**
 * Result Maintenance: Edit
 */
hrm.resultEdit = {

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
        buttonInDevelopment: '.js-in-development',
        buttonRaceAttributes: '.js-race-attr',
        buttonCir: '.js-cir-button',
        buttonAnalysis: '.js-analysis-button',
        buttonStandard: '.js-standard-button',
    },

    /**
     * Events initialization.
     */
    initEvents: function () {
        this.$elements.buttonInDevelopment.registerEvent('click', app.common.underConstruction);
        this.$elements.buttonCir.registerEvent('click', this.onButtonCirClick);
        this.$elements.buttonAnalysis.registerEvent('click', this.onButtonAnalysisClick);
        this.$elements.buttonStandard.registerEvent('click', this.onButtonStandardClick);
    },

    /**
     * Event on cir button click
     */
    onButtonCirClick: function () {
        window.open(this.options.cirScreenUrl, '_blank');
    },

    /**
     * Event on cir button click
     */
    onButtonAnalysisClick: function () {
        window.open(this.options.analysisScreenUrl, '_blank');
    },

    /**
     * Event on cir button click
     */
    onButtonStandardClick: function () {
        this.options.standardScreenUrl = this.options.standardScreenUrl + '#' + this.options.courseUid;
        window.open(this.options.standardScreenUrl, '_blank');
    },
};

extend(base, hrm.resultEdit);
