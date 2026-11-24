const pages = [
  ['Original', 'The river', 'See chapter two.'],
  ['Translation', 'Der Fluss', 'Siehe Kapitel zwei.'],
] as const;

export const ManuscriptTransfer = () => (
  <div className="manuscript-transfer">
    {pages.map(([label, title, note]) => (
      <div className="transfer-page" key={label}>
        <span className="folio-label">{label}</span>
        <strong>
          {title}
          <sup>1</sup>
        </strong>
        <div className="type-lines" aria-hidden="true" />
        <small>
          <sup>1</sup> {note}
        </small>
      </div>
    ))}
  </div>
);
