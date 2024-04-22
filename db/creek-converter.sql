-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 17, 2024 at 02:53 PM
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

--
-- Dumping data for table `amount_received`
--

INSERT INTO `amount_received` (`id`, `amount_received`, `date_created`) VALUES
(1, 1, '2024-04-16 10:55:16'),
(2, 1, '2024-04-16 10:55:23'),
(3, 600, '2024-04-16 11:09:06');

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
(1, 'PETRU', '2024-04-16 10:55:00'),
(2, 'VIASAT', '2024-04-16 11:02:56'),
(3, 'STORES', '2024-04-16 11:37:31'),
(4, '067181', '2024-04-16 12:01:37'),
(5, '67181', '2024-04-16 12:11:25'),
(6, '67181', '2024-04-16 12:14:20'),
(7, '67170', '2024-04-16 13:54:58'),
(8, '67169/71', '2024-04-17 07:03:36'),
(9, '67171/650PA=DAV', '2024-04-17 09:55:29'),
(10, 'STORES', '2024-04-17 10:19:15'),
(11, '67171', '2024-04-17 10:57:17'),
(13, '67171', '2024-04-17 11:33:08');

-- --------------------------------------------------------

--
-- Table structure for table `part_number`
--

CREATE TABLE `part_number` (
  `id` int(11) NOT NULL,
  `part` varchar(32) NOT NULL,
  `description` varchar(255) NOT NULL,
  `partial_delivery` tinyint(1) NOT NULL DEFAULT 0,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `part_number`
--

INSERT INTO `part_number` (`id`, `part`, `description`, `partial_delivery`, `date_created`) VALUES
(1, 'ETOOL0497', 'HAKKO N61-16', 0, '2024-04-16 10:55:00'),
(2, 'ETOOL0498', 'HAKKO N61-02', 0, '2024-04-16 10:55:00'),
(3, 'ETOOL0499', 'HAKKO N61-10', 0, '2024-04-16 10:55:00'),
(4, 'ELEDS0112', 'BEZEL PLASIC LED BEZEL 5MM', 1, '2024-04-16 11:02:56'),
(5, 'EBATT0037', 'LiCB 20 PCS LR1130 AG10 Battery 1.5V Alk', 0, '2024-04-16 11:37:31'),
(6, 'EPART0821', 'INLET VALVE - DUDLEY NOZZLE [12-0020 ]', 0, '2024-04-16 12:01:37'),
(7, 'EPART0821', 'INLET VALVE - DUDLEY NOZZLE [12-0020 ]', 0, '2024-04-16 12:01:37'),
(8, 'EPART0821', 'INLET VALVE - DUDLEY NOZZLE [12-0020 ]', 0, '2024-04-16 12:01:37'),
(9, 'ECONN0875', 'MINI FIT 5556 SOCKET, 39-00-0039', 0, '2024-04-16 12:11:25'),
(10, 'EPART0820', 'INLET TO SOLENOID ELBOW    [34-0180 ]', 0, '2024-04-16 12:14:20'),
(11, 'EPART0820', 'INLET TO SOLENOID ELBOW    [34-0180 ]', 0, '2024-04-16 12:14:20'),
(12, 'EPART0820', 'INLET TO SOLENOID ELBOW    [34-0180 ]', 0, '2024-04-16 12:14:20'),
(13, 'ECONN0021', '~SOCKET BLOCK BLA18B ORANGE', 0, '2024-04-16 13:54:58'),
(14, 'ECONN0022', '~SOCKET BLOCK BLA17B ORANGE', 0, '2024-04-16 13:54:58'),
(15, 'ECONN0029', '~PIN HEADER SLA18/90B 4.5MM', 0, '2024-04-16 13:54:58'),
(16, 'ECONN0066', '~PIN HEADER SLA17/90B 4.5MM', 0, '2024-04-16 13:54:58'),
(17, 'SE0001410', '6853734 TAPCHANGER LOOMS', 0, '2024-04-17 07:03:36'),
(18, 'EMTWK0083', 'DIN RAIL 2 MT LONG', 0, '2024-04-17 09:55:29'),
(19, 'ECONN0888', 'MOLEX MINI FIT-RECEPTACLE CONNECTOR HOUS', 0, '2024-04-17 09:55:29'),
(20, 'ECONN0875', 'MINI FIT 5556 SOCKET, 39-00-0039', 0, '2024-04-17 09:55:29'),
(21, 'SSTATT0236', 'CLIPBOARD', 0, '2024-04-17 10:19:15'),
(22, 'EMARK0006', '~CABLE MARKER SIZE 13 NO. 3', 0, '2024-04-17 10:57:17'),
(23, 'CARRIAGE', 'Carriage & Packing Charge', 0, '2024-04-17 10:57:17'),
(25, 'ETRAN0034', '~SCL200/110 CONTROL CIRCUIT', 0, '2024-04-17 11:33:08');

-- --------------------------------------------------------

--
-- Table structure for table `pn_count`
--

CREATE TABLE `pn_count` (
  `id` int(11) NOT NULL,
  `part_number` int(32) NOT NULL,
  `count` int(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pn_count`
--

INSERT INTO `pn_count` (`id`, `part_number`, `count`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3),
(4, 4, 4),
(5, 5, 5),
(6, 6, 6),
(7, 7, 7),
(8, 8, 8),
(9, 9, 9),
(10, 10, 10),
(11, 11, 11),
(12, 12, 12),
(13, 13, 13),
(14, 14, 14),
(15, 15, 15),
(16, 16, 16),
(17, 17, 17),
(18, 18, 18),
(19, 19, 19),
(20, 20, 20),
(21, 21, 21),
(22, 22, 22),
(23, 23, 23),
(25, 25, 25);

-- --------------------------------------------------------

--
-- Table structure for table `pn_received`
--

CREATE TABLE `pn_received` (
  `id` int(11) NOT NULL,
  `part_number` int(11) NOT NULL,
  `amount_received` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pn_received`
--

INSERT INTO `pn_received` (`id`, `part_number`, `amount_received`, `date_created`) VALUES
(1, 1, 1, '2024-04-16 10:55:16'),
(2, 3, 2, '2024-04-16 10:55:23'),
(3, 4, 3, '2024-04-16 11:09:06');

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
(3, 3, 3),
(4, 4, 4),
(5, 5, 5),
(6, 6, 6),
(7, 9, 7),
(8, 10, 8),
(9, 11, 9),
(10, 12, 10),
(11, 14, 11),
(13, 18, 13);

-- --------------------------------------------------------

--
-- Table structure for table `po_pn`
--

CREATE TABLE `po_pn` (
  `id` int(11) NOT NULL,
  `purchase_order` int(32) NOT NULL,
  `part_number` int(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `po_pn`
--

INSERT INTO `po_pn` (`id`, `purchase_order`, `part_number`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(4, 2, 4),
(5, 3, 5),
(6, 4, 6),
(7, 4, 7),
(8, 4, 8),
(9, 5, 9),
(10, 6, 10),
(11, 6, 11),
(12, 6, 12),
(13, 9, 13),
(14, 9, 14),
(15, 9, 15),
(16, 9, 16),
(17, 10, 17),
(18, 11, 18),
(19, 11, 19),
(20, 11, 20),
(21, 12, 21),
(22, 14, 22),
(23, 14, 23),
(25, 18, 25);

-- --------------------------------------------------------

--
-- Table structure for table `prefixes`
--

CREATE TABLE `prefixes` (
  `id` int(11) NOT NULL,
  `prefix` varchar(255) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, '025448', '2024-04-16 10:55:00'),
(2, '025562', '2024-04-16 11:02:56'),
(3, '025559', '2024-04-16 11:37:31'),
(4, '025563', '2024-04-16 12:01:37'),
(5, '025556', '2024-04-16 12:11:25'),
(6, '025555', '2024-04-16 12:14:20'),
(9, '025551', '2024-04-16 13:54:58'),
(10, '025567', '2024-04-17 07:03:36'),
(11, '025570', '2024-04-17 09:55:29'),
(12, '025573', '2024-04-17 10:19:15'),
(14, '025574', '2024-04-17 10:57:17'),
(18, '025575', '2024-04-17 11:33:08');

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
(1, 'jEOt3soVbEF3RJbWjNAE0LRN9EvNoFa21713349163855', '2024-04-16 10:54:49'),
(2, 'F4IeBrSughHWHIGD38VG4WPC4SddcARZ1713265381920', '2024-04-16 11:02:41'),
(3, 'MvckUGidFRkUm9RqL5FoIKp96wfpjPfJ1713265791629', '2024-04-16 11:07:28'),
(4, '6mqxxgtGeDyzwoTQnnr1X4cs2GNdK5Qu1713266216265', '2024-04-16 11:16:09'),
(5, 'rQuDHGYJD5zosgyM3Hk21JBRzViij6Nl1713353588667', '2024-04-16 11:34:38'),
(6, '1U1zCaV2p74Sj4RsLjolhKDaSYgNEJnN1713351934412', '2024-04-16 12:01:14');

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
(1, 1, '2024-04-16 10:55:00'),
(2, 1, '2024-04-16 10:55:00'),
(3, 1, '2024-04-16 10:55:00'),
(4, 625, '2024-04-16 11:02:56'),
(5, 20, '2024-04-16 11:37:31'),
(6, 340, '2024-04-16 12:01:37'),
(7, 340, '2024-04-16 12:01:37'),
(8, 340, '2024-04-16 12:01:37'),
(9, 2100, '2024-04-16 12:11:25'),
(10, 340, '2024-04-16 12:14:20'),
(11, 340, '2024-04-16 12:14:20'),
(12, 340, '2024-04-16 12:14:20'),
(13, 30, '2024-04-16 13:54:58'),
(14, 30, '2024-04-16 13:54:58'),
(15, 30, '2024-04-16 13:54:58'),
(16, 30, '2024-04-16 13:54:58'),
(17, 20, '2024-04-17 07:03:36'),
(18, 8, '2024-04-17 09:55:29'),
(19, 20, '2024-04-17 09:55:29'),
(20, 200, '2024-04-17 09:55:29'),
(21, 2, '2024-04-17 10:19:15'),
(22, 1000, '2024-04-17 10:57:17'),
(23, 1, '2024-04-17 10:57:17'),
(25, 11, '2024-04-17 11:33:08');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` int(11) DEFAULT NULL CHECK (`role` < 6),
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `role`, `date_created`) VALUES
(1, 'michaelh@creekviewelectronics.co.uk', 'e434f534525192c75677c3815ff15b32877dded69826b5128fd1deec918a9e9a', 5, '2024-04-16 10:54:49'),
(2, 'georges@creekviewelectronics.co.uk', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 4, '2024-04-16 11:02:41'),
(3, 'rsmith@creekviewelectronics.co.uk', 'e4b5b1f45677c45cc04438cf1b16f3420edaf44567d13163083e1e1789ecaa5e', 5, '2024-04-16 11:07:28'),
(4, 'joes@creekviewelectronics.co.uk', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 4, '2024-04-16 11:16:09'),
(5, 'purchasing@creekviewelectronics.co.uk', 'a91a1dcc4b6e39cdd2ecb70a761a227dde1327b132d542c6587e200c138cc845', 0, '2024-04-16 11:34:38'),
(6, 'richardc@creekviewelectronics.co.uk', 'e1c8844e7c6b98db5479e173161c73d7ce6c9e9b6bfd444e6de708bcf2b2387f', 0, '2024-04-16 12:01:14');

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
(6, 6, 6);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `amount_received`
--
ALTER TABLE `amount_received`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_reference`
--
ALTER TABLE `order_reference`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `part_number`
--
ALTER TABLE `part_number`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pn_count`
--
ALTER TABLE `pn_count`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pn_received`
--
ALTER TABLE `pn_received`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `po_or`
--
ALTER TABLE `po_or`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `po_pn`
--
ALTER TABLE `po_pn`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `prefixes`
--
ALTER TABLE `prefixes`
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `order_reference`
--
ALTER TABLE `order_reference`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `part_number`
--
ALTER TABLE `part_number`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `pn_count`
--
ALTER TABLE `pn_count`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `pn_received`
--
ALTER TABLE `pn_received`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `po_or`
--
ALTER TABLE `po_or`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `po_pn`
--
ALTER TABLE `po_pn`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `prefixes`
--
ALTER TABLE `prefixes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchase_order`
--
ALTER TABLE `purchase_order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `total_ordered`
--
ALTER TABLE `total_ordered`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user_log`
--
ALTER TABLE `user_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_token`
--
ALTER TABLE `user_token`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
