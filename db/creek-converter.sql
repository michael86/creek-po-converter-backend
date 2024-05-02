-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 02, 2024 at 01:38 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `creek-converter`
--

-- --------------------------------------------------------

--
-- Table structure for table `amount_received`
--

CREATE TABLE `amount_received` (
  `id` int(11) NOT NULL,
  `amount_received` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `date_due`
--

CREATE TABLE `date_due` (
  `id` int(11) NOT NULL,
  `date_due` date NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `date_due`
--

INSERT INTO `date_due` (`id`, `date_due`, `date_created`) VALUES
(1, '2024-07-09', '2024-05-02 09:54:39'),
(2, '2024-08-07', '2024-05-02 09:54:39'),
(3, '2024-05-02', '2024-05-02 11:48:35'),
(4, '2024-05-02', '2024-05-02 11:48:35'),
(5, '2024-05-02', '2024-05-02 11:48:35'),
(6, '2024-05-02', '2024-05-02 11:48:35'),
(7, '2024-05-02', '2024-05-02 11:50:09'),
(8, '2024-05-02', '2024-05-02 11:50:09'),
(9, '2024-05-02', '2024-05-02 11:50:09');

-- --------------------------------------------------------

--
-- Table structure for table `descriptions`
--

CREATE TABLE `descriptions` (
  `id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `descriptions`
--

INSERT INTO `descriptions` (`id`, `description`, `date_created`) VALUES
(1, 'CHECK VALVE SEAL [21-0002 ]', '2024-05-02 09:54:39'),
(2, 'CHECK VALVE SEAL [21-0002 ]', '2024-05-02 09:54:39'),
(3, '3.9PF 0402 COG/NPO 50V 0.1PF', '2024-05-02 11:48:35'),
(4, 'ECS-260-12-37B2-CKM-TR', '2024-05-02 11:48:35'),
(5, '150080RS75000 RED 0805', '2024-05-02 11:48:35'),
(6, '2.2k 1206 EXB-38V222JV', '2024-05-02 11:48:35'),
(7, '~CABLE MARKER SIZE 13 NO. 1', '2024-05-02 11:50:09'),
(8, '~CABLE MARKER SIZE 13 NO. 3', '2024-05-02 11:50:09'),
(9, 'Carriage & Packing Charge', '2024-05-02 11:50:09');

-- --------------------------------------------------------

--
-- Table structure for table `lines`
--

CREATE TABLE `lines` (
  `id` int(11) NOT NULL,
  `part_id` int(11) NOT NULL,
  `description_id` int(11) NOT NULL,
  `total_ordered_id` int(11) NOT NULL,
  `due_date_id` int(11) NOT NULL,
  `partial_id` int(11) NOT NULL,
  `location_id` int(11) DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lines`
--

INSERT INTO `lines` (`id`, `part_id`, `description_id`, `total_ordered_id`, `due_date_id`, `partial_id`, `location_id`, `date_created`) VALUES
(1, 1, 1, 1, 1, 1, 1, '2024-05-02 09:54:39'),
(2, 1, 2, 2, 2, 2, 10, '2024-05-02 09:54:39'),
(3, 3, 3, 3, 3, 3, 3, '2024-05-02 11:48:35'),
(4, 4, 4, 4, 4, 4, 5, '2024-05-02 11:48:35'),
(5, 5, 5, 5, 5, 5, 13, '2024-05-02 11:48:35'),
(6, 6, 6, 6, 6, 6, 15, '2024-05-02 11:48:35'),
(7, 7, 7, 7, 7, 7, NULL, '2024-05-02 11:50:09'),
(8, 8, 8, 8, 8, 8, NULL, '2024-05-02 11:50:09'),
(9, 9, 9, 9, 9, 9, NULL, '2024-05-02 11:50:09');

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` int(11) NOT NULL,
  `location` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `location`) VALUES
(1, 'A-1'),
(2, 'A-2'),
(3, 'A-3'),
(4, 'A-4'),
(5, 'B-1'),
(6, 'B-2'),
(7, 'B-3'),
(8, 'B-4'),
(9, 'B-5'),
(10, 'B-6'),
(11, 'B-7'),
(12, 'B-8'),
(13, 'B-9'),
(14, 'B-10'),
(15, 'B-11'),
(16, 'B-12'),
(17, 'B-13'),
(18, 'B-14'),
(19, 'B-15'),
(20, 'C-1'),
(21, 'C-2'),
(22, 'C-3'),
(23, 'C-4'),
(24, 'C-5'),
(25, 'C-6'),
(26, 'C-7'),
(27, 'C-8'),
(28, 'C-9'),
(29, 'C-10'),
(30, 'C-11'),
(31, 'C-12'),
(32, 'C-13'),
(33, 'C-14'),
(34, 'C-15'),
(35, 'D-1'),
(36, 'D-2'),
(37, 'D-3'),
(38, 'D-4'),
(39, 'D-5'),
(40, 'D-6'),
(41, 'D-7'),
(42, 'D-8'),
(43, 'D-9'),
(44, 'D-10'),
(45, 'D-11'),
(46, 'D-12'),
(47, 'D-13'),
(48, 'D-14'),
(49, 'D-15'),
(50, 'E-1'),
(51, 'E-2'),
(52, 'E-3'),
(53, 'E-4'),
(54, 'E-5'),
(55, 'E-6'),
(56, 'E-7'),
(57, 'E-8'),
(58, 'E-9'),
(59, 'E-10'),
(60, 'E-11'),
(61, 'E-12'),
(62, 'E-13'),
(63, 'E-14'),
(64, 'E-15'),
(65, 'F-1'),
(66, 'F-2'),
(67, 'F-3'),
(68, 'F-4'),
(69, 'F-5'),
(70, 'F-6'),
(71, 'F-7'),
(72, 'F-8'),
(73, 'F-9'),
(74, 'F-10'),
(75, 'F-11'),
(76, 'F-12'),
(77, 'F-13'),
(78, 'F-14'),
(79, 'F-15'),
(80, 'F-16'),
(81, 'F-17'),
(82, 'F-18'),
(83, 'F-19'),
(84, 'F-20'),
(85, 'G-1'),
(86, 'G-2'),
(87, 'G-3'),
(88, 'G-4'),
(89, 'G-5'),
(90, 'G-6'),
(91, 'G-7'),
(92, 'G-8'),
(93, 'G-9'),
(94, 'G-10'),
(95, 'G-11'),
(96, 'G-12'),
(97, 'G-13'),
(98, 'G-14'),
(99, 'G-15'),
(100, 'G-16'),
(101, 'G-17'),
(102, 'G-18'),
(103, 'G-19'),
(104, 'G-20'),
(105, 'H-1'),
(106, 'H-2'),
(107, 'H-3'),
(108, 'H-4'),
(109, 'H-5'),
(110, 'H-6'),
(111, 'H-7'),
(112, 'H-8'),
(113, 'H-9'),
(114, 'H-10'),
(115, 'H-11'),
(116, 'H-12'),
(117, 'H-13'),
(118, 'H-14'),
(119, 'H-15'),
(120, 'H-16'),
(121, 'H-17'),
(122, 'H-18'),
(123, 'H-19'),
(124, 'H-20'),
(125, 'I-1'),
(126, 'I-2'),
(127, 'I-3'),
(128, 'I-4'),
(129, 'I-5'),
(130, 'I-6'),
(131, 'I-7'),
(132, 'I-8'),
(133, 'I-9'),
(134, 'I-10'),
(135, 'I-11'),
(136, 'I-12'),
(137, 'I-13'),
(138, 'I-14'),
(139, 'I-15'),
(140, 'I-16'),
(141, 'I-17'),
(142, 'I-18'),
(143, 'I-19'),
(144, 'I-20'),
(145, 'J-1'),
(146, 'J-2'),
(147, 'J-3'),
(148, 'J-4'),
(149, 'J-5'),
(150, 'J-6'),
(151, 'J-7'),
(152, 'J-8'),
(153, 'J-9'),
(154, 'J-10'),
(155, 'J-11'),
(156, 'J-12'),
(157, 'J-13'),
(158, 'J-14'),
(159, 'J-15');

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

CREATE TABLE `logs` (
  `id` int(11) NOT NULL,
  `log` varchar(255) NOT NULL,
  `user` varchar(255) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `logs`
--

INSERT INTO `logs` (`id`, `log`, `user`, `date_created`) VALUES
(1, 'User validated there token', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 09:54:27'),
(2, 'User validated there token', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 09:54:32'),
(3, 'user uploaded file PO&#45;025610&#46;pdf', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 09:54:38'),
(4, 'User viewed all purchase order names ', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 10:27:22'),
(5, 'user viewed purchase order 025610', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 10:30:42'),
(6, 'User validated there token', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 10:46:22'),
(7, 'User viewed all purchase order names ', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 10:46:25'),
(8, 'user viewed purchase order 025610', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 10:46:27'),
(9, 'User viewed all purchase order names ', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 10:47:53'),
(10, 'user viewed purchase order 025610', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 10:47:55'),
(11, 'User viewed all purchase order names ', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 10:48:29'),
(12, 'user viewed purchase order 025610', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 10:48:31'),
(13, 'User viewed all purchase order names ', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 10:49:02'),
(14, 'user viewed purchase order 025610', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 10:49:03'),
(15, 'User viewed all purchase order names ', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 10:49:46'),
(16, 'user viewed purchase order 025610', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 10:49:47'),
(17, 'User viewed all purchase order names ', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 11:38:52'),
(18, 'user viewed purchase order 025610', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 11:38:53'),
(19, 'User viewed all purchase order names ', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 11:39:34'),
(20, 'user viewed purchase order 025610', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 11:39:36'),
(21, 'User viewed all purchase order names ', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 11:40:08'),
(22, 'user viewed purchase order 025610', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 11:40:10'),
(23, 'User viewed all purchase order names ', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 11:45:13'),
(24, 'user viewed purchase order 025610', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 11:45:14'),
(25, 'user uploaded file PO&#45;025621&#46;pdf', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 11:48:35'),
(26, 'User viewed all purchase order names ', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 11:48:37'),
(27, 'user viewed purchase order 025621', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 11:48:39'),
(28, 'user updated location for ECAPT0997 on order 025621 to A&#45;4', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 11:49:47'),
(29, 'User validated there token', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 11:49:54'),
(30, 'User validated there token', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 11:49:59'),
(31, 'user uploaded file PO&#45;025624&#46;pdf', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 11:50:08'),
(32, 'User viewed all purchase order names ', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 11:50:11'),
(33, 'user viewed purchase order 025624', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 11:50:13'),
(34, 'user viewed purchase order 025610', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 11:57:45'),
(35, 'User validated there token', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 11:59:34'),
(36, 'User viewed all purchase order names ', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:00:59'),
(37, 'user viewed purchase order 025621', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:01:00'),
(38, 'User validated there token', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:13:09'),
(39, 'User viewed all purchase order names ', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:13:13'),
(40, 'user viewed purchase order 025610', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:13:14'),
(41, 'User validated there token', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:13:43'),
(42, 'User validated there token', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:13:51'),
(43, 'User viewed all purchase order names ', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:13:54'),
(44, 'user viewed purchase order 025610', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:13:55'),
(45, 'User validated there token', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:15:10'),
(46, 'User validated there token', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:15:15'),
(47, 'User viewed all purchase order names ', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:15:18'),
(48, 'user viewed purchase order 025610', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:15:19'),
(49, 'user updated location for line 1 to A&#45;1', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:15:21'),
(50, 'user viewed purchase order 025621', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:15:26'),
(51, 'user viewed purchase order 025610', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:15:28'),
(52, 'user updated location for line 2 to B&#45;6', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:15:35'),
(53, 'user viewed purchase order 025621', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:15:37'),
(54, 'user updated location for line 3 to A&#45;3', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:15:40'),
(55, 'user updated location for line 4 to B&#45;1', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:15:42'),
(56, 'user updated location for line 5 to B&#45;9', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:15:45'),
(57, 'user updated location for line 6 to B&#45;11', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:15:47'),
(58, 'user viewed purchase order 025610', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:15:54'),
(59, 'user viewed purchase order 025624', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:15:56'),
(60, 'user viewed purchase order 025621', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:22:12'),
(61, 'user viewed purchase order 025610', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:22:15'),
(62, 'User validated there token', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:34:46'),
(63, 'User viewed all purchase order names ', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:34:48'),
(64, 'user viewed purchase order 025610', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:34:50'),
(65, 'user set line 0 to partial delivery ', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:34:52'),
(66, 'User validated there token', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:35:24'),
(67, 'User validated there token', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:35:28'),
(68, 'User viewed all purchase order names ', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:35:30'),
(69, 'user viewed purchase order 025610', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:35:31'),
(70, 'user set line 0 to partial delivery ', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:35:35'),
(71, 'User validated there token', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:35:50'),
(72, 'User validated there token', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:35:55'),
(73, 'User viewed all purchase order names ', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:35:57'),
(74, 'user viewed purchase order 025610', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:35:58'),
(75, 'user set line 0 to partial delivery ', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:36:02'),
(76, 'User validated there token', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:36:27'),
(77, 'User validated there token', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:36:35'),
(78, 'User viewed all purchase order names ', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:36:39'),
(79, 'user viewed purchase order 025610', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:36:40'),
(80, 'user set line 0 to partial delivery ', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:36:44'),
(81, 'User validated there token', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:37:52'),
(82, 'User validated there token', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:37:57'),
(83, 'User viewed all purchase order names ', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:37:59'),
(84, 'user viewed purchase order 025610', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:38:00'),
(85, 'user set line 1 to partial delivery ', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:38:04'),
(86, 'user viewed purchase order 025621', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:38:07'),
(87, 'user viewed purchase order 025610', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:38:08'),
(88, 'user set line 2 to partial delivery ', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:38:13'),
(89, 'user viewed purchase order 025624', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:38:16'),
(90, 'user set line 8 to partial delivery ', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 12:38:19');

-- --------------------------------------------------------

--
-- Table structure for table `order_lines`
--

CREATE TABLE `order_lines` (
  `id` int(11) NOT NULL,
  `order` int(11) NOT NULL,
  `line` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_lines`
--

INSERT INTO `order_lines` (`id`, `order`, `line`, `date_created`) VALUES
(1, 1, 1, '2024-05-02 09:54:39'),
(2, 1, 2, '2024-05-02 09:54:39'),
(3, 2, 3, '2024-05-02 11:48:35'),
(4, 2, 4, '2024-05-02 11:48:35'),
(5, 2, 5, '2024-05-02 11:48:35'),
(6, 2, 6, '2024-05-02 11:48:35'),
(7, 3, 7, '2024-05-02 11:50:09'),
(8, 3, 8, '2024-05-02 11:50:09'),
(9, 3, 9, '2024-05-02 11:50:09');

-- --------------------------------------------------------

--
-- Table structure for table `order_reference`
--

CREATE TABLE `order_reference` (
  `id` int(11) NOT NULL,
  `order_reference` varchar(256) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_reference`
--

INSERT INTO `order_reference` (`id`, `order_reference`, `date`) VALUES
(1, '67187/90', '2024-05-02 09:54:39'),
(2, '067199/200', '2024-05-02 11:48:35'),
(3, '67158', '2024-05-02 11:50:09');

-- --------------------------------------------------------

--
-- Table structure for table `partial`
--

CREATE TABLE `partial` (
  `id` int(11) NOT NULL,
  `partial_status` tinyint(1) NOT NULL DEFAULT 0,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `partial`
--

INSERT INTO `partial` (`id`, `partial_status`, `date_created`) VALUES
(1, 1, '2024-05-02 09:54:39'),
(2, 1, '2024-05-02 09:54:39'),
(3, 0, '2024-05-02 11:48:35'),
(4, 0, '2024-05-02 11:48:35'),
(5, 0, '2024-05-02 11:48:35'),
(6, 0, '2024-05-02 11:48:35'),
(7, 0, '2024-05-02 11:50:09'),
(8, 1, '2024-05-02 11:50:09'),
(9, 0, '2024-05-02 11:50:09');

-- --------------------------------------------------------

--
-- Table structure for table `part_number`
--

CREATE TABLE `part_number` (
  `id` int(11) NOT NULL,
  `part` varchar(32) NOT NULL,
  `description` varchar(255) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `part_number`
--

INSERT INTO `part_number` (`id`, `part`, `description`, `date_created`) VALUES
(1, 'EPART0836', 'CHECK VALVE SEAL [21-0002 ]', '2024-05-02 09:54:39'),
(3, 'ECAPT0997', '3.9PF 0402 COG/NPO 50V 0.1PF', '2024-05-02 11:48:35'),
(4, 'ECRYS0109', 'ECS-260-12-37B2-CKM-TR', '2024-05-02 11:48:35'),
(5, 'ELEDS0237', '150080RS75000 RED 0805', '2024-05-02 11:48:35'),
(6, 'EREST1347', '2.2k 1206 EXB-38V222JV', '2024-05-02 11:48:35'),
(7, 'EMARK0004', '~CABLE MARKER SIZE 13 NO. 1', '2024-05-02 11:50:09'),
(8, 'EMARK0006', '~CABLE MARKER SIZE 13 NO. 3', '2024-05-02 11:50:09'),
(9, 'CARRIAGE', 'Carriage & Packing Charge', '2024-05-02 11:50:09');

-- --------------------------------------------------------

--
-- Table structure for table `po_or`
--

CREATE TABLE `po_or` (
  `id` int(11) NOT NULL,
  `purchase_order` int(32) NOT NULL,
  `order_reference` int(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `po_or`
--

INSERT INTO `po_or` (`id`, `purchase_order`, `order_reference`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3);

-- --------------------------------------------------------

--
-- Table structure for table `prefixes`
--

CREATE TABLE `prefixes` (
  `id` int(11) NOT NULL,
  `prefix` varchar(255) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `prefixes`
--

INSERT INTO `prefixes` (`id`, `prefix`, `date_created`) VALUES
(1, 'econn', '2024-04-17 13:58:24'),
(2, 'ecapt', '2024-04-17 13:58:24'),
(3, 'erest', '2024-04-17 13:58:24'),
(4, 'einci', '2024-04-17 13:58:24'),
(5, 'etras', '2024-04-17 13:58:24'),
(6, 'etran', '2024-04-17 13:58:24'),
(7, 'eleds', '2024-04-17 13:58:24'),
(8, 'ecry', '2024-04-17 13:58:24'),
(9, 'esensor', '2024-04-17 13:58:24'),
(10, 'emodu', '2024-04-17 13:58:24'),
(11, 'epart', '2024-04-17 13:58:24'),
(12, 'efix', '2024-04-17 13:58:24'),
(13, 'etool', '2024-04-17 13:58:24'),
(14, 'epcbs', '2024-04-17 13:58:24'),
(15, 'ewire', '2024-04-17 13:58:24'),
(16, 'ecilp', '2024-04-17 13:58:24'),
(17, 'efuse', '2024-04-17 13:58:24'),
(18, 'elink', '2024-04-17 13:58:24'),
(19, 'erely', '2024-04-17 13:58:24'),
(20, 'eswtc', '2024-04-17 13:58:24'),
(21, 'ediod', '2024-04-17 13:58:24'),
(22, 'se000', '2024-04-17 13:58:24'),
(23, 'eindu', '2024-04-17 13:58:24'),
(24, 'econv', '2024-04-17 13:58:24'),
(25, 'ereg', '2024-04-17 13:58:24'),
(26, 'ether', '2024-04-17 13:58:24'),
(27, 'emtwk', '2024-04-17 13:58:24'),
(28, 'epotn', '2024-04-17 13:58:24'),
(29, 'esold', '2024-04-17 13:58:24'),
(30, 'etrim', '2024-04-17 13:58:24'),
(31, 'ebat', '2024-04-17 13:58:24'),
(32, 'epcb', '2024-04-17 13:58:24'),
(33, 'ecirb', '2024-04-17 13:58:24'),
(34, 'sstatt', '2024-04-17 13:58:24'),
(35, 'emark', '2024-04-17 13:58:24'),
(36, 'carriage', '2024-04-17 13:58:24'),
(37, 'econs', '2024-04-18 10:03:19'),
(38, 'elabl', '2024-04-25 08:42:04'),
(39, 'test', '2024-04-25 10:03:15'),
(40, 'ESCON', '2024-04-25 10:16:24'),
(41, 'ESLEE', '2024-04-25 10:16:39'),
(42, 'ETERM', '2024-04-25 10:16:58'),
(43, 'CARRAIGE', '2024-04-26 09:05:29');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_order`
--

CREATE TABLE `purchase_order` (
  `id` int(11) NOT NULL,
  `purchase_order` varchar(32) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchase_order`
--

INSERT INTO `purchase_order` (`id`, `purchase_order`, `date_created`) VALUES
(1, '025610', '2024-05-02 09:54:39'),
(2, '025621', '2024-05-02 11:48:35'),
(3, '025624', '2024-05-02 11:50:09');

-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tokens`
--

INSERT INTO `tokens` (`id`, `token`, `date_created`) VALUES
(1, 'uvmV9lHtI2nhhPHFjyzBKiQSYO3HQrEr1714649899334', '2024-04-23 15:50:58'),
(2, '7jzNkjYv5BlVPLK6BeGsQKtlOQsJ65p71714384866312', '2024-04-16 11:02:41'),
(3, 'MvckUGidFRkUm9RqL5FoIKp96wfpjPfJ1713265791629', '2024-04-16 11:07:28'),
(4, 'kTcapaesywj4axDYtHOOdpoGhemnD9xh1714555576374', '2024-04-16 11:16:09'),
(5, 'RRP0cwPw8v25uyrSwcCAvViXNRqNozP31714554859677', '2024-04-16 11:34:38'),
(6, 'Nu3DM0NoGjRmh274xa9azOvaT0e48NXn1714049682527', '2024-04-16 12:01:14'),
(7, 'Y52Tt4I81wdtTgFZOog4KYmauVC9fOkf1714558229769', '2024-04-24 14:40:25'),
(8, 'wDifBpTh7SeXdKGgzfTSLUtw92x8nbjx1713970824199', '2024-04-24 15:00:23'),
(9, 'tBNdA3mMXIuyyoBqa1kqH3d38B0GYT441714029426340', '2024-04-25 07:17:05'),
(10, '5gR9GtAi2hHNtYiDRhITuJ5LvnwIRij01714044118198', '2024-04-25 11:21:55');

-- --------------------------------------------------------

--
-- Table structure for table `total_ordered`
--

CREATE TABLE `total_ordered` (
  `id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `total_ordered`
--

INSERT INTO `total_ordered` (`id`, `quantity`, `date_created`) VALUES
(1, 1000, '2024-05-02 09:54:39'),
(2, 1000, '2024-05-02 09:54:39'),
(3, 2500, '2024-05-02 11:48:35'),
(4, 1000, '2024-05-02 11:48:35'),
(5, 1000, '2024-05-02 11:48:35'),
(6, 1000, '2024-05-02 11:48:35'),
(7, 1000, '2024-05-02 11:50:09'),
(8, 1000, '2024-05-02 11:50:09'),
(9, 1, '2024-05-02 11:50:09');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` int(11) DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `role`, `date_created`) VALUES
(1, 'michaelh@creekviewelectronics.co.uk', 'e434f534525192c75677c3815ff15b32877dded69826b5128fd1deec918a9e9a', 5, '2024-04-23 15:22:34'),
(2, 'georges@creekviewelectronics.co.uk', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 3, '2024-04-16 11:02:41'),
(3, 'rsmith@creekviewelectronics.co.uk', 'e4b5b1f45677c45cc04438cf1b16f3420edaf44567d13163083e1e1789ecaa5e', 5, '2024-04-16 11:07:28'),
(4, 'joes@creekviewelectronics.co.uk', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 3, '2024-04-16 11:16:09'),
(5, 'purchasing@creekviewelectronics.co.uk', 'a91a1dcc4b6e39cdd2ecb70a761a227dde1327b132d542c6587e200c138cc845', 3, '2024-04-16 11:34:38'),
(6, 'richardc@creekviewelectronics.co.uk', 'e1c8844e7c6b98db5479e173161c73d7ce6c9e9b6bfd444e6de708bcf2b2387f', 2, '2024-04-16 12:01:14'),
(7, 'goods-in@creekviewelectronics.co.uk', '1ff852c94f2a8f29e35f983cf9ec9103e38bf8e9bc5001f67b61c531b805dd05', 2, '2024-04-24 14:40:25'),
(8, 'test@creekviewelectronics.co.uk', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', NULL, '2024-04-24 15:00:23'),
(9, 'test123@creekviewelectronics.co.uk', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', NULL, '2024-04-25 07:17:05'),
(10, 'textnew@creekviewelectronics.co.uk', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', NULL, '2024-04-25 11:21:55');

-- --------------------------------------------------------

--
-- Table structure for table `user_log`
--

CREATE TABLE `user_log` (
  `id` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `action` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_log`
--

INSERT INTO `user_log` (`id`, `user`, `action`, `date_created`) VALUES
(1, 1, 1, '2024-05-02 09:54:27'),
(2, 1, 2, '2024-05-02 09:54:32'),
(3, 1, 3, '2024-05-02 09:54:38'),
(4, 1, 4, '2024-05-02 10:27:22'),
(5, 1, 5, '2024-05-02 10:30:42'),
(6, 1, 6, '2024-05-02 10:46:22'),
(7, 1, 7, '2024-05-02 10:46:25'),
(8, 1, 8, '2024-05-02 10:46:27'),
(9, 1, 9, '2024-05-02 10:47:53'),
(10, 1, 10, '2024-05-02 10:47:55'),
(11, 1, 11, '2024-05-02 10:48:29'),
(12, 1, 12, '2024-05-02 10:48:31'),
(13, 1, 13, '2024-05-02 10:49:02'),
(14, 1, 14, '2024-05-02 10:49:03'),
(15, 1, 15, '2024-05-02 10:49:46'),
(16, 1, 16, '2024-05-02 10:49:47'),
(17, 1, 17, '2024-05-02 11:38:52'),
(18, 1, 18, '2024-05-02 11:38:53'),
(19, 1, 19, '2024-05-02 11:39:34'),
(20, 1, 20, '2024-05-02 11:39:36'),
(21, 1, 21, '2024-05-02 11:40:08'),
(22, 1, 22, '2024-05-02 11:40:10'),
(23, 1, 23, '2024-05-02 11:45:13'),
(24, 1, 24, '2024-05-02 11:45:14'),
(25, 1, 25, '2024-05-02 11:48:35'),
(26, 1, 26, '2024-05-02 11:48:37'),
(27, 1, 27, '2024-05-02 11:48:39'),
(28, 1, 28, '2024-05-02 11:49:47'),
(29, 1, 29, '2024-05-02 11:49:54'),
(30, 1, 30, '2024-05-02 11:49:59'),
(31, 1, 31, '2024-05-02 11:50:08'),
(32, 1, 32, '2024-05-02 11:50:11'),
(33, 1, 33, '2024-05-02 11:50:13'),
(34, 1, 34, '2024-05-02 11:57:45'),
(35, 1, 35, '2024-05-02 11:59:34'),
(36, 1, 36, '2024-05-02 12:00:59'),
(37, 1, 37, '2024-05-02 12:01:00'),
(38, 1, 38, '2024-05-02 12:13:09'),
(39, 1, 39, '2024-05-02 12:13:13'),
(40, 1, 40, '2024-05-02 12:13:14'),
(41, 1, 41, '2024-05-02 12:13:43'),
(42, 1, 42, '2024-05-02 12:13:51'),
(43, 1, 43, '2024-05-02 12:13:54'),
(44, 1, 44, '2024-05-02 12:13:55'),
(45, 1, 45, '2024-05-02 12:15:10'),
(46, 1, 46, '2024-05-02 12:15:15'),
(47, 1, 47, '2024-05-02 12:15:18'),
(48, 1, 48, '2024-05-02 12:15:19'),
(49, 1, 49, '2024-05-02 12:15:21'),
(50, 1, 50, '2024-05-02 12:15:26'),
(51, 1, 51, '2024-05-02 12:15:28'),
(52, 1, 52, '2024-05-02 12:15:35'),
(53, 1, 53, '2024-05-02 12:15:37'),
(54, 1, 54, '2024-05-02 12:15:40'),
(55, 1, 55, '2024-05-02 12:15:42'),
(56, 1, 56, '2024-05-02 12:15:45'),
(57, 1, 57, '2024-05-02 12:15:47'),
(58, 1, 58, '2024-05-02 12:15:54'),
(59, 1, 59, '2024-05-02 12:15:56'),
(60, 1, 60, '2024-05-02 12:22:12'),
(61, 1, 61, '2024-05-02 12:22:15'),
(62, 1, 62, '2024-05-02 12:34:46'),
(63, 1, 63, '2024-05-02 12:34:48'),
(64, 1, 64, '2024-05-02 12:34:50'),
(65, 1, 65, '2024-05-02 12:34:52'),
(66, 1, 66, '2024-05-02 12:35:24'),
(67, 1, 67, '2024-05-02 12:35:28'),
(68, 1, 68, '2024-05-02 12:35:30'),
(69, 1, 69, '2024-05-02 12:35:32'),
(70, 1, 70, '2024-05-02 12:35:35'),
(71, 1, 71, '2024-05-02 12:35:50'),
(72, 1, 72, '2024-05-02 12:35:55'),
(73, 1, 73, '2024-05-02 12:35:57'),
(74, 1, 74, '2024-05-02 12:35:58'),
(75, 1, 75, '2024-05-02 12:36:02'),
(76, 1, 76, '2024-05-02 12:36:27'),
(77, 1, 77, '2024-05-02 12:36:35'),
(78, 1, 78, '2024-05-02 12:36:39'),
(79, 1, 79, '2024-05-02 12:36:40'),
(80, 1, 80, '2024-05-02 12:36:44'),
(81, 1, 81, '2024-05-02 12:37:52'),
(82, 1, 82, '2024-05-02 12:37:57'),
(83, 1, 83, '2024-05-02 12:37:59'),
(84, 1, 84, '2024-05-02 12:38:00'),
(85, 1, 85, '2024-05-02 12:38:04'),
(86, 1, 86, '2024-05-02 12:38:07'),
(87, 1, 87, '2024-05-02 12:38:08'),
(88, 1, 88, '2024-05-02 12:38:13'),
(89, 1, 89, '2024-05-02 12:38:16'),
(90, 1, 90, '2024-05-02 12:38:19');

-- --------------------------------------------------------

--
-- Table structure for table `user_token`
--

CREATE TABLE `user_token` (
  `id` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `token` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_token`
--

INSERT INTO `user_token` (`id`, `user`, `token`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3),
(4, 4, 4),
(5, 5, 5),
(6, 6, 6),
(7, 7, 7),
(8, 8, 8),
(9, 9, 9),
(10, 10, 10);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `amount_received`
--
ALTER TABLE `amount_received`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `date_due`
--
ALTER TABLE `date_due`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `descriptions`
--
ALTER TABLE `descriptions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lines`
--
ALTER TABLE `lines`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_lines`
--
ALTER TABLE `order_lines`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_reference`
--
ALTER TABLE `order_reference`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `partial`
--
ALTER TABLE `partial`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `part_number`
--
ALTER TABLE `part_number`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `part` (`part`);

--
-- Indexes for table `po_or`
--
ALTER TABLE `po_or`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `prefixes`
--
ALTER TABLE `prefixes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `prefix` (`prefix`);

--
-- Indexes for table `purchase_order`
--
ALTER TABLE `purchase_order`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `purchase_order` (`purchase_order`);

--
-- Indexes for table `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `total_ordered`
--
ALTER TABLE `total_ordered`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_log`
--
ALTER TABLE `user_log`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_token`
--
ALTER TABLE `user_token`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user` (`user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `amount_received`
--
ALTER TABLE `amount_received`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `date_due`
--
ALTER TABLE `date_due`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `descriptions`
--
ALTER TABLE `descriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `lines`
--
ALTER TABLE `lines`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=160;

--
-- AUTO_INCREMENT for table `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT for table `order_lines`
--
ALTER TABLE `order_lines`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `order_reference`
--
ALTER TABLE `order_reference`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `partial`
--
ALTER TABLE `partial`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `part_number`
--
ALTER TABLE `part_number`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `po_or`
--
ALTER TABLE `po_or`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `prefixes`
--
ALTER TABLE `prefixes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `purchase_order`
--
ALTER TABLE `purchase_order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `total_ordered`
--
ALTER TABLE `total_ordered`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `user_log`
--
ALTER TABLE `user_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT for table `user_token`
--
ALTER TABLE `user_token`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
