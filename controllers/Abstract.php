<?php

/**
 * HRM Abstract Controller
 *
 * @package    HRM
 * @subpackage Controller
 * @purpose    Additional layer of abstraction to work with module settings
 * @author     Vladislav Zayko vladislav.zayko@racingpost.com
 * @copyright  2017 Racing Post
 * @link       https://racingpost.atlassian.net/browse/PHD-2575
 */
class Hrm_Controller_Abstract extends Core_Controller_AuthController
{
    const RESULT             = 'result';
    const LIMIT              = 'limit';
    const COUNT              = 'count';
    const RECORDS            = 'records';
    const COMPUTED           = 'computed';
    const COURSE_FILTER      = 'courseFilter';
    const ERROR_MESSAGE      = 'errorMessage';
    const ARRAY_HELPER_PATH  = 'core/ArrayUtils';
    const COURSE_NAME        = 'course_name';
    const COUNTRY_CODE       = 'country_code';

    /**
     * Pre dispatch for rpr module
     */
    public function preDispatch()
    {
        $layout  = $this->_helper->layout;
        $layout->setLayout('hrm/hrm_layout');
    }
}
