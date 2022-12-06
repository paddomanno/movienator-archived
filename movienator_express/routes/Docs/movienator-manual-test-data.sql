-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: database:3306
-- Erstellungszeit: 06. Dez 2022 um 17:12
-- Server-Version: 5.7.40
-- PHP-Version: 8.0.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `movienator-database`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `actor`
--

CREATE TABLE `actor` (
  `actorId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `actor`
--

INSERT INTO `actor` (`actorId`, `name`) VALUES
(1, 'Dwayne \'The Rock\' Johnson');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `movie`
--

CREATE TABLE `movie` (
  `movieId` int(11) NOT NULL,
  `genres` text,
  `title` varchar(255) NOT NULL,
  `overview` varchar(1024) DEFAULT NULL,
  `releaseDate` datetime DEFAULT NULL,
  `lengthMinutes` int(11) DEFAULT NULL,
  `adultContent` tinyint(4) NOT NULL,
  `imagePath` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `movie`
--

INSERT INTO `movie` (`movieId`, `genres`, `title`, `overview`, `releaseDate`, `lengthMinutes`, `adultContent`, `imagePath`) VALUES
(0, 'action\r\ni dont know', 'Red Notice', 'Wow such a great mmovie u should watch. It has the rock', '2022-12-29 16:07:19', 123, 0, 'https://i.ytimg.com/an/B9ngrlKe6m0/18342976861288221476_mq.jpg?v=617107fd'),
(1, 'action\r\ncomedy\r\nsuperhero', 'Deadpool', 'its about a guy named deadpool, he\'s funny', '2022-12-19 16:07:19', 222, 0, 'https://static.kino.de/6a/e1/05/41668827dee0989f92185093fe_ZmMgOGY1MjdmMzJmZmZmIDEyMDAgMTIwMAM2MTQ2MmU5ZjEwZg==_410b3abdd91790bd013b57f050_yyaxmdg1edyxmcsxmzmrmtkccmugmtkymcaxmdgwazm5ngjiotlkmzc1.jpg');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `movie_actors_actor`
--

CREATE TABLE `movie_actors_actor` (
  `movieMovieId` int(11) NOT NULL,
  `actorActorId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `movie_actors_actor`
--

INSERT INTO `movie_actors_actor` (`movieMovieId`, `actorActorId`) VALUES
(0, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `profile_image`
--

CREATE TABLE `profile_image` (
  `ressourceLink` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `profile_image`
--

INSERT INTO `profile_image` (`ressourceLink`, `name`) VALUES
('https://img.joomcdn.net/c638a56d4e3bcbe306ff54051f163d8e261cdeb7_original.jpeg', 'totoro im regen'),
('https://www.kindpng.com/picc/m/703-7034195_rocket-rocket-ship-emoji-hd-png-download.png', 'rocket emoji image');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `review`
--

CREATE TABLE `review` (
  `reviewMovieMovieId` int(11) NOT NULL,
  `reviewUserUserId` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` varchar(1024) NOT NULL,
  `rating` int(11) NOT NULL,
  `lastUpdated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `review`
--

INSERT INTO `review` (`reviewMovieMovieId`, `reviewUserUserId`, `title`, `content`, `rating`, `lastUpdated`) VALUES
(0, 3, 'My detailed analysis of the relationship between characters in the movie', 'It was ok', 3, '2022-12-06 15:20:12'),
(1, 1, 'Another deadpool review', 'liked it, good movie', 4, '2022-12-06 15:21:49'),
(1, 3, 'My deadpool review', 'Funny!', 5, '2022-12-06 15:21:13');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

CREATE TABLE `user` (
  `userId` int(11) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `userName` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `comment` varchar(1024) NOT NULL DEFAULT '',
  `birthday` datetime NOT NULL,
  `profileImageRessourceLink` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `user`
--

INSERT INTO `user` (`userId`, `firstName`, `lastName`, `userName`, `password`, `comment`, `birthday`, `profileImageRessourceLink`) VALUES
(1, 'Pat', 'Rick', 'pat123', 'passw0rt', 'i like movies', '2022-12-22 16:19:00', 'https://www.kindpng.com/picc/m/703-7034195_rocket-rocket-ship-emoji-hd-png-download.png'),
(3, 'Isi', 'Dora', 'isidonks', 'isi123', 'Hello! :D', '2022-12-06 15:18:34', 'https://img.joomcdn.net/c638a56d4e3bcbe306ff54051f163d8e261cdeb7_original.jpeg');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user_following_user`
--

CREATE TABLE `user_following_user` (
  `userUserId_1` int(11) NOT NULL,
  `userUserId_2` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `user_following_user`
--

INSERT INTO `user_following_user` (`userUserId_1`, `userUserId_2`) VALUES
(1, 3),
(3, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user_watchlist_movie`
--

CREATE TABLE `user_watchlist_movie` (
  `userUserId` int(11) NOT NULL,
  `movieMovieId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `user_watchlist_movie`
--

INSERT INTO `user_watchlist_movie` (`userUserId`, `movieMovieId`) VALUES
(1, 0),
(3, 1);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `actor`
--
ALTER TABLE `actor`
  ADD PRIMARY KEY (`actorId`);

--
-- Indizes für die Tabelle `movie`
--
ALTER TABLE `movie`
  ADD PRIMARY KEY (`movieId`);

--
-- Indizes für die Tabelle `movie_actors_actor`
--
ALTER TABLE `movie_actors_actor`
  ADD PRIMARY KEY (`movieMovieId`,`actorActorId`),
  ADD KEY `IDX_c97ad33f2ad62f033c9b37a7ca` (`movieMovieId`),
  ADD KEY `IDX_ba1a377fe3ea8b9424e312489e` (`actorActorId`);

--
-- Indizes für die Tabelle `profile_image`
--
ALTER TABLE `profile_image`
  ADD PRIMARY KEY (`ressourceLink`);

--
-- Indizes für die Tabelle `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`reviewMovieMovieId`,`reviewUserUserId`),
  ADD KEY `FK_01f87db2c807cbae99d617b62b3` (`reviewUserUserId`);

--
-- Indizes für die Tabelle `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userId`),
  ADD KEY `FK_b1bab127bf0484e4ecedeef0e77` (`profileImageRessourceLink`);

--
-- Indizes für die Tabelle `user_following_user`
--
ALTER TABLE `user_following_user`
  ADD PRIMARY KEY (`userUserId_1`,`userUserId_2`),
  ADD KEY `IDX_1a957da54e70d40ab63db3997b` (`userUserId_1`),
  ADD KEY `IDX_182483411737f0694248c7ccc9` (`userUserId_2`);

--
-- Indizes für die Tabelle `user_watchlist_movie`
--
ALTER TABLE `user_watchlist_movie`
  ADD PRIMARY KEY (`userUserId`,`movieMovieId`),
  ADD KEY `IDX_50a1fefec08b7afd5a65e3afd6` (`userUserId`),
  ADD KEY `IDX_6e4e53073d080909f07e1144d3` (`movieMovieId`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `user`
--
ALTER TABLE `user`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `movie_actors_actor`
--
ALTER TABLE `movie_actors_actor`
  ADD CONSTRAINT `FK_ba1a377fe3ea8b9424e312489e2` FOREIGN KEY (`actorActorId`) REFERENCES `actor` (`actorId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_c97ad33f2ad62f033c9b37a7ca9` FOREIGN KEY (`movieMovieId`) REFERENCES `movie` (`movieId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `FK_01f87db2c807cbae99d617b62b3` FOREIGN KEY (`reviewUserUserId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_9d11aaec1c7607d1d7c5fecc30e` FOREIGN KEY (`reviewMovieMovieId`) REFERENCES `movie` (`movieId`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `FK_b1bab127bf0484e4ecedeef0e77` FOREIGN KEY (`profileImageRessourceLink`) REFERENCES `profile_image` (`ressourceLink`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints der Tabelle `user_following_user`
--
ALTER TABLE `user_following_user`
  ADD CONSTRAINT `FK_182483411737f0694248c7ccc9d` FOREIGN KEY (`userUserId_2`) REFERENCES `user` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_1a957da54e70d40ab63db3997bd` FOREIGN KEY (`userUserId_1`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `user_watchlist_movie`
--
ALTER TABLE `user_watchlist_movie`
  ADD CONSTRAINT `FK_50a1fefec08b7afd5a65e3afd63` FOREIGN KEY (`userUserId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_6e4e53073d080909f07e1144d3b` FOREIGN KEY (`movieMovieId`) REFERENCES `movie` (`movieId`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
