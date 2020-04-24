SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE TABLE `settings` (
  `id` int(11) UNSIGNED NOT NULL,
  `current` int(11) UNSIGNED NOT NULL,
  `capacity` int(11) UNSIGNED NOT NULL,
  `automate_humidity` varchar(255) NOT NULL,
  `automate_ph` varchar(255) NOT NULL,
  `ph_min` int(11) UNSIGNED NOT NULL,
  `ph_max` int(11) UNSIGNED NOT NULL,
  `automate_temp` varchar(255) NOT NULL,
  `temp_min` int(11) UNSIGNED NOT NULL,
  `temp_max` int(11) UNSIGNED NOT NULL,
  `automate_water_level` varchar(255) NOT NULL,
  `water_level_min` int(11) UNSIGNED NOT NULL,
  `water_level_max` int(11) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `settings` (`id`, `current`, `capacity`, `automate_humidity`, `automate_ph`, `ph_min`, `ph_max`, `automate_temp`, `temp_min`, `temp_max`, `automate_water_level`, `water_level_min`, `water_level_max`) VALUES
(0, 0, 0, 'false', 'false', 5.5, 6.5, 'false', 20, 25, 'false', 0, 0);


CREATE TABLE `nutrients` (
  `id` int(11) UNSIGNED NOT NULL,
  `tag` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `calibration` int(11) UNSIGNED NOT NULL,
  `last_dose` datetime(6) NOT NULL DEFAULT '1970-01-01 12:00:00.000000',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `nutrients` (`id`, `tag`, `name`, `calibration`, `last_dose`) VALUES
(0, 'ph_up', 'PH Up', 1500, '1970-01-01 12:00:00.000000'),
(1, 'ph_down', 'PH Down', 1500, '1970-01-01 12:00:00.000000'),
(2, 'nutrient_a', 'Nutrient A', 1500, '1970-01-01 12:00:00.000000'),
(3, 'nutrient_b', 'Nutrient B', 1500, '1970-01-01 12:00:00.000000'),
(4, 'nutrient_c', 'Nutrient C', 1500, '1970-01-01 12:00:00.000000'),
(5, 'nutrient_d', 'Nutrient D', 1500, '1970-01-01 12:00:00.000000'),
(6, 'nutrient_e', 'Nutrient E', 1500, '1970-01-01 12:00:00.000000'),
(7, 'nutrient_f', 'Nutrient F', 1500, '1970-01-01 12:00:00.000000');

CREATE TABLE `stages` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `lights_on` int(11) UNSIGNED NOT NULL,
  `lights_off` int(11) UNSIGNED NOT NULL,
  `max_humidity` int(11) UNSIGNED NOT NULL,
  `ec_target_low` int(11) UNSIGNED NOT NULL,
  `ec_target_high` int(11) UNSIGNED NOT NULL,
  `nutrient_a` int(11) UNSIGNED NOT NULL,
  `nutrient_b` int(11) UNSIGNED NOT NULL,
  `nutrient_c` int(11) UNSIGNED NOT NULL,
  `nutrient_d` int(11) UNSIGNED NOT NULL,
  `nutrient_e` int(11) UNSIGNED NOT NULL,
  `nutrient_f` int(11) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `stages` (`id`, `name`, `lights_on`, `lights_off`, `max_humidity`, `ec_target_low`, `ec_target_high`, `nutrient_a`, `nutrient_b`, `nutrient_c`, `nutrient_d`, `nutrient_e`, `nutrient_f`) VALUES
(0, 'seedling', 0, 0, 80, 1, 2, 1.6, 2.0, 0, 0, 0, 0),
(1, 'vegetative_early', 0, 0, 65, 1.6, 2.0, 0, 0, 0, 0, 0, 0),
(2, 'vegetative_late', 0, 0, 50, 1.6, 2.0, 0, 0, 0, 0, 0, 0),
(3, 'flowering_early', 0, 0, 45, 2.0, 2.75, 0, 0, 0, 0, 0, 0),
(4, 'flowering_late', 0, 0, 40, 2.0, 2.75, 0, 0, 0, 0, 0, 0);