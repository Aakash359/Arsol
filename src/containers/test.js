$(document).ready(function () {


    getCompanyCode();
    $("#EmailSent").val(0);
    $('#SubTotal').val("");
    $('#Total').val("");
    $('#SGST').val("");
    $('#CGST').val("");
    $('#IGST').val("");
    $("#ExtraCharge").val("");
    $('#Mymodal').modal('hide');
    $("#EmailModel").modal("hide");
    $('#Mymodal2').modal('hide');
    $('#Mymodal3').modal('hide');
    $('#Mymodal4').modal('hide');
    $('#Mymodal5').modal('hide');
    $('#Mymodal6').modal('hide');
    $("#Addresses").hide();
    $("#Remarks").hide();
    $("#cust_currency").val(47);
    $("#currencyIndex").val("Rupees(INR)");
    $("#cust_language").val(1);
    $("#languageIndex").val("English");
    $('#Customer_Name').val("");
    $('#ExtraCharge').val(0);
    $("#editCustomerLink").hide();
    if ($("#Email_To").val() == "") {
        $("#emailmodellink").hide();
    }
    else {
        $("#emailmodellink").show();
    }
    document.getElementById('lblcode').innerHTML = "HSN Code <span class='required'>*</span>";

    $(function () {
        $('#countryid1').val(96);
        $('#countryIndex').val("India");

        $('#countryid2').val(96);
        $('#countryIndex2').val("India");

        $("#countryIndex").autocomplete({

            source: function (request, response) {
                $.ajax({
                    url: '/UpdateRegistration/AutoComplete/',
                    data: "{ 'prefix': '" + request.term + "'}",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {

                        response($.map(data, function (item) {

                            return item;
                        }))
                    },
                    error: function (response) {

                    },
                    failure: function (response) {

                    }
                });
            },
            select: function (e, i) {

                $("#countryid1").val(i.item.val);
            },
            minLength: 0
        }).focus(function () {
            $(this).autocomplete("search");
        });

        $("#countryIndex2").autocomplete({

            source: function (request, response) {
                $.ajax({
                    url: '/UpdateRegistration/AutoComplete/',
                    data: "{ 'prefix': '" + request.term + "'}",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {

                        response($.map(data, function (item) {

                            return item;
                        }))
                    },
                    error: function (response) {

                    },
                    failure: function (response) {

                    }
                });
            },
            select: function (e, i) {

                $("#countryid2").val(i.item.val);
            },
            minLength: 0
        }).focus(function () {
            $(this).autocomplete("search");
        });

        $("#currencyIndex").autocomplete({

            source: function (request, response) {
                $.ajax({
                    url: '/Home/AutoCompleteCurrency/',
                    data: "{ 'prefix': '" + request.term + "'}",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {

                        response($.map(data, function (item) {

                            return item;
                        }))
                    },
                    error: function (response) {

                    },
                    failure: function (response) {

                    }
                });
            },
            select: function (e, i) {

                $("#cust_currency").val(i.item.val);
            },
            minLength: 0
        }).focus(function () {
            $(this).autocomplete("search");
        });

        $("#languageIndex").autocomplete({

            source: function (request, response) {
                $.ajax({
                    url: '/Home/AutoCompleteLanguage/',
                    data: "{ 'prefix': '" + request.term + "'}",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {

                        response($.map(data, function (item) {

                            return item;
                        }))
                    },
                    error: function (response) {

                    },
                    failure: function (response) {

                    }
                });
            },
            select: function (e, i) {

                $("#cust_language").val(i.item.val);
            },
            minLength: 0
        }).focus(function () {
            $(this).autocomplete("search");
        });

        $("#CustNameIndex").autocomplete({

            source: function (request, response) {
                $.ajax({
                    url: '/Home/AutoCompleteCustomer/',
                    data: "{ 'prefix': '" + request.term + "'}",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {

                        response($.map(data, function (item) {

                            return item;
                        }))
                    },
                    error: function (response) {

                    },
                    failure: function (response) {

                    }
                });
            },
            select: function (e, i) {

                $("#Customer_Name").val(i.item.val);
            },
            minLength: 0
        }).focus(function () {
            $(this).autocomplete("search");
        });

        $("#SalesPersonIndex").autocomplete({

            source: function (request, response) {
                $.ajax({
                    url: '/Home/AutoCompleteSalesperson/',
                    data: "{ 'prefix': '" + request.term + "'}",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {

                        response($.map(data, function (item) {

                            return item;
                        }))
                    },
                    error: function (response) {

                    },
                    failure: function (response) {

                    }
                });
            },
            select: function (e, i) {

                $("#SalesPerson").val(i.item.val);
            },
            minLength: 0
        }).focus(function () {
            $(this).autocomplete("search");
        });

        $("#ItemIndex").autocomplete({

            source: function (request, response) {
                $.ajax({
                    url: '/Home/AutoCompleteItem/',
                    data: "{ 'prefix': '" + request.term + "'}",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {

                        response($.map(data, function (item) {

                            return item;
                        }))
                    },
                    error: function (response) {

                    },
                    failure: function (response) {

                    }
                });
            },
            select: function (e, i) {

                $("#selectItemdd").val(i.item.val);
            },
            minLength: 0
        }).focus(function () {
            $(this).autocomplete("search");
        });

        $("#ItemUnitIndex").autocomplete({

            source: function (request, response) {
                $.ajax({
                    url: '/Home/AutoCompleteItemUnit/',
                    data: "{ 'prefix': '" + request.term + "'}",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {

                        response($.map(data, function (item) {

                            return item;
                        }))
                    },
                    error: function (response) {

                    },
                    failure: function (response) {

                    }
                });
            },
            select: function (e, i) {

                $("#item_unit").val(i.item.value);

            },
            minLength: 0
        }).focus(function () {
            $(this).autocomplete("search");
        });

        $("#gstIndex").autocomplete({

            source: function (request, response) {
                $.ajax({
                    url: '/Home/AutoCompleteGst/',
                    data: "{ 'prefix': '" + request.term + "'}",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {

                        response($.map(data, function (item) {

                            return item;
                        }))
                    },
                    error: function (response) {

                    },
                    failure: function (response) {

                    }
                });
            },
            select: function (e, i) {

                $("#gst_rate").val(i.item.value);

            },
            minLength: 0
        }).focus(function () {
            $(this).autocomplete("search");
        });

        if ($('#countryid1').val() == 96) {
            var loc = $('#countryid1').val();
            $("#stateIndex").autocomplete({

                source: function (request, response) {
                    $.ajax({
                        url: "/UpdateRegistration/AutoBindState?countryId=" + loc,
                        data: "{ 'prefix': '" + request.term + "'}",
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        success: function (data) {
                            response($.map(data, function (item) {

                                return item;
                            }))
                        },
                        error: function (response) {

                        },
                        failure: function (response) {

                        }
                    });
                },
                select: function (e, i) {
                    $("#ddlDistrict").val(i.item.val);
                },
                minLength: 0
            }).focus(function () {
                $(this).autocomplete("search");
            });
        }

        if ($('#countryid2').val() == 96) {
            var loc = $('#countryid2').val();
            $("#stateIndex2").autocomplete({

                source: function (request, response) {
                    $.ajax({
                        url: "/UpdateRegistration/AutoBindState?countryId=" + loc,
                        data: "{ 'prefix': '" + request.term + "'}",
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        success: function (data) {
                            response($.map(data, function (item) {

                                return item;
                            }))
                        },
                        error: function (response) {

                        },
                        failure: function (response) {

                        }
                    });
                },
                select: function (e, i) {
                    $("#ddlDistrict2").val(i.item.val);
                },
                minLength: 0
            }).focus(function () {
                $(this).autocomplete("search");
            });
        }
    })

    $("#countryIndex").blur(function () {
        var loc = $('#countryid1').val();
        $("#stateIndex").autocomplete({

            source: function (request, response) {
                $.ajax({
                    url: "/UpdateRegistration/AutoBindState?countryId=" + loc,
                    data: "{ 'prefix': '" + request.term + "'}",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        response($.map(data, function (item) {

                            return item;
                        }))
                    },
                    error: function (response) {

                    },
                    failure: function (response) {

                    }
                });
            },
            select: function (e, i) {
                $("#ddlDistrict").val(i.item.val);
            },
            minLength: 0
        }).focus(function () {
            $(this).autocomplete("search");
        });
    });

    $("#countryIndex2").blur(function () {
        var loc = $('#countryid2').val();
        $("#stateIndex2").autocomplete({

            source: function (request, response) {
                $.ajax({
                    url: "/UpdateRegistration/AutoBindState?countryId=" + loc,
                    data: "{ 'prefix': '" + request.term + "'}",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        response($.map(data, function (item) {

                            return item;
                        }))
                    },
                    error: function (response) {

                    },
                    failure: function (response) {

                    }
                });
            },
            select: function (e, i) {
                $("#ddlDistrict2").val(i.item.val);
            },
            minLength: 0
        }).focus(function () {
            $(this).autocomplete("search");
        });
    });

    var btn1 = document.getElementById("otherDetailsbtn").classList;
    var btn2 = document.getElementById("addressbtn").classList;
    var btn3 = document.getElementById("remarkbtn").classList;

    $("#addressbtn").click(function () {
        if (btn1.contains("btnedit") || btn3.contains("btnedit")) {
            btn1.remove("btnedit");
            btn1.remove("text-light");
            btn3.remove("btnedit");
            btn3.remove("text-light");
            btn2.add("btnedit");
            btn2.add("text-light");
            $("#Addresses").show();
            $("#otherDetails").hide();
            $("#Remarks").hide();

        }
    })
    $("#remarkbtn").click(function () {
        if (btn1.contains("btnedit") || btn2.contains("btnedit")) {
            btn1.remove("btnedit");
            btn1.remove("text-light");
            btn2.remove("btnedit");
            btn2.remove("text-light");
            btn3.add("btnedit");
            btn3.add("text-light");
            $("#Addresses").hide();
            $("#otherDetails").hide();
            $("#Remarks").show();

        }
    })

    $("#otherDetailsbtn").click(function () {
        if (btn3.contains("btnedit") || btn2.contains("btnedit")) {
            btn2.remove("btnedit");
            btn2.remove("text-light");
            btn3.remove("btnedit");
            btn3.remove("text-light");
            btn1.add("btnedit");
            btn1.add("text-light");
            $("#Addresses").hide();
            $("#otherDetails").show();
            $("#Remarks").hide();

        }
    })

    $("#copyAddress").click(function () {
        var billAttension = $("#billAttension").val();
        var billCountry = $("#countryIndex").val();
        var billCountryid = $("#countryid1").val();
        var billAddress = $("#billAddress").val();
        var billCity = $("#billCity").val();
        var billState = $("#stateIndex").val();
        var billStateid = $("#ddlDistrict").val();
        var billZipCode = $("#billZipCode").val();
        var billPhone = $("#billPhone").val();
        var billFax = $("#billFax").val();

        $("#shipAttension").val(billAttension);
        $("#countryIndex2").val(billCountry);
        $("#countryid2").val(billCountryid);
        $("#shipAddress").val(billAddress);
        $("#shipCity").val(billCity);
        $("#stateIndex2").val(billState);
        $("#ddlDistrict2").val(billStateid);
        $("#shipZipcode").val(billZipCode);
        $("#shipPhone").val(billPhone);
        $("#shipFax").val(billFax);
    })



    $('#Email_To').keyup(function () {

        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (re.test($(this).val())) {

            document.getElementById("btnsaveinvoice").disabled = false;
            $("#emailError").css("display", "none");
            $("#emailmodellink").show();

        } else {
            document.getElementById("btnsaveinvoice").disabled = true;
            $("#emailError").css("display", "block");
            $("#emailError").css("color", "red");
            $("#emailmodellink").hide();
        }
        if ($(this).val() == "") {
            $("#emailError").css("display", "none");
            document.getElementById("btnsaveinvoice").disabled = false;
            $("#emailmodellink").hide();
        }
    });



    $("#saveCustomerDetail").click(function () {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var email = $("#email_id").val();
        var x = document.getElementById("saveCustomerDetail").text;
        if (x == "Save") {
            SaveCustomer(re, email);
        }
        else if (x == "Update") {

            UpdateCustomer(re, email);

        }
    })

    $("#saveSalesPerson").click(function () {
        var salespersonDetails = {};
        salespersonDetails.SalesPerson_Name = $("#sales_name").val();
        salespersonDetails.Salesperson_Email = $("#sales_email").val();
        salespersonDetails.Comp_id = $("#compId").val();
        $.ajax({
            type: "post",
            url: "/Home/SaveSalespersonDetails",
            data: JSON.stringify(salespersonDetails),
            datatype: "json",
            contentType: 'application/json; charset=utf-8',
            success: function () {
                $('#Mymodal2').modal('toggle');
                location.reload();
            },
            error: function () {

            }
        });
    })


    $("#ddlitemtype").change(function () {
        if ($(this).val() == "1") {
            document.getElementById('lblcode').innerHTML = "HSN Code <span class='required'>*</span>";
        }
        else if ($(this).val() == "2") {
            document.getElementById('lblcode').innerHTML = "SAC Code <span class='required'>*</span>";
        }
    })


    $("#saveNewItem").click(function () {

        var space = /\s{2,}/;
        var regexItemName = /^[A-Za-z0-9 ]+$/;
        var isValidItemName = space.test(document.getElementById("item_name").value);
        //var regexItemRate = /^[0-9]+$/;
        //var isValidItemRate = regexItemRate.test(document.getElementById("item_rate").value);
        var regexHsn = /^[A-Za-z0-9 ]+$/;
        var isValidHSN = regexHsn.test(document.getElementById("item_hsn_sac").value);
        var isValidHSN1 = space.test(document.getElementById("item_hsn_sac").value);
        var regexDesc = /^[A-Za-z0-9 ]+$/;
        var isValidDesc = space.test(document.getElementById("item_description").value);
       
        if ($("#item_name").val().trim() != "" && (!isValidHSN1)&& (!isValidItemName) && (!isValidDesc) && $("#item_rate").val().trim() != "" && $("#gstIndex").val().trim() != "" && $("#ItemUnitIndex").val().trim() != "" && $("#ddlitemtype").val() != "" && $("#item_hsn_sac").val().trim() != "" && (isValidHSN) && $("#item_description").val().trim() != "") {

            $.ajax({
                type: "post",
                url: "/Home/CheckItemName?prefix=" + $("#item_name").val(),
                datatype: "json",
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    if (data == 'success') {

                        var newItemDetail = {};
                        newItemDetail.item_Type = $("#ddlitemtype :selected").text();
                        newItemDetail.item_Name = $("#item_name").val();
                        newItemDetail.item_Unit = $("#item_unit").val();
                        newItemDetail.item_Rate = $("#item_rate").val();
                        newItemDetail.item_Description = $("#item_description").val();
                        newItemDetail.item_GSTRate = $("#gst_rate").val();
                        newItemDetail.Comp_id = $("#compId").val();
                        newItemDetail.Hsn_SacCode = $("#item_hsn_sac").val();
                        $.ajax({
                            type: "post",
                            url: "/Home/SaveNewItem",
                            data: JSON.stringify(newItemDetail),
                            datatype: "json",
                            contentType: 'application/json; charset=utf-8',
                            success: function () {

                                $('#Mymodal3').modal('toggle');
                                $('#Mymodal6').modal('toggle');

                            },
                            error: function () {

                            }
                        });
                    }
                    else {
                        $("#errorItemName").text("Item already exists..!!");
                    }
                },
                error: function () {

                }
            });



        }

        if ($("#item_name").val().trim() == "") {
            $("#errorItemName").text("Please insert Item Name..!!");
        }
        else {
            if (isValidItemName) {
                $("#errorItemName").text("More than one space not allowed..!!");
            } else {
                $("#errorItemName").text("");
            }                      
        }
        if ($("#item_rate").val().trim() == "") {
            $("#errorItemRate").text("Please insert Item Rate..!!");
        }
        else {
            //if (!isValidItemRate) {
            //    $("#errorItemRate").text("No special characters & Alphabets are allowed..!! ");
            //} else {
                $("#errorItemRate").text("");
            //}
        }
        if ($("#gstIndex").val().trim() == "") {
            $("#errorGstRate").text("Please insert GST Rate..!!");
        }
        else {
            $("#errorGstRate").text("");
        }
        if ($("#ItemUnitIndex").val().trim() == "") {
            $("#errorItemUnit").text("Please select Item Unit..!!");
        }
        else {
            $("#errorItemUnit").text("");
        }
        if ($("#ddlitemtype").val().trim() == "") {
            $("#errorItemType").text("Please select Item Type..!!");
        }
        else {
            $("#errorItemType").text("");
        }

        if ($("#item_hsn_sac").val().trim() == "") {
            $("#errorcode").text("Please enter HSN/SAC code ..!!");
        }
        else {
            if (!isValidHSN) {
                $("#errorcode").text("No special characters are allowed..!! ");
            } else {
                if (isValidHSN1) {
                    $("#errorcode").text("More than one space not allowed..!!");
                }
                else
                {
                    $("#errorcode").text("");
                }
               
            }
        }

        if ($("#item_description").val().trim() == "") {
            $("#errorDescription").text("Please enter Description ..!!");
        }
        else {
            if (isValidDesc) {
                $("#errorDescription").text("More than one space not allowed..!!");
            } else {
                $("#errorDescription").text("");
            }

                //$("#errorDescription").text("");
           
        }
    })
    getLastDate();

    $("#cust_Terms").val("Due on Receipt");
});


