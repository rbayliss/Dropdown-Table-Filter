(function ($) {

    $.fn.ddTableFilter = function (options) {
        options = $.extend(true, $.fn.ddTableFilter.defaultOptions, options);

        return this.each(function () {
            if ($(this).hasClass('ddtf-processed')) {
                refreshFilters(this);
                return;
            }
            var table = $(this);
            var start = new Date();

            getTableHeadElements(table).each(function (index) {
                if ($(this).hasClass('skip-filter')) {
                    return;
                }
                
                $(this).wrapInner('<div class="filter-all-name" style="display:none">');

                var col = getColumns(index, table);
                var opts = getFilterOptions(col);
                if (opts.length < options.minOptions) {
                    return;
                }

                var selectbox = createSelect(this, opts, col, index);
                $(this).append(selectbox);
                table.addClass('ddtf-processed');
                if ($.isFunction(options.afterBuild)) {
                    options.afterBuild.apply(table);
                }
            });

            function getColumns(index, table) {
                return $('tr:not(.skip-filter) td:nth-child(' + (index + 1) + ')', table);
            }

            function refreshFilters(fromIndex) {
                getTableHeadElements(table).each(function (index) {
                    if ($(this).hasClass('skip-filter')) return;
                    if (index < fromIndex) return;

                    var col = getColumns(index, table);
                    var opts = getFilterOptions(col, true);

                    if (opts.length < options.minOptions) {
                        return;
                    }

                    var selectbox = createSelect(this, opts, col, index);

                    $(this).children('select').remove();
                    $(this).append(selectbox);

                });
            }

            function getTableHeadElements(table) {
                return $('tr.tableizer-filter th:visible', table);
            }

            function createSelect(element, options, col, index) {
                var selectbox = $('<select>');

                selectbox.append('<option value="--all--">' + $(element).children('.filter-all-name').text() + '</option>');

                $.each(options, function () {
                    $(selectbox).append('<option value="' + this.val + '">' + this.text + '</option>')
                });

                selectbox.bind('change', {column: col, index: index, options: options}, selectOnChange);

                return selectbox;
            }

            function selectOnChange(event) {
                var changeStart = new Date();
                var value = $(this).val();

                event.data.column.each(function () {
                    if ($(this).attr('ddtf-value') === value || value == '--all--') {
                        $(this).removeClass('ddtf-filtered');
                    }
                    else {
                        $(this).addClass('ddtf-filtered');
                    }
                });

                filterRows(table);
                refreshFilters(event.data.index + 1);

                var changeStop = new Date();
                if (options.debug) {
                    console.log('Search: ' + (changeStop.getTime() - changeStart.getTime()) + 'ms');
                }
            }

            function getFilterOptions(col, filtered) {
                filtered = filtered || false;
                var values = [];
                var opts = [];

                col.each(function () {
                    var cellVal = options.valueCallback.apply(this);
                    if (cellVal.length == 0) {
                        cellVal = '--empty--';
                    }
                    $(this).attr('ddtf-value', cellVal);

                    if (filtered && $(this).parent().css('display') == 'none') return;

                    if ($.inArray(cellVal, values) === -1) {
                        var cellText = options.textCallback.apply(this);
                        if (cellText.length == 0) {
                            cellText = options.emptyText;
                        }
                        values.push(cellVal);
                        opts.push({val: cellVal, text: cellText});
                    }
                });

                if (options.sortOpt) {
                    opts.sort(options.sortOptCallback);
                }

                return opts;
            }

            function filterRows(table) {
                var refreshStart = new Date();
                $('tr', table).each(function () {
                    var row = $(this);
                    if ($('td.ddtf-filtered', row).length > 0) {
                        options.transition.hide.apply(row, options.transition.options);
                    }
                    else {
                        options.transition.show.apply(row, options.transition.options);
                    }
                });

                if ($.isFunction(options.afterFilter)) {
                    options.afterFilter.apply(table);
                }

                if (options.debug) {
                    var refreshEnd = new Date();
                    console.log('Refresh: ' + (refreshEnd.getTime() - refreshStart.getTime()) + 'ms');
                }
            }

            if (options.debug) {
                var stop = new Date();
                console.log('Build: ' + (stop.getTime() - start.getTime()) + 'ms');
            }
        });
    };

    $.fn.ddTableFilter.defaultOptions = {
        valueCallback: function () {
            return encodeURIComponent($.trim($(this).text()));
        },
        textCallback: function () {
            return $.trim($(this).text());
        },
        sortOptCallback: function (a, b) {
            return a.text.toLowerCase() > b.text.toLowerCase();
        },
        afterFilter: null,
        afterBuild: null,
        transition: {
            hide: $.fn.hide,
            show: $.fn.show,
            options: []
        },
        emptyText: '--Empty--',
        sortOpt: true,
        debug: false,
        minOptions: 2
    }

})(jQuery);
