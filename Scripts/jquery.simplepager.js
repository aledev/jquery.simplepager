/*!
* jQuery simplepager plugin: a simple table pager for jquery
* Examples and documentation at: https://github.com/aledev/jquery.simplepager
* version 1.0 (25-Feb-2013)
* Requires jQuery v1.7.2 or later
* Author: Alejandro Aliaga Martínez
*/

/**
*  simplepager() takes no arguments:  $('#myDiv').simplepager()
*
*  This plugin needs that the table has this structure:
*  <table>
*    <thead>
*       <th></th>
*    </thead>
*    <tbody>
*       <tr></tr>
*    </tbody>
*  </table>
*
*/
(function ($) {
    $.fn.simplepager = function (options) {

        var defaults = {
            FirstPageText: 'First',                             //Tooltip for the first page button
            NextPageText: 'Next',                               //Tooltip for the next page button
            PreviousPageText: 'Previous',                       //Tooltip for the previous page button
            LastPageText: 'Last',                               //Tooltip for the last page button
            PageSizeText: 'Results per page',                   //Text for the dropdownlist 
            CurrentPageText: 'Current Page',                    //Tooltip for the current page textbox 
            EmptyDataText: '[No data to display]',              //Text in case that the plugin doesn't found data
            ImageFirstPageUrl: 'Styles/Images/first.png',    //Image Url for the first page button
            ImagePreviousPageUrl: 'Styles/Images/prev.png',  //Image Url for the previous page button
            ImageNextPageUrl: 'Styles/Images/next.png',      //Image Url for the next page button
            ImageLastPageUrl: 'Styles/Images/last.png',      //Image Url for the last page button
            OnDataPagerAfterClick: null                         //Event that is triggered after the change page click
        };

        var options = $.extend(defaults, options);

        return this.each(function () {
            var _dataPagerHtml = null;
            var _pageSize = 10;
            var _pageNumber = 1;
            var _arrayData = null;
            var _arrayCurrentData = null;
            var _lastPage = 0;
            var _mainDiv = null;

            //Create the DataPager element inside the table
            function CreatePager(element) {
                var _colspanLength = $(element).find('th').length;
                _dataPagerHtml = '<tfoot><tr><td colspan="' + _colspanLength + '"><div id="simplepagerDiv">' +
                       	    '<table style="margin-left:auto;margin-right:auto;" align="center">' +
			                '<tr>' +
				                '<td><img id="jqsp_imgFirstPage" class="imgPager first" title="' + options.FirstPageText + '" src="' + options.ImageFirstPageUrl + '"></td>' +
				                '<td><img id="jqsp_imgPreviousPage" class="imgPager prev" title="' + options.PreviousPageText + '" src="' + options.ImagePreviousPageUrl + '"></td>' +
				                '<td><input id="jqsp_txtPaginaActual" type="text" readonly="readonly" value="0/0" title="' + options.CurrentPageText + '"><input type="hidden" id="jqsp_hdnPaginaActual" value="0"></td>' +
				                '<td><img id="jqsp_imgNextPage" class="imgPager next" title="' + options.NextPageText + '" src="' + options.ImageNextPageUrl + '"></td>' +
				                '<td><img id="jqsp_imgLastPage" class="imgPager last" title="' + options.LastPageText + '" src="' + options.ImageLastPageUrl + '"><input type="hidden" id="jqsp_hdnPaginaFinal" value="0"></td>' +
				                '<td>' + options.PageSizeText + ':</td>' +
				                '<td><select class="ddlResultsPerPage" id="jqsp_ddlCantidadPorPagina" title="' + options.PageSizeText + '">' +
						                '<option value="10" selected="selected">10</option>' +
						                '<option value="20">20</option>' +
						                '<option value="30">30</option>' +
						                '<option value="40">40</option>' +
						                '<option value="50">50</option>' +
					                '</select>' +
					                '<input type="hidden" id="jqsp_hdnCantidadPorPagina" value="0">' +
				                '</td>' +
			                '</tr>' +
		                    '</table>' +
                        '</div></td></tr></tfoot>';

                $(element).find('table').append(_dataPagerHtml);

                var _button = $(element).find('#jqsp_imgFirstPage');
                BuildButton(_button);
                _button = $(element).find('#jqsp_imgPreviousPage');
                BuildButton(_button);
                _button = $(element).find('#jqsp_imgNextPage');
                BuildButton(_button);
                _button = $(element).find('#jqsp_imgLastPage');
                BuildButton(_button);
                _button = $(element).find('#jqsp_ddlCantidadPorPagina');
                BuildButton(_button);
            }

            //Create the button events
            function BuildButton(element) {
                if ($(element).is('img')) {
                    $(element).click(function () {
                        ChangePage(this);
                    });
                }
                else {
                    $(element).change(function () {
                        ChangePage(this);
                    });
                }
            }

            //Change page event
            function ChangePage(element) {

                ValidateDataAndElements(_mainDiv);

                var _elementClickId = $(element).attr('id');

                switch (_elementClickId) {
                    case "jqsp_imgFirstPage":
                        _pageNumber = 1;
                        break;

                    case "jqsp_imgPreviousPage":
                        if (_pageNumber > 1) {
                            _pageNumber--;
                        }
                        break;

                    case "jqsp_imgNextPage":
                        if (_pageNumber < _lastPage) {
                            _pageNumber++;
                        }
                        break;

                    case "jqsp_imgLastPage":
                        _pageNumber = _lastPage;
                        break;

                    case "jqsp_ddlCantidadPorPagina":
                        _pageNumber = 1;
                        break;
                }

                $(_mainDiv).find('#jqsp_hdnPaginaActual').val(_pageNumber);

                _pageSize = parseInt($(_mainDiv).find('#jqsp_ddlCantidadPorPagina option:selected').val());

                CalculateElements(_mainDiv);
                BuildTableBody(_mainDiv);

                if (options.OnDataPagerAfterClick != null) {
                    options.OnDataPagerAfterClick();
                }
            }

            //This method will calculate the page size limit, and the total of pages for the plugin
            function CalculateElements(element) {
                if (_arrayData == null) {
                    _arrayData = $($(element).find('tbody')[0]).find('tr').clone();
                }

                _lastPage = _arrayData.length > 0 ? (Math.floor((_arrayData.length / _pageSize), 0) +
                ((_arrayData.length % _pageSize) > 0 ? 1 : 0)) : 0;

                _arrayCurrentData = new Array();
                var _firstRow = _pageNumber > 0 ? (_pageNumber * _pageSize) - _pageSize : 0;
                var _lastRow = ((_pageNumber * _pageSize) - 1) > _arrayData.length ? _arrayData.length : ((_pageNumber * _pageSize) - 1);

                $(element).find('#jqsp_hdnPaginaFinal').val(_lastPage);
                $(element).find('#jqsp_txtPaginaActual').val(_pageNumber + '/' + _lastPage);

                for (var i = _firstRow; i <= _lastRow; i++) {
                    if (_arrayData[i] != null) {
                        _arrayCurrentData.push(_arrayData[i]);
                    }
                }
            }

            //This method will build the table body with his respective page data
            function BuildTableBody(element) {
                var _table = $(element).find('table')[0];

                var _tbody = $(_table).find('tbody')[0];
                $(_tbody).html('');
                if (_arrayData == null || _arrayData.length == 0) {
                    $(_tbody).html('<tr><td>' + options.EmptyDataText + '</td></tr>');
                }
                else {
                    var _htmlRows = '';
                    for (var i = 0; i < _arrayCurrentData.length; i++) {
                        _htmlRows += '<tr>' + $(_arrayCurrentData[i]).html() + '</tr>';
                    }
                    $(_tbody).html(_htmlRows);
                }
            }

            //This method will validate if the hiddenfields has value, and will update the
            //plugin variables
            function ValidateDataAndElements(element) {
                var _hdnCurrentPage = $(element).find('#jqsp_hdnPaginaActual').val();
                if (_hdnCurrentPage != '0') {
                    _pageNumber = parseInt(_hdnCurrentPage);
                }
                
                var _hdnLastPage = $(element).find('#jqsp_hdnPaginaFinal').val();
                if (_hdnLastPage != '0') {
                    _lastPage = parseInt(_hdnLastPage);
                }
            }

            //Method that will initialize the plugin
            function Pager(element) {
                CreatePager(element);
                CalculateElements(element);
                BuildTableBody(element);
            }

            _mainDiv = this;
            Pager(this);
        });
    };
})(jQuery);