function SaveCustomer(re, email) {
    var space = /\s{2,}/;
    var istrue = false;
    var isValidfname = space.test(document.getElementById("f_name").value);
    if (isValidfname)
    {
        istrue = true;
    }
    var isValidlname = space.test(document.getElementById("l_name").value);
    if (isValidlname) {
        istrue = true;
    }
    var isValidcompname = space.test(document.getElementById("comapny_name").value);
    if (isValidcompname) {
        istrue = true;
    }
    var isValiddispname = space.test(document.getElementById("display_name").value);
    if (isValiddispname) {
        istrue = true;
    }
    var isValidbillAddress = space.test(document.getElementById("billAddress").value);
    if (isValidbillAddress) {
        istrue = true;
    }
    var isValidshipAddress = space.test(document.getElementById("shipAddress").value);
    if (isValidshipAddress) {
        istrue = true;
    }
    var isValidbillCity = space.test(document.getElementById("billCity").value);
    if (isValidbillCity) {
        istrue = true;
    }
    var isValidshipCity = space.test(document.getElementById("shipCity").value);
    if (isValidshipCity) {
        istrue = true;
    }





    if ($("#f_name").val().trim() != "" && (istrue == false) && $("#comapny_name").val().trim() != "" && $("#display_name").val().trim() != "" && $("#ddlDistrict").val().trim() != "" && $("#ddlDistrict2").val().trim() != "" && $("#billAddress").val().trim() != "" && $("#billCity").val().trim() != "" && $("#billZipCode").val().trim() != "" && $("#shipAddress").val().trim() != "" && $("#shipCity").val().trim() != "" && $("#shipZipcode").val().trim() != "" && $("#billPhone").val().trim() != "" && $("#shipPhone").val().trim() != "" && $("#stateIndex").val().trim() != "" && $("#stateIndex2").val().trim() != "") {
       
        var zip = /^\d{6}$/;
        var phoneno = /^\d{10}$/;
        var billphone = $("#billPhone").val();
        var shipphone = $("#shipPhone").val();
        var zipbill = $("#billZipCode").val();
        var zipship = $("#shipZipcode").val();
        var iserror = false;
        if (phoneno.test(billphone) == false) {
            $("#errorBillPhone").text("Please enter valid Billing Phone..!!");
            iserror = true;
        }
        else {
            $("#errorBillPhone").text("");
        }

        if (phoneno.test(shipphone) == false) {
            $("#errorShipPhone").text("Please enter valid Shipping Phone..!!");
            iserror = true;
        }
        else {
            $("#errorShipPhone").text("");
        }

        if (zip.test(zipbill) == false) {
            $("#errorBillzipcode").text("Please enter valid Billing Address Zipcode..!!");
            iserror = true;
        }
        else {
            $("#errorBillzipcode").text("");
        }
        if (zip.test(zipship) == false) {
            $("#errorShipZipcode").text("Please enter valid Shipping Address Zipcode..!!");
            iserror = true;
        }
        else {
            $("#errorShipZipcode").text("");
        }

        if (iserror == false) {
            if ($("#gst_number").val() != "") {

                if ($("#email_id").val() == "") {
                    $("#errorEmailTo").text("Please enter Email id!!");
                }
                if (re.test(email) == false) {
                    $("#errorEmailTo").text("Please enter valid Email id!!");
                }
                else {
                    SaveCust();
                }
            }
            else {
                if (email != "") {
                    if (re.test(email) == false) {
                        $("#errorEmailTo").text("Please enter valid Email id!!");
                    }
                    else {
                        SaveCust();
                    }
                }
                else {
                    SaveCust();
                }

            }
        }


    }
    else { ValidCustDetails(); }
   
}
function SaveCust() {
    $("#errorCompany").text("");
    $("#errorEmailTo").text("");
    var custDetail = {};
    custDetail.Cust_salutation = $("#ddlsalutation :selected").text();
    custDetail.First_Name = $("#f_name").val();
    custDetail.Last_Name = $("#l_name").val();
    custDetail.Company_name = $("#comapny_name").val();
    custDetail.Contact_Display_Name = $("#display_name").val();
    custDetail.Contact_Email = $("#email_id").val();
    custDetail.Gst_number = $("#gst_number").val();
    custDetail.Contact_Phone = $("#phone_number").val();
    custDetail.Contact_Mobile = $("#mobile_number").val();
    custDetail.Website = $("#website").val();
    custDetail.Currency = $("#cust_currency").val();
    custDetail.Payment_Terms = $("#payment_terms").val();
    custDetail.Enable_portal = $("#chkportal:checked").val();
    custDetail.Portal_Language = $("#cust_language").val();
    custDetail.Facebook = $("#facebook").val();
    custDetail.Twitter = $("#twitter").val();
    //custDetail.Bill_Attention = $("#billAttension").val();
    custDetail.Bill_Country = $("#countryid1").val();
    custDetail.Bill_Address = $("#billAddress").val();
    custDetail.Bill_City = $("#billCity").val();
    custDetail.Bill_State = $("#ddlDistrict").val();
    custDetail.Bill_zipcode = $("#billZipCode").val();
    custDetail.Bill_Phone = $("#billPhone").val();
    custDetail.Bill_Fax = $("#billFax").val();
    //custDetail.Ship_Attention = $("#shipAttension").val();
    custDetail.Ship_Country = $("#countryid2").val();
    custDetail.Ship_Address = $("#shipAddress").val();
    custDetail.Ship_City = $("#shipCity").val();
    custDetail.Ship_State = $("#ddlDistrict2").val();
    custDetail.Ship_zipcode = $("#shipZipcode").val();
    custDetail.Ship_Phone = $("#shipPhone").val();
    custDetail.Ship_Fax = $("#shipFax").val();
    custDetail.Remarks = $("#remark").val();
    custDetail.Comp_id = $("#compId").val();

    if ($("#chkActive").prop("checked")) {
        custDetail.Isactive = "1";
    }
    else {
        custDetail.Isactive = "0";
    }


    $.ajax({
        type: "post",
        url: "/ShowCustomerDetails/AddCustomer",
        data: JSON.stringify(custDetail),/*'{custDetail: ' + JSON.stringify(custDetail) + '}'*/
        datatype: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            if (data == "Success") {
                var element = document.getElementById("Mymodal");
                var element1 = document.getElementById("Mymodal5");
                if (typeof (element) != 'undefined' && element != null) {
                    $('#Mymodal').modal('toggle');
                }

                if (typeof (element1) != 'undefined' && element1 != null) {
                    $('#Mymodal5').modal('toggle');
                    location.reload();
                }
            }
            else if (data == "Fail") {
                $("#errorCompany").text("");
            }
            else if (data == "1") {
                $("#errorCompany").text("Company already exists..!!");
            }
            else {
                var data1 = data.split('-');
                if (data1[0] == '1') {
                    $("#errorCompany").text("Company already exists..!!");
                }
                if (data1[1] == '1') {
                    $("#errorGST").text("Gst number already exists..!!");
                }
                if (data1[2] == '1') {
                    $("#errorEmailTo").text("Email already exists..!!");
                }
            }
        },
        error: function () {

        }
    });
}
function UpdateCustomer(re, email) {
    if ($("#f_name").val().trim() != "" && $("#comapny_name").val().trim() != "" && $("#display_name").val().trim() != "" && $("#ddlDistrict").val().trim() != "" && $("#ddlDistrict2").val().trim() != "" && $("#billAddress").val().trim() != "" && $("#billCity").val().trim() != "" && $("#billZipCode").val().trim() != "" && $("#shipAddress").val().trim() != "" && $("#shipCity").val().trim() != "" && $("#shipZipcode").val().trim() != "" && $("#billPhone").val().trim() != "" && $("#shipPhone").val().trim() != "" && $("#stateIndex").val().trim() != "" && $("#stateIndex2").val().trim() != "") {

        var zip = /^\d{6}$/;
        var phoneno = /^\d{10}$/;
        var billphone = $("#billPhone").val();
        var shipphone = $("#shipPhone").val();
        var zipbill = $("#billZipCode").val();
        var zipship = $("#shipZipcode").val();
        var iserror = false;
        if (phoneno.test(billphone) == false) {
            $("#errorBillPhone").text("Please enter valid Billing Phone..!!");
            iserror = true;
        }
        else {
            $("#errorBillPhone").text("");
        }

        if (phoneno.test(shipphone) == false) {
            $("#errorShipPhone").text("Please enter valid Shipping Phone..!!");
            iserror = true;
        }
        else {
            $("#errorShipPhone").text("");
        }

        if (zip.test(zipbill) == false) {
            $("#errorBillzipcode").text("Please enter valid Billing Address Zipcode..!!");
            iserror = true;
        }
        else {
            $("#errorBillzipcode").text("");
        }
        if (zip.test(zipship) == false) {
            $("#errorShipZipcode").text("Please enter valid Shipping Address Zipcode..!!");
            iserror = true;
        }
        else {
            $("#errorShipZipcode").text("");
        }


        if (iserror == false) {
            if ($("#gst_number").val() != "") {

                if ($("#email_id").val() == "") {
                    $("#errorEmailTo").text("Please enter Email id!!");
                }
                if (re.test(email) == false) {
                    $("#errorEmailTo").text("Please enter valid Email id!!");
                }
                else {
                    UpdateCust();
                }

            }
            else {
                if (email != "") {
                    if (re.test(email) == false) {
                        $("#errorEmailTo").text("Please enter valid Email id!!");
                    }
                    else {
                        UpdateCust();
                    }
                }
                else {
                    UpdateCust();
                }


            }
        }



    }
    else { ValidCustDetails();}
   
}
function UpdateCust() {
    $("#errorCompany").text("");
    $("#errorEmailTo").text("");
    var custDetail = {};
    custDetail.Cust_id = $("#item_id").val();
    custDetail.Cust_salutation = $("#ddlsalutation :selected").text();
    custDetail.First_Name = $("#f_name").val();
    custDetail.Last_Name = $("#l_name").val();
    custDetail.Company_name = $("#comapny_name").val();
    custDetail.Contact_Display_Name = $("#display_name").val();
    custDetail.Contact_Email = $("#email_id").val();
    custDetail.Gst_number = $("#gst_number").val();
    custDetail.Contact_Phone = $("#phone_number").val();
    custDetail.Contact_Mobile = $("#mobile_number").val();
    custDetail.Website = $("#website").val();
    custDetail.Currency = $("#cust_currency").val();
    custDetail.Payment_Terms = $("#payment_terms").val();
    custDetail.Portal_Language = $("#cust_language").val();
    custDetail.Facebook = $("#facebook").val();
    custDetail.Twitter = $("#twitter").val();
    //custDetail.Bill_Attention = $("#billAttension").val();
    custDetail.Bill_Country = $("#countryid1").val();
    custDetail.Bill_Address = $("#billAddress").val();
    custDetail.Bill_City = $("#billCity").val();
    custDetail.Bill_State = $("#ddlDistrict").val();
    custDetail.Bill_zipcode = $("#billZipCode").val();
    custDetail.Bill_Phone = $("#billPhone").val();
    custDetail.Bill_Fax = $("#billFax").val();
    //custDetail.Ship_Attention = $("#shipAttension").val();
    custDetail.Ship_Country = $("#countryid2").val();
    custDetail.Ship_Address = $("#shipAddress").val();
    custDetail.Ship_City = $("#shipCity").val();
    custDetail.Ship_State = $("#ddlDistrict2").val();
    custDetail.Ship_zipcode = $("#shipZipcode").val();
    custDetail.Ship_Phone = $("#shipPhone").val();
    custDetail.Ship_Fax = $("#shipFax").val();
    custDetail.Remarks = $("#remark").val();
    if ($("#chkActive").prop("checked")) {
        custDetail.Isactive = "1";
    }
    else {
        custDetail.Isactive = "0";
    }
    $.ajax({
        type: "post",
        url: "/ShowCustomerDetails/EditItem",
        data: JSON.stringify(custDetail),/*'{custDetail: ' + JSON.stringify(custDetail) + '}'*/
        datatype: "json",
        contentType: 'application/json; charset=utf-8',

        success: function (data) {
            if (data == "Success") {
                $('#Mymodal').modal('toggle');
                //location.reload();
            }
            else if (data == "Fail") {
                $("#errorCompany").text("");
            }
            else if (data == "1") {
                $("#errorCompany").text("Company already exists..!!");
            }
            else {
                var data1 = data.split('-');
                if (data1[0] == '1') {
                    $("#errorCompany").text("Company already exists..!!");
                }
                if (data1[1] == '1') {
                    $("#errorGST").text("Gst number already exists..!!");
                }
                if (data1[2] == '1') {
                    $("#errorEmailTo").text("Email already exists..!!");
                }
            }
        },
        error: function () {

        }
    });
}
function ValidCustDetails() {
    var space = /\s{2,}/;
    var btn1 = document.getElementById("otherDetailsbtn").classList;
    var btn2 = document.getElementById("addressbtn").classList;
    var btn3 = document.getElementById("remarkbtn").classList;
    var isValidfname = space.test(document.getElementById("f_name").value);
    var isValidlname = space.test(document.getElementById("l_name").value);
    var isValidcompname = space.test(document.getElementById("comapny_name").value);
    var isValiddispname = space.test(document.getElementById("display_name").value);
    var isValidbillAddress = space.test(document.getElementById("billAddress").value);
    var isValidshipAddress = space.test(document.getElementById("shipAddress").value);
    var isValidbillCity = space.test(document.getElementById("billCity").value);
    var isValidshipCity = space.test(document.getElementById("shipCity").value);


    if ($("#f_name").val().trim() == "") {
        $("#errorName").text("Please enter Contact Name!!");
    }
    else {
        if (isValidfname || isValidlname) {
            $("#errorName").text("More than one space not allowed..!!");
        }
        else {
            $("#errorName").text("");
        }
       
    }
    if ($("#comapny_name").val().trim() == "") {
        $("#errorCompany").text("Please enter Company Name!!");
    }
    else {
        if (isValidcompname) {
            $("#errorCompany").text("More than one space not allowed..!!");
        }
        else {
            $("#errorCompany").text("");
        }
        //$("#errorCompany").text("");
    }
    if ($("#display_name").val().trim() == "") {
        $("#errorDisplay").text("Please enter Contact Display Name!!");
    }
    else {
        if (isValiddispname) {
            $("#errorDisplay").text("More than one space not allowed..!!");
        }
        else {
            $("#errorDisplay").text("");
        }
        //$("#errorDisplay").text("");
    }
    if ($("#billAddress").val().trim() == "") {
        if (btn1.contains("btnedit") || btn3.contains("btnedit")) {
            btn1.remove("btnedit");
            btn1.remove("text-light");
            btn3.remove("btnedit");
            btn3.remove("text-light");
            btn2.add("btnedit");
            btn2.add("text-light");
            $("#Addresses").show();
            $("#otherDetails").hide();
            $("#Remarks").hide();

        }
        $("#errorBillAddress").text("Please enter Billing Address..!!");
    }
    else if ($("#billAddress").val().trim() != "") {

        if (isValidbillAddress) {
            $("#errorBillAddress").text("More than one space not allowed..!!");
        }
        else {
            $("#errorBillAddress").text("");
        }
        //$("#errorBillAddress").text("");
    }
    if ($("#billCity").val().trim() == "") {
        if (btn1.contains("btnedit") || btn3.contains("btnedit")) {
            btn1.remove("btnedit");
            btn1.remove("text-light");
            btn3.remove("btnedit");
            btn3.remove("text-light");
            btn2.add("btnedit");
            btn2.add("text-light");
            $("#Addresses").show();
            $("#otherDetails").hide();
            $("#Remarks").hide();

        }
        $("#errorBillCity").text("Please enter Billing City..!!");
    }
    else if ($("#billCity").val().trim() != "") {

        if (isValidbillCity) {
            $("#errorBillCity").text("More than one space not allowed..!!");
        }
        else {
            $("#errorBillCity").text("");
        }
        //$("#errorBillCity").text("");
    }
    if ($("#stateIndex").val().trim() == "") {

        $("#errorBillState").text("Please select Billing State..!!");
    }
    else {
        $("#errorBillState").text("");
    }
    if ($("#stateIndex2").val().trim() == "") {
        $("#errorShipState").text("Please select Shipping State..!!");
    }
    else {
        $("#errorShipState").text("");
    }

    if ($("#ddlDistrict").val().trim() == "") {
        if (btn1.contains("btnedit") || btn3.contains("btnedit")) {
            btn1.remove("btnedit");
            btn1.remove("text-light");
            btn3.remove("btnedit");
            btn3.remove("text-light");
            btn2.add("btnedit");
            btn2.add("text-light");
            $("#Addresses").show();
            $("#otherDetails").hide();
            $("#Remarks").hide();

        }
        $("#errorBillState").text("Please select Billing State..!!");
    }
    else if ($("#ddlDistrict").val().trim() != "") {
        //$("#errorBillState").text("");
    }

    if ($("#ddlDistrict2").val().trim() == "") {
        if (btn1.contains("btnedit") || btn3.contains("btnedit")) {
            btn1.remove("btnedit");
            btn1.remove("text-light");
            btn3.remove("btnedit");
            btn3.remove("text-light");
            btn2.add("btnedit");
            btn2.add("text-light");
            $("#Addresses").show();
            $("#otherDetails").hide();
            $("#Remarks").hide();

        }
        $("#errorShipState").text("Please select Shipping State..!!");
    }
    else if ($("#ddlDistrict2").val().trim() != "") {
        //$("#errorShipState").text("");
    }


    if ($("#billZipCode").val().trim() == "") {
        if (btn1.contains("btnedit") || btn3.contains("btnedit")) {
            btn1.remove("btnedit");
            btn1.remove("text-light");
            btn3.remove("btnedit");
            btn3.remove("text-light");
            btn2.add("btnedit");
            btn2.add("text-light");
            $("#Addresses").show();
            $("#otherDetails").hide();
            $("#Remarks").hide();

        }
        $("#errorBillzipcode").text("Please enter Billing Address Zipcode..!!");
    }
    else if ($("#billZipCode").val().trim() != "") {

        $("#errorBillzipcode").text("");
    }
    if ($("#billPhone").val().trim() == "") {
        if (btn1.contains("btnedit") || btn3.contains("btnedit")) {
            btn1.remove("btnedit");
            btn1.remove("text-light");
            btn3.remove("btnedit");
            btn3.remove("text-light");
            btn2.add("btnedit");
            btn2.add("text-light");
            $("#Addresses").show();
            $("#otherDetails").hide();
            $("#Remarks").hide();

        }
        $("#errorBillPhone").text("Please enter Billing Phone..!!");
    }
    else if ($("#billPhone").val().trim() != "") {
        $("#errorBillPhone").text("");
    }




    if ($("#shipAddress").val().trim() == "") {
        if (btn1.contains("btnedit") || btn3.contains("btnedit")) {
            btn1.remove("btnedit");
            btn1.remove("text-light");
            btn3.remove("btnedit");
            btn3.remove("text-light");
            btn2.add("btnedit");
            btn2.add("text-light");
            $("#Addresses").show();
            $("#otherDetails").hide();
            $("#Remarks").hide();

        }
        $("#errorShipAddress").text("Please enter Shipping Address..!!");
    }
    else if ($("#shipAddress").val() != "") {
        if (isValidshipAddress) {
            $("#errorShipAddress").text("More than one space not allowed..!!");
        }
        else {
            $("#errorShipAddress").text("");
        }

        //$("#errorShipAddress").text("");
    }
    if ($("#shipCity").val().trim() == "") {
        if (btn1.contains("btnedit") || btn3.contains("btnedit")) {
            btn1.remove("btnedit");
            btn1.remove("text-light");
            btn3.remove("btnedit");
            btn3.remove("text-light");
            btn2.add("btnedit");
            btn2.add("text-light");
            $("#Addresses").show();
            $("#otherDetails").hide();
            $("#Remarks").hide();

        }
        $("#errorShipCity").text("Please enter Shipping City..!!");
    }
    else if ($("#shipCity").val().trim() != "") {

        if (isValidshipCity) {
            $("#errorShipCity").text("More than one space not allowed..!!");
        }
        else {
            $("#errorShipCity").text("");
        }
        //$("#errorShipCity").text("");
    }
    if ($("#shipZipcode").val().trim() == "") {
        if (btn1.contains("btnedit") || btn3.contains("btnedit")) {
            btn1.remove("btnedit");
            btn1.remove("text-light");
            btn3.remove("btnedit");
            btn3.remove("text-light");
            btn2.add("btnedit");
            btn2.add("text-light");
            $("#Addresses").show();
            $("#otherDetails").hide();
            $("#Remarks").hide();

        }
        $("#errorShipZipcode").text("Please enter Shipping Address Zipcode..!!");
    }
    else if ($("#shipZipcode").val().trim() != "") {
        $("#errorShipZipcode").text("");
    }
    if ($("#shipPhone").val().trim() == "") {
        if (btn1.contains("btnedit") || btn3.contains("btnedit")) {
            btn1.remove("btnedit");
            btn1.remove("text-light");
            btn3.remove("btnedit");
            btn3.remove("text-light");
            btn2.add("btnedit");
            btn2.add("text-light");
            $("#Addresses").show();
            $("#otherDetails").hide();
            $("#Remarks").hide();

        }
        $("#errorShipPhone").text("Please enter Shipping Phone..!!");
    }
    else if ($("#shipPhone").val().trim() != "") {
        $("#errorShipPhone").text("");
    }
}


