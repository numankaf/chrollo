import { type CompletionContext, type CompletionResult } from '@codemirror/autocomplete';

import { CONSOLE_API } from '@/components/app/editor/code-mirror/completions/api/console';
import { FAKER_METHODS, FAKER_MODULES } from '@/components/app/editor/code-mirror/completions/api/faker';
import { REQUESTS_API } from '@/components/app/editor/code-mirror/completions/api/request';
import { makeInfo } from '@/components/app/editor/code-mirror/completions/api/shared';
import { STOMP_API } from '@/components/app/editor/code-mirror/completions/api/stomp';
import { EXPECT_CHAIN_API } from '@/components/app/editor/code-mirror/completions/api/test';
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
  test: {
    label: 'test',
    type: 'function',
    info: () =>
      makeInfo(`
          <div>
            <b>chrollo.test(name, fn)</b><br/>
            <small>(name: string, fn: () =&gt; void) =&gt; void</small><br/><br/>
            Runs <code>fn()</code> and records a named test result.<br/>
            The test passes if <code>fn</code> completes without throwing.<br/>
            Use <code>chrollo.expect()</code> inside for assertions.<br/><br/>
            <b>Example:</b><br/>
            <code>chrollo.test('has userId', () =&gt; {</code><br/>
            <code>&nbsp;&nbsp;const data = chrollo.response.data.json();</code><br/>
            <code>&nbsp;&nbsp;chrollo.expect(data.userId).to.exist;</code><br/>
            <code>});</code>
          </div>
        `),
  },
  expect: {
    label: 'expect',
    type: 'function',
    info: () =>
      makeInfo(`
          <div>
            <b>chrollo.expect(value, message?)</b><br/>
            <small>(val: any, message?: string) =&gt; Assertion</small><br/><br/>
            Chrollo uses <b>Chai Expect</b> for BDD-style assertions.<br/>
            Returns a chainable Assertion object. Use inside <code>chrollo.test()</code>.<br/>
            <a href="https://www.chaijs.com/api/bdd/" target="_blank">Chai BDD API Reference</a><br/><br/>
            <b>Examples:</b><br/>
            <code>chrollo.expect(status).to.equal(200)</code><br/>
            <code>chrollo.expect(body).to.have.property('id')</code><br/>
            <code>chrollo.expect(arr).to.have.lengthOf(3)</code><br/>
            <code>chrollo.expect(str).to.include('hello')</code><br/>
            <code>chrollo.expect(value).to.be.a('string')</code><br/>
            <code>chrollo.expect(value).to.not.be.null</code><br/><br/>
            <b>Key chain operators:</b><br/>
            • <code>to be have not deep</code> — modifiers / language chains<br/>
            • <code>equal eql include property</code> — equality / containment<br/>
            • <code>above below least most within</code> — numeric range<br/>
            • <code>a an lengthOf match keys oneOf</code> — type / shape<br/>
            • <code>ok true false null undefined exist empty</code> — boolean getters<br/>
          </div>
        `),
  },
};

export function chrolloCompletions(context: CompletionContext): CompletionResult | null {
  const word = context.matchBefore(/[\w.]*/);
  if (!word) return null;

  // ── Chai expect chain detection ────────────────────────────────────────────
  // Detects patterns like: expect(value). / expect(value).to. / expect(value).to.eq
  // word.text only captures [\w.]* and breaks at '(' / ')', so we fall back to
  // scanning the text on the current line up to the cursor for '.expect(...).'.
  const lineFrom = context.state.doc.lineAt(context.pos).from;
  const lineUpToCursor = context.state.sliceDoc(lineFrom, context.pos);
  const expectChainMatch = lineUpToCursor.match(/\.expect\(.*\).*\.(\w*)$/);
  if (expectChainMatch) {
    const partial = expectChainMatch[1];
    return {
      from: context.pos - partial.length,
      options: EXPECT_CHAIN_API,
    };
  }
  // ── End Chai expect chain detection ───────────────────────────────────────

  if (word.text === 'console.') {
    return {
      from: word.to,
      options: CONSOLE_API,
    };
  }

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

    if (parent === 'console') {
      return {
        from: word.from + lastDotIndex + 1,
        options: CONSOLE_API,
      };
    }
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

  if (word.text.length > 0) {
    const options: { label: string; type: string; info: string }[] = [];
    if ('chrollo'.startsWith(word.text)) {
      options.push({ label: 'chrollo', type: 'class', info: 'Chrollo Scripting API' });
    }
    if ('console'.startsWith(word.text)) {
      options.push({ label: 'console', type: 'class', info: 'Console output to dev tools' });
    }
    if (options.length > 0) {
      return {
        from: word.from,
        options,
      };
    }
  }

  return null;
}
