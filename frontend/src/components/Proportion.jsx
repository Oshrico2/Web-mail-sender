import { number } from "../lib/format";

// Brand-derived series: charcoal, gold, shade and their steps.
const SERIES = ["#2E3033", "#C99A4B", "#8FA3AE", "#7F5A1F", "#5B6066", "#E9C77A", "#3F5966", "#B4532A"];

/** One strip, divided like a row of windows, plus the exact numbers. */
export default function Proportion({ data }) {
  const total = data.reduce((s, d) => s + d.amount, 0);
  return (
    <figure className="proportion">
      <div className="proportion__strip" role="img" aria-label="חלוקת לידים לפי מנהל">
        {data.map((d, i) => (
          <span key={d.name} style={{ flexGrow: d.amount, background: SERIES[i % SERIES.length] }} title={`${d.name}: ${d.amount}`} />
        ))}
      </div>
      <table className="table proportion__table">
        <thead>
          <tr>
            <th scope="col"><span className="th-plain">מנהל</span></th>
            <th scope="col"><span className="th-plain">לידים</span></th>
            <th scope="col"><span className="th-plain">חלק</span></th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={d.name}>
              <td className="cell-strong">
                <i className="proportion__key" style={{ background: SERIES[i % SERIES.length] }} aria-hidden="true" />
                {d.name}
              </td>
              <td className="num">{number(d.amount)}</td>
              <td className="num cell-muted">{total ? Math.round((d.amount / total) * 100) : 0}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
