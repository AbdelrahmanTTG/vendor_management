ALTER TABLE `master_user` ADD `use_system` VARCHAR(10) NULL AFTER `employees_id`;
update `master_user` set `use_system` = 'ERP';
update `master_user` set `use_type` = '1';
ALTER TABLE `screen` ADD `use_system` VARCHAR(10) NULL AFTER `menu`;
update `screen` set `use_system` = 'ERP';
ALTER TABLE `master_user` ADD `reset_token` text NULL ;
ALTER TABLE `master_user` ADD `token_created` datetime NULL;
ALTER TABLE `master_user` ADD `token_expiry` datetime NULL ;
ALTER TABLE `job` ADD `rate` DOUBLE NULL;
ALTER TABLE `job` ADD `lead` int(11) NULL;
ALTER TABLE `job` ADD `attach_type` int(1) NULL;
ALTER TABLE `job` ADD `job_file1` text NULL;
ALTER TABLE `job` ADD `job_file2` text NULL;
ALTER TABLE `job` ADD `job_file1_name` text NULL;
ALTER TABLE `job` ADD `job_file2_name` text NULL;
ALTER TABLE `job` ADD `job_link` text NULL;
ALTER TABLE `vm_setup`MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
ALTER TABLE `vm_setup` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT;
update job_task t set brand = (select brand from vendor where id = t.vendor);
update job_offer_list t set brand = (select brand from vendor where FIND_IN_SET(id,t.vendor_list) );
CREATE TABLE apiuser (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        api_key VARCHAR(255) NOT NULL UNIQUE,
        expires_at DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
INSERT INTO apiuser (name, api_key, expires_at) 
    VALUES ('External User', 'G0l8NGEDgidMD0A4EybukR0ZILQTXqmw', '2026-03-02 13:19:04');
CREATE TABLE notifications (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        sender_email VARCHAR(255) NOT NULL,
        receiver_email VARCHAR(255) NOT NULL,
        content VARCHAR(255) NOT NULL,
        screen VARCHAR(255) NOT NULL,
        screen_id VARCHAR(255) NOT NULL,
        status TINYINT(1) NOT NULL DEFAULT 0,
        creator VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
CREATE TABLE notification_reads (
        id INT PRIMARY KEY AUTO_INCREMENT,
        notification_id INT NOT NULL,
        user_id INT NOT NULL,
        read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (notification_id) REFERENCES notifications(id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE (notification_id, user_id) 
    )ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci
CREATE TABLE aliasmails (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255)   NOT NULL,
        email VARCHAR(255)   NOT NULL,
        brand_id INT(11) NOT NULL,
        status TINYINT(1) NOT NULL DEFAULT 1
    )ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci
CREATE TABLE mailer (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        user_id INT(11) NOT NULL,
        alias_id INT(11) NOT NULL,
        status TINYINT(1) NOT NULL DEFAULT 1,
        CONSTRAINT mailer_ibfk_1 FOREIGN KEY (alias_id) REFERENCES aliasmails(id) 
            ON DELETE CASCADE 
            ON UPDATE CASCADE
    )
-- This is already present Nexus 
    ALTER TABLE it_tickets
        ADD COLUMN priority INT(11) NULL,
        ADD COLUMN span varchar(50) NULL,
        ADD COLUMN classification INT(11) NULL,
        ADD COLUMN status INT(11) NOT NULL DEFAULT 1,
        ADD COLUMN type VARCHAR(255)   NULL,
        ADD COLUMN action INT(11) NULL,
        ADD COLUMN assign_to INT(11) NULL,
        ADD COLUMN closure_status INT(11) NULL,
        ADD COLUMN reason_rejection VARCHAR(255)   NULL,
        ADD COLUMN pending_it VARCHAR(255)   NULL,
        ADD COLUMN pending_user VARCHAR(255)   NULL,
        ADD COLUMN resolution_method VARCHAR(255)   NULL
    ALTER TABLE automation_service_types
        ADD COLUMN using_system INT(11) NULL;
    UPDATE automation_service_types
        SET using_system = 1;
    CREATE TABLE log_it (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ticket_id INT NOT NULL,
        action INT NOT NULL COMMENT '(1:view , 2:update , 3:open , 4:assign , 5:reject , 6:transfer , 7:pending_it , 8:pending_user , 9:close)',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INT NOT NULL
        );
    CREATE TABLE it_comments (
        id INT(11) PRIMARY KEY AUTO_INCREMENT,
        ticket_id INT(11) NOT NULL,
        comment TEXT NOT NULL,
        file TEXT NOT NULL,
        emp_id INT(11) NOT NULL,
        using_system TINYINT(1) NOT NULL,
        created_at DATETIME NOT NULL,
        created_by INT(11) NOT NULL
        )
    CREATE TABLE priority_time (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        span VARCHAR(255),
        description VARCHAR(255),
        status TINYINT(1) NOT NULL DEFAULT 1,
        time_response_minutes INT NOT NULL,
        time_resolution_minutes INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    CREATE TABLE it_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        central_email VARCHAR(255) NULL,
        );
    CREATE TABLE it_classification (
        id INT(11) NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        status TINYINT(1) NOT NULL DEFAULT 1,
        PRIMARY KEY (id)
        );
    ALTER TABLE automation_tickets ADD COLUMN ref INT(11) NULL
    CREATE TABLE vmTicketType (
        id INT(11) PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        vmtype TINYINT(1) NOT NULL DEFAULT 0,
        Active TINYINT(1) NOT NULL
        );
    CREATE TABLE payment_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type TINYINT(1) NOT NULL,
        request_date DAte NOT NULL,
        due_date DAte NOT NULL,
        requester VARCHAR(255) NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        currency INT(11) NOT NULL,
        recipient VARCHAR(255) NOT NULL,
        receipt_id int(11) null,
        description TEXT,
        file VARCHAR(255)  NULL,
        status TINYINT NOT NULL DEFAULT 0,
        approval_from INT(11)  NULL  ,
        approve_date datetime  NULL  ,
        reason_rejection  VARCHAR(255)  NULL  ,
        doc TINYINT(1)   NOT NULL DEFAULT 0,
        emp_id INT(11) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_by INT(11) NOT NULL

        )
    CREATE TABLE payment_request_comments (
        id INT(11) PRIMARY KEY AUTO_INCREMENT,
        request_id INT(11) NOT NULL,
        comment TEXT NOT NULL,
        file TEXT NOT NULL,
        emp_id INT(11) NOT NULL,
        created_at DATETIME NOT NULL,
        created_by INT(11) NOT NULL
    )
    ALTER TABLE `permission` ADD `export` int(1) NULL ;
    CREATE TABLE user_permission (
        id INT(11) NOT NULL AUTO_INCREMENT,
        permission_id INT(11) NOT NULL,
        user_id INT(11) NOT NULL ,
        PRIMARY KEY (id)
    )
    ALTER TABLE `languages` ADD `Active` TINYINT(1) NULL DEFAULT 0

    INSERT INTO `screen` 
    (`id`, `groups`, `name`, `url`, `menu`,`use_system`)
    VALUES
    (283,	22,	'Actions Payment'	,	'account/actionPayment',	'0',	'ERP'	),
    (282,	22,	'Payment Requests',	'account/indexPayment',	'0'	,'ERP')	,
    (281,	22,	'Payment Requests',	'account/paymentRequest',	'1',	'ERP'	),
    (280,	20,	'Setting',	'it/settings',	'1',	'ERP'	),
    (288,	1,	'Alias mail',	'AliasEmail'	,'1'	,'VM'	),
    (285,	22,	'Payment request report	',	'account/report'	,'0'	,'ERP'	)
    (284,	22,	'Withdrawal',	'account/withdrawals'	,'0'	,'ERP'	),
    (286,	25,	'Upload Projects By File',	'settings/addProjectsByFile'	,'1'	,'ERP'	)

    ALTER TABLE acc_setup
    ADD COLUMN email  VARCHAR(255) NULL
    ALTER TABLE `cashout` ADD `request_id` INT(11) NULL AFTER `brand`;
    ALTER TABLE `bankout` ADD `request_id` INT(11) NULL AFTER `brand`;
    ALTER TABLE acc_setup ADD COLUMN main_account varchar(255) NULL
    ALTER TABLE acc_setup CHANGE COLUMN email main_email VARCHAR(255) NULL;
    UPDATE acc_setup SET main_account = '6.2 Withdrawl';
    ALTER TABLE acc_setup ADD COLUMN user1 INT(11) NULL
    ALTER TABLE acc_setup ADD COLUMN user2 INT(11) NULL
    ALTER TABLE acc_setup ADD COLUMN acc1 INT(11) NULL
    ALTER TABLE acc_setup ADD COLUMN acc2 INT(11) NULL
    UPDATE acc_setup SET user1 = 54;
    UPDATE acc_setup SET user2 = 51;
    UPDATE acc_setup SET acc1 = 724;
    UPDATE acc_setup SET acc2 = 335;
    CREATE TABLE update_messages (
        id INT(11) NOT NULL AUTO_INCREMENT,
        start_date DATE NULL,
        end_date DATE null,
        msg_header text null,
        msg_body text null,
        in_role text null,
        PRIMARY KEY (id)
    )
    CREATE TABLE  withdrawals (
        id INT(11) NOT NULL AUTO_INCREMENT,
        trn_code VARCHAR(15)  NULL,
        serial VARCHAR(10)  NULL,
        trns_type VARCHAR(15)  NULL,
        request_id INT(11) NULL,
        payment_type int NULL,
        request_type int null,
        payment_method int null,
        user_id int null,
        emp_id INT(11)  NULL,
        user_acc INT(11) NULL ,
        user_acc_id INT(11) NULL ,
        user_acc_name INT(11) NULL ,
        
        payment_acc int null,
        payment_acc_id int null,
        payment_acc_name VARCHAR(255)  NULL,
        cdate DATETIME null,
        amount DECIMAL(15,2)  NULL,
        currency INT  NULL,
        rate DECIMAL(18,5) NULL,  
        doc_file VARCHAR(255)  NULL,
        doc_name VARCHAR(255)  NULL,
        desc_file VARCHAR(255)  NULL,
        rem TEXT null,
        brand int null,
        created_at DATETIME NOT NULL,
        created_by INT(11) NOT NULL,
        entry_id INT(11) NOT NULL,
        status INT(1),
        PRIMARY KEY (id)
    )
    ALTER TABLE `payment_requests` ADD `desc_file` text NULL ;
    ALTER TABLE `payment_requests` ADD COLUMN user_id INT(11)  NULL;

    ALTER TABLE `entry_data_total` ADD COLUMN request_id INT(11)  NULL;

    ALTER TABLE `entry_data_total` ADD COLUMN request_id INT(11)  NULL;

    ALTER TABLE `job` ADD COLUMN product_line INT(11)  NULL after price_list;

    UPDATE job j
    JOIN job_price_list jp ON j.price_list = jp.id
    SET j.product_line = jp.product_line;
    CREATE TABLE  job_task (
            id INT AUTO_INCREMENT PRIMARY KEY,
            task_name VARCHAR(255) NOT NULL,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL
        )

    ALTER TABLE job_task ADD COLUMN invoice_id INT UNSIGNED NULL;
    CREATE TABLE  job_task_conversation (
            id INT AUTO_INCREMENT PRIMARY KEY,
            file TEXT NULL,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL
        )
    ALTER TABLE regions ADD COLUMN Active BOOLEAN DEFAULT FALSE
    ALTER TABLE countries ADD COLUMN Active BOOLEAN DEFAULT FALSE
    ALTER TABLE fields ADD COLUMN Active BOOLEAN DEFAULT FALSE
    ALTER TABLE currency ADD COLUMN Active BOOLEAN DEFAULT FALSE
    ALTER TABLE tools  ADD COLUMN Active BOOLEAN DEFAULT FALSE
    ALTER TABLE languages  ADD COLUMN Active BOOLEAN DEFAULT FALSE
    ALTER TABLE unit  ADD COLUMN Active BOOLEAN DEFAULT FALSE
    ALTER TABLE languages_dialect ADD COLUMN Active BOOLEAN DEFAULT FALSE
    ALTER TABLE screen ADD COLUMN use_system VARCHAR(10) NULL AFTER menu;
    ALTER TABLE `vm_setup` ADD `vm_setup` TEXT NULL , ADD `erp_uploads_folder_path` TEXT NULL ;
    ALTER TABLE `vm_setup` ADD COLUMN`pm_email` VARCHAR(255) NULL,ADD `vm_email` VARCHAR(255) NUL
    ALTER TABLE `job_task` ADD `brand` INT(11) NULL ;
    ALTER TABLE `job_offer_list` ADD `brand` INT(11) NULL ;
    CREATE TABLE IF NOT EXISTS vendor_aval_tot (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `name` VARCHAR(255) NULL,
            `email` VARCHAR(255) NULL,
            `contact` VARCHAR(255) NULL,
            `country` TEXT NULL,
            `type` INT NULL,
            `source_lang` TEXT NULL,
            `target_lang` TEXT NULL,
            `dialect` TEXT NULL,
            `service` TEXT NULL,
            `task_type` TEXT NULL,  
            `unit` TEXT NULL,   
            `subject` TEXT NULL,  
            `tools` TEXT NULL,
            `rate` DECIMAL(18,5) NULL,  
            `mothertongue` TEXT NULL, 
            `nda` INT NULL, 
            `vendor_count` INT NULL,
            `attach_file` text null,
            `email_subject` text null,
            `email_body` text null,	
            `status` INT NULL,
            `brand` int null,
            `duration` int null,
            `created_by` int(11) NOT NULL,
            `created_at` datetime NOT NULL,
            `start_at` datetime NOT NULL,
            `email_from` text  NULL,
            `email_cc` text  NULL
        )
CREATE TABLE IF NOT EXISTS vendor_aval_det (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `tot_id` INT,
            `vendor` int null,
            `name` TEXT NULL,
            `email` TEXT NULL,
            `vendor_status` int null,
            `source_lang` TEXT NULL,
            `target_lang` TEXT NULL,
            `dialect` TEXT NULL,
            `service` TEXT NULL,
            `task_type` TEXT NULL,
            `unit` TEXT NULL,
            `rate` DECIMAL(18,5) NULL,  
            `contact` TEXT NULL,
            `phone_number` TEXT NULL,
            `country` TEXT NULL,
            `mother_tongue` TEXT NULL,
            `nda` TEXT NULL,
            `subjects` TEXT NULL,
            `tools` TEXT NULL,
            `vendor_type` TEXT NULL,
            `task_count` int NULL,
            `status` TEXT NULL,
            `reasons` TEXT NULL,
            `reminder` int null,
            
            FOREIGN KEY (tot_id) REFERENCES vendor_aval_tot(id)
    )
ALTER TABLE `vendor_aval_det` ADD COLUMN`email_status` int NULL 
CREATE TABLE holidays (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `start_date` datetime  NULL,
            `end_date` datetime  NULL,
            `description` text  NULL
            )
CREATE TABLE companies_master (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `brand` int null,
            `name` VARCHAR(255) NULL,
            `start_at` datetime NOT NULL,
            `excel_file` VARCHAR(255) NULL,
            `duration` int null,
            `email_from` text  NULL,
            `email_cc` text  NULL,
            `email_subject` text null,
            `email_body` text null,	
            `status` INT NULL,
            `email_count` INT NULL,
            `attach_file` text null,	
            `created_by` int(11) NOT NULL,
            `created_at` datetime NOT NULL
            
        )
CREATE TABLE companies_detailed (
                `id` INT AUTO_INCREMENT PRIMARY KEY,
                `tot_id` INT,
                `ser` INT,
                `name` TEXT NULL,
                `email` TEXT NULL,
                `email_status` TEXT NULL,
                FOREIGN KEY (tot_id) REFERENCES vendor_aval_tot(id)
            )
update screen set url ='campaign/',name='Campaigns' where  id = 175,
INSERT INTO `screen` (`id`, `groups`, `name`, `url`, `menu`,`use_system`) VALUES ('165', '5', 'Vendor Availability', 'vendor/vendoravailability', '1','ERP');,
-- END

ALTER TABLE `attendance_log` ADD `latitude` VARCHAR(255)  NULL AFTER `TNAKEY`;
ALTER TABLE `attendance_log` ADD `longitude` VARCHAR(255) NULL AFTER `latitude`;
CREATE TABLE hr_setup (
    id INT(11) NOT NULL AUTO_INCREMENT,
    latitude VARCHAR(255) NOT NULL,
    longitude VARCHAR(255) NOT NULL,
    distance INT(11) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
INSERT INTO `screen` (`groups`, `name`, `url`, `menu`,`use_system`) VALUES ( '287','15', 'HR Settings', 'hr/hr_settings', '1','ERP');
ALTER TABLE job_task_conversation MODIFY COLUMN file TEXT NULL
CREATE TABLE IF NOT EXISTS job_task_log (
            id INT AUTO_INCREMENT PRIMARY KEY,
            comment TEXT NULL,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL
        )
ALTER TABLE job_task_log MODIFY COLUMN comment TEXT NULL
CREATE TABLE vendortimezone (
            id INT AUTO_INCREMENT PRIMARY KEY,
            zone TEXT NULL,
            gmt TEXT NULL,
            parent INT NULL,
            Active TINYINT NULL
        )
ALTER TABLE services ADD COLUMN Active BOOLEAN DEFAULT FALSE
ALTER TABLE task_type ADD COLUMN Active BOOLEAN DEFAULT FALSE
ALTER TABLE payment_method  ADD COLUMN Active BOOLEAN DEFAULT false
CREATE TABLE  messaging_types (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            Active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL
        )
CREATE TABLE University_Degree (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            Active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL
        )
CREATE TABLE vendor_payment_methods (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            Active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL
        )
CREATE TABLE mainsubject (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            Active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL
        )
ALTER TABLE fields ADD COLUMN parent INT(11) DEFAULT NULL;
CREATE TABLE IF NOT EXISTS vendor_invoices (
            id INT AUTO_INCREMENT PRIMARY KEY,
            vendor_id INT,
            invoice_date VARCHAR(255),
            vpo_file TEXT,
            verified TINYINT,
            payment_method TINYINT NULL,
            total DOUBLE,
            billing_legal_name VARCHAR(255) NULL,
            billing_currency VARCHAR(255) NULL,
            billing_due_date VARCHAR(255) NULL,
            billing_address TEXT NULL,
            bank_name VARCHAR(255) NULL,
            bank_account_holder VARCHAR(255) NULL,
            bank_swift VARCHAR(255) NULL,
            bank_IBAN VARCHAR(255) NULL,
            bank_address VARCHAR(255) NULL,
            wallet_method VARCHAR(255) NULL,
            wallet_account VARCHAR(255) NULL,
            brand_id INT ,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL
        )
ALTER TABLE vendor
    ADD COLUMN nationality INT NULL,
    ADD COLUMN timezone VARCHAR(255) NULL,
    ADD COLUMN reject_reason TEXT NULL,
    ADD COLUMN prfx_name VARCHAR(255) NULL,
    ADD COLUMN city VARCHAR(255) NULL,
    ADD COLUMN street VARCHAR(255) NULL,
    ADD COLUMN address VARCHAR(255) NULL,
    ADD COLUMN contact_name VARCHAR(255) NULL,
    ADD COLUMN legal_Name VARCHAR(255) NULL,
    ADD COLUMN region INT NULL,
    ADD COLUMN vendor_source VARCHAR(255) NULL
CREATE TABLE   billing_data (
            id INT AUTO_INCREMENT PRIMARY KEY,
            vendor_id INT,
            billing_legal_name VARCHAR(255),
            city VARCHAR(255),
            street VARCHAR(255),
            billing_address TEXT,
            billing_currency VARCHAR(255) NOT NULL,
            billing_status CHAR(1) NULL,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL
        )
CREATE TABLE bank_details (
            id INT AUTO_INCREMENT PRIMARY KEY,
            billing_data_id INT,
            bank_name VARCHAR(255),
            account_holder VARCHAR(255),
            swift_bic VARCHAR(255),
            iban VARCHAR(255),
            payment_terms VARCHAR(255),
            bank_address TEXT,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL
        )
CREATE TABLE wallets_payment_methods (
            id INT AUTO_INCREMENT PRIMARY KEY,
            billing_data_id INT,
            method VARCHAR(255),
            account VARCHAR(255),
            defaults TINYINT NULL,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL
        )
CREATE TABLE IF NOT EXISTS `vm_setup` (
            `id` INT(11) NOT NULL AUTO_INCREMENT,
            `acceptance_offers_hours` DOUBLE DEFAULT NULL,
            `unaccepted_offers_email` VARCHAR(200) DEFAULT NULL,
            `enable_evaluation` TINYINT NOT NULL DEFAULT '0',
            `v_ev_name1` VARCHAR(255) NULL,
            `v_ev_per1` INT(3) NULL,
            `v_ev_name2` VARCHAR(255) NULL,
            `v_ev_per2` INT(3) NULL,
            `v_ev_name3` VARCHAR(255) NULL,
            `v_ev_per3` INT(3) NULL,
            `v_ev_name4` VARCHAR(255) NULL,
            `v_ev_per4` INT(3) NULL,
            `v_ev_name5` VARCHAR(255) NULL,
            `v_ev_per5` INT(3) NULL,
            `v_ev_name6` VARCHAR(255) NULL,
            `v_ev_per6` INT(3) NULL,
            `pm_email` VARCHAR(255) NULL,
            `vm_email` VARCHAR(255) NULL,
            `accounting_email` VARCHAR(255) NULL,
            PRIMARY KEY (`id`)
) 
ALTER TABLE vendor
            MODIFY COLUMN name TEXT NOT NULL,
            MODIFY COLUMN email VARCHAR(255) NOT NULL,
            MODIFY COLUMN password VARCHAR(255) NULL,
            MODIFY COLUMN first_login INT NULL,
            MODIFY COLUMN account_status VARCHAR(255) NULL,
            MODIFY COLUMN contact TEXT NULL,
            MODIFY COLUMN phone_number TEXT NULL,
            MODIFY COLUMN mother_tongue TEXT NULL,
            MODIFY COLUMN country TEXT NULL,
            MODIFY COLUMN communication TEXT NULL,
            MODIFY COLUMN commitment TEXT NULL,
            MODIFY COLUMN profile TEXT NULL,
            MODIFY COLUMN subject TEXT NULL,
            MODIFY COLUMN tools TEXT NULL,
            MODIFY COLUMN sheet_fields TEXT NULL,
            MODIFY COLUMN sheet_tools TEXT NULL,
            MODIFY COLUMN cv TEXT NULL,
            MODIFY COLUMN certificate TEXT NULL,
            MODIFY COLUMN NDA TEXT NULL,
            MODIFY COLUMN brand INT NULL,
            MODIFY COLUMN color VARCHAR(255) NULL,
            MODIFY COLUMN color_comment TEXT NULL,
            MODIFY COLUMN type VARCHAR(255) NOT NULL,
            MODIFY COLUMN status VARCHAR(255) NOT NULL,
            MODIFY COLUMN favourite TINYINT NULL,
            MODIFY COLUMN external_id INT NULL,
            MODIFY COLUMN quality VARCHAR(255) NULL,
            ADD COLUMN contact_linked_in VARCHAR(255) NOT NULL,
            ADD COLUMN contact_ProZ VARCHAR(255) NOT NULL,
            ADD COLUMN contact_other1 VARCHAR(255) NULL,
            ADD COLUMN contact_other2 VARCHAR(255) NULL,
            ADD COLUMN contact_other3 VARCHAR(255) NULL,
            ADD COLUMN Anothernumber VARCHAR(255) NULL,
            ADD COLUMN PM VARCHAR(255) NULL
CREATE TABLE    logger_master (
            id INT AUTO_INCREMENT PRIMARY KEY,
            screen DOUBLE NOT NULL,
            table_name VARCHAR(255) NOT NULL,
            transaction_id_name VARCHAR(255) NOT NULL,
            transaction_id DOUBLE NOT NULL,
            type TINYINT NOT NULL,
            created_by DOUBLE NOT NULL,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL)
CREATE TABLE    skills (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL);
CREATE TABLE    experiences (
            id INT AUTO_INCREMENT PRIMARY KEY,
            vendor_id INT UNSIGNED NOT NULL,
            started_working VARCHAR(255) NOT NULL,
            experience_year INT NOT NULL,
            summary TEXT NULL,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL);
CREATE TABLE    vendor_skill (
            id INT AUTO_INCREMENT PRIMARY KEY,
            vendor_id INT NOT NULL,
            skill_id INT NOT NULL,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL);
CREATE TABLE vendor_files ( id INT AUTO_INCREMENT PRIMARY KEY, vendor_id INT NOT NULL, file_path VARCHAR(255) NOT NULL, file_title VARCHAR(255) NOT NULL, file_content TEXT NOT NULL, created_at TIMESTAMP NULL DEFAULT NULL, updated_at TIMESTAMP NULL DEFAULT NULL);
CREATE TABLE instant_messaging ( id INT AUTO_INCREMENT PRIMARY KEY, vendor_id INT NOT NULL, messaging_type_id INT NOT NULL, contact VARCHAR(255) NOT NULL, created_at TIMESTAMP NULL DEFAULT NULL, updated_at TIMESTAMP NULL DEFAULT NULL);
ALTER TABLE vendor_sheet ADD COLUMN Status VARCHAR(255) NULL, ADD COLUMN sub_subject VARCHAR(255) NULL, ADD COLUMN dialect_target VARCHAR(255) NULL;
CREATE TABLE vendorTest ( id INT AUTO_INCREMENT PRIMARY KEY, vendor_id INT, test_type VARCHAR(1), test_result VARCHAR(1), test_upload VARCHAR(255), source_lang INT, target_lang INT, main_subject INT, sub_subject INT, service INT, created_at TIMESTAMP NULL DEFAULT NULL, updated_at TIMESTAMP NULL DEFAULT NULL);
CREATE TABLE vendor_education ( id INT AUTO_INCREMENT PRIMARY KEY, vendor_id INT NOT NULL, university_name VARCHAR(255) NOT NULL, latest_degree VARCHAR(255) NOT NULL, year_of_graduation YEAR NOT NULL, major VARCHAR(255) NOT NULL, created_at TIMESTAMP NULL DEFAULT NULL, updated_at TIMESTAMP NULL DEFAULT NULL);
CREATE TABLE formatsTable ( id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, name VARCHAR(255) NOT NULL, table VARCHAR(255) NOT NULL, format TEXT NOT NULL, status BOOLEAN DEFAULT FALSE, created_at TIMESTAMP NULL DEFAULT NULL, updated_at TIMESTAMP NULL DEFAULT NULL);
ALTER TABLE `vm_ticket` ADD `brand_id` INT(11) NULL AFTER `created_at`;
CREATE TABLE IF NOT EXISTS `pm_setup` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `brand` int(11) NOT NULL,
            `min_profit_percentage` double DEFAULT NULL,
            `qmemail` varchar(200) DEFAULT NULL,
            `qmemailsub` varchar(200) DEFAULT NULL,
            `qmemaildesc` text,
            `block_v_no` int(11) DEFAULT NULL,
            `pm_ev_name1` varchar(100) DEFAULT NULL,
            `pm_ev_per1` int(11) DEFAULT NULL,
            `pm_ev_name2` varchar(100) DEFAULT NULL,
            `pm_ev_per2` int(11) DEFAULT NULL,
            `pm_ev_name3` varchar(100) DEFAULT NULL,
            `pm_ev_per3` int(11) DEFAULT NULL,
            `pm_ev_name4` varchar(100) DEFAULT NULL,
            `pm_ev_per4` int(11) DEFAULT NULL,
            `pm_ev_name5` varchar(100) DEFAULT NULL,
            `pm_ev_per5` int(11) DEFAULT NULL,
            `pm_ev_name6` varchar(100) DEFAULT NULL,
            `pm_ev_per6` int(11) DEFAULT NULL,
            `cuemailsub` varchar(200) DEFAULT NULL,
            `cuemaildesc` text,
            `c_ev_name1` varchar(100) DEFAULT NULL,
            `c_ev_per1` int(11) DEFAULT NULL,
            `c_ev_name2` varchar(100) DEFAULT NULL,
            `c_ev_per2` int(11) DEFAULT NULL,
            `c_ev_name3` varchar(100) DEFAULT NULL,
            `c_ev_per3` int(11) DEFAULT NULL,
            `c_ev_name4` varchar(100) DEFAULT NULL,
            `c_ev_per4` int(11) DEFAULT NULL,
            `c_ev_name5` varchar(100) DEFAULT NULL,
            `c_ev_per5` int(11) DEFAULT NULL,
            `c_ev_name6` varchar(100) DEFAULT NULL,
            `c_ev_per6` int(11) DEFAULT NULL,
            PRIMARY KEY (`id`)
            ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS messages ( id INT AUTO_INCREMENT PRIMARY KEY, sender_email VARCHAR(255) NOT NULL, receiver_email VARCHAR(255) NOT NULL, content TEXT NOT NULL, is_read BOOLEAN DEFAULT FALSE, status BOOLEAN DEFAULT FALSE, created_at TIMESTAMP NULL DEFAULT NULL, updated_at TIMESTAMP NULL DEFAULT NULL );
INSERT INTO `screen` (`groups`, name, url, menu, use_system) VALUES 
('289','5', 'Vendor Personal Data', 'PersonalData', '0', 'VM'),
 ('5', 'Vendor Messaging', 'Messaging', '0', 'VM'), ('5', 'Vendor VM note', 'VMnote', '0', 'VM'),
  ('5', 'Vendor Files Certificate', 'FilesCertificate', '0', 'VM'),
   ('5', 'Vendor Education', 'Education', '0', 'VM'), 
   ('5', 'Vendor Experience', 'Experience', '0', 'VM'), 
   ('5', 'Vendor Test', 'Test', '0', 'VM'),
    ('5', 'Vendor Billing', 'Billing', '0', 'VM'),
     ('5', 'Vendor Portal User', 'Portal_User', '0', 'VM'),
      ('5', 'Vendor Price List', 'Price_List', '0', 'VM'),
       ('5', 'Vendor Evaluation', 'Evaluation', '0', 'VM'), 
       ('5', 'Vendor Feedback', 'Feedback', '0', 'VM'),
        ('5', 'Vendor Vacation', 'Vacation', '0', 'VM'),
         ('5', 'Vendor History', 'History', '0', 'VM');
INSERT INTO `screen` (`id`, `groups`, `name`, `url`, `menu`, `use_system`) VALUES ("290", '7', 'VM Activity Sheet', 'reports/vmActivity', '1', 'VM');
INSERT INTO screen ( `id`,`groups`, name, url, menu, use_system) VALUES ("291", 5, 'Add vendor profile', 'vendors/Profiletest', 0, 'VM'), ( 5, 'edit vendor profile', 'vendors/editprofiletest', 0, 'VM');
ALTER TABLE logger ADD COLUMN master_id BIGINT UNSIGNED NULL;
ALTER TABLE `vendor` ADD `Approval_nda_date` DATE NULL AFTER `PM`;
UPDATE vendor SET first_login = 0;
ALTER TABLE `vm_setup` ADD `amount` DECIMAL(11,2) NULL AFTER `erp_uploads_folder_path`;
ALTER TABLE `billing_data` ADD `bank_required` TINYINT NULL DEFAULT '1' AFTER `billing_currency`;
ALTER TABLE `billing_data` ADD `wallet_required` TINYINT NULL DEFAULT '1' AFTER `bank_required`;
INSERT INTO screen ( id,`groups`, name, url, menu, use_system) VALUES ("292", 5, 'Vendor profile', 'vendors/Profile', 1, 'VM');
INSERT INTO screen ( id,`groups`, name, url, menu, use_system) VALUES ( "293",5, 'Tickets', 'Tickets', 1, 'VM');
INSERT INTO screen ( id,`groups`, name, url, menu, use_system) VALUES ( "294",5, 'View Ticket', 'ViewTicket', 0, 'VM');
INSERT INTO screen ( id,`groups`, name, url, menu, use_system) VALUES ( "295",7, 'Vendors Tasks', 'reports/allTasks', 1, 'VM');
UPDATE `screen` SET `use_system` = 'ERP,VM' WHERE `screen`.`id` = 106;
UPDATE `screen` SET `name` = 'Region' WHERE `screen`.`id` = 267;
UPDATE `screen` SET `url` = 'Region' WHERE `screen`.`id` = 267;
UPDATE `screen` SET `use_system` = 'ERP,VM' WHERE `screen`.`id` = 267;
UPDATE `screen` SET `use_system` = 'ERP,VM' WHERE `screen`.`id` = 270;
UPDATE `screen` SET `use_system` = 'ERP,VM' WHERE `screen`.`id` = 271;
UPDATE `screen` SET `use_system` = 'ERP,VM' WHERE `screen`.`id` = 272;
UPDATE `screen` SET `use_system` = 'ERP,VM' WHERE `screen`.`id` = 275;
UPDATE `screen` SET `use_system` = 'ERP,VM' WHERE `screen`.`id` = 276;
UPDATE `screen` SET `use_system` = 'ERP,VM' WHERE `screen`.`id` = 268;
UPDATE `screen` SET `use_system` = 'ERP,VM' WHERE `screen`.`id` = 269;
UPDATE `screen` SET `use_system` = 'ERP,VM' WHERE `screen`.`id` = 273;
UPDATE `screen` SET `use_system` = 'ERP,VM' WHERE `screen`.`id` = 274;
UPDATE `screen` SET `use_system` = 'ERP,VM' WHERE `screen`.`id` = 277;
UPDATE `screen` SET `use_system` = 'ERP,VM' WHERE `screen`.`id` = 278;
UPDATE `screen` SET `use_system` = 'ERP,VM' WHERE `screen`.`id` = 278;
UPDATE `screen` SET `use_system` = 'ERP,VM' WHERE `screen`.`id` = 123;
UPDATE `screen` SET `use_system` = 'ERP,VM' WHERE `screen`.`id` = 124;
UPDATE `screen` SET `use_system` = 'ERP,VM' WHERE `screen`.`id` = 120;
ALTER TABLE withdrawals ADD manual_rate TINYINT(1) NULL ;
ALTER TABLE `payment_requests` ADD `entry_exit` TINYINT NULL AFTER `user_id`;
INSERT INTO `screen` (`id`, `groups`, `name`, `url`, `menu`,`use_system`) VALUES ('296', '1', 'Dashboard', 'admin/Excel', '0','ERP');
 CREATE TABLE `vendors_mother_tongue` ( `id` int UNSIGNED NOT NULL AUTO_INCREMENT, `vendor_id` int NOT NULL, `language_id` int NOT NULL, `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY (`id`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  ALTER TABLE `vm_ticket` ADD `requester_function` TINYINT(1) NULL COMMENT '1:sales/2:pm' AFTER `brand_id`;
  ALTER TABLE `vm_ticket_time` ADD `assign_to` INT NULL AFTER `status`;
  ALTER TABLE `vendor` ADD `profile_status` TINYINT(1) NOT NULL DEFAULT '0' AFTER `Approval_nda_date`;
ALTER TABLE `vendor_invoices` CHANGE `wallet_method` `wallet_method` INT(11) NULL DEFAULT NULL;
ALTER TABLE `vendor` ADD COLUMN `vendor_brands` VARCHAR(255) NULL AFTER `brand`;
UPDATE `vendor` SET `vendor_brands` = `brand`;
ALTER TABLE `vendor_sheet` ADD COLUMN `sheet_brand` INT NULL ;
UPDATE `vendor_sheet` vs
JOIN `vendor` v ON vs.vendor = v.id
SET vs.sheet_brand = v.brand;

ALTER TABLE `fields` ADD `Active` INT NOT NULL AFTER `parent`;
ALTER TABLE `vendor_sheet` ADD `updated_at` DATETIME NULL AFTER `sheet_brand`;
ALTER TABLE `vendor_sheet` ADD `updated_by` INT NOT NULL AFTER `updated_at`;


INSERT INTO `screen` (`id`, `groups`, `name`, `url`, `menu`, `use_system`) VALUES (NULL, '7', 'Vendors Tasks', 'reports/allTasks', '1', 'VM'); 
INSERT INTO `permission` (`id`, `groups`, `screen`, `role`, `follow`, `add`, `edit`, `delete`, `view`, `menu_order`) VALUES (NULL, '5', '299', '21', '1', '1', '1', '1', '1', '0') ;
INSERT INTO `permission` (`id`, `groups`, `screen`, `role`, `follow`, `add`, `edit`, `delete`, `view`, `menu_order`) VALUES (NULL, '5', '299', '1', '1', '1', '1', '1', '1', '0') ;
INSERT INTO `permission` (`id`, `groups`, `screen`, `role`, `follow`, `add`, `edit`, `delete`, `view`, `menu_order`) VALUES (NULL, '5', '299', '32', '1', '1', '1', '1', '1', '0') ;
INSERT INTO `screen` (`id`, `groups`, `name`, `url`, `menu`, `use_system`) VALUES (NULL, '5', 'Tickets', 'tickets', '1', 'VM'); 
INSERT INTO `permission` (`id`, `groups`, `screen`, `role`, `follow`, `add`, `edit`, `delete`, `view`, `menu_order`) VALUES (NULL, '5', '300', '21', '1', '1', '1', '1', '1', '0') ;
INSERT INTO `permission` (`id`, `groups`, `screen`, `role`, `follow`, `add`, `edit`, `delete`, `view`, `menu_order`) VALUES (NULL, '5', '300', '1', '1', '1', '1', '1', '1', '0') ;
INSERT INTO `permission` (`id`, `groups`, `screen`, `role`, `follow`, `add`, `edit`, `delete`, `view`, `menu_order`) VALUES (NULL, '5', '300', '32', '1', '1', '1', '1', '1', '0') ;
INSERT INTO `screen` (`id`, `groups`, `name`, `url`, `menu`, `use_system`) VALUES (NULL, '5', 'View Ticket', 'viewTicket', '0', 'VM'); 
INSERT INTO `permission` (`id`, `groups`, `screen`, `role`, `follow`, `add`, `edit`, `delete`, `view`, `menu_order`) VALUES (NULL, '5', '301', '21', '1', '1', '1', '1', '1', '0') ;
INSERT INTO `permission` (`id`, `groups`, `screen`, `role`, `follow`, `add`, `edit`, `delete`, `view`, `menu_order`) VALUES (NULL, '5', '301', '1', '1', '1', '1', '1', '1', '0') ;
INSERT INTO `permission` (`id`, `groups`, `screen`, `role`, `follow`, `add`, `edit`, `delete`, `view`, `menu_order`) VALUES (NULL, '5', '301', '32', '1', '1', '1', '1', '1', '0') ;

INSERT INTO `permission` (`id`, `groups`, `screen`, `role`, `follow`, `add`, `edit`, `delete`, `view`, `menu_order`) VALUES
(NULL, '5', '289', '21', '1', '1', '1', '1', '1', '0'),
(NULL, '7', '290', '21', '1', '1', '1', '1', '1', '0'),
(NULL, '5', '291', '21', '1', '1', '1', '1', '1', '0'),
(NULL, '5', '292', '21', '1', '1', '1', '1', '1', '0'),
(NULL, '5', '293', '21', '1', '1', '1', '1', '1', '0'),
(NULL, '5', '294', '21', '1', '1', '1', '1', '1', '0'),
(NULL, '7', '295', '21', '1', '1', '1', '1', '1', '0'),
(NULL, '5', '334', '21', '1', '1', '1', '1', '1', '0'),
(NULL, '5', '335', '21', '1', '1', '1', '1', '1', '0'),
(NULL, '5', '336', '21', '1', '1', '1', '1', '1', '0'),
(NULL, '5', '337', '21', '1', '1', '1', '1', '1', '0'),
(NULL, '5', '338', '21', '1', '1', '1', '1', '1', '0'),
(NULL, '5', '339', '21', '1', '1', '1', '1', '1', '0'),
(NULL, '5', '340', '21', '1', '1', '1', '1', '1', '0'),
(NULL, '5', '341', '21', '1', '1', '1', '1', '1', '0'),
(NULL, '5', '342', '21', '1', '1', '1', '1', '1', '0'),
(NULL, '5', '343', '21', '1', '1', '1', '1', '1', '0'),
(NULL, '5', '344', '21', '1', '1', '1', '1', '1', '0'),
(NULL, '5', '345', '21', '1', '1', '1', '1', '1', '0'),
(NULL, '5', '346', '21', '1', '1', '1', '1', '1', '0'),
(NULL, '7', '347', '21', '1', '1', '1', '1', '1', '0'),
(NULL, '5', '348', '21', '1', '1', '1', '1', '1', '0'),
(NULL, '5', '349', '21', '1', '1', '1', '1', '1', '0'),
(NULL, '1', '351', '21', '1', '1', '1', '1', '1', '0'),
(NULL, '5', '350', '21', '1', '1', '1', '1', '1', '0');
UPDATE vendor_sheet AS vs
JOIN fields AS f ON vs.subject = f.id 
SET vs.sub_subject = f.parent
WHERE vs.subject IS NOT NULL;
UPDATE vendor v
JOIN countries c ON v.country = c.id
SET v.region = c.region;
UPDATE vendor v
JOIN vendortimezone tz ON v.country = tz.parent
SET v.timezone = tz.id
WHERE tz.active = 1;
ALTER TABLE `vendor_sheet` CHANGE `sub_subject` `subject_main` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL;
