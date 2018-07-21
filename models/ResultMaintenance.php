<?php

/**
 * Class Hrm_Model_ResultMaintenance
 *
 * @package HRM
 * @subpackage Model
 * @author     Vladislav Zayko Vladislav.Zayko@racingpost.com
 * @copyright  2017 Racing Post
 * @link       https://racingpost.atlassian.net/browse/PHD-2547
 */
class Hrm_Model_ResultMaintenance extends Core_Model_Abstract
{
    const MAX_RECORDS_COUNT = 500;

    protected $_resourceName = 'ResultMaintenance';

    /**
     * Get countries
     *
     * @codeCoverageIgnore
     * @return array
     */
    public function getCountries()
    {
        /** @var Hrm_Model_Resource_ResultMaintenance $entity */
        $entity = $this->_getResource();
        return $entity->getCountries();
    }

    /**
     * Find course
     *
     * @codeCoverageIgnore
     * @param $date
     * @countryCode
     * @return array
     */
    public function getCourseFilter($date, $countryCode)
    {
        /** @var Hrm_Model_Resource_ResultMaintenance $entity */
        $entity = $this->_getResource();
        return $entity->getCourses($date, $countryCode);
    }

    /**
     * Get race types
     *
     * @codeCoverageIgnore
     * @return array
     */
    public function getRaceTypes()
    {
        /** @var Hrm_Model_Resource_ResultMaintenance $entity */
        $entity = $this->_getResource();
        return $entity->getRaceTypes();
    }

    /**
     * Find horse by name
     *
     * @codeCoverageIgnore
     * @param $name
     * @return array
     */
    public function findHorseByName($name)
    {
        /** @var Hrm_Model_Resource_ResultMaintenance $entity */
        $entity = $this->_getResource();
        return $entity->findHorseByName($name, self::MAX_RECORDS_COUNT);
    }

    /**
     * Execute search
     *
     * @param $data
     * @codeCoverageIgnore
     * @return array
     */
    public function search($data)
    {
        /** @var Hrm_Model_Resource_ResultMaintenance $entity */
        $entity = $this->_getResource();
        return $entity->search($data);
    }

    /**
     * Get positions
     *
     * @codeCoverageIgnore
     * @return mixed
     */
    public function getPositions()
    {
        /** @var Hrm_Model_Resource_ResultMaintenance $entity */
        $entity = $this->_getResource();
        return $entity->getPositions();
    }

    /**
     * Get race runners data
     *
     * @codeCoverageIgnore
     * @param $raceUid
     * @param $horseUid
     * @return mixed
     */
    public function getRaceRunners($raceUid, $horseUid = null)
    {
        /** @var Hrm_Model_Resource_ResultMaintenance $entity */
        $entity = $this->_getResource();
        return $entity->getRaceRunners($raceUid, $horseUid);
    }

    /**
     * Save race runner data
     *
     * @codeCoverageIgnore
     * @param $data
     * @return mixed
     */
    public function saveRaceRunner($data)
    {
        /** @var Hrm_Model_Resource_ResultMaintenance $entity */
        $entity = $this->_getResource();
        return $entity->saveRaceRunner($data);
    }

    /**
     * Convert foreign currency to sterling
     *
     * @codeCoverageIgnore
     * @param $year
     * @param $currencyUid
     * @param $amount
     * @return mixed
     */
    public function convertToSterling($year, $currencyUid, $amount)
    {
        /** @var Hrm_Model_Resource_ResultMaintenance $entity */
        $entity = $this->_getResource();
        return $entity->convertToSterling($year, $currencyUid, $amount);
    }
}
