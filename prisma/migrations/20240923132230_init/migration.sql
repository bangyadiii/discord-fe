-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `provider_user_id` VARCHAR(191) NOT NULL,
    `profile_url` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_provider_user_id_key`(`provider_user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blocks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `blocker_id` VARCHAR(191) NOT NULL,
    `blocked_id` VARCHAR(191) NOT NULL,

    INDEX `blocks_blocked_id_idx`(`blocked_id`),
    UNIQUE INDEX `blocks_blocker_id_blocked_id_key`(`blocker_id`, `blocked_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `friend_request` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sender_id` VARCHAR(191) NOT NULL,
    `receiver_id` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL,

    INDEX `friend_request_sender_id_idx`(`sender_id`),
    INDEX `friend_request_receiver_id_idx`(`receiver_id`),
    UNIQUE INDEX `friend_request_receiver_id_sender_id_key`(`receiver_id`, `sender_id`),
    UNIQUE INDEX `friend_request_sender_id_receiver_id_key`(`sender_id`, `receiver_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servers` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `image_url` TEXT NOT NULL,
    `invite_code` VARCHAR(191) NOT NULL,
    `owner_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `servers_invite_code_key`(`invite_code`),
    INDEX `servers_owner_id_idx`(`owner_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `channel_categories` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `server_id` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `channel_categories_server_id_idx`(`server_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `channels` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('TEXT', 'VOICE') NOT NULL,
    `server_id` VARCHAR(191) NOT NULL,
    `category_id` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `channels_server_id_idx`(`server_id`),
    INDEX `channels_category_id_idx`(`category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `members` (
    `id` VARCHAR(191) NOT NULL,
    `role` ENUM('OWNER', 'ADMIN', 'MEMBER', 'GUEST') NOT NULL DEFAULT 'MEMBER',
    `user_id` VARCHAR(191) NOT NULL,
    `server_id` VARCHAR(191) NOT NULL,
    `joined_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `left_at` DATETIME(3) NULL,

    INDEX `members_user_id_idx`(`user_id`),
    INDEX `members_server_id_idx`(`server_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `messages` (
    `id` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `file_url` TEXT NULL,
    `channel_id` VARCHAR(191) NOT NULL,
    `member_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `messages_channel_id_idx`(`channel_id`),
    INDEX `messages_member_id_idx`(`member_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `conversations` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `last_message_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `is_group` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_conversations` (
    `conversation_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `left_at` DATETIME(3) NULL,
    `muted_until` DATETIME(3) NULL,

    INDEX `user_conversations_conversation_id_idx`(`conversation_id`),
    INDEX `user_conversations_user_id_idx`(`user_id`),
    PRIMARY KEY (`conversation_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `direct_messages` (
    `id` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `file_url` TEXT NULL,
    `sender_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `read_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,
    `conversation_id` VARCHAR(191) NOT NULL,

    INDEX `direct_messages_sender_id_idx`(`sender_id`),
    INDEX `direct_messages_conversation_id_idx`(`conversation_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
