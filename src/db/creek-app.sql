-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 16, 2025 at 12:54 PM
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
-- Database: `creek-app`
--

-- --------------------------------------------------------

--
-- Table structure for table `deliveries`
--

CREATE TABLE `deliveries` (
  `id` int(11) NOT NULL,
  `po_number` varchar(50) NOT NULL,
  `part_number` varchar(50) NOT NULL,
  `quantity_received` int(11) NOT NULL CHECK (`quantity_received` > 0),
  `received_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `order_item_id` char(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `deliveries`
--
DELIMITER $$
CREATE TRIGGER `update_order_item_quantity_received` AFTER INSERT ON `deliveries` FOR EACH ROW BEGIN
  UPDATE order_items
  SET quantity_received = quantity_received + NEW.quantity_received
  WHERE id = NEW.order_item_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `name`) VALUES
(206, 'AA-1'),
(2, 'AA-2'),
(3, 'AA-3'),
(4, 'AB-1'),
(5, 'AB-2'),
(6, 'AB-3'),
(7, 'AC-1'),
(8, 'AC-2'),
(9, 'AC-3'),
(46, 'B-1'),
(55, 'B-10'),
(56, 'B-11'),
(57, 'B-12'),
(58, 'B-13'),
(59, 'B-14'),
(60, 'B-15'),
(61, 'B-16'),
(62, 'B-17'),
(63, 'B-18'),
(64, 'B-19'),
(47, 'B-2'),
(65, 'B-20'),
(66, 'B-21'),
(67, 'B-22'),
(68, 'B-23'),
(69, 'B-24'),
(70, 'B-25'),
(71, 'B-26'),
(72, 'B-27'),
(73, 'B-28'),
(74, 'B-29'),
(48, 'B-3'),
(75, 'B-30'),
(76, 'B-31'),
(77, 'B-32'),
(78, 'B-33'),
(79, 'B-34'),
(80, 'B-35'),
(49, 'B-4'),
(50, 'B-5'),
(51, 'B-6'),
(52, 'B-7'),
(53, 'B-8'),
(54, 'B-9'),
(10, 'BA-1'),
(11, 'BA-2'),
(12, 'BA-3'),
(13, 'BB-1'),
(14, 'BB-2'),
(15, 'BB-3'),
(16, 'BC-1'),
(17, 'BC-2'),
(18, 'BC-3'),
(81, 'C-1'),
(90, 'C-10'),
(91, 'C-11'),
(92, 'C-12'),
(93, 'C-13'),
(94, 'C-14'),
(95, 'C-15'),
(96, 'C-16'),
(97, 'C-17'),
(98, 'C-18'),
(99, 'C-19'),
(82, 'C-2'),
(100, 'C-20'),
(101, 'C-21'),
(102, 'C-22'),
(103, 'C-23'),
(104, 'C-24'),
(105, 'C-25'),
(106, 'C-26'),
(107, 'C-27'),
(108, 'C-28'),
(109, 'C-29'),
(83, 'C-3'),
(110, 'C-30'),
(111, 'C-31'),
(112, 'C-32'),
(113, 'C-33'),
(114, 'C-34'),
(115, 'C-35'),
(84, 'C-4'),
(85, 'C-5'),
(86, 'C-6'),
(87, 'C-7'),
(88, 'C-8'),
(89, 'C-9'),
(19, 'CA-1'),
(20, 'CA-2'),
(21, 'CA-3'),
(22, 'CB-1'),
(23, 'CB-2'),
(24, 'CB-3'),
(25, 'CC-1'),
(26, 'CC-2'),
(27, 'CC-3'),
(116, 'D-1'),
(125, 'D-10'),
(126, 'D-11'),
(127, 'D-12'),
(128, 'D-13'),
(129, 'D-14'),
(130, 'D-15'),
(131, 'D-16'),
(132, 'D-17'),
(133, 'D-18'),
(134, 'D-19'),
(117, 'D-2'),
(135, 'D-20'),
(136, 'D-21'),
(137, 'D-22'),
(138, 'D-23'),
(139, 'D-24'),
(140, 'D-25'),
(141, 'D-26'),
(142, 'D-27'),
(143, 'D-28'),
(144, 'D-29'),
(118, 'D-3'),
(145, 'D-30'),
(146, 'D-31'),
(147, 'D-32'),
(148, 'D-33'),
(149, 'D-34'),
(150, 'D-35'),
(119, 'D-4'),
(120, 'D-5'),
(121, 'D-6'),
(122, 'D-7'),
(123, 'D-8'),
(124, 'D-9'),
(28, 'DA-1'),
(29, 'DA-2'),
(30, 'DA-3'),
(31, 'DB-1'),
(32, 'DB-2'),
(33, 'DB-3'),
(34, 'DC-1'),
(35, 'DC-2'),
(36, 'DC-3'),
(151, 'E-1'),
(160, 'E-10'),
(161, 'E-11'),
(162, 'E-12'),
(163, 'E-13'),
(164, 'E-14'),
(165, 'E-15'),
(166, 'E-16'),
(167, 'E-17'),
(168, 'E-18'),
(169, 'E-19'),
(152, 'E-2'),
(170, 'E-20'),
(171, 'E-21'),
(172, 'E-22'),
(173, 'E-23'),
(174, 'E-24'),
(175, 'E-25'),
(176, 'E-26'),
(177, 'E-27'),
(178, 'E-28'),
(179, 'E-29'),
(153, 'E-3'),
(180, 'E-30'),
(181, 'E-31'),
(182, 'E-32'),
(183, 'E-33'),
(184, 'E-34'),
(185, 'E-35'),
(154, 'E-4'),
(155, 'E-5'),
(156, 'E-6'),
(157, 'E-7'),
(158, 'E-8'),
(159, 'E-9'),
(37, 'EA-1'),
(38, 'EA-2'),
(39, 'EA-3'),
(40, 'EB-1'),
(41, 'EB-2'),
(42, 'EB-3'),
(43, 'EC-1'),
(44, 'EC-2'),
(45, 'EC-3'),
(204, 'GARY-1'),
(190, 'J-10'),
(191, 'J-11'),
(192, 'J-12'),
(193, 'J-13'),
(194, 'J-14'),
(195, 'J-15'),
(186, 'J-6'),
(187, 'J-7'),
(188, 'J-8'),
(189, 'J-9'),
(196, 'J-B'),
(197, 'MALC-1'),
(201, 'PA-1'),
(202, 'PA-2'),
(203, 'PA-3'),
(205, 'PETRU-1'),
(199, 'S/F-1'),
(198, 'SHARON-1'),
(200, 'SM-1');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `po_number` varchar(50) NOT NULL,
  `part_number` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `quantity_received` int(11) DEFAULT 0,
  `storage_location` varchar(50) DEFAULT NULL,
  `due_date` date NOT NULL,
  `id` char(36) NOT NULL DEFAULT uuid()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(40, 'ESCON', '2024-04-25 10:16:24'),
(41, 'ESLEE', '2024-04-25 10:16:39'),
(42, 'ETERM', '2024-04-25 10:16:58'),
(43, 'CARRAIGE', '2024-04-26 09:05:29');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_orders`
--

CREATE TABLE `purchase_orders` (
  `po_number` varchar(50) NOT NULL,
  `order_ref` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `uuid` varchar(36) NOT NULL DEFAULT uuid()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` int(11) DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `deliveries`
--
ALTER TABLE `deliveries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `po_number` (`po_number`,`part_number`),
  ADD KEY `fk_delivery_order_item` (`order_item_id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_storage_location` (`storage_location`),
  ADD KEY `idx_po_part` (`po_number`,`part_number`);

--
-- Indexes for table `prefixes`
--
ALTER TABLE `prefixes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `prefix` (`prefix`);

--
-- Indexes for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD PRIMARY KEY (`uuid`),
  ADD UNIQUE KEY `po_number` (`po_number`,`order_ref`),
  ADD UNIQUE KEY `uuid` (`uuid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `deliveries`
--
ALTER TABLE `deliveries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=120;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=207;

--
-- AUTO_INCREMENT for table `prefixes`
--
ALTER TABLE `prefixes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `deliveries`
--
ALTER TABLE `deliveries`
  ADD CONSTRAINT `deliveries_ibfk_1` FOREIGN KEY (`po_number`,`part_number`) REFERENCES `order_items` (`po_number`, `part_number`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_delivery_order_item` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_storage_location` FOREIGN KEY (`storage_location`) REFERENCES `locations` (`name`) ON DELETE SET NULL,
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`po_number`) REFERENCES `purchase_orders` (`po_number`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
