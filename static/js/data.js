var x=[];
var y=[];
var rating = 0.00;
var labels=[];
d3.json('/fullData').then(function(data){
  showData(data);
});
d3.json('/resturants').then(function(data){
  for(var i=0;i<data.length;i++){
    // createDropdownItem('#namedropdown',data[i]['0']);
    $('#namedropdown').prepend($(`<a href='javascript:showByNameData(\"${data[i]['0']}\");' class="dropdown-item">${data[i]['0']}</a>`));
  }
});
d3.json('/states').then(function(data){
  for(var i=0;i<data.length;i++){
    $('#statedropdown').prepend($(`<a href='javascript:showByStateData(\"${data[i]['0']}\");' class="dropdown-item">${data[i]['0']}</a>`));
    // createDropdownItem('#statedropdown',data[i]['0']);
  }
});
d3.json('/cities').then(function(data){
  for(var i=0;i<data.length;i++){
    $('#citydropdown').prepend($(`<a href='javascript:showByCityData(\"${data[i]['0']}\");' class="dropdown-item">${data[i]['0']}</a>`));
    // createDropdownItem('#citydropdown',data[i]['0']);
  }
});

d3.json('/cuisine').then(function(data){
  for(var i=0;i<data.length;i++){
    $('#cuisinedropdown').prepend($(`<a href='javascript:showByCuisineData(\"${data[i]['0']}\");' class="dropdown-item">${data[i]['0']}</a>`));
    // createDropdownItem('#citydropdown',data[i]['0']);
  }
});
function showByStateData(key){
  d3.json('/filterByState/'+key).then(function(data){
    showData(data);
  }); 
}
function showByNameData(key){  

  d3.json('/filterByName/'+key).then(function(data){
    showData(data);
  }); 
}
function showByCityData(key){  
  d3.json('/filterByCity/'+key).then(function(data){
    showData(data);
  });  
}
function showByCuisineData(key){
  d3.json('/filterByCuisine/'+key).then(function(data){
    showData(data);
  });
}
function showByRatingData(key){
  d3.json('/filterByRating/'+key).then(function(data){
    showData(data);
  }); 
}
function showByDeliveryServiceData(key){  
  d3.json("/filterByUbereats/"+key).then(function(data){
    showData(data);
  }); 
}
function createTable(data){
    // select tbody
    var tbody1 = d3.select('tbody');
    //remove all child from tbody
    tbody1.selectAll("*").remove();
    // create a row for each object in the data
    var rows1 = tbody1.selectAll('tr')
    .data(data)
    .enter()
    .append('tr');

    // create a cell for each object in the data
    rows1.selectAll('td')
	  .data(function (row) {
	    return ['name','business_status','opening_hours','vicinity','state','city','rating'].map(function (column) {
        if(column == 'opening_hours'){
          return {column: column, value: row[column] ? 'OPEN' : 'CLOSE'};
        }else if(column == 'business_status'){
          var a="";
          if(row[column] == 'OPERATIONAL'){
            a = 'OPERATIONAL'
          }else if(row[column] == 'CLOSED_TEMPORARILY'){
            a = 'TEMPORARILY CLOSED';
          }
          return {column: column, value: a};
        }else if(column == 'rating'){
          if(row[column] == 'N/A'){
            return {column: column, value: 0.0};
          }else{
            return {column: column, value: row[column]};
          }
        }else{
          return {column: column, value: row[column]};
        }
	    });
	  })
    .enter()
    .append('td')
    .text(function (d) { return d.value; });
}

function showData(data){
  x=[];
  y=[];
  rating = 0.00;
  labels=[];

  createTable(data);

  data.every(element => {
    x.push(element.name);
    // y.push(element.price_level);
    y.push(element.rating);
    labels.push(element.city);
    if(element.rating == 'N/A'){
      rating = rating + 0.00;
    }else{
      rating = rating + parseFloat(element.rating);
    }

    return true;
  });
}
$('.dropdown-menu a.dropdown-toggle').on('click',function(e) {
  if (!$(this).next().hasClass('show')) {
    $(this).parents('.dropdown-menu').first().find('.show').removeClass('show');
  }
  var $subMenu = $(this).next('.dropdown-menu');
  $subMenu.toggleClass('show');


  $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
    $('.dropdown-submenu .show').removeClass('show');
  });
  return false;
});