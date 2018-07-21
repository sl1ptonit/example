<?php

/**
 * HRM Index Controller
 *
 * @package    HRM
 * @subpackage Controller
 * @purpose    Public controller for hrm
 * @author     Vladislav Zayko vladislav.zayko@racingpost.com
 * @copyright  2017 Racing Post
 * @link       https://racingpost.atlassian.net/browse/PHD-2603
 * @link       https://racingpost.atlassian.net/browse/PHD-2605
 */
class Hrm_EditResultController extends Hrm_Controller_Abstract
{
    public function indexAction()
    {
        $raceUid = $this->_request->getParam('raceUid');

        /** @var Hrm_Model_EditResult $model */
        $model = RP::getModel(static::MDL_HRM_EDIT_RESULT);

        /** @var Core_Helper_User $userHelper */
        $userHelper = Rp::getHelper('core/User');

        $dataHeader  = $model->getRaceHeader($raceUid);
        $dataRunners = $model->getRaceRunners($raceUid);

        $this->view->assign([
            'dataHeader'       => $dataHeader,
            'dataRunners'      => $dataRunners,
            'isAllowedBetting' => $userHelper->isAllowed('cr_betting-data_show-betting-popup'),
        ]);
    }
}
