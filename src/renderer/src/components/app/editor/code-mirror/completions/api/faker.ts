export const FAKER_MODULES = [
  { label: 'person', type: 'class', info: 'Person generation' },
  { label: 'internet', type: 'class', info: 'Internet/Network related generation' },
  { label: 'location', type: 'class', info: 'Location and address generation' },
  { label: 'phone', type: 'class', info: 'Phone number generation' },
  { label: 'book', type: 'class', info: 'Book generation' },
  { label: 'lorem', type: 'class', info: 'Lorem ipsum text generation' },
  { label: 'image', type: 'class', info: 'Image generation' },
  { label: 'date', type: 'class', info: 'Date and time generation' },
  { label: 'commerce', type: 'class', info: 'Commerce and product generation' },
  { label: 'company', type: 'class', info: 'Company generation' },
  { label: 'number', type: 'class', info: 'Number generation' },
  { label: 'string', type: 'class', info: 'String generation' },
  { label: 'datatype', type: 'class', info: 'DataType generation' },
  { label: 'finance', type: 'class', info: 'Finance generation' },
  { label: 'vehicle', type: 'class', info: 'Vehicle generation' },
  { label: 'music', type: 'class', info: 'Music generation' },
  { label: 'system', type: 'class', info: 'System generation' },
  { label: 'git', type: 'class', info: 'Git generation' },
  { label: 'hacker', type: 'class', info: 'Hacker generation' },
  { label: 'animal', type: 'class', info: 'Animal generation' },
  { label: 'database', type: 'class', info: 'Database generation' },
  { label: 'science', type: 'class', info: 'Science generation' },
  { label: 'airline', type: 'class', info: 'Airline generation' },
  { label: 'color', type: 'class', info: 'Color generation' },
  { label: 'food', type: 'class', info: 'Food generation' },
  { label: 'helpers', type: 'class', info: 'Helper functions' },
];