$('#MybtnModal').click(function () {
    var countcust = $('#MybtnModal').attr('data-id');
    var planid = $('#Subscription_Plan').attr('data-id');

    var flag = 0;

    if (planid == 1) {
        flag = 1;
    }
    if (planid == 2 || planid==5) {
        flag = 2;
    }
    if (planid == 3) {
        flag = 3;
    }

    if (flag == 1) {
        if (countcust < 5 && planid == 1) {

            $('#Mymodal').modal('show');
            document.getElementById('modeldlg').hidden = false;
            $("#saveCustomerDetail").text("Save");
            $("#ddlsalutation").val("Salutation");
            $("#f_name").val("");
            $("#l_name").val("");
            $("#comapny_name").val("");
            $("#display_name").val("");
            $("#email_id").val("");
            $("#gst_number").val("");
            $("#phone_number").val("");
            $("#mobile_number").val("");
            $("#website").val("");
            $("#cust_currency").val(47);
            $("#currencyIndex").val("Rupees(INR)");
            $("#payment_terms").val("");
            $("#cust_language").val(1);
            $("#cust_language").val("English");
            $("#facebook").val("");
            $("#twitter").val("");
            $("#countryid1").val(96);
            $("#countryIndex").val("India");
            $("#billAddress").val("");
            $("#billCity").val("");
            $("#ddlDistrict").val(1628);
            $("#stateIndex").val("Uttar Pradesh");
            $("#billZipCode").val("");
            $("#billPhone").val("");
            $("#billFax").val("");
            $("#countryid2").val(96);
            $("#countryIndex2").val("India");
            $("#shipAddress").val("");
            $("#shipCity").val("");
            $("#ddlDistrict2").val(1628);
            $("#stateIndex2").val("Uttar Pradesh");
            $("#shipZipcode").val("");
            $("#shipPhone").val("");
            $("#shipFax").val("");
            $("#remark").val("");
        }
        else {

            swal({
                title: "You are not authorized for create more than 5 customers !",
                text: "You will be Redirect to subscription plan !",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes!",
                cancelButtonText: "No, please!",
                closeOnConfirm: true,
                closeOnCancel: false
            },
                function (isConfirm) {
                    if (isConfirm) {
                        window.location.href = "/Home/RenewSubscription";

                    }
                    else {
                        swal("Aborted", "Your Request is aborted :)", "error");
                    }
                });
        }
    }
    else if (flag == 2) {
        if (countcust < 100 && (planid == 2 || planid==5)) {

            $('#Mymodal').modal('show');
            document.getElementById('modeldlg').hidden = false;
            $("#saveCustomerDetail").text("Save");
            $("#ddlsalutation").val("Salutation");
            $("#f_name").val("");
            $("#l_name").val("");
            $("#comapny_name").val("");
            $("#display_name").val("");
            $("#email_id").val("");
            $("#gst_number").val("");
            $("#phone_number").val("");
            $("#mobile_number").val("");
            $("#website").val("");
            $("#cust_currency").val(47);
            $("#currencyIndex").val("Rupees(INR)");
            $("#payment_terms").val("");
            $("#cust_language").val(1);
            $("#cust_language").val("English");
            $("#facebook").val("");
            $("#twitter").val("");
            $("#countryid1").val(96);
            $("#countryIndex").val("India");
            $("#billAddress").val("");
            $("#billCity").val("");
            $("#ddlDistrict").val(1628);
            $("#stateIndex").val("Uttar Pradesh");
            $("#billZipCode").val("");
            $("#billPhone").val("");
            $("#billFax").val("");
            $("#countryid2").val(96);
            $("#countryIndex2").val("India");
            $("#shipAddress").val("");
            $("#shipCity").val("");
            $("#ddlDistrict2").val(1628);
            $("#stateIndex2").val("Uttar Pradesh");
            $("#shipZipcode").val("");
            $("#shipPhone").val("");
            $("#shipFax").val("");
            $("#remark").val("");
        }
        else {

            swal({
                title: "You are not authorized for create more than 100 customers !",
                text: "You will be Redirect to subscription plan !",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes!",
                cancelButtonText: "No, please!",
                closeOnConfirm: true,
                closeOnCancel: false
            },
                function (isConfirm) {
                    if (isConfirm) {
                        window.location.href = "/Home/RenewSubscription";

                    }
                    else {
                        swal("Aborted", "Your Request is aborted :)", "error");
                    }
                });
        }
    }
    else if (flag == 3) {
        if (countcust < 500 && planid == 3) {
            $('#Mymodal').modal('show');
            document.getElementById('modeldlg').hidden = false;
            $("#saveCustomerDetail").text("Save");
            $("#ddlsalutation").val("Salutation");
            $("#f_name").val("");
            $("#l_name").val("");
            $("#comapny_name").val("");
            $("#display_name").val("");
            $("#email_id").val("");
            $("#gst_number").val("");
            $("#phone_number").val("");
            $("#mobile_number").val("");
            $("#website").val("");
            $("#cust_currency").val(47);
            $("#currencyIndex").val("Rupees(INR)");
            $("#payment_terms").val("");
            $("#cust_language").val(1);
            $("#cust_language").val("English");
            $("#facebook").val("");
            $("#twitter").val("");
            $("#countryid1").val(96);
            $("#countryIndex").val("India");
            $("#billAddress").val("");
            $("#billCity").val("");
            $("#ddlDistrict").val(1628);
            $("#stateIndex").val("Uttar Pradesh");
            $("#billZipCode").val("");
            $("#billPhone").val("");
            $("#billFax").val("");
            $("#countryid2").val(96);
            $("#countryIndex2").val("India");
            $("#shipAddress").val("");
            $("#shipCity").val("");
            $("#ddlDistrict2").val(1628);
            $("#stateIndex2").val("Uttar Pradesh");
            $("#shipZipcode").val("");
            $("#shipPhone").val("");
            $("#shipFax").val("");
            $("#remark").val("");
        }
        else {

            swal({
                title: "You are not authorized for create more than 500 customers !",
                text: "You will be Redirect to subscription plan !",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes!",
                cancelButtonText: "No, please!",
                closeOnConfirm: true,
                closeOnCancel: false
            },
                function (isConfirm) {
                    if (isConfirm) {
                        window.location.href = "/Home/RenewSubscription";

                    }
                    else {
                        swal("Aborted", "Your Request is aborted :)", "error");
                    }
                });
        }
    }


 

});

