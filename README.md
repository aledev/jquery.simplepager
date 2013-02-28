jquery.simplepager
==================
Author: Alejandro Aliaga Martínez

Description:
-----------

A simple table pager for jQuery

It will add a data pager to an ordinary html table. 

Basic Functionality:
-------------------

You have to add the jquery and the simplepager library (with his respective css). 

You have to have a div who has a table with this structure:

 ```
 <table>
  <thead>
    <th>
    .
    .
    </th>
  </thead>
  <tbody>
    <tr>
      .
      .
    </tr>
  </tbody>
</table>
 ```
Then call it in the $(document).ready function, like this:

 ```
<script type="text/javascript">
  $(document).ready(function(){
    $('#myDiv').simplepager();
  });
</script>
 ```
