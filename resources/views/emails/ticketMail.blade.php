<!DOCTYPE html>

<html>

<head>

    <title>Lingo Talents</title>

</head>

<body>

    <p>Dear  {{$mailData['user_name'] }},</p>

    <p>{!! $mailData['body']??'' !!}</p>

    @if(isset($mailData['comment']))
        <p>{!! $mailData['comment'] !!}</p>
    @endif

    <p>Thank you</p>

</body>

</html>