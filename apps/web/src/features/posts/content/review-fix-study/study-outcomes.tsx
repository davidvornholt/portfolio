import type { ReactNode } from 'react';
import { contaminationEvents, findingRows, matrixModels } from './study-data';

export const StudyFigure = ({
  title,
  caption,
  children,
}: Readonly<{
  title: string;
  caption: string;
  children: ReactNode;
}>): ReactNode => (
  <figure className="my-10 border-border border-y py-6">
    <p className="mb-6 font-semibold text-foreground">{title}</p>
    {children}
    <figcaption className="mt-6 border-border border-t pt-4 text-muted-foreground text-sm leading-relaxed">
      {caption}
    </figcaption>
  </figure>
);

const headlines = [
  { value: '3', label: 'material defects independently found and repaired by all-Astra', detail: 'Two in ProsaBridge, one in Rota.' },
  { value: '2,494', label: 'loader calls in five seconds', detail: 'Browser reproduction, not paid-provider requests.' },
  { value: '1', label: 'independently reproduced Luna repair regression', detail: 'Intercepted locally; never pushed or merged.' },
] as const;

export const StudyScorecard = (): ReactNode => (
  <StudyFigure
    title="The latest round, in concrete outcomes"
    caption="Two source changes, four workflow configurations. These observations are not a recall percentage or a universal model score."
  >
    <dl className="grid gap-6 sm:grid-cols-3">
      {headlines.map((item) => (
        <div className="border-border border-l pl-4" key={item.label}>
          <dt className="text-foreground text-sm">{item.label}</dt>
          <dd className="mt-3 font-mono text-5xl text-primary tabular-nums">
            {item.value}
          </dd>
          <dd className="mt-3 text-muted-foreground text-sm">{item.detail}</dd>
        </div>
      ))}
    </dl>
  </StudyFigure>
);

const configurations = [
  { name: 'All-Spark', coordinator: 'Muse Spark 1.3, requested at max', reviewers: 'Spark for reviewers and workers', application: 'Muse Code' },
  { name: 'All-Luna', coordinator: 'GPT-5.6 Luna, max', reviewers: 'Luna max for reviewers and workers', application: 'Codex' },
  { name: 'Mixed', coordinator: 'GPT-6 Astra, medium', reviewers: 'Luna max for reviewers and workers', application: 'Codex' },
  { name: 'All-Astra', coordinator: 'GPT-6 Astra, medium', reviewers: 'Astra medium for reviewers and workers', application: 'Codex' },
] as const;

export const StudyConfigurations = (): ReactNode => (
  <dl className="my-8 grid gap-6 sm:grid-cols-2">
    {configurations.map((item) => (
      <div className="border-border border-t pt-4" key={item.name}>
        <dt className="font-semibold text-foreground">{item.name}</dt>
        <dd className="mt-2 text-foreground text-sm">Coordinator: {item.coordinator}</dd>
        <dd className="mt-1 text-muted-foreground text-sm">{item.reviewers}</dd>
        <dd className="mt-1 font-mono text-muted-foreground text-xs">{item.application}</dd>
      </div>
    ))}
  </dl>
);

export const FindingsMatrix = (): ReactNode => (
  <StudyFigure
    title="Which results were independently recovered?"
    caption="Mixed's loop repair followed exposure to Astra's solution. Luna detected header loss but its repair introduced the transport regression. The last row is a useful test improvement, not a runtime defect. No recovery means none documented in these runs, not proof of inability."
  >
    <div className="space-y-6">
      {findingRows.map((row) => (
        <div className="border-border border-b pb-6 last:border-b-0 last:pb-0" key={row.finding}>
          <p className="mb-3 font-medium text-foreground text-sm">{row.finding}</p>
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {matrixModels.map((model) => (
              <div key={model.key}>
                <dt className="font-mono text-muted-foreground text-xs">{model.label}</dt>
                <dd className="mt-2 text-foreground text-sm">{row.outcomes[model.key]}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  </StudyFigure>
);

const loopStages = [
  { title: 'Problem returned', detail: 'The mutation returns an application-level problem as a successful value.' },
  { title: 'Router invalidated', detail: 'The component applies the transient problem, then refreshes the route.' },
  { title: 'Problem disappears', detail: 'The loader returns a view without the transient problem.' },
  { title: 'Automatic guard resets', detail: 'Another decision starts and returns to the first step.' },
] as const;

export const RequestLoopFigure = (): ReactNode => (
  <StudyFigure
    title="An error path that feeds itself"
    caption="Astra's fix keeps the transient problem while the serialized loader payload is unchanged. A changed context resets the guard; explicit retry remains available."
  >
    <ol className="grid gap-6 sm:grid-cols-2">
      {loopStages.map((stage, index) => (
        <li className="border-border border-l pl-4" key={stage.title}>
          <p className="font-mono text-primary text-sm">0{index + 1}</p>
          <p className="mt-2 font-medium text-foreground">{stage.title}</p>
          <p className="mt-2 text-muted-foreground text-sm">{stage.detail}</p>
        </li>
      ))}
    </ol>
    <p className="mt-6 border-primary border-l-2 pl-4 font-mono text-foreground text-sm">
      04 → 01 → 02 → 03 → 04 …
    </p>
  </StudyFigure>
);

const mutationCases = [
  { implementation: 'greatest(current, requested)', behavior: 'Correct: expiry cannot move backward.', result: 'Pass' },
  { implementation: 'least(current, requested)', behavior: 'Wrong: deliberately substituted operator.', result: 'Still passes' },
  { implementation: 'requested (plain assignment)', behavior: 'Original implementation shape.', result: 'Fails' },
] as const;

export const MockTestFigure = (): ReactNode => (
  <StudyFigure
    title="The mutation that the regression test could not see"
    caption="The mock recognized an SQL-expression object and applied Math.max itself. It detected the old assignment shape while assuming the very operator behavior the test needed to verify."
  >
    <dl className="space-y-5">
      {mutationCases.map((item) => (
        <div className="border-border border-l pl-4" key={item.implementation}>
          <dt className="break-words font-mono text-foreground text-sm">{item.implementation}</dt>
          <dd className="mt-2 font-semibold text-foreground">{item.result}</dd>
          <dd className="mt-1 text-muted-foreground text-sm">{item.behavior}</dd>
        </div>
      ))}
    </dl>
  </StudyFigure>
);

export const ContaminationFigure = (): ReactNode => (
  <StudyFigure
    title="Nine minutes in the mixed review's evidence trail"
    caption="September 7, 2026, UTC. This is an ordered event trace, not a time-proportional chart. It establishes exposure to the other solution, not intent."
  >
    <ol className="space-y-6 border-border border-l pl-6">
      {contaminationEvents.map((event) => (
        <li key={event.time}>
          <p className="font-mono text-primary text-sm tabular-nums">{event.time}</p>
          <p className="mt-1 font-medium text-foreground">{event.action}</p>
          <p className="mt-1 text-muted-foreground text-sm">{event.detail}</p>
        </li>
      ))}
    </ol>
  </StudyFigure>
);