$('#addCustomer').click(function () {
    var CustDet = $("#customerdetails").val();
    if (CustDet == "true") {

        var countcust = $('#addCustomer').attr('data-id');
        var planid = $('#Subscription_Plan').attr('data-id');

        var flag = 0;

        if (planid == 1) {
            flag = 1;
        }
        if (planid == 2 || planid == 5) {
            flag = 2;
        }
        if (planid == 3) {
            flag = 3;
        }

        if (flag == 1) {
            if (countcust < 5 && planid == 1) {

                $('#Mymodal5').modal('show');
                document.getElementById('modeldlg').hidden = false;
            }
            else {

                swal({
                    title: "You are not authorized for create more than 5 customers !",
                    text: "You will be Redirect to subscription plan !",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes!",
                    cancelButtonText: "No, please!",
                    closeOnConfirm: true,
                    closeOnCancel: false
                },
                    function (isConfirm) {
                        if (isConfirm) {
                            window.location.href = "/Home/RenewSubscription";

                        }
                        else {
                            swal("Aborted", "Your Request is aborted :)", "error");
                        }
                    });
            }
        }
        else if (flag == 2) {
            if (countcust < 100 && (planid == 2 || planid == 5)) {

                $('#Mymodal5').modal('show');
                document.getElementById('modeldlg').hidden = false;
            }
            else {

                swal({
                    title: "You are not authorized for create more than 100 customers !",
                    text: "You will be Redirect to subscription plan !",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes!",
                    cancelButtonText: "No, please!",
                    closeOnConfirm: true,
                    closeOnCancel: false
                },
                    function (isConfirm) {
                        if (isConfirm) {
                            window.location.href = "/Home/RenewSubscription";

                        }
                        else {
                            swal("Aborted", "Your Request is aborted :)", "error");
                        }
                    });
            }
        }
        else if (flag == 3) {
            if (countcust < 500 && planid == 3) {
                $('#Mymodal5').modal('show');
                document.getElementById('modeldlg').hidden = false;
            }
            else {

                swal({
                    title: "You are not authorized for create more than 500 customers !",
                    text: "You will be Redirect to subscription plan !",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes!",
                    cancelButtonText: "No, please!",
                    closeOnConfirm: true,
                    closeOnCancel: false
                },
                    function (isConfirm) {
                        if (isConfirm) {
                            window.location.href = "/Home/RenewSubscription";

                        }
                        else {
                            swal("Aborted", "Your Request is aborted :)", "error");
                        }
                    });
            }
        }

    } else {
        toastr["error"]('You are not authorized to create customers !', "Sorry");

    }
   
});

$('#addItemDashboard').click(function () {
    var itemDet = $("#itemdetails").val();
    if (itemDet == "true") {
        $('#Mymodal6').modal('show')
        document.getElementById('itemhide').hidden = false;
    }
    else{
        toastr["error"]('You are not authorized to create items !', "Sorry");

    }
});

$('#MybtnModal2').click(function () {
    $('#Mymodal2').modal('show')
    document.getElementById('modeldlg2').hidden = false;
});

$('#addItem').click(function () {
    $('#Mymodal3').modal('show')
    document.getElementById('modeldlg3').hidden = false;

});
$('#addItem2').click(function () {
    $('#Mymodal3').modal('show');
    document.getElementById('modeldlg3').hidden = false;
    $('#Mymodal4').modal('hide');
});

$('#Mymodal').modal({
    backdrop: 'static',
    keyboard: false
})

$('#Mymodal5').modal({
    backdrop: 'static',
    keyboard: false
})

$('#Mymodal6').modal({
    backdrop: 'static',
    keyboard: false
})
$('#Mymodal2').modal({
    backdrop: 'static',
    keyboard: false
})

$('#Mymodal3').modal({
    backdrop: 'static',
    keyboard: false
})

$("#selectItem").click(function () {
    document.getElementById('errorItemExist').innerHTML = "";
    document.getElementById('itemError').innerHTML = "";
    if ($("#Customer_Name").val() == "") {
        document.getElementById('customerError').innerHTML = "Please select Customer..!!";

    }
    else if (($("#Customer_Name").val() != "")) {
        $("#Mymodal4").modal('show');
        document.getElementById('modeldlg4').hidden = false;
        $("#ItemIndex").val("");
        var lbl = document.getElementById('customerError');
        lbl.innerText = "";

    }
})

$('#Mymodal4').modal({
    backdrop: 'static',
    keyboard: false
})
var dynID = 1;

function getIdOfInvoice() {

}

function getCompanyCode() {
    $.ajax({
        type: "get",
        url: "/Home/GetCompanyCode",
        datatype: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            var compid = response.CompanyCode;
            $.ajax({
                type: "get",
                url: "/Home/GetIDfromInvoice",
                datatype: "json",
                contentType: 'application/json; charset=utf-8',
                success: function (response) {
                    var curr_Date = new Date();
                    var curr_Year = curr_Date.getFullYear();
                    var nextyear = curr_Date.getFullYear() + 1;
                    var TdgtNxtYr = nextyear.toString().substr(-2);

                    var id = parseInt(response.InvSeq);
                    var FInYear = response.FinYear;
                    // var CompId = response.Payment_Option;
                    var CompId = compid;
                    if (id < 10) {
                        var id2 = "00" + parseInt(id);
                    }
                    if (id >= 10 && id < 100) {
                        var id2 = "0" + parseInt(id);
                    }
                    if (id >= 100) {
                        var id2 = parseInt(id);
                    }
                    //var invoice_id = CompId + "/" + curr_Year + "-" + TdgtNxtYr + "/" + id2;
                    var invoice_id = CompId + "/" + FInYear + "/" + id2;
                    $("#Invoice_Number").val(invoice_id);
                },
                error: function () {
                    var curr_Date = new Date();
                    var CompId = compid;
                    var curr_Year = curr_Date.getFullYear();
                    var nextyear = curr_Date.getFullYear() + 1;
                    var TdgtNxtYr = nextyear.toString().substr(-2);
                    var invoice_id = CompId + "/" + curr_Year + "-" + TdgtNxtYr + "/" + 001;
                    $("#Invoice_Number").val(invoice_id);

                }
            });
        },
        error: function () {

        }
    });
}

