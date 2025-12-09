import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
import { Search, SortAsc, CalendarClock, Activity, Hash, Shield, RotateCcw } from "lucide-react";

interface FilterProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  sort: "asc" | "desc" | "";
  setSort: Dispatch<SetStateAction<"asc" | "desc" | "">>;
  status: "enable" | "disable" | "locked" | "";
  setStatus: Dispatch<SetStateAction<"enable" | "disable" | "locked" | "">>;
  created_gt: string;
  setCreated_gt: Dispatch<SetStateAction<string>>;
  created_lt: string;
  setCreated_lt: Dispatch<SetStateAction<string>>;
  created_gte: string;
  setCreated_gte: Dispatch<SetStateAction<string>>;
  created_lte: string;
  setCreated_lte: Dispatch<SetStateAction<string>>;
  page: number | undefined;
  setPage: Dispatch<SetStateAction<number | undefined>>;
  size: number | undefined;
  setSize: Dispatch<SetStateAction<number | undefined>>;
  authorization: string;
  setAuthorization: Dispatch<SetStateAction<string>>;
  onReset: () => void;
}

export default function FilterComponent({
  search,
  setSearch,
  sort,
  setSort,
  status,
  setStatus,
  created_gt,
  setCreated_gt,
  created_lt,
  setCreated_lt,
  created_gte,
  setCreated_gte,
  created_lte,
  setCreated_lte,
  page,
  setPage,
  size,
  setSize,
  authorization,
  setAuthorization,
  onReset,
}: FilterProps) {
  return (
    <div className="bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-green-50/50 rounded-xl p-6 border border-emerald-200/60 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#1C8973] to-[#59AD96] rounded-lg p-2 shadow-md">
            <Search className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Filtres de recherche</h3>
            <p className="text-sm text-slate-600">Affinez votre recherche de wallets</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={onReset}
          className="gap-2 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Réinitialiser
        </Button>
      </div>

      <div className="space-y-4">
        {/* Recherche et Tri */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-emerald-200/40 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                <Search className="h-3.5 w-3.5" />
                Recherche
              </label>
              <Input
                placeholder="Rechercher un wallet..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                <SortAsc className="h-3.5 w-3.5" />
                Tri
              </label>
              <Select value={sort} onValueChange={(v) => setSort(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Ordre de tri" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Croissant (A → Z)</SelectItem>
                  <SelectItem value="desc">Décroissant (Z → A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Statut et Dates */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-emerald-200/40 shadow-sm">
          <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Activity className="h-4 w-4 text-[#1C8973]" />
            Statut et périodes
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-2 flex items-center gap-2">
                <Activity className="h-3.5 w-3.5" />
                Statut
              </label>
              <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir le statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enable">Activé</SelectItem>
                  <SelectItem value="disable">Désactivé</SelectItem>
                  <SelectItem value="locked">Verrouillé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 mb-2 flex items-center gap-2">
                <CalendarClock className="h-3.5 w-3.5" />
                Créé après (gt)
              </label>
              <Input
                type="datetime-local"
                value={created_gt}
                onChange={(e) => setCreated_gt(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 mb-2 flex items-center gap-2">
                <CalendarClock className="h-3.5 w-3.5" />
                Créé avant (lt)
              </label>
              <Input
                type="datetime-local"
                value={created_lt}
                onChange={(e) => setCreated_lt(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 mb-2 flex items-center gap-2">
                <CalendarClock className="h-3.5 w-3.5" />
                Créé après ou égal (gte)
              </label>
              <Input
                type="datetime-local"
                value={created_gte}
                onChange={(e) => setCreated_gte(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 mb-2 flex items-center gap-2">
                <CalendarClock className="h-3.5 w-3.5" />
                Créé avant ou égal (lte)
              </label>
              <Input
                type="datetime-local"
                value={created_lte}
                onChange={(e) => setCreated_lte(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 mb-2 flex items-center gap-2">
                <Hash className="h-3.5 w-3.5" />
                Page
              </label>
              <Input
                placeholder="N° de page"
                type="number"
                value={page ?? ""}
                onChange={(e) => setPage(e.target.value === "" ? undefined : Number(e.target.value))}
                min="1"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 mb-2 flex items-center gap-2">
                <Hash className="h-3.5 w-3.5" />
                Taille
              </label>
              <Input
                placeholder="Résultats/page"
                type="number"
                value={size ?? ""}
                onChange={(e) => setSize(e.target.value === "" ? undefined : Number(e.target.value))}
                min="1"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 mb-2 flex items-center gap-2">
                <Shield className="h-3.5 w-3.5" />
                Authorization
              </label>
              <Input
                placeholder="Token..."
                value={authorization}
                onChange={(e) => setAuthorization(e.target.value)}
                type="text"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
