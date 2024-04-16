-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 03, 2024 at 01:23 PM
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
(1, 5000, '2024-04-03 11:44:09'),
(2, 2500, '2024-04-03 11:44:09'),
(3, 2500, '2024-04-03 11:44:34'),
(4, 5000, '2024-04-03 11:45:36'),
(5, 2500, '2024-04-03 11:45:47'),
(6, 500, '2024-04-03 11:45:47'),
(7, 4000, '2024-04-03 11:45:57'),
(8, 500, '2024-04-03 11:46:30'),
(9, 500, '2024-04-03 11:46:30'),
(10, 500, '2024-04-03 11:47:27'),
(11, 500, '2024-04-03 11:47:27'),
(12, 800, '2024-04-03 11:56:08'),
(13, 50, '2024-04-03 11:56:08'),
(14, 500, '2024-04-03 12:06:54'),
(15, 500, '2024-04-03 12:06:54'),
(16, 250, '2024-04-03 12:07:39'),
(17, 2, '2024-04-03 12:07:39'),
(18, 100, '2024-04-03 12:08:06'),
(19, 50, '2024-04-03 12:08:06'),
(20, 2000, '2024-04-03 12:12:09'),
(21, 100, '2024-04-03 12:12:09'),
(22, 500, '2024-04-03 12:12:22'),
(23, 100, '2024-04-03 12:12:22'),
(24, 400, '2024-04-03 12:13:18'),
(25, 1500, '2024-04-03 12:13:40'),
(26, 500, '2024-04-03 12:13:40');

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
(1, '067103/067094', '2024-04-03 11:43:36'),
(2, '067090', '2024-04-03 11:47:04');

-- --------------------------------------------------------

--
-- Table structure for table `part_number`
--

