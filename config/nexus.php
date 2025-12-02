<?php

return [

    // Default fallback link
    'default' => env('NEXUS_DEFAULT', 'https://aixnexus.com'),

    // Brand-specific Nexus links
    'brands' => [
        1  => env('NEXUS_TTG', 'https://aixnexus.com/thetranslationgate.com/'),
        2  => env('NEXUS_LZR', 'https://aixnexus.com/localizera.com/'),
        3  => env('NEXUS_ELZ', 'https://aixnexus.com/europelocalize.com/'),
        11 => env('NEXUS_COL', 'https://aixnexus.com/columbuslang.com/'),
    ],

    // VM Support Emails
    'support_emails' => [
        1  => 'vm.support@thetranslationgate.com',
        2  => 'vm.support@localizera.com',
        3  => 'vm.support@europelocalize.com',
        11 => 'vm.support@columbuslang.com',
    ],

    // Email subjects
    'subjects' => [
        1  => "The Translation Gate || Nexus ",
        2  => "Localizera || Nexus ",
        3  => "Europe Localize || Nexus ",
        11 => "ColumbusLang || Nexus ",
    ],

];
