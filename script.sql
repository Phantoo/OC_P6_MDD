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

////// DEMO DATA - DO NOT INSERT ////////

// Test!1234
INSERT INTO USERS (username, email, password) VALUES ('Phanto', 'test@test.com', '$2a$10$wuwX6lp9emPfU9OeAHMmYObLHQnNT3V9vGY8juSkkPpuN70asUGuO'); 


INSERT INTO ARTICLES (`id`, `title`, `content`, `author_id`, `subject_id`, `created_at`) VALUES (1, "Le C# c'est vachement cool", 'ouais ouais ouais', 1, 3, NOW());

INSERT INTO COMMENTS (`id`, `content`, `author_id`, `article_id`, `created_at`) VALUES (1, 'Ouais trop raison', 1, 1, NOW());

INSERT INTO ARTICLE_COMMENTS (`article_id`, `comment_id`) VALUES (1, 1);