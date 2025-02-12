-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Feb 23, 2024 at 01:49 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gataama`
--

-- --------------------------------------------------------

--
-- Table structure for table `careers`
--

CREATE TABLE `careers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `cv` varchar(255) DEFAULT NULL,
  `message` longtext DEFAULT NULL,
  `role` varchar(255) NOT NULL COMMENT 'volunteer or anyother jobtitle',
  `status` int(11) NOT NULL DEFAULT 1,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
   PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `careers`
--

INSERT INTO `careers` (`id`, `name`, `email`, `phone`, `country`, `cv`, `message`, `role`, `status`, `createdAt`) VALUES
(5, 'ochieng seth', 'ochseth04@gmail.com', '+256704401316', 'Uganda', 'http://localhost:5000/cvs/1708523014286cv - ada.docx', 'test message', 'volunteer', 0, '2024-02-21 13:43:34'),
(6, 'ochieng seth couco', 'ochseth04@gmail.com', '+256762644374', 'Uganda', 'http://localhost:5000/cvs/1708524817583ecp17141004.pdf', 'jkhsdikasj djk asndaos daskldnipqw das', 'finance&administration', 0, '2024-02-21 14:13:37'),
(7, 'ochieng seth', 'ochseth04@gmail.com', '+256762644374', 'Uganda', 'http://localhost:5000/cvs/17085811968811805.06618.pdf', 'test online', 'volunteer', 0, '2024-02-22 05:53:16'),
(8, 'ochieng seth', 'ochseth04@gmail.com', '+256762644374', 'Uganda', 'http://localhost:5000/cvs/1708581277055cv - ada.docx', 'test online', 'volunteer', 0, '2024-02-22 05:54:37');

-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

CREATE TABLE `contact` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` longtext NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
   PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact`
--

INSERT INTO `contact` (`id`, `name`, `email`, `subject`, `message`, `createdAt`) VALUES
(1, 'ochieng seth', 'ochseth04@gmail.com', 'testing contact', 'this is a test message to contact form', '2024-02-21 07:23:18');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
   PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `tx_ref` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL,
  `donationType` varchar(255) NOT NULL,
  `currency` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `fullNames` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'initiated',
  `transactionId` varchar(255) DEFAULT NULL,
  `transactionSummary` longtext DEFAULT NULL,
  `transactionType` varchar(255) NOT NULL DEFAULT 'deposit',
  `transactionMethod` varchar(255) DEFAULT NULL,
  `otherNotes` longtext DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
   PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `tx_ref`, `amount`, `donationType`, `currency`, `email`, `fullNames`, `status`, `transactionId`, `transactionSummary`, `transactionType`, `transactionMethod`, `otherNotes`, `createdAt`, `updatedAt`) VALUES
