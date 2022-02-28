create database homepage2;

use homepage2;

CREATE TABLE userdb(
    userid varchar(15) not null primary key,
    userpw varchar(15) not null,
    username varchar(15) not null,
    nickname varchar(15) not null primary key,
    gender varchar(15) not null,
    phoneNumber int(15) not null,
    level int(1) not null,
    active int(1) not null
);

CREATE TABLE board(
    idx int auto_increment primary key,
    subject varchar(50) not null,
    nickname varchar(40) not null,
    content text not null,
    date timestamp DEFAULT CURRENT_TIMESTAMP not null,
    hit int not null,
    like int not null
);

CREATE TABLE replydb(
    bidx int not null,
    cidx int not null auto_increment primary key,
    bid varchar(15) not null,
    cid varchar(15) not null,
    reply varchar(140) not null,
    replydate timestamp DEFAULT CURRENT_TIMESTAMP not null,
    replylike int not null
);