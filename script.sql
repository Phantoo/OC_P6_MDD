CREATE TABLE `USERS` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `username` VARCHAR(255) UNIQUE NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `created_at` DATETIME,
  `updated_at` DATETIME
);

CREATE TABLE `SUBJECTS` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE `USER_SUBJECTS` (
  `user_id` INT NOT NULL, 
  `subject_id` INT NOT NULL,

  PRIMARY KEY(user_id, subject_id),
  FOREIGN KEY (`user_id`) REFERENCES `USERS` (`id`),
  FOREIGN KEY (`subject_id`) REFERENCES `SUBJECTS` (`id`)
);

CREATE TABLE `ARTICLES` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `author_id` INT NOT NULL,
  `subject_id` INT NOT NULL,
  `created_at` DATETIME,

  FOREIGN KEY (`author_id`) REFERENCES `USERS` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`subject_id`) REFERENCES `SUBJECTS` (`id`) ON DELETE CASCADE
);

CREATE TABLE `COMMENTS` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `content` TEXT NOT NULL,
  `author_id` INT NOT NULL,
  `article_id` INT NOT NULL,
  `created_at` DATETIME,

  FOREIGN KEY (`author_id`) REFERENCES `USERS` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`article_id`) REFERENCES `ARTICLES` (`id`) ON DELETE CASCADE
);