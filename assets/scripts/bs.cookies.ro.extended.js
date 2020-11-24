/*!
 * Name: Bootstrap Cookies Customizer
 * Description: jQuery based plugin that shows bootstrap modal with cookie info
 * Extended Romanian version
 *
 * Copyright (c) 2020 Iulian Andriescu
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * Inspired by: https://www.jqueryscript.net/other/GDPR-Cookie-Consent-Bootstrap-4-bsgdprcookies.html
 * Requires Twitter Bootstrap 4 (+jQuery)
 */

jQuery.noConflict();

jQuery(document).ready(function( $ ) {                       
    
    $('body').bsgdprcookies(settings);
    $('body').append('<aside id="cookie-cog"><a href="#" rel="tag" title="Apasă pentru a modifica setările Cookie" data-toggle="tooltip" data-placement="left"><span class="cookie-cog">&#9881;</span></a></aside>'); 
    
    $("#cookie-cog").on('click', function(){
        
         $('body').bsgdprcookies(settings, 'reinit');
        
    });
    
});

(function($) {

    $.fn.bsgdprcookies = function(options, event) {
        //console.log('se incarca');
        var $element = $(this);
        var cookieShow = ReadCookie('CookieShow');
        var cookiePreferences = ReadCookie('CookiePreferences');

        // Set default settings
        var settings = $.extend({
            id: 'bs-gdpr-cookies-modal',
            class: '',
            title: 'Acest website folose&scedil;te Cookies',
            backdrop: 'static',
            message: 'Alegeți ce tipuri de cookie să fie autorizate. <br>Puteți schimba aceste setări oricând, deși aceasta poate duce la indisponibilitatea anumitor funcţiuni. <br>Pentru informații legate de ștergerea cookie-urile vă rugăm să consultați funcția de Ajutor a browser-ului dumneavoastră!',
            messageScrollBar: false,
            messageMaxHeightPercent: 25,
            delay: 1500,
            expireDays: 30,
            moreLinkActive: true,
            moreLinkLabel: '',
            moreLinkNewTab: true,
            moreLink: 'privacy-policy.html',
            acceptButtonLabel: 'Accept',
            allowAdvancedOptions: true,
            advancedTitle: 'Modific&#259; preferin&tcedil;ele cookie:',
            advancedAutoOpenDelay: 1000,
            advancedButtonLabel: 'Modificare',
            advancedCookiesToSelect: [
                {
                    name: 'necessary',
                    title: 'Necesare',
                    description: 'Necesare pentru ca site-ul s&atilde; func&tcedil;ioneze corect',
                    isFixed: true
                },
                {
                    name: 'preferences',
                    title: 'Funcţio<wbr>nalitate',
                    description: 'Acestea sunt module de tip cookie legate de preferin&tcedil;ele dumneavoastr&259; pentru website, cum ar fi re&tcedil;inerea numelui de utilizator, nuan&tcedil;elor preferate etc.',
                    isFixed: false
                },
                {
                    name: 'analytics',
                    title: 'Analiz&#259;',
                    description: 'Cookie-uri legate de vizite pe site, tipuri de browser etc.',
                    isFixed: false
                },
                {
                    name: 'marketing',
                    title: 'Reclamă',
                    description: 'Cookie-uri legate de marketing, precum newslettere, social media, etc.',
                    isFixed: false
                }
            ],
            OnAccept: function() {}
        }, options);

        if(!cookieShow || !cookiePreferences || event == 'reinit') {

            // Make sure that other instances are gone
            DisposeModal(settings.id);

            var modalBody = '';
            var modalButtons = '';
            var modalBodyStyle = '';
            var moreLink = '';

            // Generate more link
            if(settings.moreLinkActive == true) {
                if(settings.moreLinkNewTab == true) {
                    moreLink = '<a href="' + settings.moreLink + '" target="_blank" rel="noopener noreferrer" id="' + settings.id + '-more-link">' + settings.moreLinkLabel + '</a>';
                }
                else {
                    moreLink = '<a href="' + settings.moreLink + '" id="' + settings.id + '-more-link">' + settings.moreLinkLabel + '</a>';
                }
            }


            if(settings.allowAdvancedOptions === true) {
                modalButtons = '<button id="' + settings.id + '-advanced-btn" type="button" class="btn btn-secondary">' + settings.advancedButtonLabel + '</button><button id="' + settings.id + '-accept-btn" type="button" class="btn btn-primary" data-dismiss="modal">' + settings.acceptButtonLabel + '</button>';

                // Generate list of available advanced settings
                var advancedCookiesToSelectList = '';

                preferences = JSON.parse(cookiePreferences);
                $.each(settings.advancedCookiesToSelect, function(index, field) {
                    if (field.name !== '' && field.title !== '') {

                        var cookieDisabledText = '';
                        if(field.isFixed == true) {
                            cookieDisabledText = ' checked="checked"';
                        }       

                        var cookieDescription = '';
                        if (field.description !== false) {
                            cookieDescription = ' title="' + field.description + '"';
                        }

                        var fieldID = settings.id + '-option-' + field.name;

                        advancedCookiesToSelectList += '<li class="active"><input type="checkbox" id="' + fieldID + '" name="bsgdpr[]" value="' + field.name + '" data-auto="on" checked="checked"> <label name="bsgdpr[]" data-toggle="tooltip" data-placement="right" for="' + fieldID + '"' + cookieDescription + '>' + field.title + '</label></li>';
                    }
                });

                modalBody = '<div id="' + settings.id + '-message">' + settings.message + moreLink + '</div>' + '<div id="' + settings.id + '-advanced-types" style="margin-top: 10px;"><h5 id="' + settings.id + '-advanced-title">' + settings.advancedTitle + '</h5><ul class="cookie-type-list"><li><span id="no-cookie-select"><span class="glyph">&#9888;</span>Blochează toate</span></li>' + advancedCookiesToSelectList + '</ul><section class="row" id="list-holder"><div class="col-12 col-sm-6" id="selected-options"><h5>Se vor păstra:</h5><ul class="essential-list"><li>Esențial: se reține setarea permisiunilor pentru cookie</li><li>Esențial: se permite setarea modulelor cookie pentru sesiuni</li><li>Esențial: se adună informațiile care se introduc într-un formular de contact, un buletin informativ și alte formulare din toate paginile</li><li>Esențial: se urmăreşte ce se introduce într-un coș de cumpărături</li><li>Esențial: se verifică dacă autentificarea s-a realizat corect</li><li>Esențial: se reține versiunea lingvistică selectată</li></ul><ul class="functional-list"><li>Funcționalitate: Se rețin setările legate de social media</li><li>Funcționalitate: se rețin regiunea și țara selectată</li></ul><ul class="analysis-list"><li>Google Analytics: se urmăresc paginile vizitate și interacțiunile efectuate</li><li>Google Analytics: se urmăreşte locația și regiunea pe baza IP-ului</li><li>Google Analytics: se reţine timpul petrecut pe fiecare pagină</li><li>Analytics: se îmbunătăţeşte calitatea informaţiilor în funcţie de statistici</li></ul><ul class="marketing-list"><li>Publicitate: se folosesc informații pentru publicitate personalizată în colaborare cu terți</li><li>Publicitate: se permite conectarea cu conturile reţelelor sociale</li><li>Publicitate: se identifică dispozitivul utilizat pentru accesarea site-ului</li><li>Publicitate: se strâng informații de identificare personală, cum ar fi numele și locația</li></ul></div><div class="col-12 col-sm-6" id="deselected-options"><h5>Nu se vor păstra:</h5><ul class="connectivity-list"><li>Datele de conectare</li></ul><ul class="essential-list"><li>Esențial: se reține setarea permisiunilor pentru cookie</li><li>Esențial: se permite setarea modulelor cookie pentru sesiuni</li><li>Esențial: se adună informațiile care se introduc într-un formular de contact, un buletin informativ și alte formulare din toate paginile</li><li>Esențial: se urmăreşte ce se introduce într-un coș de cumpărături</li><li>Esențial: se verifică dacă autentificarea s-a realizat corect</li><li>Esențial: se reține versiunea lingvistică selectată</li></ul><ul class="functional-list"><li>Funcționalitate: Se rețin setările legate de social media</li><li>Funcționalitate: se rețin regiunea și țara selectată</li></ul><ul class="analysis-list"><li>Google Analytics: se urmăresc paginile vizitate și interacțiunile efectuate</li><li>Google Analytics: se urmăreşte locația și regiunea pe baza IP-ului</li><li>Google Analytics: se reţine timpul petrecut pe fiecare pagină</li><li>Analytics: se îmbunătăţeşte calitatea informaţiilor în funcţie de statistici</li></ul><ul class="marketing-list"><li>Publicitate: se folosesc informații pentru publicitate personalizată în colaborare cu terți</li><li>Publicitate: se permite conectarea cu conturile reţelelor sociale</li><li>Publicitate: se identifică dispozitivul utilizat pentru accesarea site-ului</li><li>Publicitate: se strâng informații de identificare personală, cum ar fi numele și locația</li></ul></div></section</div>';
            }
            else {
                modalButtons = '<button id="' + settings.id + '-accept-btn" type="button" class="btn btn-primary" data-dismiss="modal">' + settings.acceptButtonLabel + '</button>';

                modalBody ='<div id="' + settings.id + '-message">' + settings.message + moreLink + '</div>';
            }
            
            if(settings.messageScrollBar == true) {
                modalBodyStyle = 'style="overflow-y: scroll; max-height: ' + settings.messageMaxHeightPercent + '%"';
            }

            var modal = '<div class="modal fade ' + settings.class + '" id="' + settings.id + '" tabindex="-1" role="dialog" aria-labelledby="' + settings.id + '-title" aria-hidden="true"><div class="cookie-modal modal-dialog modal-dialog-centered modal-extended" role="document"><div class="modal-content"><div class="modal-header"><h2 class="modal-title" id="' + settings.id + '-title">' + settings.title + '</h2></div><div id="' + settings.id + '-body" class="modal-body" ' + modalBodyStyle + '>' + modalBody + '</div><div class="modal-footer">' + modalButtons + '</div></div></div></div>';

            // Show Modal
            setTimeout(function() {
                $($element).append(modal);

                $('#' + settings.id).modal({keyboard: false, backdrop: settings.backdrop});

                if (event === 'reinit' && settings.allowAdvancedOptions === true) {

                    setTimeout(function(){
                        $('#' + settings.id + '-advanced-btn').trigger('click');
                        $.each(preferences, function(index, field) {
                            $('#' + settings.id + '-option-' + field).prop('checked', true);
                        });
                    }, settings.advancedAutoOpenDelay)
                }
            }, settings.delay);

            // When user clicks accept set cookie and close modal
            $('body').on('click','#' + settings.id + '-accept-btn', function(){

                // Set show cookie
                CreateCookie('CookieShow', true, settings.expireDays);
                DisposeModal(settings.id);

                // If 'data-auto' is set to ON, tick all checkboxes because the user has not chosen any option
                $('input[name="bsgdpr[]"][data-auto="on"]').prop('checked', true);

                // Clear user preferences cookie
                DeleteCookie('CookiePreferences');

                // Set user preferences cookie
                var preferences = [];
                $.each($('input[name="bsgdpr[]"]').serializeArray(), function(i, field){
                    preferences.push(field.value);
                });
                CreateCookie('CookiePreferences', JSON.stringify(preferences), 30);

                // Run callback function
                settings.OnAccept.call(this);
            });

            // Show advanced options
            $('body').on('click', '#' + settings.id + '-advanced-btn', function(){
                // Uncheck all checkboxes except for the disabled ones
                $('input[name="bsgdpr[]"]:not(:disabled)').attr('data-auto', 'off').prop('checked', true);
                
                $('label[name="bsgdpr[]"]').tooltip({offset: '0, 10'});

                // Show advanced checkboxes
                $('#' + settings.id + '-advanced-types').slideDown('fast', function(){
                    $('#' + settings.id + '-advanced-btn').prop('disabled', true);
                });

                // Scroll content to bottom if scrollbar option is active
                if(settings.messageScrollBar == true) {
                    setTimeout(function() {
                        bodyID = settings.id + '-body';
                        var div = document.getElementById(bodyID);
                        $('#' + bodyID).animate({
                            scrollTop: div.scrollHeight - div.clientHeight
                        }, 800);
                    }, 500);
                }
            });
        }
        else {
            var cookieValue = true;
            if (cookieShow == 'false') {
                cookieValue = false;
            }
            CreateCookie('CookieShow', cookieValue, settings.expireDays);
            DisposeModal(settings.id);
        }
    }

    /**
     * Returns user preferences saved in cookie
     */
    $.fn.bsgdprcookies.GetUserPreferences = function() {
        var preferences = ReadCookie('CookiePreferences');
        return JSON.parse(preferences);
    };

    /**
     * Check if user preference exists in cookie
     * 
     * @param {string} pref Preference to check
     */
    $.fn.bsgdprcookies.PreferenceExists = function(pref) {
        var preferences = $.fn.bsgdprcookies.GetUserPreferences();

        if (ReadCookie('CookieShow') === false) {
            return false;
        }
        if (preferences === false || preferences.indexOf(pref) === -1) {
            return false;
        }

        return true;
    };

    /**
     * Hide then delete bs modal
     * 
     * @param {string} id Modal ID without '#'
     */
    function DisposeModal(id) {
        id = '#' + id;
        $(id).modal('hide');
        
        $(id).on('hidden.bs.modal', function (e) {
            $(this).modal('dispose');
            $(id).remove();
        });
        
    }

    /**
     * Sets Cookie
     * 
     * @param {string} name Name of the cookie which you want to create
     * @param {boolean} value Value for the created cookie
     * @param {number} days Expire days
     */
    function CreateCookie(name, value, days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            var expires = "; expires=" + date.toGMTString();
        }
        else var expires = "";
        document.cookie = name + "=" + value + expires + "; path=/";
    }
    

    /**
     * Gets Cookie called 'name'
     * 
     * @param {string} name Name of the cookie to read
     */
    function ReadCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    
    /**
     * Deletes Cookie called 'name;
     * 
     * @param {string} name Name of the cookie which you want to delete
     */
    function DeleteCookie(name) {
        CreateCookie(name, "", -1);
    }   

}(jQuery));

