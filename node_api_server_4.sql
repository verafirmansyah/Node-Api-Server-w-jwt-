/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 100109
Source Host           : localhost:3306
Source Database       : node_api_server_4

Target Server Type    : MYSQL
Target Server Version : 100109
File Encoding         : 65001

Date: 2017-08-17 18:58:19
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for user_login
-- ----------------------------
DROP TABLE IF EXISTS `user_login`;
CREATE TABLE `user_login` (
  `user_id` int(70) NOT NULL AUTO_INCREMENT,
  `user_email` varchar(45) NOT NULL,
  `user_password` varchar(45) DEFAULT NULL,
  `user_join_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_email_UNIQUE` (`user_email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of user_login
-- ----------------------------
INSERT INTO `user_login` VALUES ('2', 'verafirmansyah.online@gmail.com', '$2a$10$t/AxAHcKS9.sy2cWdi22TO8K7BAoSDq.ffMe.D', '2017-08-16 14:55:50');
INSERT INTO `user_login` VALUES ('3', 'a@a.com', '21232f297a57a5a743894a0e4a801fc3', '2017-08-17 10:30:03');
