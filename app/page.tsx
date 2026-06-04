import RabbitCard from "@/components/RabbitCard";
import { getAvailableRabbits } from "@/lib/rabbit-service";

export default async function Home() {
  const rabbits = await getAvailableRabbits();

  return (
    <main className="">
      <h1 className="text-3xl font-bold mb-6">Safe Rabbit Project 🐰</h1>

      <div className="space-y-4">
        {rabbits.map((rabbit) => (
          <RabbitCard key={rabbit.id} rabbit={rabbit} />
        ))}
      </div>
    </main>
  );
}
