(function(punymce) {
	function insertAfter(n, r) {
		var p, ns;

		p = r.parentNode;
		ns = r.nextSibling;

		if (ns)
			p.insertBefore(n, ns);
		else
			p.appendChild(n);

		return n;
	};

	punymce.plugins.TabFocus = function(ed) {
		var Event = punymce.Event, DOM = punymce.DOM;

		ed.onInit.add(function() {
			var p, ns, n;

			// Append an anchor element after the editor container ones this gets focused it will
			// focus the editor instead this makes it possible to shift tab into the editor
			n = insertAfter(DOM.create('a', {href : '#'}), DOM.get(ed.settings.id + '_c'));

			Event.add(n, 'focus', function(e) {
				ed.getWin().focus();
			});

			Event.add(ed.getDoc(), 'keydown', function(e) {
				if (e.keyCode == 9)
					return Event.cancel(e);
			});

			Event.add(ed.getDoc(), 'keydown', function(e) {
				if (e.keyCode == 9) {
					window.focus();

					// Focus the specified element
					DOM.get(ed.settings.tabfocus_id).focus();
				}
			});
		});
	};
})(punymce);
