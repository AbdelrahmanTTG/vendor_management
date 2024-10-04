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
table{
  th{
    font-size: 12px;
  }
}


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
}
input.leg::placeholder {
    color: red !important; 
    opacity: 1 !important; 
    text-align: center !important; 
    
}
.container-btn-file {
        display: flex;
        position: relative;
        justify-content: center;
        align-items: center;
        color: #fff;
        width: 100%;
        border-style: none;
        padding: 1em 2em;
        border-radius: 0.5em;
        overflow: hidden;
        z-index: 1;
        box-shadow: 4px 8px 10px -3px rgba(0, 0, 0, 0.356);
        transition: all 250ms;
    }

    .container-btn-file input[type="file"] {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
    }

    .container-btn-file>svg {
        margin-right: 1em;
    }


    .container-btn-file:hover::before {
        width: 100%;
    }
</style>

<body>
  <div id="root"></div>
  @vite('resources/js/main.jsx')
</body>

</html>