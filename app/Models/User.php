<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Contracts\JWTSubject;


class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable, HasApiTokens;
    protected $table = 'master_user';
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    public static function authenticate($email, $password)
    {
        $email = trim($email);
        $encryptedPassword = base64_encode($password);

        return self::where('email', $email)
            ->where('password', $encryptedPassword)
            ->where('use_system', 'like', '%VM%')
            ->first();
    }
    public static function getUserAccount($user)
    {
        $brand = !empty($user->favourite_brand_id)
            ? $user->favourite_brand_id
            : DB::table('users')
            ->where('master_user_id', $user->id)
            ->where('status', '1')
            ->orderBy('id', 'asc') 
            ->value('brand');

        $userAccount = DB::table('users')
            ->where('employees_id', $user->employees_id)
            ->where('master_user_id', $user->id)
            ->where('brand', $brand)
            ->where('status', '1')
            ->first();

        if (!$userAccount) {
            $userAccount = DB::table('users')
                ->where('employees_id', $user->employees_id)
                ->where('master_user_id', $user->id)
                ->where('status', '1')
                ->orderBy('id', 'asc') 
                ->first();
        }

        return $userAccount;
    }

    public static function updateAccountData($userAccount)
    {
        $accountData = [
            'favourite_brand_id' => $userAccount->brand,
            'last_login' => now(),
        ];

        DB::table('master_user')
            ->where('id', $userAccount->master_user_id)
            ->update($accountData);
    }


    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}
