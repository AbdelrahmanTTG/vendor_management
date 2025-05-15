<?php
$host = '';
$dbname = '';
$username = '';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    $queries = [
        // Create job_task table if not exists
        "CREATE TABLE IF NOT EXISTS job_task (
            id INT AUTO_INCREMENT PRIMARY KEY,
            task_name VARCHAR(255) NOT NULL,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL
        );",

        // Add invoice_id column to job_task table if not exists
        "ALTER TABLE job_task ADD COLUMN invoice_id INT UNSIGNED NULL;",

        // Create job_task_conversation table if not exists
        "CREATE TABLE IF NOT EXISTS job_task_conversation (
            id INT AUTO_INCREMENT PRIMARY KEY,
            file TEXT NULL,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL
        );",

        // Modify file column in job_task_conversation table to be nullable
        "ALTER TABLE job_task_conversation
        MODIFY COLUMN file TEXT NULL;",

        // Create job_task_log table if not exists
        "CREATE TABLE IF NOT EXISTS job_task_log (
            id INT AUTO_INCREMENT PRIMARY KEY,
            comment TEXT NULL,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL
        );",

        // Modify comment column in job_task_log table to be nullable
        "ALTER TABLE job_task_log
        MODIFY COLUMN comment TEXT NULL;",

        // Adding Active column to regions table
        "ALTER TABLE regions
        ADD COLUMN Active BOOLEAN DEFAULT FALSE;",

        // Adding Active column to vendorTimeZone table

        "CREATE TABLE IF NOT EXISTS vendortimezone (
            id INT AUTO_INCREMENT PRIMARY KEY,
            zone TEXT NULL,
            gmt TEXT NULL,
            parent INT NULL,
            Active TINYINT NULL
        );",
        // Adding Active column to countries table
        "ALTER TABLE countries
        ADD COLUMN Active BOOLEAN DEFAULT FALSE;",

        // Adding Active column to fields table
        "ALTER TABLE fields
        ADD COLUMN Active BOOLEAN DEFAULT FALSE;",

        // Adding Active column to services table
        "ALTER TABLE services
        ADD COLUMN Active BOOLEAN DEFAULT FALSE;",

        // Adding Active column to task_type table
        "ALTER TABLE task_type
        ADD COLUMN Active BOOLEAN DEFAULT FALSE;",

        // Adding Active column to currency table
        "ALTER TABLE currency
        ADD COLUMN Active BOOLEAN DEFAULT FALSE;",

        // Adding Active column to tools table
        "ALTER TABLE tools
        ADD COLUMN Active BOOLEAN DEFAULT FALSE;",

        // Adding Active column to languages table
        "ALTER TABLE languages
        ADD COLUMN Active BOOLEAN DEFAULT FALSE;",

        // Adding Active column to unit table
        "ALTER TABLE unit
        ADD COLUMN Active BOOLEAN DEFAULT FALSE;",

        // Adding Active column to languages_dialect table
        "ALTER TABLE languages_dialect
        ADD COLUMN Active BOOLEAN DEFAULT FALSE;",
        "ALTER TABLE payment_method
        ADD COLUMN Active BOOLEAN DEFAULT false;",

        // Create messaging_types table if not exists
        "CREATE TABLE IF NOT EXISTS messaging_types (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            Active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL
        );",

        // Create University_Degree table if not exists
        "CREATE TABLE IF NOT EXISTS University_Degree (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            Active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL
        );",
        // Create vendor_payment_methods table if not exists
        "CREATE TABLE IF NOT EXISTS vendor_payment_methods (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            Active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL
        );",

        "CREATE TABLE mainsubject (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            Active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL
        );",
        "ALTER TABLE fields 
        ADD COLUMN parent INT(11) DEFAULT NULL;
        ",
        "CREATE TABLE IF NOT EXISTS vendor_invoices (
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
        );",
        "ALTER TABLE vendor
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
            ADD COLUMN vendor_source VARCHAR(255) NULL;",
        // Create the 'billing_data' table if it doesn't exist
        "CREATE TABLE IF NOT EXISTS billing_data (
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
        );",
        // Create the 'bank_details' table if it doesn't exist
        "CREATE TABLE IF NOT EXISTS bank_details (
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
        );",
        //  Create the 'wallets_payment_methods' table if it doesn't exist
        "CREATE TABLE IF NOT EXISTS wallets_payment_methods (
            id INT AUTO_INCREMENT PRIMARY KEY,
            billing_data_id INT,
            method VARCHAR(255),
            account VARCHAR(255),
            defaults TINYINT NULL,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL
        );",
        "CREATE TABLE IF NOT EXISTS `vm_setup` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;",


        // Alter the 'vendor' table to change column types
        "ALTER TABLE vendor
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
            ADD COLUMN PM VARCHAR(255) NULL,
            ;",


        // Create the 'messages' table if it doesn't exist
        "CREATE TABLE IF NOT EXISTS messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            sender_email VARCHAR(255) NOT NULL,
            receiver_email VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            status BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL
        );",
        // Create the 'logger_master' table if it doesn't exist
        "CREATE TABLE IF NOT EXISTS logger_master (
            id INT AUTO_INCREMENT PRIMARY KEY,
            screen DOUBLE NOT NULL,
            table_name VARCHAR(255) NOT NULL,
            transaction_id_name VARCHAR(255) NOT NULL,
            transaction_id DOUBLE NOT NULL,
            type TINYINT NOT NULL,
            created_by DOUBLE NOT NULL,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL);",
        // Create the 'skills' table if it doesn't exist
        "CREATE TABLE IF NOT EXISTS skills (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL);",
        // Create the 'experiences' table if it doesn't exist
        "CREATE TABLE IF NOT EXISTS experiences (
            id INT AUTO_INCREMENT PRIMARY KEY,
            vendor_id INT UNSIGNED NOT NULL,
            started_working VARCHAR(255) NOT NULL,
            experience_year INT NOT NULL,
            summary TEXT NULL,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL);",
        // Create the 'vendor_skill' table if it doesn't exist
        "CREATE TABLE IF NOT EXISTS vendor_skill (
            id INT AUTO_INCREMENT PRIMARY KEY,
            vendor_id INT NOT NULL,
            skill_id INT NOT NULL,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL);",
        // Create the 'vendor_files' table if it doesn't exist
        "CREATE TABLE IF NOT EXISTS vendor_files (
            id INT AUTO_INCREMENT PRIMARY KEY,
            vendor_id INT NOT NULL,
            file_path VARCHAR(255) NOT NULL,
            file_title VARCHAR(255) NOT NULL,
            file_content TEXT NOT NULL,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL);",
        //Create the 'instant_messaging' table if it doesn't exist
        "CREATE TABLE IF NOT EXISTS instant_messaging (
            id INT AUTO_INCREMENT PRIMARY KEY,
            vendor_id INT NOT NULL,
            messaging_type_id INT NOT NULL,
            contact VARCHAR(255) NOT NULL,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL);",
        // Add 'use_system' column to 'screen' table if it doesn't exist
        "ALTER TABLE screen
            ADD COLUMN use_system VARCHAR(10) NULL AFTER menu;",
        //'Status' and 'sub_subject' columns to 'vendor_sheet' table
        "ALTER TABLE vendor_sheet
            ADD COLUMN Status VARCHAR(255) NULL,
            ADD COLUMN sub_subject VARCHAR(255) NULL,
            ADD COLUMN dialect_target VARCHAR(255) NULL;
            ;",
        // Create 'vendorTest' table if it doesn't exist
        "CREATE TABLE IF NOT EXISTS vendorTest (
            id INT  AUTO_INCREMENT PRIMARY KEY,
            vendor_id INT,
            test_type VARCHAR(1),
            test_result VARCHAR(1),
            test_upload VARCHAR(255),
            source_lang INT,
            target_lang INT,
            main_subject INT,
            sub_subject INT,
            service INT,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL);",
        // Create 'vendor_education' table if it doesn't exist
        "CREATE TABLE IF NOT EXISTS vendor_education (
            id INT  AUTO_INCREMENT PRIMARY KEY,
            vendor_id INT NOT NULL,
            university_name VARCHAR(255) NOT NULL,
            latest_degree VARCHAR(255) NOT NULL,
            year_of_graduation YEAR NOT NULL,
            major VARCHAR(255) NOT NULL,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL);",
        // Create 'formatsTable' table if it doesn't exist
        "CREATE TABLE IF NOT EXISTS formatsTable (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            name VARCHAR(255) NOT NULL,
            table_name VARCHAR(255) NOT NULL,
            format TEXT NOT NULL,
            status BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL);",

        "ALTER TABLE `vm_ticket` ADD `brand_id` INT(11) NULL AFTER `created_at`",

        "ALTER TABLE `master_user` ADD COLUMN `use_system` VARCHAR(10) NULL AFTER `employees_id`",
        "ALTER TABLE `master_user` ADD COLUMN `use_type` int(1) NULL AFTER `use_system`;",
        "update `master_user` set `use_system` = 'ERP';",
        "update `master_user` set `use_type` = '1';",
        "ALTER TABLE `master_user` ADD COLUMN  `reset_token` text NULL ;",
        "ALTER TABLE `master_user` ADD COLUMN `token_created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP;",
        "ALTER TABLE `master_user` ADD COLUMN `token_expiry` datetime NULL ;",
        "ALTER TABLE `job` ADD COLUMN `rate` DOUBLE NULL;
        ALTER TABLE `job` ADD COLUMN`currency` int(11) NULL;
        ALTER TABLE `job` ADD COLUMN`revenue` DOUBLE NULL;
        ALTER TABLE `job` ADD COLUMN`revenue_local` DOUBLE NULL;
        ALTER TABLE `job` ADD COLUMN`lead` int(11) NULL;
        ALTER TABLE `job` ADD COLUMN`attach_type` int(1) NULL;
        ALTER TABLE `job` ADD COLUMN`job_file1` text NULL;
        ALTER TABLE `job` ADD COLUMN`job_file2` text NULL;
        ALTER TABLE `job` ADD COLUMN`job_file1_name` text NULL;
        ALTER TABLE `job` ADD COLUMN`job_file2_name` text NULL;
        ALTER TABLE `job` ADD `job_link` text NULL; ",
        "CREATE TABLE IF NOT EXISTS `pm_setup` (
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
            ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;",
        "ALTER TABLE `vm_setup`
        MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
        ALTER TABLE `vm_setup` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT; 
        ALTER TABLE `vm_setup` ADD COLUMN `enable_evaluation` TINYINT NOT NULL DEFAULT '0' AFTER `unaccepted_offers_email`;
        ALTER TABLE `vm_setup` ADD COLUMN`v_ev_name1` VARCHAR(255) NULL , ADD `v_ev_per1` INT(3) NULL ;  
        ALTER TABLE `vm_setup` ADD COLUMN`v_ev_name2` VARCHAR(255) NULL , ADD `v_ev_per2` INT(3) NULL ;  
        ALTER TABLE `vm_setup` ADD COLUMN`v_ev_name3` VARCHAR(255) NULL , ADD `v_ev_per3` INT(3) NULL ;  
        ALTER TABLE `vm_setup` ADD COLUMN`v_ev_name4` VARCHAR(255) NULL , ADD `v_ev_per4` INT(3) NULL ;  
        ALTER TABLE `vm_setup` ADD COLUMN`v_ev_name5` VARCHAR(255) NULL , ADD `v_ev_per5` INT(3) NULL ;  
        ALTER TABLE `vm_setup` ADD COLUMN`v_ev_name6` VARCHAR(255) NULL , ADD `v_ev_per6` INT(3) NULL ;
        ALTER TABLE `vm_setup` ADD `vm_setup` TEXT NULL , ADD `erp_uploads_folder_path` TEXT NULL ;
        ALTER TABLE `vm_setup` ADD COLUMN`pm_email` VARCHAR(255) NULL,ADD `vm_email` VARCHAR(255) NULL,  
        ADD `accounting_email` VARCHAR(255) NULL; ",
        "ALTER TABLE `job_task` ADD `brand` INT(11) NULL ;
         ALTER TABLE `job_offer_list` ADD `brand` INT(11) NULL ;",
        "CREATE TABLE IF NOT EXISTS vendor_aval_tot (
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
        );",
        "CREATE TABLE IF NOT EXISTS vendor_aval_det (
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
    );",
        "ALTER TABLE `vendor_aval_det` ADD COLUMN`email_status` int NULL ;",
        "CREATE TABLE IF NOT EXISTS holidays (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `start_date` datetime  NULL,
            `end_date` datetime  NULL,
            `description` text  NULL
            )",
        "CREATE TABLE IF NOT EXISTS companies_master (
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
            
        );",
        "CREATE TABLE companies_detailed (
                `id` INT AUTO_INCREMENT PRIMARY KEY,
                `tot_id` INT,
                `ser` INT,
                `name` TEXT NULL,
                `email` TEXT NULL,
                `email_status` TEXT NULL,
                
                FOREIGN KEY (tot_id) REFERENCES vendor_aval_tot(id)
            );",
        "update screen set url ='campaign/',name='Campaigns' where  id = 175",
        "INSERT INTO `screen` (`id`, `groups`, `name`, `url`, `menu`,`use_system`) VALUES ('165', '5', 'Vendor Availability', 'vendor/vendoravailability', '1','ERP');",
        "INSERT INTO `screen` (`id`, `groups`, `name`, `url`, `menu`, `use_system`) VALUES (NULL, '7', 'VM Activity Sheet', 'reports/vmActivity', '1', 'VM'); ",
        "INSERT INTO screen (groups, name, url, menu, use_system)
            VALUES
            ('5', 'Vendor Personal Data', 'PersonalData', '0', 'VM'),
            ('5', 'Vendor Messaging', 'Messaging', '0', 'VM'),
            ('5', 'Vendor VM note', 'VMnote', '0', 'VM'),
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
            ('5', 'Vendor History', 'History', '0', 'VM');",
        "INSERT INTO screen ( groups, name, url, menu, use_system) 
            VALUES 
            ( 5, 'Add vendor profile', 'vendors/Profiletest', 0, 'VM'),
            ( 5, 'edit vendor profile', 'vendors/editprofiletest', 0, 'VM');",
        "ALTER TABLE logger
            ADD COLUMN master_id UNSIGNED BIGINT NULL;",
        "CREATE TABLE apiuser (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    api_key VARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);",
        "INSERT INTO apiuser (name, api_key, expires_at) 
