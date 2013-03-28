// Copyright 2006 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
// implied. See the License for the specific language governing
// permissions and limitations under the License.
/**
 * Apache License, Version 2.0
 * Modify:Global variable -> in jstmpl object.
 *        Merge util.js, jsevalcontext.js, jstemplate.js.
 * @author K.Kajino
 */
// Global Object is this only.
var jstmpl = {
  MAPS_DEBUG : false,

  log : function(msg){},

  // String literals defined globally and not to be inlined. (IE6 perf)
  /** @const */
  STRING_empty : '',
  /** @const */
  CSS_display  : 'display',
  /** @const */
  CSS_position : 'position',

  // Constants for possible values of the typeof operator.
  TYPE_boolean   : 'boolean',
  TYPE_number    : 'number',
  TYPE_object    : 'object',
  TYPE_string    : 'string',
  TYPE_function  : 'function',
  TYPE_undefined : 'undefined',

  // Based on <http://www.w3.org/TR/2000/ REC-DOM-Level-2-Core-20001113/
  // core.html#ID-1950641247>.
  DOM_ELEMENT_NODE                :  1,
  DOM_ATTRIBUTE_NODE              :  2,
  DOM_TEXT_NODE                   :  3,
  DOM_CDATA_SECTION_NODE          :  4,
  DOM_ENTITY_REFERENCE_NODE       :  5,
  DOM_ENTITY_NODE                 :  6,
  DOM_PROCESSING_INSTRUCTION_NODE :  7,
  DOM_COMMENT_NODE                :  8,
  DOM_DOCUMENT_NODE               :  9,
  DOM_DOCUMENT_TYPE_NODE          : 10,
  DOM_DOCUMENT_FRAGMENT_NODE      : 11,
  DOM_NOTATION_NODE               : 12,

  /**
   * Names of special variables defined by the jstemplate evaluation
   * context. These can be used in js expression in jstemplate
   * attributes.
   */
  VAR_index   : '$index',
  VAR_count   : '$count',
  VAR_this    : '$this',
  VAR_context : '$context',
  VAR_top     : '$top',

  /**
   * The name of the global variable which holds the value to be returned if
   * context evaluation results in an error.
   * Use jstmpl.JsEvalContext.setGlobal(jstmpl.GLOB_default, value) to set this.
   */
  GLOB_default : '$default',

  /**
   * Un-inlined literals, to avoid object creation in IE6. TODO(mesch):
   * So far, these are only used here, but we could use them thoughout
   * the code and thus move them to constants.js.
   */
  CHAR_colon : ':',
  REGEXP_semicolon : /\s*;\s*/,

  /**
   * Uninlined string literals for jstmpl.jsEvalToFunction() (IE6 perf).
   */
  STRING_a : 'a_',
  STRING_b : 'b_',
  STRING_with : 'with (a_) with (b_) return ',

  /**
   * Names of jstemplate attributes. These attributes are attached to
   * normal HTML elements and bind expression context data to the HTML
   * fragment that is used as template.
   */
  ATT_select     : 'jsselect',
  ATT_instance   : 'jsinstance',
  ATT_display    : 'jsdisplay',
  ATT_values     : 'jsvalues',
  ATT_vars       : 'jsvars',
  ATT_eval       : 'jseval',
  ATT_transclude : 'transclude',
  ATT_content    : 'jscontent',
  ATT_skip       : 'jsskip',

  /**
   * Name of the attribute that caches a reference to the parsed
   * template processing attribute values on a template node.
   */
  ATT_jstcache : 'jstcache',

  /**
   * Name of the property that caches the parsed template processing
   * attribute values on a template node.
   */
  PROP_jstcache : '__jstcache',

  /**
   * ID of the element that contains dynamically loaded jstemplates.
   */
  STRING_jsts : 'jsts',

  /**
   * Un-inlined string literals, to avoid object creation in
   * IE6.
   */
  CHAR_asterisk       : '*',
  CHAR_dollar         : '$',
  CHAR_period         : '.',
  CHAR_ampersand      : '&',
  STRING_div          : 'div',
  STRING_id           : 'id',
  STRING_asteriskzero : '*0',
  STRING_zero         : '0',

  /**
   * Wrapper for the eval() builtin function to evaluate expressions and
   * obtain their value. It wraps the expression in parentheses such
   * that object literals are really evaluated to objects. Without the
   * wrapping, they are evaluated as block, and create syntax
   * errors. Also protects against other syntax errors in the eval()ed
   * code and returns null if the eval throws an exception.
   *
   * @param {string} expr
   * @return {Object|null}
   */
  jsEval : function (expr) {
    try {
      // NOTE(mesch): An alternative idiom would be:
      //
      //   eval('(' + expr + ')');
      //
      // Note that using the square brackets as below, "" evals to undefined.
      // The alternative of using parentheses does not work when evaluating
      // function literals in IE.
      // e.g. eval("(function() {})") returns undefined, and not a function
      // object, in IE.
      return eval('[' + expr + '][0]');
    } catch (e) {
      jstmpl.log('EVAL FAILED ' + expr + ': ' + e);
      return null;
    }
  },

  jsLength : function (obj) {
    return obj.length;
  },

  assert : function (obj) {},

  /**
   * Copies all properties from second object to the first.  Modifies to.
   *
   * @param {Object} to  The target object.
   * @param {Object} from  The source object.
   */
  copyProperties : function (to, from) {
    for (var p in from) {
      to[p] = from[p];
    }
  },

  /**
   * @param {Object|null|undefined} value The possible value to use.
   * @param {Object} defaultValue The default if the value is not set.
   * @return {Object} The value, if it is
   * defined and not null; otherwise the default
   */
  getDefaultObject : function (value, defaultValue) {
    return (jstmpl.TYPE_undefined != typeof value && null != value) ?
      value : defaultValue;
  },

  /**
   * Detect if an object looks like an Array.
   * Note that instanceof Array is not robust; for example an Array
   * created in another iframe fails instanceof Array.
   * @param {Object|null} value Object to interrogate
   * @return {boolean} Is the object an array?
   */
  isArray : function (value) {
    return null != value &&
        jstmpl.TYPE_object == typeof value &&
        jstmpl.TYPE_number == typeof value.length;
  },

  /**
   * Finds a slice of an array.
   *
   * @param {Array} array  Array to be sliced.
   * @param {number} start  The start of the slice.
   * @param {number} opt_end  The end of the slice (optional).
   * @return {Array} array  The slice of the array from start to end.
   */
  arraySlice : function (array, start, opt_end) {
    // Use
    //   return Function.prototype.call.apply(Array.prototype.slice, arguments);
    // instead of the simpler
    //   return Array.prototype.slice.call(array, start, opt_end);
    // here because of a bug in the FF and IE implementations of
    // Array.prototype.slice which causes this function to return an empty list
    // if opt_end is not provided.
    return Function.prototype.call.apply(Array.prototype.slice, arguments);
  },

  /**
   * Jscompiler wrapper for parseInt() with base 10.
   *
   * @param {string} s string repersentation of a number.
   *
   * @return {number} The integer contained in s, converted on base 10.
   */
  parseInt10 : function (s) {
    return parseInt(s, 10);
  },

  /**
   * Clears the array by setting the length property to 0. This usually
   * works, and if it should turn out not to work everywhere, here would
   * be the place to implement the browser specific workaround.
   *
   * @param {Array} array  Array to be cleared.
   */
  arrayClear : function (array) {
    array.length = 0;
  },

  /**
   * Prebinds "this" within the given method to an object, but ignores all
   * arguments passed to the resulting function.
   * I.e. var_args are all the arguments that method is invoked with when
   * invoking the bound function.
   *
   * @param {Object|null} object  The object that the method call targets.
   * @param {Function} method  The target method.
   * @return {Function}  Method with the target object bound to it and curried by
   *                     the provided arguments.
   */
  bindFully : function (object, method, var_args) {
    var args = jstmpl.arraySlice(arguments, 2);
    return function() {
      return method.apply(object, args);
    }
  },

  domGetElementById : function (document, id) {
    return document.getElementById(id);
  },

  /**
   * Creates a new node in the given document
   *
   * @param {Document} doc  Target document.
   * @param {string} name  Name of new element (i.e. the tag name)..
   * @return {Element}  Newly constructed element.
   */
  domCreateElement : function (doc, name) {
    return doc.createElement(name);
  },

  /**
   * Traverses the element nodes in the DOM section underneath the given
   * node and invokes the given callback as a method on every element
   * node encountered.
   *
   * @param {Element} node  Parent element of the subtree to traverse.
   * @param {Function} callback  Called on each node in the traversal.
   */
  domTraverseElements : function (node, callback) {
    var traverser = new jstmpl.DomTraverser(callback);
    traverser.run(node);
  },

  /**
   * A class to hold state for a dom traversal.
   * @param {Function} callback  Called on each node in the traversal.
   * @constructor
   * @class
   */
  DomTraverser : function (callback) {
    this.callback_ = callback;
  },

  /**
   * Get an attribute from the DOM.  Simple redirect, exists to compress code.
   *
   * @param {Element} node  Element to interrogate.
   * @param {string} name  Name of parameter to extract.
   * @return {string|null}  Resulting attribute.
   */
  domGetAttribute : function (node, name) {
    return node.getAttribute(name);
    // NOTE(mesch): Neither in IE nor in Firefox, HTML DOM attributes
    // implement namespaces. All items in the attribute collection have
    // null localName and namespaceURI attribute values. In IE, we even
    // encounter DIV elements that don't implement the method
    // getAttributeNS().
  },

  /**
   * Set an attribute in the DOM.  Simple redirect to compress code.
   *
   * @param {Element} node  Element to interrogate.
   * @param {string} name  Name of parameter to set.
   * @param {string|number} value  Set attribute to this value.
   */
  domSetAttribute : function (node, name, value) {
    node.setAttribute(name, value);
  },

  /**
   * Remove an attribute from the DOM.  Simple redirect to compress code.
   *
   * @param {Element} node  Element to interrogate.
   * @param {string} name  Name of parameter to remove.
   */
  domRemoveAttribute : function (node, name) {
    node.removeAttribute(name);
  },

  /**
   * Clone a node in the DOM.
   *
   * @param {Node} node  Node to clone.
   * @return {Node}  Cloned node.
   */
  domCloneNode : function (node) {
    return node.cloneNode(true);
    // NOTE(mesch): we never so far wanted to use cloneNode(false),
    // hence the default.
  },

  /**
   * Clone a element in the DOM.
   *
   * @param {Element} element  Element to clone.
   * @return {Element}  Cloned element.
   */
  domCloneElement : function (element) {
    return /** @type {Element} */(jstmpl.domCloneNode(element));
  },

  /**
   * Returns the document owner of the given element. In particular,
   * returns window.document if node is null or the browser does not
   * support ownerDocument.  If the node is a document itself, returns
   * itself.
   *
   * @param {Node|null|undefined} node  The node whose ownerDocument is required.
   * @returns {Document}  The owner document or window.document if unsupported.
   */
  ownerDocument : function (node) {
    return !node ?
      document :
        jstmpl.DOM_DOCUMENT_NODE == node.nodeType ?
          node :
          node.ownerDocument || document;
  },

  /**
   * Creates a new text node in the given document.
   *
   * @param {Document} doc  Target document.
   * @param {string} text  Text composing new text node.
   * @return {Text}  Newly constructed text node.
   */
  domCreateTextNode : function (doc, text) {
    return doc.createTextNode(text);
  },

  /**
   * Appends a new child to the specified (parent) node.
   *
   * @param {Element} node  Parent element.
   * @param {Node} child  Child node to append.
   * @return {Node}  Newly appended node.
   */
  domAppendChild : function (node, child) {
    return node.appendChild(child);
  },

  /**
   * Sets display to default.
   *
   * @param {Element} node  The dom element to manipulate.
   */
  displayDefault : function (node) {
    node.style[jstmpl.CSS_display] = '';
  },

  /**
   * Sets display to none. Doing this as a function saves a few bytes for
   * the 'style.display' property and the 'none' literal.
   *
   * @param {Element} node  The dom element to manipulate.
   */
  displayNone : function (node) {
    node.style[jstmpl.CSS_display] = 'none';
  },

  /**
   * Sets position style attribute to absolute.
   *
   * @param {Element} node  The dom element to manipulate.
   */
  positionAbsolute : function (node) {
    node.style[jstmpl.CSS_position] = 'absolute';
  },

  /**
   * Inserts a new child before a given sibling.
   *
   * @param {Node} newChild  Node to insert.
   * @param {Node} oldChild  Sibling node.
   * @return {Node}  Reference to new child.
   */
  domInsertBefore : function (newChild, oldChild) {
    return oldChild.parentNode.insertBefore(newChild, oldChild);
  },

  /**
   * Replaces an old child node with a new child node.
   *
   * @param {Node} newChild  New child to append.
   * @param {Node} oldChild  Old child to remove.
   * @return {Node}  Replaced node.
   */
  domReplaceChild : function (newChild, oldChild) {
    return oldChild.parentNode.replaceChild(newChild, oldChild);
  },

  /**
   * Removes a node from the DOM.
   *
   * @param {Node} node  The node to remove.
   * @return {Node}  The removed node.
   */
  domRemoveNode : function (node) {
    return jstmpl.domRemoveChild(node.parentNode, node);
  },

  /**
   * Remove a child from the specified (parent) node.
   *
   * @param {Element} node  Parent element.
   * @param {Node} child  Child node to remove.
   * @return {Node}  Removed node.
   */
  domRemoveChild : function (node, child) {
    return node.removeChild(child);
  },

  /**
   * Trim whitespace from begin and end of string.
   *
   * @see testStringTrim();
   *
   * @param {string} str  Input string.
   * @return {string}  Trimmed string.
   */
  stringTrim : function (str) {
    return jstmpl.stringTrimRight(jstmpl.stringTrimLeft(str));
  },

  /**
   * Trim whitespace from beginning of string.
   *
   * @see testStringTrimLeft();
   *
   * @param {string} str  Input string.
   * @return {string}  Trimmed string.
   */
  stringTrimLeft : function (str) {
    return str.replace(/^\s+/, "");
  },

  /**
   * Trim whitespace from end of string.
   *
   * @see testStringTrimRight();
   *
   * @param {string} str  Input string.
   * @return {string}  Trimmed string.
    */
  stringTrimRight : function (str) {
    return str.replace(/\s+$/, "");
  },

  /**
   * Evaluates the given expression as the body of a function that takes
   * vars and data as arguments. Since the resulting function depends
   * only on expr, we cache the result so we save some Function
   * invocations, and some object creations in IE6.
   *
   * @param {string} expr A javascript expression.
   *
   * @return {Function} A function that returns the value of expr in the
   * context of vars and data.
   */
  jsEvalToFunction : function (expr) {
    if (!jstmpl.JsEvalContext.evalToFunctionCache_[expr]) {
      try {
        // NOTE(mesch): The Function constructor is faster than eval().
        jstmpl.JsEvalContext.evalToFunctionCache_[expr] =
          new Function(jstmpl.STRING_a, jstmpl.STRING_b, jstmpl.STRING_with + expr);
      } catch (e) {
        jstmpl.log('jsEvalToFunction (' + expr + ') EXCEPTION ' + e);
      }
    }
    return jstmpl.JsEvalContext.evalToFunctionCache_[expr];
  },

  /**
   * Evaluates the given expression to itself. This is meant to pass
   * through string attribute values.
   *
   * @param {string} expr
   *
   * @return {string}
   */
  jsEvalToSelf : function (expr) {
    return expr;
  },

  /**
   * Parses the value of the jsvalues attribute in jstemplates: splits
   * it up into a map of labels and expressions, and creates functions
   * from the expressions that are suitable for execution by
   * jstmpl.JsEvalContext.jsexec(). All that is returned as a flattened array
   * of pairs of a String and a Function.
   *
   * @param {string} expr
   *
   * @return {Array}
   */
  jsEvalToValues : function (expr) {
    // TODO(mesch): It is insufficient to split the values by simply
    // finding semi-colons, as the semi-colon may be part of a string
    // constant or escaped.
    var ret = [];
    var values = expr.split(jstmpl.REGEXP_semicolon);
    for (var i = 0, I = jstmpl.jsLength(values); i < I; ++i) {
      var colon = values[i].indexOf(jstmpl.CHAR_colon);
      if (colon < 0) {
        continue;
      }
      var label = jstmpl.stringTrim(values[i].substr(0, colon));
      var value = jstmpl.jsEvalToFunction(values[i].substr(colon + 1));
      ret.push(label, value);
    }
    return ret;
  },

  /**
   * Parses the value of the jseval attribute of jstemplates: splits it
   * up into a list of expressions, and creates functions from the
   * expressions that are suitable for execution by
   * jstmpl.JsEvalContext.jsexec(). All that is returned as an Array of
   * Function.
   *
   * @param {string} expr
   *
   * @return {Array.<Function>}
   */
  jsEvalToExpressions : function (expr) {
    var ret = [];
    var values = expr.split(jstmpl.REGEXP_semicolon);
    for (var i = 0, I = jstmpl.jsLength(values); i < I; ++i) {
      if (values[i]) {
        var value = jstmpl.jsEvalToFunction(values[i]);
        ret.push(value);
      }
    }
    return ret;
  },

  /**
   * See constructor_()
   * @param {Object|null} opt_data
   * @param {Object} opt_parent
   * @constructor
   */
  JsEvalContext : function (opt_data, opt_parent) {
    this.constructor_.apply(this, arguments);
  },

  /**
   * Helps to implement the transclude attribute, and is the initial
   * call to get hold of a template from its ID.
   *
   * If the ID is not present in the DOM, and opt_loadHtmlFn is specified, this
   * function will call that function and add the result to the DOM, before
   * returning the template.
   *
   * @param {string} name The ID of the HTML element used as template.
   * @param {Function} opt_loadHtmlFn A function which, when called, will return
   *   HTML that contains an element whose ID is 'name'.
   *
   * @return {Element|null} The DOM node of the template. (Only element nodes
   * can be found by ID, hence it's a Element.)
   */
  jstGetTemplate : function (name, opt_loadHtmlFn) {
    var doc = document;
    var section;
    if (opt_loadHtmlFn) {
      section = jstmpl.jstLoadTemplateIfNotPresent(doc, name, opt_loadHtmlFn);
    } else {
      section = jstmpl.domGetElementById(doc, name);
    }
    if (section) {
      jstmpl.JstProcessor.prepareTemplate_(section);
      var ret = jstmpl.domCloneElement(section);
      jstmpl.domRemoveAttribute(ret, jstmpl.STRING_id);
      return ret;
    } else {
      return null;
    }
  },

  /**
   * This function is the same as 'jstGetTemplate' but, if the template
   * does not exist, throw an exception.
   *
   * @param {string} name The ID of the HTML element used as template.
   * @param {Function} opt_loadHtmlFn A function which, when called, will return
   *   HTML that contains an element whose ID is 'name'.
   *
   * @return {Element} The DOM node of the template. (Only element nodes
   * can be found by ID, hence it's a Element.)
   */
  jstGetTemplateOrDie : function (name, opt_loadHtmlFn) {
    var x = jstmpl.jstGetTemplate(name, opt_loadHtmlFn);
    check(x !== null);
    return /** @type Element */(x);
  },

  /**
   * If an element with id 'name' is not present in the document, call loadHtmlFn
   * and insert the result into the DOM.
   *
   * @param {Document} doc
   * @param {string} name
   * @param {Function} loadHtmlFn A function that returns HTML to be inserted
   * into the DOM.
   * @param {string} opt_target The id of a DOM object under which to attach the
   *   HTML once it's inserted.  An object with this id is created if it does not
   *   exist.
   * @return {Element} The node whose id is 'name'
   */
  jstLoadTemplateIfNotPresent : function (doc, name, loadHtmlFn, opt_target) {
    var section = jstmpl.domGetElementById(doc, name);
    if (section) {
      return section;
    }
    // Load any necessary HTML and try again.
    jstmpl.jstLoadTemplate_(doc, loadHtmlFn(), opt_target || jstmpl.STRING_jsts);
    var section = jstmpl.domGetElementById(doc, name);
    if (!section) {
      jstmpl.log("Error: jstmpl.jstGetTemplate was provided with opt_loadHtmlFn, " +
    "but that function did not provide the id '" + name + "'.");
    }
    return /** @type Element */(section);
  },

  /**
   * Loads the given HTML text into the given document, so that
   * jstmpl.jstGetTemplate can find it.
   *
   * We append it to the element identified by targetId, which is hidden.
   * If it doesn't exist, it is created.
   *
   * @param {Document} doc The document to create the template in.
   *
   * @param {string} html HTML text to be inserted into the document.
   *
   * @param {string} targetId The id of a DOM object under which to attach the
   *   HTML once it's inserted.  An object with this id is created if it does not
   *   exist.
   */
  jstLoadTemplate_ : function (doc, html, targetId) {
    var existing_target = jstmpl.domGetElementById(doc, targetId);
    var target;
    if (!existing_target) {
      target = jstmpl.domCreateElement(doc, jstmpl.STRING_div);
      target.id = targetId;
      jstmpl.displayNone(target);
      jstmpl.positionAbsolute(target);
      jstmpl.domAppendChild(doc.body, target);
    } else {
      target = existing_target;
    }
    var div = jstmpl.domCreateElement(doc, jstmpl.STRING_div);
    target.appendChild(div);
    div.innerHTML = html;
  },

  /**
   * Sets the jsinstance attribute on a node according to its context.
   *
   * @param {Element} template The template DOM node to set the instance
   * attribute on.
   *
   * @param {Array} values The current input context, the array of
   * values of which the template node will render one instance.
   *
   * @param {number} index The index of this template node in values.
   */
  jstSetInstance : function (template, values, index) {
    if (index == jstmpl.jsLength(values) - 1) {
      jstmpl.domSetAttribute(template, jstmpl.ATT_instance, jstmpl.CHAR_asterisk + index);
    } else {
      jstmpl.domSetAttribute(template, jstmpl.ATT_instance, jstmpl.STRING_empty + index);
    }
  }
};

