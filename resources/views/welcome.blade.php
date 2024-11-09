<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- <link rel="icon" sizes="192x192" href="{{ asset('android-icon-192x192.png') }}"> -->

  <title>lingo talents</title>
  <!-- <title>{{ env('APP_NAME', 'Laravel') }}</title> -->
  <!-- <link rel="icon" href="{{ asset('build/images/app_icon.png') }}" type="image/png"> -->

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.bunny.net">
  <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
    rel="stylesheet">

</head>
<style>
  .customDatePickerWidth,
  .customDatePickerWidth>div.react-datepicker-wrapper,
  .customDatePickerWidth>div>div.react-datepicker__input-container .customDatePickerWidth>div>div.react-datepicker__input-container input {
    width: 100%;
  }

  table {
    th {
      font-size: 12px;
    }

    td {
      font-size: 12px;

    }
  }

  #page-body {
    padding-top: 0px;
  }

  /* 

.nav-link {
    white-space: nowrap; 
}

.nav-wrapper {
  position: relative;
  overflow: hidden; 
  
}

.nav-scroll {
  display: flex;
  overflow-x: auto; 
  scroll-behavior: smooth; 
}

.nav-scroll::-webkit-scrollbar {
  display: none; 
}

.scroll-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgb(0, 0, 0,0);
  border: none;
  cursor: pointer;
  z-index: 10;
 
}

.scroll-btn.left {
  left: 0;
}

.scroll-btn.right {
  right: 0;
} */
  input.leg::placeholder {
    color: red !important;
    opacity: 1 !important;
    text-align: center !important;

  }
</style>

<body>
  <div id="root"></div>
  @vite('resources/js/main.jsx')

</body>

</html>