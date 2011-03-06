jQuery Dropdown Table Filter plugin:
=============================

A simple to use plugin to add dropdown filters for any table.  Filtering is instant and does not require a page reload.  

HTML Structure:

<table>
<tr>
  <th>Item #</th>
  <th>Type</th>
</tr>
<tr>
  <td>Item 1</td>
  <td>Special</td>
</tr>
<tr>
  <td>Item 2</td>
  <td>Not Special</td>
</tr>
</table>

This plugin requires a <th> for each column.  The label for the <th> will be replaced by a dropdown select menu containing all of the unique values present in that column.
On selecting "Not Special" for the second column, the first item will be filtered out, leaving only the first item.  