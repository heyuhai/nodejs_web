SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for nj_user
-- ----------------------------
DROP TABLE IF EXISTS `nj_user`;
CREATE TABLE `nj_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL DEFAULT '',
  `password` varchar(32) NOT NULL DEFAULT '',
  `dateline` int(13) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of nj_user
-- ----------------------------
INSERT INTO `nj_user` VALUES ('1', 'yagni', '123456', '0');