VALUES ('External User', 'G0l8NGEDgidMD0A4EybukR0ZILQTXqmw', '2026-03-02 13:19:04');",
        "CREATE TABLE notifications (
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
);",
        "CREATE TABLE notification_reads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    notification_id INT NOT NULL,
    user_id INT NOT NULL,
    read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (notification_id) REFERENCES notifications(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE (notification_id, user_id) 
);",
        "CREATE TABLE aliasmails (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) COLLATE  NOT NULL,
    email VARCHAR(255) COLLATE  NOT NULL,
    brand_id INT(11) NOT NULL,
    status TINYINT(1) NOT NULL DEFAULT 1
);
",
        "CREATE TABLE mailer (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    user_id INT(11) NOT NULL,
    alias_id INT(11) NOT NULL,
    status TINYINT(1) NOT NULL DEFAULT 1,
    CONSTRAINT mailer_ibfk_1 FOREIGN KEY (alias_id) REFERENCES aliasmails(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);
",
        "ALTER TABLE `vendor` ADD `Approval_nda_date` DATE NULL AFTER `PM`;
",
        "ALTER TABLE it_tickets
ADD COLUMN file VARCHAR(255) COLLATE utf8_general_ci NULL,
ADD COLUMN priority INT(11) NULL,
ADD COLUMN classification INT(11) NULL,
ADD COLUMN status INT(11) NOT NULL DEFAULT 1,
ADD COLUMN type VARCHAR(255) COLLATE utf8_general_ci NULL;",
        "ALTER TABLE automation_service_types
ADD COLUMN using_system INT(11) NULL;
",
        "UPDATE automation_service_types
SET using_system = 1;",
        "UPDATE vendor
SET first_login = 0;",
        "ALTER TABLE `vm_setup` ADD `amount` DECIMAL(11,2) NULL AFTER `erp_uploads_folder_path`;"
,
        "ALTER TABLE `billing_data` ADD `bank_required` TINYINT NULL DEFAULT '1' AFTER `billing_currency`;
",
        "ALTER TABLE `billing_data` ADD `wallet_required` TINYINT NULL DEFAULT '1' AFTER `bank_required`;
"

    ];

    // Execute the queries
    foreach ($queries as $query) {
        $pdo->exec($query); // Execute each SQL query
        echo "Query executed successfully!\n";
    }
} catch (PDOException $e) {
    echo " Database connection failed: " . $e->getMessage();
}
