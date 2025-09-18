type BuildingPageProps = {
  params: { id: string };
};

export default function BuildingPage({ params }: BuildingPageProps) {
  return (
    <h1 className="text-2xl font-semibold">Building {decodeURIComponent(params.id)}</h1>
  );
}


