<!DOCTYPE html>

<html>

<head>

    <title>Lingo Talents</title>

</head>

<body>

    <h3>{{ $mailData['title']??'' }}</h3>

    <p>{!! $mailData['body']??'' !!}</p>   


    @if(isset($mailData['personalData']) )
    <p> Personal Data : </p>
    <table border="0" cellpadding="2" cellspacing="0">
        <tbody>
            <tr>
                <td width="1200">
                    <p><strong>Vendor ID:</strong> {{$mailData['personalData']->id}} </p>
                </td>
            </tr>
            <tr>
                <td width="1200">
                    <p><strong>Name:</strong> {{$mailData['personalData']->name}} </p>
                </td>
            </tr>
            <tr>
                <td width="1200">
                    <p><strong>Contact Name:</strong>{{ $mailData['personalData']->prfx_name }} {{ $mailData['personalData']->contact_name }} </p>
                </td>
            </tr>
            <tr>
                <td width="1200">
                    <p><strong>Legal Name :</strong> {{ $mailData['personalData']->legal_Name }} </p>
                </td>
            </tr>
            <tr>
                <td width="1200">
                    <p><strong>Phone Number :</strong> {{$mailData['personalData']->phone_number }} <strong>Another Number :</strong> {{ $mailData['personalData']->Anothernumber }} </p>
                </td>
            </tr>
            <tr>
                <td width="1200">
                    <p><strong>Country of residence :</strong> {{ $mailData['personalData']->countryName->name }} </p>
                </td>
            <tr>
            <tr>
                <td width="1200">
                    <p><strong>Region :</strong> {{ $mailData['personalData']->regionName->name }} </p>
                </td>
            <tr>
            <tr>
                <td width="1200">
                    <p><strong>Nationality :</strong> {{ $mailData['personalData']->nationalityName->name }} </p>
                </td>
            <tr>
            <tr>
                <td width="1200">
                    <p><strong>Time Zone :</strong> {{ $mailData['personalData']->timeZoneName->gmt }} </p>
                </td>
            <tr>
                <td width="1200">
                    <p><strong>City / state :</strong> {{$mailData['personalData']->city }} </p>
                </td>
            </tr>
            <tr>
                <td width="1200">
                    <p><strong>Address :</strong> {{$mailData['personalData']->address }} </p>
                </td>
            </tr>
        </tbody>
    </table>
    @endif

    @if(isset($mailData['billingData']))
   
    <p><strong> Billing Data : </strong></p>
    <table border="0" cellpadding="2" cellspacing="0">
        <tbody>
            <tr>
                <td width="1200">
                    <p><strong>Vendor ID:</strong> {{$mailData['billingData']['billingData']->vendor_id}} </p>
                </td>
            </tr>
            <tr>
                <td width="1200">
                    <p><strong>Billing Legal Name:</strong> {{$mailData['billingData']['billingData']->billing_legal_name}} </p>
                </td>
            </tr>
            <tr>
                <td width="1200">
                    <p><strong> City / state:</strong> {{$mailData['billingData']['billingData']->city}} </p>
                </td>
            </tr>
            <tr>
                <td width="1200">
                    <p><strong> Street:</strong> {{$mailData['billingData']['billingData']->street}} </p>
                </td>
            </tr>
            <tr>
                <td width="1200">
                    <p><strong>Billing Address:</strong> {!! $mailData['billingData']['billingData']->billing_address !!} </p>
                </td>
            </tr>
            <tr>
                <td width="1200">
                    <p><strong>Billing Currency :</strong> {{$mailData['billingData']['billingData']->billing_currency->name }} </p>
                </td>
            </tr>
            @if(isset($mailData['billingData']['bankData']))
            <hr/>
            <tr>
                <td width="1200">
                    <hr/>
                    <p><strong>Bank details </strong> </p>
                </td>
            </tr>
            <tr>
                <td width="1200">
                    <p><strong>Bank name :</strong> {{$mailData['billingData']['bankData']->bank_name }}</p>
                </td>
            </tr>
            <tr>
                <td width="1200">
                    <p><strong>Account holder :</strong> {{ $mailData['billingData']['bankData']->account_holder }} </p>
                </td>
            </tr>
            <tr>
                <td width="1200">
                    <p><strong>SWIFT/BIC :</strong> {{$mailData['billingData']['bankData']->swift_bic }}</p>
                </td>
            <tr>
            <tr>
                <td width="1200">
                    <p><strong>IBAN :</strong> {{ $mailData['billingData']['bankData']->iban }} </p>
                </td>
            <tr>
                <td width="1200">
                    <p><strong>Bank Address :</strong> {{$mailData['billingData']['bankData']->bank_address }} </p>
                </td>
            </tr>
            @endif
            @if(isset($mailData['billingData']['walletData']))            
            <tr>
                <td width="1200">
                <hr/>
                    <p><strong>Wallets Payment methods</strong></p>
                </td>
            </tr>
                @foreach($mailData['billingData']['walletData'] as $row)
                <tr>
                    <td width="600">
                        <p><strong>Method :</strong> {{$row->methodName->name }} </p>
                    </td>            
                    <td width="600">
                        <p><strong>Account :</strong> {{$row->account }} </p>
                    </td>
                </tr>
                @endforeach
            @endif
        </tbody>
    </table>
    @endif

    <p>Thank you</p>

</body>

</html>