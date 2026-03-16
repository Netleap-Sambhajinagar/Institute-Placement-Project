-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: nits
-- ------------------------------------------------------
-- Server version	8.0.45

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
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (2,'Admin','admin@nits.com','$2b$10$t/IXbl6s2o7JjvJ1ujXg0e7iG8jo7hvdWJ/lKPIW18mY0yM.QxIO.','2026-03-15 07:26:30','2026-03-15 07:26:30'),(3,'Shridhar','shridhar@nits.com','$2b$10$w4kto28bQZBpqM6NJPfR0eEAHMy/yidmJKud8Rs1Hzy8XTSlmWN7.','2026-03-15 07:27:51','2026-03-15 07:27:51');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_enrollments`
--

DROP TABLE IF EXISTS `course_enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_enrollments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `studentId` int NOT NULL,
  `courseId` int NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `enrolledAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_course_enrollments_student_course` (`studentId`,`courseId`),
  KEY `fk_course_enrollments_course` (`courseId`),
  CONSTRAINT `fk_course_enrollments_course` FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_course_enrollments_student` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_enrollments`
--

LOCK TABLES `course_enrollments` WRITE;
/*!40000 ALTER TABLE `course_enrollments` DISABLE KEYS */;
INSERT INTO `course_enrollments` VALUES (6,3,1,'active','2026-03-15 05:53:13','2026-03-15 05:53:13','2026-03-15 05:53:13'),(7,3,2,'active','2026-03-15 06:31:06','2026-03-15 06:31:06','2026-03-15 06:31:06'),(8,3,4,'active','2026-03-16 07:33:58','2026-03-16 07:33:58','2026-03-16 07:33:58'),(9,6,1,'active','2026-03-16 08:49:04','2026-03-16 08:49:04','2026-03-16 08:49:04');
/*!40000 ALTER TABLE `course_enrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `level` varchar(255) NOT NULL,
  `instructor` varchar(255) NOT NULL,
  `img` varchar(255) DEFAULT NULL,
  `duration` int NOT NULL,
  `branch` varchar(255) NOT NULL,
  `overview` text NOT NULL,
  `what_you_will_learn` text,
  `course_features` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,'Full Stack Web Development','Beginner','Sarah Jenkins','https://images.unsplash.com/photo-1498050108023-c5249f4df085',9,'General','A practical course covering frontend, backend, and deployment.','HTML, CSS, JavaScript, React, Node.js, Express, MySQL','Live classes, projects, certificate, interview prep','2026-03-14 19:43:49','2026-03-15 08:28:27','Active'),(2,'Full Stack Web Development','Beginner','Sarah Jenkins','https://images.unsplash.com/photo-1498050108023-c5249f4df085',12,'Computer Science','A practical course covering frontend, backend, and deployment.','HTML, CSS, JavaScript, React, Node.js, Express, MySQL','Live classes, projects, certificate, interview prep','2026-03-14 19:44:22','2026-03-14 19:44:22','Active'),(3,'Cloud Computing with AWS','Advanced','Neha Kapoor','https://images.unsplash.com/photo-1451187580459-43490279c0fa',8,'Information Technology','Deploy scalable applications and services on AWS using real-world architecture patterns.','EC2, S3, IAM, Lambda, VPC, deployment pipelines','Hands-on labs, architecture case studies, project deployment','2026-03-14 19:44:29','2026-03-14 19:44:29','Active'),(4,'DevOps and CI/CD Pipeline','Intermediate','Vikram Rao','https://images.unsplash.com/photo-1461749280684-dccba630e2f6',9,'Computer Science','Learn to automate build, test, and deployment workflows for modern software teams.','GitHub Actions, Docker, Jenkins, Kubernetes basics, monitoring','Pipeline templates, deployment practice, troubleshooting sessions','2026-03-14 19:44:36','2026-03-14 19:44:36','Active');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `interns`
--

DROP TABLE IF EXISTS `interns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interns` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category` varchar(255) NOT NULL,
  `stipend` int DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `status` varchar(255) NOT NULL,
  `internshipId` int DEFAULT NULL,
  `studentId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_interns_internship` (`internshipId`),
  KEY `fk_interns_student` (`studentId`),
  CONSTRAINT `fk_interns_internship` FOREIGN KEY (`internshipId`) REFERENCES `internships` (`id`),
  CONSTRAINT `fk_interns_student` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interns`
--

LOCK TABLES `interns` WRITE;
/*!40000 ALTER TABLE `interns` DISABLE KEYS */;
INSERT INTO `interns` VALUES (2,'free',NULL,'2026-03-15 00:00:00','2026-04-11 00:00:00','active',1,3,'2026-03-15 05:54:08','2026-03-15 05:54:08'),(88,'paid',20000,'2026-03-15 00:00:00','2026-06-15 00:00:00','active',2,3,'2026-03-15 12:12:50','2026-03-15 12:12:50'),(89,'paid',15000,'2026-03-17 00:00:00','2026-05-17 00:00:00','active',1,6,'2026-03-16 08:49:33','2026-03-16 08:49:33');
/*!40000 ALTER TABLE `interns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `internships`
--

DROP TABLE IF EXISTS `internships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `internships` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `duration` int NOT NULL,
  `stipend` int DEFAULT NULL,
  `work_type` varchar(255) NOT NULL,
  `branch` varchar(255) NOT NULL,
  `description` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `category` varchar(255) NOT NULL DEFAULT 'UNPAID',
  `status` varchar(255) NOT NULL DEFAULT 'Open',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `internships`
--

LOCK TABLES `internships` WRITE;
/*!40000 ALTER TABLE `internships` DISABLE KEYS */;
INSERT INTO `internships` VALUES (1,'Web Development Intern',2,15000,'Remote','NITS Sambhajinagar','Work on building and maintaining web applications using React and Node.js. You will collaborate with senior developers on real client projects.','2026-03-14 20:06:25','2026-03-15 11:58:46','PAID','Open'),(2,'Data Analytics Intern',3,20000,'Bengaluru, Karnataka','NITS Sambhajinagar','Analyze large datasets using Python and SQL. Build dashboards and reports to support business decision-making at a fast-growing startup.','2026-03-14 20:06:45','2026-03-14 20:06:45','PAID','Open'),(4,'Machine Learning Intern',4,25000,'Hyderabad, Telangana','NITS Sambhajinagar','Train and deploy ML models for NLP and computer vision use cases. Work with PyTorch, HuggingFace, and cloud-based GPU infrastructure.','2026-03-14 20:06:57','2026-03-14 20:06:57','PAID','Open');
/*!40000 ALTER TABLE `internships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `position` varchar(255) NOT NULL,
  `company` varchar(255) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `location` varchar(255) NOT NULL,
  `salary` varchar(255) DEFAULT NULL,
  `description` text,
  `requirements` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `jobURL` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
INSERT INTO `jobs` VALUES (1,'Frontend Developer','Infosys','https://logo.clearbit.com/infosys.com','Bengaluru','6-8 LPA','Build and maintain responsive React web applications.','React, JavaScript, HTML, CSS, REST API, Git','2026-03-14 19:52:57','2026-03-14 19:52:57',NULL),(2,'Frontend Developer','Flipkart','https://logo.clearbit.com/flipkart.com','Bengaluru, Karnataka','18 LPA','Build and maintain high-performance React applications for Flipkart\'s e-commerce platform serving millions of users.','React.js, TypeScript, Redux, REST APIs, Git. 0-2 years experience. B.Tech/B.E. in CS or related field.','2026-03-14 19:55:29','2026-03-14 19:55:29',NULL),(3,'Data Scientist','Walmart Global Tech','https://logo.clearbit.com/walmart.com','Bengaluru, Karnataka','22 LPA','Develop ML models and data pipelines to optimize supply chain, pricing, and customer personalization at scale.','Python, Scikit-learn, TensorFlow or PyTorch, SQL, Spark. Strong stats background. M.Tech or B.Tech with strong ML coursework.','2026-03-14 19:55:35','2026-03-14 19:55:35',NULL),(4,'DevOps Engineer','Razorpay','https://logo.clearbit.com/razorpay.com','Bengaluru, Karnataka','20 LPA','Manage CI/CD pipelines, cloud infrastructure, and deployment automation for India\'s leading payments platform.','Kubernetes, Docker, AWS or GCP, Terraform, Jenkins, Linux. B.Tech in CS/IT. 0-2 years experience.','2026-03-14 19:55:42','2026-03-14 19:55:42',NULL),(5,'Backend Engineer','Zomato','https://logo.clearbit.com/zomato.com','Gurugram, Haryana','17 LPA','Design and scale microservices powering Zomato\'s food delivery and restaurant discovery features for 100M+ users.','Node.js or Go, MySQL, Redis, Kafka, REST and gRPC. B.Tech in CS/ECE. Competitive programming background preferred.','2026-03-14 19:55:50','2026-03-14 19:55:50',NULL),(6,'Embedded Systems Engineer','Texas Instruments','https://logo.clearbit.com/ti.com','Bengaluru, Karnataka','14 LPA','Develop firmware and low-level drivers for TI\'s DSP and microcontroller product lines used in automotive and industrial applications.','C/C++, ARM Cortex, RTOS (FreeRTOS/AUTOSAR), CAN/SPI/I2C protocols, oscilloscope debugging. B.Tech/M.Tech in ECE or EE.','2026-03-14 19:55:57','2026-03-14 19:55:57',NULL),(7,'Backend Developer','Amazon','https://cdn.example.com/company-logo.png','Hyderabad','20-30 LPA','Build and maintain scalable backend services.','Node.js, Express, MySQL, REST APIs','2026-03-15 06:59:39','2026-03-15 07:31:43','https://careers.amazon.com/job/123');
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `placedstudents`
--

DROP TABLE IF EXISTS `placedstudents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `placedstudents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `company` varchar(255) NOT NULL,
  `position` varchar(255) NOT NULL,
  `salary` int DEFAULT NULL,
  `placementDate` datetime NOT NULL,
  `img` varchar(255) DEFAULT NULL,
  `studentId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_placedStudents_student` (`studentId`),
  CONSTRAINT `fk_placedStudents_student` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `placedstudents`
--

LOCK TABLES `placedstudents` WRITE;
/*!40000 ALTER TABLE `placedstudents` DISABLE KEYS */;
/*!40000 ALTER TABLE `placedstudents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `password` varchar(255) NOT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `DOB` datetime DEFAULT NULL,
  `education` varchar(255) DEFAULT NULL,
  `college` varchar(255) DEFAULT NULL,
  `domain` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (3,'shubham kakade','shubhamkakade151@gmail.com','7020505333','$2b$10$B9QImmzYfvMup2z2fEq4WOz0zko42ySJXuVXSDLt5lgaNwfIAdcc6','Male','2000-12-22 00:00:00','BCA','NITS','Full Stack Development','2026-03-15 05:51:25','2026-03-15 05:51:25'),(4,'ecommerce','demo@gmail.com','9898989898','$2b$10$YsqkwxWW7a/Jwt53ssiq0.imVWswPCI79ftZBA7NjxKjBRncvoS5S','Other','2000-12-22 00:00:00','BCA','NITS','web dev','2026-03-15 07:51:22','2026-03-15 07:51:22'),(5,'shailesh','shaileshbhanuse@gmail.com','7498736607','$2b$10$GRxS/Wwd5DI3W5lMgb1IqOiOQpScCiE7hdEZBLYhtS70br/8AcNYm','Male','2006-03-12 00:00:00','BCA','Vasantrao Naik Mahavidyalaya','Full Stack Development','2026-03-16 07:38:46','2026-03-16 07:38:46'),(6,'shridhar Bokil','shridharpbokil007@gmail.com','9975151401','$2b$10$RGmXdDUU/pxoBurSXjhgsuUyVylgabims.GetghHAffd/XQXRe1UC','Male','2004-11-24 00:00:00','BCA','Vasantrao Naik Mahavidyalaya','Full Stack Development','2026-03-16 08:48:46','2026-03-16 08:48:46');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-16 15:33:53
