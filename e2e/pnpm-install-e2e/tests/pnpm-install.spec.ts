import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  runPackageManagerInstall,
  uniq,
} from '@nrwl/nx-plugin/testing';

describe('pnpm-install e2e', () => {
  it('can run pnpm install', (done) => {
    const pnpmInstallOutput = runPackageManagerInstall();

    expect(pnpmInstallOutput).toBe('');
    done();
  });

  it('should create pnpm-install', async (done) => {
    const plugin = uniq('pnpm-install');
    ensureNxProject('@nx-plugin/pnpm-install', 'dist/packages/pnpm-install');
    await runNxCommandAsync(
      `generate @nx-plugin/pnpm-install:pnpm-install ${plugin}`
    );

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Executor ran');

    done();
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      const plugin = uniq('pnpm-install');
      ensureNxProject('@nx-plugin/pnpm-install', 'dist/packages/pnpm-install');
      await runNxCommandAsync(
        `generate @nx-plugin/pnpm-install:pnpm-install ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)
      ).not.toThrow();
      done();
    });
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async (done) => {
      const plugin = uniq('pnpm-install');
      ensureNxProject('@nx-plugin/pnpm-install', 'dist/packages/pnpm-install');
      await runNxCommandAsync(
        `generate @nx-plugin/pnpm-install:pnpm-install ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    });
  });
});
