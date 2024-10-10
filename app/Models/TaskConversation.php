<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskConversation extends Model
{
    use HasFactory;
    protected $table = 'job_task_conversation';
    protected $fillable = [
        'message',        
        'task',        
        'from',        
        'created_by',        
        'created_at'   
     ];
    public $timestamps = false;

    public function user()
    {
        return  $this->belongsTo(User::class, 'created_by')->select(['user_name']);
    }
                   
}