/**
 * Processes the dom tree in breadth-first order.
 * @param {Element} root  The root node of the traversal.
 */
jstmpl.DomTraverser.prototype.run = function(root) {
  var me = this;
  me.queue_ = [ root ];
  while (jstmpl.jsLength(me.queue_)) {
    me.process_(me.queue_.shift());
  }
};

/**
 * Processes a single node.
 * @param {Element} node  The current node of the traversal.
 */
jstmpl.DomTraverser.prototype.process_ = function(node) {
  var me = this;
  me.callback_(node);
  for (var c = node.firstChild; c; c = c.nextSibling) {
    jstmpl.DOM_ELEMENT_NODE == c.nodeType && (me.queue_.push(c));
  }
};

/**
 * Context for processing a jstemplate. The context contains a context
 * object, whose properties can be referred to in jstemplate
 * expressions, and it holds the locally defined variables.
 *
 * @param {Object|null} opt_data The context object. Null if no context.
 *
 * @param {Object} opt_parent The parent context, from which local
 * variables are inherited. Normally the context object of the parent
 * context is the object whose property the parent object is. Null for the
 * context of the root object.
 */
jstmpl.JsEvalContext.prototype.constructor_ = function(opt_data, opt_parent) {
  var me = this;

  /**
   * The context for variable definitions in which the jstemplate
   * expressions are evaluated. Other than for the local context,
   * which replaces the parent context, variable definitions of the
   * parent are inherited. The special variable $this points to data_.
   *
   * If this instance is recycled from the cache, then the property is
   * already initialized.
   *
   * @type {Object}
   */
  if (!me.vars_) {
    me.vars_ = {};
  }
  if (opt_parent) {
    // If there is a parent node, inherit local variables from the
    // parent.
    jstmpl.copyProperties(me.vars_, opt_parent.vars_);
  } else {
    // If a root node, inherit global symbols. Since every parent
    // chain has a root with no parent, global variables will be
    // present in the case above too. This means that globals can be
    // overridden by locals, as it should be.
    jstmpl.copyProperties(me.vars_, jstmpl.JsEvalContext.globals_);
  }

  /**
   * The current context object is assigned to the special variable
   * $this so it is possible to use it in expressions.
   * @type Object
   */
  me.vars_[jstmpl.VAR_this] = opt_data;

  /**
   * The entire context structure is exposed as a variable so it can be
   * passed to javascript invocations through jseval.
   */
  me.vars_[jstmpl.VAR_context] = me;

  /**
   * The local context of the input data in which the jstemplate
   * expressions are evaluated. Notice that this is usually an Object,
   * but it can also be a scalar value (and then still the expression
   * $this can be used to refer to it). Notice this can even be value,
   * undefined or null. Hence, we have to protect jsexec() from using
   * undefined or null, yet we want $this to reflect the true value of
   * the current context. Thus we assign the original value to $this,
   * above, but for the expression context we replace null and
   * undefined by the empty string.
   *
   * @type {Object|null}
   */
  me.data_ = jstmpl.getDefaultObject(opt_data, jstmpl.STRING_empty);

  if (!opt_parent) {
    // If this is a top-level context, create a variable reference to the data
    // to allow for  accessing top-level properties of the original context
    // data from child contexts.
    me.vars_[jstmpl.VAR_top] = me.data_;
  }
};

