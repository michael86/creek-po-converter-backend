-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 21, 2024 at 04:49 PM
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
-- Table structure for table `count`
--

CREATE TABLE `count` (
  `id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `count`
--

INSERT INTO `count` (`id`, `quantity`, `date_created`) VALUES
(1, 200, '2024-03-21 15:46:11'),
(2, 200, '2024-03-21 15:46:11'),
(3, 200, '2024-03-21 15:46:11'),
(4, 200, '2024-03-21 15:46:11'),
(5, 200, '2024-03-21 15:46:11'),
(6, 200, '2024-03-21 15:46:11'),
(7, 1000, '2024-03-21 15:46:25'),
(8, 850, '2024-03-21 15:46:25'),
(9, 1000, '2024-03-21 15:46:25'),
(10, 402, '2024-03-21 15:46:25'),
(11, 2100, '2024-03-21 15:46:25'),
(12, 1000, '2024-03-21 15:46:25'),
(13, 2100, '2024-03-21 15:46:25'),
(14, 100, '2024-03-21 15:46:25'),
(15, 500, '2024-03-21 15:46:25'),
(16, 1700, '2024-03-21 15:46:25'),
(17, 1000, '2024-03-21 15:46:25'),
(18, 1000, '2024-03-21 15:49:32'),
(19, 850, '2024-03-21 15:49:32'),
(20, 1000, '2024-03-21 15:49:32'),
(21, 402, '2024-03-21 15:49:32'),
(22, 2100, '2024-03-21 15:49:32'),
(23, 1000, '2024-03-21 15:49:32'),
(24, 2100, '2024-03-21 15:49:32'),
(25, 100, '2024-03-21 15:49:32'),
(26, 500, '2024-03-21 15:49:32'),
(27, 1700, '2024-03-21 15:49:32'),
(28, 1000, '2024-03-21 15:49:32');

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
(1, '67059', '2024-03-21 15:46:11'),
(2, '67090', '2024-03-21 15:46:25'),
(3, '067090', '2024-03-21 15:49:32');

-- --------------------------------------------------------

--
-- Table structure for table `part_number`
--

CREATE TABLE `part_number` (
  `id` int(11) NOT NULL,
  `part` varchar(32) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `part_number`
--

INSERT INTO `part_number` (`id`, `part`, `date_created`) VALUES
(1, 'ECONN0796', '2024-03-21 15:46:11'),
(2, 'ECONN0796', '2024-03-21 15:46:11'),
(3, 'ECONN0796', '2024-03-21 15:46:11'),
(4, 'ECONN0796', '2024-03-21 15:46:11'),
(5, 'ECONN0796', '2024-03-21 15:46:11'),
(6, 'ECONN0796', '2024-03-21 15:46:11'),
(7, 'ECAPT0374', '2024-03-21 15:46:25'),
(8, 'EDIOD0397', '2024-03-21 15:46:25'),
(9, 'EDIOD0398', '2024-03-21 15:46:25'),
(10, 'EINCI0801', '2024-03-21 15:46:25'),
(11, 'EREST0715', '2024-03-21 15:46:25'),
(12, 'EREST0787', '2024-03-21 15:46:25'),
(13, 'EREST0863', '2024-03-21 15:46:25'),
(14, 'EREST1270', '2024-03-21 15:46:25'),
(15, 'EREST1307', '2024-03-21 15:46:25'),
(16, 'EREST1396', '2024-03-21 15:46:25'),
(17, 'EREST1397', '2024-03-21 15:46:25'),
(18, 'ECAPT0374', '2024-03-21 15:49:32'),
(19, 'EDIOD0397', '2024-03-21 15:49:32'),
(20, 'EDIOD0398', '2024-03-21 15:49:32'),
(21, 'EINCI0801', '2024-03-21 15:49:32'),
(22, 'EREST0715', '2024-03-21 15:49:32'),
(23, 'EREST0787', '2024-03-21 15:49:32'),
(24, 'EREST0863', '2024-03-21 15:49:32'),
(25, 'EREST1270', '2024-03-21 15:49:32'),
(26, 'EREST1307', '2024-03-21 15:49:32'),
(27, 'EREST1396', '2024-03-21 15:49:32'),
(28, 'EREST1397', '2024-03-21 15:49:32');

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
(28, 28, 28);

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
(5, 1, 5),
(6, 1, 6),
(7, 2, 7),
(8, 2, 8),
(9, 2, 9),
(10, 2, 10),
(11, 2, 11),
(12, 2, 12),
(13, 2, 13),
(14, 2, 14),
(15, 2, 15),
(16, 2, 16),
(17, 2, 17),
(18, 3, 18),
(19, 3, 19),
(20, 3, 20),
(21, 3, 21),
(22, 3, 22),
(23, 3, 23),
(24, 3, 24),
(25, 3, 25),
(26, 3, 26),
(27, 3, 27),
(28, 3, 28);

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
(1, '025419', '2024-03-21 15:46:11'),
(2, '025432', '2024-03-21 15:46:25'),
(3, '025432', '2024-03-21 15:49:32');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `count`
--
ALTER TABLE `count`
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
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `count`
--
ALTER TABLE `count`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `order_reference`
--
ALTER TABLE `order_reference`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `part_number`
--
ALTER TABLE `part_number`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `pn_count`
--
ALTER TABLE `pn_count`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `po_or`
--
ALTER TABLE `po_or`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `po_pn`
--
ALTER TABLE `po_pn`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `purchase_order`
--
ALTER TABLE `purchase_order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