$("#Terms").change(function () {

    var invoiceDate = $("#Invoice_Date").val();
    var date = String(today.getDate()).padStart(2, '0');
    var dueDate = date.setDate(date.getDate() + 1);

})
var subtotal = "";

$("#selectItembtn1").click(function (value) {

    var slecteditemID = $("#selectItemdd").val();
    $.ajax({
        type: "get",
        url: "/Home/GetSelectedItemData?selectId=" + slecteditemID,
        //  data: JSON.stringify(custDetail),/*'{custDetail: ' + JSON.stringify(custDetail) + '}'*/
        datatype: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            var item_type = response.item_Type;
            var item_name = response.item_Name;
            var item_quantity;
            var item_rate = response.item_Rate;
            var item_gst = response.item_GSTRate;
            var item_description = response.item_Description;
            var item_id = response.item_ID;
            var item_qty = response.item_Unit;
            var item_hsnSac = response.Hsn_SacCode;
            var value = $("#tbltbody").find('td').html();
            var value2 = ($('#tbltbody td:contains(' + value + ')'));
            var flag = 1;
            $(".tblitemid").each(function (index) {
                var tblitemname = $(this).val();

                if (tblitemname === item_id) {
                    flag = 0;
                }
            });
            if (item_gst == null) {
                item_gst = 0;
            }
            if (item_hsnSac == null) {
                item_hsnSac = "na";
            }
            document.getElementById('errorItemExist').innerHTML = "";
            var markup = "<tr class=''><td class='hiddenid tabletxtbox'><input class='tblitemid'  id='itemid" + dynID + "'  value=" + item_id + "></td><td><input type='textbox' class='form-control tabletxtbox' value=" + item_type + " id='itemtype" + dynID + "' readonly></td><td class='hiddenid'><input type='hidden' class='form-control tabletxtbox tblitemname' value=" + item_name + " id='itemname" + dynID + "'></td><td ><textarea type='text' class='form-control tabletxtbox tblitemname' style='resize:none' value=" + item_description + " id='itemdescription" + dynID + "'></textarea></td><td><input type='number' onKeyup='unit(" + dynID + ")' class='form-control tabletxtbox item1' id='itemunit" + dynID + "' placeholder='Add Quantity'></td><td><input type='textbox'  onKeyup='QtyItem(" + dynID + ")' class='form-control tabletxtbox' value=" + item_qty + "  id='itemQty" + dynID + "' readonly></td><td><input type='number' placeholder='Rate'  onKeyup='rateItem(" + dynID + ")' class='form-control tabletxtbox rate1' value=" + item_rate + "  id='itemrate" + dynID + "'></td><td><input type='number' onKeyup='discount(" + dynID + ")'  class='form-control tabletxtbox' id='itemdiscount" + dynID + "'></td><td><input type='textbox' class='form-control tabletxtbox tblrow' id='itemamount" + dynID + "' readonly></td><td style='display:none'><input type='hidden' class='form-control tabletxtbox tblrow5' id='itemamount2" + dynID + "' readonly></td><td><a onclick='remove(" + dynID + ")'    class='remCF'><i class='fa fa-trash - alt fa-2x'></i></a></td><td style='display:none'><input type='hidden'  onKeyup='discItem2(" + dynID + ")' class='form-control tabletxtbox tblrow4'  id='itemdisc2" + dynID + "'></td></tr>";

            $("#tblitem tbody").append(markup);
            $("#itemunit" + dynID).val("1");
            var unit = $("#itemunit" + dynID).val();
            var rate = $("#itemrate" + dynID).val();
            var gst = $("#itemgst" + dynID).val();
            var discountval = $('#itemdiscount' + dynID).val();
            $("#itemname" + dynID).val(item_name);
            $("#itemdescription" + dynID).val(item_description);
            var doscountedAmount = (rate / 100) * discountval;
            var amount1 = parseFloat(rate) - parseFloat(doscountedAmount);
            var gstAmount = (amount1 / 100) * gst;
            var amount = Math.round(unit * amount1);
            $("#itemgst2" + dynID).val(Math.round(gstAmount));
            $("#itemdisc2" + dynID).val(Math.round(doscountedAmount));
            //$("#itemamount" + dynID).val(Math.round(amount + gstAmount));
            $("#itemamount" + dynID).val(Math.round(amount));
            $("#itemamount2" + dynID).val(amount);

            totalAmount();
            totalgstFloat();
            totaldiscount();
            amountwithoutgst();
            dynID = dynID + 1;

            var a = parseFloat($('#Total').val());
            var b = parseFloat($('#ExtraCharge').val());
            if (isNaN(b)) {
                b = 0;
            }
            subtotal = a - b;
            $('#Mymodal4').modal('hide');


        },
        error: function () {


        }
    });




});


$("#selectItembtn").click(function (value) {

    var slecteditemID = $("#selectItemdd").val();
    $.ajax({
        type: "get",
        url: "/Home/GetSelectedItemData?selectId=" + slecteditemID,
        //  data: JSON.stringify(custDetail),/*'{custDetail: ' + JSON.stringify(custDetail) + '}'*/
        datatype: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            var item_type = response.item_Type;
            var item_name = response.item_Name;
            var item_quantity;
            var item_rate = response.item_Rate;
            var item_gst = response.item_GSTRate;
            var item_description = response.item_Description;
            var item_id = response.item_ID;
            var item_qty = response.item_Unit;
            var item_hsnSac = response.Hsn_SacCode;
            var value = $("#tbltbody").find('td').html();      
            var value2 = ($('#tbltbody td:contains(' + value + ')'));
            var flag = 1;
            $(".tblitemid").each(function (index) {
                var tblitemname = $(this).val();

                if (tblitemname === item_id) {
                    flag = 0;
                }
            });
                if (item_gst == null) {
                    item_gst = 0;
                }
                if (item_hsnSac == null) {
                    item_hsnSac = "na";
                }
                document.getElementById('errorItemExist').innerHTML = "";
                var markup = "<tr class=''><td class='hiddenid tabletxtbox'><input class='tblitemid'  id='itemid" + dynID + "'  value=" + item_id + "></td><td><input type='textbox' class='form-control tabletxtbox' value=" + item_type + " id='itemtype" + dynID + "' readonly></td><td class='hiddenid'><input type='hidden' class='form-control tabletxtbox tblitemname' value=" + item_name + " id='itemname" + dynID + "'></td><td ><textarea type='text' class='form-control tabletxtbox tblitemname' style='resize:none' value=" + item_description + " id='itemdescription" + dynID + "'></textarea></td><td><input type='number' onKeyup='unit(" + dynID + ")' class='form-control tabletxtbox item1' id='itemunit" + dynID + "' placeholder='Add Quantity'></td><td><input type='textbox'  onKeyup='QtyItem(" + dynID + ")' class='form-control tabletxtbox' value=" + item_qty + "  id='itemQty" + dynID + "' readonly></td><td><input type='number' placeholder='Rate'  onKeyup='rateItem(" + dynID + ")' class='form-control tabletxtbox rate1' value=" + item_rate + "  id='itemrate" + dynID + "'></td><td><input type='textbox' class='form-control tabletxtbox' value=" + item_hsnSac + "  id='itemHsnSac" + dynID + "'></td><td><input type='textbox'  onKeyup='gstrateItem(" + dynID + ")' class='form-control tabletxtbox tblgstrow' value=" + item_gst + "  id='itemgst" + dynID + "' readonly='readonly'></td><td style='display:none'><input type='hidden'  onKeyup='gstrateItem2(" + dynID + ")' class='form-control tabletxtbox tblrow2'  id='itemgst2" + dynID + "'></td><td><input type='number' onKeyup='discount(" + dynID + ")' class='form-control tabletxtbox' id='itemdiscount" + dynID + "'></td><td><input type='textbox' class='form-control tabletxtbox tblrow' id='itemamount" + dynID + "' readonly></td><td style='display:none'><input type='hidden' class='form-control tabletxtbox tblrow5' id='itemamount2" + dynID + "' readonly></td><td><a onclick='remove(" + dynID + ")'    class='remCF'><i class='fa fa-trash - alt fa-2x'></i></a></td><td style='display:none'><input type='hidden'  onKeyup='discItem2(" + dynID + ")' class='form-control tabletxtbox tblrow4'  id='itemdisc2" + dynID + "'></td></tr>";

                $("#tblitem tbody").append(markup);
                $("#itemunit" + dynID).val("1");
                var unit = $("#itemunit" + dynID).val();
                var rate = $("#itemrate" + dynID).val();
                var gst = $("#itemgst" + dynID).val();
                var discountval = $('#itemdiscount' + dynID).val();
                $("#itemname" + dynID).val(item_name);
                $("#itemdescription" + dynID).val(item_description);
                var doscountedAmount = (rate / 100) * discountval;
                var amount1 = parseFloat(rate) - parseFloat(doscountedAmount);
                var gstAmount = (amount1 / 100) * gst;
                var amount = Math.round(unit * amount1);
                $("#itemgst2" + dynID).val(Math.round(gstAmount));
                $("#itemdisc2" + dynID).val(Math.round(doscountedAmount));
                //$("#itemamount" + dynID).val(Math.round(amount + gstAmount));
                $("#itemamount" + dynID).val(Math.round(amount));
                $("#itemamount2" + dynID).val(amount);

                totalAmount();
                totalgstFloat();
                totaldiscount();
                amountwithoutgst();
                dynID = dynID + 1;

                var a = parseFloat($('#Total').val());
                var b = parseFloat($('#ExtraCharge').val());
                if (isNaN(b)) {
                    b = 0;
                }
                subtotal = a - b;
                $('#Mymodal4').modal('hide');
           

        },
        error: function () {


        }
    });




});
var item = {};
$("#tblitem").on('click', '.remCF', function (e) {
    //e.stopImmediatePropagation();
    //var elm = $(this).parent().text().substr(0, $(this).parent().text().length - 1);
    //$(this).parent().remove();
    //item.splice(item.indexOf(elm), 1);
    $(this).parent().parent().remove();
    $(this).parent().parent().removeData();
    totalAmount();
    totalgstFloat();
    totaldiscount();
    amountwithoutgst();
});
$("#Terms").change(function () {
    var TermsId = document.getElementById("Terms").value;
    var dateCurr = document.getElementById("Invoice_Date").value;
    var date = dateCurr.setDate(dateCurr.getDate() + 7);

    if (TermsId === 1) {
        date.getDate() + days;
    }
});

$("#btnsaveinvoice").click(function () {
    'use strict'
    var flag = false;
    $(".tblitemname").each(function (index) {

        flag = true;
    });

    if (flag == true) {
        saveItem();
        saveInvoice();      
    }
    else {
        document.getElementById('itemError').innerHTML = "Please select an Item..!!";
        return false;
    }

})

function saveItem()
{
    for (var i = 1; i <= (dynID - 1); i++) {
        item.invoice_number = $("#Invoice_Number").val();
        item.item_id = $("#itemid" + i).val();
        item.item_type = $("#itemtype" + i).val();
        item.item_detail = $("#itemname" + i).val();
        item.item_description = $("#itemdescription" + i).val();
        item.item_quantity = $("#itemunit" + i).val();
        item.item_unit = $("#itemQty" + i).val();
        item.item_rate = $("#itemrate" + i).val();
        item.Hsn_SacCode = $("#itemHsnSac" + i).val();
        item.item_gst = $("#itemgst" + i).val();
        item.item_discount = $("#itemdiscount" + i).val();
        item.item_amount = $("#itemamount" + i).val();
        item.item_gstrate = $("#itemgst2" + i).val();
        item.item_discountrate = $("#itemdisc2" + i).val();
        item.item_total = $("#itemamount2" + i).val();
        sleep(300);

        $.ajax({
            type: "post",
            url: "/Home/Saveitemtotable",
            data: JSON.stringify(item),
            datatype: "json",
            contentType: 'application/json; charset=utf-8',
            success: function () {

            },
            error: function () {

            }
        });
    }
}

