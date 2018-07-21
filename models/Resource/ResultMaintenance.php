<?php

/**
 * Class Hrm_Resource_ResultMaintenance
 *
 * @package HRM
 * @subpackage Model
 * @author     Vladislav Zayko vladislav.zayko@racingpost.com
 * @copyright  2017 Racing Post
 * @link       https://racingpost.atlassian.net/browse/PHD-2547
 */
class Hrm_Model_Resource_ResultMaintenance extends Core_Model_Resource_Abstract
{
    /**
     * Get countries values
     *
     * @return array
     */
    public function getCountries()
    {
        $sql = "exec dbo.sp_get_countries";

        // Database query
        // Bind params to sql query
        // Fetching multiple rows
        return $this->getDoctrineEntityManager(static::RDE_EM)
            ->getConnection()
            ->executeQuery($sql, [])
            ->fetchAll();
    }

    /**
     * Find course by code
     *
     * @param $date
     * @return array
     */
    public function getCourses($date, $countryCode)
    {
        $sql = "exec dbo.sp_get_course_filter
            @date =:date,
            @country =:countryCode
        ";

        // Database query
        // Bind params to sql query
        // Fetching multiple rows
        return $this->getDoctrineEntityManager(static::RDE_EM)
            ->getConnection()
            ->executeQuery($sql, [
                ':date'        => Core_Helper_Formatter::formatEmptyStringAsNull($date, true),
                ':countryCode' => Core_Helper_Formatter::formatEmptyStringAsNull($countryCode, true)
            ])
            ->fetchAll();
    }

    /**
     * Get Race types
     *
     * @return array
     */
    public function getRaceTypes()
    {
        $sql = "exec dbo.sp_get_surfaces";

        // Database query
        // Bind params to sql query
        // Fetching multiple rows
        return $this->getDoctrineEntityManager(static::RDE_EM)
            ->getConnection()
            ->executeQuery($sql)
            ->fetchAll();
    }

    /**
     * Find horse by name
     *
     * @param $name
     * @param $rowLimit
     * @return array
     */
    public function findHorseByName($name, $rowLimit)
    {
        $sql = "exec dbo.sp_horse_find_horses @horse_uid = null, @horse_to_find = :name, @row_limit = :limit";

        // Database query
        // Bind params to sql query
        // Fetching multiple rows
        return $this->getDoctrineEntityManager(static::RDE_EM)
            ->getConnection()
            ->executeQuery($sql, [
                ':name'  => trim($name),
                ':limit' => (int)($rowLimit + 1),
            ])
            ->fetchAll();
    }

    /**
     * Search results
     * @param $data
     * @return array
     */
    public function search($data)
    {
        $sql = "exec dbo.sp_results_search_results
            @race_day     =:race_day,
            @country_code =:country_code,
            @course_uid   =:course_uid,
            @race_type    =:race_type,
            @horse_uid    =:horse_uid";

        // Database query
        // Bind params to sql query
        // Fetching multiple rows
        return $this->getDoctrineEntityManager(static::RDE_EM)
            ->getConnection()
            ->executeQuery($sql, [
                ':race_day'     => !empty($data['date']) ? Core_Helper_DateTime::convertFaceToDB($data['date']) : null,
                ':country_code' =>  Core_Helper_Formatter::formatEmptyStringAsNull($data['country'], true),
                ':course_uid'   =>  Core_Helper_Formatter::formatEmptyIntAsNull($data['course'], true),
                ':race_type'    =>  Core_Helper_Formatter::formatEmptyStringAsNull($data['type'], true),
                ':horse_uid'    =>  Core_Helper_Formatter::formatEmptyIntAsNull($data['horse_uid']),
            ])
            ->fetchAll();
    }

    /**
     * Get positions
     *
     * @return mixed
     */
    public function getPositions()
    {
        $sql = "exec sp_results_get_positions";

        // Execute query
        return $this->getDoctrineEntityManager(static::RDE_EM)
            ->getConnection()
            ->executeQuery($sql, [])
            ->fetchAll();
    }

    /**
     * Get race runners data
     *
     * @param $raceUid
     * @param $horseUid
     * @return mixed
     */
    public function getRaceRunners($raceUid, $horseUid = null)
    {
        $sql = "exec sp_results_get_race_runners
                    @race_instance_uid = :race_instance_uid,
                    @horse_uid = :horse_uid";

        // Execute query
        return $this->getDoctrineEntityManager(static::RDE_EM)
            ->getConnection()
            ->executeQuery($sql, [
                ':race_instance_uid' => (int)$raceUid,
                ':horse_uid'         => Core_Helper_Formatter::formatEmptyIntAsNull($horseUid, true),
            ])
            ->fetchAll();
    }

    /**
     * Save race runner data
     *
     * @param $data
     * @return mixed
     */
    public function saveRaceRunner($data)
    {
        $sql = "exec sp_results_add_runner
                    @date = :date,
                    @course_uid = :course_uid,
                    @time = :time,
                    @race_type_code = :race_type_code,
                    @distance_yard = :distance_yard,
                    @going_type_code = :going_type_code,
                    @race_instance_uid = :race_instance_uid,
                    @horse_uid = :horse_uid,
                    @race_outcome_uid = :race_outcome_uid,
                    @prize_sterling = :prize_sterling";

        // Execute query
        return $this->getDoctrineEntityManager(static::RDE_EM)
            ->getConnection()
            ->executeQuery($sql, [
                ':date'              => Core_Helper_DateTime::convertFaceToDB($data['date']),
                ':course_uid'        => Core_Helper_Formatter::formatEmptyIntAsNull($data['courseUid'], true),
                ':time'              => Core_Helper_Formatter::formatEmptyStringAsNull($data['time'], true),
                ':race_type_code'    => Core_Helper_Formatter::formatEmptyStringAsNull($data['raceType'], true),
                ':distance_yard'     => Core_Helper_Formatter::formatEmptyIntAsNull($data['distance'], true),
                ':going_type_code'   => Core_Helper_Formatter::formatEmptyStringAsNull($data['goingCode'], true),
                ':race_instance_uid' => Core_Helper_Formatter::formatEmptyIntAsNull($data['raceUid'], true),
                ':horse_uid'         => (int)$data['horseUid'],
                ':race_outcome_uid'  => Core_Helper_Formatter::formatEmptyIntAsNull($data['position'], true),
                ':prize_sterling'    => Core_Helper_Formatter::formatEmptyFloatAsNull($data['prize']),
            ])
            ->fetch();
    }

    /**
     * Convert foreign currency to sterling
     *
     * @param $year
     * @param $currencyUid
     * @param $amount
     * @return mixed
     */
    public function convertToSterling($year, $currencyUid, $amount)
    {
        $sql = "exec sp_results_convert_to_sterling
                    @year = :year,
                    @currency_uid = :currency_uid,
                    @amount_won = :amount_won";

        // Execute query
        return $this->getDoctrineEntityManager(static::RDE_EM)
            ->getConnection()
            ->executeQuery($sql, [
                ':year'         => (int)$year,
                ':currency_uid' => (int)$currencyUid,
                ':amount_won'   => (float)$amount,
            ])
            ->fetch();
    }
}
