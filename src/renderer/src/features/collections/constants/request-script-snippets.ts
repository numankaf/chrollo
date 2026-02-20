export const SNIPPET_CATEGORY = {
  GLOBAL: 'Global',
  ENVIRONMENT: 'Environment',
  LOCAL: 'Local',
  FAKER: 'Faker',
  TEST: 'Test',
} as const;

export type SnippetCategory = (typeof SNIPPET_CATEGORY)[keyof typeof SNIPPET_CATEGORY];

export const SNIPPET_SCOPE = {
  PRE_REQUEST: 'pre-request',
  POST_RESPONSE: 'post-response',
} as const;

export type SnippetScope = (typeof SNIPPET_SCOPE)[keyof typeof SNIPPET_SCOPE];

export interface Snippet {
  id: string;
  title: string;
  code: string;
  category: SnippetCategory;
  scope?: SnippetScope;
}

export const SNIPPET_CATEGORIES: SnippetCategory[] = [
  SNIPPET_CATEGORY.TEST,
  SNIPPET_CATEGORY.FAKER,
  SNIPPET_CATEGORY.GLOBAL,
  SNIPPET_CATEGORY.ENVIRONMENT,
  SNIPPET_CATEGORY.LOCAL,
];

export const REQUEST_SCRIPT_SNIPPETS: Snippet[] = [
  // ── Global ─────────────────────────────────────────────────────────────────
  {
    id: 'globals-get',
    title: 'Get a global variable',
    code: "const value = chrollo.variables.globals.get('variable_key');",
    category: SNIPPET_CATEGORY.GLOBAL,
  },
  {
    id: 'globals-set',
    title: 'Set a global variable',
    code: "chrollo.variables.globals.set('variable_key', 'variable_value');",
    category: SNIPPET_CATEGORY.GLOBAL,
  },
  {
    id: 'globals-clear',
    title: 'Clear a global variable',
    code: "chrollo.variables.globals.unset('variable_key');",
    category: SNIPPET_CATEGORY.GLOBAL,
  },

  // ── Environment ────────────────────────────────────────────────────────────
  {
    id: 'env-get',
    title: 'Get an environment variable',
    code: "const value = chrollo.variables.environment.get('variable_key');",
    category: SNIPPET_CATEGORY.ENVIRONMENT,
  },
  {
    id: 'env-set',
    title: 'Set an environment variable',
    code: "chrollo.variables.environment.set('variable_key', 'variable_value');",
    category: SNIPPET_CATEGORY.ENVIRONMENT,
  },
  {
    id: 'env-clear',
    title: 'Clear an environment variable',
    code: "chrollo.variables.environment.unset('variable_key');",
    category: SNIPPET_CATEGORY.ENVIRONMENT,
  },

  // ── Local ──────────────────────────────────────────────────────────────────
  {
    id: 'local-get',
    title: 'Get a local variable',
    code: "const value = chrollo.variables.local.get('variable_key');",
    category: SNIPPET_CATEGORY.LOCAL,
  },
  {
    id: 'local-set',
    title: 'Set a local variable',
    code: "chrollo.variables.local.set('variable_key', 'variable_value');",
    category: SNIPPET_CATEGORY.LOCAL,
  },
  {
    id: 'local-clear',
    title: 'Clear a local variable',
    code: "chrollo.variables.local.unset('variable_key');",
    category: SNIPPET_CATEGORY.LOCAL,
  },

  // ── Faker (pre-request only) ───────────────────────────────────────────────
  {
    id: 'faker-uuid',
    title: 'Random UUID',
    code: 'const id = chrollo.faker.string.uuid();',
    category: SNIPPET_CATEGORY.FAKER,
    scope: SNIPPET_SCOPE.PRE_REQUEST,
  },
  {
    id: 'faker-string',
    title: 'Random string',
    code: 'const str = chrollo.faker.string.sample();',
    category: SNIPPET_CATEGORY.FAKER,
    scope: SNIPPET_SCOPE.PRE_REQUEST,
  },
  {
    id: 'faker-int',
    title: 'Random integer',
    code: 'const n = chrollo.faker.number.int();',
    category: SNIPPET_CATEGORY.FAKER,
    scope: SNIPPET_SCOPE.PRE_REQUEST,
  },
  {
    id: 'faker-float',
    title: 'Random float',
    code: 'const n = chrollo.faker.number.float();',
    category: SNIPPET_CATEGORY.FAKER,
    scope: SNIPPET_SCOPE.PRE_REQUEST,
  },
  {
    id: 'faker-boolean',
    title: 'Random boolean',
    code: 'const bool = chrollo.faker.datatype.boolean();',
    category: SNIPPET_CATEGORY.FAKER,
    scope: SNIPPET_SCOPE.PRE_REQUEST,
  },
  {
    id: 'faker-date-past',
    title: 'Random past date',
    code: 'const date = chrollo.faker.date.past().toISOString();',
    category: SNIPPET_CATEGORY.FAKER,
    scope: SNIPPET_SCOPE.PRE_REQUEST,
  },
  {
    id: 'faker-date-future',
    title: 'Random future date',
    code: 'const date = chrollo.faker.date.future().toISOString();',
    category: SNIPPET_CATEGORY.FAKER,
    scope: SNIPPET_SCOPE.PRE_REQUEST,
  },
  {
    id: 'faker-fullname',
    title: 'Random full name',
    code: 'const fullName = chrollo.faker.person.fullName();',
    category: SNIPPET_CATEGORY.FAKER,
    scope: SNIPPET_SCOPE.PRE_REQUEST,
  },
  {
    id: 'faker-email',
    title: 'Random email',
    code: 'const email = chrollo.faker.internet.email();',
    category: SNIPPET_CATEGORY.FAKER,
    scope: SNIPPET_SCOPE.PRE_REQUEST,
  },
  {
    id: 'faker-enum',
    title: 'Random enum value',
    code: "const status = chrollo.faker.helpers.arrayElement(['ACTIVE', 'INACTIVE', 'PENDING']);",
    category: SNIPPET_CATEGORY.FAKER,
    scope: SNIPPET_SCOPE.PRE_REQUEST,
  },

  // ── Test (post-response only) ──────────────────────────────────────────────
  {
    id: 'test-response-has-data',
    title: 'Response has data',
    code: `chrollo.test('Response has data', () => {
  chrollo.expect(chrollo.response.data).to.not.be.null;
});`,
    category: SNIPPET_CATEGORY.TEST,
    scope: SNIPPET_SCOPE.POST_RESPONSE,
  },
  {
    id: 'test-response-body-contains',
    title: 'Response body contains string',
    code: `chrollo.test('Response body contains string', () => {
  const body = chrollo.response.data.raw();
  chrollo.expect(body).to.include('expected_string');
});`,
    category: SNIPPET_CATEGORY.TEST,
    scope: SNIPPET_SCOPE.POST_RESPONSE,
  },
  {
    id: 'test-response-body-json-value',
    title: 'Response body JSON value check',
    code: `chrollo.test('Response body JSON value check', () => {
  const data = chrollo.response.data.json();
  chrollo.expect(data.property_name).to.equal('expected_value');
});`,
    category: SNIPPET_CATEGORY.TEST,
    scope: SNIPPET_SCOPE.POST_RESPONSE,
  },
  {
    id: 'test-response-body-has-property',
    title: 'Response body has property',
    code: `chrollo.test('Response body has property', () => {
  const data = chrollo.response.data.json();
  chrollo.expect(data).to.have.property('property_name');
});`,
    category: SNIPPET_CATEGORY.TEST,
    scope: SNIPPET_SCOPE.POST_RESPONSE,
  },
  {
    id: 'test-response-time',
    title: 'Response time is less than 200ms',
    code: `chrollo.test('Response time is less than 200ms', () => {
  chrollo.expect(chrollo.response.responseTime).to.be.below(200);
});`,
    category: SNIPPET_CATEGORY.TEST,
    scope: SNIPPET_SCOPE.POST_RESPONSE,
  },
  {
    id: 'test-response-header',
    title: 'Response header check',
    code: `chrollo.test('Response header check', () => {
  const headers = chrollo.response.meta.headers;
  chrollo.expect(headers).to.have.property('header_name', 'expected_value');
});`,
    category: SNIPPET_CATEGORY.TEST,
    scope: SNIPPET_SCOPE.POST_RESPONSE,
  },
];
