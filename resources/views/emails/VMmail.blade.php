@extends('layouts.email')

@section('styles')
<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        padding: 20px;
    }
    .email-container {
        background-color: #ffffff;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    }
    .email-header {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 10px;
    }
    .email-content {
        font-size: 16px;
        line-height: 1.5;
    }
    .email-footer {
        margin-top: 20px;
        font-size: 14px;
        color: #555;
    }
    .btn {
        display: inline-block;
        padding: 10px 15px;
        background-color: #007bff;
        color: #ffffff;
        text-decoration: none;
        border-radius: 5px;
    }
</style>
@endsection

@section('content')
<div class="email-container">
    <div class="email-header">Dear vendor,</div>
    <div class="email-content">
@if($type === 'Create_password')
        <p>A password has been created for your account.</p>
        <p>Your new password is <strong>{{ $password }}</strong></p>
        <p>If you have any questions or feedback, we’re always keen to hear from you and assist you via  <a href="mailto:vm.support@thetranslationgate.com">vm.support@thetranslationgate.com</a>.</p>
@endif

    </div>
    <div class="email-footer">
        <p>Thank you,</p>
        <p>Vendor Management Team</p>
        <p>lingo talents</p>
    </div>
</div>
@endsection
