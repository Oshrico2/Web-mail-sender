import { CircleAlert, Inbox } from "lucide-react";

export default function Empty({ title, text, action, icon: Icon = Inbox, tone }) {
  const Mark = tone === "error" ? CircleAlert : Icon;
  return (
    <div className="empty" role={tone === "error" ? "alert" : undefined}>
      <span className="empty__mark" aria-hidden="true">
        <Mark />
      </span>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </div>
  );
}
