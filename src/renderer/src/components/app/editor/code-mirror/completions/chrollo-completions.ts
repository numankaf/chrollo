import { type CompletionContext, type CompletionResult } from '@codemirror/autocomplete';

import { FAKER_METHODS, FAKER_MODULES } from '@/components/app/editor/code-mirror/completions/api/faker';
import { REQUESTS_API } from '@/components/app/editor/code-mirror/completions/api/request';
import { makeInfo } from '@/components/app/editor/code-mirror/completions/api/shared';
import { STOMP_API } from '@/components/app/editor/code-mirror/completions/api/stomp';
import { UTILS_API } from '@/components/app/editor/code-mirror/completions/api/utils';
import {
  VARIABLES_API,
  VARIABLES_ENVIRONMENT_API,
  VARIABLES_GLOBALS_API,
  VARIABLES_LOCAL_API,
} from '@/components/app/editor/code-mirror/completions/api/variables';

const CHROLLO_API = {
  stomp: {
    label: 'stomp',
    type: 'class',
    info: 'Stomp API for intercepting and handling STOMP messages',
  },
  variables: {
    label: 'variables',
    type: 'class',
    info: 'Variables API for managing environment variables',
  },
  utils: {
    label: 'utils',
    type: 'class',
    info: 'Utility functions',
  },
  request: {
    label: 'request',
    type: 'class',
    info: 'Requests API for managing request lifecycle',
  },
  faker: {
    label: 'faker',
    type: 'class',
    info: () =>
      makeInfo(`
          <div>
            <p>Chrollo exposes <b>FakerJS 10.2.0</b> to generate fake/random test data.</p>
            <a href="https://fakerjs.dev/api/" target="_blank">API Reference</a><br/><br/>
            Generate fake/random test data for:<br/>
            • load testing<br/>
            • mock payloads<br/>
            • workflow simulations<br/><br/>
            <b>Examples:</b><br/>
            <code>faker.person.fullName()</code><br/>
            <code>faker.internet.email()</code><br/>
            <code>faker.phone.number()</code><br/>
            <code>faker.location.city()</code><br/>
            <code>faker.date.future()</code><br/>
            <code>faker.number.int()</code><br/><br/>
          </div>
        `),
  },
};

export function chrolloCompletions(context: CompletionContext): CompletionResult | null {
  const word = context.matchBefore(/[\w.]*/);
  if (!word) return null;

  if (word.text === 'chrollo.') {
    return {
      from: word.to,
      options: Object.values(CHROLLO_API),
    };
  }

  if (word.text === 'chrollo.stomp.') {
    return {
      from: word.to,
      options: STOMP_API,
    };
  }

  if (word.text === 'chrollo.variables.') {
    return {
      from: word.to,
      options: VARIABLES_API,
    };
  }

  if (word.text === 'chrollo.variables.globals.') {
    return {
      from: word.to,
      options: VARIABLES_GLOBALS_API,
    };
  }

  if (word.text === 'chrollo.variables.environment.') {
    return {
      from: word.to,
      options: VARIABLES_ENVIRONMENT_API,
    };
  }

  if (word.text === 'chrollo.variables.local.') {
    return {
      from: word.to,
      options: VARIABLES_LOCAL_API,
    };
  }

  if (word.text === 'chrollo.utils.') {
    return {
      from: word.to,
      options: UTILS_API,
    };
  }

  if (word.text === 'chrollo.request.') {
    return {
      from: word.to,
      options: REQUESTS_API,
    };
  }

  if (word.text === 'chrollo.faker.') {
    return {
      from: word.to,
      options: FAKER_MODULES,
    };
  }

  const fakerModuleMatch = word.text.match(/^chrollo\.faker\.(\w+)\.$/);
  if (fakerModuleMatch) {
    const moduleName = fakerModuleMatch[1];
    if (FAKER_METHODS[moduleName]) {
      return {
        from: word.to,
        options: FAKER_METHODS[moduleName],
      };
    }
  }

  // Completing property names partially typed
  const lastDotIndex = word.text.lastIndexOf('.');
  if (lastDotIndex > -1) {
    const parent = word.text.slice(0, lastDotIndex);

    if (parent === 'chrollo') {
      return {
        from: word.from + lastDotIndex + 1,
        options: Object.values(CHROLLO_API),
      };
    }
    if (parent === 'chrollo.stomp') {
      return {
        from: word.from + lastDotIndex + 1,
        options: STOMP_API,
      };
    }
    if (parent === 'chrollo.variables') {
      return {
        from: word.from + lastDotIndex + 1,
        options: VARIABLES_API,
      };
    }
    if (parent === 'chrollo.variables.globals') {
      return {
        from: word.from + lastDotIndex + 1,
        options: VARIABLES_GLOBALS_API,
      };
    }
    if (parent === 'chrollo.variables.environment') {
      return {
        from: word.from + lastDotIndex + 1,
        options: VARIABLES_ENVIRONMENT_API,
      };
    }
    if (parent === 'chrollo.variables.local') {
      return {
        from: word.from + lastDotIndex + 1,
        options: VARIABLES_LOCAL_API,
      };
    }
    if (parent === 'chrollo.utils') {
      return {
        from: word.from + lastDotIndex + 1,
        options: UTILS_API,
      };
    }
    if (parent === 'chrollo.request') {
      return {
        from: word.from + lastDotIndex + 1,
        options: REQUESTS_API,
      };
    }
    if (parent === 'chrollo.faker') {
      return {
        from: word.from + lastDotIndex + 1,
        options: FAKER_MODULES,
      };
    }
    const moduleMatch = parent.match(/^chrollo\.faker\.(\w+)$/);
    if (moduleMatch) {
      const moduleName = moduleMatch[1];
      if (FAKER_METHODS[moduleName]) {
        return {
          from: word.from + lastDotIndex + 1,
          options: FAKER_METHODS[moduleName],
        };
      }
    }
  }

  if ('chrollo'.startsWith(word.text) && word.text.length > 0) {
    return {
      from: word.from,
      options: [{ label: 'chrollo', type: 'class', info: 'Chrollo Scripting API' }],
    };
  }

  return null;
}
