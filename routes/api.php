<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AvailabilityController;
use App\Http\Controllers\VmCodeTableController;
use App\Http\Controllers\CodingTableController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\PortalAdminController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TicketsController;
use App\Http\Controllers\VendorProfileController;
use App\Http\Controllers\AdminController;

Route::group(['prefix' => 'auth'], function () {
    Route::post('login', [AuthController::class, 'login'])->name('login');
});
Route::middleware(['auth:api'])->group(function () {
    Route::post('permission', [AuthController::class, 'userpermission']);
    Route::get('logout', [AuthController::class, 'logout']);
    Route::post('tableDate', [VmCodeTableController::class, 'SelectDataTable']);
    // Route::get('SelectDatat', [CodingTableController::class, 'SelectDatatTable']);
    Route::post('SubmetData', [CodingTableController::class, 'store']);
    Route::delete('/deleteData', [CodingTableController::class, 'destroy']);
    Route::post('/updateeData', [CodingTableController::class, 'update']);
    // Route::get('/GetCountry', [VendorProfileController::class, 'findCountry']);
    Route::post('/PersonalInformation', [VendorProfileController::class, 'store']);
    Route::post('/storeBilling', [VendorProfileController::class, 'storeBilling']);
    Route::post('/Vendors', [VendorProfileController::class, 'Vendors']);
    Route::delete('/deleteWallet', [VendorProfileController::class, 'deleteWalletsPayment']);
    Route::delete('/deleteSkill', [VendorProfileController::class, 'deleteSkill']);
   
    Route::post('/GeneratePassword', [VendorProfileController::class, 'setPassword']);
    Route::post('/AddExperience', [VendorProfileController::class, 'AddExperience']);
    Route::post('/UpdateExperience', [VendorProfileController::class, 'UpdateExperience']);
    Route::post('/uploadFiles', [VendorProfileController::class, 'uploadFiles']);
   
    Route::delete('/delete', [VendorProfileController::class, 'deleteFile']);
    Route::post('/updateFiles', [VendorProfileController::class, 'updateFiles']);
    // Route::post('/instantMessaging', [VendorProfileController::class, 'AddinstantMessaging']);
    // Route::post('/updateinstantMessaging', [VendorProfileController::class, 'updateMessagesByVendorId']);
    Route::delete('/deleteMessage', [VendorProfileController::class, 'deleteMessagesByVendorId']);
    Route::get('/TaskType', [VendorProfileController::class, 'findTask']);
    Route::post('/AddPriceList', [VendorProfileController::class, 'AddPriceList']);
    Route::delete('/deletePricelist', [VendorProfileController::class, 'deletePricelist']);
    Route::post('/UpdatePriceList', [VendorProfileController::class, 'UpdatePriceList']);
    Route::post('/AddVendorstools', [VendorProfileController::class, 'AddVendorstools']);
    Route::post('/VendorTest', [VendorProfileController::class, 'AddVendorTest']);
    Route::post('/saveOrUpdateMessages', [VendorProfileController::class, 'saveOrUpdateMessages']);
    Route::post('/VendorEducation', [VendorProfileController::class, 'saveOrUpdateEducation']);
    Route::get('/perm', [AuthController::class, 'routes']);
    Route::post('/AddFormate', [VendorProfileController::class, 'AddFormate']);
    Route::post('/changeFormat', [VendorProfileController::class, 'changeFormat']);
    Route::post('/updateFormat', [VendorProfileController::class, 'updateFormat']);
    Route::delete('/deleteFormat', [VendorProfileController::class, 'deleteFormat']);
    Route::post('/getPriceList', [VendorProfileController::class, 'getPriceListById']);

    Route::post('/getTickets', [TicketsController::class, 'index']);
    Route::post('/getTicketsTotal', [TicketsController::class, 'getTicketsTotal']);
    Route::post('/getPMSalesData', [TicketsController::class, 'getPMSalesData']);
    Route::post('/getTicketData', [TicketsController::class, 'getTicketData']);
    Route::post('/downloadTicketFile', [TicketsController::class, 'download']);
    Route::post('/sendTicketResponse', [TicketsController::class, 'sendTicketResponse']);
    Route::post('/sendTicketVmResponse', [TicketsController::class, 'sendTicketVmResponse']);
    Route::post('/changeTicketStatus', [TicketsController::class, 'changeTicketStatus']);
    Route::delete('/deleteTicketResource', [TicketsController::class, 'deleteTicketResource']);
    Route::post('/assignTicket', [TicketsController::class, 'assignTicket']);
    Route::post('/vmActivity', [ReportsController::class, 'vmActivity']);
    Route::post('/getVmData', [ReportsController::class, 'getVmData']);
    Route::post('/getPmData', [ReportsController::class, 'getPmData']);
    Route::post('/allTasks', [ReportsController::class, 'allTasks']);
    Route::get('/getDashboardChart', [VendorProfileController::class, 'getDashboardChart']);
    Route::post('/MessagePM', [VendorProfileController::class, 'Message_VM_to_PM']);
    Route::post('/VPOS', [ReportsController::class, 'VPOs']);
    Route::post('/downloadVPO', [ReportsController::class, 'download']);
    Route::get('/Departments', [AdminController::class, 'getDepartment']);
    Route::post('/Employees', [AdminController::class, 'getEmployees']);
    Route::post('/Alias', [AdminController::class, 'storeAlias']);
    Route::get('/allAlias', [AdminController::class, 'AliasMails']);
    Route::post('/updateEmailJoinAlias', [AdminController::class, 'updateEmailJoinAlias']);
    Route::delete('/deleteAlias', [AdminController::class, 'destroy']);
    Route::delete('/deleteAliasEmail', [AdminController::class, 'destroyEmail']);
    Route::post('/ChangeStatus', [AdminController::class, 'activeEmail']);
    Route::post('/updateAlias', [AdminController::class, 'updateAlias']);
    Route::post('/MyAlias', [AdminController::class, 'findAlias']);
    Route::post('/notice', [AdminController::class, 'MailProvider']);





});
Route::middleware([App\Http\Middleware\AdminAuth::class])->prefix('Portal')->group(function () {
        Route::group(['prefix' => 'Vendor'], function () {
        Route::post('allJobs', [TaskController::class, 'allJobs'])->name('Portal.allJobs');
        Route::post('allJobOffers', [TaskController::class, 'allJobOffers'])->name('Portal.allJobOffers');
        Route::post('allClosedJobs', [TaskController::class, 'allClosedJobs'])->name('Portal.allClosedJobs');
        Route::post('allPlannedJobs', [TaskController::class, 'allPlannedJobs'])->name('Portal.allPlannedJobs');
        Route::post('viewOffer', [TaskController::class, 'viewOffer'])->name('Portal.viewOffer');
        Route::post('viewJob', [TaskController::class, 'viewJob'])->name('Portal.viewJob');
        Route::post('cancelOffer', [TaskController::class, 'cancelOffer'])->name('Portal.cancelOffer');
        Route::post('acceptOffer', [TaskController::class, 'acceptOffer'])->name('Portal.acceptOffer');
        Route::post('acceptOfferList', [TaskController::class, 'acceptOfferList'])->name('Portal.acceptOfferList');
        Route::post('sendMessage', [TaskController::class, 'sendMessage'])->name('Portal.sendMessage');
        Route::post('finishJob', [TaskController::class, 'finishJob'])->name('Portal.finishJob');
        Route::post('planTaskReply', [TaskController::class, 'planTaskReply'])->name('Portal.planTaskReply');
        Route::post('allInvoices', [InvoiceController::class, 'allInvoices'])->name('Portal.allInvoices');
        Route::post('paidInvoices', [InvoiceController::class, 'paidInvoices'])->name('Portal.paidInvoices');
        Route::post('selectCompletedJobs', [InvoiceController::class, 'selectCompletedJobs'])->name('Portal.selectCompletedJobs');
        Route::post('getSelectedJobData', [InvoiceController::class, 'getSelectedJobData'])->name('Portal.getSelectedJobData');
        Route::post('saveInvoice', [InvoiceController::class, 'saveInvoice'])->name('Portal.saveInvoice');
        Route::post('getVendorBillingData', [InvoiceController::class, 'getVendorBillingData'])->name('Portal.getVendorBillingData');
        Route::post('getPendingTasksCount', [InvoiceController::class, 'getPendingTasksCount'])->name('Portal.getPendingTasksCount');
        Route::post('dashboardData', [TaskController::class, 'index'])->name('Portal.dashboardData');
        Route::post('getAvailabilityList', [AvailabilityController::class, 'index'])->name('Portal.getAvailabilityList');
        Route::post('viewAvailabilityCheck', [AvailabilityController::class, 'viewAvailabilityCheck'])->name('Portal.viewAvailabilityCheck');
        Route::post('acceptAvailability', [AvailabilityController::class, 'acceptAvailability'])->name('Portal.acceptAvailability');
        Route::post('rejectAvailability', [AvailabilityController::class, 'rejectAvailability'])->name('Portal.rejectAvailability');
    });
    Route::group(['prefix' => 'Admin'], function () {
        Route::post('settingsData', [PortalAdminController::class, 'getSettingsData'])->name('Portal.getSettingsData');
        Route::post('saveSettings', [PortalAdminController::class, 'saveSettings'])->name('Portal.saveSettings');
        Route::post('getVendorData', [PortalAdminController::class, 'getVendorData'])->name('Portal.getVendorData');
        Route::post('savePassword', [PortalAdminController::class, 'savePassword'])->name('Portal.savePassword');
        Route::post('getVmNotes', [PortalAdminController::class, 'getVmNotes'])->name('Portal.getVmNotes');
        Route::post('readVmNotes', [PortalAdminController::class, 'readVmNotes'])->name('Portal.readVmNotes');
        Route::post('getUnReadVMNotes', [PortalAdminController::class, 'getUnReadVMNotes'])->name('Portal.getUnReadVMNotes');
    });
});
Route::middleware([App\Http\Middleware\VendorOrUser::class])->group(function () {
    // Route::get('/dashboard', function () {
    //     return "data";
    // });
    Route::post('/EditVendor', [VendorProfileController::class, 'ModificationComplex']);
    Route::get('SelectDatat', [CodingTableController::class, 'SelectDatatTable']);
    Route::get('/GetCountry', [VendorProfileController::class, 'findCountry']);
    Route::get('/GetRegions', [VendorProfileController::class, 'findRegions']);
    Route::get('/GetSubSubject', [VendorProfileController::class, 'findSubSubject']);
    Route::get('/GetTimeZone', [VendorProfileController::class, 'findTimeZone']);
    Route::post('/refreshToken ', [AuthController::class, 'RegenrateToken']);
    Route::post('/SendMessage ', [VendorProfileController::class, 'Message_VM_to_Vendor']);
    Route::post('/download', [VendorProfileController::class, 'download']);    
    Route::post('/updatePersonalInformation', [VendorProfileController::class, 'updatePersonalInfo']);
    Route::post('/UpdateBillingData', [VendorProfileController::class, 'updateBillingData']);
});
  
