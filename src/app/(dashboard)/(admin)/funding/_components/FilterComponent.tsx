import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
import { Search, SortAsc, User, Tag, Lock, Activity, Hash, Shield, RotateCcw } from "lucide-react";

interface FilterProps {
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
    sort: "asc" | "desc" | "";
    setSort: Dispatch<SetStateAction<"asc" | "desc" | "">>;
    author: string;
    setAuthor: Dispatch<SetStateAction<string>>;
    categories: string;
    setCategories: Dispatch<SetStateAction<string>>;
    access: "public" | "private" | "";
    setAccess: Dispatch<SetStateAction<"public" | "private" | "">>;
    status: "draft" | "actived" | "paused" | "completed" | "cancelled" | "";
    setStatus: Dispatch<
        SetStateAction<
            "draft" | "actived" | "paused" | "completed" | "cancelled" | ""
        >
    >;
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
                                            author,
                                            setAuthor,
                                            categories,
                                            setCategories,
                                            access,
                                            setAccess,
                                            status,
                                            setStatus,
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
                        <p className="text-sm text-slate-600">Affinez votre recherche de cagnottes</p>
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

            {/* Filtres principaux */}
            <div className="space-y-4">
                {/* Section Recherche et Tri */}
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-emerald-200/40 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                                <Search className="h-3.5 w-3.5" />
                                Recherche
                            </label>
                            <Input
                                placeholder="Rechercher une cagnotte..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-3"
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

                {/* Section Filtres de contenu */}
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-emerald-200/40 shadow-sm">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <Tag className="h-4 w-4 text-[#1C8973]" />
                        Filtres de contenu
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="text-xs font-medium text-slate-600 mb-2 flex items-center gap-2">
                                <User className="h-3.5 w-3.5" />
                                Auteur
                            </label>
                            <Input
                                placeholder="ID de l'auteur"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-slate-600 mb-2 flex items-center gap-2">
                                <Tag className="h-3.5 w-3.5" />
                                Catégories
                            </label>
                            <Input
                                placeholder="cat1, cat2, cat3..."
                                value={categories}
                                onChange={(e) => setCategories(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-slate-600 mb-2 flex items-center gap-2">
                                <Lock className="h-3.5 w-3.5" />
                                Accès
                            </label>
                            <Select value={access} onValueChange={(v) => setAccess(v as any)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Type d'accès" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="public">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                            Public
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="private">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                                            Privé
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Section Statut et Pagination */}
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-emerald-200/40 shadow-sm">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <Activity className="h-4 w-4 text-[#59AD96]" />
                        Statut et pagination
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="text-xs font-medium text-slate-600 mb-2 flex items-center gap-2">
                                <Activity className="h-3.5 w-3.5" />
                                Statut
                            </label>
                            <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Statut de la cagnotte" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                                            Brouillon
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="actived">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                            Active
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="paused">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                                            En pause
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="completed">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                            Complétée
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="cancelled">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                            Annulée
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
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
                                onChange={(e) =>
                                    setPage(e.target.value === "" ? undefined : Number(e.target.value))
                                }
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
                                onChange={(e) =>
                                    setSize(e.target.value === "" ? undefined : Number(e.target.value))
                                }
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
                                type="password"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}