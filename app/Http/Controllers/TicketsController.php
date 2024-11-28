<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\TicketResource;
use App\Models\BrandUsers;
use App\Models\VmTicket;
use App\Models\VmTicketResponse;
use App\Models\VmTicketTeamResponse;
use App\Models\VmTicketTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;

class TicketsController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $brand = Crypt::decrypt($request->input('brand'));
        $tickets = VmTicket::leftJoin('users', 'users.id', '=', 'vm_ticket.created_by')
            ->select('vm_ticket.*', 'users.brand AS brand')
            ->orderBy('vm_ticket.id', 'desc')
            ->havingRaw('brand =' . $brand);
        if (!empty($request->queryParams)) {
            foreach ($request->queryParams as $key => $val) {
                if (!empty($val)) {
                    if (count($val) >= 1) {
                        $tickets->where(function ($query) use ($key, $val) {
                            foreach ($val as $k => $v) {
                                if ($k == 0) {
                                    $query->where('vm_ticket.' . $key,  $v);
                                } else {
                                    $query->orWhere('vm_ticket.' . $key,  $v);
                                }
                            }
                        });
                    } else {
                        $tickets = $tickets->where($key, "like", "%" . $val . "%");
                    }
                }
            }
        }
        $tickets = $tickets->paginate($perPage);
        $links = $tickets->linkCollection();
        return response()->json(["Tickets" => TicketResource::collection($tickets), "Links" => $links]);
    }

    public function getTicketsTotal(Request $request)
    {
        $brand = Crypt::decrypt($request->input('brand'));
        $total['new'] =  VmTicket::leftJoin('users', 'users.id', '=', 'vm_ticket.created_by')->havingRaw('brand =' . $brand)->where('vm_ticket.status', 1)->get()->count();
        $total['opened'] =  VmTicket::leftJoin('users', 'users.id', '=', 'vm_ticket.created_by')->havingRaw('brand =' . $brand)->where('vm_ticket.status', 2)->get()->count();
        $total['part_closed'] =  VmTicket::leftJoin('users', 'users.id', '=', 'vm_ticket.created_by')->havingRaw('brand =' . $brand)->where('vm_ticket.status', 3)->get()->count();
        $total['closed'] =  VmTicket::leftJoin('users', 'users.id', '=', 'vm_ticket.created_by')->havingRaw('brand =' . $brand)->where('vm_ticket.status', 4)->get()->count();
        return response()->json(["Total" => $total]);
    }

    public function getPMSalesData(Request $request)
    {
        $brand = Crypt::decrypt($request->input('brand'));
        $users = BrandUsers::SelectPMSalesData($brand);
        return response()->json($users);
    }

    public function getTicketData(Request $request)
    {
        $user = Crypt::decrypt($request->user);
        $this->changeTicketToOpen($request->ticket_id, $user);
        $ticket = VmTicket::with(['Time', 'Response', 'TeamResponse'])->findorfail($request->ticket_id);
        return response()->json(new TicketResource($ticket));
    }

    public function changeTicketToOpen($id, $user)
    {
        $result = VmTicket::find($id);
        if ($result->status == 1) {
            $data['status'] = 2;
            if ($result->update($data)) {
                $this->addTicketTimeStatus($id, $user, 2);
            }
        }
    }
    public function addTicketTimeStatus($ticket, $user, $status)
    {
        $time['status'] = $status;
        $time['ticket'] = $ticket;
        $time['created_by'] = $user;
        $time['created_at'] = date("Y-m-d H:i:s");
        VmTicketTime::create($time);
    }
    public function sendTicketResponse(Request $request)
    {
        $data['created_by'] = Crypt::decrypt($request->user);
        $data['response'] = $request->comment ;
        $data['ticket'] = $request->id;
        $data['created_at'] = date("Y-m-d H:i:s");
        $ticket = VmTicket::find($data['ticket']);
        if ($ticket) {
            if ($request->file('file') != null) {
                $file = $request->file('file');
                $path = $file->store('uploads/tickets/', 'public');
                if (!$path) {
                    $msg['type'] = "error";
                    $message = "Error Uploading File, Please Try Again!";
                } else {
                    $data['file'] = $file->hashName();
                }
            }
            if (VmTicketResponse::create($data)) {
                $msg['type'] = "success";
                $message = "Ticket Reply Added Successfully";
            } else {
                $msg['type'] = "error";
                $message = "Error, Please Try Again!";
            }
            $msg['message'] = $message;
            return response()->json($msg);
        }
    }
    
    public function sendTicketVmResponse(Request $request)
    {
        $data['created_by'] = Crypt::decrypt($request->user);
        $data['response'] = $request->comment ;
        $data['ticket'] = $request->id;
        $data['created_at'] = date("Y-m-d H:i:s");
        $ticket = VmTicket::find($data['ticket']);
        if ($ticket) {          
            if (VmTicketTeamResponse::create($data)) {
                $msg['type'] = "success";
                $message = "Ticket Reply Added Successfully";
            } else {
                $msg['type'] = "error";
                $message = "Error, Please Try Again!";
            }
            $msg['message'] = $message;
            return response()->json($msg);
        }
    }
}
