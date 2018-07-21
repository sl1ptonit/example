<?php

/**
 * HRM Index Controller
 *
 * @package    HRM
 * @subpackage Controller
 * @purpose    Public controller for hrm
 * @author     Vladislav Zayko vladislav.zayko@racingpost.com
 * @copyright  2017 Racing Post
 * @link       https://racingpost.atlassian.net/browse/PHD-2575
 */
class Hrm_IndexController extends Hrm_Controller_Abstract
{
    //max record to show exceed limit warning
    const RECORDS_COUNT = 500;

    /**
     * Index action
     */
    public function indexAction()
    {
        /** @var Core_Helper_ArrayUtils $arrayHelper */
        $arrayHelper = Rp::getHelper(static::ARRAY_HELPER_PATH);

        /** @var Hrm_Model_ResultMaintenance $model */
        $model = RP::getModel(static::MDL_HRM_RESULT_MAINT);

        $date = $this->_request->getParam('race_date', '');
        if (empty($date)) {
            $date = date('Y-m-d', strtotime('today UTC'));
        }

        $countryRaw    = $model->getCountries();
        $countryFilter = $arrayHelper->formatForTwoColumnDropdown(
            static::COUNTRY_CODE,
            'country_desc',
            static::COUNTRY_CODE,
            $countryRaw,
            [
                'desc'  => '',
                'code'  => 'All countries',
                'value' => '0'
            ]
        );

        $raceTypeRaw    = $model->getRaceTypes();
        $raceTypeFilter = $arrayHelper->groupBy(
            'race_type_code',
            'race_type_desc',
            $raceTypeRaw,
            true,
            true,
            ['' => 'All types']
        );

        $this->view->assign([
            'date'           => date('d/m/Y', strtotime($date)),
            'countryFilter'  => $countryFilter,
            'courseFilter'   => $this->getCourses($date),
            'raceTypeFilter' => $raceTypeFilter,
        ]);
    }

    /**
     * Get cuorse filter
     */
    public function getCourseFilterAction()
    {
        //disable layout
        $this->_helper->layout()->disableLayout();
        //getting data from get
        $dateFrom    = Core_Helper_DateTime::convertFaceToDB($this->_request->getParam('date_from'));
        $countryCode = $this->_request->getParam('country_code');

        //assign variables
        $this->view->assign([
            'courseFilter' => $this->getCourses($dateFrom, $countryCode)
        ]);

        //return json
        return $this->_helper->json([
            static::RESULT => $this->view->render('index/get-course-filter.phtml'),
        ]);
    }

    /**
     * Get courses
     * @param $dateFrom
     * @param null $countryCode
     * @return array
     */
    protected function getCourses($dateFrom, $countryCode = null)
    {
        // get course list
        /** @var Hrm_Model_ResultMaintenance $model */
        $model        = Rp::getModel(static::MDL_HRM_RESULT_MAINT);
        $courseFilter = $model->getCourseFilter($dateFrom, $countryCode);

        // sort course list
        uasort($courseFilter, function ($i, $j) {
            return $i[static::COURSE_NAME] > $j[static::COURSE_NAME];
        });

        /** @var Core_Helper_ArrayUtils $arrayHelper */
        $arrayHelper = Rp::getHelper('core/ArrayUtils');
        return $arrayHelper->formatForTwoColumnDropdown(
            'country_code',
            'course_name',
            'course_uid',
            $courseFilter,
            [
                'desc'  => '',
                'code'  => 'All courses',
                'value' => '0'
            ]
        );
    }

    /**
     * Action to find a horse
     * @return mixed
     */
    public function findHorseUrlAction()
    {
        //disable layout
        $this->_helper->layout()->disableLayout();
        $horseToFind = $this->_request->getParam('horse_to_find');

        /** @var Hrm_Model_ResultMaintenance $model */
        $model   = Rp::getModel(static::MDL_HRM_RESULT_MAINT);
        $records = $model->findHorseByName($horseToFind);

        /** @var Hppl_Helper_Shared $sharedHelper */
        $sharedHelper = Rp::getHelper(static::HLP_HPPL_SHARED);
        $exceed       = $sharedHelper->isExceedMaxLength($records, $model::MAX_RECORDS_COUNT);
        //assign variables to template
        $this->view->assign([
            'records' => $records,
        ]);
        //return result of search horse
        return $this->_helper->json([
            'exceed'       => $exceed,
            static::RESULT => $this->view->render('index/horse-search-result.phtml')
        ]);
    }

    /**
     * Search action
     * @return mixed
     */
    public function searchAction()
    {
        //disable main layout
        $this->_helper->layout()->disableLayout();
        $post = $this->getRequest()->getPost();

        /** @var Hrm_Model_ResultMaintenance $model */
        $model  = RP::getModel('hrm/ResultMaintenance');
        $result = $model->search($post);

        $this->view->assign([
            'records' => $result,
        ]);
        //Ckeck if any search errors
        if (isset($result['0']['computed']) && $result['0']['computed'] < 0) {
            return $this->_helper->json([
                'searchStatus' => false,
                'errorMessage' => Core_Helper_Database::getLastMessage(),
                static::RESULT => $this->view->render('index/search.phtml'),
            ]);
        }
        //return results
        return $this->_helper->json([
            'searchStatus' => true,
            'count'        => count($result),
            static::RESULT => $this->view->render('index/search.phtml'),
        ]);
    }

