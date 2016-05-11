// IMPORTANT! ALL COMMENTS BELOW SHOULD BE REMOVED BEFORE MOVING CODE INTO PRODUCTION.
/*************************************************************************************
 *
 * File: SpRest-1.0.0.js
 *
 * Description: This file may be used to reduce the amount of JavaScript code required 
 *				to complete a given task while working with the REST API. The code was 
 *				originally authored by Andrew Connell and made available for viewing 
 *				on his blog at:
 * 
 *				http://www.andrewconnell.com/blog/simplifying-sharepoint-2013-rest-api
 * 
 *				The code was rewritten to use the Revealing Module design pattern and
 *				to meet development team coding standards.
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
 * USAGE (Note - The example calls below can be tested by creating a list named TestList.)
 *
 * getSiteRelativeUrl
 *
        var siteUrl = SPS.REST.getSiteRelativeUrl;
 *
 * getWebRelativeUrl 
 *
        var webUrl = SPS.REST.getWebRelativeUrl;
 *
 * getRestListUrl 
 *
        var query = SPS.REST.getRestListUrl() + "[NameOfList]";
 *
 *
 * getItemRequest 
 *
 * These are some of the available parameters for the getItemRequest function below.
 *
 *		Select: "?$select=Id,Title,Published"
 *		Filter: "&$filter=Published eq true"
 *		Order By: "&$orderby=Title
 *		Lookup Columns: ?$select=MyLookup,Title,Id&$expand=MyLookup
 *		Skip & Top: $select=Id,Title&$orderby=Created&$inlinecount=allpages&skip=2&$top=2
 *
        readData = function() {
            var _endpoint = "lists/getbytitle('Test List')/items";
            SPS.$.ajax(SPS.REST.getItemRequest(_endpoint)).done(
                function(data) {
                    var _results = data.d.results;
                    var _output = "<table>",
                        _indexer = {};
                    _output += "<tr style='text-decoration:underline;'><td>Title</td></tr>";
                    SPS.$.each(_results, function(key, _indexer) {
                        _output += "<tr><td>" + _indexer.Title + "</td></tr>";
                    });
                    _output += "</table>";
                    SPS.$("#results").append(_output);
                }).fail(function(err) {
                SPS.Error.setFailure(err);
            });
        }
 *		
 *  HOW TO Call: SPS.GetData.load();
 *
 *
 * newItemRequest 
 *
        createData = function(createvalue) {
            var _endpoint = "lists/getbytitle('Test List')/items",
                _listname = "TestList",
                _itemType = SPS.REST.getItemTypeForListName(_listname),
                _newData = {
                    "__metadata": {
                        "type": _itemType
                    },
                    "Title": createvalue
                };
            SPS.$.ajax(SPS.REST.newItemRequest(_endpoint, _newData)).done(
                function() {
                    SPS.RestDemo.Example.refreshData();
                }).fail(function(err) {
                SPS.Error.setFailure(err);
            });
        }
 *	
 *  HOW TO Call: SPS.NewItem.save();
 *
 *
 *  updateItemRequest 
 *
       updateData = function(Id, updatevalue) {
            var _endpoint = "lists/getbytitle('Test List')/items(" + Id + ")";
            SPS.$.ajax(SPS.REST.getItemRequest(_endpoint)).done(
                function(data) {
                    var _listname = "TestList",
                        _itemType = SPS.REST.getItemTypeForListName(_listname),
                        _newData = {
                            "__metadata": {
                                "type": _itemType
                            },
                            "Title": updatevalue
                        },
                        _existingData = data;
                    SPS.$.ajax(SPS.REST.updateItemRequest(_endpoint,
                        _newData, _existingData)).done(
                        function() {
                            SPS.RestDemo.Example.refreshData();
                        }).fail(function(err) {
                        SPS.Error.setFailure(err);
                    });
                }).fail(function(err) {
                SPS.Error.setFailure(err);
            });
        }
 *	
 *      HOW TO Call: SPS.UpdateData.update(1);
 *
 *
 * deleteItemRequest
 *
       deleteData = function(deletevalue) {
            var _endpoint = "lists/getbytitle('Test List')/items(" + deletevalue + ")";
            SPS.$.ajax(SPS.REST.getItemRequest(_endpoint)).done(
                function(data) {
                    SPS.$.ajax(SPS.REST.deleteItemRequest(data)).done(
                        function() {
                            SPS.RestDemo.Example.refreshData();
                        }).fail(function(err) {
                        SPS.Error.setFailure(err);
                    });
                }).fail(function(err) {
                SPS.Error.setFailure(err);
            });
        }
 *	
 *      HOW TO Call: SPS.DeleteData.deleteData(1);
 *
 * 
 *  Great resource for making REST calls: https://msdn.microsoft.com/en-us/magazine/dn198245.aspx
 *
 *  - Remember... Everything in JavaScript is case sensitive.
 *
 *************************************************************************************/