/**
 * A map of globally defined symbols. Every instance of JsExprContext
 * inherits them in its vars_.
 * @type Object
 */
jstmpl.JsEvalContext.globals_ = {};

/**
 * Sets a global symbol. It will be available like a variable in every
 * jstmpl.JsEvalContext instance. This is intended mainly to register
 * immutable global objects, such as functions, at load time, and not
 * to add global data at runtime. I.e. the same objections as to
 * global variables in general apply also here. (Hence the name
 * "global", and not "global var".)
 * @param {string} name
 * @param {Object|null} value
 */
jstmpl.JsEvalContext.setGlobal = function(name, value) {
  jstmpl.JsEvalContext.globals_[name] = value;
};

/**
 * Set the default value to be returned if context evaluation results in an
 * error. (This can occur if a non-existent value was requested).
 */
jstmpl.JsEvalContext.setGlobal(jstmpl.GLOB_default, null);

/**
 * A cache to reuse jstmpl.JsEvalContext instances. (IE6 perf)
 *
 * @type Array.<jstmpl.JsEvalContext>
 */
jstmpl.JsEvalContext.recycledInstances_ = [];

/**
 * A factory to create a jstmpl.JsEvalContext instance, possibly reusing
 * one from recycledInstances_. (IE6 perf)
 *
 * @param {Object} opt_data
 * @param {jstmpl.JsEvalContext} opt_parent
 * @return {jstmpl.JsEvalContext}
 */
