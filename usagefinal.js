var SPS = SPS || {};
SPS.$ = jQuery.noConflict();

SPS.$(function() {
	// Acquire the data from a SharePoint list using a jQuery AJAX call.
    var _endpoint = "lists/getbytitle('Usage')/items?$select=Title,Number";
    SPS.$.ajax(SPS.REST.getItemRequest(_endpoint)).done(function(data) {
        var results = data.d.results;
        var dataArray = [];
        for (var i = 0; i < results.length; i++) {
            dataArray.push([results[i].Title, parseInt(results[i].Number)])
        }
        loadChart(dataArray);
    }).fail(function(err) {
        SPS.Error.setFailure(err);
    });
    loadChart = function(dataArray) {
        // Radialize the colors
        Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions()
            .colors, function(color) {
                return {
                    radialGradient: {
                        cx: 0.5,
                        cy: 0.3,
                        r: 0.7
                    },
                    stops: [
                        [0, color],
                        [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
                    ]
                };
            });
        // Build the chart
        SPS.$('#container').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Usage by Department',
                style: {
            		color: '#0072c6',
                    fontSize: '34px',
                    fontWeight: 'bold'
                }
            },
            tooltip: {
                shared: true,
                useHTML: true,
                headerFormat: '<b>{point.key}</b><table>',
                pointFormat: '<tr><td style="color: black">{point.percentage:.1f}%</td></tr>',
                footerFormat: '</table>',
                valueDecimals: 2,
                style: {
                    color: 'black',
                    fontSize: '14px',
                    padding: '8px'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            fontSize: '14px',
                            color: 'black'
                        },
                        connectorColor: 'black'
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'Department',
                data: dataArray
            }]
        });
    };
});
