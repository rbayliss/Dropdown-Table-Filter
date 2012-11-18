(function($) {

$.fn.ddTableFilter = function(options) {
  options = $.extend(true, $.fn.ddTableFilter.defaultOptions, options);

  return this.each(function() {
    if($(this).hasClass('ddtf-processed')) {
      refreshFilters(this);
      return;
    }
    var table = $(this);
    var start = new Date();
    
    $('th', table).each(function(index) {
      if($(this).hasClass('skip-filter')) return;
      var selectbox = $('<select>');
      var values = [];
      var opts = new Array();
      selectbox.append('<option value="--all--">' + $(this).text() + '</option>');
      
      var col = $('tr:not(.skip-filter) td:nth-child(' + (index + 1) + ')', table).each(function(index) {
        var cellVal = options.valueCallback.apply(this);
        if(cellVal.length == 0) {
          cellVal = '--empty--';
        }
        $(this).attr('ddtf-value', cellVal);
        
        if($.inArray(cellVal, values) === -1) {
          var cellText = options.textCallback.apply(this);
          if(cellText.length == 0) {cellText = options.emptyText;}
          values.push(cellVal);
          opts.push({val:cellVal, text:cellText});
        }
      });
      if(opts.length < options.minOptions){
        return;
      } 
      if(options.sortOpt) {
        opts.sort(options.sortOptCallback);
      }
      $.each(opts, function() {
        $(selectbox).append('<option value="' + this.val + '">' + this.text + '</option>')
      });

      var targetID = $(this).attr('filter-container-elementid');
      if(targetID) {
        $("#" + targetID, table).append(selectbox);
      }
      else {
        $(this).wrapInner('<div style="display:none">');
        $(this).append(selectbox);
      }
      
      selectbox.bind('change', {column:col}, function(event) {
        var changeStart = new Date();
        var value = $(this).val();
        
        event.data.column.each(function() {
          if($(this).attr('ddtf-value') === value || value == '--all--') {
            $(this).removeClass('ddtf-filtered');
          }
          else {
            $(this).addClass('ddtf-filtered');
          }
        });
        var changeStop = new Date();
        if(options.debug) {
          console.log('Search: ' + (changeStop.getTime() - changeStart.getTime()) + 'ms');
        }
        refreshFilters(table);
        var changeStop = new Date();
        
      });
      table.addClass('ddtf-processed');
      if($.isFunction(options.afterBuild)) {
        options.afterBuild.apply(table);
      }
    });
    
    
    function refreshFilters(table) {
      var refreshStart = new Date();
      $('tr', table).each(function() {
        var row = $(this);
        if($('td.ddtf-filtered', row).length > 0) {
          options.transition.hide.apply(row, options.transition.options);
        }
        else {
          options.transition.show.apply(row, options.transition.options);
        }
      });

      if (showFilterInteractions) {
        //handle greying out of inapplicable filters
        $('th', table).each(function(index) {
          if($(this).hasClass('skip-filter')) return;
          var values = [];
          $('tr:not(.skip-filter)', table).each(function(rowindex) {
            var rowValue;
            var otherfilterHidesRow = false;
            $('td', this).each(function(columnindex) {
              if(columnindex === index) {
                rowValue = $(this).attr('ddtf-value');
              }
              else {
                if($(this).hasClass('ddtf-filtered'))
                  otherfilterHidesRow = true;
              }
            });
            if(!otherfilterHidesRow && $.inArray(rowValue, values) === -1)
              values.push(rowValue);
          });
    
          var targetID = $(this).attr('filter-container-elementid');
          var $targetSelect;
    
          if(targetID)
            $targetSelect = $("#" + targetID + ">select", table);
          else
            $targetSelect = $("select", this);
    
          $("option", $targetSelect).each(function(index) {
            if($.inArray($(this).val(), values) === -1 && $(this).val() != '--all--')
              $(this).addClass("ddtf-optionunavailable");
            else
              $(this).removeClass("ddtf-optionunavailable");
          });
        });
      }
        
      if($.isFunction(options.afterFilter)) {
        options.afterFilter.apply(table);
      }
      
      if(options.debug) {
        var refreshEnd = new Date();
        console.log('Refresh: ' + (refreshEnd.getTime() - refreshStart.getTime()) + 'ms');
      }
    }
    
    if(options.debug) {
      var stop = new Date();
      console.log('Build: ' + (stop.getTime() - start.getTime()) + 'ms');
    }
  });
  
}

$.fn.ddTableFilter.defaultOptions = {
  valueCallback:function() {
    return escape($.trim($(this).text()));
  },
  textCallback:function() {
    return $.trim($(this).text());
  },
  sortOptCallback: function(a, b) {
    return a.text.toLowerCase() > b.text.toLowerCase(); 
  },
  afterFilter: null,
  afterBuild: null,
  transition: {
    hide:$.fn.hide,
    show:$.fn.show,
    options: []
  },
  emptyText:'--Empty--',
  sortOpt:true,
  showFilterInteractions:false,
  debug:false,
  minOptions:2
}
 
})(jQuery);