function saveInvoice() {

    var tmpinvdate = $("#Invoice_Date").val();
    var arrinvdt = tmpinvdate.split('/');
    var mdfinvdt = arrinvdt[1] + "/" + arrinvdt[0] + "/" + arrinvdt[2];
    var NewInvoice = {};
    NewInvoice.Template = $("input[name=Template]:checked").val();
    NewInvoice.Customer_Name = $("#Customer_Name").val();
    NewInvoice.Invoice_Number = $("#Invoice_Number").val();
    NewInvoice.Order_Number = $("#Order_Number").val();

    NewInvoice.Invoice_Date = mdfinvdt;
    NewInvoice.Terms = $("#cust_Terms").val();
    NewInvoice.Due_Date = $("#Due_Date").val();
    NewInvoice.SalesPerson = $("#SalesPerson").val();
    NewInvoice.Project_code = $("#Project_code").val();
    NewInvoice.SGST = $("#SGST").val();
    NewInvoice.CGST = $("#CGST").val();
    NewInvoice.IGST = $("#IGST").val();
    NewInvoice.Discount = $("#Discount").val();
    NewInvoice.CGST_percentage = $("#CGST_percentage").val();
    NewInvoice.SGST_percentage = $("#SGST_percentage").val();
    NewInvoice.IGST_percentage = $("#IGST_percentage").val();
    NewInvoice.SubTotal = $("#SubTotal").val();
    NewInvoice.Amount = $("#Amount").val();
    NewInvoice.ExtraCharge = $("#ExtraCharge").val();
    NewInvoice.customer_currency = $("#customer_currency").val();
    NewInvoice.Total = $("#Total").val();
    NewInvoice.Customer_Notes = $("#Customer_Notes").val();
    NewInvoice.Terms_Conditions = $("#Terms_Conditions").val();
    NewInvoice.Email_To = $("#Email_To").val();
    NewInvoice.SendEmail = $("#SendEmail").val();
    NewInvoice.Email_Subject = $("#Email_Subject").val();
    var message = $("#Email_Body").val();
    message = message.replace(/(?:\r\n|\r|\n)/g, '<br/>');
    NewInvoice.Email_Body = message;

    sleep(500);

    $.ajax({
        type: "post",
        url: "/Home/NewwInvoice",
        data: JSON.stringify(NewInvoice),
        datatype: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            location.reload();
            if (data == "Goods & Service") {
                window.location.href = "/Home/PdfInvoice";
                //window.open('/Home/PdfInvoice', '_blank', 'location=yes,height=700,width=1170,scrollbars=yes,status=yes');
            }
            else if (data == "Service") {
                window.location.href = "/Home/ServiceInvoice";
                //window.open('/Home/ServiceInvoice', '_blank', 'location=yes,height=700,width=1170,scrollbars=yes,status=yes');
            }
        },
        error: function () {

        }
    });


    $("#CustNameIndex").val("");
    document.getElementById('emailchk').checked = false;

}


function sleep(milliseconds) {

    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

function unit(id) {

    var gstval = $('#itemgst' + id).val();

    //alert("test");$(this).attr('id')
    var unitval = $('#itemunit' + id).val();
    var rateval = $('#itemrate' + id).val();
    var discountval = $('#itemdiscount' + id).val();
    if (discountval == "" || isNaN(discountval)) {
        discountval = parseFloat(0);
    }
    if (unitval == "" || isNaN(unitval)) {
        unitval = parseFloat(0);
    }
    if (rateval == "" || isNaN(rateval)) {
        rateval = parseFloat(0);
    }


    var doscountedAmount2 = (rateval / 100) * discountval;
    var rateaftergst = parseFloat(rateval) - parseFloat(doscountedAmount2);
    var doscountedAmount = (rateaftergst / 100) * gstval;
    //var rateaftergst2 = parseFloat(rateaftergst) + parseFloat(doscountedAmount);
    var rateaftergst2 = parseFloat(rateaftergst);
    var amount = Math.round(unitval * rateaftergst2);
    $('#itemamount' + id).val("");
    $('#itemamount' + id).val(amount);
    $('#itemamount2' + id).val(rateaftergst * unitval);
    // alert(id);
    $("#itemgst2" + id).val(Math.round(doscountedAmount * unitval));
    $("#itemdisc2" + id).val(Math.round(doscountedAmount2 * unitval));
    totalAmount();
    totaldiscount();
    unitfloat();
    amountwithoutgst();
    var a = parseFloat($('#Total').val());
    var b = parseFloat($('#ExtraCharge').val());
    if (isNaN(b)) {
        b = 0;
    }
    subtotal = a - b;
}

function rateItem(id) {
    var gstval = $('#itemgst' + id).val();
    //alert("test");$(this).attr('id')
    var unitval = $('#itemunit' + id).val();
    var rateval = $('#itemrate' + id).val();
    var discountval = $('#itemdiscount' + id).val();
    if (discountval == "" || isNaN(discountval)) {
        discountval = parseFloat(0);
    }
    if (unitval == "" || isNaN(unitval)) {
        unitval = parseFloat(0);
    }
    if (rateval == "" || isNaN(rateval)) {
        rateval = parseFloat(0);
    }


    var doscountedAmount2 = (rateval / 100) * discountval;
    var rateaftergst = parseFloat(rateval) - parseFloat(doscountedAmount2);
    var doscountedAmount = (rateaftergst / 100) * gstval;
    //var rateaftergst2 = parseFloat(rateaftergst) + parseFloat(doscountedAmount);
    var rateaftergst2 = parseFloat(rateaftergst);
    var amount = Math.round(unitval * rateaftergst2);
    $('#itemamount' + id).val("");
    $('#itemamount' + id).val(amount);
    $('#itemamount2' + id).val(rateaftergst * unitval);
    $("#itemgst2" + id).val(Math.round(doscountedAmount * unitval));
    $("#itemdisc2" + id).val(Math.round(doscountedAmount2 * unitval));
    // alert(id);
    totalAmount();
    totalgstFloat();
    totaldiscount();
    amountwithoutgst();
    var a = parseFloat($('#Total').val());
    var b = parseFloat($('#ExtraCharge').val());
    if (isNaN(b)) {
        b = 0;
    }
    subtotal = a - b;

}


function discount(id) {
    var gstval = $('#itemgst' + id).val();
    //alert("test");$(this).attr('id')
    var discountval = $('#itemdiscount' + id).val();
    var unitval = $('#itemunit' + id).val();
    var rateval = $('#itemrate' + id).val();
    if (discountval == "" || isNaN(discountval)) {
        discountval = parseFloat(0);
    }

    if (discountval > 100) {
        $('#itemdiscount' + id).val(100);
        discountval = 100;
        swal({
            title: "Alert ?",
            text: "Discount should be less than or equal to 100% !",
            type: "warning",
            showCancelButton: false,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "OK",
            closeOnConfirm: true

        },
            function (isConfirm) {
                if (isConfirm) {

                    swal("Aborted", "Your Request is aborted :)", "error");
                }

            });

    }

    if (unitval == "" || isNaN(unitval)) {
        unitval = parseFloat(0);
    }
    if (rateval == "" || isNaN(rateval)) {
        rateval = parseFloat(0);
    }

    var doscountedAmount = (rateval / 100) * discountval;
    var rateaftergst = parseFloat(rateval) - parseFloat(doscountedAmount);
    var gstAmount = (rateaftergst / 100) * gstval;

    //var finalAmount = parseFloat(rateaftergst) + parseFloat(gstAmount);
    var finalAmount = parseFloat(rateaftergst);
    var amount = Math.round(unitval * finalAmount);
    $('#itemamount' + id).val("");
    $('#itemamount' + id).val(amount);
    $('#itemamount2' + id).val(rateaftergst * unitval);
    $("#itemgst2" + id).val(Math.round(gstAmount * unitval));
    $("#itemdisc2" + id).val(Math.round(doscountedAmount * unitval));
    // alert(id);
    totalAmount();
    amountwithoutgst();
    totalgstFloat();
    totaldiscount();
    var a = parseFloat($('#Total').val());
    var b = parseFloat($('#ExtraCharge').val());
    if (isNaN(b)) {
        b = 0;
    }
    subtotal = a - b;
}


function gstrateItem(id) {
    var gstval = $('#itemgst' + id).val();
    //alert("test");$(this).attr('id')
    var discountval = $('#itemdiscount' + id).val();
    var unitval = $('#itemunit' + id).val();
    var rateval = $('#itemrate' + id).val();

    var doscountedAmount = (rateval / 100) * discountval;

    var rateaftergst = parseFloat(rateval) - parseFloat(doscountedAmount);
    var gstAmount = (rateaftergst / 100) * gstval;
    //var finalAmount = parseFloat(rateaftergst) + parseFloat(gstAmount);
    var finalAmount = parseFloat(rateaftergst);
    var amount = Math.round(unitval * finalAmount);
    $('#itemamount' + id).val("");
    $('#itemamount' + id).val(amount);
    $('#itemamount2' + id).val(rateaftergst * unitval);
    $("#itemgst2" + id).val(Math.round(gstAmount * unitval));
    $("#itemdisc2" + id).val(Math.round(doscountedAmount * unitval));
    // alert(id);
    totalAmount();
    totalgstFloat();
    totaldiscount();
    amountwithoutgst();
}



function totalAmount() {
    var totalAmt = 0;
    $(".tblrow").each(function (index) {
        totalAmt += parseInt($(this).val());

    });
    var totalAmt2 = 0;
    $(".tblrow2").each(function (index) {

        totalAmt2 += parseFloat($(this).val());

    });
    $('#SubTotal').val(totalAmt);
    var extracharge = parseFloat($("#ExtraCharge").val());
    if (isNaN(extracharge) || extracharge == "") {
        extracharge = parseFloat(0);
    }
    var total = parseFloat(totalAmt + extracharge + totalAmt2);
    $('#Total').val(total);
}

function totalAmountFloat() {
    var totalAmt = 0;
    $(".tblrow").each(function (index) {
        totalAmt += parseFloat($(this).val());

    });
    $('#SubTotal').val(totalAmt);
    var extracharge = parseFloat($("#ExtraCharge").val());
    var total = parseFloat(totalAmt + extracharge);
    $('#Total').val(total);
}

function totalgstFloat() {
    var totalAmt = 0;

    $(".tblrow2").each(function (index) {

        totalAmt += parseFloat($(this).val());

    });

    var gstAmt = 0;
    var countgst = 0;
    $(".tblgstrow").each(function (index) {
        countgst += 1;
        gstAmt += parseFloat($(this).val());

    });

    var item = 0;
    $(".item1").each(function (index) {

        item += parseInt($(this).val());

    });

    var totalrate = 0;
    $(".tblrow").each(function (index) {

        totalrate += parseFloat($(this).val());

    });

    var amtItem = parseFloat(totalrate * item);
    var finalGst = (totalAmt / 2);
    var gstPercentage = parseInt(gstAmt);
    var gstprcntDivide = (gstPercentage / 2);
    if ($("#stateidcomp").val() == $("#stateidcust").val()) {
        $('#SGST').val(finalGst);
        $('#CGST').val(finalGst);
        $('#IGST').val("");

        $('#CGST_percentage').val(gstprcntDivide);
        $('#SGST_percentage').val(gstprcntDivide);
        $('#IGST_percentage').val("");
    }
    else if ($("#stateidcomp").val() != $("#stateidcust").val()) {
        $('#IGST').val(totalAmt);
        $('#SGST').val("");
        $('#CGST').val("");

        $('#CGST_percentage').val("");
        $('#SGST_percentage').val("");
        $('#IGST_percentage').val(gstPercentage);
    }

}

function totaldiscount() {
    var totalAmt = 0;

    $(".tblrow4").each(function (index) {

        totalAmt += parseFloat($(this).val());

    });

    $('#Discount').val(totalAmt);

}

function amountwithoutgst() {
    var totalAmt = 0;

    $(".tblrow5").each(function (index) {

        totalAmt += parseFloat($(this).val());

    });

    $('#Amount').val(Math.round(totalAmt));

}

function unitfloat() {
    var totalAmt = 0;

    $(".tblrow2").each(function (index) {

        totalAmt += parseFloat($(this).val());

    });

    var gstAmt = 0;
    var countgst = 0;
    $(".tblgstrow").each(function (index) {
        countgst += 1;
        gstAmt += parseFloat($(this).val());

    });

    var item = 0;
    $(".item1").each(function (index) {

        item += parseInt($(this).val());

    });

    var totalrate = 0;
    $(".rate1").each(function (index) {

        totalrate += parseFloat($(this).val());

    });

    var amtItem = parseFloat(totalrate * item);
    var finalGst = Math.round(totalAmt / 2);
    var gstPercentage = (parseInt(gstAmt));
    var gstprcntDivide = (gstPercentage / 2);
    if ($("#stateidcomp").val() == $("#stateidcust").val()) {
        $('#SGST').val(finalGst);
        $('#CGST').val(finalGst);
        $('#IGST').val("");

        $('#CGST_percentage').val(gstprcntDivide);
        $('#SGST_percentage').val(gstprcntDivide);
        $('#IGST_percentage').val("");
    }
    else if ($("#stateidcomp").val() != $("#stateidcust").val()) {
        $('#IGST').val(totalAmt);
        $('#SGST').val("");
        $('#CGST').val("");

        $('#CGST_percentage').val("");
        $('#SGST_percentage').val("");
        $('#IGST_percentage').val(gstPercentage);
    }
}

$("#ExtraCharge").keyup(function () {
        var extracharge = parseFloat($(this).val());
        if (isNaN(extracharge) || extracharge == "") {
            extracharge = parseFloat(0);
        }

        if (extracharge != 0) {
            var total = parseFloat(subtotal + extracharge);
            $("#Total").val(total);
        }
        else {

            totalAmount();
        }
})

$('#gst_number').keyup(function () {

    var gst = $('#gst_number').val();
    if (gst != "") {
        var reg = /^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[1-9A-Z]{1}[A-Za-z]{1}[0-9A-Z]{1}$/;
        if (reg.test(gst)) {
            $("#errorGST").text("");
        }
        else {
            $("#errorGST").text("Invalid GST Number..!!");

        }
    }
    else {
        $("#errorGST").text("");
    }
});

function sync() {
    var n1 = document.getElementById('mobile_number');
    var n2 = document.getElementById('billPhone');
    var n3 = document.getElementById('shipPhone');
    n2.value = n1.value;
    n3.value = n1.value;
}

$('#CustNameIndex').blur(function () {
    document.getElementById('customerError').innerHTML = "";
    var email = $('#Customer_Name').val();
    var index = $('#CustNameIndex').val();

    if (email != "" && index != "") {
        document.getElementById("btnsaveinvoice").disabled = false;
        $("#custErrorShow").hide();
        $.ajax({
            type: "post",
            url: "/Home/FillEmail?emailId=" + email,
            datatype: "json",
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                var resultEmail = data.Contact_Email;
                var stateId = data.Bill_State;
                var custCurrency = data.Currency;
                var invoice = $("#Invoice_Number").val();
                var invoice_date = $("#Invoice_Date").val();
                $("#stateidcust").val(stateId);
                $("#Email_To").val(resultEmail);
                $("#customer_currency").val(custCurrency);
                $("#editCustomerLink").show();
                $("#Email_Subject").val("Invoice " + invoice);
                if (data.Last_Name == null || data.Last_Name == "null") {
                    data.Last_Name = "";
                }
                $("#Email_Body").val("Dear " + data.First_Name + " " + data.Last_Name + "," + "\r" + "Thank for your business. Please find your attached Invoice. We appreciate your prompt payment. " + "\r" + "Invoice no. " + invoice + "\r" + "Invoice Date. " + invoice_date + "\r" + "Thanks, " + "\r" + data.Comp_id);


                if ($("#Email_To").val() == "") {
                    $("#emailmodellink").hide();
                }
                else {
                    $("#emailmodellink").show();
                }
            }
        });
    }
    else if (email == "" || index == "") {
        document.getElementById("btnsaveinvoice").disabled = true;
        $("#custErrorShow").show();
        $("#Email_To").val("");
        $("#customer_currency").val("");
        $("#editCustomerLink").hide();
        $("#emailmodellink").hide();
    }

});