jstmpl.JsEvalContext.create = function(opt_data, opt_parent) {
  if (jstmpl.jsLength(jstmpl.JsEvalContext.recycledInstances_) > 0) {
    var instance = jstmpl.JsEvalContext.recycledInstances_.pop();
    jstmpl.JsEvalContext.call(instance, opt_data, opt_parent);
    return instance;
  } else {
    return new jstmpl.JsEvalContext(opt_data, opt_parent);
  }
};

/**
 * Recycle a used jstmpl.JsEvalContext instance, so we can avoid creating one
 * the next time we need one. (IE6 perf)
 *
 * @param {jstmpl.JsEvalContext} instance
 */
jstmpl.JsEvalContext.recycle = function(instance) {
  for (var i in instance.vars_) {
    // NOTE(mesch): We avoid object creation here. (IE6 perf)
    delete instance.vars_[i];
  }
  instance.data_ = null;
  jstmpl.JsEvalContext.recycledInstances_.push(instance);
};

/**
 * Executes a function created using jstmpl.jsEvalToFunction() in the context
 * of vars, data, and template.
 *
 * @param {Function} exprFunction A javascript function created from
 * a jstemplate attribute value.
 *
 * @param {Element} template DOM node of the template.
 *
 * @return {Object|null} The value of the expression from which
 * exprFunction was created in the current js expression context and
 * the context of template.
 */
jstmpl.JsEvalContext.prototype.jsexec = function(exprFunction, template) {
  try {
    return exprFunction.call(template, this.vars_, this.data_);
  } catch (e) {
    jstmpl.log('jsexec EXCEPTION: ' + e + ' at ' + template +
        ' with ' + exprFunction);
    return jstmpl.JsEvalContext.globals_[jstmpl.GLOB_default];
  }
};

/**
 * Clones the current context for a new context object. The cloned
 * context has the data object as its context object and the current
 * context as its parent context. It also sets the $index variable to
 * the given value. This value usually is the position of the data
 * object in a list for which a template is instantiated multiply.
 *
 * @param {Object} data The new context object.
 *
 * @param {number} index Position of the new context when multiply
 * instantiated. (See implementation of jstSelect().)
 *
 * @param {number} count The total number of contexts that were multiply
 * instantiated. (See implementation of jstSelect().)
 *
 * @return {jstmpl.JsEvalContext}
 */
jstmpl.JsEvalContext.prototype.clone = function(data, index, count) {
  var ret = jstmpl.JsEvalContext.create(data, this);
  ret.setVariable(jstmpl.VAR_index, index);
  ret.setVariable(jstmpl.VAR_count, count);
  return ret;
};

/**
 * Binds a local variable to the given value. If set from jstemplate
 * jsvalue expressions, variable names must start with $, but in the
 * API they only have to be valid javascript identifier.
 *
 * @param {string} name
 *
 * @param {Object?} value
 */
jstmpl.JsEvalContext.prototype.setVariable = function(name, value) {
  this.vars_[name] = value;
};

