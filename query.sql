CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `karyawan_wisnu` AS
select
    (
    select
        count(0)
    from
        `karyawan` `k2`
    where
        (`k2`.`nip` <= `k`.`nip`)) AS `nomor`,
    `k`.`nip` AS `nip`,
    `k`.`nama` AS `nama`,
    `k`.`alamat` AS `alamat`,
    (case
        when (`k`.`gend` = 'L') then 'Laki-laki'
        when (`k`.`gend` = 'P') then 'Perempuan'
    end) AS `gender`,
    date_format(`k`.`tgl_lahir`, '%d %M %Y') AS `Tanggal Lahir`
from
    `karyawan` `k`;

call karyawan_wisnu();

CREATE PROCEDURE sp_add_kary_wisnu(
    IN p_nip VARCHAR(255),
    IN p_nama VARCHAR(255),
    IN p_alamat VARCHAR(255),
    IN p_gender CHAR(1),
    IN p_photo VARCHAR(255),
    IN p_tgl_lahir DATE,
    IN p_status INT,
    IN p_insertat VARCHAR(100),
    IN p_updateat VARCHAR(100),
    OUT p_result VARCHAR(255)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        DECLARE error_message VARCHAR(255);
        GET DIAGNOSTICS CONDITION 1 error_message = MESSAGE_TEXT;
        ROLLBACK;
        INSERT INTO log_trx_api (user_id, api, request, response, insert_at)
        VALUES (1, '/insert', 'request', CONCAT('Failed to save due to error: ', error_message), NOW());
        SET p_result = 'Failed to add employee data';
    END;

    START TRANSACTION;
    
    INSERT INTO karyawan (nip, nama, alamat, gend, photo, tgl_lahir, status, insert_at, update_at, id)
    VALUES (p_nip, p_nama, p_alamat, p_gender, p_photo, p_tgl_lahir, p_status, p_insertat, p_updateat, 0);

    IF ROW_COUNT() > 0 THEN
        INSERT INTO log_trx_api (user_id, api, request, response, insert_at)
        VALUES (1, '/insert', 'request', 'Successfully added employee data', NOW());
        COMMIT;
        SET p_result = 'Success';
    ELSE
        INSERT INTO log_trx_api (user_id, api, request, response, insert_at)
        VALUES (1, '/insert', 'request', 'Failed to add employee data', NOW());
        SET p_result = 'Failed to add employee data';
        ROLLBACK;
    END IF;

END;

SET @p_result = '';


CALL sp_add_kary_wisnu(
    '20290003',   
    'John Doe',  
    'Jl. ABC',    
    'L',          
    'photo_path', 
    '1990-01-01', 
    1,           
    '2021-11-05 15:49:36',   
    '2022-06-02 08:13:54',   
    @p_result     
);

SELECT @p_result AS result;