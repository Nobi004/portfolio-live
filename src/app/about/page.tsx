import Link from "next/link";

export default function AboutPage() {
  return (
    <article className="prose-stock">
      <h1>About</h1>
      <p>
        Md. Mahmudun Nobi is an AI engineer in Dhaka, Bangladesh, working on agentic systems,
        applied machine learning, document intelligence, and production software architecture.
      </p>
      <p>
        His background is in electrical and electronic engineering (Faridpur Engineering College,
        as listed on his IEEE publication record). Further background, employment history, and
        credentials will be added here once verified.
      </p>
      <p>
        Peer-reviewed work:{" "}
        <Link href="/research/insulator-fault-detection">
          interpretable fault detection for power line insulators (IEEE ICEESI 2026)
        </Link>
        .
      </p>
      <p>
        Public code: <a href="https://github.com/Nobi004">github.com/Nobi004</a>.
      </p>
    </article>
  );
}