var SPS = SPS || {};
SPS.REST = (function() {
    "use strict";
    var _baseRequest = {
            type: "",
            url: ""
        },
        getSiteRelativeUrl = _spPageContextInfo.siteServerRelativeUrl,
        getWebRelativeUrl = _spPageContextInfo.webServerRelativeUrl,
        getItemTypeForListName = function(listname) {
            return "SP.Data." + listname.charAt(0).toUpperCase() +
                listname.slice(1) + "ListItem";
        },
        getRestListUrl = function() {
            var _UrlValue = getWebRelativeUrl;
            if (_UrlValue.length > 0) {
                if (_UrlValue[_UrlValue.length - 1] != '/') _UrlValue +=
                    '/';
            }
            _UrlValue += "_api/";
            return _UrlValue;
        },
        getItemRequest = function(endpoint) {
            var _request = _baseRequest;
            _request.type = "GET";
            _request.url = SPS.REST.getRestListUrl() + endpoint;
            _request.data = null;
            _request.headers = {
                ACCEPT: "application/json;odata=verbose"
            };
            return _request;
        },
        newItemRequest = function(endpoint, data) {
            var _payload = Sys.Serialization.JavaScriptSerializer.serialize(
                    data),
                _request = _baseRequest;
            _request.type = "POST";
            _request.url = SPS.REST.getRestListUrl() + endpoint;
            _request.data = _payload;
            _request.contentType = "application/json;odata=verbose";
            _request.headers = {
                ACCEPT: "application/json;odata=verbose",
                "X-RequestDigest": jQuery("#__REQUESTDIGEST").val()
            };
            return _request;
        },
        updateItemRequest = function(endpoint, newdata, existingdata) {
            var _payload = Sys.Serialization.JavaScriptSerializer.serialize(
                    newdata),
                _request = _baseRequest;
            _request.type = "POST";
            _request.url = SPS.REST.getRestListUrl() + endpoint;
            _request.data = _payload;
            _request.contentType = "application/json;odata=verbose";
            _request.headers = {
                "ACCEPT": "application/json;odata=verbose",
                "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
                "X-HTTP-Method": "MERGE",
                "If-Match": existingdata.d.__metadata.etag
            };
            return _request;
        },
        deleteItemRequest = function(data) {
            var _request = _baseRequest;
            _request.type = "POST";
            _request.url = data.d.__metadata.uri;
            _request.contentType = "application/json;odata=verbose";
            _request.headers = {
                "ACCEPT": "application/json;odata=verbose",
                "X-Http-Method": "DELETE",
                "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
                "If-Match": data.d.__metadata.etag
            };
            return _request;
        };
    return {
        getSiteRelativeUrl: getSiteRelativeUrl,
        getWebRelativeUrl: getWebRelativeUrl,
        getRestListUrl: getRestListUrl,
        getItemRequest: getItemRequest,
        newItemRequest: newItemRequest,
        updateItemRequest: updateItemRequest,
        deleteItemRequest: deleteItemRequest,
        getItemTypeForListName: getItemTypeForListName
    };
}());

/* 
	jQuery Issue/Explanation
	
	Background information and problem.

    http://blah.winsmarts.com/2013-5-SharePoint_2013_-_JavaScript_-and-amp;_jQuery_big_booboo_to_watch_out_for.aspx

    http://www.concurrency.com/blog/w/jquery-support-in-sharepoint-2013

    Here's the solution.
    Create an SPS object that will be the container for all associated objects.

		var SPS = SPS || {};

    Follow jQuery's recommendation for removing the "$" alias as a coding concern.
    Source: 

    https://api.jquery.com/jquery.noconflict/

		SPS.$ = jQuery.noConflict();

    So now instead of...

		$( "div p" ).hide();

    You simply add the parent object to keep everything under a single scoping umbrella.

		SPS.$( "div p" ).hide();
*/
