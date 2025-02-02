<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        /* Reset styles for email clients */
        body {
            margin: 0;
            padding: 0;
            min-width: 100%;
            font-family: Arial, sans-serif;
            line-height: 1.5;
            background-color: #f4f4f4;
            color: #333333;
        }
        
        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 30px;
            border: 1px solid #dddddd;
        }

        .header {
            text-align: center;
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eeeeee;
        }

        .button {
            display: inline-block;
            margin: 15px 5px;
            padding: 12px 25px;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            text-align: center;
        }

        .button-accept {
            background-color: #2e7d32;
        }

        .button-reject {
            background-color: #c62828;
        }

        .message-block {
            margin: 20px 0;
            padding: 15px;
            background-color: #f8f9fa;
            border-left: 4px solid #4CAF50;
        }

        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            color: #666666;
            font-size: 12px;
            border-top: 1px solid #eeeeee;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin: 0; color: #2c3e50;">Join Our Team at {{ $team->name }}</h2>
        </div>

        <p>Hello,</p>
        <p>You've been invited by <strong>{{ $team->owner->name }}</strong> to join the <strong>{{ $team->name }}</strong> team as a <strong>{{ ucfirst($invitation->role) }}</strong>.</p>

        @if ($invitation->message)
        <div class="message-block">
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #2c3e50;">Message from {{ $team->owner->name }}:</p>
            <blockquote style="margin: 0; color: #666666; font-style: italic;">
                {{ $invitation->message }}
            </blockquote>
        </div>
        @endif

        <p style="margin: 20px 0;">Please respond to this invitation:</p>
        <div style="text-align: center;">
            <a href="{{ $acceptUrl }}" class="button button-accept" target="_blank">Accept Invitation →</a>
            <a href="{{ $rejectUrl }}" class="button button-reject" target="_blank">Decline Invitation</a>
        </div>

        <p style="color: #666666; font-size: 14px; margin-top: 25px;">
            If you didn't request this invitation or believe this was sent in error, you can safely ignore this email.
        </p>

        <div class="footer">
            <p style="margin: 0;">© {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
            <p style="margin: 5px 0 0 0; font-size: 11px; color: #999999;">
                This is an automated message. Please do not reply directly to this email.
            </p>
        </div>
    </div>
</body>
</html>