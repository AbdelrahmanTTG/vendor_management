<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\TicketResource;
use App\Models\BrandUsers;
use App\Models\vmTicket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;

class TicketsController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $brand = Crypt::decrypt($request->input('brand'));
        $tickets = vmTicket::leftJoin('users', 'users.id', '=', 'vm_ticket.created_by')
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
        $total['new'] =  vmTicket::leftJoin('users', 'users.id', '=', 'vm_ticket.created_by')->havingRaw('brand =' . $brand)->where('vm_ticket.status', 1)->get()->count();
        $total['opened'] =  vmTicket::leftJoin('users', 'users.id', '=', 'vm_ticket.created_by')->havingRaw('brand =' . $brand)->where('vm_ticket.status', 2)->get()->count();
        $total['part_closed'] =  vmTicket::leftJoin('users', 'users.id', '=', 'vm_ticket.created_by')->havingRaw('brand =' . $brand)->where('vm_ticket.status', 3)->get()->count();
        $total['closed'] =  vmTicket::leftJoin('users', 'users.id', '=', 'vm_ticket.created_by')->havingRaw('brand =' . $brand)->where('vm_ticket.status', 4)->get()->count();
        return response()->json(["Total" => $total]);
    }

    public function getPMSalesData(Request $request)
    {
        $brand = Crypt::decrypt($request->input('brand'));
        $users = BrandUsers::SelectPMSalesData($brand);
        return response()->json($users);
    }
}
