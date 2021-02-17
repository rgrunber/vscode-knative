import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import * as sinon from 'sinon';
import * as referee from '@sinonjs/referee';
import { KnAPI } from '../../src/cli/kn-api';
import { CliCommand, CmdCli } from '../../src/cli/cmdCli';

import rewire = require('rewire');

const { assert } = referee;
const { expect } = chai;
chai.use(sinonChai);

suite('KN CLI Command', () => {
  test('should create a proper command string', () => {
    const api = rewire('../../src/cli/kn-api');
    const knCliCommand = api.__get__('knCliCommand');
    const knArguments: string[] = ['service', 'list'];
    const commandApi: CliCommand = knCliCommand(knArguments);
    const command: CliCommand = {
      cliArguments: ['service', 'list'],
      cliCommand: 'kn',
    };

    assert.equals(command, commandApi);
  });
});

suite('KN API commands that will', () => {
  const sandbox = sinon.createSandbox();

  teardown(() => {
    sandbox.restore();
  });

  suite('Create a Service', () => {
    const envMap = new Map([
      ['key1', 'new_Value1'],
      ['new_key2', 'NEW_VALUE2'],
    ]);

    const annotationMap = new Map([
      ['sidecar.istio.io/inject', false],
      ['sidecar.istio.io/list', true],
    ]);

    const labelMap = new Map([
      ['key1', 'label1'],
      ['key2', 'LABEL2'],
    ]);

    test('should create a service with name and image', () => {
      const command: CliCommand = {
        cliArguments: ['service', 'create', 'mySvc', '--image', 'dev.local/ns/image:latest'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.createService({ name: 'mySvc', image: 'dev.local/ns/image:latest' });
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
    test('should create a service with image using --force flag', () => {
      const command: CliCommand = {
        cliArguments: ['service', 'create', '--force', 'mySvc', '--image', 'dev.local/ns/image:latest'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.createService({
        name: 'mySvc',
        image: 'dev.local/ns/image:latest',
        force: true,
      });
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
    test('should create a service with a port', () => {
      const command: CliCommand = {
        cliArguments: ['service', 'create', 'mySvc', '--port', '80', '--image', 'dev.local/ns/image:latest'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.createService({
        name: 'mySvc',
        image: 'dev.local/ns/image:latest',
        port: 80,
      });
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
    test('should create a service with multiple environment variables', () => {
      const command: CliCommand = {
        cliArguments: [
          'service',
          'create',
          'mySvc',
          '--env',
          'KEY1=NEW_VALUE1',
          '--env',
          'NEW_KEY2=NEW_VALUE2',
          '--image',
          'dev.local/ns/image:latest',
        ],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.createService({
        name: 'mySvc',
        image: 'dev.local/ns/image:latest',
        env: envMap,
      });
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
    test('should create a service with multiple environment variables using --force flag', () => {
      const command: CliCommand = {
        cliArguments: [
          'service',
          'create',
          '--force',
          'mySvc',
          '--env',
          'KEY1=NEW_VALUE1',
          '--env',
          'NEW_KEY2=NEW_VALUE2',
          '--image',
          'dev.local/ns/image:latest',
        ],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.createService({
        name: 'mySvc',
        image: 'dev.local/ns/image:latest',
        force: true,
        env: envMap,
      });
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
    test('should create a service with name, image, and namespace', () => {
      const command: CliCommand = {
        cliArguments: ['service', 'create', 'mySvc', '--image', 'dev.local/ns/image:latest', '-n', 'myNS'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.createService({
        name: 'mySvc',
        image: 'dev.local/ns/image:latest',
        namespace: 'myNS',
      });
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
    test('should create a service with annotations', () => {
      const command: CliCommand = {
        cliArguments: [
          'service',
          'create',
          'mySvc',
          '--image',
          'dev.local/ns/image:latest',
          '--annotation',
          'sidecar.istio.io/inject=false',
          '--annotation',
          'sidecar.istio.io/list=true',
        ],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.createService({
        name: 'mySvc',
        image: 'dev.local/ns/image:latest',
        annotation: annotationMap,
      });
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
    test('should create a service with labels', () => {
      const command: CliCommand = {
        cliArguments: [
          'service',
          'create',
          'mySvc',
          '--image',
          'dev.local/ns/image:latest',
          '--label',
          'key1=label1',
          '--label',
          'key2=LABEL2',
        ],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.createService({
        name: 'mySvc',
        image: 'dev.local/ns/image:latest',
        label: labelMap,
      });
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
    test('should create a service with all the options applied', () => {
      const command: CliCommand = {
        cliArguments: [
          'service',
          'create',
          '--force',
          'mySvc',
          '--port',
          '80',
          '--env',
          'KEY1=NEW_VALUE1',
          '--env',
          'NEW_KEY2=NEW_VALUE2',
          '--image',
          'dev.local/ns/image:latest',
          '-n',
          'myNS',
          '--annotation',
          'sidecar.istio.io/inject=false',
          '--annotation',
          'sidecar.istio.io/list=true',
          '--label',
          'key1=label1',
          '--label',
          'key2=LABEL2',
        ],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.createService({
        name: 'mySvc',
        image: 'dev.local/ns/image:latest',
        force: true,
        port: 80,
        env: envMap,
        namespace: 'myNS',
        annotation: annotationMap,
        label: labelMap,
      });
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
  });
  suite('Update a Service', () => {
    const envMap = new Map([
      ['key1', 'new_Value1'],
      ['new_key2', 'NEW_VALUE2'],
    ]);

    const annotationMap = new Map([
      ['sidecar.istio.io/inject', false],
      ['sidecar.istio.io/list', true],
    ]);

    const labelMap = new Map([
      ['key1', 'label1'],
      ['key2', 'LABEL2'],
    ]);

    const limitMap = new Map([
      ['key1', 'limit1'],
      ['key2', 'LIMIT2'],
    ]);

    const requestMap = new Map([
      ['key1', 'request1'],
      ['key2', 'REQUEST2'],
    ]);

    const tagMap = new Map([
      ['key1', 'tag1'],
      ['key2', 'TAG2'],
    ]);

    const trafficMap = new Map([
      ['key1', 'traffic1'],
      ['key2', 'TRAFFIC2'],
    ]);

    const untagMap = new Map([
      ['key1', 'untag1'],
      ['key2', 'UNTAG2'],
    ]);

    test('should update a service with name and image', () => {
      const command: CliCommand = {
        cliArguments: ['service', 'update', 'mySvc', '--image', 'dev.local/ns/image:latest'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.updateService({ name: 'mySvc', image: 'dev.local/ns/image:latest' });
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
    test('should update a service with a port', () => {
      const command: CliCommand = {
        cliArguments: ['service', 'update', 'mySvc', '--port', '80'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.updateService({
        name: 'mySvc',
        port: 80,
      });
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
    test('should update a service with name and namespace', () => {
      const command: CliCommand = {
        cliArguments: ['service', 'update', 'mySvc', '-n', 'myNS'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.updateService({
        name: 'mySvc',
        namespace: 'myNS',
      });
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
    test('should update a service with multiple environment variables', () => {
      const command: CliCommand = {
        cliArguments: ['service', 'update', 'mySvc', '--env', 'KEY1=NEW_VALUE1', '--env', 'NEW_KEY2=NEW_VALUE2'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.updateService({
        name: 'mySvc',
        env: envMap,
      });
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
    test('should update a service with annotations', () => {
      const command: CliCommand = {
        cliArguments: [
          'service',
          'update',
          'mySvc',
          '--annotation',
          'sidecar.istio.io/inject=false',
          '--annotation',
          'sidecar.istio.io/list=true',
        ],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.updateService({
        name: 'mySvc',
        annotation: annotationMap,
      });
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
    test('should update a service with labels', () => {
      const command: CliCommand = {
        cliArguments: ['service', 'update', 'mySvc', '--label', 'key1=label1', '--label', 'key2=LABEL2'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.updateService({
        name: 'mySvc',
        label: labelMap,
      });
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
    test('should update a service with limits', () => {
      const command: CliCommand = {
        cliArguments: ['service', 'update', 'mySvc', '--limit', 'key1=limit1', '--limit', 'key2=LIMIT2'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.updateService({
        name: 'mySvc',
        limit: limitMap,
      });
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
    test('should update a service with requests', () => {
      const command: CliCommand = {
        cliArguments: ['service', 'update', 'mySvc', '--request', 'key1=request1', '--request', 'key2=REQUEST2'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.updateService({
        name: 'mySvc',
        request: requestMap,
      });
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
    test('should update a service with tags', () => {
      const command: CliCommand = {
        cliArguments: ['service', 'update', 'mySvc', '--tag', 'key1=tag1', '--tag', 'key2=TAG2'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.updateService({
        name: 'mySvc',
        tag: tagMap,
      });
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
    test('should update a service with traffic', () => {
      const command: CliCommand = {
        cliArguments: ['service', 'update', 'mySvc', '--traffic', 'key1=traffic1', '--traffic', 'key2=TRAFFIC2'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.updateService({
        name: 'mySvc',
        traffic: trafficMap,
      });
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
    test('should update a service with untag', () => {
      const command: CliCommand = {
        cliArguments: ['service', 'update', 'mySvc', '--untag', 'key1=untag1', '--untag', 'key2=UNTAG2'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.updateService({
        name: 'mySvc',
        untag: untagMap,
      });
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
    test('should update a service with all the options applied', () => {
      const command: CliCommand = {
        cliArguments: [
          'service',
          'update',
          'mySvc',
          '--image',
          'dev.local/ns/image:latest',
          '--port',
          '80',
          '-n',
          'myNS',
          '--env',
          'KEY1=NEW_VALUE1',
          '--env',
          'NEW_KEY2=NEW_VALUE2',
          '--annotation',
          'sidecar.istio.io/inject=false',
          '--annotation',
          'sidecar.istio.io/list=true',
          '--label',
          'key1=label1',
          '--label',
          'key2=LABEL2',
          '--limit',
          'key1=limit1',
          '--limit',
          'key2=LIMIT2',
          '--request',
          'key1=request1',
          '--request',
          'key2=REQUEST2',
          '--tag',
          'key1=tag1',
          '--tag',
          'key2=TAG2',
          '--traffic',
          'key1=traffic1',
          '--traffic',
          'key2=TRAFFIC2',
          '--untag',
          'key1=untag1',
          '--untag',
          'key2=UNTAG2',
        ],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.updateService({
        name: 'mySvc',
        image: 'dev.local/ns/image:latest',
        port: 80,
        namespace: 'myNS',
        env: envMap,
        annotation: annotationMap,
        label: labelMap,
        limit: limitMap,
        request: requestMap,
        tag: tagMap,
        traffic: trafficMap,
        untag: untagMap,
      });
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
  });
  suite('List Services', () => {
    test('should list all services in the current namespace', () => {
      const command: CliCommand = {
        cliArguments: ['service', 'list', '-o', 'json'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.listServices();
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
  });

  suite('List revisions', () => {
    test('should return command for listing all revisions', () => {
      const command: CliCommand = {
        cliArguments: ['revision', 'list', '-o', 'json'],
        cliCommand: 'kn',
      };
      assert.equals(command.cliArguments, KnAPI.listRevisions().cliArguments);
    });
    test('should return command for listing revisions for a service', () => {
      const sName = 'myService';
      const command: CliCommand = {
        cliArguments: ['revision', 'list', '-o', 'json', '-s', sName],
        cliCommand: 'kn',
      };
      assert.equals(command.cliArguments, KnAPI.listRevisionsForService(sName).cliArguments);
    });
  });

  suite('Describe Features', () => {
    test('should return command for describing the service foo in JSON', () => {
      const feature = 'service';
      const name = 'foo';
      const outputFormat = 'json';
      const command: CliCommand = {
        cliArguments: [feature, 'describe', name, '-o', outputFormat],
        cliCommand: 'kn',
      };
      assert.equals(command.cliArguments, KnAPI.describeFeature(feature, name, outputFormat).cliArguments);
    });
    test('should return command for describing the service foo in YAML', () => {
      const feature = 'service';
      const name = 'foo';
      const outputFormat = 'yaml';
      const command: CliCommand = {
        cliArguments: [feature, 'describe', name, '-o', outputFormat],
        cliCommand: 'kn',
      };
      assert.equals(command.cliArguments, KnAPI.describeFeature(feature, name, outputFormat).cliArguments);
    });
    test('should return command for describing the service foo when no output is set', () => {
      const feature = 'service';
      const name = 'foo';
      const command: CliCommand = {
        cliArguments: [feature, 'describe', name],
        cliCommand: 'kn',
      };
      assert.equals(command.cliArguments, KnAPI.describeFeature(feature, name).cliArguments);
    });
  });

  suite('Delete Features', () => {
    test('should return command for deleting the service foo', () => {
      const feature = 'service';
      const name = 'foo';
      const command: CliCommand = {
        cliArguments: [feature, 'delete', name],
        cliCommand: 'kn',
      };
      assert.equals(command.cliArguments, KnAPI.deleteFeature(feature, name).cliArguments);
    });
  });

  suite('List Routes', () => {
    test('should return command for listing all routes', () => {
      const command: CliCommand = {
        cliArguments: ['route', 'list', '-o', 'json'],
        cliCommand: 'kn',
      };
      assert.equals(command.cliArguments, KnAPI.listRoutes().cliArguments);
    });
    test('should return command for listing routes for a service', () => {
      const sName = 'myService';
      const command: CliCommand = {
        cliArguments: ['route', 'list', sName, '-o', 'json'],
        cliCommand: 'kn',
      };
      assert.equals(command.cliArguments, KnAPI.listRoutesForService(sName).cliArguments);
    });
  });

  suite('Print version', () => {
    test('should return command for printing the version of KN', () => {
      const command: CliCommand = {
        cliArguments: ['version'],
        cliCommand: 'kn',
      };
      assert.equals(command.cliArguments, KnAPI.printKnVersion().cliArguments);
    });
  });

  suite('Get version', () => {
    test('should return the version number for a stable release', async () => {
      sandbox.stub(CmdCli.getInstance(), 'execute').resolves({ error: undefined, stdout: 'Version:      v0.14.0' });
      const version = await KnAPI.getKnVersion('path/to/kubectl');
      expect(version).equals('0.14.0');
    });
    test('should return the version number for a nightly release', async () => {
      sandbox
        .stub(CmdCli.getInstance(), 'execute')
        .resolves({ error: undefined, stdout: 'Version:      v20200309-local-34433f6' });
      const version = await KnAPI.getKnVersion('path/to/kubectl');
      expect(version).equals('20200309');
    });
    test('should return Undefined when the version is not the correct text', async () => {
      sandbox.stub(CmdCli.getInstance(), 'execute').resolves({ error: undefined, stdout: 'not the version text' });
      const version = await KnAPI.getKnVersion('path/to/kubectl');
      expect(version).equals(undefined);
    });
    test('should return Undefined when the version is not returned', async () => {
      sandbox.stub(CmdCli.getInstance(), 'execute').resolves({ error: undefined, stdout: undefined });
      const version = await KnAPI.getKnVersion('path/to/kubectl');
      expect(version).equals(undefined);
    });
    test('should return Undefined for errors', async () => {
      sandbox.stub(CmdCli.getInstance(), 'execute').throws({ error: 'Error generated by a test', stdout: undefined });
      const version = await KnAPI.getKnVersion('path/to/kubectl');
      expect(version).equals(undefined);
    });
  });

  suite('List Sources', () => {
    test('should list all event sources in the current namespace', () => {
      const command: CliCommand = {
        cliArguments: ['source', 'list', '-o', 'json'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.listSources();
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
  });

  suite('List Source Types', () => {
    test('should list all event sources types in the current namespace', () => {
      const command: CliCommand = {
        cliArguments: ['source', 'list-types', '-o', 'json'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.listSourceTypes();
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
  });

  suite('Create Sources', () => {
    const sink: Array<Array<string>> = [['--sink', 'SINK']];

    test('should create an event source with source type and name', () => {
      const command: CliCommand = {
        cliArguments: ['source', 'ping', 'create', 'mySvc'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.createSource('ping', 'mySvc');
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });

    test('should create an event source with source type and name with options', () => {
      const command: CliCommand = {
        cliArguments: ['source', 'ping', 'create', 'mySvc', '--sink', 'SINK'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.createSource('ping', 'mySvc', sink);
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
  });

  suite('Update Sources', () => {
    const sink: Array<Array<string>> = [['--sink', 'SINK']];

    test('should update an event source with source type and name', () => {
      const command: CliCommand = {
        cliArguments: ['source', 'ping', 'update', 'mySvc'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.updateSource('ping', 'mySvc');
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });

    test('should update an event source with source type and name with options', () => {
      const command: CliCommand = {
        cliArguments: ['source', 'ping', 'update', 'mySvc', '--sink', 'SINK'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.updateSource('ping', 'mySvc', sink);
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
  });

  suite('Delete Sources', () => {
    test('should delete an event source with source type and name', () => {
      const command: CliCommand = {
        cliArguments: ['source', 'ping', 'delete', 'mySvc'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.deleteSource('ping', 'mySvc');
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
  });

  suite('Describe Sources', () => {
    test('should describe an event source with source type and name', () => {
      const command: CliCommand = {
        cliArguments: ['source', 'ping', 'describe', 'mySvc'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.describeSource('ping', 'mySvc');
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
  });

  suite('List Subscriptions', () => {
    test('should list all event subscriptions in the current namespace', () => {
      const command: CliCommand = {
        cliArguments: ['subscription', 'list', '-o', 'json'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.listSubscriptions();
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
  });

  suite('Create Subscriptions', () => {
    const sink: Array<Array<string>> = [['--sink', 'SINK']];

    test('should create an event subscription with subscription type and name', () => {
      const command: CliCommand = {
        cliArguments: ['subscription', 'create', 'mySvc'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.createSubscription('mySvc');
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });

    test('should create an event subscription with subscription type and name with options', () => {
      const command: CliCommand = {
        cliArguments: ['subscription', 'create', 'mySvc', '--sink', 'SINK'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.createSubscription('mySvc', sink);
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
  });

  suite('Update Subscriptions', () => {
    const sink: Array<Array<string>> = [['--sink', 'SINK']];

    test('should update an event subscription with subscription type and name', () => {
      const command: CliCommand = {
        cliArguments: ['subscription', 'update', 'mySvc'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.updateSubscription('mySvc');
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });

    test('should update an event subscription with subscription type and name with options', () => {
      const command: CliCommand = {
        cliArguments: ['subscription', 'update', 'mySvc', '--sink', 'SINK'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.updateSubscription('mySvc', sink);
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
  });

  suite('Delete Subscriptions', () => {
    test('should delete an event subscription with subscription type and name', () => {
      const command: CliCommand = {
        cliArguments: ['subscription', 'delete', 'mySvc'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.deleteSubscription('mySvc');
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
  });

  suite('List Triggers', () => {
    test('should list all event triggers in the current namespace', () => {
      const command: CliCommand = {
        cliArguments: ['trigger', 'list', '-o', 'json'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.listTriggers();
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
  });

  suite('Create Triggers', () => {
    const sink: Array<Array<string>> = [['--sink', 'SINK']];

    test('should create an event trigger with name', () => {
      const command: CliCommand = {
        cliArguments: ['trigger', 'create', 'mySvc'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.createTrigger('mySvc');
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });

    test('should create an event trigger with name and options', () => {
      const command: CliCommand = {
        cliArguments: ['trigger', 'create', 'mySvc', '--sink', 'SINK'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.createTrigger('mySvc', sink);
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
  });

  suite('Update Triggers', () => {
    const sink: Array<Array<string>> = [['--sink', 'SINK']];

    test('should update an event trigger with name', () => {
      const command: CliCommand = {
        cliArguments: ['trigger', 'update', 'mySvc'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.updateTrigger('mySvc');
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });

    test('should update an event trigger with name and options', () => {
      const command: CliCommand = {
        cliArguments: ['trigger', 'update', 'mySvc', '--sink', 'SINK'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.updateTrigger('mySvc', sink);
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
  });

  suite('Delete Triggers', () => {
    test('should delete an event trigger with trigger type and name', () => {
      const command: CliCommand = {
        cliArguments: ['trigger', 'delete', 'mySvc'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.deleteTrigger('mySvc');
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
  });

  suite('List Brokers', () => {
    test('should list all event brokers in the current namespace', () => {
      const command: CliCommand = {
        cliArguments: ['broker', 'list', '-o', 'json'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.listBrokers();
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
  });

  suite('Create Brokers', () => {
    test('should create an event broker with name', () => {
      const command: CliCommand = {
        cliArguments: ['broker', 'create', 'mySvc'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.createBroker('mySvc');
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
  });

  suite('Delete Brokers', () => {
    test('should delete an event broker with broker type and name', () => {
      const command: CliCommand = {
        cliArguments: ['broker', 'delete', 'mySvc'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.deleteBroker('mySvc');
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
  });

  suite('List Channels', () => {
    test('should list all event channels in the current namespace', () => {
      const command: CliCommand = {
        cliArguments: ['channel', 'list', '-o', 'json'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.listChannels();
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
  });

  suite('List Channel Types', () => {
    test('should list all event channels types in the current namespace', () => {
      const command: CliCommand = {
        cliArguments: ['channel', 'list-types', '-o', 'json'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.listChannelTypes();
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
  });

  suite('Create Channels', () => {
    test('should create an event channel with name', () => {
      const command: CliCommand = {
        cliArguments: ['channel', 'create', 'mySvc'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.createChannel('mySvc');
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
  });

  suite('Delete Channels', () => {
    test('should delete an event channel with channel type and name', () => {
      const command: CliCommand = {
        cliArguments: ['channel', 'delete', 'mySvc'],
        cliCommand: 'kn',
      };
      const commandAPI = KnAPI.deleteChannel('mySvc');
      assert.equals(command.cliArguments, commandAPI.cliArguments);
    });
  });
});
