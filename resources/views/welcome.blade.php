<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>Laravel</title>

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
.customDatePickerWidth > div.react-datepicker-wrapper, 
.customDatePickerWidth > div > div.react-datepicker__input-container
.customDatePickerWidth > div > div.react-datepicker__input-container input {
   width: 100%;
}
</style>

<body>
  <div id="root"></div>
  @vite('resources/js/main.jsx')
</body>

</html>