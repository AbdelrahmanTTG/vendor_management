<!DOCTYPE html>

<html>

<head>

    <title>Lingo Talents</title>

</head>

<body>

    <h3>{{ $mailData['title']??'' }}</h3>

    <p>{{ $mailData['body']??'' }}</p>
    <p>{{ $body ??'' }}</p>

    @if(isset($mailData['taskDetails']))
        @if(is_object($mailData['taskDetails'][0]))
            @foreach($mailData['taskDetails'] as $k => $row)?>
                <table border="0" cellpadding="2" cellspacing="0">
                    <tbody>
                        <tr>
                            <td width="400">
                                <p class="job-head">Task Details:</p>
                            </td>
                            <td width="400">
                                <p class="job-number">{{ $row->subject}}</p>
                            </td>
                            <td width="400">
                                <p class="name">{{ $row->code }}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table border="0" cellpadding="2" cellspacing="0">
                    <tbody>
                        <tr>
                            <td width="1200">
                                <p><strong>PO :</strong> {{$row->code}} </p>
                            </td>
                        </tr>
                        <tr>
                            <td width="1200">
                                <p><strong>Task Type:</strong> {{$row->taskTypeName->name}} </p>
                            </td>
                        </tr>                
                        <tr>
                            <td width="1200">
                                <p><strong>Project Manager:</strong> {{ $row->user->user_name }} </p>
                            </td>

                        </tr>
                        <tr>
                            <td width="1200">
                                <p><strong>Vendor Name:</strong> {{ $row->getVendor->name }} </p>
                            </td>

                        </tr>
                        <tr>
                            <td width="1200">
                                <p><strong>Source Language:</strong> {{ $row->jobPrice->priceList->SourceName->name }} </p>
                            </td>
                        </tr>
                        <tr>
                            <td width="1200">
                                <p><strong>Target Language :</strong> {{ $row->jobPrice->priceList->TargetName->name }} </p>
                            </td>
                        </tr>
                        <tr>
                            <td width="1200">
                                <p><strong>Total Count :</strong> {{$row->count }} {{ $row->unitName->name }} </p>
                            </td>
                        </tr>
                        <tr>
                            <td width="1200">
                                <p><strong>Rate :</strong> {{$row->rate }} {{ $row->currencyName->name }} </p>
                            </td>
                        <tr>
                            <td width="1200">
                                <p><strong>Price :</strong> {{$row->count*$row->rate }} {{ $row->currencyName->name }} </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            @endforeach
        @else
            <table border="0" cellpadding="2" cellspacing="0">
                <tbody>
                    <tr>
                        <td width="400">
                            <p class="job-head">Task Details:</p>
                        </td>
                        <td width="400">
                            <p class="job-number">{{$mailData['taskDetails']->subject }}</p>
                        </td>
                        <td width="400">
                            <p class="name">{{ $mailData['taskDetails']->code }}</p>
                        </td>
                    </tr>
                </tbody>
            </table>
            @if(isset($mailData['showMoreDetails']) && $mailData['showMoreDetails'] == 1)
            <table border="0" cellpadding="2" cellspacing="0">
                    <tbody>
                       
                        <tr>
                            <td width="1200">
                                <p><strong>Task Type:</strong> {{$mailData['taskDetails']->taskTypeName->name}} </p>
                            </td>
                        </tr> 
                        <tr>
                            <td width="1200">
                                <p><strong>Source Language:</strong> {{ $mailData['taskDetails']->jobPrice->priceList->SourceName->name }} </p>
                            </td>
                        </tr>
                        <tr>
                            <td width="1200">
                                <p><strong>Target Language :</strong> {{ $mailData['taskDetails']->jobPrice->priceList->TargetName->name }} </p>
                            </td>
                        </tr>
                        <tr>
                            <td width="1200">
                                <p><strong>Total Count :</strong> {{$mailData['taskDetails']->count }} {{ $mailData['taskDetails']->unitName->name }} </p>
                            </td>
                        </tr>
                        <tr>
                            <td width="1200">
                                <p><strong>Rate :</strong> {{$mailData['taskDetails']->rate }} {{ $mailData['taskDetails']->currencyName->name }} </p>
                            </td>
                        <tr>
                            <td width="1200">
                                <p><strong>Deadline for Delivery :</strong> {{$mailData['taskDetails']->delivery_date }} </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            @endif
        @endif
    @endif

    @if(isset($mailData['data']))
        <p>{{ $mailData['data'] }}</p>
    @endif
    <p>Thank you</p>

</body>

</html>