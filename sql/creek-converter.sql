-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 02, 2024 at 05:46 PM
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
(1, 5000, '2024-04-02 16:26:48'),
(2, 5000, '2024-04-02 16:26:48'),
(3, 2500, '2024-04-02 16:38:12'),
(4, 2500, '2024-04-02 16:38:12'),
(5, 2500, '2024-04-02 16:38:12'),
(6, 2500, '2024-04-02 16:38:12'),
(7, 2500, '2024-04-02 16:39:17'),
(8, 2500, '2024-04-02 16:39:17'),
(9, 2500, '2024-04-02 16:39:17'),
(10, 2500, '2024-04-02 16:39:17'),
(11, 2500, '2024-04-02 16:39:39'),
(12, 2500, '2024-04-02 16:39:39'),
(13, 2500, '2024-04-02 16:39:39'),
(14, 2500, '2024-04-02 16:39:39'),
(15, 2500, '2024-04-02 16:39:58'),
(16, 2500, '2024-04-02 16:39:58'),
(17, 2500, '2024-04-02 16:39:58'),
(18, 2500, '2024-04-02 16:39:58'),
(19, 2500, '2024-04-02 16:40:16'),
(20, 2500, '2024-04-02 16:40:16'),
(21, 2500, '2024-04-02 16:40:16'),
(22, 2500, '2024-04-02 16:40:16'),
(23, 2500, '2024-04-02 16:40:22'),
(24, 2500, '2024-04-02 16:40:22'),
(25, 2500, '2024-04-02 16:40:22'),
(26, 2500, '2024-04-02 16:40:22'),
(27, 2500, '2024-04-02 16:40:35'),
(28, 2500, '2024-04-02 16:40:35'),
(29, 2500, '2024-04-02 16:40:35'),
(30, 2500, '2024-04-02 16:40:35'),
(31, 2500, '2024-04-02 16:41:01'),
(32, 2500, '2024-04-02 16:41:01'),
(33, 2500, '2024-04-02 16:41:01'),
(34, 2500, '2024-04-02 16:41:01'),
(35, 2500, '2024-04-02 16:41:14'),
(36, 2500, '2024-04-02 16:41:14'),
(37, 2500, '2024-04-02 16:41:14'),
(38, 2500, '2024-04-02 16:41:14'),
(39, 2500, '2024-04-02 16:41:35'),
(40, 2500, '2024-04-02 16:41:35'),
(41, 2500, '2024-04-02 16:41:35'),
(42, 2500, '2024-04-02 16:41:35'),
(43, 2500, '2024-04-02 16:42:16'),
(44, 2500, '2024-04-02 16:42:16'),
(45, 2500, '2024-04-02 16:42:16'),
(46, 2500, '2024-04-02 16:42:16'),
(47, 3000, '2024-04-02 16:43:27'),
(48, 1000, '2024-04-02 16:43:27'),
(49, 500, '2024-04-02 16:43:27'),
(50, 500, '2024-04-02 16:43:27');

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
(1, '067103/067094', '2024-03-26 16:19:31'),
(2, '067090', '2024-03-26 16:19:43'),
(3, 'ROOM UNIT', '2024-03-26 16:19:48'),
(4, 'COURTNEY THORNE', '2024-03-26 16:19:54'),
(5, '067090', '2024-03-26 16:19:59'),
(6, 'S/F-PETRU', '2024-03-26 16:20:05'),
(7, '067149/067090', '2024-03-27 14:17:30'),
(8, 'DAN/GARY', '2024-04-02 08:11:47'),
(9, 'PETRU', '2024-04-02 11:57:07');

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
(1, 'EREST0772', '18K 0603  1%  RESISTOR', 1, '2024-03-26 16:19:31'),
(2, 'ECAPT0726', '100PF 0402 COG/NCO +/-5% CAP', 1, '2024-03-26 16:19:31'),
(3, 'EREST1345', '100R 0402 50V 63MW 5% ', 1, '2024-03-26 16:19:31'),
(4, 'EREST0984', '10M Generic 5% 0402', 1, '2024-03-26 16:19:31'),
(5, 'ECAPT0374', 'CAP CER 33pF 50V NPO 0603', 0, '2024-03-26 16:19:43'),
(6, 'EDIOD0397', 'B340-LB-13F-3A', 0, '2024-03-26 16:19:43'),
(7, 'EDIOD0398', 'BYX84C7V5', 0, '2024-03-26 16:19:43'),
(8, 'EINCI0801', 'MAX1615EUK', 0, '2024-03-26 16:19:43'),
(9, 'EREST0715', 'RES 0603 4K7 1%  0603 SEE TEXT', 0, '2024-03-26 16:19:43'),
(10, 'EREST0787', 'ERERESISTOR  10R 0.66W 1% 1206', 0, '2024-03-26 16:19:43'),
(11, 'EREST0863', 'RESISTOR 10K 1% 0603', 0, '2024-03-26 16:19:43'),
(12, 'EREST1270', '1M, 1%, 0.25W, 0603,THICK FILM', 0, '2024-03-26 16:19:43'),
(13, 'EREST1307', '100K  0603   250MW  1%', 0, '2024-03-26 16:19:43'),
(14, 'EREST1396', '510R 1206 0.25W 1%', 0, '2024-03-26 16:19:43'),
(15, 'EREST1397', '470K 0603 1%', 0, '2024-03-26 16:19:43'),
(16, 'EBATT0001', 'GP AA BATTERY 15A 1.5V', 1, '2024-03-26 16:19:48'),
(17, 'EINCI0266', 'MICROCHIP PIC18LF24K22T-I/SO', 1, '2024-03-26 16:19:54'),
(18, 'EINCI0800', 'CD4093BCM', 1, '2024-03-26 16:19:59'),
(19, 'ELEDS0237', '150080RS75000 RED 0805', 1, '2024-03-26 16:20:05'),
(20, 'EREST1344', '1M 0402 63MW 50V 5%', 0, '2024-03-26 16:20:05'),
(21, 'EREST1347', '2.2k 1206 EXB-38V222JV', 0, '2024-03-26 16:20:05'),
(22, 'EINCI0800', 'CD4093BCM', 0, '2024-03-27 14:17:30'),
(23, 'ECAPT0997', '3.9PF 0402 COG/NPO 50V 0.1PF', 1, '2024-03-27 14:17:30'),
(24, 'ECAPT0998', '10pF 0402 COG/NPO 50V 2%', 0, '2024-03-27 14:17:30'),
(25, 'ECAPT1021', '18PF 0402 COG/NPO 2% 50V', 0, '2024-03-27 14:17:30'),
(26, 'EINDU0137', '22nF 0402 5%', 0, '2024-03-27 14:17:30'),
(27, 'EINDU0138', '27nF 0402N 5%', 0, '2024-03-27 14:17:30'),
(28, 'ECAPT0777', 'CAP, 4.7uf, 0805 25V', 1, '2024-04-02 08:11:47'),
(29, 'ECAPT0822', 'CAP 12pF 25V 0603', 1, '2024-04-02 08:11:47'),
(30, 'ECAPT0996', '100nF 0402 X5R/X7R 6.3V 10%', 0, '2024-04-02 08:11:47'),
(31, 'EREST1345', '100R 0402 50V 63MW 5%', 0, '2024-04-02 08:11:47'),
(32, 'ETOOL0497', 'HAKKO N61-16', 0, '2024-04-02 11:57:07'),
(33, 'ETOOL0498', 'HAKKO N61-02', 0, '2024-04-02 11:57:07'),
(34, 'ETOOL0499', 'HAKKO N61-10', 0, '2024-04-02 11:57:08');

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
(24, 24, 24),
(25, 25, 25),
(26, 26, 26),
(27, 27, 27),
(28, 28, 28),
(29, 29, 29),
(30, 30, 30),
(31, 31, 31),
(32, 32, 32),
(33, 33, 33),
(34, 34, 34);

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
(1, 43, 1, '2024-04-02 16:42:16'),
(2, 44, 1, '2024-04-02 16:42:16'),
(3, 45, 1, '2024-04-02 16:42:16'),
(4, 46, 1, '2024-04-02 16:42:16'),
(5, 2, 47, '2024-04-02 16:43:27'),
(6, 2, 48, '2024-04-02 16:43:27'),
(7, 2, 49, '2024-04-02 16:43:27'),
(8, 2, 50, '2024-04-02 16:43:27');

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
(7, 7, 7),
(8, 10, 8),
(9, 12, 9);

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
(15, 2, 15),
(16, 3, 16),
(17, 4, 17),
(18, 5, 18),
(19, 6, 19),
(20, 6, 20),
(21, 6, 21),
(22, 7, 22),
(23, 7, 23),
(24, 7, 24),
(25, 7, 25),
(26, 7, 26),
(27, 7, 27),
(28, 10, 28),
(29, 10, 29),
(30, 10, 30),
(31, 10, 31),
(32, 12, 32),
(33, 12, 33),
(34, 12, 34);

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
(1, '025421', '2024-03-26 16:19:31'),
(2, '025432', '2024-03-26 16:19:43'),
(3, '025434', '2024-03-26 16:19:48'),
(4, '025438', '2024-03-26 16:19:54'),
(5, '025441', '2024-03-26 16:19:59'),
(6, '025442', '2024-03-26 16:20:05'),
(7, '025450', '2024-03-27 14:17:30'),
(10, '025444', '2024-04-02 08:11:47'),
(12, '025448', '2024-04-02 11:57:07');

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
(1, 'CjSf4nOhnCxauSw8mT43vcAc9NrZ3E4m1712072607081', 2147483647);

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
(1, 10000, '2024-03-26 16:19:31'),
(2, 5000, '2024-03-26 16:19:31'),
(3, 3000, '2024-03-26 16:19:31'),
(4, 5000, '2024-03-26 16:19:31'),
(5, 1000, '2024-03-26 16:19:43'),
(6, 850, '2024-03-26 16:19:43'),
(7, 1000, '2024-03-26 16:19:43'),
(8, 402, '2024-03-26 16:19:43'),
(9, 2100, '2024-03-26 16:19:43'),
(10, 1000, '2024-03-26 16:19:43'),
(11, 2100, '2024-03-26 16:19:43'),
(12, 100, '2024-03-26 16:19:43'),
(13, 500, '2024-03-26 16:19:43'),
(14, 1700, '2024-03-26 16:19:43'),
(15, 1000, '2024-03-26 16:19:43'),
(16, 6000, '2024-03-26 16:19:48'),
(17, 600, '2024-03-26 16:19:54'),
(18, 410, '2024-03-26 16:19:59'),
(19, 2000, '2024-03-26 16:20:05'),
(20, 10000, '2024-03-26 16:20:05'),
(21, 2000, '2024-03-26 16:20:05'),
(22, 410, '2024-03-27 14:17:30'),
(23, 5000, '2024-03-27 14:17:30'),
(24, 1000, '2024-03-27 14:17:30'),
(25, 1000, '2024-03-27 14:17:30'),
(26, 1000, '2024-03-27 14:17:30'),
(27, 1000, '2024-03-27 14:17:30'),
(28, 3000, '2024-04-02 08:11:47'),
(29, 3580, '2024-04-02 08:11:47'),
(30, 5000, '2024-04-02 08:11:47'),
(31, 10000, '2024-04-02 08:11:47'),
(32, 1, '2024-04-02 11:57:07'),
(33, 1, '2024-04-02 11:57:07'),
(34, 1, '2024-04-02 11:57:08');

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
(1, 'michaelh@creekviewelectronics.co.uk', 'e434f534525192c75677c3815ff15b32877dded69826b5128fd1deec918a9e9a', '2024-03-26 15:57:49');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `order_reference`
--
ALTER TABLE `order_reference`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `part_number`
--
ALTER TABLE `part_number`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `pn_count`
--
ALTER TABLE `pn_count`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `pn_received`
--
ALTER TABLE `pn_received`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `po_or`
--
ALTER TABLE `po_or`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `po_pn`
--
ALTER TABLE `po_pn`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `purchase_order`
--
ALTER TABLE `purchase_order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `total_ordered`
--
ALTER TABLE `total_ordered`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

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
