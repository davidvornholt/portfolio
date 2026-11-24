import type { ReactNode } from 'react';
import type { SnapshotSiteRecord } from '@/features/changes/services/snapshot';
import './change-field.css';

const monthAndYear = (day: string): string =>
  new Date(`${day}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

const count = (value: number): string => value.toLocaleString('en-US');

/**
 * What the checks said about every change to this site's own repository. A
 * change that merged with a failed check removes the sentence, and changes
 * that merged before a check had finished are counted out loud, so the page
 * never rounds the record up.
 */
export const SiteRecord = ({
  record,
}: {
  readonly record: SnapshotSiteRecord;
}): ReactNode => {
  const total = record.passed + record.unchecked;
  if (record.failed > 0 || total === 0) {
    return null;
  }
  const since = monthAndYear(record.firstMergedOn);
  return (
    <>
      <span aria-hidden="true" className="field-key keeps-colors" />{' '}
      {record.unchecked === 0
        ? `All ${count(total)} changes merged into this site’s project since ${since} passed their checks.`
        : `None of the ${count(total)} changes merged into this site’s project since ${since} had a failed check. ${count(record.passed)} passed, and ${count(record.unchecked)} merged before a check had finished.`}
    </>
  );
};
