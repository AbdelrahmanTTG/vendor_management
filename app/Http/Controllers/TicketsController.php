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
use Illuminate\Support\Facades\Validator;

class TicketsController extends Controller
{
    public function index(Request $request)
    {
        // default columns array to display        

        // check for special format
        $formats = (new VendorProfileController)->format($request);
        $filteredFormats = $formats->filter(function ($format) {
            return $format->status == 1;
        });
        if ($filteredFormats->isNotEmpty()) {
            $formatArray = $filteredFormats->pluck('format')->toArray();
            $formatArray = array_merge(...array_map(function ($item) {
                return explode(',', $item);
            }, $formatArray));
            array_unshift($formatArray, "id");
        } else {
            $formatArray = [
                'id',
                'brand',
                'request_type',
                'service',
                'task_type',
                'rate',
                'count',
                'unit',
                'currency',
                'source_lang',
                'target_lang',
                'start_date',
                'delivery_date',
                'subject',
                'software',
                'status',
                'created_by',
                'created_at',
            ];
        }
        // start get data    
        $tickets = VmTicket::leftJoin('users', 'users.id', '=', 'vm_ticket.created_by')
            ->select('vm_ticket.*', 'users.brand AS brand')
            ->orderBy('vm_ticket.id', 'desc');
        // if filter exists
        if (!empty($request->queryParams)) {
            $validator = Validator::make($request->queryParams, [
                'start_date' => 'date',
                'end_date' => 'date|after_or_equal:start_date',
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
                foreach ($request->queryParams as $key => $val) {
                    if (!in_array($key, $formatArray) && ($key != 'start_date' && $key != 'end_date')) {
                        $formatArray[] = $key;
                    }
                    if (!empty($val)) {
                        if (is_array($val)) {                           
                            $tickets->where(function ($query) use ($key, $val) {
                                if ($key != 'brand')
                                    $key = 'vm_ticket.' . $key;
                                foreach ($val as $k => $v) {
                                    if ($k == 0) {
                                        $query->where($key,  $v);
                                    } else {
                                        $query->orWhere($key,  $v);
                                    }
                                }                                
                            });
                           
                        } else {
                            if ($key == 'start_date') {
                                $start_date = $request->queryParams['start_date'];
                                $tickets->where('created_at', '>=', $start_date);
                            } elseif ($key == 'end_date') {
                                $end_date = $request->queryParams['end_date'];
                                $tickets->where('created_at', '<=', $end_date);
                            } else {
                                $tickets = $tickets->where($key, "like", "%" . $val . "%");
                            }
                        }
                    }
                }
            }
        }
        // customize header display
        $renameArrayForDisplay = [
            'id' => 'Ticket Number',
            'source_lang' => 'Source Language',
            'target_lang' => 'Target Language',
        ];
        foreach ($formatArray  as $f) {
            $headerFormatArray[] = $renameArrayForDisplay[$f] ?? $f;
        }
        // if export
        if ($request->has('export') && $request->input('export') === true) {
            // $AllTickets = TicketResource::collection($tickets->get());
            $AllTickets = collect();
            $tickets->chunk(100, function ($chunk) use (&$AllTickets) {
                $AllTickets = $AllTickets->merge(TicketResource::collection($chunk));
            });
        }
        $perPage = $request->input('per_page', 10);
        $tickets = $tickets->paginate($perPage);
        $links = $tickets->linkCollection();
        return response()->json([
            "Tickets" => TicketResource::collection($tickets),
            "Links" => $links,
            "AllTickets" => $AllTickets ?? null,
            "fields" => $formatArray,
            "headerFields" => $headerFormatArray,
            "formats" => $formats,
        ]);
    }

    public function getTicketsTotal()
    {

        $total['new'] =  VmTicket::where('vm_ticket.status', 1)->get()->count();
        $total['opened'] =  VmTicket::where('vm_ticket.status', 2)->get()->count();
        $total['part_closed'] =  VmTicket::where('vm_ticket.status', 3)->get()->count();
        $total['closed'] =  VmTicket::where('vm_ticket.status', 4)->get()->count();
        return response()->json(["Total" => $total]);
    }

    public function getPMSalesData()
    {
        $users = BrandUsers::SelectPMSalesData();
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
        $data['response'] = $request->comment;
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
        $data['response'] = $request->comment;
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
