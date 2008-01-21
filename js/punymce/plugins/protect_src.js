punymce.plugins.Protect = function(ed) {
	var pr = [], s;

	// Default settings
	s = ed.settings;
	if (!s.protect) {
		s.protect = [
			/<(script|noscript|style)[\u0000-\uFFFF]*?<\/(script|noscript|style)>/g
		];
	}

	// Store away things to protect
	ed.onSetContent.add(function(ed, o) {
		punymce.each(s.protect, function(re) {
			o.content = o.content.replace(re, function(a) {
				pr.push(a);
				return '<!-- pro:' + (pr.length-1) + ' -->';
			});
		});
	});

	// Restore protected things
	ed.onGetContent.add(function(ed, o) {
		o.content = o.content.replace(/<!-- pro:([0-9]+) -->/g, function(a, b) {
			return pr[parseInt(b)];
		});
	});
};
