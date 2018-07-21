<?php

/**
 * Class Hrm_Resource_EditResult
 *
 * @package HRM
 * @subpackage Model
 * @author     Vladislav Zayko vladislav.zayko@racingpost.com
 * @copyright  2017 Racing Post
 * @link       https://racingpost.atlassian.net/browse/PHD-2603
 * @link       https://racingpost.atlassian.net/browse/PHD-2605
 */
class Hrm_Model_Resource_EditResult extends Core_Model_Resource_Abstract
{
    /**
     * Get race headers data
     *
     * @param $raceUid
     * @return array
     */
    public function getRaceHeader($raceUid)
    {
        $sql = "exec dbo.sp_results_get_race_header @race_instance_uid = :raceUid";

        // Database query
        // Bind params to sql query
        // Fetching multiple rows
        return $this->getDoctrineEntityManager(static::RDE_EM)
            ->getConnection()
            ->executeQuery($sql, [
                ':raceUid'  => (int) $raceUid,
            ])
            ->fetch();
    }

    /**
     * Get Race runners
     * @param $raceUid
     * @return array
     * @throws Exception
     * @throws \Doctrine\DBAL\DBALException
     */
    public function getRaceRunners($raceUid)
    {
        $sql = "exec dbo.sp_results_get_race_runners @race_instance_uid = :raceUid";

        // Database query
        // Bind params to sql query
        // Fetching multiple rows
        return $this->getDoctrineEntityManager(static::RDE_EM)
            ->getConnection()
            ->executeQuery($sql, [
                ':raceUid'  => (int) $raceUid,
            ])
            ->fetchAll();
    }
}
