-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: database:3306
-- Erstellungszeit: 06. Feb 2023 um 11:08
-- Server-Version: 5.7.41
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
CREATE DATABASE IF NOT EXISTS `movienator-database` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `movienator-database`;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `actor`
--

CREATE TABLE `actor` (
  `actorId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `imagePath` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `actor`
--

INSERT INTO `actor` (`actorId`, `name`, `imagePath`) VALUES
(10, 'Bob Peterson', NULL),
(49, 'Maria Bello', ''),
(109, 'Elijah Wood', ''),
(110, 'Viggo Mortensen', ''),
(112, 'Cate Blanchett', ''),
(114, 'Orlando Bloom', ''),
(194, 'Richard Harris', ''),
(204, 'Kate Winslet', ''),
(290, 'Christopher Plummer', NULL),
(368, 'Reese Witherspoon', NULL),
(388, 'Jim Broadbent', ''),
(655, 'John Rhys-Davies', ''),
(670, 'Ben Burtt', NULL),
(819, 'Edward Norton', NULL),
(821, 'Beverly D\'Angelo', NULL),
(882, 'Liv Tyler', ''),
(884, 'Steve Buscemi', NULL),
(1245, 'Scarlett Johansson', NULL),
(1283, 'Helena Bonham Carter', ''),
(1327, 'Ian McKellen', ''),
(1328, 'Sean Astin', ''),
(1329, 'Billy Boyd', ''),
(1330, 'Dominic Monaghan', ''),
(1333, 'Andy Serkis', ''),
(1369, 'Bernard Hill', ''),
(1771, 'Giovanni Ribisi', ''),
(1923, 'Robbie Coltrane', ''),
(2372, 'Ron Perlman', ''),
(2395, 'Whoopi Goldberg', NULL),
(2467, 'James Cosmo', NULL),
(2632, 'Chris Rock', ''),
(3061, 'Ewan McGregor', ''),
(3063, 'Tilda Swinton', ''),
(3131, 'Antonio Banderas', NULL),
(3136, 'Salma Hayek', ''),
(3810, 'Javier Bardem', ''),
(3901, 'Richard Brake', ''),
(4566, 'Alan Rickman', ''),
(5526, 'Georgie Henley', NULL),
(5527, 'Skandar Keynes', NULL),
(5528, 'William Moseley', NULL),
(5529, 'Anna Popplewell', NULL),
(5530, 'James McAvoy', NULL),
(5531, 'Kiran Shah', NULL),
(5532, 'Judy McIntosh', NULL),
(5538, 'Ray Winstone', NULL),
(5658, 'Michael Gambon', ''),
(5723, 'John Leguizamo', NULL),
(5953, 'Spike Jonze', NULL),
(7248, 'Cliff Curtis', ''),
(7907, 'John Ratzenberger', NULL),
(7929, 'Angus MacLane', ''),
(7960, 'Jerome Ranft', NULL),
(8691, 'Zoe Saldaña', ''),
(8784, 'Daniel Craig', NULL),
(9191, 'Timothy Spall', ''),
(9274, 'James Brolin', ''),
(9780, 'Angela Bassett', NULL),
(10205, 'Sigourney Weaver', ''),
(10297, 'Matthew McConaughey', NULL),
(10978, 'Maggie Smith', ''),
(10980, 'Daniel Radcliffe', ''),
(10983, 'Richard Griffiths', ''),
(10985, 'Ian Hart', ''),
(10989, 'Rupert Grint', ''),
(10990, 'Emma Watson', ''),
(10993, 'Tom Felton', ''),
(11074, 'Kathy Najimy', NULL),
(11159, 'Cheech Marin', NULL),
(11180, 'David Bradley', ''),
(11207, 'David Thewlis', NULL),
(11661, 'Kate Hudson', NULL),
(12802, 'Treva Etienne', NULL),
(15524, 'Ruth E. Carter', NULL),
(16828, 'Chris Evans', ''),
(16866, 'Jennifer Lopez', NULL),
(17039, 'Nick Offerman', NULL),
(17078, 'Michael Smiley', NULL),
(17490, 'Isiah Whitlock Jr.', ''),
(17647, 'Michelle Rodriguez', ''),
(17696, 'Kathryn Hahn', NULL),
(18792, 'Delroy Lindo', NULL),
(18918, 'Dwayne Johnson', ''),
(19292, 'Adam Sandler', ''),
(19492, 'Viola Davis', ''),
(19536, 'Josh Duhamel', NULL),
(19899, 'Dennis Storhøi', ''),
(20753, 'Fred Willard', NULL),
(21127, 'Bobby Cannavale', NULL),
(21198, 'Peter Sohn', ''),
(27319, 'Christoph Waltz', ''),
(27396, 'Sônia Braga', NULL),
(28640, 'Molly Shannon', NULL),
(30485, 'CCH Pounder', ''),
(32205, 'Brendan Fletcher', NULL),
(32747, 'Stephen Lang', ''),
(32895, 'Kevin James', ''),
(35029, 'David Harbour', NULL),
(38334, 'Jennifer Coolidge', NULL),
(39187, 'Olivia Colman', NULL),
(48312, 'Noah Segan', NULL),
(51671, 'Susie Porter', NULL),
(52583, 'Wagner Moura', NULL),
(52792, 'Maya Rudolph', ''),
(52886, 'Jeffrey Donovan', ''),
(53122, 'Fran Drescher', NULL),
(55086, 'Cam Gigandet', NULL),
(55934, 'Taika Waititi', ''),
(59231, 'Joel David Moore', ''),
(59233, 'Scoot McNairy', ''),
(59357, 'Teddy Newton', NULL),
(60074, 'Jeff Garlin', NULL),
(60949, 'Rob Schneider', ''),
(60950, 'David Spade', ''),
(61912, 'Sam Cotton', NULL),
(62861, 'Andy Samberg', NULL),
(65731, 'Sam Worthington', ''),
(67004, 'Anneke von der Lippe', ''),
(68812, 'Ed Asner', NULL),
(72754, 'Elissa Knight', NULL),
(73548, 'Fridtjov Såheim', ''),
(73968, 'Henry Cavill', NULL),
(74688, 'Keke Palmer', ''),
(77069, 'Lenny Kravitz', NULL),
(77948, 'Selena Gomez', NULL),
(78317, 'Bob Bergen', NULL),
(80676, 'Jordan Nagai', NULL),
(81840, 'Adeel Akhtar', NULL),
(82104, 'Danai Gurira', NULL),
(83271, 'Glen Powell', NULL),
(83860, 'Aldis Hodge', ''),
(84407, 'Jim Gaffigan', NULL),
(84490, 'David Kaye', NULL),
(84491, 'Elie Docter', NULL),
(84492, 'Jeremy Leary', NULL),
(85757, 'Joe Jonas', NULL),
(87265, 'Tenoch Huerta Mejía', NULL),
(105563, 'Mads Sjøgård Pettersen', ''),
(107542, 'Gard B. Eidsvold', ''),
(110516, 'Sam Parsonson', NULL),
(123879, 'Matt Nable', NULL),
(130322, 'Jeremy Lindsay Taylor', NULL),
(139900, 'Florence Kasumba', NULL),
(145247, 'Phoebe Tonkin', NULL),
(164945, 'Sarah Shahi', ''),
(170153, 'Dean Denton', NULL),
(172069, 'Chadwick Boseman', NULL),
(178634, 'Alex Hassell', NULL),
(195666, 'Sharon Duncan-Brewster', NULL),
(204276, 'John Turk', NULL),
(205213, 'Edi Patterson', NULL),
(206444, 'Constance Wu', ''),
(208519, 'Nick Kroll', NULL),
(210172, 'Harvey Guillén', NULL),
(221115, 'Daren Kagasoff', NULL),
(224185, 'James Maslow', NULL),
(224197, 'Brett Gelman', ''),
(225060, 'Selena Tan', NULL),
(225810, 'Kim S. Falck-Jørgensen', ''),
(236695, 'John Boyega', ''),
(298410, 'Keegan-Michael Key', NULL),
(543530, 'Dave Bautista', NULL),
(928158, 'Ludwig Göransson', NULL),
(933558, 'John Mulaney', NULL),
(935235, 'Marwan Kenzari', ''),
(972079, 'Desmin Borges', NULL),
(1005852, 'Janelle Monáe', NULL),
(1023465, 'Stephane Garneau-Monten', NULL),
(1056121, 'Ryan Coogler', NULL),
(1064289, 'Nadine Marshall', NULL),
(1071699, 'Brian Jordan Alvarez', NULL),
(1083010, 'Letitia Wright', NULL),
(1102500, 'Dale Soules', ''),
(1114487, 'Hero Fiennes Tiffin', ''),
(1146114, 'Penelope Mitchell', ''),
(1180099, 'Da\'Vine Joy Randolph', NULL),
(1180941, 'Kerry Knuppe', ''),
(1182667, 'Michael Saccente', NULL),
(1190554, 'Catherine Corcoran', ''),
(1202687, 'Casey Hartnett', ''),
(1202689, 'Jessica Henwick', NULL),
(1215228, 'Richard Fleeshman', ''),
(1215522, 'Robin Roberts', NULL),
(1218218, 'Thomas Sadoski', NULL),
(1233560, 'Trevor Donovan', NULL),
(1240236, 'George Houvardas', NULL),
(1253353, 'Noah Centineo', ''),
(1254614, 'Leslie Odom Jr.', NULL),
(1255540, 'Allison Williams', NULL),
(1267329, 'Lupita Nyong\'o', NULL),
(1293978, 'Mo Amer', ''),
(1303037, 'Taron Egerton', NULL),
(1319469, 'Ronny Chieng', NULL),
(1332680, 'Uzo Aduba', ''),
(1346535, 'Samson Kayo', NULL),
(1356210, 'Millie Bobby Brown', NULL),
(1360281, 'Lashana Lynch', ''),
(1368012, 'Michaela Coel', NULL),
(1373737, 'Florence Pugh', NULL),
(1383349, 'Christina Jackson', NULL),
(1392534, 'Spencer Neville', NULL),
(1394758, 'Ine Marie Wilmann', ''),
(1442069, 'Finn Wolfhard', ''),
(1447932, 'Winston Duke', NULL),
(1474019, 'Jake Choi', ''),
(1531926, 'Susan Wokoma', NULL),
(1537978, 'Mary McDonald-Lewis', ''),
(1540615, 'Tori Kelly', NULL),
(1558986, 'Louis Partridge', NULL),
(1561264, 'D\'Arcy Carden', NULL),
(1592584, 'Brian Hull', NULL),
(1595457, 'Tamara Lawrance', NULL),
(1613304, 'Shawn Mendes', ''),
(1642789, 'Madelyn Cline', NULL),
(1674162, 'Jonathan Majors', NULL),
(1674734, 'Jordan Bolger', ''),
(1726786, 'Ego Nwodim', ''),
(1776636, 'Craige Els', ''),
(1816499, 'Tilly Keeper', ''),
(1851642, 'Sheila Atim', ''),
(1880016, 'David Howard Thornton', ''),
(1882502, 'Lauren LaVera', ''),
(1997030, 'Halsey', NULL),
(2024835, 'Boone Platt', NULL),
(2042690, 'Quintessa Swindell', ''),
(2043430, 'Jenna Davis', NULL),
(2089274, 'Jen Van Epps', NULL),
(2099810, 'Gregory Mann', ''),
(2115854, 'Winslow Fegley', ''),
(2131391, 'Violet McGraw', NULL),
(2133996, 'Dominique Thorne', NULL),
(2213811, 'Mabel Cadena', NULL),
(2273501, 'Alexis Louder', NULL),
(2286339, 'Thuso Mbedu', ''),
(2301682, 'Hannah Dodd', NULL),
(2301800, 'Arlo Green', NULL),
(2402107, 'Nick Hargrove', NULL),
(2426321, 'Bodhi Sabongui', ''),
(2448692, 'Jack Bandeira', NULL),
(2455272, 'Jayme Lawson', ''),
(2532312, 'Michael Wayne Foster', NULL),
(2596740, 'Pancho Cardena', NULL),
(2615064, 'Damien Strouthos', NULL),
(2673115, 'Edward Carmody', NULL),
(2680747, 'Taylor Novak', NULL),
(2692493, 'Abbie Hern', NULL),
(2753267, 'Lyric Hurd', ''),
(2761419, 'Brian Heintz', NULL),
(2787720, 'Elliott Fullam', ''),
(2807731, 'Amelie McLain', ''),
(2852725, 'Alexander Elliot', NULL),
(2886547, 'Ronald Woodhead', NULL),
(3030659, 'Jordan J Gallagher', NULL),
(3030661, 'Tony Richardson', NULL),
(3260314, 'Michael Parrish', NULL),
(3383606, 'Sarah Voigt', ''),
(3444018, 'Amie Donald', NULL),
(3566438, 'Leah Mondesir-Simmonds', NULL),
(3566439, 'Eva-Arianna Baxter', NULL),
(3601160, 'MacInTalk', NULL),
(3607144, 'Leah Brady', NULL),
(3678959, 'Kailey Hyman', ''),
(3768875, 'Simone Ledward Boseman', NULL),
(3783386, 'Karoline Viktoria Sletteng Garvang', '');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `genre`
--

CREATE TABLE `genre` (
  `genreId` int(11) NOT NULL,
  `genreName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `genre`
--

INSERT INTO `genre` (`genreId`, `genreName`) VALUES
(12, 'Adventure'),
(14, 'Fantasy'),
(16, 'Animation'),
(18, 'Drama'),
(27, 'Horror'),
(28, 'Action'),
(35, 'Comedy'),
(36, 'History'),
(53, 'Thriller'),
(80, 'Crime'),
(99, 'Documentary'),
(878, 'Science Fiction'),
(9648, 'Mystery'),
(10402, 'Music'),
(10749, 'Romance'),
(10751, 'Family'),
(10752, 'War');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `movie`
--

CREATE TABLE `movie` (
  `movieId` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `overview` varchar(1024) DEFAULT NULL,
  `releaseDate` datetime DEFAULT NULL,
  `lengthMinutes` int(11) DEFAULT NULL,
  `adultContent` tinyint(4) NOT NULL,
  `imagePath` varchar(255) DEFAULT NULL,
  `videoPath` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `movie`
--

INSERT INTO `movie` (`movieId`, `title`, `overview`, `releaseDate`, `lengthMinutes`, `adultContent`, `imagePath`, `videoPath`) VALUES
(120, 'The Lord of the Rings: The Fellowship of the Ring', 'Young hobbit Frodo Baggins, after inheriting a mysterious ring from his uncle Bilbo, must leave his home in order to keep it from falling into the hands of its evil creator. Along the way, a fellowship is formed to protect the ringbearer and make sure that the ring arrives at its final destination: Mt. Doom, the only place where it can be destroyed.', '2001-12-18 01:00:00', 179, 0, '/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg', 'null'),
(121, 'The Lord of the Rings: The Two Towers', 'Frodo and Sam are trekking to Mordor to destroy the One Ring of Power while Gimli, Legolas and Aragorn search for the orc-captured Merry and Pippin. All along, nefarious wizard Saruman awaits the Fellowship members at the Orthanc Tower in Isengard.', '2002-12-18 01:00:00', 179, 0, '/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg', 'null'),
(122, 'The Lord of the Rings: The Return of the King', 'Aragorn is revealed as the heir to the ancient kings as he, Gandalf and the other members of the broken fellowship struggle to save Gondor from Sauron\'s forces. Meanwhile, Frodo and Sam take the ring closer to the heart of Mordor, the dark lord\'s realm.', '2003-12-01 01:00:00', 201, 0, '/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg', 'null'),
(411, 'The Chronicles of Narnia: The Lion, the Witch and the Wardrobe', 'Siblings Lucy, Edmund, Susan and Peter step through a magical wardrobe and find the land of Narnia. There, they discover a charming, once peaceful kingdom that has been plunged into eternal winter by the evil White Witch, Jadis. Aided by the wise and magnificent lion, Aslan, the children lead Narnia into a spectacular, climactic battle to be free of the Witch\'s glacial powers forever.', '2005-12-07 01:00:00', 143, 0, '/iREd0rNCjYdf5Ar0vfaW32yrkm.jpg', '3mKPrxjwF7A'),
(671, 'Harry Potter and the Philosopher\'s Stone', 'Harry Potter has lived under the stairs at his aunt and uncle\'s house his whole life. But on his 11th birthday, he learns he\'s a powerful wizard—with a place waiting for him at the Hogwarts School of Witchcraft and Wizardry. As he learns to harness his newfound powers with the help of the school\'s kindly headmaster, Harry uncovers the truth about his parents\' deaths—and about the villain who\'s to blame.', '2001-11-16 01:00:00', 152, 0, '/wuMc08IPKEatf9rnMNXvIDxqP4W.jpg', 'null'),
(767, 'Harry Potter and the Half-Blood Prince', 'As Lord Voldemort tightens his grip on both the Muggle and wizarding worlds, Hogwarts is no longer a safe haven. Harry suspects perils may even lie within the castle, but Dumbledore is more intent upon preparing him for the final battle fast approaching. Together they work to find the key to unlock Voldemorts defenses and to this end, Dumbledore recruits his old friend and colleague Horace Slughorn, whom he believes holds crucial information. Even as the decisive showdown looms, romance blossoms for Harry, Ron, Hermione and their classmates. Love is in the air, but danger lies ahead and Hogwarts may never be the same again.', '2009-07-07 02:00:00', 153, 0, '/z7uo9zmQdQwU5ZJHFpv2Upl30i1.jpg', 'null'),
(10681, 'WALL·E', 'WALL·E is the last robot left on an Earth that has been overrun with garbage and all humans have fled to outer space. For 700 years he has continued to try and clean up the mess, but has developed some rather interesting human-like qualities. When a ship arrives with a sleek new type of robot, WALL·E thinks he\'s finally found a friend and stows away on the ship when it leaves.', '2008-06-22 02:00:00', 98, 0, '/hbhFnRzzg6ZDmm8YAmxBnQpQIPh.jpg', 'Tbr_L9Gap_M'),
(14160, 'Up', 'Carl Fredricksen spent his entire life dreaming of exploring the globe and experiencing life to its fullest. But at age 78, life seems to have passed him by, until a twist of fate (and a persistent 8-year old Wilderness Explorer named Russell) gives him a new lease on life.', '2009-05-28 02:00:00', 96, 0, '/vpbaStTMt8qqXaEgnOR2EE4DNJk.jpg', 'Ajcdb4FAL7A'),
(19995, 'Avatar', 'In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization.', '2009-12-15 01:00:00', 162, 0, '/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg', 'null'),
(38365, 'Grown Ups', 'After their high school basketball coach passes away, five good friends and former teammates reunite for a Fourth of July holiday weekend.', '2010-06-24 02:00:00', 102, 0, '/cQGM5k1NtU85n4TUlrOrwijSCcm.jpg', 'null'),
(76600, 'Avatar: The Way of Water', 'Set more than a decade after the events of the first film, learn the story of the Sully family (Jake, Neytiri, and their kids), the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure.', '2022-12-14 01:00:00', 192, 0, '/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg', 'null'),
(315162, 'Puss in Boots: The Last Wish', 'Puss in Boots discovers that his passion for adventure has taken its toll: He has burned through eight of his nine lives, leaving him with only one life left. Puss sets out on an epic journey to find the mythical Last Wish and restore his nine lives.', '2022-12-07 01:00:00', 102, 0, '/lmf0zzR7ritjOL3qumRh3hfvOFK.jpg', 'tHb7WlgyaUc'),
(436270, 'Black Adam', 'Nearly 5,000 years after he was bestowed with the almighty powers of the Egyptian gods—and imprisoned just as quickly—Black Adam is freed from his earthly tomb, ready to unleash his unique form of justice on the modern world.', '2022-10-19 02:00:00', 125, 0, '/pFlaoHTZeyNkG83vxsAJiGzfSsa.jpg', 'null'),
(438695, 'Sing 2', 'Buster and his new cast now have their sights set on debuting a new show at the Crystal Tower Theater in glamorous Redshore City. But with no connections, he and his singers must sneak into the Crystal Entertainment offices, run by the ruthless wolf mogul Jimmy Crystal, where the gang pitches the ridiculous idea of casting the lion rock legend Clay Calloway in their show. Buster must embark on a quest to find the now-isolated Clay and persuade him to return to the stage.', '2021-12-01 01:00:00', 110, 0, '/aWeKITRFbbwY8txG5uCj4rMCfSP.jpg', 'EPZu5MA2uqI'),
(505642, 'Black Panther: Wakanda Forever', 'Queen Ramonda, Shuri, M’Baku, Okoye and the Dora Milaje fight to protect their nation from intervening world powers in the wake of King T’Challa’s death. As the Wakandans strive to embrace their next chapter, the heroes must band together with the help of War Dog Nakia and Everett Ross and forge a new path for the kingdom of Wakanda.', '2022-11-09 01:00:00', 162, 0, '/sv1xJUazXeYqALzczSZ3O6nkH75.jpg', '_Z3QKkl1WyM'),
(536554, 'M3GAN', 'A brilliant toy company roboticist uses artificial intelligence to develop M3GAN, a life-like doll programmed to emotionally bond with her newly orphaned niece. But when the doll\'s programming works too well, she becomes overprotective of her new friend with terrifying results.', '2022-12-28 01:00:00', 102, 0, '/7CNCv9uhqdwK7Fv4bR4nmDysnd9.jpg', 'OoDHM_A1axc'),
(542196, 'Wolf Hound', 'Inspired by the real-life German special operations unit KG 200 that shot down, repaired, and flew Allied aircraft as Trojan horses, \"Wolf Hound\" takes place in 1944 German-occupied France and follows the daring exploits of Jewish-American fighter pilot Captain David Holden. Ambushed behind enemy lines, Holden must rescue a captured B-17 Flying Fortress crew, evade a ruthless enemy stalking him at every turn, and foil a plot that could completely alter the outcome of World War II.', '2022-06-03 02:00:00', 127, 0, '/1ubmnchbXLgCdE2LqVSrKmit07j.jpg', 'Ld9joQp2aeU'),
(555604, 'Guillermo del Toro\'s Pinocchio', 'During the rise of fascism in Mussolini\'s Italy, a wooden boy brought magically to life struggles to live up to his father\'s expectations.', '2022-11-09 01:00:00', 117, 0, '/vx1u0uwxdlhV2MUzj4VlcMB0N6m.jpg', 'null'),
(585083, 'Hotel Transylvania: Transformania', 'When Van Helsing\'s mysterious invention, the \"Monsterfication Ray,\" goes haywire, Drac and his monster pals are all transformed into humans, and Johnny becomes a monster. In their new mismatched bodies, Drac and Johnny must team up and race across the globe to find a cure before it\'s too late, and before they drive each other crazy.', '2022-02-25 01:00:00', 87, 0, '/teCy1egGQa0y8ULJvlrDHQKnxBL.jpg', '6suJohjIvfo'),
(653851, 'Devotion', 'The harrowing true story of two elite US Navy fighter pilots during the Korean War. Their heroic sacrifices would ultimately make them the Navy\'s most celebrated wingmen.', '2022-11-23 01:00:00', 139, 0, '/26yQPXymbWeCLKwcmyL8dRjAzth.jpg', 'nIvBBd8pU1s'),
(661374, 'Glass Onion: A Knives Out Mystery', 'World-famous detective Benoit Blanc heads to Greece to peel back the layers of a mystery surrounding a tech billionaire and his eclectic crew of friends.', '2022-11-23 01:00:00', 140, 0, '/vDGr1YdrlfbU9wxTOdpf3zChmv9.jpg', 'gj5ibYSz8C0'),
(663712, 'Terrifier 2', 'After being resurrected by a sinister entity, Art the Clown returns to Miles County where he must hunt down and destroy a teenage girl and her younger brother on Halloween night.  As the body count rises, the siblings fight to stay alive while uncovering the true nature of Art\'s evil intent.', '2022-10-06 02:00:00', 138, 0, '/8gLhu8UFPZfH2Hv11JhTZkb9CVl.jpg', 'null'),
(718789, 'Lightyear', 'Legendary Space Ranger Buzz Lightyear embarks on an intergalactic adventure alongside a group of ambitious recruits and his robot companion Sox.', '2022-06-15 02:00:00', 105, 0, '/ox4goZd956BxqJH6iLwhWPL9ct4.jpg', 'null'),
(724495, 'The Woman King', 'The story of the Agojie, the all-female unit of warriors who protected the African Kingdom of Dahomey in the 1800s with skills and a fierceness unlike anything the world has ever seen, and General Nanisca as she trains the next generation of recruits and readies them for battle against an enemy determined to destroy their way of life.', '2022-09-15 02:00:00', 135, 0, '/lQMJHnHxUyj8kJlC2YOKNuzuwMP.jpg', 'null'),
(736526, 'Troll', 'Deep inside the mountain of Dovre, something gigantic awakens after being trapped for a thousand years. Destroying everything in its path, the creature is fast approaching the capital of Norway. But how do you stop something you thought only existed in Norwegian folklore?', '2022-12-01 01:00:00', 104, 0, '/9z4jRr43JdtU66P0iy8h18OyLql.jpg', 'null'),
(758009, 'Shotgun Wedding', 'Darcy and Tom gather their families for the ultimate destination wedding but when the entire party is taken hostage, “’Til Death Do Us Part” takes on a whole new meaning in this hilarious, adrenaline-fueled adventure as Darcy and Tom must save their loved ones—if they don’t kill each other first.', '2022-12-28 01:00:00', 101, 0, '/t79ozwWnwekO0ADIzsFP1E5SkvR.jpg', 'U8gz0rUzTAY'),
(812025, 'The Silent Twins', 'Feeling isolated from that unwelcoming community, June and Jennifer Gibbons turn inward and reject communication with everyone but each other, retreating into their own fantasy world of artistic inspiration and adolescent desires.', '2022-09-16 02:00:00', 113, 0, '/wjO3QS3mD2t8F5u5nIbzQ1ov8dN.jpg', 'lEN2rk__Xms'),
(829280, 'Enola Holmes 2', 'Now a detective-for-hire like her infamous brother, Enola Holmes takes on her first official case to find a missing girl, as the sparks of a dangerous conspiracy ignite a mystery that requires the help of friends — and Sherlock himself — to unravel.', '2022-11-04 01:00:00', 129, 0, '/tegBpjM5ODoYoM1NjaiHVLEA0QM.jpg', '0DIftINqIjo'),
(830784, 'Lyle, Lyle, Crocodile', 'When the Primm family moves to New York City, their young son Josh struggles to adapt to his new school and new friends. All of that changes when he discovers Lyle — a singing crocodile who loves baths, caviar and great music — living in the attic of his new home. But when Lyle’s existence is threatened by evil neighbor Mr. Grumps, the Primms must band together to show the world that family can come from the most unexpected places.', '2022-10-07 02:00:00', 106, 0, '/irIS5Tn3TXjNi1R9BpWvGAN4CZ1.jpg', 'null'),
(842544, 'Transfusion', 'Ryan Logan, a former Special Forces operative, is battling to cope with life after the loss of his wife.  He is thrusted into the criminal underworld to keep his only son from being taken from him.', '2023-01-05 01:00:00', 105, 0, '/bxh5xCCW9Ynfg6EZJWUkc1zqTnr.jpg', 'pA6CGAwVq-Q'),
(899112, 'Violent Night', 'When a team of mercenaries breaks into a wealthy family compound on Christmas Eve, taking everyone inside hostage, the team isn’t prepared for a surprise combatant: Santa Claus is on the grounds, and he’s about to show why this Nick is no saint.', '2022-11-30 01:00:00', 112, 0, '/1XSYOP0JjjyMz1irihvWywro82r.jpg', 'a53e4HHnx_s'),
(1013860, 'R.I.P.D. 2: Rise of the Damned', 'When Sheriff Roy Pulsipher finds himself in the afterlife, he joins a special police force and returns to Earth to save humanity from the undead.', '2022-11-15 01:00:00', 102, 0, '/g4yJTzMtOBUTAR2Qnmj8TYIcFVq.jpg', 'null'),
(1043835, '20/20 Presents Black Panther: In Search of Wakanda', 'Exploring the evolution of Black Panther from the comic emerging in the 1960s to the film the world fell in love with in 2018; director Ryan Coogler; Whoopi Goldberg interviews Chadwick Boseman\'s widow, Simone Ledward Boseman.', '2022-11-04 01:00:00', 43, 0, '/78zCPvK3iF1O9fDQFi9wKmqmGOK.jpg', 'pKThilXxH2Q');

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
(120, 114),
(120, 1329),
(120, 1330),
(121, 1333),
(122, 109),
(122, 110),
(122, 112),
(122, 655),
(122, 882),
(122, 1327),
(122, 1328),
(122, 1369),
(411, 388),
(411, 2467),
(411, 3063),
(411, 5526),
(411, 5527),
(411, 5528),
(411, 5529),
(411, 5530),
(411, 5531),
(411, 5532),
(671, 194),
(671, 10983),
(671, 10985),
(671, 10993),
(767, 1923),
(767, 4566),
(767, 5658),
(767, 9191),
(767, 10978),
(767, 10980),
(767, 10989),
(767, 10990),
(10681, 670),
(10681, 10205),
(10681, 11074),
(10681, 20753),
(10681, 59357),
(10681, 60074),
(10681, 72754),
(10681, 78317),
(10681, 3601160),
(14160, 10),
(14160, 290),
(14160, 7907),
(14160, 7960),
(14160, 18792),
(14160, 68812),
(14160, 80676),
(14160, 84490),
(14160, 84491),
(14160, 84492),
(19995, 1771),
(19995, 8691),
(19995, 17647),
(19995, 30485),
(19995, 32747),
(19995, 59231),
(38365, 49),
(38365, 2632),
(38365, 19292),
(38365, 32895),
(38365, 52792),
(38365, 60949),
(76600, 204),
(76600, 7248),
(315162, 3131),
(315162, 3136),
(315162, 5538),
(315162, 39187),
(315162, 52583),
(315162, 210172),
(315162, 933558),
(315162, 1180099),
(315162, 1346535),
(315162, 1373737),
(436270, 18918),
(436270, 83860),
(436270, 164945),
(436270, 935235),
(436270, 1253353),
(436270, 1293978),
(436270, 2042690),
(436270, 2426321),
(438695, 368),
(438695, 1245),
(438695, 5953),
(438695, 10297),
(438695, 17039),
(438695, 21127),
(438695, 208519),
(438695, 1303037),
(438695, 1540615),
(438695, 1997030),
(505642, 82104),
(505642, 87265),
(505642, 139900),
(505642, 1368012),
(505642, 1447932),
(505642, 2133996),
(505642, 2213811),
(536554, 1023465),
(536554, 1071699),
(536554, 1182667),
(536554, 1255540),
(536554, 1319469),
(536554, 2043430),
(536554, 2089274),
(536554, 2131391),
(536554, 2301800),
(536554, 3444018),
(542196, 204276),
(542196, 224185),
(542196, 1233560),
(542196, 2532312),
(542196, 2680747),
(542196, 2761419),
(542196, 2886547),
(542196, 3260314),
(555604, 2372),
(555604, 3061),
(555604, 11180),
(555604, 27319),
(555604, 1442069),
(555604, 2099810),
(585083, 884),
(585083, 17696),
(585083, 28640),
(585083, 53122),
(585083, 60950),
(585083, 62861),
(585083, 77948),
(585083, 84407),
(585083, 298410),
(585083, 1592584),
(653851, 83271),
(653851, 85757),
(653851, 170153),
(653851, 221115),
(653851, 1218218),
(653851, 1383349),
(653851, 1392534),
(653851, 1674162),
(653851, 2024835),
(653851, 2402107),
(661374, 819),
(661374, 8784),
(661374, 11661),
(661374, 48312),
(661374, 543530),
(661374, 1005852),
(661374, 1202689),
(661374, 1254614),
(661374, 1642789),
(663712, 1190554),
(663712, 1202687),
(663712, 1880016),
(663712, 1882502),
(663712, 2787720),
(663712, 2807731),
(663712, 3383606),
(663712, 3678959),
(718789, 7929),
(718789, 9274),
(718789, 16828),
(718789, 17490),
(718789, 21198),
(718789, 55934),
(718789, 74688),
(718789, 1102500),
(718789, 1332680),
(718789, 1537978),
(724495, 19492),
(724495, 236695),
(724495, 1114487),
(724495, 1360281),
(724495, 1674734),
(724495, 1851642),
(724495, 2286339),
(724495, 2455272),
(736526, 19899),
(736526, 67004),
(736526, 73548),
(736526, 105563),
(736526, 107542),
(736526, 225810),
(736526, 1394758),
(736526, 3783386),
(758009, 11159),
(758009, 16866),
(758009, 19536),
(758009, 27396),
(758009, 38334),
(758009, 77069),
(758009, 225060),
(758009, 972079),
(758009, 1561264),
(758009, 2596740),
(812025, 12802),
(812025, 17078),
(812025, 1064289),
(812025, 1083010),
(812025, 1595457),
(812025, 2448692),
(812025, 3030659),
(812025, 3030661),
(812025, 3566438),
(812025, 3566439),
(829280, 1283),
(829280, 11207),
(829280, 73968),
(829280, 81840),
(829280, 195666),
(829280, 1356210),
(829280, 1531926),
(829280, 1558986),
(829280, 2301682),
(829280, 2692493),
(830784, 3810),
(830784, 59233),
(830784, 206444),
(830784, 224197),
(830784, 1613304),
(830784, 1726786),
(830784, 2115854),
(830784, 2753267),
(842544, 51671),
(842544, 61912),
(842544, 65731),
(842544, 110516),
(842544, 123879),
(842544, 130322),
(842544, 145247),
(842544, 1240236),
(842544, 2615064),
(842544, 2673115),
(899112, 821),
(899112, 5723),
(899112, 32205),
(899112, 35029),
(899112, 55086),
(899112, 178634),
(899112, 205213),
(899112, 2273501),
(899112, 2852725),
(899112, 3607144),
(1013860, 3901),
(1013860, 52886),
(1013860, 1146114),
(1013860, 1180941),
(1013860, 1215228),
(1013860, 1474019),
(1013860, 1776636),
(1013860, 1816499),
(1043835, 2395),
(1043835, 9780),
(1043835, 15524),
(1043835, 172069),
(1043835, 928158),
(1043835, 1056121),
(1043835, 1215522),
(1043835, 1267329),
(1043835, 3768875);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `movie_genres_genre`
--

CREATE TABLE `movie_genres_genre` (
  `movieMovieId` int(11) NOT NULL,
  `genreGenreId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `movie_genres_genre`
--

INSERT INTO `movie_genres_genre` (`movieMovieId`, `genreGenreId`) VALUES
(120, 12),
(120, 14),
(120, 28),
(121, 12),
(121, 14),
(121, 28),
(122, 12),
(122, 14),
(122, 28),
(411, 12),
(411, 14),
(411, 10751),
(671, 12),
(671, 14),
(767, 12),
(767, 14),
(10681, 16),
(10681, 878),
(10681, 10751),
(14160, 12),
(14160, 16),
(14160, 35),
(14160, 10751),
(19995, 12),
(19995, 14),
(19995, 28),
(19995, 878),
(38365, 35),
(76600, 12),
(76600, 28),
(76600, 878),
(315162, 12),
(315162, 14),
(315162, 16),
(315162, 28),
(315162, 35),
(315162, 10751),
(436270, 14),
(436270, 28),
(436270, 878),
(438695, 12),
(438695, 16),
(438695, 35),
(505642, 12),
(505642, 28),
(505642, 878),
(536554, 27),
(536554, 35),
(536554, 878),
(542196, 28),
(542196, 10752),
(555604, 14),
(555604, 16),
(555604, 18),
(585083, 12),
(585083, 14),
(585083, 16),
(585083, 35),
(585083, 10751),
(653851, 18),
(653851, 36),
(653851, 10752),
(661374, 35),
(661374, 53),
(661374, 9648),
(663712, 27),
(663712, 53),
(718789, 12),
(718789, 16),
(718789, 28),
(718789, 878),
(718789, 10751),
(724495, 18),
(724495, 28),
(724495, 36),
(736526, 12),
(736526, 14),
(736526, 28),
(758009, 28),
(758009, 35),
(758009, 10749),
(812025, 18),
(829280, 12),
(829280, 35),
(829280, 80),
(829280, 9648),
(830784, 35),
(830784, 10402),
(830784, 10751),
(842544, 18),
(842544, 53),
(842544, 80),
(899112, 28),
(899112, 35),
(899112, 53),
(899112, 80),
(1013860, 14),
(1013860, 28),
(1013860, 35),
(1013860, 80),
(1043835, 99);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `movie_watch_providers_watch_provider`
--

CREATE TABLE `movie_watch_providers_watch_provider` (
  `movieMovieId` int(11) NOT NULL,
  `watchProviderProviderId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
('1', '1'),
('2', '2'),
('3', '3'),
('4', '4'),
('5', '5');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `recommendation`
--

CREATE TABLE `recommendation` (
  `message` varchar(2000) NOT NULL,
  `sendingUserUserId` int(11) NOT NULL,
  `receivingUserUserId` int(11) NOT NULL,
  `recommendedMovieMovieId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `recommendation`
--

INSERT INTO `recommendation` (`message`, `sendingUserUserId`, `receivingUserUserId`, `recommendedMovieMovieId`) VALUES
('Good again', 5, 6, 76600),
('Cool Cool', 5, 6, 315162),
('Helllo you', 5, 6, 899112),
('Cooooler Film', 5, 7, 19995),
('Schau in dir an!', 5, 7, 661374),
('Sieht komisch aus', 5, 7, 812025),
('Hello there', 5, 8, 661374),
('You should watch this', 6, 5, 436270),
('Einfach nur lustig', 6, 5, 536554),
('You should watch this', 6, 7, 76600),
('Such a great movie', 6, 8, 536554),
('Krimi', 7, 6, 829280),
('Wow, so lustig', 7, 8, 585083);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `review`
--

CREATE TABLE `review` (
  `reviewMovieMovieId` int(11) NOT NULL,
  `reviewUserUserId` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `lastUpdated` datetime NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` varchar(4096) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `review`
--

INSERT INTO `review` (`reviewMovieMovieId`, `reviewUserUserId`, `rating`, `lastUpdated`, `title`, `content`) VALUES
(10681, 5, 3, '2023-01-12 09:41:48', 'Not cool', 'I dont like this robot'),
(14160, 5, 5, '2023-02-06 11:58:15', 'Mein Namensvetter', 'Hier gibt es einen Vogel der auch Kevin heißt :)'),
(76600, 5, 4, '2023-01-11 17:14:20', 'Visually Stunning', 'This sequel has a design and look that matches the first film but it no longer has the same impact. While the ocean setting brings new creatures for us to marvel at - it isn\'t as breathtakingly new as it was 13 years ago.\n\nThere are a lot of action set pieces and all of them are great to watch, although they feel either repetitive or borrowed from previous Cameron films like Titanic.\n\nFor me, bringing back both the Grace character and the evil colonel felt too much. One of them, Grace (Sigorney Weaver), would have been sufficient, the Colonel could easily have been a brother like in Die Hard 3, although this would require additional story changes regarding the adolescent « Spider » character. But that would have been better than the whole « importance of Family » theme running through everything. Just too much of that for me, as well as let\'s make sure only incidental characters die.'),
(76600, 6, 2, '2023-01-10 13:30:33', 'Its okay', 'He did it again. And I don\'t even really understand how. He has some kind of mysterious, special power that he secretly wields over us and we don\'t even notice. That\'s how he keeps tricking us into spending all our hard-earned money to see his movies, so much so that we\'ve made him the most commercially successful director of all time. Because these are James Cameron\'s most typical trademarks, for pretty much all of his movies, which he has once again dutifully employed in Avatar 2:\n\n~ The story is paper-thin.\n\n~ The dialogue was written by a 16-year-old intern.\n\n~ The soundtrack is unbelievably cheesy.\n\n~ The lead actor has no discernable acting skills.\n\n~ The bad guys are all 100% completely evil, and the good guys are all but entirely saintly.'),
(76600, 7, 4, '2023-01-10 13:34:09', 'Pretty good and pretty', 'Without question, this has the best CG works I have seen in recent movies.. Visuals are outstanding.. Underwater sequences and the fight scenes felt very real.. And that\'s all to it.. Just because it\'s a visual masterpiece, I cannot spend continuous 12-15 minutes just watching the underwater animals.. It felt like watching some episode from National Geographic or Animal planet..\n\nOverall, if you cut 30-40 mins of such parts, you will still not miss anything in the story line.. First half was mostly to setup the environment and was very lagging .. I was like ,\"Okay.. I get it.. it\'s a great place with different creatures.. Now, please move on to the storyline..\".. Climax fight portion was good but not as great as the Avatar 2009 climax fight.. After the fight we still get some 5-10 mins of lagging scenes.. \"Come on ... Finish it already\"...'),
(315162, 5, 5, '2023-01-10 22:23:55', 'Great Sequel', 'It\'s hard to believe the sequel to Avatar has actually come out. After 13 years and what feels like half-a-dozen delays, it\'s officially here.\n\nAs someone who was surprised by how much that 2009 movie held up on a recent viewing, and therefore had high expectations for a sequel, I\'d say it lived up to the hype. Maybe it\'s a little less great, but I\'d have to sit with it a little while longer before I could be sure.\n\nFirst of all, this movie is long. 192 minutes long. I didn\'t feel the length, in all honesty. I got wrapped up in the movie and how it looked and sounded so much that it probably could have gone on another hour and I still wouldn\'t have felt restless. It\'s one of the best-paced 3+ hour movies I\'ve ever seen... and you could argue it\'s even paced a little too fast in the first act, thanks to a time-skip that means the viewer has to be caught up to speed quickly.'),
(315162, 6, 4, '2023-01-10 13:31:46', 'Very entertaining', 'If you loved the first movie, you are likely to love this too. This movie too has a thin story, very basic dialogue, and has a very simplistic outlook on life and story. And yet, again as the first one, this movie is beautiful, the story is about family and love, and Cameron just know how to pull those strings. This is what Hollywood used to be so great at and clearly Cameron is one of the last true directors of tinseltown.\n\nI am not completely sold on this. I think the movie is too long, I think the simplistic worldview with no shades of gray, and the somewhat cringe dialogue reduces the score too much for me to fully enjoy this spectacle. However this is very entertaining, it is stunning to look at, and I will give this a lot of props for the feel of the movie. There is just something about this experience that gets to you, and as I mention initially the magic of the first movie is definitely still there. This will be the biggest box office of the year for sure, but I cannot say it was a great movie to me.'),
(438695, 7, 2, '2023-01-10 13:59:05', 'Not that great', 'This film is visually stunning. It simply has to be seen on the biggest screen possible in 3d. That\'s the best way to enjoy this film just let it consume you. The story is one that most people can get behind and it\'s enhanced by the visual storytelling on screen. I haven\'t looked at the film in detail because so much happened and it was so visually engulfing. I\'m not saying the story is perfect but the 3 hour+ runtime helped flesh out all of the characters and give the story depth and weight that you only really get with TV series theses days.\n\nHonestly there could be a few plot holes but I don\'t really care. If you\'re looking to nitpick this movie then maybe you should rethink your life just and enjoy one of the most gorgeous pieces of art this world has ever produced. Just think of how much work was put into this and how amazing it feels.\n\nThis film has got to be one of the best cinema experiences I\'ve ever had probably along with 1917, Dunkirk, the original Avatar and the re-release of Akira. I know I haven\'t seen 2001 in imax so maybe that would knock this film out the park but who knows.\n\nI\'m probably gonna see this movie 3 or 4 more times at least in imax even if it means I\'m broke it\'s just one of those films that is just breathtaking.'),
(505642, 6, 2, '2023-02-06 12:00:37', 'Not as good as the first one', 'The first one was really great (except the CGI), but this one just wasnt as exciting or entertaining.'),
(505642, 7, 4, '2023-01-10 13:58:37', 'Pretty visuals', 'Massive advertising will make sure (just like me) that many people will go see it anyway, no matter how bad the reviews. Especially kids will want to see it. Because let\'s face it, this picture is particularly targetted at kids and hurrah for them if they are into this sort of nonstop action packed game adventure movie. I am not into it though... NOT at all!\n\nThe bad: it\'s all about the pretty visuals and there is very little to none real humanlike soul and subtletly. It\'s all about \"look how impressive this explosion looks\" and this one and that one. This movie has got SO many EXPLOSIONS and attacks that it started to numb my senses after 20 minutes. That\'s no way to tell a story!'),
(542196, 5, 2, '2023-02-06 11:57:39', 'Its okay', 'I kinda liked it but didnt really understand'),
(653851, 6, 3, '2023-02-06 11:59:12', 'Nicht ganz so gut', 'Fand ich irgendwie nicht so spannend. '),
(661374, 8, 4, '2023-01-10 22:14:01', 'Fun, but the first one is better', 'The casting and performances by all were outstanding, especially Bautista and Norton, and I really liked the setting in Greece, but I feel the ending ruined what could\'ve been a better sequel. There certainly was some creative ideas in the narrative, and even though the start was slow and tedious, it did get better when Benoit Blanc started to unravel the mystery. However, the unravelling was too as-a-matter-of-factly and too convenient in its set-up. And normally I\'d be fine with that, because the few twists were a nice touch, but then right after the mystery was solved, the ridiculous antics just became too unbelievable and quite frankly, unnecessary. Still, and enjoyable one-time watch, especially if you enjoyed the first one.'),
(724495, 8, 5, '2023-01-10 22:14:45', 'I really liked this', 'After the first Knives Out I was expecting better than this. As Benoit pointed out the whole thing is stupid. Ironic really, i mean was that what this was supposed to be ?? A big fat Ironic slap in the face.\n\nThe acting was slapstick, over dramatic silliness. Not like the first film which was subtle black comedy. This was in your face amateur stage play style stuff.\n\nThe plot tries to be clever and has a few reveals but none are particularly jarring nor interesting. The overall message seemed to be beware of Shills.\n\nPoor plot, poor acting, poor start and poor ending. There is a moment in the middle when you think there is hope for this yarn but it just fizzles out like a burn\'t napkin. Probably the same napkin the script was written on.\n\nWhen the credits roll your just left with a sinking feeling you were the one conned. No idea how its got a high rating, probably due to all the dreck thats been released this Christmas'),
(758009, 7, 5, '2023-02-06 12:02:35', 'Toller Film', 'Wow!!! Was für ein herrausragender Film. Ich bin ganz hin und weg'),
(899112, 5, 4, '2023-01-11 16:02:42', 'A fun Christmas movie', 'I would\'ve liked to see more and funnier comedic moments, but there are still some fun laughs in this film. It sure beats all the romantic cheesy Christmas films that are in abundance this time of year. The directing was decent, and the pacing was spot-on in the comfortable 112 minute runtime. The story was pretty much predictable, although there were many refreshing references to past iconic Christmas holiday films. All casting and performances were excellent. Even the score and holiday soundtrack was on point. It\'s certainly an enjoyable one-time watch of mindless entertainment, and a well deserved 7/10 from me.');

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
(5, 'Kevin', 'Hasse', 'keha', 'admin', 'I love all kinds of movies!', '2000-07-07 02:00:00', '3'),
(6, 'Nick', 'Wilhelm', 'niwi', 'admin', 'I only watch movies with Batman', '2000-01-01 01:00:00', '2'),
(7, 'Patrick', 'Fender', 'pafe', 'admin', '', '2000-02-02 01:00:00', '1'),
(8, 'Shrek', 'The Greatest', 'Shrek', 'admin', 'I am Shrek', '2000-01-01 00:00:00', NULL);

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
(5, 6),
(5, 7),
(6, 5),
(7, 5),
(7, 6),
(7, 8),
(8, 5),
(8, 6);

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
(5, 411),
(5, 76600),
(5, 436270),
(5, 536554),
(5, 653851),
(5, 899112),
(6, 76600),
(6, 315162),
(6, 542196),
(6, 653851),
(6, 758009),
(6, 899112),
(7, 315162),
(7, 505642),
(7, 585083),
(7, 758009),
(7, 842544),
(8, 76600),
(8, 315162),
(8, 536554),
(8, 1043835);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `watch_provider`
--

CREATE TABLE `watch_provider` (
  `providerId` int(11) NOT NULL,
  `providerName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `actor`
--
ALTER TABLE `actor`
  ADD PRIMARY KEY (`actorId`);

--
-- Indizes für die Tabelle `genre`
--
ALTER TABLE `genre`
  ADD PRIMARY KEY (`genreId`);

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
-- Indizes für die Tabelle `movie_genres_genre`
--
ALTER TABLE `movie_genres_genre`
  ADD PRIMARY KEY (`movieMovieId`,`genreGenreId`),
  ADD KEY `IDX_7bc35c639a78a8d79189343ee2` (`movieMovieId`),
  ADD KEY `IDX_cbc6ce654c874336cd5fca1044` (`genreGenreId`);

--
-- Indizes für die Tabelle `movie_watch_providers_watch_provider`
--
ALTER TABLE `movie_watch_providers_watch_provider`
  ADD PRIMARY KEY (`movieMovieId`,`watchProviderProviderId`),
  ADD KEY `IDX_7694b1e34eb4da735586f9126c` (`movieMovieId`),
  ADD KEY `IDX_ad9d224b12a762b78ed8fd0fb6` (`watchProviderProviderId`);

--
-- Indizes für die Tabelle `profile_image`
--
ALTER TABLE `profile_image`
  ADD PRIMARY KEY (`ressourceLink`);

--
-- Indizes für die Tabelle `recommendation`
--
ALTER TABLE `recommendation`
  ADD PRIMARY KEY (`sendingUserUserId`,`receivingUserUserId`,`recommendedMovieMovieId`),
  ADD KEY `FK_f7a0a94817bb00fcf1d8d5d3c11` (`receivingUserUserId`),
  ADD KEY `FK_d0221d039d174f244c03e14d0f5` (`recommendedMovieMovieId`);

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
-- Indizes für die Tabelle `watch_provider`
--
ALTER TABLE `watch_provider`
  ADD PRIMARY KEY (`providerId`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `user`
--
ALTER TABLE `user`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

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
-- Constraints der Tabelle `movie_genres_genre`
--
ALTER TABLE `movie_genres_genre`
  ADD CONSTRAINT `FK_7bc35c639a78a8d79189343ee20` FOREIGN KEY (`movieMovieId`) REFERENCES `movie` (`movieId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_cbc6ce654c874336cd5fca10449` FOREIGN KEY (`genreGenreId`) REFERENCES `genre` (`genreId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `movie_watch_providers_watch_provider`
--
ALTER TABLE `movie_watch_providers_watch_provider`
  ADD CONSTRAINT `FK_7694b1e34eb4da735586f9126cf` FOREIGN KEY (`movieMovieId`) REFERENCES `movie` (`movieId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_ad9d224b12a762b78ed8fd0fb64` FOREIGN KEY (`watchProviderProviderId`) REFERENCES `watch_provider` (`providerId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `recommendation`
--
ALTER TABLE `recommendation`
  ADD CONSTRAINT `FK_6c1790f7b4f6e5b416fd0e701fc` FOREIGN KEY (`sendingUserUserId`) REFERENCES `user` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_d0221d039d174f244c03e14d0f5` FOREIGN KEY (`recommendedMovieMovieId`) REFERENCES `movie` (`movieId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_f7a0a94817bb00fcf1d8d5d3c11` FOREIGN KEY (`receivingUserUserId`) REFERENCES `user` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

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
  ADD CONSTRAINT `FK_182483411737f0694248c7ccc9d` FOREIGN KEY (`userUserId_2`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE NO ACTION,
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
