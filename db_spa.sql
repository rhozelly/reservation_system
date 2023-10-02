-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.6-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.0.0.6468
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for db_spa
CREATE DATABASE IF NOT EXISTS `db_spa` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `db_spa`;

-- Dumping structure for table db_spa.inf_customer_status
CREATE TABLE IF NOT EXISTS `inf_customer_status` (
  `cus_cat_id` int(11) NOT NULL AUTO_INCREMENT,
  `cus_cat_name` varchar(50) DEFAULT NULL,
  `cus_cat_desc` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`cus_cat_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- Dumping data for table db_spa.inf_customer_status: ~2 rows (approximately)
INSERT INTO `inf_customer_status` (`cus_cat_id`, `cus_cat_name`, `cus_cat_desc`) VALUES
	(1, 'VIP1', NULL),
	(2, 'VIP2', NULL),
	(3, 'VIP3', NULL);

-- Dumping structure for table db_spa.inf_discounts
CREATE TABLE IF NOT EXISTS `inf_discounts` (
  `disc_id` int(11) NOT NULL AUTO_INCREMENT,
  `disc_name` varchar(50) COLLATE latin1_general_ci DEFAULT '',
  `disc_percent` int(11) DEFAULT NULL,
  PRIMARY KEY (`disc_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- Dumping data for table db_spa.inf_discounts: ~10 rows (approximately)
INSERT INTO `inf_discounts` (`disc_id`, `disc_name`, `disc_percent`) VALUES
	(1, 'Lifetime Discount', 20),
	(3, 'Lifetime Discount for Massage', 10),
	(6, 'ARD - ADMIN RELATIVE DISCOUNT', 10),
	(7, 'ERD - EMPLOYEE RELATIVE DISCOUNT', 5),
	(8, 'EMPLOYEE DISCOUNT', 50),
	(9, 'ERD- EMPLOYEE RELATIVE DISCOUNT', 3),
	(10, 'ARD- ADMIN RELATIVE DISCOUNT', 5),
	(11, 'VIP', 20),
	(12, 'PWD- PERSON WITH DISABILITY DISCOUNT', 20),
	(13, 'SC-SENIOR CITIZEN DISCOUNT', 20);

-- Dumping structure for table db_spa.inf_email
CREATE TABLE IF NOT EXISTS `inf_email` (
  `mail_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
  `mail_school_code` varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
  PRIMARY KEY (`mail_id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- Dumping data for table db_spa.inf_email: ~2 rows (approximately)
INSERT INTO `inf_email` (`mail_id`, `email`, `mail_school_code`) VALUES
	(29, 'antonietterhozel@gmail.com', '505'),
	(38, 'keanukent@gmail.com', '505');

-- Dumping structure for table db_spa.inf_emergency
CREATE TABLE IF NOT EXISTS `inf_emergency` (
  `em_id` int(11) NOT NULL AUTO_INCREMENT,
  `company_name` varchar(100) COLLATE latin1_general_ci DEFAULT NULL,
  `company_contact` varchar(25) COLLATE latin1_general_ci DEFAULT NULL,
  `em_school_code` varchar(25) COLLATE latin1_general_ci DEFAULT NULL,
  PRIMARY KEY (`em_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- Dumping data for table db_spa.inf_emergency: ~4 rows (approximately)
INSERT INTO `inf_emergency` (`em_id`, `company_name`, `company_contact`, `em_school_code`) VALUES
	(1, 'asd12314121', '123', NULL),
	(8, 'ABCD', '123213', '505'),
	(12, 'EFDG', '9275149982', '505'),
	(18, 'Samples', '1233456789', '505');

-- Dumping structure for table db_spa.inf_navi
CREATE TABLE IF NOT EXISTS `inf_navi` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `url` varchar(50) NOT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `base` varchar(12) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;

-- Dumping data for table db_spa.inf_navi: ~5 rows (approximately)
INSERT INTO `inf_navi` (`id`, `name`, `url`, `icon`, `base`) VALUES
	(1, 'users', '/users', 'icon_dashboard_2x.png', 'nav'),
	(2, 'history', '/history', 'icon_students_2x.png', 'nav'),
	(12, 'messages', '/messages', 'icon_announcements_2x.png', 'page'),
	(13, 'escalate', '/escalate', NULL, 'button'),
	(14, 'broadcast', '/broadcast', NULL, 'button');

-- Dumping structure for table db_spa.inf_navs
CREATE TABLE IF NOT EXISTS `inf_navs` (
  `nav_id` int(11) NOT NULL AUTO_INCREMENT,
  `nav_icon` varchar(40) COLLATE latin1_general_ci DEFAULT NULL,
  `nav_name` varchar(40) COLLATE latin1_general_ci DEFAULT NULL,
  `nav_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`nav_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- Dumping data for table db_spa.inf_navs: ~9 rows (approximately)
INSERT INTO `inf_navs` (`nav_id`, `nav_icon`, `nav_name`, `nav_order`) VALUES
	(1, '', 'dashboard', 1),
	(2, '', 'calendar', 2),
	(3, NULL, 'bookings', 4),
	(4, NULL, 'therapist', 6),
	(5, NULL, 'rooms', 5),
	(6, NULL, 'services', 7),
	(7, NULL, 'availability', 3),
	(8, NULL, 'discounts', 8),
	(9, NULL, 'report', 9);

-- Dumping structure for table db_spa.inf_rooms
CREATE TABLE IF NOT EXISTS `inf_rooms` (
  `room_id` int(11) NOT NULL AUTO_INCREMENT,
  `room_name` varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
  `room_cat` varchar(30) COLLATE latin1_general_ci DEFAULT NULL,
  `room_pax` int(11) NOT NULL DEFAULT 0,
  `room_pax_status` varchar(25) COLLATE latin1_general_ci DEFAULT NULL COMMENT '1,0,1',
  `room_status` int(1) unsigned zerofill NOT NULL DEFAULT 0,
  `branch_id` int(2) unsigned NOT NULL,
  PRIMARY KEY (`room_id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- Dumping data for table db_spa.inf_rooms: ~20 rows (approximately)
INSERT INTO `inf_rooms` (`room_id`, `room_name`, `room_cat`, `room_pax`, `room_pax_status`, `room_status`, `branch_id`) VALUES
	(16, 'room 1 ', 'couple', 2, NULL, 1, 1),
	(17, 'room 2', 'connecting', 1, '1', 1, 1),
	(18, 'room 3', 'connecting', 1, NULL, 1, 1),
	(19, 'room 4', 'individual', 1, '1', 1, 1),
	(20, 'room 5', 'individual', 1, '1', 1, 1),
	(21, 'room 6', 'individual', 1, '1', 1, 1),
	(22, 'room 7', 'individual', 1, '1', 1, 1),
	(23, 'room 8', 'individual', 1, '1', 1, 1),
	(24, 'room 9', 'family', 3, '1,1,1', 1, 1),
	(25, 'room 10', 'connecting', 1, '1', 1, 1),
	(26, 'room 11', 'connecting', 1, '1', 1, 1),
	(27, 'VIP Room', 'family', 4, '1,1,1,1', 1, 1),
	(28, 'FACIAL AREA - SEAT #1', 'individual', 1, '1', 1, 1),
	(29, 'FACIAL AREA - SEAT #2', 'individual', 1, '1', 1, 1),
	(30, 'FACIAL AREA - SEAT #3', 'individual', 1, '1', 1, 1),
	(31, 'FACIAL AREA - SEAT #4', 'individual', 1, '1', 1, 1),
	(32, 'NAIL SERVICES - SEAT #1', 'individual', 1, '1', 1, 1),
	(33, 'NAIL SERVICES - SEAT #2', 'individual', 1, '1', 1, 1),
	(34, 'NAIL SERVICES - SEAT #3', 'individual', 1, '1', 1, 1),
	(35, 'NAIL SERVICES - SEAT #4', 'individual', 1, '1', 1, 1);

-- Dumping structure for table db_spa.inf_service_group
CREATE TABLE IF NOT EXISTS `inf_service_group` (
  `service_group_id` int(11) NOT NULL AUTO_INCREMENT,
  `service_group_name` varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
  PRIMARY KEY (`service_group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- Dumping data for table db_spa.inf_service_group: ~9 rows (approximately)
INSERT INTO `inf_service_group` (`service_group_id`, `service_group_name`) VALUES
	(1, 'body cares'),
	(2, 'special offers'),
	(3, 'facial cares'),
	(4, 'body massage - full'),
	(5, 'body massage - specials'),
	(6, 'gift certificate'),
	(7, 'card'),
	(8, 'Home Service Fee'),
	(9, 'others');

-- Dumping structure for table db_spa.inf_time
CREATE TABLE IF NOT EXISTS `inf_time` (
  `et_id` int(1) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `et_time` float DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  PRIMARY KEY (`et_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- Dumping data for table db_spa.inf_time: ~0 rows (approximately)
INSERT INTO `inf_time` (`et_id`, `et_time`, `branch_id`, `start_time`, `end_time`) VALUES
	(1, 20, 1, '10:00:00', '24:00:00');

-- Dumping structure for table db_spa.inf_token
CREATE TABLE IF NOT EXISTS `inf_token` (
  `tok_id` int(11) NOT NULL AUTO_INCREMENT,
  `measure_number` int(11) DEFAULT 0,
  `measure_time` varchar(50) COLLATE latin1_general_ci DEFAULT '0',
  `tok_school_code` varchar(50) COLLATE latin1_general_ci DEFAULT '0',
  PRIMARY KEY (`tok_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- Dumping data for table db_spa.inf_token: ~0 rows (approximately)
INSERT INTO `inf_token` (`tok_id`, `measure_number`, `measure_time`, `tok_school_code`) VALUES
	(1, 2, 'hours', '505');

-- Dumping structure for table db_spa.tbl_accounts
CREATE TABLE IF NOT EXISTS `tbl_accounts` (
  `acc_id` int(11) NOT NULL AUTO_INCREMENT,
  `priv_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `acc_uname` varchar(25) COLLATE latin1_general_ci DEFAULT NULL,
  `acc_pass` varchar(150) COLLATE latin1_general_ci DEFAULT NULL,
  `acc_status` varchar(25) COLLATE latin1_general_ci DEFAULT NULL,
  `acc_date_created` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `acc_joined` timestamp NULL DEFAULT NULL,
  `deleted` tinyint(1) unsigned zerofill NOT NULL,
  PRIMARY KEY (`acc_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- Dumping data for table db_spa.tbl_accounts: ~7 rows (approximately)
INSERT INTO `tbl_accounts` (`acc_id`, `priv_id`, `branch_id`, `acc_uname`, `acc_pass`, `acc_status`, `acc_date_created`, `acc_joined`, `deleted`) VALUES
	(1, 1, 1, 'super_admin', '$2b$10$uKFRocG905nAex9e9K8Zs.Ym4AyUuXh.7VQG3WKHkwZlZX4whmpS6', 'active', '2022-03-18 03:52:13', '2022-03-15 05:27:41', 0),
	(2, 1, 1, 'admin', '$2b$10$uKFRocG905nAex9e9K8Zs.Ym4AyUuXh.7VQG3WKHkwZlZX4whmpS6', 'active', '2022-04-20 06:43:41', NULL, 0),
	(19, 2, 3, 'sample', '$2b$10$88uwbTxEHEm/b6rRGw0lQ.8UYdlmH3ih.t73o0cwvROi323VhruBO', NULL, NULL, NULL, 0),
	(20, 1, 1, 'test', '$2b$10$yY7ctsx9zvdvTwDzIt/E5O1YRflzO0Nl9EOUn851xQsNTcIfwPwpu', NULL, NULL, NULL, 0),
	(21, 2, 1, 'a', '$2b$10$pl5wDmmsScyNEHLOFx7Yju0g/k9jYZlIIIzKEcYMAT.KY/uJIe/tu', NULL, NULL, NULL, 0),
	(22, 2, 1, 'b', '$2b$10$3bnQfBrzsKfL9pKjvWtoC.9wbUR9zZvNo159QnN4sz681I09vv/l2', NULL, NULL, NULL, 0),
	(23, 2, 1, 'admin_mandalagan', '$2b$10$nudh2kdkjGFzr4cTzWI.Rur7DY6.hrZc1MAtBJvLWsRr2WE/Z0Vtu', NULL, NULL, NULL, 0);

-- Dumping structure for table db_spa.tbl_avail_member
CREATE TABLE IF NOT EXISTS `tbl_avail_member` (
  `avail_mem_id` int(11) NOT NULL AUTO_INCREMENT,
  `mem_id` int(10) unsigned NOT NULL,
  `avail_mem_order` int(10) unsigned NOT NULL,
  `avail_mem_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `branch_id` int(11) DEFAULT NULL,
  `service_total` int(2) DEFAULT NULL,
  PRIMARY KEY (`avail_mem_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin2;

-- Dumping data for table db_spa.tbl_avail_member: ~7 rows (approximately)
INSERT INTO `tbl_avail_member` (`avail_mem_id`, `mem_id`, `avail_mem_order`, `avail_mem_date`, `branch_id`, `service_total`) VALUES
	(1, 84, 1, '2023-06-20 01:47:37', 1, NULL),
	(2, 75, 2, '2023-06-20 01:47:38', 1, NULL),
	(3, 97, 3, '2023-06-20 01:47:38', 1, NULL),
	(4, 86, 4, '2023-06-20 02:05:25', 1, 1),
	(5, 85, 5, '2023-06-20 01:47:39', 1, NULL),
	(6, 73, 6, '2023-06-20 01:47:40', 1, NULL),
	(7, 91, 7, '2023-06-20 01:47:40', 1, NULL),
	(8, 98, 8, '2023-06-20 01:48:45', 1, NULL);

-- Dumping structure for table db_spa.tbl_avail_member_log
CREATE TABLE IF NOT EXISTS `tbl_avail_member_log` (
  `avail_mem_id` int(11) NOT NULL AUTO_INCREMENT,
  `mem_id` int(10) unsigned NOT NULL,
  `avail_mem_order` int(10) unsigned NOT NULL,
  `avail_mem_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `branch_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`avail_mem_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=latin2 ROW_FORMAT=DYNAMIC;

-- Dumping data for table db_spa.tbl_avail_member_log: ~40 rows (approximately)
INSERT INTO `tbl_avail_member_log` (`avail_mem_id`, `mem_id`, `avail_mem_order`, `avail_mem_date`, `branch_id`) VALUES
	(1, 11, 1, '2022-06-23 05:45:31', 1),
	(2, 4, 2, '2022-06-23 05:45:32', 1),
	(3, 2, 3, '2022-06-23 05:45:33', 1),
	(4, 28, 4, '2022-06-23 05:45:33', 1),
	(5, 41, 5, '2022-06-23 05:45:34', 1),
	(6, 67, 6, '2022-06-24 05:48:27', 1),
	(7, 11, 1, '2022-06-22 05:45:31', 1),
	(8, 2, 3, '2022-06-22 05:45:33', 1),
	(9, 68, 7, '2022-06-23 07:34:30', 1),
	(10, 68, 8, '2022-06-23 07:36:47', 1),
	(11, 68, 9, '2022-06-23 07:37:02', 1),
	(12, 68, 10, '2022-06-23 07:39:21', 1),
	(13, 68, 11, '2022-06-23 07:42:17', 1),
	(14, 15, 12, '2022-10-14 01:54:15', 1),
	(15, 70, 13, '2022-10-14 02:06:56', 1),
	(16, 71, 14, '2022-10-14 02:06:58', 1),
	(17, 73, 15, '2022-10-14 03:30:20', 1),
	(18, 75, 16, '2022-10-14 03:31:21', 1),
	(19, 76, 17, '2022-10-14 03:31:41', 1),
	(20, 70, 18, '2022-10-14 03:31:48', 1),
	(21, 77, 19, '2022-10-14 03:32:14', 1),
	(22, 78, 20, '2022-10-14 03:34:57', 1),
	(23, 79, 21, '2022-10-16 09:20:05', 1),
	(24, 72, 22, '2022-10-16 09:20:08', 1),
	(25, 77, 23, '2022-10-16 09:20:20', 1),
	(26, 71, 24, '2022-10-20 02:36:07', 1),
	(27, 76, 25, '2022-10-25 03:01:42', 1),
	(28, 71, 26, '2022-10-25 03:58:20', 1),
	(29, 84, 27, '2022-10-25 05:57:31', 1),
	(30, 81, 28, '2022-10-25 05:57:36', 1),
	(31, 88, 29, '2022-10-25 05:57:43', 1),
	(32, 98, 30, '2022-10-26 03:09:30', 1),
	(33, 84, 31, '2022-10-28 08:22:38', 1),
	(34, 84, 32, '2023-06-20 01:47:37', 1),
	(35, 75, 33, '2023-06-20 01:47:38', 1),
	(36, 97, 34, '2023-06-20 01:47:38', 1),
	(37, 86, 35, '2023-06-20 01:47:38', 1),
	(38, 85, 36, '2023-06-20 01:47:39', 1),
	(39, 73, 37, '2023-06-20 01:47:40', 1),
	(40, 91, 38, '2023-06-20 01:47:40', 1),
	(41, 98, 39, '2023-06-20 01:48:45', 1);

-- Dumping structure for table db_spa.tbl_bookings
CREATE TABLE IF NOT EXISTS `tbl_bookings` (
  `book_id` int(11) NOT NULL AUTO_INCREMENT,
  `book_guest_id` int(11) NOT NULL DEFAULT 0,
  `book_pax_id` int(11) NOT NULL DEFAULT 0,
  `mem_id` int(2) DEFAULT NULL,
  `branch_id` int(2) DEFAULT NULL,
  `room_id` int(2) unsigned DEFAULT NULL,
  `service_id` int(2) unsigned DEFAULT NULL,
  `disc_id` int(11) DEFAULT NULL,
  `book_guest_name` varchar(25) COLLATE latin1_general_ci DEFAULT NULL,
  `book_guest_number` varchar(25) COLLATE latin1_general_ci DEFAULT NULL,
  `book_pax` int(11) DEFAULT NULL,
  `booked_date` date DEFAULT NULL,
  `time_start` time DEFAULT NULL,
  `time_end` time DEFAULT NULL,
  `booked_by` varchar(30) COLLATE latin1_general_ci DEFAULT NULL COMMENT 'prof_id',
  `booked_status` int(11) DEFAULT NULL COMMENT 'pending - 0, completed - 2, arrived - 1, cancelled - 2',
  `mode_of_payment` varchar(25) COLLATE latin1_general_ci DEFAULT NULL,
  `price` float DEFAULT NULL,
  `total_price` float DEFAULT NULL,
  `notes` longtext COLLATE latin1_general_ci DEFAULT NULL,
  PRIMARY KEY (`book_id`)
) ENGINE=InnoDB AUTO_INCREMENT=136 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- Dumping data for table db_spa.tbl_bookings: ~7 rows (approximately)
INSERT INTO `tbl_bookings` (`book_id`, `book_guest_id`, `book_pax_id`, `mem_id`, `branch_id`, `room_id`, `service_id`, `disc_id`, `book_guest_name`, `book_guest_number`, `book_pax`, `booked_date`, `time_start`, `time_end`, `booked_by`, `booked_status`, `mode_of_payment`, `price`, `total_price`, `notes`) VALUES
	(1, 1, 0, 84, 1, 16, 1, 0, 'Candy', '9123543643', 2, '2023-06-20', '10:00:00', '11:20:00', '23', 6, '', 520, 520, ''),
	(125, 1, 1, 98, 1, 0, 0, 0, 'Test A', '9275149982', 1, '2022-11-05', '10:00:00', '00:00:00', '23', 0, '', 0, 0, ''),
	(127, 2, 0, 75, 1, 16, 4, 0, 'Andrew Adams', '912312433', 2, '2023-06-20', '10:00:00', '11:20:00', '23', 2, '', 520, 520, ''),
	(132, 7, 0, 86, 1, 18, 1, 0, 'ralph', '6564645', 3, '2023-06-20', '11:45:00', '13:05:00', '23', 1, '', 520, 520, ''),
	(133, 4, 0, 85, 1, 16, 1, 0, 'Alexa', '36334', 3, '2023-06-20', '11:15:00', '12:35:00', '23', 3, '', 520, 520, ''),
	(134, 6, 0, 91, 1, 16, 5, 0, 'Arthur', '46363', 1, '2023-06-20', '10:30:00', '11:50:00', '23', 0, '', 520, 520, ''),
	(135, 2, 0, 84, 1, 16, 1, 0, 'Andrew Adams', '912312433', 2, '2023-06-20', '11:30:00', '12:50:00', '23', 2, '', 520, 520, '');

-- Dumping structure for table db_spa.tbl_bookings_archived
CREATE TABLE IF NOT EXISTS `tbl_bookings_archived` (
  `book_id` int(11) NOT NULL DEFAULT 0,
  `book_guest_id` int(11) NOT NULL DEFAULT 0,
  `book_pax_id` int(11) NOT NULL DEFAULT 0,
  `mem_id` int(2) DEFAULT NULL,
  `branch_id` int(2) DEFAULT NULL,
  `room_id` int(2) unsigned DEFAULT NULL,
  `service_id` int(2) unsigned DEFAULT NULL,
  `disc_id` int(11) DEFAULT NULL,
  `book_guest_name` varchar(25) CHARACTER SET latin1 COLLATE latin1_general_ci DEFAULT NULL,
  `book_guest_number` varchar(25) CHARACTER SET latin1 COLLATE latin1_general_ci DEFAULT NULL,
  `book_pax` int(11) DEFAULT NULL,
  `booked_date` date DEFAULT NULL,
  `time_start` time DEFAULT NULL,
  `time_end` time DEFAULT NULL,
  `booked_by` varchar(30) CHARACTER SET latin1 COLLATE latin1_general_ci DEFAULT NULL COMMENT 'prof_id',
  `booked_status` int(11) DEFAULT NULL COMMENT 'pending - 0, completed - 2, arrived - 1, cancelled - 2',
  `mode_of_payment` varchar(25) CHARACTER SET latin1 COLLATE latin1_general_ci DEFAULT NULL,
  `price` float DEFAULT NULL,
  `total_price` float DEFAULT NULL,
  `notes` longtext CHARACTER SET latin1 COLLATE latin1_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table db_spa.tbl_bookings_archived: ~52 rows (approximately)
INSERT INTO `tbl_bookings_archived` (`book_id`, `book_guest_id`, `book_pax_id`, `mem_id`, `branch_id`, `room_id`, `service_id`, `disc_id`, `book_guest_name`, `book_guest_number`, `book_pax`, `booked_date`, `time_start`, `time_end`, `booked_by`, `booked_status`, `mode_of_payment`, `price`, `total_price`, `notes`) VALUES
	(15, 7, 7, 0, 1, 0, 0, 0, 'cardo', '43412421112', 1, '2022-06-17', '11:00:00', '00:00:00', '23', 0, '', 0, 0, ''),
	(7, 2, 2, 2, 1, 21, 3, 0, 'Aisa', '9251498489', 1, '2022-06-22', '10:00:00', '11:20:00', '23', 1, 'cash', 480, 480, ''),
	(6, 1, 1, 11, 1, 19, 1, 0, 'alyssa', '9275149982', 1, '2022-06-22', '10:00:00', '11:20:00', '23', 1, 'cash', 480, 480, ''),
	(8, 3, 3, 41, 1, 23, 1, 0, 'Matthew', '9275149982', 1, '2022-06-23', '10:00:00', '11:20:00', '23', 1, 'gcash', 480, 480, ''),
	(9, 4, 4, 2, 1, 22, 1, 0, 'Gerald', '9249498955', 1, '2022-06-23', '11:00:00', '12:50:00', '23', 1, 'cash', 480, 680, ''),
	(10, 4, 4, 2, 1, 22, 10, 0, 'Gerald', '9249498955', 1, '2022-06-23', '11:30:00', '12:50:00', '23', 1, 'cash', 200, 680, ''),
	(16, 5, 5, 67, 1, 0, 1, 0, 'Jenny', '9266635948', 1, '2022-06-24', '11:00:00', '12:20:00', '23', 0, '', 480, 960, ''),
	(17, 5, 5, 67, 1, 0, 5, 0, 'Jenny', '9266635948', 1, '2022-06-24', '11:00:00', '12:20:00', '23', 0, '', 480, 960, ''),
	(18, 6, 6, 11, 1, 25, 10, 0, 'test 1', '9123212321', 12, '2022-06-23', '10:00:00', '11:20:00', '23', 0, '', 200, 1160, ''),
	(19, 6, 6, 11, 1, 25, 2, 0, 'test 1', '9123212321', 12, '2022-06-23', '10:00:00', '11:20:00', '23', 0, '', 480, 1160, ''),
	(20, 6, 6, 11, 1, 25, 5, 0, 'test 1', '9123212321', 12, '2022-06-23', '10:00:00', '11:20:00', '23', 0, '', 480, 1160, ''),
	(21, 7, 7, 0, 1, 0, 0, 0, 'Sample', '9275149982', 1, '2022-06-27', '10:00:00', '00:00:00', '23', 0, '', 0, 0, ''),
	(22, 8, 8, 0, 1, 0, 0, 0, 'Sample', '9275149982', 1, '2022-07-14', '17:00:00', '00:00:00', '23', 0, '', 0, 0, ''),
	(23, 9, 9, 0, 1, 0, 0, 0, 'shireen', '9815581061', 2, '2022-10-12', '14:00:00', '00:00:00', '2', 0, '', 0, 0, ''),
	(25, 10, 10, 70, 1, 16, 1, 0, 'CARLYN MAE ', '9171321395', 2, '2022-10-14', '10:00:00', '11:20:00', '2', 0, 'cash', 480, 1130, ''),
	(26, 10, 10, 70, 1, 16, 65, 0, 'CARLYN MAE ', '9171321395', 2, '2022-10-14', '10:00:00', '11:20:00', '2', 0, 'cash', 650, 1130, ''),
	(28, 11, 11, 70, 1, 20, 1, 0, 'MICA', '9661630313', 1, '2022-10-14', '10:00:00', '11:20:00', '2', 0, 'cash', 480, 480, ''),
	(33, 2, 2, 71, 1, 20, 7, 7, 'RRR', '9661630313', 1, '2022-10-14', '15:30:00', '16:50:00', '2', 0, 'cash', 617.5, 617.5, ''),
	(34, 1, 1, 70, 1, 19, 122, 0, 'REGINA SOBUSA', '9176107390', 1, '2022-10-14', '11:00:00', '12:50:00', '2', 0, 'cash', 250, 1000, 'ERD- IZA BUYCO'),
	(35, 1, 1, 70, 1, 19, 17, 0, 'REGINA SOBUSA', '9176107390', 1, '2022-10-14', '13:30:00', '15:20:00', '2', 0, 'cash', 750, 1000, 'ERD- IZA BUYCO'),
	(40, 3, 3, 71, 1, 21, 1, 0, 'MMMM', '9661630313', 1, '2022-10-14', '10:00:00', '11:20:00', '2', 0, 'cash', 480, 480, ''),
	(57, 4, 4, 0, 1, 0, 0, 0, 'L;M,KLM', '51562', 1, '2022-10-14', '10:00:00', '00:00:00', '2', 0, '', 0, 0, ''),
	(62, 5, 5, 78, 1, 19, 1, 12, 'OLIVER SY', '3', 2, '2022-10-16', '20:00:00', '21:20:00', '2', 0, 'cash', 416, 936, ''),
	(63, 5, 5, 78, 1, 19, 2, 0, 'OLIVER SY', '3', 2, '2022-10-16', '14:30:00', '15:50:00', '2', 4, 'cash', 520, 936, ''),
	(58, 4, 4, 0, 1, 0, 0, 0, 'OLIVER SY', '2581', 1, '2022-10-17', '15:00:00', '00:00:00', '2', 4, '', 0, 0, ''),
	(55, 3, 3, 0, 1, 17, 11, 0, 'SWEET UBERAS', '9562701515', 2, '2022-10-14', '14:00:00', '15:50:00', '2', 4, 'cash', 720, 1440, ''),
	(56, 3, 3, 0, 1, 17, 11, 0, 'SWEET UBERAS', '9562701515', 2, '2022-10-14', '14:00:00', '15:50:00', '2', 4, 'cash', 720, 1440, ''),
	(47, 2, 2, 76, 1, 0, 104, 0, 'PATTY FELIX', '9175314202', 1, '2022-10-14', '13:00:00', '14:50:00', '2', 4, 'cash', 500, 850, ''),
	(48, 2, 2, 76, 1, 0, 105, 0, 'PATTY FELIX', '9175314202', 1, '2022-10-14', '13:00:00', '14:50:00', '2', 4, 'cash', 250, 850, ''),
	(49, 2, 2, 76, 1, 0, 109, 0, 'PATTY FELIX', '9175314202', 1, '2022-10-14', '13:00:00', '14:50:00', '2', 4, 'cash', 100, 850, ''),
	(44, 1, 1, 73, 1, 20, 122, 0, 'REGINA SOBUSA', '9176107390', 1, '2022-10-14', '12:00:00', '13:50:00', '2', 4, 'cash', 250, 1040, 'ERD- IZA BUYCO'),
	(45, 1, 1, 73, 1, 20, 17, 0, 'REGINA SOBUSA', '9176107390', 1, '2022-10-14', '12:00:00', '13:50:00', '2', 4, 'cash', 790, 1040, 'ERD- IZA BUYCO'),
	(64, 1, 1, 0, 1, 0, 0, 0, 'CARLYN', '123', 2, '2022-10-20', '10:00:00', '00:00:00', '2', 0, '', 0, 0, ''),
	(66, 2, 2, 73, 1, 16, 1, 0, 'MICA', '123', 1, '2022-10-25', '10:00:00', '11:20:00', '2', 0, '', 520, 520, ''),
	(68, 3, 3, 73, 1, 24, 11, 0, 'mi', '9661630313', 3, '2022-10-21', '12:00:00', '13:20:00', '2', 0, 'cash', 720, 1500, ''),
	(72, 4, 4, 73, 1, 16, 1, 0, 'asa', '9275149982', 1, '2022-10-26', '10:00:00', '11:20:00', '2', 0, '', 520, 520, ''),
	(69, 3, 3, 73, 1, 24, 5, 0, 'mi', '9661630313', 3, '2022-10-21', '12:00:00', '13:20:00', '2', 0, 'cash', 520, 1500, ''),
	(70, 3, 3, 73, 1, 24, 2, 8, 'mi', '9661630313', 3, '2022-10-21', '12:00:00', '13:20:00', '2', 0, 'cash', 260, 1500, ''),
	(87, 5, 5, 73, 1, 16, 1, 8, 'MICA', '9661630313', 2, '2022-10-29', '14:00:00', '15:20:00', '2', 0, 'cash', 260, 260, ''),
	(88, 5, 5, 0, 1, 0, 0, 0, 'MICA', '9661630313', 1, '2022-10-29', '14:00:00', '00:00:00', '2', 0, '', 0, 0, ''),
	(93, 6, 6, 73, 1, 25, 1, 8, 'MICA', '9661630313', 1, '2022-10-25', '14:00:00', '15:20:00', '2', 1, 'cash', 260, 260, ''),
	(120, 10, 10, 71, 1, 16, 1, 0, 'BJHBJ', '54645645', 1, '2022-10-25', '15:00:00', '16:20:00', '2', 0, '', 520, 520, ''),
	(121, 10, 10, 0, 1, 0, 0, 0, 'LPOL0POL', '21565131231', 1, '2022-10-29', '15:00:00', '00:00:00', '2', 0, '', 0, 0, ''),
	(124, 5, 5, 71, 1, 26, 1, 0, 'DON COLMINARES', '9173800301', 1, '2022-10-26', '16:00:00', '17:20:00', '2', 1, '', 520, 520, ''),
	(118, 8, 8, 84, 1, 18, 11, 0, 'LOVELY', '9613240723', 1, '2022-10-25', '14:00:00', '15:50:00', '2', 1, '', 720, 720, ''),
	(117, 3, 3, 73, 1, 17, 11, 0, 'KRAM', '9613240723', 1, '2022-10-25', '14:00:00', '15:50:00', '2', 1, '', 720, 720, ''),
	(116, 9, 9, 88, 1, 19, 4, 0, 'KIRK CLYDE VILLA', '9153793920', 1, '2022-10-25', '14:00:00', '15:20:00', '2', 1, '', 520, 520, ''),
	(115, 1, 1, 81, 1, 20, 4, 0, 'JENNY TRISHA GO', '9153793920', 1, '2022-10-25', '14:00:00', '15:20:00', '2', 1, '', 520, 520, ''),
	(112, 6, 6, 0, 1, 25, 1, 0, 'DON COLMINARES', '9173800301', 1, '2022-10-25', '16:00:00', '17:20:00', '2', 0, 'cash', 520, 520, ''),
	(100, 4, 4, 0, 1, 32, 105, 0, 'CAMILLE', '9157064413', 1, '2022-10-25', '14:00:00', '15:50:00', '2', 0, 'cash', 250, 250, ''),
	(99, 7, 7, 0, 1, 33, 105, 0, 'CAMILLE', '9157064413', 1, '2022-10-25', '14:00:00', '15:50:00', '2', 0, 'cash', 250, 250, ''),
	(79, 2, 2, 0, 1, 28, 67, 0, 'ANALIYAH JAENA', '9208998601', 1, '2022-10-25', '17:00:00', '19:05:00', '2', 0, 'cash', 850, 850, 'C/O MISS JELYN');

-- Dumping structure for table db_spa.tbl_branch
CREATE TABLE IF NOT EXISTS `tbl_branch` (
  `branch_id` int(11) NOT NULL AUTO_INCREMENT,
  `branch_name` varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
  `branch_address` varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
  `branch_tel` varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
  `branch_created_date` timestamp NULL DEFAULT NULL,
  `branch_joined_date` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`branch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- Dumping data for table db_spa.tbl_branch: ~2 rows (approximately)
INSERT INTO `tbl_branch` (`branch_id`, `branch_name`, `branch_address`, `branch_tel`, `branch_created_date`, `branch_joined_date`) VALUES
	(1, 'Mandalagan', 'Lacson Street', '411111', '2022-03-15 05:28:53', '2022-03-15 05:28:53'),
	(3, 'East', 'Hi Strip, Homesite', NULL, NULL, '2022-04-12 07:38:13');

-- Dumping structure for table db_spa.tbl_customers
CREATE TABLE IF NOT EXISTS `tbl_customers` (
  `cus_id` int(11) NOT NULL AUTO_INCREMENT,
  `cus_name` varchar(250) NOT NULL,
  `cus_no` varchar(20) NOT NULL,
  `cus_cat_id` int(11) NOT NULL DEFAULT 0,
  `cus_date` datetime NOT NULL,
  `cus_note` varchar(200) NOT NULL DEFAULT '',
  `deleted` int(1) unsigned zerofill NOT NULL,
  PRIMARY KEY (`cus_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

-- Dumping data for table db_spa.tbl_customers: ~7 rows (approximately)
INSERT INTO `tbl_customers` (`cus_id`, `cus_name`, `cus_no`, `cus_cat_id`, `cus_date`, `cus_note`, `deleted`) VALUES
	(1, 'Candy', '09123543643', 1, '2023-03-23 00:00:00', '', 0),
	(2, 'Andrew Adams', '912312433', 1, '0000-00-00 00:00:00', '', 0),
	(3, 'Sample', '902342324243', 2, '0000-00-00 00:00:00', '', 0),
	(4, 'Alexa', '36334', 2, '0000-00-00 00:00:00', '', 0),
	(5, 'Jenny', '9234523524', 2, '0000-00-00 00:00:00', '', 0),
	(6, 'Arthur', '46363', 1, '0000-00-00 00:00:00', '', 0),
	(7, 'ralph', '6564645', 3, '0000-00-00 00:00:00', '', 0);

-- Dumping structure for table db_spa.tbl_members
CREATE TABLE IF NOT EXISTS `tbl_members` (
  `mem_id` int(11) NOT NULL AUTO_INCREMENT,
  `branch_id` int(11) DEFAULT NULL,
  `mem_name` varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
  `mem_status` varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
  `mem_order` int(11) DEFAULT NULL,
  `mem_in` varchar(10) COLLATE latin1_general_ci NOT NULL DEFAULT 'false',
  `mem_date_created` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `mem_total_services` int(5) NOT NULL,
  `mem_restricted` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`mem_id`)
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- Dumping data for table db_spa.tbl_members: ~26 rows (approximately)
INSERT INTO `tbl_members` (`mem_id`, `branch_id`, `mem_name`, `mem_status`, `mem_order`, `mem_in`, `mem_date_created`, `mem_total_services`, `mem_restricted`) VALUES
	(71, 1, 'Tumbocon, Riza A. ', 'available', NULL, 'false', '2023-06-20 01:47:30', 4, 0),
	(72, 1, 'Mansueto, Flordeluz G.', 'not available', NULL, 'false', '2022-10-16 09:25:15', 0, 0),
	(73, 1, 'Bolivar, Peggy Ann L. ', 'available', NULL, 'true', '2023-06-20 01:47:40', 2, 0),
	(75, 1, 'Ardenete Baby Lyn B.', 'not available', NULL, 'true', '2023-06-20 01:47:38', 0, 0),
	(76, 1, 'Guillermo, Sarah', 'available', NULL, 'false', '2023-06-20 01:47:30', 0, 0),
	(77, 1, 'Gamboa, Charisa N.', 'absent', NULL, 'false', '2022-10-25 03:07:42', 0, 0),
	(78, 1, 'Moliten, Sharon P', 'not available', NULL, 'false', '2022-10-16 09:25:11', 0, 0),
	(80, 1, 'Fajardo, Maricel D.', 'not available', NULL, 'false', '2022-10-25 03:28:05', 0, 0),
	(81, 1, 'Dela Paz, Jenelyn', 'not available', NULL, 'false', '2023-06-20 01:47:30', 1, 0),
	(82, 1, 'Magbanua, Melanie M.', 'not available', NULL, 'false', '2022-10-25 03:28:57', 0, 0),
	(83, 1, 'Tejado, Levy E.', 'not available', NULL, 'false', '2022-10-25 03:29:10', 0, 0),
	(84, 1, 'Alicando, Analiza', 'available', NULL, 'true', '2023-06-20 01:47:37', 1, 0),
	(85, 1, 'Azucena, Verna E.', 'not available', NULL, 'true', '2023-06-20 01:47:39', 0, 0),
	(86, 1, 'Ayon, Joy F.', 'not available', NULL, 'true', '2023-06-20 01:47:38', 0, 0),
	(87, 1, 'Espintra, Anabelle', 'not available', NULL, 'false', '2022-10-25 03:30:12', 0, 0),
	(88, 1, 'Pritos, Cheryl . ', 'not available', NULL, 'false', '2023-06-20 01:47:30', 1, 0),
	(89, 1, 'De Roma, Joenamie B.', 'not available', NULL, 'false', '2022-10-25 03:30:39', 0, 0),
	(90, 1, 'Gemillian, Ronalin E. ', 'not available', NULL, 'false', '2022-10-25 03:30:59', 0, 0),
	(91, 1, 'Baones, Rebecca L.', 'not available', NULL, 'true', '2023-06-20 01:47:40', 0, 0),
	(92, 1, 'Llena, Cleopatra O.', 'not available', NULL, 'false', '2022-10-25 03:51:43', 0, 0),
	(93, 1, 'Estaniel, Cheryl E.', 'not available', NULL, 'false', '2022-10-25 03:51:57', 0, 0),
	(94, 1, 'Guitchi, Jecelle N.', 'not available', NULL, 'false', '2022-10-25 03:52:11', 0, 0),
	(95, 1, 'Dilao, Stephanie', 'not available', NULL, 'false', '2022-10-25 03:52:25', 0, 0),
	(96, 1, 'Necessario, Mercy P.', 'not available', NULL, 'false', '2022-10-25 03:52:39', 0, 0),
	(97, 1, 'Asunan, Dyan ', 'not available', NULL, 'true', '2023-06-20 01:47:38', 0, 0),
	(98, 1, 'TBA', 'available', NULL, 'true', '2023-06-20 01:48:45', -1, 0);

-- Dumping structure for table db_spa.tbl_members_render
CREATE TABLE IF NOT EXISTS `tbl_members_render` (
  `render_id` int(11) NOT NULL AUTO_INCREMENT,
  `mem_id` int(11) DEFAULT NULL,
  `render_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`render_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- Dumping data for table db_spa.tbl_members_render: ~0 rows (approximately)

-- Dumping structure for table db_spa.tbl_privileges
CREATE TABLE IF NOT EXISTS `tbl_privileges` (
  `priv_id` int(11) NOT NULL AUTO_INCREMENT,
  `priv_label` varchar(15) COLLATE latin1_general_ci DEFAULT NULL COMMENT 'super admin, admin, user',
  `priv_binary` varchar(15) COLLATE latin1_general_ci DEFAULT NULL COMMENT 'navs id',
  PRIMARY KEY (`priv_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- Dumping data for table db_spa.tbl_privileges: ~3 rows (approximately)
INSERT INTO `tbl_privileges` (`priv_id`, `priv_label`, `priv_binary`) VALUES
	(1, 'super-admin', '1,1,1,1,1,1,1,1'),
	(2, 'admin', '1,1,1,1,1,0,1,0'),
	(3, 'user', '1,1,1,1,1,0,1,0');

-- Dumping structure for table db_spa.tbl_privileges_setting
CREATE TABLE IF NOT EXISTS `tbl_privileges_setting` (
  `sett_id` int(11) NOT NULL AUTO_INCREMENT,
  `priv_id` int(11) DEFAULT NULL,
  `sett_url` varchar(25) COLLATE latin1_general_ci DEFAULT NULL,
  `nav_id` int(11) DEFAULT NULL,
  `view` int(11) DEFAULT NULL,
  `add` int(11) DEFAULT NULL,
  `update` int(11) DEFAULT NULL,
  `delete` int(11) DEFAULT NULL,
  `acc_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`sett_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=150 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci ROW_FORMAT=DYNAMIC;

-- Dumping data for table db_spa.tbl_privileges_setting: ~48 rows (approximately)
INSERT INTO `tbl_privileges_setting` (`sett_id`, `priv_id`, `sett_url`, `nav_id`, `view`, `add`, `update`, `delete`, `acc_id`) VALUES
	(1, 1, '/dashboard', 1, 1, 1, 1, 1, 1),
	(2, 1, '/therapist', 4, 1, 1, 1, 1, 1),
	(3, 1, '/bookings', 3, 1, 1, 1, 1, 1),
	(4, 1, '/calendar', 2, 1, 1, 1, 1, 1),
	(5, 1, '/services', 6, 1, 1, 1, 1, 1),
	(6, 1, '/rooms', 5, 1, 1, 1, 1, 1),
	(7, 1, '/availability', 7, 1, 1, 1, 1, 1),
	(8, 1, '/discounts', 8, 1, 1, 1, 1, 1),
	(109, 2, '/dashboard', 1, 1, 1, 1, 1, 2),
	(110, 2, '/calendar', 2, 1, 1, 1, 1, 2),
	(111, 2, '/bookings', 3, 1, 1, 1, 1, 2),
	(112, 2, '/therapist', 4, 1, 1, 1, 1, 2),
	(113, 2, '/rooms', 5, 1, 1, 1, 1, 2),
	(114, 2, '/services', 6, 1, 1, 1, 1, 2),
	(115, 2, '/availability', 7, 1, 1, 1, 1, 2),
	(116, 2, '/discounts', 8, 1, 1, 1, 1, 2),
	(117, 1, '/dashboard', 1, 1, 1, 1, 1, 20),
	(118, 1, '/calendar', 2, 1, 1, 1, 1, 20),
	(119, 1, '/bookings', 3, 1, 1, 1, 1, 20),
	(120, 1, '/therapist', 4, 1, 1, 1, 1, 20),
	(121, 1, '/rooms', 5, 1, 1, 1, 1, 20),
	(122, 1, '/services', 6, 1, 1, 1, 1, 20),
	(123, 1, '/availability', 7, 1, 1, 1, 1, 20),
	(124, 1, '/discounts', 8, 1, 1, 1, 1, 20),
	(125, 2, '/dashboard', 1, 1, 1, 1, 1, 21),
	(126, 2, '/calendar', 2, 1, 1, 1, 1, 21),
	(127, 2, '/bookings', 3, 1, 1, 1, 1, 21),
	(128, 2, '/therapist', 4, 1, 1, 1, 1, 21),
	(129, 2, '/rooms', 5, 1, 1, 1, 1, 21),
	(130, 2, '/services', 6, 0, 0, 0, 0, 21),
	(131, 2, '/availability', 7, 1, 1, 1, 1, 21),
	(132, 2, '/discounts', 8, 0, 0, 0, 0, 21),
	(133, 2, '/dashboard', 1, 1, 1, 1, 1, 22),
	(134, 2, '/calendar', 2, 1, 1, 1, 1, 22),
	(135, 2, '/bookings', 3, 1, 1, 1, 1, 22),
	(136, 2, '/therapist', 4, 1, 1, 1, 1, 22),
	(137, 2, '/rooms', 5, 1, 1, 1, 1, 22),
	(138, 2, '/services', 6, 0, 0, 0, 0, 22),
	(139, 2, '/availability', 7, 1, 1, 1, 1, 22),
	(140, 2, '/discounts', 8, 0, 0, 0, 0, 22),
	(141, 2, '/dashboard', 1, 1, 1, 1, 1, 23),
	(142, 2, '/calendar', 2, 0, 0, 0, 0, 23),
	(143, 2, '/bookings', 3, 1, 1, 1, 1, 23),
	(144, 2, '/therapist', 4, 1, 1, 1, 1, 23),
	(145, 2, '/rooms', 5, 1, 1, 1, 1, 23),
	(146, 2, '/services', 6, 1, 1, 1, 1, 23),
	(147, 2, '/availability', 7, 1, 1, 1, 1, 23),
	(148, 2, '/discounts', 8, 1, 1, 1, 1, 23);

-- Dumping structure for table db_spa.tbl_profiles
CREATE TABLE IF NOT EXISTS `tbl_profiles` (
  `prof_id` int(11) NOT NULL AUTO_INCREMENT,
  `acc_id` int(11) DEFAULT NULL,
  `prof_name` varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
  `prof_num` varchar(25) COLLATE latin1_general_ci DEFAULT NULL,
  `prof_position` varchar(25) COLLATE latin1_general_ci DEFAULT NULL COMMENT 'receptionist, ceo, therapist, staff',
  `prof_address` varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
  PRIMARY KEY (`prof_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- Dumping data for table db_spa.tbl_profiles: ~7 rows (approximately)
INSERT INTO `tbl_profiles` (`prof_id`, `acc_id`, `prof_name`, `prof_num`, `prof_position`, `prof_address`) VALUES
	(1, 1, 'Jane Doe', '09213546987', 'receptionist', 'Brgy. Tangub'),
	(2, 2, 'John Does', '09245556685', 'receptionist', 'Mandalagan'),
	(19, 19, 'sample', NULL, NULL, NULL),
	(20, 20, 'test', NULL, NULL, NULL),
	(21, 21, 'a', NULL, NULL, NULL),
	(22, 22, 'b', NULL, NULL, NULL),
	(23, 23, 'Ms. Jane Doe', NULL, NULL, NULL);

-- Dumping structure for table db_spa.tbl_services
CREATE TABLE IF NOT EXISTS `tbl_services` (
  `service_id` int(11) NOT NULL AUTO_INCREMENT,
  `service_code` varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
  `item_code` varchar(25) COLLATE latin1_general_ci DEFAULT NULL,
  `service_name` varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
  `service_dur` varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
  `service_group` varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
  `service_price` float(7,2) unsigned NOT NULL DEFAULT 0.00,
  `branch_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`service_id`)
) ENGINE=InnoDB AUTO_INCREMENT=173 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- Dumping data for table db_spa.tbl_services: ~166 rows (approximately)
INSERT INTO `tbl_services` (`service_id`, `service_code`, `item_code`, `service_name`, `service_dur`, `service_group`, `service_price`, `branch_id`) VALUES
	(1, 'A000000', 'SERV-0001', 'Mind and Body Bliss  1 Hour', '1', '4', 520.00, 1),
	(2, '\r\nA000001', 'SERV-0002', 'Athlete\'s Care 1 Hour', '1', '4', 520.00, 1),
	(3, '\r\nA000002', 'SERV-0003', 'Traveler\'s Retreat 1 Hour', '1', '4', 520.00, 1),
	(4, '\r\nA000003', 'SERV-0004', 'Aroma Wellness 1 Hour', '1', '4', 520.00, 1),
	(5, '\r\nA000040', 'SERV-0546', 'Thai Massage  1 Hour', '1', '4', 520.00, 1),
	(6, '\r\nA000004', 'SERV-0005', 'Chi Hot Stones 1 Hour', '1', '4', 590.00, 1),
	(7, '\r\nA000005', 'SERV-0006', 'Ventosa 1 Hour', '1', '4', 690.00, 1),
	(8, '\r\nA000006', 'SERV-0007', 'Heaven Sent (Kids) 1 Hour', '1', '4', 350.00, 1),
	(9, '\r\nA000007', 'SERV-0008', 'Mommy Cares 1 Hour', '1', '4', 550.00, 1),
	(10, '\r\nA300000', 'SERV-0009', 'Additional 30 Mins Body Massage', '.50', '4', 200.00, 1),
	(11, '\r\nA000008', 'SERV-0010', 'Mind and Body Bliss  1 1/2 Hour', '1.50', '4', 720.00, 1),
	(12, '\r\nA000009', 'SERV-0011', 'Athlete\'s Care  1 1/2 Hour', '1.50', '4', 720.00, 1),
	(13, '\r\nA000010', 'SERV-0012', 'Traveler\'s Retreat  1 1/2 Hour', '1.50', '4', 720.00, 1),
	(14, '\r\nA000011', 'SERV-0013', 'Aroma Wellness  1 1/2 Hour', '1.50', '4', 720.00, 1),
	(15, '\r\nA000041', 'SERV-0547', 'Thai Massage  1 1/2 Hour', '1.50', '4', 720.00, 1),
	(16, '\r\nA000012', 'SERV-0014', 'Chi Hot Stones 1 1/2 Hour', '1.50', '4', 690.00, 1),
	(17, '\r\nA000013', 'SERV-0015', 'Ventosa 1 1/2 Hour', '1.50', '4', 790.00, 1),
	(18, '\r\nA000014', 'SERV-0016', 'Heaven Sent (Kids) 1 1/2 Hour', '1.50', '4', 550.00, 1),
	(19, '\r\nA000015', 'SERV-0017', 'Mommy Cares 1 1/2 Hour', '1.50', '4', 750.00, 1),
	(20, '\r\nA000016', 'SERV-0018', 'Mind and Body Bliss 2 Hours', '2', '4', 1040.00, 1),
	(21, '\r\nA000017', 'SERV-0019', 'Athlete\'s Care 2 Hours', '2', '4', 1040.00, 1),
	(22, '\r\nA000018', 'SERV-0020', 'Traveler\'s Retreat 2 Hours', '2', '4', 1040.00, 1),
	(23, '\r\nA000019', 'SERV-0021', 'Aroma Wellness 2 Hours', '2', '4', 1040.00, 1),
	(24, '\r\nA000042', 'SERV-0548', 'Thai Massage 2 Hours', '2', '4', 1040.00, 1),
	(25, '\r\nA000020', 'SERV-0022', 'Chi Hot Stones 2 Hours', '2', '4', 1180.00, 1),
	(26, '\r\nA000021', 'SERV-0023', 'Ventosa 2 Hours', '2', '4', 1380.00, 1),
	(27, '\r\nA000022', 'SERV-0024', 'Heaven Sent (Kids) 2 Hours', '2', '4', 700.00, 1),
	(28, '\r\nA000023', 'SERV-0025', 'Mommy Cares 2 Hours', '2', '4', 1100.00, 1),
	(29, '\r\nA000024', 'SERV-0026', 'Mind and Body Bliss 2 1/2 Hours', '2.50', '4', 1240.00, 1),
	(30, '\r\nA000025', 'SERV-0027', 'Athlete\'s Care 2 1/2 Hours', '2.50', '4', 1240.00, 1),
	(31, '\r\nA000026', 'SERV-0028', 'Traveler\'s Retreat 2 1/2 Hours', '2.50', '4', 1240.00, 1),
	(32, '\r\nA000027', 'SERV-0029', 'Aroma Wellness 2 1/2 Hours', '2.50', '4', 1240.00, 1),
	(33, '\r\nA000043', 'SERV-0549', 'Thai Massage 2 1/2 Hours', '2.50', '4', 1240.00, 1),
	(34, '\r\nA000028', 'SERV-0030', 'Chi Hot Stones 2 1/2 Hours', '2.50', '4', 1380.00, 1),
	(35, '\r\nA000029', 'SERV-0031', 'Ventosa 2 1/2 Hours', '2.50', '4', 1580.00, 1),
	(36, '\r\nA000030', 'SERV-0032', 'Heaven Sent (Kids) 2 1/2 Hours', '2.50', '4', 900.00, 1),
	(37, '\r\nA000031', 'SERV-0033', 'Mommy Cares 2 1/2 Hours', '2.50', '4', 1300.00, 1),
	(38, '\r\nA000032', 'SERV-0034', 'Mind and Body Bliss 3 Hours', '3', '4', 1560.00, 1),
	(39, '\r\nA000033', 'SERV-0035', 'Athlete\'s Care 3 Hours', '3', '4', 1560.00, 1),
	(40, '\r\nA000034', 'SERV-0633', 'Traveler\'s Retreat 3 Hours', '3', '4', 1560.00, 1),
	(41, '\r\nA000035', 'SERV-0037', 'Aroma Wellness 3 Hours', '3', '4', 1560.00, 1),
	(42, '\r\nA000044', 'SERV-0550', 'Thai Massage 3 Hours', '3', '4', 1560.00, 1),
	(43, '\r\nA000036', 'SERV-0038', 'Chi Hot Stones 3 Hours', '3', '4', 1770.00, 1),
	(44, '\r\nA000037', 'SERV-0039', 'Ventosa 3 Hours', '3', '4', 2070.00, 1),
	(45, '\r\nA000038', 'SERV-0040', 'Heaven Sent (Kids) 3 Hours', '3', '4', 1650.00, 1),
	(46, '\r\nA000039', 'SERV-0041', 'Mommy Cares 3 Hours', '3', '4', 1440.00, 1),
	(47, '\r\nB000000', 'SERV-0042', 'Migraine Relief 1/2 Hour', '.50', '5', 350.00, 1),
	(48, '\r\nB000001', 'SERV-0043', 'Therapeutic Relief 1/2 Hour', '.50', '5', 350.00, 1),
	(49, '\r\nB000002', 'SERV-0044', 'Foot Bliss 1/2 Hour', '.50', '5', 350.00, 1),
	(50, '\r\nB000003', 'SERV-0045', 'Migraine Relief 1 Hour', '1', '5', 450.00, 1),
	(51, '\r\nB000004', 'SERV-0046', 'Therapeutic Relief 1 Hour', '1', '5', 450.00, 1),
	(52, '\r\nB000005', 'SERV-0047', 'Foot Bliss 1 Hour', '1', '5', 450.00, 1),
	(53, '\r\nB000006', 'SERV-0048', 'Migraine Relief 1 1/2 Hour', '1.50', '5', 800.00, 1),
	(54, '\r\nB000007', 'SERV-0049', 'Therapeutic Relief 1 1/2 Hour', '1.50', '5', 800.00, 1),
	(55, '\r\nB000008', 'SERV-0050', 'Foot Bliss 1 1/2 Hour', '1.50', '5', 800.00, 1),
	(56, '\r\nB000009', 'SERV-0051', 'Migraine Relief 2 Hours', '2', '5', 900.00, 1),
	(57, '\r\nB000010', 'SERV-0052', 'Therapeutic Relief 2 Hours', '2', '5', 900.00, 1),
	(58, '\r\nB000011', 'SERV-0053', 'Foot Bliss 2 Hours', '2', '5', 900.00, 1),
	(59, '\r\nB000012', 'SERV-0054', 'Migraine Relief 2 1/2 Hours', '2.50', '5', 1250.00, 1),
	(60, '\r\nB000013', 'SERV-0055', 'Therapeutic Relief 2 1/2 Hours', '2.50', '5', 1250.00, 1),
	(61, '\r\nB000014', 'SERV-0056', 'Foot Bliss 2 1/2 Hours', '2.50', '5', 1250.00, 1),
	(62, '\r\nB000015', 'SERV-0057', 'Migraine Relief 3 Hours', '3', '5', 1350.00, 1),
	(63, '\r\nB000016', 'SERV-0058', 'Therapeutic Relief 3 Hours', '3', '5', 1350.00, 1),
	(64, '\r\nB000017', 'SERV-0059', 'Foot Bliss 3 Hours', '3', '5', 1350.00, 1),
	(65, '\r\nC000000', 'SERV-0060', 'Basic Facial Care', '0.75', '3', 650.00, 1),
	(66, '\r\nC210000', 'SERV-0061', 'Basic Facial Care w/ Add. Vine Vera Collagen', '0.75', '3', 1150.00, 1),
	(67, '\r\nC100000', 'SERV-0062', 'Anti- Acne', '0.75', '3', 850.00, 1),
	(68, '\r\nC200000', 'SERV-0063', 'Diamond Peel', '0.75', '3', 899.00, 1),
	(69, '\r\nC300000', 'SERV-0064', 'Korean Glass Skin', '0.75', '3', 1299.00, 1),
	(70, '\r\nC400000', 'SERV-0065', 'Whitening', '0.75', '3', 850.00, 1),
	(71, '\r\nC500000', 'SERV-0066', 'Anti-Aging', '0.75', '3', 1299.00, 1),
	(72, '\r\nC600000', 'SERV-0067', 'Hydrating Facial', '1', '3', 1299.00, 1),
	(73, '\r\nC700000', 'SERV-0068', 'Rosy Skin', '0.75', '3', 799.00, 1),
	(74, '\r\nC800000', 'SERV-0069', 'Melasma', '0.75', '3', 999.00, 1),
	(75, '\r\nC900000', 'SERV-0070', 'Firming', '0.75', '3', 1299.00, 1),
	(76, '\r\nC1000000', 'SERV-0071', 'Hydra Facial', '1', '3', 1499.00, 1),
	(77, '\r\nC1100000', 'SERV-0072', 'Hydra Facial Cleansing', '1', '3', 799.00, 1),
	(78, '\r\nC1200000', 'SERV-0073', 'Warts Removal', '1', '3', 799.00, 1),
	(79, '\r\nC1300000', 'SERV-0074', 'VIP Facial - Anti Aging', '3', '3', 13996.00, 1),
	(80, '\r\nC1400000', 'SERV-0075', 'Diamond Peel - Under Arm', '1', '3', 550.00, 1),
	(81, '\r\nC1500000', 'SERV-0076', 'Package 1 (Basic Facial 4+1 FREE Session and Facia', '1', '3', 3000.00, 1),
	(82, '\r\nC1600000', 'SERV-0077', 'Package 2 (Acne Facial 4+1 FREE Session and Facial', '1', '3', 3850.00, 1),
	(83, '\r\nC1700000', 'SERV-0078', 'Package 3 (Whitening Facial 4+1 FREE Session and F', '1', '3', 3850.00, 1),
	(84, '\r\nC1800000', 'SERV-0079', 'Package 4 (Rosy Skin Facial 4+1 FREE Session and F', '1', '3', 3600.00, 1),
	(85, '\r\nC1900000', 'SERV-0080', 'Package 5 (Anti-Aging Facial 4+1 FREE Session and ', '1', '3', 5600.00, 1),
	(86, '\r\nC2000000', 'SERV-0081', 'Package 6 (Melasma Facial 4+1 FREE Session and Fac', '1', '3', 5400.00, 1),
	(87, '\r\nC2100000', 'SERV-0543', 'Package 7 (Hydra Facial 4+1 FREE Session and Facia', '1.5', '3', 5996.00, 1),
	(88, '\r\nC000001', 'SERV-0082', 'Foot Spa', '0.5', '1', 350.00, 1),
	(89, '\r\nC000002', 'SERV-0083', 'Foot Care - Foot Spa (1)', '0.5', '1', 320.83, 1),
	(90, '\r\nC000002', 'SERV-0084', 'Foot Care - Pedicure (Ordinary)', '0.75', '1', 229.17, 1),
	(91, '\r\nC000003', 'SERV-0085', 'Foot Care - Foot Spa (2)', '0.5', '1', 330.56, 1),
	(92, '\r\nC000003', 'SERV-0086', 'Foot Care - Pedicure  (Gel)', '1', '1', 519.44, 1),
	(93, '\r\nC000032', 'SERV-0087', 'Foot Care - Foot Spa w/ mask', '0.5', '1', 417.86, 1),
	(94, '\r\nC000032', 'SERV-0088', 'Foot Care - Pedicure (Ordinary) (2)', '0.75', '1', 232.14, 1),
	(95, '\r\nC000033', 'SERV-0489', 'Foot Care - Foot Spa w/ mask (2)', '0.5', '1', 427.50, 1),
	(96, '\r\nC000033', 'SERV-0490', 'Foot Care - Pedicure (Gel) ', '1', '1', 522.50, 1),
	(97, '\r\nC000014', 'SERV-0089', 'Foot Spa with Mask', '0.75', '1', 450.00, 1),
	(98, '\r\nC000004', 'SERV-0090', 'Hand Spa', '0.5', '1', 150.00, 1),
	(99, '\r\nC000005', 'SERV-0091', 'Hand Care - Hand Spa (1)', '0.5', '1', 128.57, 1),
	(100, '\r\nC000005', 'SERV-0092', 'Hand Care - Manicure (Ordinary)', '0.75', '1', 171.43, 1),
	(101, '\r\nC000006', 'SERV-0093', 'Hand Care - Hand Spa (2)', '0.5', '1', 138.46, 1),
	(102, '\r\nC000006', 'SERV-0094', 'Hand Care - Manicure (Gel)', '1', '1', 461.54, 1),
	(103, '\r\nC000007', 'SERV-0095', 'Manicure (Ordinary)', '0.75', '1', 200.00, 1),
	(104, '\r\nC000008', 'SERV-0096', 'Manicure (Gel)', '1', '1', 500.00, 1),
	(105, '\r\nC000009', 'SERV-0097', 'Pedicure (Ordinary)', '0.5', '1', 250.00, 1),
	(106, '\r\nC000010', 'SERV-0098', 'Pedicure (Gel)', '1', '1', 550.00, 1),
	(107, '\r\nC000011', 'SERV-0099', 'Manicure + Pedicure (Ordinary)', '1', '1', 450.00, 1),
	(108, '\r\nC000012', 'SERV-0100', 'Manicure + Pedicure (Gel)', '1', '1', 950.00, 1),
	(109, '\r\nR000000', 'SERV-0101', 'Gel Removal', '0.5', '1', 100.00, 1),
	(110, '\r\nC000013', 'SERV-0102', 'Body Scrub', '0.75', '1', 650.00, 1),
	(111, '\r\nC000018', 'SERV-0103', 'Body Peeling', '1', '1', 250.00, 1),
	(112, '\r\nC000020', 'SERV-0104', 'Body Waxing (Half leg Aloe)', '1', '1', 350.00, 1),
	(113, '\r\nC000021', 'SERV-0105', 'Body Waxing (Full Leg Aloe)', '1', '1', 600.00, 1),
	(114, '\r\nC000022', 'SERV-0106', 'Body Waxing (Armpit)', '0.45', '1', 250.00, 1),
	(115, '\r\nC000023', 'SERV-0107', 'Body Waxing (Upper Lip)', '0.5', '1', 150.00, 1),
	(116, '\r\nC000024', 'SERV-0108', 'Body Waxing (Full Face)', '1', '1', 350.00, 1),
	(117, '\r\nC000025', 'SERV-0109', 'Body Waxing (Full Body)', '1.5', '1', 2500.00, 1),
	(118, '\r\nC000026', 'SERV-0110', 'Body Sculpture (Face + Neck)', '1', '1', 1500.00, 1),
	(119, '\r\nC000027', 'SERV-0111', 'Body Sculpture (Arms + Leg)', '1', '1', 2500.00, 1),
	(120, '\r\nC000028', 'SERV-0112', 'Body Sculpture (Back + Tummy)', '1', '1', 3500.00, 1),
	(121, '\r\nC000029', 'SERV-0113', 'Ear Care', '0.75', '1', 350.00, 1),
	(122, '\r\nC000030', 'SERV-0114', 'Sauna (30 Mins)', '.50', '1', 250.00, 1),
	(123, '\r\nC000031', 'SERV-0115', 'Sauna (60 Mins)', '.50', '1', 400.00, 1),
	(124, '\r\nS000001', 'SERV-0116', 'Sauna Package - Sauna 60 Mins', '0.5', '2', 354.55, 1),
	(125, '\r\nS000001', 'SERV-0117', 'Sauna Package - Body Massage 60 mins', '1', '2', 425.45, 1),
	(126, '\r\nD000000', 'SERV-0118', 'Package 1 - Sauna 30 Mins', '.50', '2', 215.75, 1),
	(127, '\r\nD000000', 'SERV-0119', 'Package 1 - Body Massage 60 mins', '1', '2', 414.25, 1),
	(128, '\r\nD000001', 'SERV-0120', 'Package 2 (Body Massage 30 Mins)', '.50', '2', 210.34, 1),
	(129, '\r\nD000001', 'SERV-0121', 'Package 2 (Facial Care)', '0.75', '2', 569.66, 1),
	(130, '\r\nD000002', 'SERV-0122', 'Package 3 (Body Massage 60 Mins)', '1', '2', 373.81, 1),
	(131, '\r\nD000002', 'SERV-0123', 'Package 3 ( Facial Care)', '0.75', '2', 506.19, 1),
	(132, '\r\nD000003', 'SERV-0545', 'Package 4 (Body Massage 60 Mins)', '1', '2', 433.16, 1),
	(133, '\r\nD000003', 'SERV-0544', 'Package 4 (Ear Candling)', '0.5', '2', 315.84, 1),
	(134, '\r\nD000004', 'SERV-0124', 'Package 5 (Body Massage 60 Mins)', '1', '2', 373.81, 1),
	(135, '\r\nD000004', 'SERV-0125', 'Package 5 (Body Scrub)', '0.75', '2', 506.19, 1),
	(136, '\r\nD000005', 'SERV-0126', 'Package 6 (Foot Care)', '1', '2', 449.17, 1),
	(137, '\r\nD000005', 'SERV-0127', 'Package 6 (Facial Care)', '0.75', '2', 530.83, 1),
	(138, '\r\nD000006', 'SERV-0128', 'Package 7 (Body Massage 60 Mins)', '1', '2', 393.68, 1),
	(139, '\r\nD000006', 'SERV-0129', 'Package 7 (Rosy Skin)', '0.75', '2', 655.32, 1),
	(140, '\r\nD000007', 'SERV-0130', 'Package 8 (Body Scrub)', '0.5', '2', 540.00, 1),
	(141, '\r\nD000007', 'SERV-0131', 'Package 8 (Facial Care)', '0.5', '2', 540.00, 1),
	(142, '\r\nD000008', 'SERV-0132', 'Package 9 (Body Massage 60 Mins)', '1', '2', 396.99, 1),
	(143, '\r\nD000008', 'SERV-0133', 'Package 9 (Facial Whitening)', '0.75', '2', 703.01, 1),
	(144, '\r\nD000009', 'SERV-0134', 'Package 10 (Body Massage 60 Mins)', '1', '2', 399.94, 1),
	(145, '\r\nD000009', 'SERV-0135', 'Package 10 (Diamond Peel)', '0.75', '2', 749.06, 1),
	(146, '\r\nD000010', 'SERV-0136', 'Package 11 (Body Massage 60 Mins)', '1', '2', 415.04, 1),
	(147, '\r\nD000010', 'SERV-0137', 'Package 11 (Anti-Acne Treatment)', '0.75', '2', 734.96, 1),
	(148, '\r\nD000011', 'SERV-0138', 'Package 12 (Body Massage 60 Mins)', '1', '2', 417.94, 1),
	(149, '\r\nD000011', 'SERV-0139', 'Package 12 (Korean Glass)', '0.75', '2', 1131.06, 1),
	(150, '\r\nE000000', 'SERV-0140', 'GC 500', 'Consumable', '6', 500.00, 1),
	(151, '\r\nE000001', 'SERV-0141', 'GC 380', 'Consumable', '6', 380.00, 1),
	(152, '\r\nE000006', 'ITEM-1336', 'GC 1000', '1 Hr. Full Body Massage', '6', 1000.00, 1),
	(153, '\r\n', NULL, 'Disposable Panty', '', '', 25.00, 1),
	(154, '\r\n', NULL, 'Corkage ', 'Corckage (food/drinks)', '', 50.00, 1),
	(155, '\r\nE000002', 'SERV-0145', 'Cards - VIP 1 (7,000)', '5% Lifetime Discount to all services', '7', 7000.00, 1),
	(156, '\r\nE000003', 'SERV-0146', 'Cards - VIP 2 (8,000)', '10% Lifetime Discount to all services', '7', 8000.00, 1),
	(157, '\r\nE000004', 'SERV-0147', 'Cards - VIP 3 (9,000)', '15% Lifetime Discount to all services', '7', 9000.00, 1),
	(158, '\r\nE000005', 'SERV-0148', 'Cards - VIP 4 (10,000)', '20% Lifetime Discount to all services', '7', 10000.00, 1),
	(162, 'HS-000001', 'SERV-0170', 'Home Service Charge - 100', '1', '8', 100.00, 1),
	(163, 'HS-000002', 'SERV-0171', 'Home Service Charge - 150', '1', '8', 150.00, 1),
	(167, 'HS-000003', 'SERV-0172', 'Home Service Charge - 200', '1', '8', 200.00, 1),
	(168, 'HS-000004', 'SERV-0173', 'Home Service Charge - 250', '1', '8', 250.00, 1),
	(169, 'HS-000005', 'SERV-0174', 'Home Service Charge - 300', '1', '8', 300.00, 1),
	(170, 'ITEM-0082', 'ITEM-0082', 'Disposable Panty', '1', '9', 20.00, 1),
	(171, 'SP000001', 'SERV-0532', 'Corkage ', '1', '9', 50.00, 1),
	(172, 'SP000002', 'SERV-0540', 'EXCESS HOURS - 30 MINS', '0.5', '9', 500.00, 1);

-- Dumping structure for table db_spa.tbl_sessions
CREATE TABLE IF NOT EXISTS `tbl_sessions` (
  `ses_id` int(11) NOT NULL AUTO_INCREMENT,
  `branch_id` int(11) DEFAULT NULL,
  `acc_id` int(11) DEFAULT NULL,
  `ses_code` varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
  `ses_cookies` varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
  `ses_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ses_browser` varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
  PRIMARY KEY (`ses_id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- Dumping data for table db_spa.tbl_sessions: ~59 rows (approximately)
INSERT INTO `tbl_sessions` (`ses_id`, `branch_id`, `acc_id`, `ses_code`, `ses_cookies`, `ses_date`, `ses_browser`) VALUES
	(1, 1, 1, 'U2FsdGVkX1+ZmbDINxG1VeI7XXJxlb9nhmHudvmCD0E=', '', '2022-03-21 08:20:16', 'chrome'),
	(2, 1, 1, 'U2FsdGVkX19RhXZakS6upzhI443kKrGseY6e0jFICvI=', '', '2022-03-21 08:22:45', 'chrome'),
	(3, 1, 1, 'U2FsdGVkX1+MiU5qQQMopURG8CAtWhZAuNfsurm7HwU=', '', '2022-03-22 00:39:12', 'chrome'),
	(4, 1, 1, 'U2FsdGVkX1/czzX99C4gwpm19xFZIhd2J2HFFGBVusA=', '', '2022-03-22 00:51:59', 'chrome'),
	(5, 1, 1, 'U2FsdGVkX19wABCPNYbB3sFQtOP0cXZsnAhiFrCpToc=', '', '2022-03-23 04:24:52', 'chrome'),
	(6, 1, 1, 'U2FsdGVkX1/4C8/TAUq2OgTUwN0NTl8rFX/CFyCLJCE=', '', '2022-03-23 04:27:21', 'chrome'),
	(7, 1, 1, 'U2FsdGVkX1+soODUqIRm2TkrFCvjM9PB3WnHPoBwN3k=', '', '2022-03-23 04:28:00', 'chrome'),
	(8, 1, 1, 'U2FsdGVkX19gOGH6N7g6PmS8hNb5WOZKz2Dhco8zslE=', '', '2022-03-23 04:29:00', 'chrome'),
	(9, 1, 1, 'U2FsdGVkX1/yITK4W/Ghxoya0yqzFZaGu65fswPiABU=', '', '2022-03-23 04:31:21', 'chrome'),
	(10, 1, 1, 'U2FsdGVkX1/bxWi2V0VmLw/mp+00cdUNvg2h4orxvw4=', '', '2022-03-23 04:32:36', 'chrome'),
	(11, 1, 1, 'U2FsdGVkX1/7yuQI3+vGV1THPJgJpQItLAweHTqMLe0=', '', '2022-03-23 04:33:52', 'chrome'),
	(12, 1, 1, 'U2FsdGVkX1+rplbv8dNMT50ZUbMURq06hJpWHDMz6ls=', '', '2022-03-23 04:35:33', 'chrome'),
	(13, 1, 1, 'U2FsdGVkX18JPbYjWnCmZhrUPmYst0GdR2rtH8unJ/Q=', '', '2022-03-23 04:42:57', 'chrome'),
	(14, 1, 1, 'U2FsdGVkX1+xNmPwaTY6ap0OBJNHRPSGk33dnh3d2nY=', '', '2022-03-31 02:17:55', 'chrome'),
	(15, 1, 1, 'U2FsdGVkX1/WMU9eX4s2W7AZAxHG0JjvKwxVJxgELkU=', '', '2022-03-31 02:18:35', 'chrome'),
	(16, 1, 2, 'U2FsdGVkX18SRrPRv7D6ARxv6gqdMBOirdh5stEm9N0=', '', '2022-03-31 02:20:54', 'chrome'),
	(17, 1, 2, 'U2FsdGVkX1/DdLMWW7oKzbtWe+UJ3fJagdHjFqHUf+g=', '', '2022-03-31 02:23:01', 'chrome'),
	(18, 1, 1, 'U2FsdGVkX19n0mdYEiW3vJQE/YEpU9vXLug2qmvxqho=', '', '2022-04-01 03:14:36', 'chrome'),
	(19, 1, 2, 'U2FsdGVkX19yhlLnxgSklG6MInRUKvYaNwVQgpoEeVo=', '', '2022-04-04 05:47:04', 'chrome'),
	(20, 1, 1, 'U2FsdGVkX19BEpw+naURDLTcywJFZaUw85IJorTh3zU=', '', '2022-04-04 05:47:35', 'chrome'),
	(21, 1, 1, 'U2FsdGVkX1+ZWHNX/4+QuLb29bNsY8m9P2kttdb56ZE=', '', '2022-04-11 03:24:27', 'chrome'),
	(22, 1, 2, 'U2FsdGVkX192FUvyVYbzLNOzVV0ve5QjZDhTjrvy438=', '', '2022-04-20 06:42:18', 'chrome'),
	(23, 3, 19, 'U2FsdGVkX18oU0SbsFiiarEwE7WYXW+C4GoNVVXIvQI=', '', '2022-05-03 00:35:38', 'chrome'),
	(24, 3, 19, 'U2FsdGVkX1+XIeaOP27uQIXySsQmBBp+uTwZy4039rc=', '', '2022-05-03 00:40:26', 'chrome'),
	(25, 3, 19, 'U2FsdGVkX1+HKlW7aH26CJvcCoe9Zz4nLwu/+Pydq58=', '', '2022-05-03 00:42:54', 'chrome'),
	(26, 3, 19, 'U2FsdGVkX1/DPUAPLviKGPXrjTEZp5PxA34GJ0UMK6s=', '', '2022-05-03 00:43:53', 'chrome'),
	(27, 3, 19, 'U2FsdGVkX1/7VMH3filFwKE1a4QUk8Mcpem2kFA2o4A=', '', '2022-05-03 00:46:19', 'chrome'),
	(28, 1, 23, 'U2FsdGVkX1/eXjeNq4lxl2Uhj+JcH1k7f70cR2Dm9ZI=', '', '2022-05-03 00:48:59', 'chrome'),
	(29, 1, 23, 'U2FsdGVkX1+NseJf4fPlv7zIIlowWtAfHF60Nhwtxb4=', '', '2022-05-05 06:53:23', 'chrome'),
	(30, 1, 23, 'U2FsdGVkX1+68T0DnKWvxsAx/bNq7/a67R+W32VQDi4=', '', '2022-05-05 06:59:26', 'chrome'),
	(31, 1, 23, 'U2FsdGVkX18OMuMIZ5ONJNzisEV+Ekg8vovCX5CqByE=', '', '2022-05-11 01:22:00', 'chrome'),
	(32, 1, 23, 'U2FsdGVkX1+nFL7G/NYzGezd8qB2HFiRwRluyRKPw7I=', '', '2022-05-11 07:55:19', 'chrome'),
	(33, 1, 23, 'U2FsdGVkX18A0KUur1JIXnsJWhGeRw00rWgn1zFNMuE=', '', '2022-05-29 10:26:52', 'chrome'),
	(34, 1, 23, 'U2FsdGVkX1/DkfMY1jN3g8MIlOmoVk9oJpgxbqTLpjc=', '', '2022-06-02 01:50:18', 'chrome'),
	(35, 1, 23, 'U2FsdGVkX19ClwPmMMWDWWCT7EzV/b1uL6rP1X2NHvg=', '', '2022-06-10 07:51:28', 'chrome'),
	(36, 1, 23, 'U2FsdGVkX18bEesL3qD0pTrDYs/Jmz0xqkjfN+DdPN0=', '', '2022-06-23 06:40:12', 'chrome'),
	(37, 1, 23, 'U2FsdGVkX1/QJFC0A1G0cWxIjufkQETbTcpxrMQ4fV0=', '', '2022-06-23 07:03:14', 'chrome'),
	(38, 1, 23, 'U2FsdGVkX1+/5kChVrXAMp0Ya4zDIWhn3KcHEfSQD70=', '', '2022-06-24 01:44:33', 'safari'),
	(39, 1, 23, 'U2FsdGVkX19sip1bGn/wcg2C/5FylgU/2+rn6HlV7gY=', '', '2022-06-24 01:49:51', 'chrome'),
	(40, 1, 2, 'U2FsdGVkX1/aY4/We6IHJO2AOFlY7ak+tRPdFSMZACw=', '', '2022-10-11 05:33:40', 'chrome'),
	(41, 1, 2, 'U2FsdGVkX19qMNGXU7Vw71fAOGbClp1x5D+3Vo6/jWY=', '', '2022-10-11 05:34:05', 'chrome'),
	(42, 1, 2, 'U2FsdGVkX18MIIolJfT6UzkNlMrdubnEaIj4iix+ZO4=', '', '2022-10-12 05:56:21', 'chrome'),
	(43, 1, 2, 'U2FsdGVkX1/d0/8U0+WKPkhEinJ5CH0OUGEsj7+MU30=', '', '2022-10-13 05:40:10', 'chrome'),
	(44, 1, 2, 'U2FsdGVkX18XXqhwq4t73nj+AjsGwiJXKGReJuvAlVs=', '', '2022-10-13 07:45:55', 'chrome'),
	(45, 1, 2, 'U2FsdGVkX18IrxcQK+Ch9ndsXchVU20y4gj/BYdaWPQ=', '', '2022-10-14 01:53:17', 'chrome'),
	(46, 1, 2, 'U2FsdGVkX18reZfuciBRpWIXSYE1orsUiUoS+S7YFJA=', '', '2022-10-20 01:59:55', 'chrome'),
	(47, 1, 2, 'U2FsdGVkX1+G1ZZhHHjUi4sIGa3fsNXIOpg2CjFBjdY=', '', '2022-10-20 02:02:55', 'chrome'),
	(48, 1, 2, 'U2FsdGVkX19VY1pWPNy8i4F9cvqy0fgScx7yATXjMPM=', '', '2022-10-21 02:25:44', 'chrome'),
	(49, 1, 2, 'U2FsdGVkX19t5T86R1Qxa5DDxevD3fKcwmQt+17NjlU=', '', '2022-10-21 02:32:09', 'chrome'),
	(50, 1, 1, 'U2FsdGVkX19CvTwNnQbtpElgFt9JJoTvjeXFW1sETDE=', '', '2022-10-21 02:39:00', 'chrome'),
	(51, 1, 23, 'U2FsdGVkX18NsBPZYWoUpm5apE9J2nFPyXWVuO5LqTo=', '', '2022-10-21 02:40:13', 'chrome'),
	(52, 1, 1, 'U2FsdGVkX19mRZQshUzGEzhiaDy1djURc3G8qSw2gKM=', '', '2022-10-21 02:42:12', 'chrome'),
	(53, 1, 1, 'U2FsdGVkX18tCFPaQ5C5pOeBpq/9TFAPfwaoLojMDng=', '', '2022-10-21 02:43:08', 'chrome'),
	(54, 1, 23, 'U2FsdGVkX1/ao7R1assVEAjeSU9f/khc4Qb5TQ/vnQQ=', '', '2022-10-25 02:05:14', 'chrome'),
	(55, 1, 2, 'U2FsdGVkX1+jrw96ClVxXVLyIR5GcroK8Wz/Ookgmck=', '', '2022-10-25 02:05:42', 'chrome'),
	(56, 1, 23, 'U2FsdGVkX18U9rSceZkKzJdMqy1Kzod5E4j5da0gjQQ=', '', '2022-10-25 02:06:10', 'chrome'),
	(57, 1, 2, 'U2FsdGVkX1+edHMyEzSCcnChygu/42Cu2Nhsg5CtRRE=', '', '2022-10-25 02:06:26', 'chrome'),
	(58, 1, 23, 'U2FsdGVkX19KQSvQQniddlKC5QW/xoahFCKfIHTBTwY=', '', '2022-11-02 01:59:39', 'chrome'),
	(59, 1, 23, 'U2FsdGVkX1+WVE/Pj+OYzz7ZMBeqMGsCmI1dizWVL9w=', '', '2022-11-02 02:14:35', 'chrome');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
