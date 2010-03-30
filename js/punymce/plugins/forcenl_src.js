// ForceNL Plugin for PunyMCE
//   - Converts all <br /> to \n
punymce.plugins.ForceNL = function(ed) {
	// Forces <br /> to \n
	ed.onGetContent.add(function(ed, o) {
		if (o.format == 'forcenl' || o.save) {
			punymce.each([
				[/<(br\s*\/)>/gi, "\n"],
				[/<(br.*?\/)>/gi, ""]
				//[<br type="_moz"/>, ""]
			], function (v) {
				o.content = o.content.replace(v[0], v[1]);
			});
		}
	});

	ed.onSetContent.add(function(ed, o) {
		if (o.format == 'forcenl' || o.load) {
			punymce.each([
				[/\n/gi,"<br />"]
			], function (v) {
				o.content = o.content.replace(v[0], v[1]);
			});
		}
	});
};
