$(document).ready(function() {
    $('#register_form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        fields: {
            name: {
                validators: {
                        stringLength: {
                        min: 2,
                    },
                        notEmpty: {
                        message: 'Please supply your first name'
                    }
                }
            },
             
            email: {
                validators: {
                    notEmpty: {
                        message: 'Please supply your email address'
                    },
                    emailAddress: {
                        message: 'Please supply a valid email address'
                    }
                }
            },
            password: {
                validators: {
                    stringLength:{
                        min:6,
                        message: 'Password should be atleast 6 characters'
                    },
                    notEmpty:{
                        message: 'Please provide password to continue'
                    }
                }
            },
            confirm: {
                validators: {
                    stringLength:{
                        min:6,
                        message: 'Password should be atleast 6 characters'
                    },
                    notEmpty:{
                        message: 'Please provide password to continue'
                    }
                }

            }
            }
        })
// /*        .on('success.form.bv', function(e) {
//             /*$('#success_message').slideDown({ opacity: "show" }, "slow") // Do something ...
//             $('#register_form').data('bootstrapValidator').resetForm();*/

//             // Prevent form submission
//             e.preventDefault();

//             // Get the form instance
//             var $form = $(e.target);

//             // Get the BootstrapValidator instance
//             var bv = $form.data('bootstrapValidator');

//             // Use Ajax to submit form data
//             $.post($form.attr('action'), $form.serialize(), function(result) {
//                 console.log(result);
//             }, 'json');
//         });*/
});

