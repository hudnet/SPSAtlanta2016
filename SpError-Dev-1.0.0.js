// IMPORTANT! ALL COMMENTS BELOW SHOULD BE REMOVED BEFORE MOVING CODE INTO PRODUCTION.
/*************************************************************************************
 *
 * File: SpError-Dev-1.0.0.js
 *
 * Description: This file will be used as an addition to the SpRest-*.*.*.js file while
 *				creating code to be used in a development environment.
 *
 * Author: Eric Hudson
 *
 * Created: 7/10/2015
 *
 * Version: 1.0.0
 *
 * Version History
 *
 *		Version 1.0.0:
 *
 *			Initial release
 *
 *************************************************************************************/
/*************************************************************************************
 *
 * USAGE 
 *
 *
 * setFailure
 *
        var SPS = SPS || {};
        SPS.Error = SPS.Error || {};
        SPS.$ = jQuery.noConflict();
 
        SPS.GetData = (function() {
            "use strict";
            var load = function() {
                var _endpoint = "lists/getbytitle('TestList')/items?$select=Id,Title";
                SPS.$.ajax(SPS.Utility.getItemRequest(_endpoint)).done(function(data) {
                var _results = data.value;
            })
            .fail(function(err) {
                SPS.Error.setFailure(err);
            });
        };
            return {
                load: load
            };
        }());
 **************************************************************************************/

var SPS = SPS || {};
SPS.Error = SPS.Error || {};
SPS.Error = (function() {
    "use strict";
    var setFailure = function(errorMessage) {
        alert(JSON.stringify(errorMessage));
        return setFailure;
    };
    return {
        setFailure: setFailure
    };
}());
