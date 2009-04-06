(function(punymce) {
	var Event = punymce.Event;

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

	punymce.plugins.Paste = function(ed) {
		var dom = punymce.DOM, bookmark;

		ed.onPaste = new punymce.Dispatcher(ed);

		function insert(v) {
			var lines, parents = [], block, caret, sel = ed.selection, start, end, i, rng;

			ed.getWin().focus();

			// Restore caret location on IE
			if (bookmark) {
				r = ed.selection.getRng();
				r.moveToBookmark(bookmark);
				r.select();
			}

			// Convert lines to paragraphs
			lines = v.split(/\r?\n/);
			if (lines.length > 1) {
				v = '';
				punymce.each(lines, function(line) {
					v += '<p>' + line + '</p>';
				});

				// Split current container
				if (!punymce.isIE) {
					sel.setContent('<span id="marker"></span>');
					block = ed.dom.getParent(ed.dom.get('marker').parentNode, function(n) {
						parents.push(n);

						if (/^(p|h[1-6]|div)$/i.test(n.nodeName))
							return true;
					});

					if (block) {
						ed.onPaste.dispatch({text : v});

						start = end = '';
						for (i = 0; i < parents.length; i++)
							start += '</' + parents[i].nodeName.toLowerCase() + '>';

						for (i = parents.length - 1; i >= 0; i--)
							end += '<' + parents[i].nodeName.toLowerCase() + '>';

						v = start + v + end + '<span id="_caret">&nbsp;</span>';

						ed.getBody().innerHTML = ed.getBody().innerHTML.replace(/<span id=\"marker\"><\/span>/gi, v);

						caret = ed.dom.get('_caret');

						if (!punymce.isGecko)
							caret.scrollIntoView();

						rng = ed.getDoc().createRange();
						rng.setStartBefore(caret);
						rng.setEndAfter(caret);
						sel.setRng(rng);
						ed.execCommand('Delete');

						return;
					}
				}
			}

			ed.selection.setContent(v);
			ed.onPaste.dispatch({text : v});
		};

		function grab(e) {
			var elm = insertAfter(dom.create('textarea', {id : 'punymce_paste', style : 'position:absolute;width:1px;height:1px'}), dom.get(ed.settings.id + '_c')), r, val;

			elm.focus();

			setTimeout(function() {
				// Grab contents from text area and insert it
				val = elm.value;
				elm.parentNode.removeChild(elm);
				insert(val);
			}, 0);
		};

		ed.onInit.add(function() {
			if (punymce.isOpera)
				return;

			// WebKit allows us to access the clipboard contents
			if (/WebKit/.test(navigator.userAgent) || punymce.isIE) {
				Event.add(punymce.isIE ? ed.getBody() : ed.getDoc(), 'paste', function(e) {
					var val;

					if (ed.getWin().clipboardData)
						val = ed.getWin().clipboardData.getData('Text');
					else
						val = e.clipboardData.getData('text/plain');

					insert(val);

					return Event.cancel(e);
				});
			} else {
				Event.add(ed.getDoc(), 'keydown', function(e) {
					// Fake onpaste event (ctrl+v or shift+insert)
					if (((e.metaKey || e.ctrlKey) && e.keyCode == 86) || (e.shiftKey && e.keyCode == 45)) {
						// Store away caret location
						if (punymce.isIE)
							bookmark = ed.selection.getRng().getBookmark();

						grab(e);
					}
				}, this);
			}
		});
	};
})(punymce);
