CREATE DATABASE  IF NOT EXISTS `mydb` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `mydb`;
-- MySQL dump 10.13  Distrib 8.0.34, for macos13 (x86_64)
--
-- Host: jcmg-api.mysql.database.azure.com    Database: mydb
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `COURSE_ID` int NOT NULL AUTO_INCREMENT,
  `COURSE_NAME` varchar(255) NOT NULL,
  `CATEGORY_TYPE` varchar(45) DEFAULT NULL,
  `COURSE_TAGS` set('Budgeting','Investing','DebtManagement','RetirementPlanning','TaxBasics','CreditScore','Insurance','FinancialGoals','EmergencyFunds','HomeOwnership') DEFAULT NULL,
  `COURSE_THUMBNAIL` varchar(255) DEFAULT NULL,
  `COURSE_LASTUPDATED` datetime DEFAULT NULL,
  PRIMARY KEY (`COURSE_ID`),
  UNIQUE KEY `COURSE_ID_UNIQUE` (`COURSE_ID`),
  UNIQUE KEY `COURSE_NAME_UNIQUE` (`COURSE_NAME`)
) ENGINE=InnoDB AUTO_INCREMENT=189 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `course_registration`
--

DROP TABLE IF EXISTS `course_registration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_registration` (
  `registration_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `course_id` int NOT NULL,
  `enrolled` tinyint(1) DEFAULT '0',
  `completion_date` datetime DEFAULT NULL,
  `expiration_date` datetime DEFAULT NULL,
  PRIMARY KEY (`registration_id`),
  KEY `user_id` (`user_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `course_registration_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `course_registration_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `course` (`COURSE_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `forum`
--

DROP TABLE IF EXISTS `forum`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forum` (
  `ForumID` int NOT NULL AUTO_INCREMENT,
  `ForumTitle` varchar(255) NOT NULL,
  `DateCreated` datetime NOT NULL,
  `CreatorID` int NOT NULL,
  `CourseID` int DEFAULT NULL,
  PRIMARY KEY (`ForumID`),
  KEY `CreatorID` (`CreatorID`),
  CONSTRAINT `forum_ibfk_1` FOREIGN KEY (`CreatorID`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=261 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `forumcomments`
--

DROP TABLE IF EXISTS `forumcomments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forumcomments` (
  `CommentID` int NOT NULL AUTO_INCREMENT,
  `Body` text NOT NULL,
  `DateCommented` datetime NOT NULL,
  `UserID` int NOT NULL,
  `ForumID` int NOT NULL,
  PRIMARY KEY (`CommentID`),
  KEY `UserID` (`UserID`),
  KEY `ForumID` (`ForumID`),
  CONSTRAINT `forumcomments_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`id`),
  CONSTRAINT `forumcomments_ibfk_2` FOREIGN KEY (`ForumID`) REFERENCES `forum` (`ForumID`)
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lecture`
--

DROP TABLE IF EXISTS `lecture`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lecture` (
  `LECTURE_ID` int NOT NULL AUTO_INCREMENT,
  `LECTURE_NAME` varchar(255) NOT NULL,
  `MODULE_ID` int DEFAULT NULL,
  `LECTURE_ORDER` int DEFAULT NULL,
  PRIMARY KEY (`LECTURE_ID`),
  KEY `MODULE_ID` (`MODULE_ID`),
  CONSTRAINT `lecture_ibfk_1` FOREIGN KEY (`MODULE_ID`) REFERENCES `module` (`MODULE_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=199 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lecture_content`
--

DROP TABLE IF EXISTS `lecture_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lecture_content` (
  `LECTURE_CONTENT_ID` int NOT NULL AUTO_INCREMENT,
  `LECTURE_ID` int NOT NULL,
  `MATERIAL_ID` int NOT NULL,
  `MATERIAL_ORDER` int DEFAULT NULL COMMENT 'IF LECTURE = 2, AND MATERIAL_ID = 3, AND MATERIAL_ORDER = 5,\n\nIN LECTURE 2, MATERIAL 3 WILL BE THE 5TH ITEM SHOWN.\n\n\n',
  PRIMARY KEY (`LECTURE_CONTENT_ID`),
  KEY `LECTURE_ID` (`LECTURE_ID`),
  KEY `MATERIAL_ID` (`MATERIAL_ID`),
  CONSTRAINT `lecture_content_ibfk_1` FOREIGN KEY (`LECTURE_ID`) REFERENCES `lecture` (`LECTURE_ID`),
  CONSTRAINT `lecture_content_ibfk_2` FOREIGN KEY (`MATERIAL_ID`) REFERENCES `material` (`MATERIAL_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=172 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `material`
--

DROP TABLE IF EXISTS `material`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material` (
  `MATERIAL_ID` int NOT NULL AUTO_INCREMENT,
  `MATERIAL_NAME` varchar(255) NOT NULL,
  `MATERIAL_URL` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`MATERIAL_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=192 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `module`
--

DROP TABLE IF EXISTS `module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `module` (
  `MODULE_ID` int NOT NULL AUTO_INCREMENT,
  `COURSE_ID` int NOT NULL,
  `MODULE_NAME` varchar(45) NOT NULL,
  `MODULE_ORDER` int DEFAULT NULL,
  PRIMARY KEY (`MODULE_ID`),
  KEY `COURSE_ID` (`COURSE_ID`),
  CONSTRAINT `module_ibfk_1` FOREIGN KEY (`COURSE_ID`) REFERENCES `course` (`COURSE_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=163 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `quiz`
--

DROP TABLE IF EXISTS `quiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz` (
  `QUIZ_ID` int NOT NULL AUTO_INCREMENT,
  `QUIZ_NAME` varchar(255) NOT NULL,
  `MODULE_ID` int DEFAULT NULL,
  `QUESTION_ORDER` json DEFAULT NULL COMMENT 'TO BE REMOVED',
  `QUIZ_MAXTRIES` int DEFAULT NULL,
  PRIMARY KEY (`QUIZ_ID`),
  UNIQUE KEY `QUIZ_ID_UNIQUE` (`QUIZ_ID`),
  KEY `MODULE_ID` (`MODULE_ID`),
  CONSTRAINT `quiz_ibfk_1` FOREIGN KEY (`MODULE_ID`) REFERENCES `module` (`MODULE_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `quiz_question`
--

DROP TABLE IF EXISTS `quiz_question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz_question` (
  `QUESTION_ID` int NOT NULL AUTO_INCREMENT,
  `QUESTION_TEXT` varchar(255) DEFAULT NULL,
  `QUESTION_OPTION` json DEFAULT NULL,
  `QUESTION_ANSWER` varchar(255) DEFAULT NULL,
  `QUIZ_ID` int DEFAULT NULL,
  `QUESTION_ORDER` int DEFAULT NULL COMMENT 'If quiz_id is 1, and question_order is 1, this means that this is the first question in quiz_id 1.\\n\\nIf quiz id is 3, and question order is 5, this means that this is the fifth question in quiz_id 3.',
  PRIMARY KEY (`QUESTION_ID`),
  KEY `QUIZ_ID` (`QUIZ_ID`),
  CONSTRAINT `quiz_question_ibfk_1` FOREIGN KEY (`QUIZ_ID`) REFERENCES `quiz` (`QUIZ_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=255 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `quizzes_attempted`
--

DROP TABLE IF EXISTS `quizzes_attempted`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quizzes_attempted` (
  `registration_id` int NOT NULL,
  `quiz_id` int NOT NULL,
  `score` float NOT NULL,
  `attempts` int NOT NULL,
  `feedback` text,
  PRIMARY KEY (`registration_id`,`quiz_id`),
  KEY `quiz_id` (`quiz_id`),
  CONSTRAINT `quizzes_attempted_ibfk_1` FOREIGN KEY (`registration_id`) REFERENCES `course_registration` (`registration_id`),
  CONSTRAINT `quizzes_attempted_ibfk_2` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`QUIZ_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT '0',
  `interests` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=114 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-10-20 14:08:04
CREATE DATABASE  IF NOT EXISTS `userdb` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `userdb`;
-- MySQL dump 10.13  Distrib 8.0.34, for macos13 (x86_64)
--
-- Host: jcmg-api.mysql.database.azure.com    Database: userdb
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `my_row_id` bigint unsigned NOT NULL AUTO_INCREMENT /*!80023 INVISIBLE */,
  `id` int DEFAULT NULL,
  `email` text,
  `password_hash` text,
  `first_name` text,
  `last_name` text,
  `is_admin` int DEFAULT NULL,
  `interests` text,
  PRIMARY KEY (`my_row_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-10-20 14:08:06
