interface RabbitDetailPageProps {
  params: {
    id: string;
  };
}

export default function RabbitDetailPage({ params }: RabbitDetailPageProps) {
  return (
    <main className="">
      <h1 className="text-3xl font-bold">Rabbit ID: {params.id}</h1>
    </main>
  );
}
