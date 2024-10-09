<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class OfferList extends Model
{
    use HasFactory;
    protected $table = 'job_offer_list';

    public function generateTaskCode()
    {       
        $taskCode = Job::findOrFail($this->job_id)->code;
        $id = DB::select(" show table status where name='job_task' ");
        $jobCode = $taskCode . '-' . $id[0]->Auto_increment;

        return $jobCode;
    }
                   
}