//$("#Invoice_Date").change(function () {
//    $(".duedate").val("");
//    $(".duedate").datepicker({
//        dateFormat: 'yy-mm-dd'
//    });
//    //var today = new Date();
//    var today = new Date($("#Invoice_Date").val());
//    var numberOfDaysToAdd = parseInt(15);
//    today.setDate(today.getDate() + numberOfDaysToAdd);
//    var dd = today.getDate();
//    if (dd < 10) { dd = "0" + dd }
//    var mm = today.getMonth() + 1;
//    if (mm < 10) { mm = "0" + mm }
//    var yyyy = today.getFullYear();

//    var someFormattedDate = dd + '/' + mm + '/' + yyyy;
//    console.log(someFormattedDate);
//    $(".duedate").val(someFormattedDate);
//})


$("#errorEmailTo").text("");
$('#email_id').keyup(function () {
    var email = document.getElementById('email_id').value;
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (re.test(email)) {

        $("#errorEmailTo").text("");

    } else {


        $("#errorEmailTo").text("Invalid Mail Id..!!");
    }
    if (email == "") {
        $("#errorEmailTo").text("");

    }
});




$("#cust_Terms").change(function () {
    var dt = $("#Invoice_Date").val();
    var dateParts = dt.split("/");

    dt = dateParts[1] + "/" + dateParts[0] + "/" + dateParts[2];
    dateParts = dt.split("/");

    if ($("#cust_Terms").val() == "Net 15") {
        $(".duedate").val("");
        //$(".duedate").datepicker({
        //    dateFormat: 'dd/mm/yy'
        //});
        //var today = new Date();

        $("#Due_Date").datepicker("disable");

        var today = new Date(dateParts);
        var numberOfDaysToAdd = parseInt(15);



        today.setDate(today.getDate() + numberOfDaysToAdd);
        var dd = today.getDate();

        if (dd < 10) { dd = "0" + dd }
        var mm = today.getMonth() + 1;
        if (mm < 10) { mm = "0" + mm }
        var yyyy = today.getFullYear();

        var someFormattedDate = dd + '/' + mm + '/' + yyyy;

        console.log(someFormattedDate);
        $(".duedate").val(someFormattedDate);
        document.getElementById("Due_Date").setAttribute("readonly", true);
        //document.getElementById("Due_Date").valueAsDate = someFormattedDate;
    }

    else if ($("#cust_Terms").val() == "Net 30") {
        $(".duedate").val("");
        //$(".duedate").datepicker({
        //    dateFormat: 'dd/mm/yy'
        //});
        //var today = new Date();
        $("#Due_Date").datepicker("disable");
        var today = new Date(dateParts);
        var numberOfDaysToAdd = parseInt(30);
        today.setDate(today.getDate() + numberOfDaysToAdd);
        var dd = today.getDate();
        if (dd < 10) { dd = "0" + dd }
        var mm = today.getMonth() + 1;
        if (mm < 10) { mm = "0" + mm }
        var yyyy = today.getFullYear();

        var someFormattedDate = dd + '/' + mm + '/' + yyyy;
        console.log(someFormattedDate);
        $(".duedate").val(someFormattedDate);
        document.getElementById("Due_Date").setAttribute("readonly", true);
        //document.getElementById("Due_Date").valueAsDate = someFormattedDate;
    }
    else if ($("#cust_Terms").val() == "Net 45") {
        $(".duedate").val("");
        //$("#Due_Date").datepicker({
        //    dateFormat: 'dd/mm/yy'
        //});
        //var today = new Date();
        $("#Due_Date").datepicker("disable");
        var today = new Date(dateParts);
        var numberOfDaysToAdd = parseInt(45);
        today.setDate(today.getDate() + numberOfDaysToAdd);
        var dd = today.getDate();
        if (dd < 10) { dd = "0" + dd }
        var mm = today.getMonth() + 1;
        if (mm < 10) { mm = "0" + mm }
        var yyyy = today.getFullYear();

        var someFormattedDate = dd + '/' + mm + '/' + yyyy;
        console.log(someFormattedDate);
        $(".duedate").val(someFormattedDate);
        document.getElementById("Due_Date").setAttribute("readonly", true);
        //document.getElementById("Due_Date").valueAsDate = someFormattedDate;
    }
    else if ($("#cust_Terms").val() == "Net 60") {
        $(".duedate").val("");
        //$("#Due_Date").datepicker({
        //    dateFormat: 'dd/mm/yy'
        //});
        //var today = new Date();
        $("#Due_Date").datepicker("disable");
        var today = new Date(dateParts);
        var numberOfDaysToAdd = parseInt(60);
        today.setDate(today.getDate() + numberOfDaysToAdd);
        var dd = today.getDate();
        if (dd < 10) { dd = "0" + dd }
        var mm = today.getMonth() + 1;
        if (mm < 10) { mm = "0" + mm }
        var yyyy = today.getFullYear();

        var someFormattedDate = dd + '/' + mm + '/' + yyyy;
        console.log(someFormattedDate);
        $(".duedate").val(someFormattedDate);
        document.getElementById("Due_Date").setAttribute("readonly", true);
        //document.getElementById("Due_Date").valueAsDate = someFormattedDate;
    }

    else if ($("#cust_Terms").val() == "Due end of the month") {
        $(".duedate").val("");
        //$("#Due_Date").datepicker({
        //    dateFormat: 'dd/mm/yy'
        //});
        $("#Due_Date").datepicker("disable");
        var date = new Date(dateParts);
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        var dd = (lastDay.getDate());
        if (dd < 10) { dd = "0" + dd }
        var mm = (lastDay.getMonth() + 1);
        if (mm < 10) { mm = "0" + mm }
        var yyyy = lastDay.getFullYear();

        var lastDayWithSlashes = dd + '/' + mm + '/' + yyyy;

        //alert(lastDayWithSlashes);
        $(".duedate").val(lastDayWithSlashes);
        document.getElementById("Due_Date").setAttribute("readonly", true);

    }

    else if ($("#cust_Terms").val() == "Due end of next month") {
        $(".duedate").val("");
        //$("#Due_Date").datepicker({
        //    dateFormat: 'dd/mm/yy'
        //});
        $("#Due_Date").datepicker("disable");
        var date = new Date(dateParts);
        var firstDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 2, 0);
        var dd = (lastDay.getDate());
        if (dd < 10) { dd = "0" + dd }
        var mm = (lastDay.getMonth() + 1);
        if (mm < 10) { mm = "0" + mm }
        var yyyy = lastDay.getFullYear();
        var lastDayWithSlashes = dd + '/' + mm + '/' + yyyy;

        // alert(lastDayWithSlashes);
        $(".duedate").val(lastDayWithSlashes);
        document.getElementById("Due_Date").setAttribute("readonly", true);

    }

    else if ($("#cust_Terms").val() == "Due on Receipt") {
        $(".duedate").val("");
        //$("#Due_Date").datepicker({
        //    dateFormat: 'dd/mm/yy'
        //});
        //var today = new Date();
        $("#Due_Date").datepicker("disable");
        var today = new Date(dateParts);
        var numberOfDaysToAdd = parseInt(0);
        today.setDate(today.getDate() + numberOfDaysToAdd);
        var dd = today.getDate();
        if (dd < 10) { dd = "0" + dd }
        var mm = today.getMonth() + 1;
        if (mm < 10) { mm = "0" + mm }
        var yyyy = today.getFullYear();

        var someFormattedDate = dd + '/' + mm + '/' + yyyy;
        console.log(someFormattedDate);
        $(".duedate").val(someFormattedDate);
        document.getElementById("Due_Date").setAttribute("readonly", true);
    }
    else if ($("#cust_Terms").val() == "Custom") {
        //$(".duedate").val("");

        $("#Due_Date").datepicker("enable");

        var dt = $("#Invoice_Date").val();
        var dateParts = dt.split("/");
        dt = dateParts[1] + "/" + dateParts[0] + "/" + dateParts[2];
        dateParts = dt.split("/");
        var today = new Date(dateParts);
        $("#Due_Date").datepicker({
            dateFormat: 'dd/mm/yy',
            minDate: new Date(today),
            onClose: function () {

                $("#Due_Date").datepicker(
                    "change", {
                        dateFormat: 'dd/mm/yy',
                        minDate: today
                    })
            }
        }).datepicker('setDate', 'today');


        //$("#Due_Date").datepicker({
        //    dateFormat: 'dd/mm/yy'

        //}).datepicker('setDate', 'today');

    }
});

$("#editCustomerLink").click(function () {
    var editP = "Customer Detail";

    $.ajax({
        type: "post",
        url: "/Home/GetEditAccess?editP=" + editP,
        datatype: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            if (data == "true") {
                var id = $("#Customer_Name").val();
                $('#Mymodal').modal('show');
                document.getElementById('modeldlg').hidden = false;
                $.ajax({
                    type: "get",
                    url: "/ShowCustomerDetails/Edit?id=" + id,
                    datatype: "json",
                    contentType: 'application/json; charset=utf-8',
                    success: function (data) {
                        var Name = data.Cust_salutation;
                        $("#item_id").val(data.Cust_id);
                        $("#ddlsalutation").val(Name);
                        $("#f_name").val(data.First_Name);
                        $("#l_name").val(data.Last_Name);
                        $("#comapny_name").val(data.Company_name);
                        $("#display_name").val(data.Contact_Display_Name);
                        $("#email_id").val(data.Contact_Email);
                        $("#gst_number").val(data.Gst_number);
                        $("#phone_number").val(data.Contact_Phone);
                        $("#mobile_number").val(data.Contact_Mobile);
                        $("#website").val(data.Website);
                        $("#cust_currency").val(data.Currency);
                        $("#payment_terms").val(data.Payment_Terms);
                        //$("#chkportal:checked").val(data.Enable_portal);
                        $("#cust_language").val(data.Portal_Language);
                        $("#facebook").val(data.Facebook);
                        $("#twitter").val(data.Twitter);
                        $("#billAttension").val(data.Bill_Attention);
                        $("#countryid1").val(data.Bill_Country);
                        $("#billAddress").val(data.Bill_Address);
                        $("#billCity").val(data.Bill_City);
                        $("#ddlDistrict").val(data.Bill_State);
                        $("#billZipCode").val(data.Bill_zipcode);
                        $("#billPhone").val(data.Bill_Phone);
                        $("#billFax").val(data.Bill_Fax);
                        $("#shipAttension").val(data.Ship_Attention);
                        $("#countryid2").val(data.Ship_Country);
                        $("#shipAddress").val(data.Ship_Address);
                        $("#shipCity").val(data.Ship_City);
                        $("#ddlDistrict2").val(data.Ship_State);
                        $("#shipZipcode").val(data.Ship_zipcode);
                        $("#shipPhone").val(data.Ship_Phone);
                        $("#shipFax").val(data.Ship_Fax);
                        $("#remark").val(data.Remarks);
                        $("#saveCustomerDetail").text("Update");

                        bindCurrency();
                        bindLanguage();
                        bindCountry();
                        bindState();
                        bindState2();
                    }
                });

            }
            else {
                check();
            }
        }
    })

})

