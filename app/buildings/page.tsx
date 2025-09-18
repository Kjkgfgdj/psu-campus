import Link from "next/link";

export default function BuildingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Buildings</h1>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <Link href="/buildings/101">Building 101</Link>
        </li>
        <li>
          <Link href="/buildings/104">Building 104</Link>
        </li>
        <li>
          <Link href="/buildings/105">Building 105</Link>
        </li>
      </ul>
    </div>
  );
}


