DROP TABLE IF EXISTS TB_HEROS;

CREATE TABLE TB_HEROS (
    ID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
    NAME TEXT NOT NULL,
    POWER TEXT NOT NULL
)

--create
INSERT INTO TB_HEROS (NAME, POWER)
VALUES
('Flash', 'Speed'),
('Wonder Woman', 'Super strength'),
('Batman', 'Money'),
('Supergirl', 'Super strength and speed')

--read
SELECT * FROM TB_HEROS;
SELECT * FROM TB_HEROS WHERE NAME = 'Wonder Woman';

--update
UPDATE TB_HEROS
SET NAME = 'Green Arrow', POWER = 'Money'
WHERE ID = 1;

--delete
DELETE FROM TB_HEROS WHERE ID=3;