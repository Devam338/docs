import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import github from 'eslint-plugin-github'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import primerReact from 'eslint-plugin-primer-react'
import eslintComments from 'eslint-plugin-eslint-comments'
import i18nText from 'eslint-plugin-i18n-text'
import filenames from 'eslint-plugin-filenames'
import noOnlyTests from 'eslint-plugin-no-only-tests'
import prettierPlugin from 'eslint-plugin-prettier'
import prettier from 'eslint-config-prettier'
import globals from 'globals'
import customRules from 'eslint-plugin-custom-rules'

export default [
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.commonjs,
        ...globals.es2020,
        // Fetch API types for TypeScript
        RequestInit: 'readonly',
        RequestInfo: 'readonly',
        HeadersInit: 'readonly',
        JSX: 'readonly',
        // Node.js types for TypeScript
        BufferEncoding: 'readonly',
        NodeJS: 'readonly',
        // cheerio namespace for TypeScript
        cheerio: 'readonly',
      },
      parserOptions: {
        requireConfigFile: false,
      },
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
    plugins: {
      github,
      import: importPlugin,
      'eslint-comments': eslintComments,
      'i18n-text': i18nText,
      filenames,
      'no-only-tests': noOnlyTests,
      prettier: prettierPlugin,
      '@typescript-eslint': tseslint,
      'primer-react': primerReact,
      'jsx-a11y': jsxA11y,
      'custom-rules': customRules,
    },
    rules: {
      // ESLint recommended rules
      ...js.configs.recommended.rules,

      // GitHub plugin recommended rules
      ...github.configs.recommended.rules,

      // Import plugin error rules
      ...importPlugin.configs.errors.rules,

      // TypeScript ESLint recommended rules
      ...tseslint.configs.recommended.rules,

      // Primer React recommended rules
      ...primerReact.configs.recommended.rules,

      // JSX A11y recommended rules
      ...jsxA11y.configs.recommended.rules,

      // Overrides
      'import/no-extraneous-dependencies': [
        'error',
        {
          packageDir: '.',
        },
      ],
      'import/extensions': ['error', { json: 'always' }],
      'no-empty': ['error', { allowEmptyCatch: true }],
      '@typescript-eslint/no-unused-vars': 'error',
      'prefer-const': ['error', { destructuring: 'all' }],

      // Rules that must be disabled
      'no-redeclare': 'off', // Allow function overloads in TypeScript
      'i18n-text/no-en': 'off', // This rule causes eslint to not run at all
      'filenames/match-regex': 'off', // This rule causes eslint to not run at all
      camelcase: 'off', // Many gh apis use underscores, 600+ uses

      // Disabled rules to review
      'no-console': 'off', // 800+

      // Custom rules
      'custom-rules/use-custom-logger': 'error',

      // Disallow dangerouslySetInnerHTML; render trusted HTML via RenderedHTML /
      // renderHTMLString or a hast tree instead (github/docs-engineering#6619).
      'custom-rules/no-dangerously-set-inner-html': 'error',

      // Prevent direct res.redirect() usage — use res.safeRedirect() instead
      // to avoid open redirect vulnerabilities via protocol-relative URLs.
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.object.name='res'][callee.property.name='redirect']",
          message: 'Use res.safeRedirect() instead of res.redirect() to prevent open redirects.',
        },
      ],
    },
  },

  // Configuration for eslint-rules directory (CommonJS JavaScript files)
  {
    files: ['src/eslint-rules/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        ...globals.node,
        ...globals.commonjs,
        ...globals.es2020,
      },
    },
    plugins: {
      github,
      import: importPlugin,
      'eslint-comments': eslintComments,
      filenames,
      'no-only-tests': noOnlyTests,
      prettier: prettierPlugin,
    },
    rules: {
      // ESLint recommended rules
      ...js.configs.recommended.rules,

      // GitHub plugin recommended rules
      ...github.configs.recommended.rules,

      // Import plugin error rules
      ...importPlugin.configs.errors.rules,

      // Allow CommonJS in eslint rules
      'import/no-commonjs': 'off',

      // Overrides
      'import/extensions': ['error', { json: 'always' }],
      'no-empty': ['error', { allowEmptyCatch: true }],
      'prefer-const': ['error', { destructuring: 'all' }],

      // Disabled rules
      'i18n-text/no-en': 'off',
      'filenames/match-regex': 'off',
      camelcase: 'off',
      'no-console': 'off',
    },
  },

  // Client-side files that run in the browser where the server-only logger is unavailable
  {
    files: [
      'src/search/components/hooks/useAISearchAutocomplete.ts',
      'src/search/components/hooks/useAISearchLocalStorageCache.ts',
    ],
    rules: {
      'custom-rules/use-custom-logger': 'off',
    },
  },

  // Disable custom logger rule for logger implementation itself
  {
    files: ['src/observability/logger/**/*.{ts,js}'],
    rules: {
      'custom-rules/use-custom-logger': 'off',
    },
  },

  // Directories not yet migrated to structured logger (see github/docs-engineering#5639)
  // Remove directories from this list as they are migrated
  {
    files: [
      'src/ai-tools/**/*.{ts,js}',
      'src/article-api/**/*.{ts,js}',
      'src/audit-logs/**/*.{ts,js}',
      'src/color-schemes/**/*.{ts,js}',
      'src/dev-toc/**/*.{ts,js}',
      'src/events/components/**/*.{ts,js}',
      'src/fixtures/**/*.{ts,js}',
      'src/journeys/**/*.{ts,js}',
      'src/metrics/**/*.{ts,js}',
      'src/observability/lib/handle-package-not-found.ts',
    ],
    rules: {
      'custom-rules/use-custom-logger': 'off',
    },
  },

  // Override for scripts, tests, workflows, content-linter, and React files (disable custom logger rule)
  {
    files: [
      '**/scripts/**/*.{ts,js}',
      '**/tests/**/*.{ts,js}',
      'src/workflows/**/*.{ts,js}',
      'src/content-linter/**/*.{ts,js}',
      '**/*.{tsx,jsx}',
      // Client-side module that cannot use the server-only structured logger
      'src/languages/lib/translation-utils.ts',
      // CLI help script — chalk-colored terminal output, not application logging
      'src/rest/docs.ts',
    ],
    rules: {
      'custom-rules/use-custom-logger': 'off',
    },
  },

  // Allow namespace imports for @actions/core (ESM-only in v3.0.0)
  {
    files: [
      '.github/actions/**/*.ts',
      'src/workflows/**/*.ts',
      'src/links/scripts/**/*.ts',
      'src/content-linter/scripts/**/*.ts',
    ],
    rules: {
      'import/no-namespace': 'off',
    },
  },

  // Allow role="list" on list-style:none <ul> elements in these components.
  // Chromium drops the implicit `list`/`listitem` roles from the accessibility tree
  // when list-style:none is set, so NVDA/JAWS lose list semantics and the item count;
  // role="list" on the <ul> and role="listitem" on each <li> restore them and are not
  // actually redundant here. See github/accessibility-audits#16815.
  {
    files: [
      'src/frame/components/ui/MiniTocs/MiniTocs.tsx',
      'src/landings/components/TableOfContents.tsx',
      'src/frame/components/GenericError.tsx',
      'src/frame/components/page-footer/LegalFooter.tsx',
      'src/landings/components/ProductSelectionCard.tsx',
      'src/release-notes/components/GHESReleaseNotes.tsx',
    ],
    rules: {
      'jsx-a11y/no-redundant-roles': [
        'error',
        { nav: ['navigation'], ul: ['list'], li: ['listitem'] },
      ],
    },
  },

  // Ignored patterns
  // CodeQL scripts included because cocofix is install manually by the workflow
  {
    ignores: [
      'tmp/*',
      '.next/',
      'rest-api-description/',
      'docs-internal-data/',
      'src/codeql-queries/scripts/generate-code-scanning-query-list.ts',
      'src/codeql-queries/scripts/generate-code-quality-query-list.ts',
      'next-env.d.ts',
    ],
  },

  // Prettier config (should be last to override formatting rules)
  prettier,
]