function bindCurrency() {

    var id = $("#cust_currency").val();
    $.ajax({
        type: "post",
        url: "/ShowCustomerDetails/BindCurrency?id=" + id,
        datatype: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $("#currencyIndex").val(data.Currency_name);


        }
    });
    $("#currencyIndex").autocomplete({

        source: function (request, response) {
            $.ajax({
                url: '/Home/AutoCompleteCurrency/',
                data: "{ 'prefix': '" + request.term + "'}",
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (data) {

                    response($.map(data, function (item) {

                        return item;
                    }))
                },
                error: function (response) {

                },
                failure: function (response) {

                }
            });
        },
        select: function (e, i) {

            $("#cust_currency").val(i.item.val);
        },
        minLength: 0
    }).focus(function () {
        $(this).autocomplete("search");
    });
}

function bindLanguage() {
    var id = $("#cust_language").val();
    $.ajax({
        type: "post",
        url: "/ShowCustomerDetails/BindLanguage?id=" + id,
        datatype: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {

            $("#languageIndex").val(data.Language_name);
        }
    });
    $("#languageIndex").autocomplete({

        source: function (request, response) {
            $.ajax({
                url: '/Home/AutoCompleteLanguage/',
                data: "{ 'prefix': '" + request.term + "'}",
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (data) {

                    response($.map(data, function (item) {

                        return item;
                    }))
                },
                error: function (response) {

                },
                failure: function (response) {

                }
            });
        },
        select: function (e, i) {

            $("#cust_language").val(i.item.val);
        },
        minLength: 0
    }).focus(function () {
        $(this).autocomplete("search");
    });

}

function bindCountry() {
    var id1 = $("#countryid1").val();
    var id2 = $("#countryid2").val();
    $.ajax({
        type: "post",
        url: "/ShowCustomerDetails/BindCountry?countryId=" + id1,
        datatype: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $("#countryIndex").val(data.Country_name);


        }
    });
    $.ajax({
        type: "post",
        url: "/ShowCustomerDetails/BindCountry?countryId=" + id2,
        datatype: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $("#countryIndex2").val(data.Country_name);


        }
    });

    $("#countryIndex").autocomplete({

        source: function (request, response) {
            $.ajax({
                url: '/UpdateRegistration/AutoComplete/',
                data: "{ 'prefix': '" + request.term + "'}",
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (data) {

                    response($.map(data, function (item) {

                        return item;
                    }))
                },
                error: function (response) {

                },
                failure: function (response) {

                }
            });
        },
        select: function (e, i) {

            $("#countryid1").val(i.item.val);
        },
        minLength: 0
    }).focus(function () {
        $(this).autocomplete("search");
    });

    $("#countryIndex2").autocomplete({

        source: function (request, response) {
            $.ajax({
                url: '/UpdateRegistration/AutoComplete/',
                data: "{ 'prefix': '" + request.term + "'}",
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (data) {

                    response($.map(data, function (item) {

                        return item;
                    }))
                },
                error: function (response) {

                },
                failure: function (response) {

                }
            });
        },
        select: function (e, i) {

            $("#countryid2").val(i.item.val);
        },
        minLength: 0
    }).focus(function () {
        $(this).autocomplete("search");
    });

}

function bindState2() {
    var id1 = $("#ddlDistrict2").val();

    $.ajax({
        type: "post",
        url: "/ShowCustomerDetails/BindState?id=" + id1,
        datatype: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {

            $('#stateIndex2').val(data.StateName);

        }
    });
    var loc = $('#countryid2').val();
    $("#stateIndex2").autocomplete({

        source: function (request, response) {
            $.ajax({
                url: "/UpdateRegistration/AutoBindState?countryId=" + loc,
                data: "{ 'prefix': '" + request.term + "'}",
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    response($.map(data, function (item) {

                        return item;
                    }))
                },
                error: function (response) {

                },
                failure: function (response) {

                }
            });
        },
        select: function (e, i) {
            $("#ddlDistrict2").val(i.item.val);
        },
        minLength: 0
    }).focus(function () {
        $(this).autocomplete("search");
    });

}
function bindState() {
    var id1 = $("#ddlDistrict").val();

    $.ajax({
        type: "post",
        url: "/ShowCustomerDetails/BindState?id=" + id1,
        datatype: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {

            $('#stateIndex').val(data.StateName);

        }
    });
    var loc = $('#countryid1').val();
    $("#stateIndex").autocomplete({

        source: function (request, response) {
            $.ajax({
                url: "/UpdateRegistration/AutoBindState?countryId=" + loc,
                data: "{ 'prefix': '" + request.term + "'}",
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    response($.map(data, function (item) {

                        return item;
                    }))
                },
                error: function (response) {

                },
                failure: function (response) {

                }
            });
        },
        select: function (e, i) {
            $("#ddlDistrict").val(i.item.val);
        },
        minLength: 0
    }).focus(function () {
        $(this).autocomplete("search");
    });
}




$(".radioo").change(function () {
    var i = $(this).val();
    if (i == "Service") {
        $("#ItemIndex").autocomplete({

            source: function (request, response) {
                $.ajax({
                    url: '/Home/AutoCompleteItemService/',
                    data: "{ 'prefix': '" + request.term + "'}",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {

                        response($.map(data, function (item) {

                            return item;
                        }))
                    },
                    error: function (response) {

                    },
                    failure: function (response) {

                    }
                });
            },
            select: function (e, i) {
                alert(i.item.val);
                $("#selectItemdd").val(i.item.val);
            },
            minLength: 0
        }).focus(function () {
            $(this).autocomplete("search");
        });
    }

    else if (i == "Goods & Service") {
        $("#ItemIndex").autocomplete({

            source: function (request, response) {
                $.ajax({
                    url: '/Home/AutoCompleteItem/',
                    data: "{ 'prefix': '" + request.term + "'}",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {

                        response($.map(data, function (item) {

                            return item;
                        }))
                    },
                    error: function (response) {

                    },
                    failure: function (response) {

                    }
                });
            },
            select: function (e, i) {
             
                $("#selectItemdd").val(i.item.val);
            },
            minLength: 0
        }).focus(function () {
            $(this).autocomplete("search");
        });
    }

})


$("#CustNameIndex").click(function () {

    if (document.getElementById('rad1').checked) {
        $("#ItemIndex").autocomplete({

            source: function (request, response) {
                $.ajax({
                    url: '/Home/AutoCompleteItem/',
                    data: "{ 'prefix': '" + request.term + "'}",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {

                        response($.map(data, function (item) {

                            return item;
                        }))
                    },
                    error: function (response) {

                    },
                    failure: function (response) {

                    }
                });
            },
            select: function (e, i) {

                $("#selectItemdd").val(i.item.val);
            },
            minLength: 0
        }).focus(function () {
            $(this).autocomplete("search");
        });

    }
    else {
        $("#ItemIndex").autocomplete({

            source: function (request, response) {
                $.ajax({
                    url: '/Home/AutoCompleteItemService/',
                    data: "{ 'prefix': '" + request.term + "'}",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {

                        response($.map(data, function (item) {

                            return item;
                        }))
                    },
                    error: function (response) {

                    },
                    failure: function (response) {

                    }
                });
            },
            select: function (e, i) {

                $("#selectItemdd").val(i.item.val);
            },
            minLength: 0
        }).focus(function () {
            $(this).autocomplete("search");
        });

    }






})





function getLastDate() {
    var result2 = "";


    $.ajax({
        url: '/Home/GetMaxDate/',
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        success: function (data) {

            var date2 = data.Invoice_Date;
            var tempdate = new Date(parseInt(date2.substr(6)));


            $("#Invoice_Date").datepicker({
                dateFormat: 'dd/mm/yy',
                minDate: new Date(tempdate),
                onClose: function () {
                    var dt = $("#Invoice_Date").val();
                    var dateParts = dt.split("/");
                    dt = dateParts[1] + "/" + dateParts[0] + "/" + dateParts[2];
                    dateParts = dt.split("/");
                    var today = new Date(dateParts);
                    $("#Due_Date").datepicker(
                        "change", {
                            dateFormat: 'dd/mm/yy',
                            minDate: today
                        })
                }
            }).datepicker('setDate', 'today');


            //$("#Invoice_Date").datepicker({
            //    dateFormat: 'dd/mm/yy',
            //    minDate: new Date(tempdate),
            //    onClose: function () {
            //        $("#Due_Date").datepicker(
            //            "change", {
            //                minDate: new Date($('#Invoice_Date').val())
            //            })
            //    }

            //}).datepicker('setDate', 'today');

            //$("#cust_Terms").change(function () {
            //    $("#Due_Date").datepicker(
            //        "change", {
            //            minDate: new Date($('#Invoice_Date').val())
            //        })
            //})
            ////$("#Invoice_Date").datepicker({
            //    dateFormat: 'dd/mm/yy'
            //}).datepicker('setDate', 'today');
            //$("#Due_Date").datepicker({
            //    dateFormat: 'dd/mm/yy'
            //}).datepicker('setDate', 'today');


            $("#Due_Date").val($('#Invoice_Date').val());
        },
        error: function (response) {
            $("#Invoice_Date").datepicker({
                dateFormat: 'dd/mm/yy'
            }).datepicker('setDate', 'today');

            //$("#Invoice_Date").datepicker({
            //    dateFormat: 'dd/mm/yy'
            //}).datepicker('setDate', 'today');
            //$("#Due_Date").datepicker({
            //    dateFormat: 'dd/mm/yy'
            //}).datepicker('setDate', 'today');


            $("#Due_Date").val($('#Invoice_Date').val());
        }
    })
}


$("#emailchk").change(function () {
    if (this.checked) {
        $("#SendEmail").val(1);
    }
    else {
        $("#SendEmail").val(0);
    }
})

$("#emailmodellink").click(function () {
    $("#EmailModel").modal("show");
})

$("#billZipCode").keyup(function (e) {
    var i = [];
    i = $(this).val();
    if (i.length > 6) {
        this.value = this.value.substring(0, 6);
    }
})
$("#shipZipcode").keyup(function (e) {
    var i = [];
    i = $(this).val();
    if (i.length > 6) {
        this.value = this.value.substring(0, 6);
    }
})
$("#billPhone").keyup(function (e) {
    var i = [];
    i = $(this).val();
    if (i.length > 10) {
        this.value = this.value.substring(0, 10);
    }
})
$("#shipPhone").keyup(function (e) {
    var i = [];
    i = $(this).val();
    if (i.length > 10) {
        this.value = this.value.substring(0, 10);
    }
})

$("#billFax").keyup(function (e) {
    var i = [];
    i = $(this).val();
    if (i.length > 10) {
        this.value = this.value.substring(0, 10);
    }
})
$("#shipFax").keyup(function (e) {
    var i = [];
    i = $(this).val();
    if (i.length > 10) {
        this.value = this.value.substring(0, 10);
    }
})

$("#phone_number").keyup(function (e) {
    var i = [];
    i = $(this).val();
    if (i.length > 10) {
        this.value = this.value.substring(0, 10);
    }
})

$("#mobile_number").keyup(function (e) {
    var i = [];
    i = $(this).val();
    if (i.length > 10) {
        this.value = this.value.substring(0, 10);
    }
})

$("#billZipCode").keyup(function (e) {
    var i = [];
    i = $(this).val();
    if (i.length > 6) {
        this.value = this.value.substring(0, 6);
    }
})

$("#shipZipcode").keyup(function (e) {
    var i = [];
    i = $(this).val();
    if (i.length > 6) {
        this.value = this.value.substring(0, 6);
    }
})