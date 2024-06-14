# Next.js Starter Kit for Laravel
This is a starter kit for Next.js with Laravel as backend. The features include:
- Authentication with Laravel Sanctum using Iron Session
- Protected routes
- i18n support with default locale removal from URL
- Some basic SEO support
- Sitemap and robots.txt generation

Keep in mind that this starter kit is not a one-size-fits-all solution. You may need to adjust it to your needs.
This is just a basic setup to get you started and save you some time on setting up the project and spare fist fights with Next.

## Installation
1. Clone the repository
2. Run `npm install`
3. Copy `.env.local.example` to `.env.local` and update the values
4. Run `npm run dev`

Before starting the development server, make sure to run the Laravel server as well.
You also need to properly configure Laravel to work with Next.js. You can find the instructions below.

## Using Docker
```bash
docker compose build
docker compose up -d
````

## Laravel Configuration
For routes, you can use Breeze/Jetstream `auth.php` file for reference.

You need to replace stateful domains in `sanctum.php` with your Next.js domain.
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s%s',
    'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
    env('APP_URL') ? ','.parse_url(env('APP_URL'), PHP_URL_HOST) : '',
    env('FRONTEND_URL') ? ','.parse_url(env('FRONTEND_URL'), PHP_URL_HOST) : ''
))),
```

Also, your `/api/user` route should return user data in following format:
```php
return response()->json([
    'user' => $request->user(),
]);
```

In order for verify/password reset emails to work properly, you need to point them to your frontend.
Add something like this to the boot method of your service provider:
```php
// App\Providers\AuthServiceProvider.php

ResetPassword::createUrlUsing(function (object $notifiable, string $token): string {
    $url = "/password-reset?token=$token&email={$notifiable->getEmailForPasswordReset()}";

    return config('app.frontend_url') . $url;
});

VerifyEmail::createUrlUsing(function (object $notifiable): string {
    $url = URL::temporarySignedRoute(
        'verification.verify',
        Carbon::now()->addMinutes(config('auth.verification.expire', 60)),
        [
            'id'   => $notifiable->getKey(),
            'hash' => sha1($notifiable->getEmailForVerification()),
        ],
        false
        );

    $targetUrl = str_replace('/api/auth/verify-email/', '', urldecode($url));

    return config('app.frontend_url').'/verify-email?verify=' . $targetUrl;
});
```

Remember to set `FRONTEND_URL` in your Laravel `.env` file.

Any changes to the Laravel configuration should be reflected in the Next.js configuration as well.