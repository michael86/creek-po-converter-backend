-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 02, 2024 at 03:36 PM
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

-- --------------------------------------------------------

--
-- Table structure for table `descriptions`
--

CREATE TABLE `descriptions` (
  `id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

-- --------------------------------------------------------

--
-- Table structure for table `line_received`
--

CREATE TABLE `line_received` (
  `id` int(11) NOT NULL,
  `line_id` int(11) NOT NULL,
  `received_id` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, 'User validated there token', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 14:31:57'),
(2, 'User viewed all purchase order names ', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 14:32:00'),
(3, 'User validated there token', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 14:33:05'),
(4, 'User viewed all purchase order names ', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 14:33:07'),
(5, 'User validated there token', 'michaelh@creekviewelectronics.co.uk', '2024-05-02 14:33:29');

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

-- --------------------------------------------------------

--
-- Table structure for table `order_reference`
--

CREATE TABLE `order_reference` (
  `id` int(11) NOT NULL,
  `order_reference` varchar(256) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `partial`
--

CREATE TABLE `partial` (
  `id` int(11) NOT NULL,
  `partial_status` tinyint(1) NOT NULL DEFAULT 0,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

-- --------------------------------------------------------

--
-- Table structure for table `po_or`
--

CREATE TABLE `po_or` (
  `id` int(11) NOT NULL,
  `purchase_order` int(32) NOT NULL,
  `order_reference` int(32) NOT NULL
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
(1, 'A5RAtsEuKDmdtJMnJR445wMOsKy90RUH1714656787526', '2024-04-23 15:50:58'),
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
(1, 1, 1, '2024-05-02 14:31:57'),
(2, 1, 2, '2024-05-02 14:32:00'),
(3, 1, 3, '2024-05-02 14:33:05'),
(4, 1, 4, '2024-05-02 14:33:07'),
(5, 1, 5, '2024-05-02 14:33:29');

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
-- Indexes for table `line_received`
--
ALTER TABLE `line_received`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `descriptions`
--
ALTER TABLE `descriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lines`
--
ALTER TABLE `lines`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `line_received`
--
ALTER TABLE `line_received`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=160;

--
-- AUTO_INCREMENT for table `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `order_lines`
--
ALTER TABLE `order_lines`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_reference`
--
ALTER TABLE `order_reference`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `partial`
--
ALTER TABLE `partial`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `part_number`
--
ALTER TABLE `part_number`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `po_or`
--
ALTER TABLE `po_or`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `prefixes`
--
ALTER TABLE `prefixes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `purchase_order`
--
ALTER TABLE `purchase_order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `total_ordered`
--
ALTER TABLE `total_ordered`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `user_log`
--
ALTER TABLE `user_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user_token`
--
ALTER TABLE `user_token`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