```js
// Base ESLint recommended configuration
import js from '@eslint/js'

// TypeScript ESLint plugin and parser
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

// GitHub-specific ESLint rules
import github from 'eslint-plugin-github'

// Import validation rules
import importPlugin from 'eslint-plugin-import'

// Accessibility rules for JSX and React
import jsxA11y from 'eslint-plugin-jsx-a11y'

// GitHub Primer React component rules
import primerReact from 'eslint-plugin-primer-react'

// Rules for ESLint directive comments such as eslint-disable
import eslintComments from 'eslint-plugin-eslint-comments'

// Internationalization rules
import i18nText from 'eslint-plugin-i18n-text'

// Filename validation rules
import filenames from 'eslint-plugin-filenames'

// Prevent committed tests containing .only()
import noOnlyTests from 'eslint-plugin-no-only-tests'

// Runs Prettier as an ESLint rule
import prettierPlugin from 'eslint-plugin-prettier'

// Disables ESLint formatting rules that conflict with Prettier
import prettier from 'eslint-config-prettier'

// Provides predefined browser, Node.js, and ECMAScript globals
import globals from 'globals'

// Project-specific custom ESLint rules
import customRules from 'eslint-plugin-custom-rules'

export default [
  /*
   * Main TypeScript and React TypeScript configuration.
   *
   * This configuration applies to every .ts and .tsx file in the project.
   */
  {
    files: ['**/*.{ts,tsx}'],

    languageOptions: {
      // Use the TypeScript ESLint parser instead of ESLint's default parser
      parser: tsParser,

      // Support ECMAScript 2022 syntax
      ecmaVersion: 2022,

      // Treat files as ES modules so import/export syntax is supported
      sourceType: 'module',

      globals: {
        // Browser globals such as window, document, and navigator
        ...globals.browser,

        // Node.js globals such as process, __dirname, and module
        ...globals.node,

        // CommonJS globals such as require and exports
        ...globals.commonjs,

        // ECMAScript 2020 globals such as BigInt and Promise
        ...globals.es2020,

        /*
         * TypeScript and Fetch API globals.
         *
         * These are declared as readonly so ESLint recognizes them without
         * allowing them to be reassigned.
         */
        RequestInit: 'readonly',
        RequestInfo: 'readonly',
        HeadersInit: 'readonly',
        JSX: 'readonly',

        // Node.js TypeScript type namespaces
        BufferEncoding: 'readonly',
        NodeJS: 'readonly',

        // Cheerio TypeScript namespace
        cheerio: 'readonly',
      },

      parserOptions: {
        /*
         * Do not require a Babel configuration file.
         *
         * This can be useful when parsers or plugins inspect files without
         * relying on a separate Babel configuration.
         */
        requireConfigFile: false,
      },
    },

    settings: {
      /*
       * Configure eslint-plugin-import to resolve both:
       * - TypeScript files and path aliases
       * - Standard Node.js modules
       */
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },

    /*
     * Register all plugins used by the rules below.
     *
     * In ESLint flat config, plugins must be provided as objects instead of
     * being listed by package name.
     */
    plugins: {
      github,
      import: importPlugin,
      'eslint-comments': eslintComments,
      'i18n-text': i18nText,
      filenames,
      'no-only-tests': noOnlyTests,
      prettier: prettierPlugin,
      '@typescript-eslint': tseslint,
      'primer-react': primerReact,
      'jsx-a11y': jsxA11y,
      'custom-rules': customRules,
    },

    rules: {
      /*
       * Start with ESLint's standard recommended rules.
       *
       * Examples include no-undef, no-unreachable, and no-constant-condition.
       */
      ...js.configs.recommended.rules,

      // Apply GitHub's recommended ESLint rules
      ...github.configs.recommended.rules,

      // Enable eslint-plugin-import rules that detect import errors
      ...importPlugin.configs.errors.rules,

      // Apply the recommended TypeScript ESLint rules
      ...tseslint.configs.recommended.rules,

      // Apply recommended rules for GitHub Primer React components
      ...primerReact.configs.recommended.rules,

      // Apply recommended JSX accessibility rules
      ...jsxA11y.configs.recommended.rules,

      /*
       * Prevent imports from packages that are not declared in the project's
       * package.json dependencies or devDependencies.
       */
      'import/no-extraneous-dependencies': [
        'error',
        {
          packageDir: '.',
        },
      ],

      /*
       * Require JSON imports to include the .json extension.
       *
       * Other file types use the plugin's default extension behavior.
       */
      'import/extensions': ['error', {json: 'always'}],

      // Allow empty catch blocks while rejecting other empty blocks
      'no-empty': ['error', {allowEmptyCatch: true}],

      // Report unused TypeScript variables as errors
      '@typescript-eslint/no-unused-vars': 'error',

      /*
       * Require variables to use const when they are never reassigned.
       *
       * For destructuring, every destructured variable must be eligible before
       * ESLint recommends converting the declaration to const.
       */
      'prefer-const': ['error', {destructuring: 'all'}],

      /*
       * Disable the base no-redeclare rule.
       *
       * TypeScript supports valid declaration patterns such as function
       * overloads that the base JavaScript rule may incorrectly report.
       */
      'no-redeclare': 'off',

      /*
       * Disabled because this internationalization rule currently prevents
       * ESLint from running correctly in this project.
       */
      'i18n-text/no-en': 'off',

      /*
       * Disabled because this filename rule currently prevents ESLint from
       * running correctly in this project.
       */
      'filenames/match-regex': 'off',

      /*
       * Allow snake_case identifiers.
       *
       * Many GitHub APIs return properties containing underscores, so enforcing
       * camelCase would produce hundreds of unnecessary violations.
       */
      camelcase: 'off',

      /*
       * Console usage is currently allowed.
       *
       * There are more than 800 existing console statements, so this rule can
       * be reconsidered after the structured logger migration is complete.
       */
      'no-console': 'off',

      /*
       * Require application code to use the project's structured logger instead
       * of directly using console methods.
       */
      'custom-rules/use-custom-logger': 'error',

      /*
       * Prevent React's dangerouslySetInnerHTML property.
       *
       * Trusted HTML should instead be rendered through RenderedHTML,
       * renderHTMLString, or a validated HAST tree.
       *
       * Related issue: github/docs-engineering#6619
       */
      'custom-rules/no-dangerously-set-inner-html': 'error',

      /*
       * Prevent direct res.redirect() calls.
       *
       * res.safeRedirect() should be used instead because it validates redirect
       * destinations and helps prevent open redirect vulnerabilities involving
       * protocol-relative URLs.
       */
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "CallExpression[callee.object.name='res'][callee.property.name='redirect']",
          message:
            'Use res.safeRedirect() instead of res.redirect() to prevent open redirects.',
        },
      ],
    },
  },

  /*
   * Configuration for custom ESLint rule implementations.
   *
   * Files in this directory use CommonJS JavaScript rather than TypeScript or
   * ES modules.
   */
  {
    files: ['src/eslint-rules/**/*.js'],

    languageOptions: {
      // Support ECMAScript 2022 syntax
      ecmaVersion: 2022,

      // Parse these files as traditional scripts instead of ES modules
      sourceType: 'script',

      globals: {
        // Make Node.js globals available
        ...globals.node,

        // Make CommonJS globals such as require and module available
        ...globals.commonjs,

        // Make ECMAScript 2020 globals available
        ...globals.es2020,
      },
    },

    // Only register plugins needed by custom ESLint rule files
    plugins: {
      github,
      import: importPlugin,
      'eslint-comments': eslintComments,
      filenames,
      'no-only-tests': noOnlyTests,
      prettier: prettierPlugin,
    },

    rules: {
      // Apply ESLint's recommended JavaScript rules
      ...js.configs.recommended.rules,

      // Apply GitHub's recommended rules
      ...github.configs.recommended.rules,

      // Detect invalid or unresolved imports
      ...importPlugin.configs.errors.rules,

      /*
       * Allow require() and module.exports because custom ESLint rules are
       * implemented as CommonJS modules.
       */
      'import/no-commonjs': 'off',

      // Require .json extensions for JSON imports
      'import/extensions': ['error', {json: 'always'}],

      // Allow empty catch blocks but reject other empty blocks
      'no-empty': ['error', {allowEmptyCatch: true}],

      // Prefer const when a variable is not reassigned
      'prefer-const': ['error', {destructuring: 'all'}],

      /*
       * These rules are disabled for consistency with the main configuration
       * or because their plugins are not applicable to this directory.
       */
      'i18n-text/no-en': 'off',
      'filenames/match-regex': 'off',
      camelcase: 'off',
      'no-console': 'off',
    },
  },

  /*
   * Browser-only AI search hooks.
   *
   * These files cannot use the server-side structured logger, so the custom
   * logger rule is disabled.
   */
  {
    files: [
      'src/search/components/hooks/useAISearchAutocomplete.ts',
      'src/search/components/hooks/useAISearchLocalStorageCache.ts',
    ],

    rules: {
      'custom-rules/use-custom-logger': 'off',
    },
  },

  /*
   * Logger implementation files.
   *
   * The logger itself must be allowed to use lower-level logging functions;
   * otherwise, the custom logger rule could report the logger implementation.
   */
  {
    files: ['src/observability/logger/**/*.{ts,js}'],

    rules: {
      'custom-rules/use-custom-logger': 'off',
    },
  },

  /*
   * Directories that have not yet migrated to the structured logger.
   *
   * Remove entries from this list as each directory is migrated.
   * Tracking issue: github/docs-engineering#5639
   */
  {
    files: [
      'src/ai-tools/**/*.{ts,js}',
      'src/article-api/**/*.{ts,js}',
      'src/audit-logs/**/*.{ts,js}',
      'src/color-schemes/**/*.{ts,js}',
      'src/dev-toc/**/*.{ts,js}',
      'src/events/components/**/*.{ts,js}',
      'src/fixtures/**/*.{ts,js}',
      'src/journeys/**/*.{ts,js}',
      'src/metrics/**/*.{ts,js}',
      'src/observability/lib/handle-package-not-found.ts',
    ],

    rules: {
      'custom-rules/use-custom-logger': 'off',
    },
  },

  /*
   * Files where direct console output is expected or where the server-only
   * structured logger is unavailable.
   *
   * This includes scripts, tests, workflows, React components, browser modules,
   * and CLI output.
   */
  {
    files: [
      // One-off and maintenance scripts
      '**/scripts/**/*.{ts,js}',

      // Automated test files
      '**/tests/**/*.{ts,js}',

      // GitHub Actions workflow-related code
      'src/workflows/**/*.{ts,js}',

      // Content linting tools
      'src/content-linter/**/*.{ts,js}',

      /*
       * React files may execute in the browser, where the server-only logger is
       * unavailable.
       */
      '**/*.{tsx,jsx}',

      // Client-side translation utility
      'src/languages/lib/translation-utils.ts',

      /*
       * CLI help output intentionally uses console output with Chalk formatting.
       */
      'src/rest/docs.ts',
    ],

    rules: {
      'custom-rules/use-custom-logger': 'off',
    },
  },

  /*
   * Permit namespace imports for @actions/core.
   *
   * Version 3 of @actions/core is ESM-only, and namespace imports may be needed
   * in these GitHub Actions and script files.
   */
  {
    files: [
      '.github/actions/**/*.ts',
      'src/workflows/**/*.ts',
      'src/links/scripts/**/*.ts',
      'src/content-linter/scripts/**/*.ts',
    ],

    rules: {
      'import/no-namespace': 'off',
    },
  },

  /*
   * Accessibility exception for visually unstyled lists.
   *
   * Chromium may remove implicit list and listitem semantics from the
   * accessibility tree when list-style: none is applied. As a result, screen
   * readers such as NVDA and JAWS may no longer announce the list or its item
   * count.
   *
   * Explicit role="list" and role="listitem" values restore those semantics in
   * these components, so they should not be reported as redundant.
   *
   * Related issue: github/accessibility-audits#16815
   */
  {
    files: [
      'src/frame/components/ui/MiniTocs/MiniTocs.tsx',
      'src/landings/components/TableOfContents.tsx',
      'src/frame/components/GenericError.tsx',
      'src/frame/components/page-footer/LegalFooter.tsx',
      'src/landings/components/ProductSelectionCard.tsx',
      'src/release-notes/components/GHESReleaseNotes.tsx',
    ],

    rules: {
      /*
       * Continue reporting other redundant roles, but permit these specific
       * explicit roles on nav, ul, and li elements.
       */
      'jsx-a11y/no-redundant-roles': [
        'error',
        {
          nav: ['navigation'],
          ul: ['list'],
          li: ['listitem'],
        },
      ],
    },
  },

  /*
   * Files and directories excluded from ESLint.
   *
   * CodeQL generator scripts are excluded because cocofix is installed
   * manually by the workflow and may not be available in the normal local
   * linting environment.
   */
  {
    ignores: [
      // Temporary generated files
      'tmp/*',

      // Next.js build output
      '.next/',

      // Generated or externally maintained REST API descriptions
      'rest-api-description/',

      // Internal generated documentation data
      'docs-internal-data/',

      // CodeQL query-list generator scripts
      'src/codeql-queries/scripts/generate-code-scanning-query-list.ts',
      'src/codeql-queries/scripts/generate-code-quality-query-list.ts',

      // Next.js-generated TypeScript declarations
      'next-env.d.ts',
    ],
  },

  /*
   * Keep the Prettier configuration last.
   *
   * eslint-config-prettier disables formatting-related ESLint rules that could
   * conflict with Prettier.
   */
  prettier,
]
```