// Open preferences to edit them
jQuery(document).on('click', '#bs-gdpr-cookies-modal-advanced-btn', function(){
    
    jQuery(this).parents('div').find("#bs-gdpr-cookies-modal-advanced-types").show();

})

// To remove all cookies //
jQuery(document).on('click', 'span#no-cookie-select', function(){
        
    jQuery(this).parents('ul').find('li').removeClass('active');
    jQuery(this).parents('ul').find('input').removeAttr('checked');
    jQuery(this).parents('li').addClass('active');
    jQuery(this).parents('div.modal-body').find('#selected-options ul').hide();
    jQuery(this).parents('div.modal-body').find('#deselected-options ul').show();
    
});

// To select only specific types of cookies //
jQuery(document).on('click', 'label', function(){
    
    jQuery(this).parents('ul').find('#no-cookie-select').parents('li').removeClass('active');
    
    var label_value = jQuery(this).parents('li').find('label').attr('for').value;
    var checkbox = jQuery(this).parents('li').find('input').attr('id', label_value);
       
    jQuery(checkbox).attr('checked', !checkbox.attr('checked')).parents('li').toggleClass('active');
    
});

jQuery(document).on('change', 'input[type="checkbox"]', function(){
    
    var necessary  = jQuery(this).parents('ul').find('input#bs-gdpr-cookies-modal-option-necessary');
    var preference = jQuery(this).parents('ul').find('input#bs-gdpr-cookies-modal-option-preferences');
    var anaytics   = jQuery(this).parents('ul').find('input#bs-gdpr-cookies-modal-option-analytics');
    var marketing  = jQuery(this).parents('ul').find('input#bs-gdpr-cookies-modal-option-marketing');
    
    var selected    = jQuery(this).parents('div.modal-body').find('div#selected-options');
    var deselected  = jQuery(this).parents('div.modal-body').find('div#deselected-options');
    
    if (jQuery(necessary).is(':checked')) {
        selected.find('.essential-list').show();
        deselected.find('.essential-list').hide();
    } else {
        selected.find('.essential-list').hide();
        deselected.find('.essential-list').show();
    }  
    
    if (jQuery(preference).is(':checked')) {
        selected.find('.functional-list').show();
        deselected.find('.functional-list').hide();
    } else {
        selected.find('.functional-list').hide();
        deselected.find('.functional-list').show();
    }  
    
    if (jQuery(anaytics).is(':checked')) {
        selected.find('.analysis-list').show();
        deselected.find('.analysis-list').hide();
    } else {
        selected.find('.analysis-list').hide();
        deselected.find('.analysis-list').show();
    }  
    
    if (jQuery(marketing).is(':checked')) {
        selected.find('.marketing-list').show();
        deselected.find('.marketing-list').hide();
    } else {
        selected.find('.marketing-list').hide();
        deselected.find('.marketing-list').show();
    }  
    
})