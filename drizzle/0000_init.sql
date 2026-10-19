CREATE TABLE `addresses` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`label` varchar(60) NOT NULL DEFAULT '',
	`recipient_name` varchar(120) NOT NULL,
	`recipient_phone` varchar(30) NOT NULL,
	`company` varchar(120),
	`street` varchar(200) NOT NULL,
	`apt` varchar(60),
	`city` varchar(80) NOT NULL,
	`state` varchar(2) NOT NULL,
	`zip` varchar(10) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `addresses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `coupons` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`code` varchar(40) NOT NULL,
	`description` varchar(200) NOT NULL DEFAULT '',
	`type` varchar(16) NOT NULL,
	`value` int NOT NULL DEFAULT 0,
	`min_subtotal` int NOT NULL DEFAULT 0,
	`max_uses` int,
	`used_count` int NOT NULL DEFAULT 0,
	`starts_at` datetime,
	`ends_at` datetime,
	`active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `coupons_id` PRIMARY KEY(`id`),
	CONSTRAINT `coupons_code_uq` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`email` varchar(190) NOT NULL,
	`name` varchar(120) NOT NULL,
	`phone` varchar(30),
	`password_hash` varchar(100) NOT NULL,
	`marketing_opt_in` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `customers_id` PRIMARY KEY(`id`),
	CONSTRAINT `customers_email_uq` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`email` varchar(190) NOT NULL,
	`phone` varchar(30),
	`topic` varchar(60) NOT NULL DEFAULT 'General',
	`order_code` varchar(20),
	`body` text NOT NULL,
	`handled` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`order_id` int NOT NULL,
	`product_id` int,
	`slug` varchar(160) NOT NULL,
	`name` varchar(200) NOT NULL,
	`image` varchar(255),
	`size` varchar(20) NOT NULL DEFAULT 'standard',
	`size_label` varchar(40) NOT NULL DEFAULT 'Standard',
	`add_ons` json NOT NULL,
	`unit_price` int NOT NULL,
	`quantity` int NOT NULL,
	`line_total` int NOT NULL,
	CONSTRAINT `order_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`code` varchar(20) NOT NULL,
	`access_token` varchar(48) NOT NULL,
	`customer_id` int,
	`status` varchar(24) NOT NULL DEFAULT 'pending_payment',
	`payment_status` varchar(16) NOT NULL DEFAULT 'unpaid',
	`sender_name` varchar(120) NOT NULL,
	`sender_email` varchar(190) NOT NULL,
	`sender_phone` varchar(30) NOT NULL,
	`recipient_name` varchar(120) NOT NULL,
	`recipient_phone` varchar(30) NOT NULL,
	`company` varchar(120),
	`address_type` varchar(20) NOT NULL DEFAULT 'residence',
	`street` varchar(200) NOT NULL,
	`apt` varchar(60),
	`city` varchar(80) NOT NULL,
	`state` varchar(2) NOT NULL,
	`zip` varchar(10) NOT NULL,
	`delivery_date` date NOT NULL,
	`delivery_window` varchar(20) NOT NULL DEFAULT 'anytime',
	`card_message` text,
	`card_signature` varchar(120),
	`instructions` text,
	`subtotal` int NOT NULL,
	`delivery_fee` int NOT NULL DEFAULT 0,
	`same_day_fee` int NOT NULL DEFAULT 0,
	`discount` int NOT NULL DEFAULT 0,
	`tax` int NOT NULL DEFAULT 0,
	`total` int NOT NULL,
	`coupon_code` varchar(40),
	`stripe_session_id` varchar(255),
	`stripe_payment_intent` varchar(255),
	`admin_note` text,
	`paid_at` datetime,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_code_uq` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`slug` varchar(160) NOT NULL,
	`title` varchar(200) NOT NULL,
	`excerpt` varchar(400) NOT NULL DEFAULT '',
	`content` mediumtext NOT NULL,
	`cover` varchar(255),
	`category` varchar(60) NOT NULL DEFAULT 'Flower Guides',
	`author` varchar(80) NOT NULL DEFAULT 'FlowerVsFlorist Team',
	`status` varchar(12) NOT NULL DEFAULT 'published',
	`seo_title` varchar(200),
	`seo_description` varchar(300),
	`published_at` datetime NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `posts_slug_uq` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`slug` varchar(160) NOT NULL,
	`name` varchar(200) NOT NULL,
	`price` int NOT NULL,
	`compare_at` int,
	`short` varchar(300) NOT NULL DEFAULT '',
	`description` text NOT NULL,
	`includes` json NOT NULL,
	`categories` json NOT NULL,
	`colors` json NOT NULL,
	`images` json NOT NULL,
	`same_day` boolean NOT NULL DEFAULT true,
	`best_seller` boolean NOT NULL DEFAULT false,
	`featured` boolean NOT NULL DEFAULT false,
	`has_sizes` boolean NOT NULL DEFAULT true,
	`badge` varchar(40),
	`active` boolean NOT NULL DEFAULT true,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_uq` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`product_id` int NOT NULL,
	`name` varchar(80) NOT NULL,
	`email` varchar(190),
	`rating` tinyint NOT NULL,
	`title` varchar(120) NOT NULL DEFAULT '',
	`body` text NOT NULL,
	`approved` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscribers` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`email` varchar(190) NOT NULL,
	`source` varchar(40) NOT NULL DEFAULT 'footer',
	`unsubscribed` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `subscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscribers_email_uq` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `wishlist` (
	`customer_id` int NOT NULL,
	`product_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wishlist_customer_id_product_id_pk` PRIMARY KEY(`customer_id`,`product_id`)
);
--> statement-breakpoint
CREATE INDEX `addresses_customer_idx` ON `addresses` (`customer_id`);--> statement-breakpoint
CREATE INDEX `order_items_order_idx` ON `order_items` (`order_id`);--> statement-breakpoint
CREATE INDEX `orders_customer_idx` ON `orders` (`customer_id`);--> statement-breakpoint
CREATE INDEX `orders_email_idx` ON `orders` (`sender_email`);--> statement-breakpoint
CREATE INDEX `orders_session_idx` ON `orders` (`stripe_session_id`);--> statement-breakpoint
CREATE INDEX `posts_status_idx` ON `posts` (`status`,`published_at`);--> statement-breakpoint
CREATE INDEX `reviews_product_idx` ON `reviews` (`product_id`,`approved`);