/**
 * Returns the value bound to the local variable of the given name, or
 * undefined if it wasn't set. There is no way to distinguish a
 * variable that wasn't set from a variable that was set to
 * undefined. Used mostly for testing.
 *
 * @param {string} name
 *
 * @return {Object?} value
 */
jstmpl.JsEvalContext.prototype.getVariable = function(name) {
  return this.vars_[name];
};

/**
 * Evaluates a string expression within the scope of this context
 * and returns the result.
 *
 * @param {string} expr A javascript expression
 * @param {Element} opt_template An optional node to serve as "this"
 *
 * @return {Object?} value
 */
jstmpl.JsEvalContext.prototype.evalExpression = function(expr, opt_template) {
  var exprFunction = jstmpl.jsEvalToFunction(expr);
  return this.jsexec(exprFunction, opt_template);
};

/**
 * Cache for jstmpl.jsEvalToFunction results.
 * @type Object
 */
jstmpl.JsEvalContext.evalToFunctionCache_ = {};



/** jstemplate.js */

/**
 * Author: Steffen Meschkat <mesch@google.com>
 *
 * @fileoverview A simple formatter to project JavaScript data into
 * HTML templates. The template is edited in place. I.e. in order to
 * instantiate a template, clone it from the DOM first, and then
 * process the cloned template. This allows for updating of templates:
 * If the templates is processed again, changed values are merely
 * updated.
 *
 * NOTE(mesch): IE DOM doesn't have importNode().
 *
 * NOTE(mesch): The property name "length" must not be used in input
 * data, see comment in jstSelect_().
 */
/**
 * Copyright 2013 Murata Manufacturing Co., Ltd. All Rights Reserved.
 * Apache License, Version 2.0
 * Modify:Global variable -> in jstmpl object.
 * @author K.Kajino
 */

/**
 * HTML template processor. Data values are bound to HTML templates
 * using the attributes transclude, jsselect, jsdisplay, jscontent,
 * jsvalues. The template is modifed in place. The values of those
 * attributes are JavaScript expressions that are evaluated in the
 * context of the data object fragment.
 *
 * @param {jstmpl.JsEvalContext} context Context created from the input data
 * object.
 *
 * @param {Element} template DOM node of the template. This will be
 * processed in place. After processing, it will still be a valid
 * template that, if processed again with the same data, will remain
 * unchanged.
 *
 * @param {boolean} opt_debugging Optional flag to collect debugging
 *     information while processing the template.  Only takes effect
 *     in jstmpl.MAPS_DEBUG.
 */
jstmpl.jstProcess = function (context, template, opt_debugging) {
  var processor = new jstmpl.JstProcessor;
  if (jstmpl.MAPS_DEBUG && opt_debugging) {
    processor.setDebugging(opt_debugging);
  }
  jstmpl.JstProcessor.prepareTemplate_(template);

  /**
   * Caches the document of the template node, so we don't have to
   * access it through jstmpl.ownerDocument.
   * @type Document
   */
  processor.document_ = jstmpl.ownerDocument(template);

  processor.run_(jstmpl.bindFully(processor, processor.jstProcessOuter_,
                           context, template));
  if (jstmpl.MAPS_DEBUG && opt_debugging) {
    jstmpl.log('jstProcess:' + '\n' + processor.getLogs().join('\n'));
  }
};

/**
 * Internal class used by jstemplates to maintain context.  This is
 * necessary to process deep templates in Safari which has a
 * relatively shallow maximum recursion depth of 100.
 * @class
 * @constructor
 */
jstmpl.JstProcessor = function () {
  if (jstmpl.MAPS_DEBUG) {
    /**
     * An array of logging messages.  These are collected during processing
     * and dumped to the console at the end.
     * @type Array.<string>
     */
    this.logs_ = [];
  }
};

/**
 * Counter to generate node ids. These ids will be stored in
 * jstmpl.ATT_jstcache and be used to lookup the preprocessed js attributes
 * from the jstcache_. The id is stored in an attribute so it
 * suvives cloneNode() and thus cloned template nodes can share the
 * same cache entry.
 * @type number
 */
jstmpl.JstProcessor.jstid_ = 0;

/**
 * Map from jstid to processed js attributes.
 * @type Object
 */
jstmpl.JstProcessor.jstcache_ = {};

/**
 * The neutral cache entry. Used for all nodes that don't have any
 * jst attributes. We still set the jsid attribute on those nodes so
 * we can avoid to look again for all the other jst attributes that
 * aren't there. Remember: not only the processing of the js
 * attribute values is expensive and we thus want to cache it. The
 * access to the attributes on the Node in the first place is
 * expensive too.
 */
jstmpl.JstProcessor.jstcache_[0] = {};

/**
 * Map from concatenated attribute string to jstid.
 * The key is the concatenation of all jst atributes found on a node
 * formatted as "name1=value1&name2=value2&...", in the order defined by
 * jstmpl.JST_ATTRIBUTES. The value is the id of the jstcache_ entry that can
 * be used for this node. This allows the reuse of cache entries in cases
 * when a cached entry already exists for a given combination of attribute
 * values. (For example when two different nodes in a template share the same
 * JST attributes.)
 * @type Object
 */
jstmpl.JstProcessor.jstcacheattributes_ = {};

/**
 * Map for storing temporary attribute values in prepareNode_() so they don't
 * have to be retrieved twice. (IE6 perf)
 * @type Object
 */
jstmpl.JstProcessor.attributeValues_ = {};

/**
 * A list for storing non-empty attributes found on a node in prepareNode_().
 * The array is global since it can be reused - this way there is no need to
 * construct a new array object for each invocation. (IE6 perf)
 * @type Array
 */
jstmpl.JstProcessor.attributeList_ = [];

/**
 * Prepares the template: preprocesses all jstemplate attributes.
 *
 * @param {Element} template
 */
jstmpl.JstProcessor.prepareTemplate_ = function(template) {
  if (!template[jstmpl.PROP_jstcache]) {
    jstmpl.domTraverseElements(template, function(node) {
      jstmpl.JstProcessor.prepareNode_(node);
    });
  }
};

/**
 * A list of attributes we use to specify jst processing instructions,
 * and the functions used to parse their values.
 *
 * @type Array.<Array>
 */
jstmpl.JST_ATTRIBUTES = [
  [ jstmpl.ATT_select    , jstmpl.jsEvalToFunction    ],
  [ jstmpl.ATT_display   , jstmpl.jsEvalToFunction    ],
  [ jstmpl.ATT_values    , jstmpl.jsEvalToValues      ],
  [ jstmpl.ATT_vars      , jstmpl.jsEvalToValues      ],
  [ jstmpl.ATT_eval      , jstmpl.jsEvalToExpressions ],
  [ jstmpl.ATT_transclude, jstmpl.jsEvalToSelf        ],
  [ jstmpl.ATT_content   , jstmpl.jsEvalToFunction    ],
  [ jstmpl.ATT_skip      , jstmpl.jsEvalToFunction    ]
];

/**
 * Prepares a single node: preprocesses all template attributes of the
 * node, and if there are any, assigns a jsid attribute and stores the
 * preprocessed attributes under the jsid in the jstcache.
 *
 * @param {Element} node
 *
 * @return {Object} The jstcache entry. The processed jst attributes
 * are properties of this object. If the node has no jst attributes,
 * returns an object with no properties (the jscache_[0] entry).
 */
