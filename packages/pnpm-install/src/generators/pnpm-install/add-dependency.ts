import { installPackagesTask, readJson, Tree } from '@nrwl/devkit';

export function addDependency(host: Tree, packageName: string, version = '*') {
  const packageJsonPath = 'package.json';
  const currentPackageJson = readJson(host, packageJsonPath);
  const isPackageInstalled =
    currentPackageJson.dependencies?.[packageName] !== undefined;

  if (isPackageInstalled) {
    return;
  }

  const modifiedPackageJson = {
    ...currentPackageJson,
    dependencies: {
      ...currentPackageJson.dependencies,
      [packageName]: version,
    },
  };

  host.write(packageJsonPath, JSON.stringify(modifiedPackageJson, null, 2));

  return () => {
    installPackagesTask(host);
  };
}
