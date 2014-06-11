var classHighlight = "highlight";

var $thumbs = $("tr.department").click(function(e) {
	e.preventDefault();
	$thumbs.removeClass(classHighlight);
	$(this).addClass(classHighlight);
});
