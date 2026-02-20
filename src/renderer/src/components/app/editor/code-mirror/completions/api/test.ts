// Chai BDD assertion chain completions for chrollo.expect(value).<cursor>
// All language-chain words, modifier flags, assertion getters, and assertion methods.
// Ref: https://www.chaijs.com/api/bdd/

export const EXPECT_CHAIN_API = [
  // ── Language chains (readability only, no assertion) ──────────────────────
  { label: 'to', type: 'keyword', info: 'Language chain — no assertion, for readability' },
  { label: 'be', type: 'keyword', info: 'Language chain — no assertion, for readability' },
  { label: 'been', type: 'keyword', info: 'Language chain — no assertion, for readability' },
  { label: 'is', type: 'keyword', info: 'Language chain — no assertion, for readability' },
  { label: 'that', type: 'keyword', info: 'Language chain — no assertion, for readability' },
  { label: 'which', type: 'keyword', info: 'Language chain — no assertion, for readability' },
  { label: 'and', type: 'keyword', info: 'Language chain — no assertion, for readability' },
  { label: 'has', type: 'keyword', info: 'Language chain — no assertion, for readability' },
  { label: 'have', type: 'keyword', info: 'Language chain — no assertion, for readability' },
  { label: 'with', type: 'keyword', info: 'Language chain — no assertion, for readability' },
  { label: 'at', type: 'keyword', info: 'Language chain — no assertion; also used in .at.least() / .at.most()' },
  { label: 'of', type: 'keyword', info: 'Language chain — no assertion, for readability' },
  { label: 'same', type: 'keyword', info: 'Language chain — no assertion, for readability' },
  { label: 'but', type: 'keyword', info: 'Language chain — no assertion, for readability' },
  { label: 'does', type: 'keyword', info: 'Language chain — no assertion, for readability' },
  { label: 'still', type: 'keyword', info: 'Language chain — no assertion, for readability' },
  { label: 'also', type: 'keyword', info: 'Language chain — no assertion, for readability' },

  // ── Modifier flags (change behaviour of following assertions) ─────────────
  { label: 'not', type: 'keyword', info: 'Negates the assertion that follows — .not.equal(), .not.include(), etc.' },
  {
    label: 'deep',
    type: 'keyword',
    info: 'Deep equality mode — use before .equal(), .include(), .property(), .members()',
  },
  { label: 'nested', type: 'keyword', info: 'Enables dot/bracket-notation paths in .property() and .include()' },
  { label: 'own', type: 'keyword', info: 'Restricts .property() and .include() to own (non-inherited) properties' },
  { label: 'ordered', type: 'keyword', info: 'Requires .members() to match in order' },
  { label: 'any', type: 'keyword', info: 'At least one key must satisfy .keys() — opposite of .all' },
  { label: 'all', type: 'keyword', info: 'All keys must satisfy .keys() (default behaviour)' },

  // ── Assertion getters (terminate the assertion without arguments) ──────────
  { label: 'ok', type: 'keyword', info: 'Assert value is truthy' },
  { label: 'true', type: 'keyword', info: 'Assert value is strictly === true' },
  { label: 'false', type: 'keyword', info: 'Assert value is strictly === false' },
  { label: 'null', type: 'keyword', info: 'Assert value is null' },
  { label: 'undefined', type: 'keyword', info: 'Assert value is undefined' },
  { label: 'exist', type: 'keyword', info: 'Assert value is not null and not undefined' },
  { label: 'empty', type: 'keyword', info: 'Assert string/array/object/Map/Set has length/size 0' },
  { label: 'arguments', type: 'keyword', info: 'Assert value is an arguments object' },
  { label: 'NaN', type: 'keyword', info: 'Assert value is NaN' },

  // ── Core assertion methods ─────────────────────────────────────────────────
  {
    label: 'equal',
    type: 'function',
    info: '(val, msg?) — strict equality (===); use .deep.equal() for deep equality',
  },
  {
    label: 'eql',
    type: 'function',
    info: '(val, msg?) — deep equality (recursive); alias: .eqls()',
  },
  {
    label: 'include',
    type: 'function',
    info: '(val, msg?) — string includes substr; array contains item; object has subset; aliases: .includes() .contain() .contains()',
  },
  {
    label: 'property',
    type: 'function',
    info: '(name, val?, msg?) — assert has property, optionally with value; combine with .deep / .nested / .own',
  },
  {
    label: 'a',
    type: 'function',
    info: '(type, msg?) — assert typeof === type or instanceof; e.g. .a("string"), .a("number"), .a(Array)',
  },
  {
    label: 'an',
    type: 'function',
    info: '(type, msg?) — alias for .a()',
  },
  {
    label: 'lengthOf',
    type: 'function',
    info: '(n, msg?) — assert array/string .length === n',
  },
  {
    label: 'match',
    type: 'function',
    info: '(regexp, msg?) — assert string matches RegExp',
  },
  {
    label: 'keys',
    type: 'function',
    info: '(...keys | [keys] | {keys}) — assert object has exactly these keys; combine with .any / .all / .have / .contain',
  },
  {
    label: 'throw',
    type: 'function',
    info: '(errorLike?, errMsgMatcher?, msg?) — assert function throws; optionally match error type or message',
  },
  {
    label: 'oneOf',
    type: 'function',
    info: '(list, msg?) — assert value is in list (===)',
  },
  {
    label: 'satisfy',
    type: 'function',
    info: '(fn, msg?) — assert fn(value) returns truthy; custom assertion predicate',
  },
  {
    label: 'members',
    type: 'function',
    info: '(set, msg?) — assert array has same members as set; use .ordered for order-sensitive check',
  },

  // ── Numeric range assertions ───────────────────────────────────────────────
  {
    label: 'above',
    type: 'function',
    info: '(n, msg?) — assert value > n; aliases: .gt() .greaterThan()',
  },
  {
    label: 'below',
    type: 'function',
    info: '(n, msg?) — assert value < n; aliases: .lt() .lessThan()',
  },
  {
    label: 'least',
    type: 'function',
    info: '(n, msg?) — assert value >= n; use as .at.least(n); aliases: .gte() .greaterThanOrEqual()',
  },
  {
    label: 'most',
    type: 'function',
    info: '(n, msg?) — assert value <= n; use as .at.most(n); aliases: .lte() .lessThanOrEqual()',
  },
  {
    label: 'within',
    type: 'function',
    info: '(start, finish, msg?) — assert start <= value <= finish',
  },
  {
    label: 'closeTo',
    type: 'function',
    info: '(expected, delta, msg?) — assert |value - expected| <= delta; alias: .approximately()',
  },

  // ── Object / prototype assertions ─────────────────────────────────────────
  {
    label: 'ownProperty',
    type: 'function',
    info: '(name, msg?) — assert value has own (non-inherited) property; aliases: .haveOwnProperty()',
  },
  {
    label: 'ownPropertyDescriptor',
    type: 'function',
    info: '(name, descriptor?, msg?) — assert own property descriptor; alias: .haveOwnPropertyDescriptor()',
  },
  {
    label: 'instanceOf',
    type: 'function',
    info: '(constructor, msg?) — assert value instanceof constructor; alias: .instanceof()',
  },
  {
    label: 'respondTo',
    type: 'function',
    info: '(method, msg?) — assert object (or its prototype) has a method; alias: .respondsTo()',
  },

  // ── String assertion ──────────────────────────────────────────────────────
  {
    label: 'string',
    type: 'function',
    info: '(str, msg?) — assert string includes substr (identical to .include() for strings)',
  },

  // ── Function side-effect assertions ───────────────────────────────────────
  {
    label: 'change',
    type: 'function',
    info: '(obj, prop?, msg?) — assert calling fn changes obj[prop]; alias: .changes()',
  },
  {
    label: 'increase',
    type: 'function',
    info: '(obj, prop?, msg?) — assert calling fn increases obj[prop]; alias: .increases()',
  },
  {
    label: 'decrease',
    type: 'function',
    info: '(obj, prop?, msg?) — assert calling fn decreases obj[prop]; alias: .decreases()',
  },
  {
    label: 'by',
    type: 'function',
    info: '(delta, msg?) — chain after .increase() / .decrease() to assert the exact change amount',
  },

  // ── Aliases ────────────────────────────────────────────────────────────────
  { label: 'equals', type: 'function', info: '(val, msg?) — alias for .equal()' },
  { label: 'eq', type: 'function', info: '(val, msg?) — alias for .equal()' },
  { label: 'eqls', type: 'function', info: '(val, msg?) — alias for .eql()' },
  { label: 'includes', type: 'function', info: '(val, msg?) — alias for .include()' },
  { label: 'contain', type: 'function', info: '(val, msg?) — alias for .include()' },
  { label: 'contains', type: 'function', info: '(val, msg?) — alias for .include()' },
  { label: 'gt', type: 'function', info: '(n, msg?) — alias for .above()' },
  { label: 'greaterThan', type: 'function', info: '(n, msg?) — alias for .above()' },
  { label: 'lt', type: 'function', info: '(n, msg?) — alias for .below()' },
  { label: 'lessThan', type: 'function', info: '(n, msg?) — alias for .below()' },
  { label: 'gte', type: 'function', info: '(n, msg?) — alias for .least()' },
  { label: 'greaterThanOrEqual', type: 'function', info: '(n, msg?) — alias for .least()' },
  { label: 'lte', type: 'function', info: '(n, msg?) — alias for .most()' },
  { label: 'lessThanOrEqual', type: 'function', info: '(n, msg?) — alias for .most()' },
  { label: 'approximately', type: 'function', info: '(expected, delta, msg?) — alias for .closeTo()' },
  { label: 'throws', type: 'function', info: '(errorLike?, errMsgMatcher?, msg?) — alias for .throw()' },
  { label: 'Throw', type: 'function', info: '(errorLike?, errMsgMatcher?, msg?) — alias for .throw()' },
  { label: 'respondsTo', type: 'function', info: '(method, msg?) — alias for .respondTo()' },
  { label: 'satisfies', type: 'function', info: '(fn, msg?) — alias for .satisfy()' },
  { label: 'instanceof', type: 'function', info: '(constructor, msg?) — alias for .instanceOf()' },
  { label: 'haveOwnProperty', type: 'function', info: '(name, msg?) — alias for .ownProperty()' },
  {
    label: 'haveOwnPropertyDescriptor',
    type: 'function',
    info: '(name, descriptor?, msg?) — alias for .ownPropertyDescriptor()',
  },
  {
    label: 'length',
    type: 'function',
    info: '(n, msg?) — alias for .lengthOf(); note: also chainable getter (.length.above(3))',
  },
  { label: 'matches', type: 'function', info: '(regexp, msg?) — alias for .match()' },
  { label: 'key', type: 'function', info: '(...keys) — alias for .keys()' },
  { label: 'changes', type: 'function', info: '(obj, prop?, msg?) — alias for .change()' },
  { label: 'increases', type: 'function', info: '(obj, prop?, msg?) — alias for .increase()' },
  { label: 'decreases', type: 'function', info: '(obj, prop?, msg?) — alias for .decrease()' },
];