jstmpl.JstProcessor.prepareNode_ = function(node) {
  // If the node already has a cache property, return it.
  if (node[jstmpl.PROP_jstcache]) {
    return node[jstmpl.PROP_jstcache];
  }

  // If it is not found, we always set the jstmpl.PROP_jstcache property on the node.
  // Accessing the property is faster than executing getAttribute(). If we
  // don't find the property on a node that was cloned in jstSelect_(), we
  // will fall back to check for the attribute and set the property
  // from cache.

  // If the node has an attribute indexing a cache object, set it as a property
  // and return it.
  var jstid = jstmpl.domGetAttribute(node, jstmpl.ATT_jstcache);
  if (jstid != null) {
    return node[jstmpl.PROP_jstcache] = jstmpl.JstProcessor.jstcache_[jstid];
  }

  var attributeValues = jstmpl.JstProcessor.attributeValues_;
  var attributeList = jstmpl.JstProcessor.attributeList_;
  attributeList.length = 0;

  // Look for interesting attributes.
  for (var i = 0, I = jstmpl.jsLength(jstmpl.JST_ATTRIBUTES); i < I; ++i) {
    var name = jstmpl.JST_ATTRIBUTES[i][0];
    var value = jstmpl.domGetAttribute(node, name);
    attributeValues[name] = value;
    if (value != null) {
      attributeList.push(name + "=" + value);
    }
  }

  // If none found, mark this node to prevent further inspection, and return
  // an empty cache object.
  if (attributeList.length == 0) {
    jstmpl.domSetAttribute(node, jstmpl.ATT_jstcache, jstmpl.STRING_zero);
    return node[jstmpl.PROP_jstcache] = jstmpl.JstProcessor.jstcache_[0];
  }

  // If we already have a cache object corresponding to these attributes,
  // annotate the node with it, and return it.
  var attstring = attributeList.join(jstmpl.CHAR_ampersand);
  if (jstid = jstmpl.JstProcessor.jstcacheattributes_[attstring]) {
    jstmpl.domSetAttribute(node, jstmpl.ATT_jstcache, jstid);
    return node[jstmpl.PROP_jstcache] = jstmpl.JstProcessor.jstcache_[jstid];
  }

  // Otherwise, build a new cache object.
  var jstcache = {};
  for (var i = 0, I = jstmpl.jsLength(jstmpl.JST_ATTRIBUTES); i < I; ++i) {
    var att = jstmpl.JST_ATTRIBUTES[i];
    var name = att[0];
    var parse = att[1];
    var value = attributeValues[name];
    if (value != null) {
      jstcache[name] = parse(value);
      if (jstmpl.MAPS_DEBUG) {
        jstcache.jstAttributeValues = jstcache.jstAttributeValues || {};
        jstcache.jstAttributeValues[name] = value;
      }
    }
  }

  jstid = jstmpl.STRING_empty + ++jstmpl.JstProcessor.jstid_;
  jstmpl.domSetAttribute(node, jstmpl.ATT_jstcache, jstid);
  jstmpl.JstProcessor.jstcache_[jstid] = jstcache;
  jstmpl.JstProcessor.jstcacheattributes_[attstring] = jstid;

  return node[jstmpl.PROP_jstcache] = jstcache;
};

/**
 * Runs the given function in our state machine.
 *
 * It's informative to view the set of all function calls as a tree:
 * - nodes are states
 * - edges are state transitions, implemented as calls to the pending
 *   functions in the stack.
 *   - pre-order function calls are downward edges (recursion into call).
 *   - post-order function calls are upward edges (return from call).
 * - leaves are nodes which do not recurse.
 * We represent the call tree as an array of array of calls, indexed as
 * stack[depth][index].  Here [depth] indexes into the call stack, and
 * [index] indexes into the call queue at that depth.  We require a call
 * queue so that a node may branch to more than one child
 * (which will be called serially), typically due to a loop structure.
 *
 * @param {Function} f The first function to run.
 */
jstmpl.JstProcessor.prototype.run_ = function(f) {
  var me = this;

  /**
   * A stack of queues of pre-order calls.
   * The inner arrays (constituent queues) are structured as
   * [ arg2, arg1, method, arg2, arg1, method, ...]
   * ie. a flattened array of methods with 2 arguments, in reverse order
   * for efficient push/pop.
   *
   * The outer array is a stack of such queues.
   *
   * @type Array.<Array>
   */
  var calls = me.calls_ = [];

  /**
   * The index into the queue for each depth. NOTE: Alternative would
   * be to maintain the queues in reverse order (popping off of the
   * end) but the repeated calls to .pop() consumed 90% of this
   * function's execution time.
   * @type Array.<number>
   */
  var queueIndices = me.queueIndices_ = [];

  /**
   * A pool of empty arrays.  Minimizes object allocation for IE6's benefit.
   * @type Array.<Array>
   */
  var arrayPool = me.arrayPool_ = [];

  f();
  var queue, queueIndex;
  var method, arg1, arg2;
  var temp;
  while (calls.length) {
    queue = calls[calls.length - 1];
    queueIndex = queueIndices[queueIndices.length - 1];
    if (queueIndex >= queue.length) {
      me.recycleArray_(calls.pop());
      queueIndices.pop();
      continue;
    }

    // Run the first function in the queue.
    method = queue[queueIndex++];
    arg1 = queue[queueIndex++];
    arg2 = queue[queueIndex++];
    queueIndices[queueIndices.length - 1] = queueIndex;
    method.call(me, arg1, arg2);
  }
};

/**
 * Pushes one or more functions onto the stack.  These will be run in sequence,
 * interspersed with any recursive calls that they make.
 *
 * This method takes ownership of the given array!
 *
 * @param {Array} args Array of method calls structured as
 *     [ method, arg1, arg2, method, arg1, arg2, ... ]
 */
jstmpl.JstProcessor.prototype.push_ = function(args) {
  this.calls_.push(args);
  this.queueIndices_.push(0);
};

/**
 * Enable/disable debugging.
 * @param {boolean} debugging New state
 */
jstmpl.JstProcessor.prototype.setDebugging = function(debugging) {
  if (jstmpl.MAPS_DEBUG) {
    this.debugging_ = debugging;
  }
};

jstmpl.JstProcessor.prototype.createArray_ = function() {
  if (this.arrayPool_.length) {
    return this.arrayPool_.pop();
  } else {
    return [];
  }
};

jstmpl.JstProcessor.prototype.recycleArray_ = function(array) {
  jstmpl.arrayClear(array);
  this.arrayPool_.push(array);
};

/**
 * Implements internals of jstProcess. This processes the two
 * attributes transclude and jsselect, which replace or multiply
 * elements, hence the name "outer". The remainder of the attributes
 * is processed in jstProcessInner_(), below. That function
 * jsProcessInner_() only processes attributes that affect an existing
 * node, but doesn't create or destroy nodes, hence the name
 * "inner". jstProcessInner_() is called through jstSelect_() if there
 * is a jsselect attribute (possibly for newly created clones of the
 * current template node), or directly from here if there is none.
 *
 * @param {jstmpl.JsEvalContext} context
 *
 * @param {Element} template
 */
jstmpl.JstProcessor.prototype.jstProcessOuter_ = function(context, template) {
  var me = this;

  var jstAttributes = me.jstAttributes_(template);
  if (jstmpl.MAPS_DEBUG && me.debugging_) {
    me.logState_('Outer', template, jstAttributes.jstAttributeValues);
  }

  var transclude = jstAttributes[jstmpl.ATT_transclude];
  if (transclude) {
    var tr = jstmpl.jstGetTemplate(transclude);
    if (tr) {
      jstmpl.domReplaceChild(tr, template);
      var call = me.createArray_();
      call.push(me.jstProcessOuter_, context, tr);
      me.push_(call);
    } else {
      jstmpl.domRemoveNode(template);
    }
    return;
  }

  var select = jstAttributes[jstmpl.ATT_select];
  if (select) {
    me.jstSelect_(context, template, select);
  } else {
    me.jstProcessInner_(context, template);
  }
};