export const FAKER_METHODS: Record<string, { label: string; type: string; info: string }[]> = {
  person: [
    {
      label: 'bio',
      type: 'function',
      info: '() => string — random short biography',
    },
    {
      label: 'firstName',
      type: 'function',
      info: '(sex?: "female" | "male") => string — random first name',
    },
    {
      label: 'middleName',
      type: 'function',
      info: '(sex?: "female" | "male") => string — random middle name',
    },
    {
      label: 'lastName',
      type: 'function',
      info: '(sex?: "female" | "male") => string — random last name',
    },
    {
      label: 'fullName',
      type: 'function',
      info: '(options?: { firstName?: string; lastName?: string; sex?: "female" | "male"; }) => string — random full name',
    },
    {
      label: 'gender',
      type: 'function',
      info: '() => string — random gender',
    },
    {
      label: 'sex',
      type: 'function',
      info: '() => string — random sex (not intended for parameter use)',
    },
    {
      label: 'sexType',
      type: 'function',
      info: '() => "female" | "male" — random sex type for parameter use',
    },
    {
      label: 'prefix',
      type: 'function',
      info: '(sex?: "female" | "male") => string — random prefix',
    },
    {
      label: 'suffix',
      type: 'function',
      info: '() => string — random suffix',
    },
    {
      label: 'jobTitle',
      type: 'function',
      info: '() => string — random job title',
    },
    {
      label: 'jobDescriptor',
      type: 'function',
      info: '() => string — random job descriptor',
    },
    {
      label: 'jobArea',
      type: 'function',
      info: '() => string — random job area',
    },
    {
      label: 'jobType',
      type: 'function',
      info: '() => string — random job type',
    },
    {
      label: 'zodiacSign',
      type: 'function',
      info: '() => string — random zodiac sign',
    },
  ],

  internet: [
    {
      label: 'displayName',
      type: 'function',
      info: '(options?: { firstName?: string; lastName?: string; }) => string — random Unicode display name',
    },
    {
      label: 'userName',
      type: 'function',
      info: '(options?: { firstName?: string; lastName?: string; }) => string — random ASCII username',
    },
    {
      label: 'domainName',
      type: 'function',
      info: '() => string — random domain name (e.g., slow-timer.info)',
    },
    {
      label: 'domainSuffix',
      type: 'function',
      info: '() => string — random domain suffix (e.g., com, net)',
    },
    {
      label: 'domainWord',
      type: 'function',
      info: '() => string — random domain word',
    },
    {
      label: 'email',
      type: 'function',
      info: '(options?: { firstName?: string; lastName?: string; provider?: string; allowSpecialCharacters?: boolean; }) => string — random email address',
    },
    {
      label: 'exampleEmail',
      type: 'function',
      info: '(options?: { firstName?: string; lastName?: string; allowSpecialCharacters?: boolean; }) => string — example email (example.com/net)',
    },
    {
      label: 'emoji',
      type: 'function',
      info: '(options?: { types?: string[]; }) => string — random emoji string',
    },
    {
      label: 'httpMethod',
      type: 'function',
      info: '() => "GET" | "POST" | "PUT" | "DELETE" | "PATCH" — random HTTP method',
    },
    {
      label: 'httpStatusCode',
      type: 'function',
      info: '(options?: { types?: string[]; }) => number — random HTTP status code',
    },
    {
      label: 'ip',
      type: 'function',
      info: '() => string — random IPv4 or IPv6 address',
    },
    {
      label: 'ipv4',
      type: 'function',
      info: '(options?: { cidrBlock?: string } | { network?: string; }) => string — random IPv4 address',
    },
    {
      label: 'ipv6',
      type: 'function',
      info: '() => string — random IPv6 address',
    },
    {
      label: 'jwt',
      type: 'function',
      info: '(options?: { header?: Record<string, any>; payload?: Record<string, any>; }) => string — random JSON Web Token',
    },
    {
      label: 'jwtAlgorithm',
      type: 'function',
      info: '() => string — random JWT algorithm (e.g., HS256)',
    },
    {
      label: 'mac',
      type: 'function',
      info: '(options?: string | { separator?: string; }) => string — random MAC address',
    },
    {
      label: 'password',
      type: 'function',
      info: '(options?: { length?: number; memorable?: boolean; pattern?: RegExp; prefix?: string; }) => string — random password-like string',
    },
    {
      label: 'port',
      type: 'function',
      info: '() => number — random port number',
    },
    {
      label: 'protocol',
      type: 'function',
      info: '() => "http" | "https" — random web protocol',
    },
    {
      label: 'url',
      type: 'function',
      info: '(options?: { appendSlash?: boolean; protocol?: "http" | "https"; }) => string — random URL',
    },
    {
      label: 'userAgent',
      type: 'function',
      info: '() => string — random user agent string',
    },
  ],

  location: [
    {
      label: 'buildingNumber',
      type: 'function',
      info: '() => string — random building number',
    },
    {
      label: 'city',
      type: 'function',
      info: '() => string — random city name',
    },
    {
      label: 'continent',
      type: 'function',
      info: '() => string — random continent name',
    },
    {
      label: 'country',
      type: 'function',
      info: '() => string — random country name',
    },
    {
      label: 'countryCode',
      type: 'function',
      info: '(options?: "alpha-2" | "alpha-3" | "numeric" | { variant?: "alpha-2" | "alpha-3" | "numeric"; }) => string — random ISO country code',
    },
    {
      label: 'county',
      type: 'function',
      info: '() => string — random county or equivalent administrative region',
    },
    {
      label: 'direction',
      type: 'function',
      info: '(options?: { abbreviated?: boolean; }) => string — random cardinal/ordinal direction',
    },
    {
      label: 'cardinalDirection',
      type: 'function',
      info: '(options?: { abbreviated?: boolean; }) => string — random cardinal direction (N, S, E, W)',
    },
    {
      label: 'ordinalDirection',
      type: 'function',
      info: '(options?: { abbreviated?: boolean; }) => string — random ordinal direction (NE, SW, etc.)',
    },
    {
      label: 'latitude',
      type: 'function',
      info: '(options?: { min?: number; max?: number; precision?: number; }) => number — random latitude',
    },
    {
      label: 'longitude',
      type: 'function',
      info: '(options?: { min?: number; max?: number; precision?: number; }) => number — random longitude',
    },
    {
      label: 'nearbyGPSCoordinate',
      type: 'function',
      info: '(options?: { origin?: [number, number]; radius?: number; isMetric?: boolean; }) => [number, number] — random [lat, long] near given origin',
    },
    {
      label: 'secondaryAddress',
      type: 'function',
      info: '() => string — random secondary address (apt, suite, etc.)',
    },
    {
      label: 'state',
      type: 'function',
      info: '(options?: { abbreviated?: boolean; }) => string — random state or region name',
    },
    {
      label: 'street',
      type: 'function',
      info: '() => string — random street name',
    },
    {
      label: 'streetAddress',
      type: 'function',
      info: '(options?: boolean | { useFullAddress?: boolean; }) => string — random street address (can include city & secondary)',
    },
    {
      label: 'timeZone',
      type: 'function',
      info: '() => string — random IANA time zone',
    },
    {
      label: 'zipCode',
      type: 'function',
      info: '(options?: string | { state?: string; format?: string; }) => string — random zip/postal code',
    },
  ],

  phone: [
    {
      label: 'imei',
      type: 'function',
      info: '() => string — generates a random IMEI number',
    },
    {
      label: 'number',
      type: 'function',
      info: '(options?: { style?: "human" | "national" | "international" }) => string — random phone number formatted in different styles',
    },
  ],

  book: [
    {
      label: 'author',
      type: 'function',
      info: '() => string — random existing book author name',
    },
    {
      label: 'title',
      type: 'function',
      info: '() => string — random book title',
    },
    {
      label: 'genre',
      type: 'function',
      info: '() => string — random book genre (e.g., Fantasy, Romance)',
    },
    {
      label: 'series',
      type: 'function',
      info: '() => string — random book series name',
    },
    {
      label: 'publisher',
      type: 'function',
      info: '() => string — random book publisher name',
    },
    {
      label: 'format',
      type: 'function',
      info: '() => string — random book format (e.g., Hardcover, Paperback)',
    },
  ],

  lorem: [
    {
      label: 'word',
      type: 'function',
      info: '(options?: number | { length?: number | { min: number; max: number }; strategy?: "any-length" | "closest" | "fail" | "longest" | "shortest"; }) => string — random lorem word',
    },
    {
      label: 'words',
      type: 'function',
      info: '(wordCount?: number | { min: number; max: number; }) => string — space-separated list of words',
    },
    {
      label: 'sentence',
      type: 'function',
      info: '(wordCount?: number | { min: number; max: number; }) => string — random sentence (capitalized + period)',
    },
    {
      label: 'sentences',
      type: 'function',
      info: '(sentenceCount?: number | { min: number; max: number; }, separator?: string) => string — list of sentences joined with separator',
    },
    {
      label: 'paragraph',
      type: 'function',
      info: '(sentenceCount?: number | { min: number; max: number; }) => string — random paragraph (multiple sentences)',
    },
    {
      label: 'paragraphs',
      type: 'function',
      info: '(paragraphCount?: number | { min: number; max: number; }, separator?: string) => string — multiple paragraphs',
    },
    {
      label: 'lines',
      type: 'function',
      info: '(lineCount?: number | { min: number; max: number; }) => string — lines separated with newlines',
    },
    {
      label: 'slug',
      type: 'function',
      info: '(wordCount?: number | { min: number; max: number; }) => string — URL-friendly hyphenated text',
    },
    {
      label: 'text',
      type: 'function',
      info: '() => string — random text (between sentence and paragraph size)',
    },
  ],

  image: [
    {
      label: 'url',
      type: 'function',
      info: '(width?: number, height?: number, category?: string, randomize?: boolean) => string — generates a placeholder image URL with optional width, height, category, and randomize flag.',
    },
    {
      label: 'avatar',
      type: 'function',
      info: '(options?: { width?: number; height?: number; }) => string — generates a random avatar image URL with optional sizes.',
    },
  ],

  date: [
    {
      label: 'anytime',
      type: 'function',
      info: '(options?: { refDate?: string | Date | number }) => Date — random date (past or future)',
    },
    {
      label: 'between',
      type: 'function',
      info: '(options: { from: string | Date | number; to: string | Date | number }) => Date — random date between boundaries',
    },
    {
      label: 'betweens',
      type: 'function',
      info: '(options: { from: string | Date | number; to: string | Date | number; count?: number | { min: number; max: number; } }) => Date[] — multiple random dates',
    },
    {
      label: 'birthdate',
      type: 'function',
      info: '(options?: { refDate?: string | Date | number } | { mode: "age" | "year"; min: number; max: number; refDate?: string | Date | number }) => Date — random birthdate within age/year range',
    },
    {
      label: 'future',
      type: 'function',
      info: '(options?: { years?: number; refDate?: string | Date | number }) => Date — random future date',
    },
    {
      label: 'past',
      type: 'function',
      info: '(options?: { years?: number; refDate?: string | Date | number }) => Date — random past date',
    },
    {
      label: 'recent',
      type: 'function',
      info: '(options?: { days?: number; refDate?: string | Date | number }) => Date — random recent past',
    },
    {
      label: 'soon',
      type: 'function',
      info: '(options?: { days?: number; refDate?: string | Date | number }) => Date — random near-future date',
    },
    {
      label: 'month',
      type: 'function',
      info: '(options?: { abbreviated?: boolean; context?: boolean }) => string — random month name (with optional abbreviation)',
    },
    {
      label: 'weekday',
      type: 'function',
      info: '(options?: { abbreviated?: boolean; context?: boolean }) => string — random day of week (with optional abbreviation)',
    },
  ],

  commerce: [
    {
      label: 'department',
      type: 'function',
      info: '() => string — random store department/category',
    },
    {
      label: 'price',
      type: 'function',
      info: '(options?: { min?: number; max?: number; dec?: number; symbol?: string; }) => string — random price text with optional formatting',
    },
    {
      label: 'product',
      type: 'function',
      info: '() => string — random short product name',
    },
    {
      label: 'productAdjective',
      type: 'function',
      info: '() => string — product adjective (e.g., Soft, Incredible)',
    },
    {
      label: 'productMaterial',
      type: 'function',
      info: '() => string — material part of product description',
    },
    {
      label: 'productName',
      type: 'function',
      info: '() => string — full product name (combines adjective + material + product)',
    },
    {
      label: 'productDescription',
      type: 'function',
      info: '() => string — product description sentence (detailed text)',
    },
    {
      label: 'isbn',
      type: 'function',
      info: '(options?: number | { variant?: 10 | 13; separator?: string; }) => string — random ISBN identifier (10 or 13 digit)',
    },
    {
      label: 'upc',
      type: 'function',
      info: '(options?: { prefix?: string; }) => string — random UPC-A (12 digits), optional prefix',
    },
  ],

  company: [
    {
      label: 'name',
      type: 'function',
      info: '() => string — random company name (e.g., “Zieme, Hauck and McClure”)',
    },
    {
      label: 'catchPhrase',
      type: 'function',
      info: '() => string — random company catch phrase',
    },
    {
      label: 'catchPhraseAdjective',
      type: 'function',
      info: '() => string — adjective part of a catch phrase',
    },
    {
      label: 'catchPhraseDescriptor',
      type: 'function',
      info: '() => string — descriptor part of a catch phrase',
    },
    {
      label: 'catchPhraseNoun',
      type: 'function',
      info: '() => string — noun part of a catch phrase',
    },
    {
      label: 'buzzAdjective',
      type: 'function',
      info: '() => string — business “buzz” adjective',
    },
    {
      label: 'buzzVerb',
      type: 'function',
      info: '() => string — business “buzz” verb',
    },
    {
      label: 'buzzNoun',
      type: 'function',
      info: '() => string — business “buzz” noun',
    },
  ],

  number: [
    {
      label: 'int',
      type: 'function',
      info: '(options?: { min?: number; max?: number; precision?: number; }) => number — random integer within range',
    },
    {
      label: 'float',
      type: 'function',
      info: '(options?: { min?: number; max?: number; precision?: number; }) => number — random floating-point number',
    },
    {
      label: 'bigInt',
      type: 'function',
      info: '(options?: { min?: bigint | number; max?: bigint | number; }) => bigint — random BigInt within range',
    },
    {
      label: 'negative',
      type: 'function',
      info: '(options?: { min?: number; max?: number; precision?: number; }) => number — random negative number',
    },
    {
      label: 'hex',
      type: 'function',
      info: '(options?: { prefix?: string; length?: number | { min: number; max: number }; casing?: "lower" | "upper"; }) => string — random hex string',
    },
    {
      label: 'decimal',
      type: 'function',
      info: '(options?: { min?: number; max?: number; precision?: number; }) => number — random decimal number',
    },
  ],

  finance: [
    {
      label: 'account',
      type: 'function',
      info: '() => string — random bank account number (formatted)',
    },
    {
      label: 'amount',
      type: 'function',
      info: '(options?: { min?: number; max?: number; precision?: number; symbol?: string; }) => string — random amount text with optional formatting',
    },
    {
      label: 'transactionType',
      type: 'function',
      info: '() => string — random transaction type label',
    },
    {
      label: 'currencyCode',
      type: 'function',
      info: '() => string — random ISO 4217 currency code (e.g., USD)',
    },
    {
      label: 'currencyName',
      type: 'function',
      info: '() => string — full currency name (e.g., United States Dollar)',
    },
    {
      label: 'currencySymbol',
      type: 'function',
      info: '() => string — currency symbol (e.g., $)',
    },
    {
      label: 'bitcoinAddress',
      type: 'function',
      info: '() => string — random Bitcoin wallet address',
    },
    {
      label: 'litecoinAddress',
      type: 'function',
      info: '() => string — random Litecoin wallet address',
    },
    {
      label: 'ethereumAddress',
      type: 'function',
      info: '() => string — random Ethereum wallet address',
    },
    {
      label: 'iban',
      type: 'function',
      info: '(options?: { countryCode?: string; }) => string — random IBAN code',
    },
    {
      label: 'bic',
      type: 'function',
      info: '() => string — random BIC / SWIFT code',
    },
    {
      label: 'routingNumber',
      type: 'function',
      info: '() => string — random bank routing number',
    },
    {
      label: 'accountName',
      type: 'function',
      info: '() => string — random account name',
    },
  ],

  vehicle: [
    {
      label: 'vehicle',
      type: 'function',
      info: '() => string — random full vehicle name (e.g., "BMW X5")',
    },
    {
      label: 'manufacturer',
      type: 'function',
      info: '() => string — random vehicle manufacturer name',
    },
    {
      label: 'model',
      type: 'function',
      info: '() => string — random vehicle model name',
    },
    {
      label: 'type',
      type: 'function',
      info: '() => string — random vehicle type (e.g., "Coupe")',
    },
    {
      label: 'fuel',
      type: 'function',
      info: '() => string — random fuel type',
    },
    {
      label: 'color',
      type: 'function',
      info: '() => string — random vehicle color',
    },
    {
      label: 'vin',
      type: 'function',
      info: '() => string — random Vehicle Identification Number',
    },
    {
      label: 'vrm',
      type: 'function',
      info: '() => string — random Vehicle Registration Mark (license plate)',
    },
    {
      label: 'bicycle',
      type: 'function',
      info: '() => string — random bicycle type name',
    },
  ],

  hacker: [
    {
      label: 'abbreviation',
      type: 'function',
      info: '() => string — random acronym (e.g., “TCP”, “API”, “SQL”)',
    },
    {
      label: 'adjective',
      type: 'function',
      info: '() => string — random adjective used in hacker phrases',
    },
    {
      label: 'noun',
      type: 'function',
      info: '() => string — random noun used in hacker phrases',
    },
    {
      label: 'verb',
      type: 'function',
      info: '() => string — random verb used in hacker phrases',
    },
    {
      label: 'ingverb',
      type: 'function',
      info: '() => string — random “-ing” verb (present participle)',
    },
    {
      label: 'phrase',
      type: 'function',
      info: '() => string — random hacker phrase (combines words)',
    },
  ],

  system: [
    {
      label: 'commonFileExt',
      type: 'function',
      info: '() => string — random common file extension (e.g., "jpg", "gif")',
    },
    {
      label: 'commonFileName',
      type: 'function',
      info: '(extension?: string) => string — random file name with given or random extension',
    },
    {
      label: 'commonFileType',
      type: 'function',
      info: '() => string — random common high-level file type (e.g., "audio", "video")',
    },
    {
      label: 'cron',
      type: 'function',
      info: '(options?: { includeYear?: boolean; includeNonStandard?: boolean; }) => string — random cron expression',
    },
    {
      label: 'directoryPath',
      type: 'function',
      info: '() => string — random directory path string',
    },
    {
      label: 'fileExt',
      type: 'function',
      info: '(mimeType?: string) => string — random file extension, optionally based on a mime type',
    },
    {
      label: 'fileName',
      type: 'function',
      info: '(options?: { extensionCount?: number | { min: number; max: number } }) => string — random file name with one or more extensions',
    },
    {
      label: 'filePath',
      type: 'function',
      info: '() => string — random full file system path',
    },
    {
      label: 'fileType',
      type: 'function',
      info: '() => string — random file type category',
    },
    {
      label: 'mimeType',
      type: 'function',
      info: '() => string — random mime type (e.g., "video/vnd.vivo")',
    },
    {
      label: 'networkInterface',
      type: 'function',
      info: '(options?: { interfaceType?: "en" | "wl" | "ww"; interfaceSchema?: "index" | "slot" | "mac" | "pci"; }) => string — random network interface name',
    },
    {
      label: 'semver',
      type: 'function',
      info: '() => string — random semantic version string (e.g., "1.15.2")',
    },
  ],

  git: [
    {
      label: 'branch',
      type: 'function',
      info: '() => string — random git branch name (e.g., "feature/awesome")',
    },
    {
      label: 'commitEntry',
      type: 'function',
      info: '() => string — formatted git commit entry with hash and message',
    },
    {
      label: 'commitMessage',
      type: 'function',
      info: '() => string — random git commit message',
    },
    {
      label: 'commitSha',
      type: 'function',
      info: '() => string — random full commit SHA (40 hex chars)',
    },
    {
      label: 'shortSha',
      type: 'function',
      info: '() => string — short random commit SHA (e.g., first 7 hex chars)',
    },
  ],

  science: [
    {
      label: 'chemicalElement',
      type: 'function',
      info: '() => { name: string; symbol: string; atomicNumber: number } — random chemical element object',
    },
    {
      label: 'unit',
      type: 'function',
      info: '() => { unit: string; symbol: string; quantity: string } — random scientific unit object',
    },
  ],

  music: [
    {
      label: 'genre',
      type: 'function',
      info: '() => string — random music genre (e.g., "Jazz", "Rock", "Classical")',
    },
    {
      label: 'songName',
      type: 'function',
      info: '() => string — random song title or name',
    },
  ],

  animal: [
    {
      label: 'dog',
      type: 'function',
      info: '() => string — random dog breed/name',
    },
    {
      label: 'cat',
      type: 'function',
      info: '() => string — random cat breed/name',
    },
    {
      label: 'snake',
      type: 'function',
      info: '() => string — random snake type/name',
    },
    {
      label: 'bear',
      type: 'function',
      info: '() => string — random bear species/name',
    },
    {
      label: 'lion',
      type: 'function',
      info: '() => string — random lion subtype/name',
    },
    {
      label: 'type',
      type: 'function',
      info: '() => string — random general animal type',
    },
    {
      label: 'cow',
      type: 'function',
      info: '() => string — random cow breed/name',
    },
    {
      label: 'elephant',
      type: 'function',
      info: '() => string — random elephant subtype/name',
    },
    {
      label: 'horse',
      type: 'function',
      info: '() => string — random horse breed/name',
    },
    {
      label: 'fish',
      type: 'function',
      info: '() => string — random fish type/name',
    },
    {
      label: 'bird',
      type: 'function',
      info: '() => string — random bird type/name',
    },
  ],

  database: [
    {
      label: 'collation',
      type: 'function',
      info: '() => string — random database collation (e.g., "utf8_unicode_ci")',
    },
    {
      label: 'column',
      type: 'function',
      info: '() => string — random database column name (e.g., "createdAt")',
    },
    {
      label: 'engine',
      type: 'function',
      info: '() => string — random database engine (e.g., "InnoDB")',
    },
    {
      label: 'mongodbObjectId',
      type: 'function',
      info: '() => string — random MongoDB ObjectID string',
    },
    {
      label: 'type',
      type: 'function',
      info: '() => string — random database column type (e.g., "timestamp")',
    },
  ],

  airline: [
    {
      label: 'aircraftType',
      type: 'function',
      info: '() => "narrowbody" | "regional" | "widebody" — Random aircraft type',
    },
    {
      label: 'airline',
      type: 'function',
      info: '() => { name: string; iataCode: string } — Random airline object',
    },
    {
      label: 'airplane',
      type: 'function',
      info: '() => { name: string; iataTypeCode: string } — Random airplane object',
    },
    {
      label: 'airport',
      type: 'function',
      info: '() => { name: string; iataCode: string } — Random airport object',
    },
    {
      label: 'flightNumber',
      type: 'function',
      info: '(options?: { length?: number | { min: number; max: number }; addLeadingZeros?: boolean }) => string — Random flight number',
    },
    {
      label: 'recordLocator',
      type: 'function',
      info: '(options?: { allowNumerics?: boolean; allowVisuallySimilarCharacters?: boolean }) => string — Random booking/record locator code',
    },
    {
      label: 'seat',
      type: 'function',
      info: '(options?: { aircraftType?: "narrowbody" | "regional" | "widebody" }) => string — Random seat assignment',
    },
  ],

  color: [
    {
      label: 'human',
      type: 'function',
      info: '() => string — random human-readable color name (e.g., "red")',
    },
    {
      label: 'rgb',
      type: 'function',
      info: '(options?: { prefix?: string; casing?: "lower" | "upper"; format?: "hex" | "css" | "decimal" | "binary"; includeAlpha?: boolean; }) => string | number[] — random RGB color',
    },
    {
      label: 'hsl',
      type: 'function',
      info: '(options?: { format?: "css" | "decimal" | "binary"; includeAlpha?: boolean; }) => string | number[] — random HSL color',
    },
    {
      label: 'hwb',
      type: 'function',
      info: '(options?: { format?: "css" | "decimal" | "binary"; }) => string | number[] — random HWB color',
    },
    {
      label: 'cmyk',
      type: 'function',
      info: '(options?: { format?: "css" | "decimal" | "binary"; }) => string | number[] — random CMYK color',
    },
    {
      label: 'lab',
      type: 'function',
      info: '(options?: { format?: "css" | "decimal" | "binary"; }) => string | number[] — random LAB color',
    },
    {
      label: 'lch',
      type: 'function',
      info: '(options?: { format?: "css" | "decimal" | "binary"; }) => string | number[] — random LCH color',
    },
    {
      label: 'space',
      type: 'function',
      info: '() => string — random CSS color space name (e.g., "sRGB", "display-p3")',
    },
    {
      label: 'colorByCSSColorSpace',
      type: 'function',
      info: '(options?: { format?: "css" | "decimal" | "binary"; space?: string; }) => string | number[] — random color in specified CSS color space',
    },
    {
      label: 'cssSupportedFunction',
      type: 'function',
      info: '() => string — random CSS supported color function name (e.g., "rgb", "hsl", "lab")',
    },
    {
      label: 'cssSupportedSpace',
      type: 'function',
      info: '() => string — random supported CSS color space (e.g., "sRGB", "rec2020")',
    },
  ],

  string: [
    {
      label: 'alpha',
      type: 'function',
      info: '(options?: number | { length?: number | {min: number; max: number}; casing?: string; exclude?: string[] | string; }) => string',
    },
    {
      label: 'alphanumeric',
      type: 'function',
      info: '(options?: number | { length?: number | {min: number; max: number}; casing?: string; exclude?: string[] | string; }) => string',
    },
    {
      label: 'binary',
      type: 'function',
      info: '(options?: { length?: number | {min: number; max: number}; prefix?: string; }) => string',
    },
    {
      label: 'fromCharacters',
      type: 'function',
      info: '(characters: string | string[], length?: number | {min: number; max: number; }) => string',
    },
    {
      label: 'hexadecimal',
      type: 'function',
      info: '(options?: { length?: number | {min: number; max: number}; casing?: string; prefix?: string; }) => string',
    },
    {
      label: 'nanoid',
      type: 'function',
      info: '(length?: number | {min: number; max: number; }) => string',
    },
    {
      label: 'numeric',
      type: 'function',
      info: '(options?: number | { length?: number | {min: number; max: number}; allowLeadingZeros?: boolean; exclude?: string[] | string; }) => string',
    },
    {
      label: 'octal',
      type: 'function',
      info: '(options?: { length?: number | {min: number; max: number}; prefix?: string; }) => string',
    },
    {
      label: 'sample',
      type: 'function',
      info: '(length?: number | {min: number; max: number; }) => string',
    },
    {
      label: 'symbol',
      type: 'function',
      info: '(length?: number | {min: number; max: number; }) => string',
    },
    {
      label: 'ulid',
      type: 'function',
      info: '(options?: { refDate?: string | number | Date; }) => string',
    },
    {
      label: 'uuid',
      type: 'function',
      info: '() => string',
    },
  ],

  datatype: [
    {
      label: 'boolean',
      type: 'function',
      info: '() => boolean — random true/false',
    },
    {
      label: 'arrayElement',
      type: 'function',
      info: '(array: any[]) => any — returns a random element from the given array',
    },
    {
      label: 'arrayElements',
      type: 'function',
      info: '(array: any[], count?: number | { min: number; max: number }) => any[] — returns one or more random elements from the array',
    },
    {
      label: 'bigInt',
      type: 'function',
      info: '(options?: { min?: bigint | number; max?: bigint | number }) => bigint — random BigInt within range',
    },
    {
      label: 'float',
      type: 'function',
      info: '(options?: { min?: number; max?: number; precision?: number }) => number — random floating-point number',
    },
    {
      label: 'hexadecimal',
      type: 'function',
      info: '(options?: { prefix?: string; length?: number | { min: number; max: number }; casing?: "lower" | "upper" }) => string — random hex string',
    },
    {
      label: 'int',
      type: 'function',
      info: '(options?: { min?: number; max?: number; precision?: number }) => number — random integer within range',
    },
    {
      label: 'number',
      type: 'function',
      info: '(options?: { min?: number; max?: number; precision?: number }) => number — random number (int or float)',
    },
    {
      label: 'string',
      type: 'function',
      info: '(length?: number | { min: number; max: number }; prefix?: string) => string — random alphanumeric string',
    },
    {
      label: 'uuid',
      type: 'function',
      info: '() => string — random UUID v4',
    },
  ],

  food: [
    {
      label: 'adjective',
      type: 'function',
      info: '() => string — random food adjective (e.g., "Delicious")',
    },
    {
      label: 'description',
      type: 'function',
      info: '() => string — descriptive food phrase',
    },
    {
      label: 'dish',
      type: 'function',
      info: '() => string — random dish name (e.g., "Spicy Tofu Bowl")',
    },
    {
      label: 'fruit',
      type: 'function',
      info: '() => string — random fruit name',
    },
    {
      label: 'ingredient',
      type: 'function',
      info: '() => string — random ingredient name',
    },
    {
      label: 'meat',
      type: 'function',
      info: '() => string — random type of meat',
    },
    {
      label: 'spice',
      type: 'function',
      info: '() => string — random spice name',
    },
    {
      label: 'vegetable',
      type: 'function',
      info: '() => string — random vegetable name',
    },
  ],

  helpers: [
    {
      label: 'arrayElement',
      type: 'function',
      info: '<T>(array: T[]) => T — returns a random element from the given array',
    },
    {
      label: 'arrayElements',
      type: 'function',
      info: '<T>(array: T[], options?: { count?: number | { min: number; max: number } }) => T[] — returns multiple elements from array',
    },
    {
      label: 'fake',
      type: 'function',
      info: '(template: string) => string — replaces tokens in template with faker calls',
    },
    {
      label: 'objectKey',
      type: 'function',
      info: '<T extends object>(obj: T) => string — returns a random key from the object',
    },
    {
      label: 'objectValue',
      type: 'function',
      info: '<T extends object>(obj: T) => any — returns a random value from the object',
    },
    {
      label: 'objectEntry',
      type: 'function',
      info: '<T extends object>(obj: T) => [string, any] — returns a random [key, value] pair',
    },
    {
      label: 'enumValue',
      type: 'function',
      info: '<T>(enumObject: T) => T[keyof T] — picks a random enum value',
    },
    {
      label: 'shuffle',
      type: 'function',
      info: '<T>(array: T[]) => T[] — returns a new array with shuffled elements',
    },
    {
      label: 'slugify',
      type: 'function',
      info: '(text: string) => string — converts text to URL-friendly slug',
    },
    {
      label: 'uniqueArray',
      type: 'function',
      info: '(source: any[], length: number) => any[] — returns a unique subset of elements',
    },
    {
      label: 'mustache',
      type: 'function',
      info: '(template: string, data: object) => string — faker-aware mustache rendering',
    },
    {
      label: 'range',
      type: 'function',
      info: '(start: number, end: number, step?: number) => number[] — generates a numeric range',
    },
  ],
};
