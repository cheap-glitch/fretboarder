
/**
 * modules/xml.js
 */

export default
{
	/**
	 * Append an opening and closing tag surrounding a value
	 */
	openClose(_xml, _tag, _val, _attrs)
	{
		this.open(_xml, _tag, _attrs);
		_xml.push(_val);
		this.close(_xml, _tag);
	},

	/**
	 * Append an closing/opening/self-closing tag
	 */
	close(_xml, _tag)        { _xml.push(`</${_tag}>`)                            },
	open(_xml, _tag, _attrs) { _xml.push(`<${_tag}${this.attrsToStr(_attrs)}>`)   },
	tag(_xml, _tag, _attrs)  { _xml.push(`<${_tag}${this.attrsToStr(_attrs)} />`) },

	/**
	 * Join a collection of attributes with their value into a string (discards undefined attributes in the process)
	 */
	attrsToStr(_attrs)
	{
		return Object.keys(_attrs).reduce((__result, __attr) => (_attrs[__attr] ? `${__result} ${__attr}="${_attrs[__attr]}"` : __result), '');
	}
}
