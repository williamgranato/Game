
import Header from "@/components/Header";
import { ITEMS } from "@/lib/items";

export default function GameContainer({ user, player, day, hour, season, rank }) {
  return (
    <div className="min-h-screen w-full p-4 md:p-8 bg-black/60">
      <Header user={user} player={player} day={day} hour={hour} season={season} rank={rank}/>
      {/* Aqui você importa e renderiza as sessões como Tabs (Guilda, Mercado, Inventário, etc) */}
    </div>
  );
}
