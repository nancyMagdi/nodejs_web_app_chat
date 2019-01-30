-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jan 30, 2019 at 08:55 PM
-- Server version: 5.7.24-0ubuntu0.16.04.1
-- PHP Version: 7.0.32-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `node_web_app_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `chats_history`
--

CREATE TABLE `chats_history` (
  `Id` bigint(20) NOT NULL,
  `ChatThreadId` bigint(20) NOT NULL,
  `MessageText` text NOT NULL,
  `FromUserId` bigint(20) NOT NULL,
  `ToUserId` bigint(20) NOT NULL,
  `CreationDateTime` datetime NOT NULL,
  `AttachementLocation` varchar(300) DEFAULT NULL,
  `IsRead` tinyint(4) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `chats_history`
--


-- --------------------------------------------------------

--
-- Table structure for table `chat_threads`
--

CREATE TABLE `chat_threads` (
  `Id` bigint(20) NOT NULL,
  `FirstUserId` bigint(20) NOT NULL,
  `SecondUserId` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `chat_threads`
--


-- --------------------------------------------------------

--
-- Table structure for table `contacts_list`
--

CREATE TABLE `contacts_list` (
  `Id` bigint(20) NOT NULL,
  `FirstUserId` bigint(20) NOT NULL,
  `SecondUserId` bigint(20) NOT NULL,
  `isConnected` tinyint(2) NOT NULL COMMENT '0 for not-connected and 1 for connected'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `contacts_list`
--


-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `Id` bigint(20) UNSIGNED NOT NULL,
  `FullName` varchar(200) NOT NULL,
  `Username` varchar(200) NOT NULL,
  `Password` varchar(150) NOT NULL,
  `Image` varchar(300) DEFAULT NULL,
  `Status` tinyint(2) NOT NULL DEFAULT '0' COMMENT '0 for offline and 1 for online',
  `SocketId` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chats_history`
--
ALTER TABLE `chats_history`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `chat_threads`
--
ALTER TABLE `chat_threads`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `contacts_list`
--
ALTER TABLE `contacts_list`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `usernameUnique` (`Username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chats_history`
--
ALTER TABLE `chats_history`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
--
-- AUTO_INCREMENT for table `chat_threads`
--
ALTER TABLE `chat_threads`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `contacts_list`
--
ALTER TABLE `contacts_list`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `Id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
