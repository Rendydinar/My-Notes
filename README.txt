ABASE MYSQL API: 

	CREATE TABLE user( id int PRIMARY KEY NOT NULL AUTO_INCREMENT, name varchar(40) NOT NULL, email varchar(50) NOT NULL, password varchar(100) NOT NULL, bio varchar(100), hobby varchar(100), file_image_profile_url varchar(150));

	CREATE TABLE notes( id int PRIMARY KEY AUTO_INCREMENT NOT NULL, judul varchar(100) NOT NULL, content TEXT NOT NULL, file_image_note_url varchar(100), user_id int NOT NULL, FOREIGN KEY (user_id) REFERENCES user(id));

	INSERT INTO user VALUES(NULL, 'luffy', 'luffy@gmail.com', '123qwe', 'Ingin Menjadi raja bajak laut', 'daging, petualang', 'user/2/345654.jpg');
	INSERT INTO user VALUES(NULL, 'dinnar', 'dinnar@gmail.com', '123qwe', 'Ingin Menjadi Dj Terkenal', 'dugem, music', 'user/3/4354.jpg');

	INSERT INTO notes VALUES(NULL, 'Wano', 'Petualangan di negeri samurai, Wano', 'user/2/2134554.jpg', '2', 'petualangan');
	INSERT INTO notes VALUES(NULL, 'Whole Cake', 'Petualangan di Pulau Yonko Big Mom, Whole Cake', 'user/2/2435354.jpg', '2', 'petualangan, yonko, big mom');

	INSERT INTO notes VALUES(NULL, 'Project', 'Membuat Project applikasi nodejs yang menggunakan database mysql', 'user/1/2343544.jpg', '1', 'Project, nodejs, mysql, database');
	INSERT INTO notes VALUES(NULL, 'Game', 'Membuat game tictac toe menggunakan c++', 'user/1/23324324.jpg', '1', 'Game, c++, tictac toe');

	INSERT INTO notes VALUES(NULL, 'Party Melolo', 'party di melolo', 'user/3/2345324.jpg', '3', 'party, melolo');
	INSERT INTO notes VALUES(NULL, 'Party Mauliru', 'Party di Mauliru di akhiri dengan kacau', 'user/3/22345654.jpg', '3', 'party, mauliru, kacau');


	UPDATE user SET hobby='Coding, Programming, WebDev' WHERE id=1;

	SELECT * FROM notes WHERE user_id=1 AND kategori LIKE '%Project%';

	SELECT * FROM notes WHERE user_id=2 AND kategori LIKE '%yonko%';

	DELETE FROM notes WHERE id=x;

	DELETE FROM user WHERE id=x;