(74, '1aeffc52-0e14-459a-ab3b-3a8493c70c9a', 5000, 'general', 'UGX', 'ochseth04@gmail.com', 'ochieng seth', 'successful', '4920983', '{\"id\":4920983,\"tx_ref\":\"1aeffc52-0e14-459a-ab3b-3a8493c70c9a\",\"flw_ref\":\"flwm3s4m0c1708422403491\",\"device_fingerprint\":\"N/A\",\"amount\":5000,\"currency\":\"UGX\",\"charged_amount\":5150,\"app_fee\":150,\"merchant_fee\":0,\"processor_response\":\"Transaction Successful\",\"auth_model\":\"MOBILEMONEY\",\"ip\":\"54.75.161.64\",\"narration\":\"jastTech\",\"status\":\"successful\",\"payment_type\":\"mobilemoneyug\",\"created_at\":\"2024-02-20T09:46:43.000Z\",\"account_id\":1746633,\"meta\":{\"__CheckoutInitAddress\":\"https://ravemodal-dev.herokuapp.com/v3/hosted/pay\",\"donationType\":\"general\"},\"amount_settled\":5000,\"customer\":{\"id\":2219350,\"name\":\"ochieng seth\",\"phone_number\":\"256704401316\",\"email\":\"ochseth04@gmail.com\",\"created_at\":\"2023-09-26T07:00:04.000Z\"}}', 'deposit', NULL, NULL, '2024-02-20 09:44:33', '2024-02-20 09:48:16'),
(75, '4e772ca6-5375-4793-ac52-841971902f8c', 8000, 'general', 'UGX', 'ochseth04@gmail.com', 'ochieng seth', 'initiated', NULL, NULL, 'deposit', NULL, NULL, '2024-02-20 12:26:45', NULL),
(76, 'c2c7024a-6c08-4133-8fa5-34e9ed81f9e1', 7000, 'general', 'UGX', 'ochseth04@gmail.com', 'ochieng seth', 'initiated', NULL, NULL, 'deposit', NULL, NULL, '2024-02-20 13:06:56', NULL),
(77, '1c178185-35d4-46ac-8306-ae368aee9679', 7000, 'general', 'UGX', 'ochseth04@gmail.com', 'ochieng seth', 'successful', '4921429', '{\"id\":4921429,\"tx_ref\":\"1c178185-35d4-46ac-8306-ae368aee9679\",\"flw_ref\":\"flwm3s4m0c1708434605592\",\"device_fingerprint\":\"N/A\",\"amount\":7000,\"currency\":\"UGX\",\"charged_amount\":7210,\"app_fee\":210,\"merchant_fee\":0,\"processor_response\":\"Transaction Successful\",\"auth_model\":\"MOBILEMONEY\",\"ip\":\"52.209.154.143\",\"narration\":\"jastTech\",\"status\":\"successful\",\"payment_type\":\"mobilemoneyug\",\"created_at\":\"2024-02-20T13:10:05.000Z\",\"account_id\":1746633,\"meta\":{\"__CheckoutInitAddress\":\"https://ravemodal-dev.herokuapp.com/v3/hosted/pay\",\"donationType\":\"general\"},\"amount_settled\":7000,\"customer\":{\"id\":1947659,\"name\":\"Ochieng Seth\",\"phone_number\":\"0704401316\",\"email\":\"ochseth04@gmail.com\",\"created_at\":\"2023-01-13T06:20:40.000Z\"}}', 'deposit', NULL, NULL, '2024-02-20 13:09:31', '2024-02-20 13:10:15'),
(78, '179ee615-1a43-43a5-898c-fcc83f37982c', 12000, 'health', 'UGX', 'ochseth04@gmail.com', 'ochieng seth', 'successful', '4921517', '{\"id\":4921517,\"tx_ref\":\"179ee615-1a43-43a5-898c-fcc83f37982c\",\"flw_ref\":\"flwm3s4m0c1708437449626\",\"device_fingerprint\":\"N/A\",\"amount\":12000,\"currency\":\"UGX\",\"charged_amount\":12360,\"app_fee\":360,\"merchant_fee\":0,\"processor_response\":\"Transaction Successful\",\"auth_model\":\"MOBILEMONEY\",\"ip\":\"54.75.161.64\",\"narration\":\"jastTech\",\"status\":\"successful\",\"payment_type\":\"mobilemoneyug\",\"created_at\":\"2024-02-20T13:57:29.000Z\",\"account_id\":1746633,\"meta\":{\"__CheckoutInitAddress\":\"https://ravemodal-dev.herokuapp.com/v3/hosted/pay\",\"donationType\":\"health\"},\"amount_settled\":12000,\"customer\":{\"id\":1947659,\"name\":\"Ochieng Seth\",\"phone_number\":\"0704401316\",\"email\":\"ochseth04@gmail.com\",\"created_at\":\"2023-01-13T06:20:40.000Z\"}}', 'deposit', NULL, NULL, '2024-02-20 13:56:53', '2024-02-20 13:57:40');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fullNames` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedBy` int(11) DEFAULT NULL
   PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullNames`, `email`, `password`, `status`, `createdAt`, `updatedBy`) VALUES
(2, 'ochieng seth', 'ochseth04@gmail.com', '$2a$10$RT4nkP51xgLDSVXKdiLlLONVc3RY7dAd3iaF1eQq8isoQcB7hsPKa', 1, '2024-02-19 10:46:55', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `wallet`
--

CREATE TABLE `wallet` (
  `id` int(11) NOT NULL,
  `currency` varchar(255) NOT NULL,
  `symbol` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL DEFAULT 0,
  `status` int(11) NOT NULL DEFAULT 1
   PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wallet`
--

INSERT INTO `wallet` (`id`, `currency`, `symbol`, `amount`, `status`) VALUES
(1, 'British Pound Sterling (GBP)', 'GBP', 0, 1),
(2, 'Canadian Dollar (CAD)', 'CAD', 0, 1),
(3, 'Central African CFA Franc (XAF)', 'XAF', 0, 1),
(4, 'Chilean Peso (CLP)', 'CLP', 0, 1),
(5, 'Colombian Peso (COP)', 'COP', 0, 1),
(6, 'Egyptian Pound (EGP)', 'EGP', 0, 1),
(7, 'Euro (EUR)', 'EUR', 0, 1),
(8, 'Ghanaian Cedi (GHS)', 'GHS', 0, 1),
(9, 'Guinean Franc (GNF)', 'GNF', 0, 1),
(10, 'Kenyan Shilling (KES)', 'KES', 0, 1),
(11, 'Malawian Kwacha (MWK)', 'MWK', 0, 1),
(12, 'Moroccan Dirham (MAD)', 'MAD', 0, 1),
(13, 'Nigerian Naira (NGN)', 'NGN', 0, 1),
(14, 'Rwandan Franc (RWF)', 'RWF', 0, 1),
(15, 'São Tomé and Príncipe dobra (STD)', 'STD', 0, 1),
(16, 'Sierra Leonean Leone (SLL)', 'SLL', 0, 1),
(17, 'South African Rand (ZAR)', 'ZAR', 0, 1),
(18, 'Tanzanian Shilling (TZS)', 'TZS', 0, 1),
(19, 'Ugandan Shilling (UGX)', 'UGX', 50000, 1),
(20, 'US Dollar (USD)', 'USD', 250, 1),
(21, 'West African CFA Franc BCEAO (XOF)', 'XOF', 0, 1),
(22, 'Zambian Kwacha (ZMW)', 'ZMW', 0, 1),
(23, 'Singapore Dollar (SGD)', 'SGD', 0, 1),
(24, 'Japanese Yen (JPY)', 'JPY', 0, 1),
(25, 'Indian Rupee (INR)', 'INR', 0, 1),
(26, 'Chinese Yuan (CNY)', 'CNY', 0, 1),
(27, 'Australian Dollar (AUD)', 'AUD', 0, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `careers`
--
ALTER TABLE `careers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wallet`
--
ALTER TABLE `wallet`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `careers`
--
ALTER TABLE `careers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `contact`
--
ALTER TABLE `contact`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `wallet`
--
ALTER TABLE `wallet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