CREATE TABLE `part_number` (
  `id` int(11) NOT NULL,
  `part` varchar(32) NOT NULL,
  `description` varchar(255) NOT NULL,
  `partial_delivery` tinyint(1) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `part_number`
--

INSERT INTO `part_number` (`id`, `part`, `description`, `partial_delivery`, `date_created`) VALUES
(1, 'EREST0772', '18K 0603  1%  RESISTOR', 1, '2024-04-03 11:43:36'),
(2, 'ECAPT0726', '100PF 0402 COG/NCO +/-5% CAP', 0, '2024-04-03 11:43:36'),
(3, 'EREST1345', '100R 0402 50V 63MW 5% ', 0, '2024-04-03 11:43:36'),
(4, 'EREST0984', '10M Generic 5% 0402', 1, '2024-04-03 11:43:36'),
(5, 'ECAPT0374', 'CAP CER 33pF 50V NPO 0603', 0, '2024-04-03 11:47:04'),
(6, 'EDIOD0397', 'B340-LB-13F-3A', 0, '2024-04-03 11:47:04'),
(7, 'EDIOD0398', 'BYX84C7V5', 0, '2024-04-03 11:47:04'),
(8, 'EINCI0801', 'MAX1615EUK', 1, '2024-04-03 11:47:04'),
(9, 'EREST0715', 'RES 0603 4K7 1%  0603 SEE TEXT', 0, '2024-04-03 11:47:04'),
(10, 'EREST0787', 'ERERESISTOR  10R 0.66W 1% 1206', 1, '2024-04-03 11:47:04'),
(11, 'EREST0863', 'RESISTOR 10K 1% 0603', 1, '2024-04-03 11:47:04'),
(12, 'EREST1270', '1M, 1%, 0.25W, 0603,THICK FILM', 0, '2024-04-03 11:47:04'),
(13, 'EREST1307', '100K  0603   250MW  1%', 0, '2024-04-03 11:47:04'),
(14, 'EREST1396', '510R 1206 0.25W 1%', 0, '2024-04-03 11:47:04'),
(15, 'EREST1397', '470K 0603 1%', 0, '2024-04-03 11:47:04');

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
(15, 15, 15);

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
(1, 1, 1, '2024-04-03 11:44:09'),
(2, 1, 2, '2024-04-03 11:44:09'),
(3, 1, 3, '2024-04-03 11:44:34'),
(4, 2, 4, '2024-04-03 11:45:36'),
(5, 3, 5, '2024-04-03 11:45:47'),
(6, 3, 6, '2024-04-03 11:45:47'),
(7, 4, 7, '2024-04-03 11:45:57'),
(8, 4, 8, '2024-04-03 11:46:30'),
(9, 4, 9, '2024-04-03 11:46:30'),
(10, 5, 10, '2024-04-03 11:47:27'),
(11, 5, 11, '2024-04-03 11:47:27'),
(12, 6, 12, '2024-04-03 11:56:08'),
(13, 6, 13, '2024-04-03 11:56:08'),
(14, 7, 14, '2024-04-03 12:06:54'),
(15, 7, 15, '2024-04-03 12:06:54'),
(16, 8, 16, '2024-04-03 12:07:39'),
(17, 8, 17, '2024-04-03 12:07:39'),
(18, 8, 18, '2024-04-03 12:08:06'),
(19, 8, 19, '2024-04-03 12:08:06'),
(20, 9, 20, '2024-04-03 12:12:09'),
(21, 9, 21, '2024-04-03 12:12:09'),
(22, 10, 22, '2024-04-03 12:12:22'),
(23, 10, 23, '2024-04-03 12:12:22'),
(24, 10, 24, '2024-04-03 12:13:18'),
(25, 11, 25, '2024-04-03 12:13:40'),
(26, 11, 26, '2024-04-03 12:13:40');

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
(2, 2, 2);

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
(4, 1, 4),
(5, 2, 5),
(6, 2, 6),
(7, 2, 7),
(8, 2, 8),
(9, 2, 9),
(10, 2, 10),
(11, 2, 11),
(12, 2, 12),
(13, 2, 13),
(14, 2, 14),
(15, 2, 15);

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
(1, '025421', '2024-04-03 11:43:36'),
(2, '025432', '2024-04-03 11:47:04');

-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `date_created` int(11) NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tokens`
--

INSERT INTO `tokens` (`id`, `token`, `date_created`) VALUES
(1, 'BDhJT5G5aluR8RD3FQGBVkYahP3KYYhV1712142820028', 2147483647);

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
(1, 10000, '2024-04-03 11:43:36'),
(2, 5000, '2024-04-03 11:43:36'),
(3, 3000, '2024-04-03 11:43:36'),
(4, 5000, '2024-04-03 11:43:36'),
(5, 1000, '2024-04-03 11:47:04'),
(6, 850, '2024-04-03 11:47:04'),
(7, 1000, '2024-04-03 11:47:04'),
(8, 402, '2024-04-03 11:47:04'),
(9, 2100, '2024-04-03 11:47:04'),
(10, 1000, '2024-04-03 11:47:04'),
(11, 2100, '2024-04-03 11:47:04'),
(12, 100, '2024-04-03 11:47:04'),
(13, 500, '2024-04-03 11:47:04'),
(14, 1700, '2024-04-03 11:47:04'),
(15, 1000, '2024-04-03 11:47:04');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `date_created`) VALUES
(1, 'michaelh@creekviewelectronics.co.uk', 'e434f534525192c75677c3815ff15b32877dded69826b5128fd1deec918a9e9a', '2024-04-03 11:43:30');

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
(1, 1, 1);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `order_reference`
--
ALTER TABLE `order_reference`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `part_number`
--
ALTER TABLE `part_number`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `pn_count`
--
ALTER TABLE `pn_count`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `pn_received`
--
ALTER TABLE `pn_received`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `po_or`
--
ALTER TABLE `po_or`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `po_pn`
--
ALTER TABLE `po_pn`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `purchase_order`
--
ALTER TABLE `purchase_order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `total_ordered`
--
ALTER TABLE `total_ordered`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user_token`
--
ALTER TABLE `user_token`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
