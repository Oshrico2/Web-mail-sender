import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import Empty from "../components/Empty";

export default function NotFoundScreen() {
  return (
    <div className="page">
      <Empty
        icon={Compass}
        title="העמוד לא נמצא"
        text="ייתכן שהקישור ישן או שהעמוד הועבר."
        action={
          <Link to="/" className="btn btn--dark">
            חזרה לדף הבית
          </Link>
        }
      />
    </div>
  );
}
