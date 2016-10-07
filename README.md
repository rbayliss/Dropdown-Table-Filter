jQuery Dropdown Table Filter plugin:
=============================

A simple to use plugin to add dropdown filters for any table.  Filtering is instant and does not require a page reload.  

HTML Structure:
------------------------
<table>
<tr>
  <th>Item #</th>
  <th>Type</th>
  <th class="skip-filter">Price</th>
</tr>
<tr>
  <td>Item 1</td>
  <td>Special</td>
  <td>$10.00</td>
</tr>
<tr>
  <td>Item 2</td>
  <td>Not Special</td>
  <td>$11.00</td>
</tr>
</table>

This plugin requires a `<th>` for each column.  The label for the `<th>` will be replaced by a dropdown select menu containing all of the unique values present in that column.  In the above example, selecting "Special" for the type column would hide Item 2, leaving only item 1.

Since we don't want to filter by things that only appear once (like price, maybe), we just add the class `skip-filter` to that column heading.

For example:

<pre>
&lt;tr&gt;<br />
&lt;th&gt;Item #&lt;/th&gt;<br />
&lt;th&gt;Type&lt;/th&gt;<br />
&lt;th class=&quot;skip-filter&quot;&gt;Price&lt;/th&gt;<br />
&lt;/tr&gt;
</pre>

How To Use
-------------------
It's simple.  Just include ddtf.js (along with jQuery), and do:
    <pre>$('#myTable').ddTableFilter();</pre>
To use the options defined below, use the following syntax:
<pre>    var options = {
      sortOpt: false,
      ...more settings here
    }
    $('#myTable').ddTableFilter(options); </pre>
	


Options
------------
For customization, the following parameters are available:

*  valueCallback: A function that provides the hidden value of the cell.  This is useful if your cells don't just contain simple values.
*  textCallback: A function that provides the value of the cell that is displayed in the dropdown.  Remember that HTML cannot be put into a dropdown option.
*  sortOptCallback: A function to sort the options as they are added to the list.  This function will be passed two options to compare at a time.  
*  transition: An object with 3 parameters: 
    *  hide: The function used to remove rows from view. (defaults to $.hide())
    * show: The function used to bring rows back into view. (defaults to $.show())
    * options: An array of options to pass to the above two functions.  Typically, this would be something like `['slow']` for a normal jQuery hide transition.
*  emptyText: Text to display for empty rows.  Defaults to '--Empty--'.
*  sortOpt: A boolean indicating whether or not to sort the options.  This must be true for sortOptCallback to work.  Defaults to true.
*  debug: A boolean indicating whether or not to run in "debug" mode.  Debug mode displays performance data.
*  minOptions: Number of options required to show a select filter.  Defaults to 2, meaning if a column only has one unique value, no select box will be shown (what would be the point?).
*  firstOptionText: The first select option label text. Could be something like "All" or defaults to the column title.
*  headingClass: Option for adding a `class` to the column heading for floating, styling, or just hiding. Defaults to no class and just `style="display:none;"`


Callback
------------
The use case for the callback might be something like the following where we want to filter and then add-up all the filtered rows:

<pre>$('#myTable').ddTableFilter(options, function() {
	// Callback stuff here
	var sum = addColumns(); // pretend that f(x) sums visible column data or something
	$('#myTable tfoot th:nth-child(n+1)').text(sum);
});</pre>


Compatibility
-------------------
This plugin has been tested back to jQuery 1.2.6 and up to 1.4.2.  It may work on other versions as well.
