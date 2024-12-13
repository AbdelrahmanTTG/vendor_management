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
   public function source_lang()
    {
        return $this->hasOne (Language::class, "id","source_lang");
    }
    public function major()
    {
        return $this->hasOne(Major::class, "id",'major');
    }
    public function target_lang()
    {
        return $this->hasOne (Language::class, "id","target_lang");
    }
    public function main_subject()
    {
        return $this->hasOne(MainSubjectMatter::class, "id", 'main_subject');
    }

    public function sub_subject()
    {
        return $this->hasOne(MainSubjectMatter::class, "id", 'sub_subject');
    }
    public function region()
    {
        return $this->belongsTo(Regions::class, 'region');
    }
    public function timezone()
    {
        return $this->belongsTo(TimeZone::class, 'timezone');
    }
    public function vendorFiles()
    {
        return $this->hasMany(VendorFile::class, 'vendor_id');
    }
    public function vendor_sheet()
    {
        return $this->hasMany(VendorSheet::class, 'vendor', 'id');
    }

      public function vendor_education()
    {
        return $this->belongsTo(VendorEducation::class, "id",'vendor_id');
    }
      public function vendor_test()
    {
        return $this->belongsTo(vendorTest::class, "id",'vendor_id');
    }
       public function vendor_experiences()
    {
        return $this->belongsTo(Experience::class,"id", 'vendor_id');
    }
    public function bank_details()
    {
    return $this->hasOneThrough(
        BankDetails::class,
        BillingData::class, 
        'vendor_id', 
        'billing_data_id', 
        'id', 
        'id' 
    );
    }
      public function vendorBillingData()
    {
        return $this->hasMany(BillingData::class, 'vendor_id');
    }
    protected $fillable = [
        'name',
        'email',
        'password',
        'type',
        'status' ,
        'prfx_name',
        'contact_name' ,
        'legal_Name' ,
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
        'reject_reason',
        'contact_ProZ',
        'contact_linked_in',
        'contact_other1',
        'contact_other2',
        'contact_other3',
        'Anothernumber',

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
          //  'password' => 'hashed',
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
    public static function SelectData($searchTerm = null)
    {
        if ($searchTerm) {
            $query = self::where('name', 'like', '%' . $searchTerm . '%');
        } else {
            $query = self::select('id', 'name')->limit(5);
        }
        return $query->get();
    }

}
