<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\TicketResource;
use App\Models\BrandUsers;
use App\Models\Vendor;
use App\Models\VendorSheet;
use App\Models\VmSetup;
use App\Models\VmTicket;
use App\Models\VmTicketResource;
use App\Models\VmTicketResponse;
use App\Models\VmTicketTeamResponse;
use App\Models\VmTicketTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\TicketMail;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\DB;

class TicketsController extends Controller
{
    protected $vmEmail;

    public function __construct()
    {
        $vmConfig = VmSetup::first();
        $this->vmEmail = $vmConfig ? $vmConfig->vm_email : '';
    }

    public function index(Request $request)
    {
        // default columns array to display        
        $user = JWTAuth::parseToken()->authenticate();
        $payload = JWTAuth::getPayload(JWTAuth::getToken());
        $view = $request->input('view');
        if ($request->filled('view')) {
            if ($view == 1) {
                $piv = explode(',', $payload["piv"]);
                array_push($piv, $payload["sub"]);
            } elseif ($view == 2) {
                $piv = explode(',', $payload["sub"]);
            }
        } else {
            return response()->json([
                'message' => 'Bad Request: view parameter is missing or invalid.'
            ], 400);
        }
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
                'region',
                'division',
                'created_by',
                'requester_function',
                'created_at',

            ];
        }
        $tickets = VmTicket::leftJoin('users', 'users.id', '=', 'vm_ticket.created_by')
            ->leftJoin('employees', 'employees.id', '=', 'users.employees_id')
            ->leftJoin('regions', 'regions.id', '=', 'employees.region_id')
            ->leftJoin('division', 'division.id', '=', 'employees.division')
            ->select(
                'vm_ticket.*',
                'users.brand as brand',
                'regions.name as region',
                'regions.id as region_id',
                'division.name as division'
            );

        // start get data    
        // $tickets = VmTicket::leftJoin('users', 'users.id', '=', 'vm_ticket.created_by')
        //     ->select('vm_ticket.*', 'users.brand AS brand');
        // ->orderBy('vm_ticket.id', 'desc');
        // if ($user->use_type != 2 && $view != 3) {
        //     $tickets->whereIn('created_by', $piv);
        //     if (count($piv) > 1) {
        //         $tickets->orWhereNull('created_by');
        //     }
        // }

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

                                if ($key == 'brand') {
                                    $dbKey = 'users.brand';
                                } elseif ($key == 'region') {
                                    $dbKey = 'regions.id';
                                } elseif ($key == 'division') {
                                    $dbKey = 'division.id';
                                } else {
                                    $dbKey = 'vm_ticket.' . $key;
                                }

                                foreach ($val as $k => $v) {
                                    if ($k == 0) {
                                        $query->where($dbKey, $v);
                                    } else {
                                        $query->orWhere($dbKey, $v);
                                    }
                                }
                            });
                        } else {
                            if ($key == 'start_date') {
                                $start_date = $request->queryParams['start_date'];
                                $tickets->where('vm_ticket.created_at', '>=', $start_date);
                            } elseif ($key == 'end_date') {
                                $end_date = $request->queryParams['end_date'];
                                $tickets->where('vm_ticket.created_at', '<=', $end_date);
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
        $relationships = [
            'service' => ['id', 'name'],
            "task_type" => ['id', 'name'],
            "unit" => ['id', 'name'],
            "currency" => ['id', 'name'],
            "source_lang" => ['id', 'name'],
            "target_lang" => ['id', 'name'],
            "subject" => ['id', 'name'],
            "software" => ['id', 'name'],
            "brand" => ['id', 'name'],
            "created_by" => ['id', 'user_name'],



        ];

        // if export
        if ($request->has('export') && $request->input('export') === true) {
            foreach ($relationships as $relation => $columns) {
                if (in_array($relation, $formatArray)) {
                    $tickets->with([$relation => function ($query) use ($columns) {
                        $query->select($columns);
                    }]);
                }
            }
            // $AllTickets = TicketResource::collection($tickets->get());
            $AllTickets = collect();
            $tickets->chunk(100, function ($chunk) use (&$AllTickets) {
                $AllTickets = $AllTickets->merge($chunk);
            });
        }
        if ($request->has('sortBy') && $request->has('sortDirection')) {
            $sortBy = $request->input('sortBy');
            $sortDirection = $request->input('sortDirection');

            if (in_array($sortDirection, ['asc', 'desc'])) {
                $tickets = $tickets->orderBy($sortBy, $sortDirection);
            }
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

    // public function getPMSalesData()
    // {
    //     $users = BrandUsers::SelectPMSalesData();
    //     return response()->json($users);
    // }
    public function getPMSalesData(Request $request)
    {
        $search = $request->input('search');  
        $perPage = 5;                        
        $users = BrandUsers::SelectPMSalesData($search, $perPage);

        return response()->json($users);
    }
    public function getTicketData(Request $request)
    {
        $user = Crypt::decrypt($request->user);
        $ticket = VmTicket::with(['Time', 'Response', 'TeamResponse', 'TicketResource'])->findorfail($request->ticket_id);
        if ($ticket->request_type == 1 || $ticket->request_type == 3) {
            if (count($ticket->TicketResource) > 0) {
                foreach ($ticket->TicketResource as $res) {
                    $hasSheet = VendorSheet::where('i', $res->id)
                        ->where('ticket_id', $ticket->id)
                        ->where('vendor', $res->vendor)
                        ->exists();
                    $vendors[] = VmTicketResource::with([
                        'vendor' => function ($query) {
                            $query->select('id', 'name', 'email', 'profile', 'cv', 'country', 'contact', 'mother_tongue', 'created_by');
                        },
                        'vendor.vendor_sheet' => function ($query) use ($res, $ticket, $hasSheet) {
                            $query->select('id', 'vendor', 'source_lang', 'target_lang', 'service', 'task_type', 'dialect', 'rate', 'currency', 'unit', 'i', 'subject')->limit(1);

                            if ($hasSheet) {
                                $query->where('i', $res->id)
                                    ->where('ticket_id', $ticket->id);
                            }
                        },
                        'vendor.vendor_sheet.source_lang' => function ($query) {
                            $query->select('id', 'name');
                        },
                        'vendor.vendor_sheet.target_lang' => function ($query) {
                            $query->select('id', 'name');
                        },
                        'vendor.vendor_sheet.service' => function ($query) {
                            $query->select('id', 'name');
                        },
                        'vendor.vendor_sheet.task_type' => function ($query) {
                            $query->select('id', 'name');
                        },
                        'vendor.vendor_sheet.unit' => function ($query) {
                            $query->select('id', 'name');
                        },
                        'vendor.vendor_sheet.currency' => function ($query) {
                            $query->select('id', 'name');
                        },
                        'vendor.vendor_sheet.subject' => function ($query) {
                            $query->select('id', 'name');
                        },
                        'vendor.created_by' => function ($query) {
                            $query->select('id', 'user_name');
                        },
                        'vendor.country' => function ($query) {
                            $query->select('id', 'name');
                        }
                    ])->find($res->id);
                }
            }
        }
        $vmUsers = BrandUsers::SelectVmData();
        foreach ($vmUsers as $k => $vmUser) {
            $vmArray[$k]['label'] = $vmUser->user_name;
            $vmArray[$k]['value'] = $vmUser->id;
        };

        return response()->json([
            "ticket" => new TicketResource($ticket),
            "resourceVendors" => $vendors ?? null,
            "vmUsers" => $vmArray ?? []
        ]);
    }

    public function changeTicketToOpen($id, $user)
    {
        $result = VmTicket::find($id);
        if ($result->status == 1) {
            $data['status'] = 2;
            if ($result->update($data)) {
                if (empty($result->assigned_to)) {
                    $data2['assigned_to'] = $user;
                    $result->update($data2);
                }
                $this->addTicketTimeStatus($id, $user, 2, '');
            }
        }
    }
    public function addTicketTimeStatus($ticket, $user, $status, $assign_to)
    {
        $ticketRow = VmTicket::find($ticket);
        $created_by_master = BrandUsers::select('master_user_id')->where('id', $user)->first();
        $created_by_ticket_brand = BrandUsers::select('id')->where('master_user_id', $created_by_master->master_user_id)
            ->where('brand', $ticketRow->brand_id)->first();
        $time['created_by'] = $created_by_ticket_brand->id ?? $user;

        $time['status'] = $status;
        $time['ticket'] = $ticket;
        $time['assign_to'] = $assign_to;
        // $time['created_by'] = $user;
        $time['created_at'] = now();
        VmTicketTime::create($time);
    }
    public function sendTicketResponse(Request $request)
    {
        $ticket_id = $request->id;
        $created_by = Crypt::decrypt($request->user);
        $created_by_master = BrandUsers::select('master_user_id')->where('id', $created_by)->first();
        $ticket = VmTicket::find($ticket_id);
        $created_by_ticket_brand = BrandUsers::select('id')->where('master_user_id', $created_by_master->master_user_id)
            ->where('brand', $ticket->brand_id)->first();
        $data['created_by'] = $created_by_ticket_brand->id ?? $created_by;
        $data['response'] = $request->comment;
        $data['ticket'] = $ticket_id;
        $data['created_at'] = now();
        if ($ticket) {
            if ($request->file('file') != null) {
                $file = $request->file('file');
                // $path = $file->store('uploads/tickets/', 'public');
                $folderPath = storage_path('app/external/tickets');
                if (!file_exists($folderPath)) {
                    mkdir(
                        $folderPath,
                        0777,
                        true
                    );
                }
                $originalFileName = $file->getClientOriginalName();
                $encryptedFileName = Crypt::encryptString($originalFileName);
                $fullEncryptedFileName = $encryptedFileName . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('tickets', $fullEncryptedFileName, 'external');
                if (!$path) {
                    $msg['type'] = "error";
                    $message = "Error Uploading File, Please Try Again!";
                } else {
                    $data['file'] = $fullEncryptedFileName;
                }
            }
            if (VmTicketResponse::create($data)) {
                // send reply to requster   
                // setup mail data              
                $to = BrandUsers::select('email', 'user_name')->where('id', $ticket->created_by)->first();
                $created_by_user_name = BrandUsers::select('user_name')->where('id', $data['created_by'])->first()->user_name;
                $toEmail = $to->email;
                $user_name = $to->user_name;
                //end setup mail                 
                $mailData = [
                    'user_name' =>  $user_name,
                    'subject' => "New Reply : # " . $ticket->id,
                    'body' => "A new reply has been added to your ticket by $created_by_user_name. Please check it.",
                    'comment' =>  $request->comment,
                ];
                if ($ticket->brand_id == 1) {
                    $from = 'vm.support@thetranslationgate.com';
                } elseif ($ticket->brand_id == 2) {
                    $from = 'vm.support@localizera.com';
                } elseif ($ticket->brand_id == 3) {
                    $from = 'vm.support@europelocalize.com';
                } elseif ($ticket->brand_id == 4) {
                    $from = 'vm.support@afaq.com';
                } elseif ($ticket->brand_id == 11) {
                    $from = 'vm.support@columbuslang.com';
                } else {
                    $from = 'vm.support@aixnexus.com';
                }
                Mail::to($toEmail)
                    ->cc($from)
                    ->send(
                        (new TicketMail($mailData))->from($this->vmEmail, 'Support Team')
                    );
                // Mail::to($toEmail)->cc($this->vmEmail)->send(new TicketMail($mailData));
                //end  
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




    // public function sendTicketResponse(Request $request)
    // {
    //     $data['created_by'] = Crypt::decrypt($request->user);
    //     $data['response'] = $request->comment;
    //     $data['ticket'] = $request->id;
    //     $data['created_at'] =now();
    //     $ticket = VmTicket::find($data['ticket']);

    //     if ($ticket) {
    //         if ($request->file('file') != null) {
    //             $file = $request->file('file');
    //             $folderPath = storage_path('app/external/tickets');
    //             if (!file_exists($folderPath)) {
    //                 mkdir($folderPath, 0777, true);
    //             }
    //             $originalFileName = $file->getClientOriginalName();
    //             $encryptedFileName = Crypt::encryptString($originalFileName);
    //             $fullEncryptedFileName = $encryptedFileName . '.' . $file->getClientOriginalExtension();
    //             $path = $file->storeAs('tickets', $fullEncryptedFileName, 'external');
    //             if (!$path) {
    //                 $msg['type'] = "error";
    //                 $message = "Error Uploading File, Please Try Again!";
    //             } else {
    //                 $data['file'] = $fullEncryptedFileName;
    //             }
    //         }

    //         if (VmTicketResponse::create($data)) {
    //             $to = BrandUsers::select('email', 'user_name')->where('id', $ticket->created_by)->first();
    //             $toEmail = $to->email;
    //             $user_name = $to->user_name;
    //             $ticket_data = DB::table('vm_ticket')->where('id', $ticket->id)->first();
    //             $ccEmails = [];
    //             if ($ticket_data->ticket_from == 1) {
    //                 $pmId = DB::table('sales_opportunity')
    //                     ->where('id', $ticket_data->from_id)
    //                     ->value('pm');

    //                 if ($pmId) {
    //                     $pmEmail = DB::table('brand_users')
    //                         ->where('id', $pmId)
    //                         ->value('email');
    //                     if ($pmEmail) {
    //                         $ccEmails[] = $pmEmail;
    //                     }
    //                 }
    //             }

    //             switch ($ticket_data->brand) {
    //                 case 1:
    //                     $ccEmails[] = "vm@thetranslationgate.com";
    //                     $fromEmail = "vm.support@thetranslationgate.com";
    //                     $replyTo = "vm@thetranslationgate.com";
    //                     break;

    //                 case 2:
    //                     $ccEmails[] = "vm.support@localizera.com";
    //                     $fromEmail = "vm.support@localizera.com";
    //                     $replyTo = "vm.support@localizera.com";
    //                     break;

    //                 case 3:
    //                     $ccEmails[] = "vm.support@europelocalize.com";
    //                     $fromEmail = "vm.support@europelocalize.com";
    //                     $replyTo = "vm.support@europelocalize.com";
    //                     break;

    //                 case 4:
    //                     $ccEmails[] = "vm@afaqtranslations.com";
    //                     $ccEmails[] = "nour.mahmoud@afaqtranslations.com";
    //                     $fromEmail = "vm@afaqtranslations.com";
    //                     $replyTo = "vm@afaqtranslations.com";
    //                     break;

    //                 case 11:
    //                     $ccEmails[] = "vm.support@columbuslang.com";
    //                     $fromEmail = "vm.support@columbuslang.com";
    //                     $replyTo = "vm.support@columbuslang.com";
    //                     break;

    //                 default:
    //                     $fromEmail = "no-reply@thetranslationgate.com";
    //                     $replyTo = $fromEmail;
    //             }

    //             $mailData = [
    //                 'user_name' =>  $user_name,
    //                 'subject'   => "New Reply : # " . $ticket->id . " Project Name : " . $ticket_data->ticket_subject,
    //                 'body'      => "A new reply has already sent to your ticket, please check ..",
    //                 'comment'   => $request->comment,
    //             ];

    //             Mail::to($toEmail)
    //                 ->cc($ccEmails)
    //                 ->send(new TicketMail($mailData));

    //             $msg['type'] = "success";
    //             $message = "Ticket Reply Added Successfully";
    //         } else {
    //             $msg['type'] = "error";
    //             $message = "Error, Please Try Again!";
    //         }

    //         $msg['message'] = $message;
    //         return response()->json($msg);
    //     }
    // }


    public function download(Request $request)
    {
        $fileName = $request->input("filename");
        $filePath = Storage::disk('external')->path("/tickets/{$fileName}");
        if (!file_exists($filePath)) {
            // check external
            $external_path = Http::get(VmSetup::getUploadsFullLink() . "/tickets/$fileName");
            if ($external_path->successful()) {
                return TRUE;
            } else {
                return response()->json(['message' => 'File not found'], 404);
            }
        }
        return response()->download($filePath, $fileName);
    }

    public function sendTicketVmResponse(Request $request)
    {
        $ticket_id = $request->id;
        $created_by = Crypt::decrypt($request->user);
        $created_by_master = BrandUsers::select('master_user_id')->where('id', $created_by)->first();
        $ticket = VmTicket::find($ticket_id);
        $created_by_ticket_brand = BrandUsers::select('id')->where('master_user_id', $created_by_master->master_user_id)
            ->where('brand', $ticket->brand_id)->first();
        $data['created_by'] = $created_by_ticket_brand->id ?? $created_by;
        $data['response'] = $request->comment;
        $data['ticket'] = $ticket_id;
        $data['created_at'] = now();
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

    // public function changeTicketStatus(Request $request)
    // {
    //     $user = $data['created_by'] = Crypt::decrypt($request->user);
    //     $ticket_id = $data['ticket'] = $request->ticket;
    //     $status = $request->status;
    //     // $data['created_at'] =now();
    //     $ticket = VmTicket::find($data['ticket']);
    //     $message = '';
    //     if ($ticket) {
    //         // setup mail data         
    //         $to = BrandUsers::select('email', 'user_name')->where('id', $ticket->created_by)->first();
    //         $toEmail = $to->email;
    //         $user_name = $to->user_name;
    //         //end setup mail
    //         if (isset($request->status)) {
    //             if ($status == 0) {
    //                 $comment = $request->comment;
    //                 if ($ticket->update(['status' => $status, 'rejection_reason' => $comment])) {
    //                     $this->addTicketTimeStatus($ticket_id, $user, $status);
    //                     // send rejection to requster                   
    //                     $mailData = [
    //                         'user_name' =>  $user_name,
    //                         'subject' => "Rejected Request : # " . $ticket_id,
    //                         'body' =>  'VM Team rejected your ticket.',
    //                         'comment' =>  "Reason: " . $comment,
    //                     ];
    //                     Mail::to($toEmail)->cc($this->vmEmail)->send(new TicketMail($mailData));
    //                     $message = "Ticket Rejected Successfully ...";
    //                 }
    //             } else {
    //                 // if type is cv request
    //                 if ($ticket->request_type == 5) {
    //                     if ($request->file('file') != null) {
    //                         $this->changeTicketToOpen($ticket_id, $user);
    //                         $file = $request->file('file');
    //                         // $path = $file->storeAs('uploads/tickets/', $file->getClientOriginalName(), 'public');
    //                         $folderPath = storage_path('app/external/tickets');
    //                         if (!file_exists($folderPath)) {
    //                             mkdir(
    //                                 $folderPath,
    //                                 0777,
    //                                 true
    //                             );
    //                         }
    //                         $originalFileName = $file->getClientOriginalName();
    //                         $encryptedFileName = Crypt::encryptString($originalFileName);
    //                         $fullEncryptedFileName = $encryptedFileName . '.' . $file->getClientOriginalExtension();
    //                         $path = $file->storeAs('tickets', $fullEncryptedFileName, 'external');
    //                         if (!$path) {
    //                             return response()->json(['message' => 'Error Uploading File, Please Try Again!', 'type' => 'error']);
    //                         } else {
    //                             $data['file'] = $fullEncryptedFileName;
    //                             if (VmTicketResource::create($data)) {
    //                                 $message .= "Ticket Resource Added Successfully <br/>";
    //                             } else {
    //                                 return response()->json(['message' => 'Error, Please Try Again!', 'type' => 'error']);
    //                             }
    //                         }
    //                     }
    //                 }
    //                 /*  Resource Availabilty */
    //                 if ($ticket->request_type == 4) {
    //                     if (is_numeric($request->number_of_resource)) {
    //                         $this->changeTicketToOpen($ticket_id, $user);
    //                         $data['number_of_resource'] = $request->number_of_resource;
    //                         if (count($ticket->TicketResource) == 0) {
    //                             if (VmTicketResource::create($data)) {
    //                                 $message .= "Ticket Resource Added Successfully <br/>";
    //                             } else {
    //                                 return response()->json(['message' => 'Error, Please Try Again!', 'type' => 'error']);
    //                             }
    //                         } else {
    //                             $ticket_res = VmTicketResource::where('ticket', $ticket_id)->firstOrFail();
    //                             if ($ticket_res->update($data)) {
    //                                 $message .= "Ticket Resource updated Successfully <br/>";
    //                             } else {
    //                                 return response()->json(['message' => 'Error, Please Try Again!', 'type' => 'error']);
    //                             }
    //                         }
    //                     }
    //                 }
    //                 /*  new Resource */
    //                 if ($ticket->request_type == 1 || $ticket->request_type == 3) {
    //                     if (isset($request->vendor)) {
    //                         $vendors = $request->vendor;
    //                         foreach ($vendors as $i => $vendor) {
    //                             if (!empty($vendor)) {
    //                                 $this->changeTicketToOpen($ticket_id, $user);
    //                                 $check = VmTicketResource::where('vendor', $vendor)->where('ticket', $ticket_id)->count();
    //                                 if ($check == 0) {
    //                                     $data['vendor'] = $vendor;
    //                                     $data['i'] = ++$i;
    //                                     $vendorCount = Vendor::where('id', $vendor)->where('created_by', $user)->count();
    //                                     if ($vendorCount > 0) {
    //                                         $data['type'] = 1;
    //                                     } else {
    //                                         $vendorSheetCount = VendorSheet::where('vendor', $vendor)
    //                                             ->where('source_lang', $ticket->source_lang)
    //                                             ->where('target_lang', $ticket->target_lang)
    //                                             ->where('task_type', $ticket->task_type)
    //                                             ->where('service', $ticket->service)
    //                                             ->where('created_by', $user)->count();
    //                                         if ($vendorSheetCount > 0)
    //                                             $data['type'] = 3;
    //                                         else
    //                                             $data['type'] = 2;
    //                                     }
    //                                     $newVmTicketResource = VmTicketResource::create($data);
    //                                     if ($newVmTicketResource) {
    //                                         VendorSheet::where('vendor', $vendor)
    //                                             ->where('source_lang', $ticket->source_lang)
    //                                             ->where('target_lang', $ticket->target_lang)
    //                                             ->where('task_type', $ticket->task_type)
    //                                             ->where('service', $ticket->service)->update(['i' => $newVmTicketResource->id, 'ticket_id' => $ticket_id]);
    //                                         // send new status to requster                    
    //                                         $mailData = [
    //                                             'user_name' =>  $user_name,
    //                                             'subject' => "New Resource : # " . $ticket_id,
    //                                             'body' =>  "Your Ticket has been updated with a new resource , please check. Date : " . now(),
    //                                         ];
    //                                         Mail::to($toEmail)->cc($this->vmEmail)->send(new TicketMail($mailData));
    //                                         //end                                           
    //                                         $message = "Ticket Resource Added Successfully <br/>";
    //                                     } else {
    //                                         return response()->json(['message' => 'Error, Please Try Again!', 'type' => 'error']);
    //                                     }
    //                                 }
    //                             }
    //                         }
    //                     }
    //                 }
    //                 // start change status
    //                 if ($status == 3) {
    //                     if ($ticket->update(['status' => 5])) {
    //                         $this->addTicketTimeStatus($ticket_id, $user, 5);
    //                         // send new status to requster                    
    //                         $mailData = [
    //                             'user_name' =>  $user_name,
    //                             'subject' => "Partly Closed Request for Ticket : # " . $ticket_id,
    //                             'body' =>  'VM Team send a request to close your ticket please send your action.',
    //                         ];
    //                         Mail::to($toEmail)->cc($this->vmEmail)->send(new TicketMail($mailData));
    //                         //end                       
    //                         $message .= "Ticket Status Changed Successfully ...";
    //                     } else {
    //                         return response()->json(['message' => 'Error, Please Try Again!', 'type' => 'error']);
    //                     }
    //                 } elseif ($status == 4) {
    //                     if ($ticket->update(['status' => $status])) {
    //                         $this->addTicketTimeStatus($ticket_id, $user, $status);
    //                         // send new status to requster                    
    //                         $mailData = [
    //                             'user_name' =>  $user_name,
    //                             'subject' => "Ticket Closed : # " . $ticket_id,
    //                             'body' =>  "Your Ticket Closed at " . now() . "-" . $ticket->ticket_subject,
    //                         ];
    //                         Mail::to($toEmail)->cc($this->vmEmail)->send(new TicketMail($mailData));
    //                         //end                               
    //                         $message .= "Ticket Status Changed Successfully ...";
    //                     } else {
    //                         return response()->json(['message' => 'Error, Please Try Again!', 'type' => 'error']);
    //                     }
    //                 } elseif ($status == 2) {
    //                     $this->changeTicketToOpen($ticket_id, $user);
    //                     $message .= "Ticket Status Changed Successfully ...";
    //                 } elseif ($status == 5) {
    //                     $message .= "Ticket Status Changed Successfully ...";
    //                 }
    //             }
    //         }
    //         // if no change 
    //         if (trim($message) != '') {
    //             $msg['type'] = "success";
    //             $msg['message'] = explode('<br/>', $message);
    //         } else {
    //             $msg['type'] = "error";
    //             $msg['message'] = "No Action Done! Please Change Ticket Status ";
    //             if ($ticket->request_type == 5)
    //                 $msg['message'] .= "OR Attach CV";
    //             elseif ($ticket->request_type == 4)
    //                 $msg['message'] .= "OR Add Number Of Resources";
    //             elseif ($ticket->request_type == 1)
    //                 $msg['message'] .= "OR Select Vendor";
    //         }
    //         return response()->json($msg);
    //     } else {
    //         return response()->json(['message' => 'Ticket not found', 'type' => 'error']);
    //     }
    // }

    public function changeTicketStatus(Request $request)
    {
        $created_by = Crypt::decrypt($request->user);
        $created_by_master = BrandUsers::select('master_user_id')->where('id', $created_by)->first();
        $created_by_master = BrandUsers::select('master_user_id')->where('id', $created_by)->first();

        $created_by = Crypt::decrypt($request->user);
        $ticket_id = $data['ticket'] = $request->ticket;
        $status = $request->status;

        $ticket = VmTicket::find($data['ticket']);
        $created_by_ticket_brand = BrandUsers::select('id')->where('master_user_id', $created_by_master->master_user_id)
            ->where('brand', $ticket->brand_id)->first();
        $user = $data['created_by'] = $created_by_ticket_brand->id ?? $created_by;

        $message = '';

        if (!$ticket) {
            return response()->json(['message' => 'Ticket not found', 'type' => 'error']);
        }

        $to = BrandUsers::select('email', 'user_name')->where('id', $ticket->created_by)->first();
        $toEmail = $to->email;
        $user_name = $to->user_name;

        if (isset($request->status)) {

            if ($status == 0) {
                $comment = $request->comment;
                if ($ticket->update(['status' => $status, 'rejection_reason' => $comment])) {
                    $this->addTicketTimeStatus($ticket_id, $user, $status, '');

                    $mailData = [
                        'user_name' => $user_name,
                        'subject'   => "Rejected Request : # " . $ticket_id,
                        'body'      => 'VM Team rejected your ticket.',
                        'comment'   => "Reason: " . $comment,
                    ];
                    if ($ticket->brand_id == 1) {
                        $from = 'vm.support@thetranslationgate.com';
                    } elseif ($ticket->brand_id == 2) {
                        $from = 'vm.support@localizera.com';
                    } elseif ($ticket->brand_id == 3) {
                        $from = 'vm.support@europelocalize.com';
                    } elseif ($ticket->brand_id == 4) {
                        $from = 'vm.support@afaq.com';
                    } elseif ($ticket->brand_id == 11) {
                        $from = 'vm.support@columbuslang.com';
                    } else {
                        $from = 'vm.support@aixnexus.com';
                    }
                    Mail::to($toEmail)
                        ->cc($this->vmEmail)
                        ->send(
                            (new TicketMail($mailData))->from($from, 'Support Team')
                        );
                    // Mail::to($toEmail)->cc($this->vmEmail)->send(new TicketMail($mailData));

                    $message .= "Ticket Rejected Successfully ...<br/>";
                }
            }

            if ($ticket->request_type == 5 && $request->file('file') != null) {
                $this->changeTicketToOpen($ticket_id, $user);
                $file = $request->file('file');
                $folderPath = storage_path('app/external/tickets');

                if (!file_exists($folderPath)) {
                    mkdir($folderPath, 0777, true);
                }

                $originalFileName = $file->getClientOriginalName();
                $encryptedFileName = Crypt::encryptString($originalFileName);
                $fullEncryptedFileName = $encryptedFileName . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('tickets', $fullEncryptedFileName, 'external');

                if ($path) {
                    $data['file'] = $fullEncryptedFileName;
                    if (VmTicketResource::create($data)) {
                        $message .= "Ticket Resource Added Successfully <br/>";
                    }
                }
            }

            if ($ticket->request_type == 4 && is_numeric($request->number_of_resource)) {
                $this->changeTicketToOpen($ticket_id, $user);
                $data['number_of_resource'] = $request->number_of_resource;

                if (count($ticket->TicketResource) == 0) {
                    VmTicketResource::create($data);
                    $message .= "Ticket Resource Added Successfully <br/>";
                } else {
                    $ticket_res = VmTicketResource::where('ticket', $ticket_id)->firstOrFail();
                    $ticket_res->update($data);
                    $message .= "Ticket Resource updated Successfully <br/>";
                }
            }

            if (($ticket->request_type == 1 || $ticket->request_type == 3) && isset($request->vendor)) {
                foreach ($request->vendor as $i => $vendor) {
                    if (!empty($vendor)) {
                        $this->changeTicketToOpen($ticket_id, $user);
                        $check = VmTicketResource::where('vendor', $vendor)->where('ticket', $ticket_id)->count();
                        if ($check == 0) {
                            $data['vendor'] = $vendor;
                            $data['i'] = ++$i;

                            $vendorCount = Vendor::where('id', $vendor)->where('created_by', $user)->count();
                            if ($vendorCount > 0) {
                                $data['type'] = 1;
                            } else {
                                $vendorSheetCount = VendorSheet::where('vendor', $vendor)
                                    ->where('source_lang', $ticket->source_lang)
                                    ->where('target_lang', $ticket->target_lang)
                                    ->where('task_type', $ticket->task_type)
                                    ->where('service', $ticket->service)
                                    ->where('created_by', $user)
                                    ->count();
                                $data['type'] = $vendorSheetCount > 0 ? 3 : 2;
                            }
                            $newVmTicketResource = VmTicketResource::create($data);
                            VendorSheet::where('vendor', $vendor)
                                ->where('source_lang', $ticket->source_lang)
                                ->where('target_lang', $ticket->target_lang)
                                ->where('task_type', $ticket->task_type)
                                ->where('service', $ticket->service)
                                ->update(['i' => $newVmTicketResource->id, 'ticket_id' => $ticket_id]);
                            $this->addTicketTimeStatus($ticket_id, $user, 7, $vendor);
                            $mailData = [
                                'user_name' => $user_name,
                                'subject'   => "New Resource : # " . $ticket_id,
                                'body'      => "Your Ticket has been updated with a new resource, please check. Date : " . now(),
                            ];

                            if ($ticket->brand_id == 1) {
                                $from = 'vm.support@thetranslationgate.com';
                            } elseif ($ticket->brand_id == 2) {
                                $from = 'vm.support@localizera.com';
                            } elseif ($ticket->brand_id == 3) {
                                $from = 'vm.support@europelocalize.com';
                            } elseif ($ticket->brand_id == 4) {
                                $from = 'vm.support@afaq.com';
                            } elseif ($ticket->brand_id == 11) {
                                $from = 'vm.support@columbuslang.com';
                            } else {
                                $from = 'vm.support@aixnexus.com';
                            }
                            Mail::to($toEmail)
                                ->cc($from)
                                ->send(
                                    (new TicketMail($mailData))->from($this->vmEmail, 'Support Team')
                                );
                            // Mail::to($toEmail)->cc($this->vmEmail)->send(new TicketMail($mailData));

                            $message .= "Ticket Resource Added Successfully <br/>";
                        }
                    }
                }
            }

            if ($status == 3) {
                $ticket->update(['status' => 5]);
                $this->addTicketTimeStatus($ticket_id, $user, 5, '');

                $mailData = [
                    'user_name' => $user_name,
                    'subject'   => "Partly Closed Request for Ticket : # " . $ticket_id,
                    'body'      => 'VM Team send a request to close your ticket please send your action.',
                ];

                if ($ticket->brand_id == 1) {
                    $from = 'vm.support@thetranslationgate.com';
                } elseif ($ticket->brand_id == 2) {
                    $from = 'vm.support@localizera.com';
                } elseif ($ticket->brand_id == 3) {
                    $from = 'vm.support@europelocalize.com';
                } elseif ($ticket->brand_id == 4) {
                    $from = 'vm.support@afaq.com';
                } elseif ($ticket->brand_id == 11) {
                    $from = 'vm.support@columbuslang.com';
                } else {
                    $from = 'vm.support@aixnexus.com';
                }
                Mail::to($toEmail)
                    ->cc($from)
                    ->send(
                        (new TicketMail($mailData))->from($this->vmEmail, 'Support Team')
                    );
                // Mail::to($toEmail)->cc($this->vmEmail)->send(new TicketMail($mailData));

                $message .= "Ticket Status Changed Successfully ...<br/>";
            } elseif ($status == 4) {
                $ticket->update(['status' => $status]);
                $this->addTicketTimeStatus($ticket_id, $user, $status, '');

                $mailData = [
                    'user_name' => $user_name,
                    'subject'   => "Ticket Closed : # " . $ticket_id,
                    'body'      => "Your Ticket Closed at " . now() . " - " . $ticket->ticket_subject,
                ];

                if ($ticket->brand_id == 1) {
                    $from = 'vm.support@thetranslationgate.com';
                } elseif ($ticket->brand_id == 2) {
                    $from = 'vm.support@localizera.com';
                } elseif ($ticket->brand_id == 3) {
                    $from = 'vm.support@europelocalize.com';
                } elseif ($ticket->brand_id == 4) {
                    $from = 'vm.support@afaq.com';
                } elseif ($ticket->brand_id == 11) {
                    $from = 'vm.support@columbuslang.com';
                } else {
                    $from = 'vm.support@aixnexus.com';
                }
                Mail::to($toEmail)
                    ->cc($from)
                    ->send(
                        (new TicketMail($mailData))->from($this->vmEmail, 'Support Team')
                    );
                // Mail::to($toEmail)->cc($this->vmEmail)->send(new TicketMail($mailData));

                $message .= "Ticket Status Changed Successfully ...<br/>";
            } elseif ($status == 2) {
                $this->changeTicketToOpen($ticket_id, $user);
                $message .= "Ticket Status Changed Successfully ...<br/>";
            }
        }

        if (trim($message) != '') {
            return response()->json([
                'type' => 'success',
                'message' => explode('<br/>', $message)
            ]);
        } else {
            $msg = "No Action Done! Please Change Ticket Status ";
            if ($ticket->request_type == 5)
                $msg .= " OR Attach CV";
            elseif ($ticket->request_type == 4)
                $msg .= " OR Add Number Of Resources";
            elseif ($ticket->request_type == 1)
                $msg .= " OR Select Vendor";

            return response()->json(['type' => 'error', 'message' => $msg]);
        }
    }



    private function generateTicketEmail($userName, $msg, $msgData = '')
    {
        return '<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta name="description" content="">
                <meta name="author" content="">
                <link rel="shortcut icon" href="' . url('/') . '/assets/images/favicon.png">
                <title>Nexus | Site Manager</title>
                <style>
                body {
                    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
                    font-size: 14px;
                    line-height: 1.428571429;
                    color: #333;
                }
                section#unseen {
                    overflow: scroll;
                    width: 100%
                }
                </style>
            </head>
            <body>
                <p>Dear ' . $userName . ',</p>
                <p>' . $msg . '</p>
                <p>' . $msgData . '</p>
                <p>Thanks</p>
            </body>
            </html>';
    }

    public function deleteTicketResource(Request $request)
    {
        $resource = VmTicketResource::find($request->id);

        if ($resource) {
            $vendor = $resource->vendor;
            $resource->delete();
            $user = Crypt::decrypt($request->user);
            $ticket_id = $request->ticket;
            $this->addTicketTimeStatus($ticket_id, $user, 8, $vendor);
        } else {
            return response()->json(['error' => 'Resource not found'], 404);
        }
    }

    public function assignTicket(Request $request)
    {
        $user = Crypt::decrypt($request->user);
        $ticket_id = $request->ticket;
        $vm_id = $request->vmUser;
        $ticket = VmTicket::find($ticket_id);
        if ($request->assignPermission == 1) {
            // if (empty($ticket->assigned_to)) {
            $data['assigned_to'] = $vm_id;
            if ($ticket->update($data)) {
                $this->addTicketTimeStatus($ticket_id, $user, 6, $ticket->assigned_to);
                try {
                    $to = BrandUsers::select('email', 'user_name')->where('id', $vm_id)->first();
                    $ccEmail = BrandUsers::select('email')->where('id', $user)->first()->email;
                    $toEmail = $to->email;
                    $user_name = $to->user_name;

                    $mailData = [
                        'user_name' =>  $user_name,
                        'subject' => "New Ticket Assigned : # " . $ticket_id,
                        'body' =>  "New Ticket Assigned to you at " . now() . ", please Check ...",
                    ];
                    if ($ticket->brand_id == 1) {
                        $from = 'vm.support@thetranslationgate.com';
                    } elseif ($ticket->brand_id == 2) {
                        $from = 'vm.support@localizera.com';
                    } elseif ($ticket->brand_id == 3) {
                        $from = 'vm.support@europelocalize.com';
                    } elseif ($ticket->brand_id == 4) {
                        $from = 'vm.support@afaq.com';
                    } elseif ($ticket->brand_id == 11) {
                        $from = 'vm.support@columbuslang.com';
                    } else {
                        $from = 'vm.support@aixnexus.com';
                    }
                    Mail::to($toEmail)
                        ->cc($ccEmail)
                        ->send(
                            (new TicketMail($mailData))->from($from, 'Support Team')
                        );
                } catch (\Exception $e) {
                    // \Log::error("Mail sending failed: " . $e->getMessage());
                }

                return response()->json(['message' => 'Ticket Assigned Successfully', 'type' => 'success']);
            }
            // } else {
            //     return response()->json(['message' => 'Ticket Already Assigned, please Check', 'type' => 'error']);
            // }
        } else {
            return response()->json(['message' => 'You Have No Permission', 'type' => 'error']);
        }
    }
}
