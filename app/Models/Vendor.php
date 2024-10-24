<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Vendor extends Authenticatable  implements JWTSubject
{
    use HasFactory, Notifiable ,HasApiTokens;
    protected $table = 'vendor';
    public $timestamps = false;


    public static function vendor($email , $password){
        $encryptedPassword = base64_encode($password);
        $vendor =  self::where('email', $email)
        ->where('password', $encryptedPassword)
        ->first();
        return $vendor; 
    }
    public function country()
    {
        return $this->belongsTo(Countries::class, 'country'); 
    }

    public function nationality()
    {
        return $this->belongsTo(Countries::class, 'nationality'); 
    }


    protected $fillable = [
        'name',
        'email',
        'password',
        'type',
        'status' ,
        'prfx_name',
        'contact_name' ,
        'legal_name' ,
        'phone_number',
        'contact' ,
        'region',
        'country',
        'nationality' ,
        'timezone',
        'street' ,
        'city' ,
        'note' ,
        'address' ,
        'reject_reason'
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