/**
 * Implements internals of jstProcess. This processes all attributes
 * except transclude and jsselect. It is called either from
 * jstSelect_() for nodes that have a jsselect attribute so that the
 * jsselect attribute will not be processed again, or else directly
 * from jstProcessOuter_(). See the comment on jstProcessOuter_() for
 * an explanation of the name.
 *
 * @param {jstmpl.JsEvalContext} context
 *
 * @param {Element} template
 */
jstmpl.JstProcessor.prototype.jstProcessInner_ = function(context, template) {
  var me = this;

  var jstAttributes = me.jstAttributes_(template);
  if (jstmpl.MAPS_DEBUG && me.debugging_) {
    me.logState_('Inner', template, jstAttributes.jstAttributeValues);
  }

  // NOTE(mesch): See NOTE on jstmpl.ATT_content why this is a separate
  // attribute, and not a special value in jstmpl.ATT_values.
  var display = jstAttributes[jstmpl.ATT_display];
  if (display) {
    var shouldDisplay = context.jsexec(display, template);
    if (jstmpl.MAPS_DEBUG && me.debugging_) {
      me.logs_.push(jstmpl.ATT_display + ': ' + shouldDisplay + '<br/>');
    }
    if (!shouldDisplay) {
      jstmpl.displayNone(template);
      return;
    }
    jstmpl.displayDefault(template);
  }

  // NOTE(mesch): jsvars is evaluated before jsvalues, because it's
  // more useful to be able to use var values in attribute value
  // expressions than vice versa.
  var values = jstAttributes[jstmpl.ATT_vars];
  if (values) {
    me.jstVars_(context, template, values);
  }

  values = jstAttributes[jstmpl.ATT_values];
  if (values) {
    me.jstValues_(context, template, values);
  }

  // Evaluate expressions immediately. Useful for hooking callbacks
  // into jstemplates.
  //
  // NOTE(mesch): Evaluation order is sometimes significant, e.g. when
  // the expression evaluated in jseval relies on the values set in
  // jsvalues, so it needs to be evaluated *after*
  // jsvalues. TODO(mesch): This is quite arbitrary, it would be
  // better if this would have more necessity to it.
  var expressions = jstAttributes[jstmpl.ATT_eval];
  if (expressions) {
    for (var i = 0, I = jstmpl.jsLength(expressions); i < I; ++i) {
      context.jsexec(expressions[i], template);
    }
  }

  var skip = jstAttributes[jstmpl.ATT_skip];
  if (skip) {
    var shouldSkip = context.jsexec(skip, template);
    if (jstmpl.MAPS_DEBUG && me.debugging_) {
      me.logs_.push(jstmpl.ATT_skip + ': ' + shouldSkip + '<br/>');
    }
    if (shouldSkip) return;
  }

  // NOTE(mesch): content is a separate attribute, instead of just a
  // special value mentioned in values, for two reasons: (1) it is
  // fairly common to have only mapped content, and writing
  // content="expr" is shorter than writing values="content:expr", and
  // (2) the presence of content actually terminates traversal, and we
  // need to check for that. Display is a separate attribute for a
  // reason similar to the second, in that its presence *may*
  // terminate traversal.
  var content = jstAttributes[jstmpl.ATT_content];
  if (content) {
    me.jstContent_(context, template, content);

  } else {
    // Newly generated children should be ignored, so we explicitly
    // store the children to be processed.
    var queue = me.createArray_();
    for (var c = template.firstChild; c; c = c.nextSibling) {
      if (c.nodeType == jstmpl.DOM_ELEMENT_NODE) {
        queue.push(me.jstProcessOuter_, context, c);
      }
    }
    if (queue.length) me.push_(queue);
  }
};

/**
 * Implements the jsselect attribute: evalutes the value of the
 * jsselect attribute in the current context, with the current
 * variable bindings (see jstmpl.JsEvalContext.jseval()). If the value is an
 * array, the current template node is multiplied once for every
 * element in the array, with the array element being the context
 * object. If the array is empty, or the value is undefined, then the
 * current template node is dropped. If the value is not an array,
 * then it is just made the context object.
 *
 * @param {jstmpl.JsEvalContext} context The current evaluation context.
 *
 * @param {Element} template The currently processed node of the template.
 *
 * @param {Function} select The javascript expression to evaluate.
 *
 * @notypecheck FIXME(hmitchell): See OCL6434950. instance and value need
 * type checks.
 */
jstmpl.JstProcessor.prototype.jstSelect_ = function(context, template, select) {
  var me = this;

  var value = context.jsexec(select, template);

  // Enable reprocessing: if this template is reprocessed, then only
  // fill the section instance here. Otherwise do the cardinal
  // processing of a new template.
  var instance = jstmpl.domGetAttribute(template, jstmpl.ATT_instance);

  var instanceLast = false;
  if (instance) {
    if (instance.charAt(0) == jstmpl.CHAR_asterisk) {
      instance = jstmpl.parseInt10(instance.substr(1));
      instanceLast = true;
    } else {
      instance = jstmpl.parseInt10(/** @type string */(instance));
    }
  }

  // The expression value instanceof Array is occasionally false for
  // arrays, seen in Firefox. Thus we recognize an array as an object
  // which is not null that has a length property. Notice that this
  // also matches input data with a length property, so this property
  // name should be avoided in input data.
  var multiple = jstmpl.isArray(value);
  var count = multiple ? jstmpl.jsLength(value) : 1;
  var multipleEmpty = (multiple && count == 0);

  if (multiple) {
    if (multipleEmpty) {
      // For an empty array, keep the first template instance and mark
      // it last. Remove all other template instances.
      if (!instance) {
        jstmpl.domSetAttribute(template, jstmpl.ATT_instance, jstmpl.STRING_asteriskzero);
        jstmpl.displayNone(template);
      } else {
        jstmpl.domRemoveNode(template);
      }

    } else {
      jstmpl.displayDefault(template);
      // For a non empty array, create as many template instances as
      // are needed. If the template is first processed, as many
      // template instances are needed as there are values in the
      // array. If the template is reprocessed, new template instances
      // are only needed if there are more array values than template
      // instances. Those additional instances are created by
      // replicating the last template instance.
      //
      // When the template is first processed, there is no jsinstance
      // attribute. This is indicated by instance === null, except in
      // opera it is instance === "". Notice also that the === is
      // essential, because 0 == "", presumably via type coercion to
      // boolean.
      if (instance === null || instance === jstmpl.STRING_empty ||
          (instanceLast && instance < count - 1)) {
        // A queue of calls to push.
        var queue = me.createArray_();

        var instancesStart = instance || 0;
        var i, I, clone;
        for (i = instancesStart, I = count - 1; i < I; ++i) {
          var node = jstmpl.domCloneNode(template);
          jstmpl.domInsertBefore(node, template);

          jstmpl.jstSetInstance(/** @type Element */(node), value, i);
          clone = context.clone(value[i], i, count);

          queue.push(me.jstProcessInner_, clone, node,
                     jstmpl.JsEvalContext.recycle, clone, null);

        }
        // Push the originally present template instance last to keep
        // the order aligned with the DOM order, because the newly
        // created template instances are inserted *before* the
        // original instance.
        jstmpl.jstSetInstance(template, value, i);
        clone = context.clone(value[i], i, count);
        queue.push(me.jstProcessInner_, clone, template,
                   jstmpl.JsEvalContext.recycle, clone, null);
        me.push_(queue);
      } else if (instance < count) {
        var v = value[instance];

        jstmpl.jstSetInstance(template, value, instance);
        var clone = context.clone(v, instance, count);
        var queue = me.createArray_();
        queue.push(me.jstProcessInner_, clone, template,
                   jstmpl.JsEvalContext.recycle, clone, null);
        me.push_(queue);
      } else {
        jstmpl.domRemoveNode(template);
      }
    }
  } else {
    if (value == null) {
      jstmpl.displayNone(template);
    } else {
      jstmpl.displayDefault(template);
      var clone = context.clone(value, 0, 1);
      var queue = me.createArray_();
      queue.push(me.jstProcessInner_, clone, template,
                 jstmpl.JsEvalContext.recycle, clone, null);
      me.push_(queue);
    }
  }
};

