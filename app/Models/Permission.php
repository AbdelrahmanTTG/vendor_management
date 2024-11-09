<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    use HasFactory;
    protected $table = 'permission';
    public static  function getGroupByRole($role)
    {
        return self::distinct()
            ->select('groups')
            ->where('role', $role)
            ->where('groups', '!=', '0')
            ->orderBy('groups', 'asc')
            ->get();
    }
    public function screen()
    {
        return $this->belongsTo(Screen::class, 'screen', 'id');
    }
    public static function getScreenByGroupAndRole($groups, $role)
    {
        if (empty($groups)) {
            return collect();
        }
        return self::with('screen') // Ensure you're eager loading the 'screen' relationship
            ->where('groups', $groups) // Filter by 'groups' in the 'permission' table
            ->where('role', $role) // Filter by 'role' in the 'permission' table
            ->whereHas('screen', function ($query) use ($groups) { // Use $groups in the closure
                $query->where('menu', '1') // Filter 'screen' table by 'menu' column
                    ->where('groups', $groups) // Filter 'screen' table by 'groups' column
                    ->where('use_system', 'like', '%VM%') // Filter by 'use_system'
                    ->groupBy('id');
            })
            ->orderBy('menu_order') // Order by 'menu_order' in the 'permission' table
            ->get();


        // return self::with('screen')
        //     ->where('groups', $groups)
        //     ->where('role', $role)
        //     ->whereHas('screen', function ($query) {
        //         $query->where('menu', '1')
        //             ->where('groups', $groups)
        //             ->where('use_system', 'like', '%VM%');
        //     })
        //     ->orderBy('menu_order')
        //     ->get();
    }
}
