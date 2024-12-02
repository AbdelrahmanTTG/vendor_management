<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\TicketResource;
use App\Models\BrandUsers;
use App\Models\VmTicket;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReportsController extends Controller
{
    public function vmActivity(Request $request)
    {
        $validator = Validator::make($request->queryParams, [
            'created_by' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);
        if ($validator->fails()) {
            $msg['type'] = "error";
            $message = "";
            foreach ($validator->errors()->all() as $err) {
                $message .= $err;
            }
            $msg['message'] = $message;
            return response()->json($msg);
        } else {            
            $perPage = $request->input('per_page', 10);       
            $created_by = $request->queryParams['created_by'];
            $start_date = $request->queryParams['start_date'];
            $end_date = $request->queryParams['end_date'];
            $tickets = VmTicket::leftJoin('users', 'users.id', '=', 'vm_ticket.created_by')
                ->leftJoin('vm_ticket_time as t', function (JoinClause $join) {
                   $join->on('t.ticket', '=', 'vm_ticket.id' )
                   ->where('t.status',2);
                })
                ->leftJoin('vm_ticket_time as t2', function (JoinClause $join) {
                   $join->on('t2.ticket', '=', 'vm_ticket.id' )
                   ->where('t2.status',5);
                })
                ->leftJoin('vm_ticket_time as t3', function (JoinClause $join) {
                   $join->on('t3.ticket', '=', 'vm_ticket.id' )
                   ->where('t3.status',4);
                })
                ->leftJoin('vm_ticket_resource as r1', function (JoinClause $join) {
                   $join->on('r1.ticket', '=', 'vm_ticket.id' )
                   ->where('r1.type',2);
                })              
                ->select('vm_ticket.*', 'users.brand AS brand', 't.created_by AS opened_by', 't.created_at AS open_time', 't2.created_by AS closed_by', 't3.created_at AS closed_time')
                ->orderBy('vm_ticket.id', 'desc')
                ->groupBy('vm_ticket.id')
                ->whereBetween('vm_ticket.created_at', [$start_date, $end_date])
                ->whereIn('t.created_by',$created_by); 
                
            $tickets = $tickets->paginate($perPage);
            $links = $tickets->linkCollection();
            return response()->json(["Tickets" => TicketResource::collection($tickets), "Links" => $links]);
        }
    }

    public function getVmData()
    {       
        $users = BrandUsers::SelectVmData();
        return response()->json($users);
    }
}
