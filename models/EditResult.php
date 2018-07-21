<?php

/**
 * Class Hrm_Model_EditResult
 *
 * @package HRM
 * @subpackage Model
 * @author     Vladislav Zayko Vladislav.Zayko@racingpost.com
 * @copyright  2017 Racing Post
 * @link       https://racingpost.atlassian.net/browse/PHD-2603
 * @link       https://racingpost.atlassian.net/browse/PHD-2605
 */
class Hrm_Model_EditResult extends Core_Model_Abstract
{
    protected $_resourceName = 'EditResult';

    /**
     * Get race headers data
     *
     * @codeCoverageIgnore
     * @return array
     */
    public function getRaceHeader($raceUid)
    {
        /** @var Hrm_Model_Resource_EditResult $entity */
        $entity = $this->_getResource();
        return $entity->getRaceHeader($raceUid);
    }

    /**
     * Get race runners
     *
     * @codeCoverageIgnore
     * @param $raceUid
     * @return array
     */
    public function getRaceRunners($raceUid)
    {
        /** @var Hrm_Model_Resource_EditResult $entity */
        $entity = $this->_getResource();
        return $entity->getRaceRunners($raceUid);
    }
}