/**
 * Implements the jsvars attribute: evaluates each of the values and
 * assigns them to variables in the current context. Similar to
 * jsvalues, except that all values are treated as vars, independent
 * of their names.
 *
 * @param {jstmpl.JsEvalContext} context Current evaluation context.
 *
 * @param {Element} template Currently processed template node.
 *
 * @param {Array} values Processed value of the jsvalues attribute: a
 * flattened array of pairs. The second element in the pair is a
 * function that can be passed to jsexec() for evaluation in the
 * current jscontext, and the first element is the variable name that
 * the value returned by jsexec is assigned to.
 */
jstmpl.JstProcessor.prototype.jstVars_ = function(context, template, values) {
  for (var i = 0, I = jstmpl.jsLength(values); i < I; i += 2) {
    var label = values[i];
    var value = context.jsexec(values[i+1], template);
    context.setVariable(label, value);
  }
};

/**
 * Implements the jsvalues attribute: evaluates each of the values and
 * assigns them to variables in the current context (if the name
 * starts with '$', javascript properties of the current template node
 * (if the name starts with '.'), or DOM attributes of the current
 * template node (otherwise). Since DOM attribute values are always
 * strings, the value is coerced to string in the latter case,
 * otherwise it's the uncoerced javascript value.
 *
 * @param {jstmpl.JsEvalContext} context Current evaluation context.
 *
 * @param {Element} template Currently processed template node.
 *
 * @param {Array} values Processed value of the jsvalues attribute: a
 * flattened array of pairs. The second element in the pair is a
 * function that can be passed to jsexec() for evaluation in the
 * current jscontext, and the first element is the label that
 * determines where the value returned by jsexec is assigned to.
 */
jstmpl.JstProcessor.prototype.jstValues_ = function(context, template, values) {
  for (var i = 0, I = jstmpl.jsLength(values); i < I; i += 2) {
    var label = values[i];
    var value = context.jsexec(values[i+1], template);

    if (label.charAt(0) == jstmpl.CHAR_dollar) {
      // A jsvalues entry whose name starts with $ sets a local
      // variable.
      context.setVariable(label, value);

    } else if (label.charAt(0) == jstmpl.CHAR_period) {
      // A jsvalues entry whose name starts with . sets a property of
      // the current template node. The name may have further dot
      // separated components, which are translated into namespace
      // objects. This specifically allows to set properties on .style
      // using jsvalues. NOTE(mesch): Setting the style attribute has
      // no effect in IE and hence should not be done anyway.
      var nameSpaceLabel = label.substr(1).split(jstmpl.CHAR_period);
      var nameSpaceObject = template;
      var nameSpaceDepth = jstmpl.jsLength(nameSpaceLabel);
      for (var j = 0, J = nameSpaceDepth - 1; j < J; ++j) {
        var jLabel = nameSpaceLabel[j];
        if (!nameSpaceObject[jLabel]) {
          nameSpaceObject[jLabel] = {};
        }
        nameSpaceObject = nameSpaceObject[jLabel];
      }
      nameSpaceObject[nameSpaceLabel[nameSpaceDepth - 1]] = value;

    } else if (label) {
      // Any other jsvalues entry sets an attribute of the current
      // template node.
      if (typeof value == jstmpl.TYPE_boolean) {
        // Handle boolean values that are set as attributes specially,
        // according to the XML/HTML convention.
        if (value) {
          jstmpl.domSetAttribute(template, label, label);
        } else {
          jstmpl.domRemoveAttribute(template, label);
        }
      } else {
        jstmpl.domSetAttribute(template, label, jstmpl.STRING_empty + value);
      }
    }
  }
};

/**
 * Implements the jscontent attribute. Evalutes the expression in
 * jscontent in the current context and with the current variables,
 * and assigns its string value to the content of the current template
 * node.
 *
 * @param {jstmpl.JsEvalContext} context Current evaluation context.
 *
 * @param {Element} template Currently processed template node.
 *
 * @param {Function} content Processed value of the jscontent
 * attribute.
 */
jstmpl.JstProcessor.prototype.jstContent_ = function(context, template, content) {
  // NOTE(mesch): Profiling shows that this method costs significant
  // time. In jstemplate_perf.html, it's about 50%. I tried to replace
  // by HTML escaping and assignment to innerHTML, but that was even
  // slower.
  var value = jstmpl.STRING_empty + context.jsexec(content, template);
  // Prevent flicker when refreshing a template and the value doesn't
  // change.
  if (template.innerHTML == value) {
    return;
  }
  while (template.firstChild) {
    jstmpl.domRemoveNode(template.firstChild);
  }
  var t = jstmpl.domCreateTextNode(this.document_, value);
  jstmpl.domAppendChild(template, t);
};

/**
 * Caches access to and parsing of template processing attributes. If
 * jstmpl.domGetAttribute() is called every time a template attribute value
 * is used, it takes more than 10% of the time.
 *
 * @param {Element} template A DOM element node of the template.
 *
 * @return {Object} A javascript object that has all js template
 * processing attribute values of the node as properties.
 */
jstmpl.JstProcessor.prototype.jstAttributes_ = function(template) {
  if (template[jstmpl.PROP_jstcache]) {
    return template[jstmpl.PROP_jstcache];
  }

  var jstid = jstmpl.domGetAttribute(template, jstmpl.ATT_jstcache);
  if (jstid) {
    return template[jstmpl.PROP_jstcache] = jstmpl.JstProcessor.jstcache_[jstid];
  }

  return jstmpl.JstProcessor.prepareNode_(template);
};

/**
 * Log the current state.
 * @param {string} caller An identifier for the caller of .log_.
 * @param {Element} template The template node being processed.
 * @param {Object} jstAttributeValues The jst attributes of the template node.
 */
jstmpl.JstProcessor.prototype.logState_ = function(
    caller, template, jstAttributeValues) {
  if (jstmpl.MAPS_DEBUG) {
    var msg = '<table>';
    msg += '<caption>' + caller + '</caption>';
    msg += '<tbody>';
    if (template.id) {
      msg += '<tr><td>' + 'id:' + '</td><td>' + template.id + '</td></tr>';
    }
    if (template.name) {
      msg += '<tr><td>' + 'name:' + '</td><td>' + template.name + '</td></tr>';
    }
    if (jstAttributeValues) {
      msg += '<tr><td>' + 'attr:' +
      '</td><td>' + jsToSource(jstAttributeValues) + '</td></tr>';
    }
    msg += '</tbody></table><br/>';
    this.logs_.push(msg);
  }
};

/**
 * Retrieve the processing logs.
 * @return {Array.<string>} The processing logs.
 */
jstmpl.JstProcessor.prototype.getLogs = function() {
  return this.logs_;
};