    /**
     * Add horse result form action
     */
    public function addHorseResultFormAction()
    {
        $this->_helper->layout()->disableLayout();

        $horseUid = $this->_request->getParam('horseUid');

        /** @var Core_Helper_ArrayUtils $arrayHelper */
        $arrayHelper = Rp::getHelper(static::HLP_ARRAY_UTILS);

        /** @var Hrm_Model_ResultMaintenance $model */
        $model = RP::getModel(static::MDL_HRM_RESULT_MAINT);

        /** @var Hrs_Model_HorseMaintenance $hrsModel */
        $hrsModel = RP::getModel(static::MDL_HRS_HORSE_MAINT);

        /** @var raceDataEntry_Model_Cards $cardsModel */
        $cardsModel = Rp::getModel('raceDataEntry/Cards');

        /** @var raceDataEntry_Model_GoingStalls $goingModel */
        $goingModel = Rp::getModel('raceDataEntry/GoingStalls');

        $list       = $hrsModel->find(null, $horseUid);
        $positions  = $model->getPositions();
        $courses    = $cardsModel->getMeetings();
        $raceTypes  = $model->getRaceTypes();
        $goingTypes = $goingModel->getGoingType();

        $positions  = Core_Helper_ArrayUtils::arrayColumn($positions, 'race_outcome_desc', 'race_outcome_uid', [
            '' => '',
        ]);
        $courses    = $arrayHelper->formatForTwoColumnDropdown(
            'country_code',
            'style_name',
            'course_uid',
            $courses['result'],
            [
                'desc'  => '',
                'code'  => 'Select course...',
                'value' => '0'
            ]
        );
        $raceTypes  = Core_Helper_ArrayUtils::arrayColumn($raceTypes, 'race_type_desc', 'race_type_code', [
            '' => 'Select type...',
        ]);
        $goingTypes = $arrayHelper->formatForTwoColumnDropdown(
            'going_type_desc',
            'going_type_code',
            'going_type_code',
            $goingTypes,
            [
                'desc'  => '',
                'code'  => '',
                'value' => '0'
            ]
        );

        $horseDetails = [];
        if (!empty($list)) {
            $horseDetails = array_shift($list);
        }

        $this->view->assign([
            'horseDetails' => $horseDetails,
            'positions'    => $positions,
            'courses'      => $courses,
            'raceTypes'    => $raceTypes,
            'goingTypes'   => $goingTypes,
        ]);

        return $this->_helper->json($this->view->render('index/add-horse-result-form.phtml'));
    }

    /**
     * Return a list of races for a given date
     */
    public function getRaceListAction()
    {
        $this->_helper->layout()->disableLayout();

        $date = $this->_request->getParam('date');

        /** @var Hrm_Model_ResultMaintenance $model */
        $model = RP::getModel(static::MDL_HRM_RESULT_MAINT);

        $raceList = $model->search([
            'date' => $date,
        ]);

        return $this->_helper->json([
            'races'   => $this->view->partial('_partials/add-horse-result-races-list.phtml', 'hrm', [
                'raceList' => $raceList,
            ]),
            'runners' => $this->view->partial('_partials/add-horse-result-runners-list.phtml', 'hrm', [
                'runnerList' => [],
            ]),
        ]);
    }

    /**
     * Return a list of runners for a given race
     */
    public function getRaceRunnersAction()
    {
        $this->_helper->layout()->disableLayout();

        $raceUid = $this->_request->getParam('raceUid');

        /** @var Hrm_Model_ResultMaintenance $model */
        $model = RP::getModel(static::MDL_HRM_RESULT_MAINT);

        $runnerList = $model->getRaceRunners($raceUid);

        return $this->_helper->json($this->view->partial('_partials/add-horse-result-runners-list.phtml', 'hrm', [
            'runnerList' => $runnerList,
        ]));
    }

    /**
     * Save race runner
     */
    public function saveRaceRunnerAction()
    {
        // Disabled layout
        $this->_helper->layout()->disableLayout();

        $post = $this->getRequest()->getPost();

        /** @var Hrm_Model_ResultMaintenance $model */
        $model  = RP::getModel(static::MDL_HRM_RESULT_MAINT);
        $result = $model->saveRaceRunner($post);

        // Return default result status
        return $this->updateStatus($result);
    }

    /**
     * Currency convert tool
     */
    public function currencyConvertToolAction()
    {
        $this->_helper->layout()->disableLayout();

        $date = $this->_request->getParam('date');

        /** @var Hrf_Model_ExchangeRate $model */
        $model = RP::getModel('hrf/ExchangeRate');

        $currencies = $model->getCurrencies();
        $currencies = Core_Helper_ArrayUtils::arrayColumn($currencies, 'currency_desc', 'currency_uid', [
            '0' => 'Select currency...',
        ]);

        $this->view->assign([
            'currencies' => $currencies,
            'date'       => $date,
        ]);

        return $this->_helper->json($this->view->render('index/currency-convert-tool.phtml'));
    }

    /**
     * Currency convert
     */
    public function currencyConvertAction()
    {
        // Disabled layout
        $this->_helper->layout()->disableLayout();

        $year        = $this->_request->getParam('year');
        $currencyUid = $this->_request->getParam('currencyUid');
        $amount      = $this->_request->getParam('amount');

        /** @var Hrm_Model_ResultMaintenance $model */
        $model  = RP::getModel(static::MDL_HRM_RESULT_MAINT);
        $result = $model->convertToSterling($year, $currencyUid, $amount);

        // Return default result status
        return $this->updateStatus($result, [
            'prize' => $result['sterling_value'],
        ]);
    }
}
