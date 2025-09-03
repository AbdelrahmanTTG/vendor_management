<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Nexus | Site Manager</title>
</head>
<body style="font-family: Arial, sans-serif; font-size:14px; color:#333;">
    <p>Dear {{ $mailData['user_name'] }},</p>

    <p>{!! $mailData['body'] ?? '' !!}</p>

    @if(isset($mailData['comment']) && !empty($mailData['comment']))
        <p><strong>Reply:</strong> {!! $mailData['comment'] !!}</p>
    @endif

    @if(isset($mailData['msgData']) && !empty($mailData['msgData']))
        <p>{!! $mailData['msgData'] !!}</p>
    @endif

    <p>Thank you</p>
</body>
</html>
