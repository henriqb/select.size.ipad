/*
	The MIT License (MIT)

	Copyright (c) 2014 Henrique Borba Behr

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
 */
(function ($) {
    var defaultParams = {
        "ul-class": "selectSize-ul"
    };
	
	if (!$) {
		throw "jQuery required.";
	}
	if ($.fn.selectSize) {
		return;
	}
	
    $.fn.selectSize = function (args, params) {
        var $select, size, disabled;
        
        var fn = (function () {
            var $ul, valAttr = "16c8e533";

            function getParam(s) { return params ? params[s] : defaultParams[s]; };
            var ul = (function () {
                return function (opts) {
                    var $ul2 = $("<ul>");
                    $ul2.addClass(getParam("ul-class"));
                    $.each(opts, function (i, o) {
                        var $o = $(o);
                        var $li = li($o);
                        $ul2.append($li);
                    });
                    return $ul2;
                };
            })();
            var li = (function () {
                function click() {
                    var $this = $(this);
                    $ul.children("li.selectSize-clicked").removeClass("selectSize-clicked");
                    $this.addClass("selectSize-clicked");
                    $select.val(value($this)).change();
                };
                function value($li, v) { return v ? $li.data(valAttr, v) : $li.data(valAttr); };
                return function ($o) {
                    var $li = $("<li>");
                    value($li, $o.val());
                    $li.text($o.text());

                    $li.addClass("selectSize-li");
                    $o.is(":selected") && $li.addClass("selectSize-clicked");
                    disabled && $li.addClass("selectSize-li-disabled");
                    !disabled && $li.on("click", click);
                    return $li;
                };
            })();
            var createDiv = function (opts) {
                var $div2 = $("<div>");
                $div2.addClass("selectSize-outside");
                $div2.css("height", (size * 14 + 5) + "px");

                $ul = ul(opts);
                $div2.append($ul);
                return $div2;
            };
            return {
                createDiv: createDiv,
                update: function () { $select.show().parent().find(".selectSize-outside").remove(); }
            };
        })();

        $select = $(this);

        if ($select.length > 1) { $.each($select, function(i, s) { $(s).selectSize(args); }); return this; }

        if (args && $select.is(":hidden")) {
            if (!fn[args]) {
                throw "Function " + args + " not found.";
            }
            var res = fn[args]();
            if (res) {
                return res;
            }
        }

        size = parseInt($select.attr("size"));
        if (isNaN(size) || size < 2 || $select.is(":hidden")) { return this; }
        disabled = $select.attr("disabled") == "disabled";

        $select.hide();

        var $div = fn.createDiv($select.children());
        $select.after($div);
        return this;
    };
})(jQuery);