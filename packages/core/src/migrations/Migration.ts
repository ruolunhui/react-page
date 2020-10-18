import semver from 'semver';
import { CellPlugin } from '../service/plugin/classes';

export type MigrationContext = {
  plugins: CellPlugin[];
  lang: string;
};
interface MigrationConfig<TIn, TOut> {
  toVersion: string;
  fromVersionRange: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  migrate: (state: TIn, context: MigrationContext) => TOut;
}

/**
 * @class the class used to migrate plugin content between toVersion
 */
export class Migration<TIn = any, TOut = TIn> {
  fromVersionRange: string;
  toVersion: string;
  migrate: (state: TIn, context: MigrationContext) => TOut;
  constructor(config: MigrationConfig<TIn, TOut>) {
    const { toVersion, migrate, fromVersionRange } = config;

    if (
      !migrate ||
      !toVersion ||
      !fromVersionRange ||
      semver.valid(toVersion) === null ||
      semver.validRange(fromVersionRange) === null
    ) {
      throw new Error(
        `A migration toVersion, fromVersionRange and migrate function must be defined, got ${JSON.stringify(
          config
        )}`
      );
    }
    this.toVersion = toVersion;
    this.migrate = migrate;
    this.fromVersionRange = fromVersionRange;
  }
}