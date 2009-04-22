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

	function findTextNode(ed, n, first) {
		// Find last text node
		var tn, w = ed.getDoc().createTreeWalker(n, NodeFilter.SHOW_TEXT, null, false);

		if (first)
			return w.nextNode();

		while (tn = w.nextNode())
			n = tn;

		return n;
	};

	punymce.plugins.Paste = function(ed) {
		var dom = punymce.DOM, bookmark;

		ed.onPaste = new punymce.Dispatcher(ed);

		function insert(v) {
			var lines, parents = [], block, caret, sel = ed.selection, start, end, i, rng, marker;

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
					ed.execCommand('Delete');
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
					} else {
						marker = ed.dom.get('marker');
						marker.parentNode.removeChild(marker);
					}
				}
			}

			ed.selection.setContent(v);
			ed.onPaste.dispatch({text : v});
		};

		function grab(e) {
			var n, rng, sel = ed.selection, se = sel.getSel(), or, body = ed.getBody();

			n = ed.dom.add(body, 'div', {id : '_mcePaste', style : 'position:absolute;left:-10000px;top:' + body.scrollTop}, '&nbsp;');

			// Move caret into hidden div
			or = sel.getRng();
			n = n.firstChild;
			rng = ed.getDoc().createRange();
			rng.setStart(n, 0);
			rng.setEnd(n, 1);

			se.removeAllRanges();
			se.addRange(rng);

			window.setTimeout(function() {
				var n = ed.dom.get('_mcePaste'), h;

				// Grab the HTML contents
				h = n.innerHTML;

				// Remove hidden div and restore selection
				n.parentNode.removeChild(n);

				// Restore the old selection
				if (or)
					sel.setRng(or);

				insert(h.replace(/[\r\n]/g, '').replace(/<(\/p|br\s*\/?)>/g, '\n').replace(/<!--.*?-->/g, '').replace(/<[^>]+>/g, ''));
			}, 0);
		};

		ed.onInit.add(function() {
			if (punymce.isOpera)
				return;

			// Use Ctrl+v handler on FF 2
			if (/Firefox\/2/.test(navigator.userAgent)) {
				Event.add(ed.getDoc(), 'keydown', function(e) {
					// Fake onpaste event (ctrl+v or shift+insert)
					if (((e.metaKey || e.ctrlKey) && e.keyCode == 86) || (e.shiftKey && e.keyCode == 45)) {
						// Store away caret location
						if (punymce.isIE)
							bookmark = ed.selection.getRng().getBookmark();

						grab(e);
					}
				}, this);
			} else {
				Event.add(punymce.isIE ? ed.getBody() : ed.getDoc(), 'paste', function(e) {
					var val;

					if (ed.getWin().clipboardData) {
						insert(ed.getWin().clipboardData.getData('Text'));
						return Event.cancel(e);
					} if (e.clipboardData) {
						insert(e.clipboardData.getData('text/plain'));
						return Event.cancel(e);
					}

					grab(e);
				});
			}
		});
	};
})(punymce);
