SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE TABLE `nutrients` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `ml` int(11) UNSIGNED NOT NULL DEFAULT 0,
  `frequency` int(11) UNSIGNED NOT NULL DEFAULT 0,
  `calibration` int(11) UNSIGNED NOT NULL DEFAULT 1500,
  `last_dose` datetime(6) NOT NULL DEFAULT '1970-01-01 12:00:00.000000',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `nutrients` (`id`, `name`, `ml`, `frequency`, `calibration`, `last_dose`) VALUES
(0, 'PH Up', 0, 0, 1500, '1970-01-01 12:00:00.000000'),
(1, 'PH Down', 0, 0, 1500, '1970-01-01 12:00:00.000000'),
(2, 'Nutrient A', 0, 0, 1500, '1970-01-01 12:00:00.000000'),
(3, 'Nutrient B', 0, 0, 1500, '1970-01-01 12:00:00.000000'),
(4, 'Nutrient C', 0, 0, 1500, '1970-01-01 12:00:00.000000'),
(5, 'Nutrient D', 0, 0, 1500, '1970-01-01 12:00:00.000000'),
(6, 'Nutrient E', 0, 0, 1500, '1970-01-01 12:00:00.000000'),
(7, 'Nutrient F', 0, 0, 1500, '1970-01-01 12:00:00.000000');

CREATE TABLE `stages` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `lights_on` int(11) UNSIGNED NOT NULL DEFAULT 0,
  `lights_off` int(11) UNSIGNED NOT NULL DEFAULT 0,
  `max_humidity` int(11) UNSIGNED NOT NULL DEFAULT 0,
  `ec_target_low` int(11) UNSIGNED NOT NULL DEFAULT 0,
  `ec_target_high` int(11) UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;